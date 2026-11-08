import { NextResponse } from 'next/server';
import { decryptTradeInfo, generateTradeSha } from '@/lib/payuni';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import { autoEnrollVipStudent, sendVipCourseWelcomeEmail, normalizeCoursePkgId } from '@/lib/vipEnroll';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_key'
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const TradeInfo = formData.get('TradeInfo') as string;
    const TradeSha = formData.get('TradeSha') as string;

    // Validate Signature (Constant-time comparison to prevent timing side-channel attacks)
    const expectedSha = generateTradeSha(TradeInfo || '');
    const cryptoMod = await import('crypto');
    const expBuf = Buffer.from(expectedSha || '', 'utf8');
    const recBuf = Buffer.from(TradeSha || '', 'utf8');
    if (!TradeInfo || !TradeSha || expBuf.length !== recBuf.length || !cryptoMod.timingSafeEqual(expBuf, recBuf)) {
      console.error('[Security Alert] PayUni signature verification failed');
      return new Response('Signature Verification Failed', { status: 400 });
    }

    // Decrypt TradeInfo
    const decryptedInfo = decryptTradeInfo(TradeInfo);
    
    // Status 1 means success in PayUni (varies by their spec, 1 usually means Success)
    if (decryptedInfo.Status !== '1') {
      console.log('PayUni trade not successful', decryptedInfo);
      return new Response('OK', { status: 200 }); // Still return 200 so PayUni stops retrying
    }

    // 🔒 防重複入帳與冪等性查核 (Idempotency Lock)
    const { isPaymentDuplicate, acquirePaymentLock, releasePaymentLock, markPaymentProcessed } = await import('@/lib/idempotency');
    const tradeKey = String(decryptedInfo.TradeNo || decryptedInfo.MerTradeNo || TradeSha || '').trim();
    const merTradeNo = String(decryptedInfo.MerTradeNo || '').trim();
    const tradeNo = String(decryptedInfo.TradeNo || '').trim();

    if (await isPaymentDuplicate(tradeKey)) {
      console.warn(`[PayUni Idempotency] 交易已於先前成功入帳 (TradeKey: ${tradeKey})，主動攔截重複派發佣金並回傳 200 OK。`);
      return new Response('OK', { status: 200 });
    }

    if (!acquirePaymentLock(tradeKey)) {
      console.warn(`[PayUni Idempotency] 交易正在併發處理中 (In-Flight: ${tradeKey})，防止競態條件回傳 200 OK。`);
      return new Response('OK', { status: 200 });
    }

    // Extract custom Web3 data we sent
    let walletAddress = decryptedInfo.CustomField1;
    const refCode = decryptedInfo.CustomField2;
    const rawCustom3 = String(decryptedInfo.CustomField3 || '');
    const [parsedPkgId, parsedProductType, parsedPriceUsdt, parsedBookId] = rawCustom3.split('|');
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

    // 🔒 實際付款金額校驗：以 PayUni 官方回傳之 TradeAmt (TWD) 折算最高允許 USDT 金額，嚴防篡改 CustomField3 虛報高價方案
    const actualPaidTwd = Number(decryptedInfo.TradeAmt || 0);
    const maxAllowedUsdt = Math.max(1, Math.ceil(actualPaidTwd / 28)); // 給予匯率寬容上限 (約 1 USDT = 28~33 TWD)

    const BUILTIN_PRICES: Record<number, number> = {
      100: 198, 101: 99, 102: 79, 103: 59, 104: 59, 105: 79,
      106: 79, 107: 29, 108: 39, 109: 29, 110: 59,
      9: 99, 25: 79, 30: 59, 35: 59, 40: 79,
      45: 79, 50: 29, 55: 39, 60: 29, 65: 59
    };

    const numPkgId = Number(packageId);
    const requiredMinUsdt = pkgData?.price || BUILTIN_PRICES[numPkgId] || Math.round(actualPaidTwd / 32);

    if (numPkgId >= 9 && actualPaidTwd > 0 && maxAllowedUsdt < requiredMinUsdt * 0.85) {
      console.warn(`[PayUni Security Notice] Paid TWD (${actualPaidTwd}) is lower than list price (${requiredMinUsdt} USDT) for pkg=${numPkgId}, capping commission base to ${maxAllowedUsdt} USDT while allowing student access.`);
    }

    // Fallback for built-in AI Master Courses (100~110) or if CustomField3 explicitly specifies productType
    if (!pkgData) {
      if (BUILTIN_PRICES[numPkgId]) {
        const { COURSE_NAMES, normalizeCoursePkgId } = await import('@/lib/vipEnroll');
        const normId = normalizeCoursePkgId(numPkgId);
        pkgData = {
          id: normId,
          name_zh: COURSE_NAMES[normId] || `AI 實戰教材 #${normId}`,
          price: BUILTIN_PRICES[normId] || Math.min(Number(parsedPriceUsdt) || maxAllowedUsdt, maxAllowedUsdt),
          product_type: 'DIRECT_COURSE',
          course_link: process.env.DEFAULT_COURSE_LINK || 'https://vip.5208.uk/dashboard/'
        };
      } else {
        pkgData = {
          id: numPkgId,
          name_zh: `方案 #${packageId}`,
          price: Math.min(Number(parsedPriceUsdt) || Math.round(actualPaidTwd / 32), maxAllowedUsdt),
          product_type: parsedProductType || 'NFT_REDEEM',
          course_link: process.env.DEFAULT_COURSE_LINK || 'https://nft1314.party/redeem'
        };
      }
    } else if (parsedProductType) {
      pkgData.product_type = parsedProductType;
      if (parsedPriceUsdt && Number(parsedPriceUsdt) > 0) {
        pkgData.price = Math.min(Number(parsedPriceUsdt), maxAllowedUsdt);
      }
    }
    
    const packagePriceUSDT = Math.min(pkgData?.price || 0, maxAllowedUsdt);

    // 2. Process Database updates (Assign NFT / Mark as Paid) & Process Affiliate logic
    // Import dynamically or at the top of file
    const { processAffiliateCommissions } = await import('@/lib/affiliate');
    
    // Process commissions, this also upserts the user with has_purchased: true
    await processAffiliateCommissions(walletAddress, refCode, packagePriceUSDT, pkgData?.product_type);

    // 🔒 成功入帳標記：記錄交易號並寫入冪等性防重複鎖
    await markPaymentProcessed({
      tradeKey,
      source: 'PAYUNI',
      merTradeNo,
      tradeNo,
      amount: Number(decryptedInfo.TradeAmt || 0),
      wallet: walletAddress
    });


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

      let clientEmailHandled = false;
      if (pkgData?.product_type === 'DIRECT_COURSE') {
        try {
          const normPkgId = normalizeCoursePkgId(Number(packageId));
          const enrollResult = await autoEnrollVipStudent(email, normPkgId, tradeKey);
          await sendVipCourseWelcomeEmail({
            email,
            pkgId: normPkgId,
            txnId: tradeKey,
            magicLoginUrl: enrollResult.magic_login_url,
            courseName: pkgData.name_zh,
            priceUsdt: packagePriceUSDT
          });
          clientEmailHandled = true;
        } catch (enrollErr) {
          console.error('[PayUni Callback] Error in VIP auto-enroll:', enrollErr);
        }
      } else if (pkgData?.product_type === 'EBOOK_PURCHASE' || Number(packageId) === 991 || Number(packageId) === 992) {
        try {
          const { settleRealEBookPurchase } = await import('@/lib/ebookSettlement');
          const ebookSettle = await settleRealEBookPurchase({
            bookId: parsedBookId || 'ebook-demo-001',
            amountUsdt: packagePriceUSDT,
            readerEmail: email
          });
          const bookTitle = ebookSettle?.book?.title_zh || pkgData?.name_zh || '精裝雙語電子書';
          const r2Url = ebookSettle?.r2Url || 'https://1.5208.uk/ebooks/ebook-demo-001/master_bilingual.html';
          emailSubject = `📖 【WeiXiang AI】電子書購買成功！《${bookTitle}》專屬防盜版閱讀與下載通行證`;
          emailHtml = `
            <div style="font-family: sans-serif; max-width: 640px; padding: 24px; border: 1px solid #e5e7eb; border-radius: 16px;">
              <h2 style="color: #0f172a; margin-top: 0;">🎉 恭喜您成功解鎖《${bookTitle}》！</h2>
              <p>您的款項（$${packagePriceUSDT} USDT）已確認收訖，系統已完成加盟商 10% 抽佣抵用金倒抵與 25% 聯盟分潤結算，並為您的信箱 <strong>${email}</strong> 開通永久閱讀與下載授權：</p>
              <div style="background: #f8fafc; padding: 18px; border-radius: 12px; margin: 18px 0; border: 1px solid #cbd5e1;">
                <p style="margin: 0 0 12px; font-weight: bold; color: #1e293b;">📥 一鍵進入閱讀與下載精裝 PDF：</p>
                <p style="margin: 8px 0;"><a href="${r2Url}" style="display:inline-block; background:#10b981; color:#ffffff; text-decoration:none; font-weight:bold; padding:10px 18px; border-radius:8px;">📖 開啟專屬 R2 防盜版雙語閱讀器</a></p>
                <p style="margin: 8px 0;"><a href="${siteUrl}/ebook-store?book=${encodeURIComponent(parsedBookId || 'ebook-demo-001')}" style="display:inline-block; background:#4f46e5; color:#ffffff; text-decoration:none; font-weight:bold; padding:10px 18px; border-radius:8px;">📚 前往 VIP 讀者書櫃下載浮水印 PDF</a></p>
              </div>
              <p style="font-size: 13px; color: #64748b;">微享 AI-ATM 全球知識自動販賣機 敬上</p>
            </div>
          `;
        } catch (ebErr) {
          console.error('[PayUni Callback] Error in EBook settlement:', ebErr);
        }
      } else if (pkgData?.product_type === 'SPONSOR') {
        try {
          const { activateOrExtendSponsorAdAccount } = await import('@/lib/adNetwork');
          const adRes = await activateOrExtendSponsorAdAccount({
            email,
            paidAmountUsdt: packagePriceUSDT,
            walletAddress,
            adminNote: `PayUni 斗內贊助 ($${packagePriceUSDT} USDT)`,
            sendWelcomeEmail: true
          });
          if (adRes.activated) {
            clientEmailHandled = true;
          }
        } catch (adErr) {
          console.error('[PayUni Callback] AdNetwork activation error:', adErr);
        }
        emailSubject = "💖 【WeiXiang AI】感謝您的溫暖斗內贊助！";
        emailHtml = `
          <h2>親愛的贊助者，衷心感謝您對微享 AI 團隊的支持與贊助！</h2>
          <p>您的贊助款項（${pkgData.name_zh || '斗內贊助方案'}）已確認收訖，並已 100% 計入您個人的級差升等累積業績。</p>
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

      if (!clientEmailHandled) {
        const mailToClient = {
          from: `"WeiXiang AI" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: emailSubject,
          html: emailHtml
        };
        await transporter.sendMail(mailToClient);
      }

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
        await transporter.sendMail(mailToAdmin);
      } catch (e) {
        console.error('Callback admin email failed', e);
      }
    }

    // PayUni expects a 200 OK response with specific text, typically empty or JSON
    releasePaymentLock(tradeKey);
    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('PayUni Callback Error:', error);
    try {
      const { releasePaymentLock } = await import('@/lib/idempotency');
      const formData = await req.clone().formData().catch(() => null);
      if (formData) {
        const tradeInfo = formData.get('TradeInfo') as string;
        if (tradeInfo) {
          const { decryptTradeInfo } = await import('@/lib/payuni');
          const dec = decryptTradeInfo(tradeInfo);
          const k = String(dec?.TradeNo || dec?.MerTradeNo || '').trim();
          if (k) releasePaymentLock(k);
        }
      }
    } catch {}
    return new Response('Server Error', { status: 500 });
  }
}
