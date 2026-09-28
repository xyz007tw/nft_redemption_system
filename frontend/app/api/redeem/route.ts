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
    
    if (userData && userData.last_purchased_package) {
       const { data: pkgData } = await supabase
         .from('packages')
         .select('product_type, course_link')
         .eq('id', Number(userData.last_purchased_package))
         .single();
         
       if (pkgData) {
         productType = pkgData.product_type;
         courseLink = pkgData.course_link;
       }
    }

    // Process Affiliate logic and Database Update
    const referrerAddress = await processAffiliateCommissions(walletAddress, refCode, NFT_PRICE);

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
        emailSubject = "🎓 【WeiXiang AI】您的線上知識課程已兌換開通！";
        emailHtml = `
          <h2>親愛的學員，恭喜您成功兌換線上課程！</h2>
          <p>您的 Web3 錢包簽署已確認完畢。請點擊下方連結下載/觀看您的專屬課程教材：</p>
          <br/>
          <a href="${courseLink || '#'}" style="display:inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">📥 立即前往上課</a>
          <br/><br/>
          <p>（此連結為您的專屬買斷內容，請妥善保存。）</p>
          <p>微享 AI 團隊 敬上</p>
        `;
      }

      const mailToClient = {
        from: `"WeiXiang AI" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: emailSubject,
        html: emailHtml
      };

      // 信件 2: 給總指揮官的通知信
      const mailToAdmin = {
        from: `"WeiXiang 系統通知" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: "⚠️ 【新客到】有客戶成功兌換了 AI 憑證！",
        html: `
          <h2>總指揮官，您有新的訂單需要處理！</h2>
          <p>有一位客戶剛剛在首頁成功兌換了 AI 生產力憑證。</p>
          <ul>
            <li><strong>客戶錢包地址：</strong>${walletAddress}</li>
            <li><strong>客戶聯絡信箱：</strong>${email}</li>
            <li><strong>推薦人代碼 (ref)：</strong>${refCode || '無'}</li>
          </ul>
          <p>系統已經自動發送「設定需求表單」給客戶的信箱了。</p>
          <p>請留意您的信箱，等待客戶回覆後，即可前往主機建立 <code>V2_Workspace</code> 資料夾進行配置。</p>
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
