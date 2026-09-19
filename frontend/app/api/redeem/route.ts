import { NextResponse } from 'next/server';
import { verifyMessage } from 'viem';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_key' // Use service role for backend logic
);

const NFT_PRICE = 99; // USDT

// 極差獎金門檻設定 (未來可改為從系統設定讀取)
const TIERS = [
  { threshold: 15000, rate: 0.10 }, // 10%
  { threshold: 6000, rate: 0.06 },  // 6%
  { threshold: 600, rate: 0.03 },   // 3%
  { threshold: 0, rate: 0.0 }       // 0%
];

function getCommissionRate(totalSales: number) {
  for (const tier of TIERS) {
    if (totalSales >= tier.threshold) return tier.rate;
  }
  return 0;
}

export async function POST(req: Request) {
  try {
    const { walletAddress, signature, message, email, refCode } = await req.json();

    if (!walletAddress) {
      return NextResponse.json({ error: 'Missing wallet address' }, { status: 400 });
    }

    // 尋找推薦人完整的錢包地址
    let matchedReferrer = null;
    if (refCode) {
      const { data: potentialReferrer } = await supabase
        .from('users')
        .select('wallet_address')
        .ilike('wallet_address', `0x${refCode}%`)
        .single();
        
      if (potentialReferrer) {
        matchedReferrer = potentialReferrer.wallet_address;
      }
    }

    // 1. 確認並更新買家的帳號狀態為 ACTIVE
    // 只有當新會員第一次建立時，才會寫入 referrer_address
    const { data: existingUser } = await supabase.from('users').select('referrer_address').eq('wallet_address', walletAddress).single();
    
    const finalReferrer = existingUser?.referrer_address || matchedReferrer;

    const { data: user, error: userError } = await supabase
      .from('users')
      .upsert({ 
        wallet_address: walletAddress, 
        status: 'ACTIVE',
        ...(existingUser ? {} : { referrer_address: finalReferrer })
      }, { onConflict: 'wallet_address' })
      .select()
      .single();

    if (userError) throw userError;

    const referrerAddress = user.referrer_address;

    // 如果沒有推薦人，就不發放獎金 (或者可以設計歸屬給總部)
    if (!referrerAddress) {
      return NextResponse.json({ success: true, message: 'Activated without referrer' });
    }

    // 2. 處理獎金與極差計算
    let currentReferrer = referrerAddress;
    let distributedRate = 0; // 已經發放出去的 % 數，用來計算極差

    while (currentReferrer && distributedRate < TIERS[0].rate) {
      // 取得上線的資料
      const { data: refUser } = await supabase
        .from('users')
        .select('referrer_address, total_sales')
        .eq('wallet_address', currentReferrer)
        .single();

      if (!refUser) break;

      const myRate = getCommissionRate(refUser.total_sales);
      const diffRate = myRate - distributedRate;

      // 如果有極差利潤可以拿
      if (diffRate > 0) {
        const commissionAmount = NFT_PRICE * diffRate;
        const commissionType = distributedRate === 0 ? 'DIRECT' : 'DIFFERENTIAL';

        // 寫入獎金明細
        await supabase.from('commissions').insert({
          wallet_address: currentReferrer,
          from_buyer: walletAddress,
          amount: commissionAmount,
          commission_type: commissionType
        });

        // 將業績加給最原始的直推人 (如果是極差上線，通常不累加業績，只抽 % 數)
        if (commissionType === 'DIRECT') {
          await supabase
            .from('users')
            .update({ total_sales: refUser.total_sales + NFT_PRICE })
            .eq('wallet_address', currentReferrer);
        }

        distributedRate = myRate; // 更新已發放的最高 % 數
      }

      // 繼續往上找推薦人
      currentReferrer = refUser.referrer_address;
    }

    // ==========================================
    // 3. 發送通知信件 (Nodemailer)
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
      const mailToClient = {
        from: `"WeiXiang AI" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "🎉 【WeiXiang AI】您的生產力憑證已成功兌換！請回覆系統設定資料",
        html: `
          <h2>親愛的節點投資人，恭喜您成功兌換 AI 生產力憑證！</h2>
          <p>您的 Web3 錢包：${walletAddress}</p>
          <p>為了讓我們的 AI 自來客矩陣能盡快為您服務，請您直接「回覆此信件」並提供以下資訊：</p>
          <ul>
            <li><strong>1. 您的品牌 / 專案名稱：</strong>（例如：Web3 羊毛黨教學）</li>
            <li><strong>2. 您希望 AI 幫您導流的目標網址 (Target URLs)：</strong>（請提供 1~3 個網址）</li>
            <li><strong>3. 您的社群平台授權碼 (Buffer Access Token)：</strong>（若不清楚如何取得，請告知我們，將有專人協助）</li>
            <li><strong>4. 聯絡人姓名與其他聯絡方式 (Line/Telegram)：</strong></li>
          </ul>
          <p>收到您的回覆後，系統工程師將於 24 小時內為您建置專屬的產線資料夾，啟動您的專屬流量矩陣！</p>
          <br/>
          <p>WeiXiang AI 總指揮中心 敬上</p>
        `,
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
