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
    const walletAddress = decryptedInfo.CustomField1;
    const refCode = decryptedInfo.CustomField2;
    const packageId = decryptedInfo.CustomField3;
    const email = decryptedInfo.BuyerMail; // PayUni standard field

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
    await processAffiliateCommissions(walletAddress, refCode, packagePriceUSDT);

    // Update the user's last purchased package specifically for fiat tracking
    await supabase.from('users').update({
      last_purchased_package: packageId,
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

            let emailSubject = "🎉 【WeiXiang AI】信用卡付款成功！請查看系統設定資訊";
      let emailHtml = `
          <h2>親愛的節點投資人，恭喜您成功購買 AI 生產力憑證！</h2>
          <p>您的款項已確認完畢。系統已在區塊鏈上為您綁定了節點權限。</p>
          <p>請前往我們的網站 <strong>兌換區 (Redeem)</strong> 綁定您的 Web3 錢包，即可正式開通 AI 自動來客矩陣。</p>
          <p>感謝您的參與，讓我們一起掌握未來的定價權！</p>
          <br>
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
