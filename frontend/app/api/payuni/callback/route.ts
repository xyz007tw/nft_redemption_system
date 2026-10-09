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
    const packageId = decryptedInfo.CustomField3;
    const email = decryptedInfo.BuyerMail; // PayUni standard field

    if (!walletAddress || !walletAddress.startsWith('0x')) {
      const crypto = await import('crypto');
      const hash = crypto.createHash('sha256').update((email || `buyer_${Date.now()}`).toLowerCase().trim()).digest('hex');
      walletAddress = '0x' + hash.substring(0, 40);
    }

    // 1. Fetch package price in USDT
    const { data: pkgData } = await supabase
      .from('packages')
      .select('price, product_type, course_link')
      .eq('id', Number(packageId))
      .single();
    
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
        emailSubject = "🎓 【WeiXiang AI】您的線上知識課程已開通！";
        emailHtml = `
          <h2>親愛的學員，恭喜您成功購買線上課程！</h2>
          <p>您的付款已確認完畢。請點擊下方連結下載/觀看您的專屬課程教材：</p>
          <br/>
          <a href="${pkgData.course_link || '#'}" style="display:inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">📥 立即前往上課</a>
          <br/><br/>
          <p>（此連結為您的專屬課程教材，請妥善保存。）</p>
          <p>微享 AI 團隊 敬上</p>
        `;
      }

      const mailToClient = {
        from: `"WeiXiang AI" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: emailSubject,
        html: emailHtml
      };

      const mailToAdmin = {
        from: `"WeiXiang 系統通知" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: "💰 【新客到】有客戶透過統一金流刷卡成功！",
        html: `
          <h2>總指揮官，您有新的信用卡訂單！</h2>
          <p>客戶錢包：${walletAddress}</p>
          <p>客戶信箱：${email}</p>
          <p>推薦人：${refCode || '無'}</p>
          <p>金額 (TWD)：${decryptedInfo.TradeAmt}</p>
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
