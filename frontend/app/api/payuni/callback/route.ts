import { NextResponse } from 'next/server';
import { decryptTradeInfo, generateTradeSha } from '@/lib/payuni';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_key'
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const TradeInfo = formData.get('TradeInfo') as string;
    const TradeSha = formData.get('TradeSha') as string;

    // Validate Signature
    const expectedSha = generateTradeSha(TradeInfo);
    if (expectedSha !== TradeSha) {
      console.error('PayUni signature verification failed');
      return new Response('Signature Verification Failed', { status: 400 });
    }

    // Decrypt TradeInfo
    const decryptedInfo = decryptTradeInfo(TradeInfo);
    
    // Status 1 means success in PayUni (varies by their spec, 1 usually means Success)
    if (decryptedInfo.Status !== '1') {
      console.log('PayUni trade not successful', decryptedInfo);
      return new Response('OK', { status: 200 }); // Still return 200 so PayUni stops retrying
    }

    // Extract custom Web3 data we sent
    let walletAddress = decryptedInfo.CustomField1;
    const refCode = decryptedInfo.CustomField2;
    const rawCustom3 = String(decryptedInfo.CustomField3 || '');
    const [parsedPkgId, parsedProductType, parsedPriceUsdt] = rawCustom3.split('|');
    const packageId = parsedPkgId || rawCustom3;
    const email = decryptedInfo.BuyerMail; // PayUni standard field

    if (!walletAddress || !walletAddress.startsWith('0x')) {
      const crypto = await import('crypto');
      const hash = crypto.createHash('sha256').update((email || `buyer_${Date.now()}`).toLowerCase().trim()).digest('hex');
      walletAddress = '0x' + hash.substring(0, 40);
    }

    // 1. Fetch package price in USDT & unpack metadata
    const { unpackPackageRow } = await import('@/lib/packageMeta');
    const { data: rawPkgData } = await supabase
      .from('packages')
      .select('*')
      .eq('id', Number(packageId))
      .single();
    let pkgData = unpackPackageRow(rawPkgData);

    // Fallback for built-in AI Master Courses (101 / 102) or if CustomField3 explicitly specifies productType
    if (!pkgData) {
      if (Number(packageId) === 101) {
        pkgData = {
          id: 101,
          name_zh: '教材 01｜BIGMONEY.AI・AI頂配實戰全套教材（贈微享NFT 2枚）',
          price: Number(parsedPriceUsdt) || 198,
          product_type: 'DIRECT_COURSE',
          course_link: process.env.DEFAULT_COURSE_LINK || 'https://nft1314.party/redeem'
        };
      } else if (Number(packageId) === 102) {
        pkgData = {
          id: 102,
          name_zh: '教材 02｜SaaS-AVME 3.0 雙引擎 AI 短影音自動化大師手冊',
          price: Number(parsedPriceUsdt) || 99,
          product_type: 'DIRECT_COURSE',
          course_link: process.env.DEFAULT_COURSE_LINK || 'https://nft1314.party/redeem'
        };
      } else {
        pkgData = {
          id: Number(packageId),
          name_zh: `方案 #${packageId}`,
          price: Number(parsedPriceUsdt) || Math.round(Number(decryptedInfo.TradeAmt || 0) / 32),
          product_type: parsedProductType || 'NFT_REDEEM',
          course_link: process.env.DEFAULT_COURSE_LINK || 'https://nft1314.party/redeem'
        };
      }
    } else if (parsedProductType) {
      pkgData.product_type = parsedProductType;
      if (parsedPriceUsdt && Number(parsedPriceUsdt) > 0) {
        pkgData.price = Number(parsedPriceUsdt);
      }
    }
    
    const packagePriceUSDT = pkgData?.price || 0;

    // 2. Process Database updates (Assign NFT / Mark as Paid) & Process Affiliate logic
    // Import dynamically or at the top of file
    const { processAffiliateCommissions } = await import('@/lib/affiliate');
    
    // Process commissions, this also upserts the user with has_purchased: true
    await processAffiliateCommissions(walletAddress, refCode, packagePriceUSDT, pkgData?.product_type);


    // Update the user's last purchased package specifically for fiat tracking
    await supabase.from('users').update({
      last_purchased_package: packageId,
      email: email || null
    }).eq('wallet_address', walletAddress);

    // 2. Send emails
    if (email && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nft1314.party';
      let emailSubject = "🎉 【WeiXiang AI】信用卡付款成功！請查看系統開通與後台登入資訊";
      let emailHtml = `
          <h2>親愛的投資人/贊助者，恭喜您成功購買 AI 生產力憑證！</h2>
          <p>您的款項已確認完畢。系統已為您開通專屬會員權限與 AI 服務配額。</p>
          <br/>
          <div style="background:#f4f4f5; padding: 16px; border-radius: 8px;">
            <h3>📊 【如何進入會員數據後台？】</h3>
            <p>請前往 <a href="${siteUrl}/dashboard" style="color:#2563eb; font-weight:bold;">會員中心 (Dashboard)</a>，輸入您的信箱 <strong>${email}</strong> 即可免密碼快速登入，領取專屬推廣碼並查看 25% 業務分潤！</p>
            <br/>
            <h3>🎟️ 【如何啟用 AI 來客矩陣？】</h3>
            <p>請前往 <a href="${siteUrl}/redeem" style="color:#2563eb; font-weight:bold;">VIP 兌換專區 (Redeem)</a> 開通您的專屬 AI 影音與 SEO 文章產線（每枚享 180 天服務）。</p>
          </div>
          <br>
          <p>感謝您的參與，讓我們一起掌握未來的定價權！</p>
          <p>微享 AI 團隊 敬上</p>
      `;

      if (pkgData?.product_type === 'DIRECT_COURSE') {
        emailSubject = "🎓 【WeiXiang AI】您的 AI頂配教材 已開通！";
        emailHtml = `
          <h2>親愛的學員，恭喜您成功購買「${pkgData.name_zh || 'AI頂配教材'}」！</h2>
          <p>您的付款已確認完畢。請點擊下方連結下載/觀看您的專屬 AI頂配教材：</p>
          <br/>
          <a href="${pkgData.course_link || '#'}" style="display:inline-block; padding: 12px 24px; background: #10b981; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">📥 立即下載 / 觀看 AI頂配教材</a>
          <br/><br/>
          <p>（此連結為您的專屬教材，您亦可隨時回到首頁「AI頂配教材導覽專區」輸入購買信箱一鍵轉發電郵。）</p>
          <p>微享 AI 團隊 敬上</p>
        `;
      } else if (pkgData?.product_type === 'SPONSOR') {
        emailSubject = "💖 【WeiXiang AI】感謝您的溫暖斗內贊助！";
        emailHtml = `
          <h2>親愛的贊助者，衷心感謝您對微享 AI 團隊的支持與贊助！</h2>
          <p>您的贊助款項（${pkgData.name_zh || '斗內贊助方案'}）已確認收訖。</p>
          <p>因為有您的支持，我們將持續研發更強大的 AI 自動化工具回饋社群！</p>
          <br/>
          <p>微享 AI 團隊 敬上</p>
        `;
      }

      const orderCategoryLabel =
        pkgData?.product_type === 'DIRECT_COURSE'
          ? '🎓 AI頂配教材 (納入 25% 推廣分潤)'
          : pkgData?.product_type === 'SPONSOR'
          ? '💖 斗內贊助 (純贊助・不計入分潤)'
          : '🚀 眾籌憑證方案 (納入 25% 推廣分潤)';

      const orderSubjectPrefix =
        pkgData?.product_type === 'DIRECT_COURSE'
          ? '🎓 【新訂單・AI頂配教材】'
          : pkgData?.product_type === 'SPONSOR'
          ? '💖 【新訂單・斗內贊助】'
          : '🚀 【新訂單・眾籌憑證】';

      const mailToClient = {
        from: `"WeiXiang AI" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: emailSubject,
        html: emailHtml
      };

      const adminToList = Array.from(
        new Set(['xyz007tw@gmail.com', process.env.ADMIN_EMAIL, process.env.EMAIL_USER].filter(Boolean))
      ).join(', ');

      const mailToAdmin = {
        from: `"WeiXiang 系統通知" <${process.env.EMAIL_USER}>`,
        to: adminToList,
        cc: 'qqww0614@gmail.com',
        subject: `${orderSubjectPrefix}${pkgData?.name_zh || `方案 #${packageId}`} (刷卡成功 NT$${decryptedInfo.TradeAmt})`,
        html: `
          <div style="font-family: sans-serif; max-width: 640px; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 style="color: #111827; margin-top: 0;">${orderSubjectPrefix}總指揮官，您有新的統一金流訂單！</h2>
            <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #6b7280; width: 140px;">訂單類型</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #111827;">${orderCategoryLabel}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">購買方案名稱</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #2563eb;">${pkgData?.name_zh || `Package #${packageId}`}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">實付金額 (TWD)</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #059669;">NT$ ${decryptedInfo.TradeAmt} (約 $${packagePriceUSDT} USDT)</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">客戶聯絡信箱</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${email || '未填寫'}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">綁定錢包地址</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-family: monospace;">${walletAddress}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">推薦人代碼 (ref)</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">${refCode || '無 (自然流量)'}</td>
              </tr>
            </table>
            <p style="color: #6b7280; font-size: 12px; margin-bottom: 0;">此通知已自動寄送至 xyz007tw@gmail.com 並副本 (CC) 至 qqww0614@gmail.com。</p>
          </div>
        `,
      };

      try {
        await transporter.sendMail(mailToClient);
        await transporter.sendMail(mailToAdmin);
      } catch (e) {
        console.error('Callback email failed', e);
      }
    }

    // PayUni expects a 200 OK response with specific text, typically empty or JSON
    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('PayUni Callback Error:', error);
    return new Response('Server Error', { status: 500 });
  }
}
