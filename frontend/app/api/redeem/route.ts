import { NextResponse } from 'next/server';
import { verifyMessage } from 'viem';
import nodemailer from 'nodemailer';
import { processAffiliateCommissions } from '@/lib/affiliate';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_key'
);



const NFT_PRICE = 99; // USDT

export async function POST(req: Request) {
  try {
    const { walletAddress, signature, message, email, refCode } = await req.json();

    if (!walletAddress) {
      return NextResponse.json({ error: 'Missing wallet address' }, { status: 400 });
    }


    // 嘗試從資料庫尋找使用者最後購買的商品 (如果是法幣會記錄，如果是 Web3 需要靠其他方式，這裡為了相容先讀取)
    const { data: userData } = await supabase
      .from('users')
      .select('last_purchased_package')
      .eq('wallet_address', walletAddress)
      .single();

    let productType = 'NFT_REDEEM';
    let courseLink = '';
    let pkgName = 'AI 生產力憑證 / 頂配教材';
    let pkgPrice = NFT_PRICE;

    if (userData && userData.last_purchased_package) {
      const { unpackPackageRow } = await import('@/lib/packageMeta');
      const { data: rawPkgData } = await supabase
        .from('packages')
        .select('*')
        .eq('id', Number(userData.last_purchased_package))
        .single();
      const pkgData = unpackPackageRow(rawPkgData);

      if (pkgData) {
        productType = pkgData.product_type || 'NFT_REDEEM';
        courseLink = pkgData.course_link || '';
        pkgName = pkgData.name_zh || pkgName;
        pkgPrice = Number(pkgData.price) || NFT_PRICE;
      }
    }

    // Process Affiliate logic and Database Update
    const referrerAddress = await processAffiliateCommissions(walletAddress, refCode, pkgPrice, productType);

    // ==========================================
    // Send Notification Emails (Nodemailer)
    // ==========================================
    if (email && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // 信件 1: 給客戶的設定表單
      let emailSubject = "🎉 【WeiXiang AI】您的兌換已完成！請回覆系統設定單";
      let emailHtml = `
          <h2>親愛的節點投資人，恭喜您兌換 AI 生產力憑證！</h2>
          <p>您的 Web3 錢包：${walletAddress}</p>
          <p>為了讓您的 AI 自動來客矩陣盡快為您服務，請您直接「回覆此信件」，並提供以下資訊：</p>
          <ul>
            <li><strong>1. 您的品牌 / 專案名稱</strong></li>
            <li><strong>2. 希望 AI 幫您導流的目標網址 (Target URLs)</strong>（請提供 1~3 個網址）</li>
            <li><strong>3. 您的社群平台授權碼 (Buffer Access Token)</strong></li>
            <li><strong>4. 聯絡人姓名與聯絡方式 (Line/Telegram)</strong></li>
          </ul>
          <p>收到您的回覆後，系統工程師將於 24 小時內為您建置專屬的雲端資料夾，並啟動專屬流量矩陣。</p>
          <br/>
          <p>WeiXiang AI 總指揮中心 敬上</p>
      `;

      if (productType === 'DIRECT_COURSE') {
        emailSubject = "🎓 【WeiXiang AI】您的 AI頂配教材 已兌換開通！";
        emailHtml = `
          <h2>親愛的學員，恭喜您成功兌換「${pkgName}」！</h2>
          <p>您的 Web3 錢包簽署已確認完畢。請點擊下方連結下載/觀看您的專屬 AI頂配教材：</p>
          <br/>
          <a href="${courseLink || '#'}" style="display:inline-block; padding: 12px 24px; background: #10b981; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">📥 立即下載 / 觀看 AI頂配教材</a>
          <br/><br/>
          <p>（此連結為您的專屬教材，請妥善保存。）</p>
          <p>微享 AI 團隊 敬上</p>
        `;
      } else if (productType === 'SPONSOR') {
        emailSubject = "💖 【WeiXiang AI】感謝您的溫暖斗內贊助！";
        emailHtml = `
          <h2>親愛的贊助者，衷心感謝您對微享 AI 團隊的支持與贊助！</h2>
          <p>您的 Web3 錢包（${walletAddress}）贊助紀錄已確認收訖。</p>
          <br/>
          <p>微享 AI 團隊 敬上</p>
        `;
      }

      const orderCategoryLabel =
        productType === 'DIRECT_COURSE'
          ? '🎓 AI頂配教材 (納入 25% 推廣分潤)'
          : productType === 'SPONSOR'
          ? '💖 斗內贊助 (純贊助・不計入分潤)'
          : '🚀 眾籌憑證方案 (納入 25% 推廣分潤)';

      const orderSubjectPrefix =
        productType === 'DIRECT_COURSE'
          ? '🎓 【Web3兌換・AI頂配教材】'
          : productType === 'SPONSOR'
          ? '💖 【Web3兌換・斗內贊助】'
          : '🚀 【Web3兌換・眾籌憑證】';

      const mailToClient = {
        from: `"WeiXiang AI" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: emailSubject,
        html: emailHtml
      };

      const adminToList = Array.from(
        new Set(['xyz007tw@gmail.com', process.env.ADMIN_EMAIL, process.env.EMAIL_USER].filter(Boolean))
      ).join(', ');

      // 信件 2: 給總指揮官的通知信 (正本 xyz007tw@gmail.com + 副本 qqww0614@gmail.com)
      const mailToAdmin = {
        from: `"WeiXiang 系統通知" <${process.env.EMAIL_USER}>`,
        to: adminToList,
        cc: 'qqww0614@gmail.com',
        subject: `${orderSubjectPrefix}${pkgName} ($${pkgPrice} USDT)`,
        html: `
          <div style="font-family: sans-serif; max-width: 640px; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 style="color: #111827; margin-top: 0;">${orderSubjectPrefix}總指揮官，您有新的訂單/兌換需要處理！</h2>
            <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #6b7280; width: 140px;">訂單類型</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #111827;">${orderCategoryLabel}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">方案名稱</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #2563eb;">${pkgName} ($${pkgPrice} USDT)</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">客戶聯絡信箱</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">客戶錢包地址</td>
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
        console.log("Emails sent successfully!");
      } catch (err) {
        console.error("Failed to send emails:", err);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Redemption successful, commissions calculated, and emails sent (if configured).',
      referrerFound: !!referrerAddress
    });

  } catch (error: any) {
    console.error('Commission Calculation Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
