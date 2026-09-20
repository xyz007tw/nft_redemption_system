import { NextResponse } from 'next/server';
import { decryptTradeInfo, generateTradeSha } from '@/lib/payuni';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
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

    // 1. Process Database updates (Assign NFT / Mark as Paid)
    // Update or insert user with a purchased flag
    await supabase.from('users').upsert({
      wallet_address: walletAddress,
      // For Web2 payments, we flag them as having purchased the package in our DB
      has_purchased: true,
      last_purchased_package: packageId,
    }, { onConflict: 'wallet_address' });

    // 2. Send emails
    if (email && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailToClient = {
        from: `"WeiXiang AI" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "🎉 【WeiXiang AI】信用卡付款成功！請回覆系統設定資料",
        html: `
          <h2>親愛的節點投資人，恭喜您成功購買 AI 生產力憑證！</h2>
          <p>您的 Web3 錢包：${walletAddress}</p>
          <p>請您直接「回覆此信件」並提供您的專案網址與聯絡資訊，系統工程師將於 24 小時內為您建置專屬的產線資料夾！</p>
        `,
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
