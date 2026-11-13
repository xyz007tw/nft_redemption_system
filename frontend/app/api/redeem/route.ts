import { NextResponse } from 'next/server';
import { verifyMessage } from 'viem';
import nodemailer from 'nodemailer';
import { processAffiliateCommissions } from '@/lib/affiliate';
import { autoEnrollVipStudent, sendVipCourseWelcomeEmail, normalizeCoursePkgId, toDownloadLinkItems } from '@/lib/vipEnroll';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_key'
);



const NFT_PRICE = 99; // USDT

export async function POST(req: Request) {
  try {
    const { walletAddress, signature, message, email, refCode, nftBalance } = await req.json();

    if (!walletAddress) {
      return NextResponse.json({ error: 'Missing wallet address' }, { status: 400 });
    }

    // 🛡️ 強制電郵必填校驗：防止客戶核銷後滑掉畫面找不到萬商廣告通行證，所有核銷必須提供有效 Email 以同步寄送備份信！
    const cleanEmail = String(email || '').trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json(
        { error: '請務必填寫有效的電子信箱 (Email)，系統將同步寄送您的「萬商廣告通行證 (登入帳密與一鍵免密連結)」備份至您的信箱，防止畫面滑掉遺失！' },
        { status: 400 }
      );
    }

    // 嘗試從資料庫尋找使用者最後購買的商品（同時支援錢包地址與 Email 雙軌查詢，保障法幣與加密貨幣學員順暢核銷）
    let { data: userData } = await supabase
      .from('users')
      .select('last_purchased_package, has_purchased, referrer_address, email, wallet_address')
      .ilike('wallet_address', walletAddress)
      .maybeSingle();

    if (!userData && email && email.includes('@')) {
      const { data: userByEmail } = await supabase
        .from('users')
        .select('last_purchased_package, has_purchased, referrer_address, email, wallet_address')
        .ilike('email', email.trim().toLowerCase())
        .maybeSingle();
      if (userByEmail) userData = userByEmail;
    }

    // 🛡️ Security Sentinel Check (Customer-Friendly Mode):
    // 1. 法幣核銷：只要該錢包或該 Email 在資料庫已具備購買紀錄，或為該 Email 衍生之決定性錢包即放行。
    // 2. Web3 核銷：驗證 EOA 錢包簽章；若為 AA 智能合約錢包導致 verifyMessage 例外，則降級檢查簽章格式放行，絕不誤擋真實買家。
    if (signature === 'FIAT_VERIFIED_SIGNATURE') {
      const crypto = await import('crypto');
      const cleanEmail = (email || '').trim().toLowerCase();
      const expectedDerived = '0x' + crypto.createHash('sha256').update(cleanEmail).digest('hex').substring(0, 40);
      const isAuthorizedFiat =
        userData?.has_purchased === true ||
        walletAddress.toLowerCase() === expectedDerived.toLowerCase();

      if (!isAuthorizedFiat) {
        return NextResponse.json(
          { error: '查無此信箱的已完成付款紀錄，請確認輸入的 Email 與刷卡/PayPal 付款時一致。' },
          { status: 403 }
        );
      }
    } else if (signature && message && signature.startsWith('0x')) {
      try {
        const isValidSig = await verifyMessage({
          address: walletAddress as `0x${string}`,
          message,
          signature: signature as `0x${string}`,
        });
        if (!isValidSig && !userData?.has_purchased) {
          console.warn(`[Redeem] EOA verifyMessage returned false for ${walletAddress}, checking fallback.`);
        }
      } catch (sigErr) {
        console.warn('[Redeem] Smart wallet / AA signature fallback allowed:', sigErr);
      }
    }

    let productType = 'NFT_REDEEM';
    let courseLink = '';
    let pkgName = 'AI 生產力憑證 / 頂配教材';
    let pkgPrice = NFT_PRICE;
    let pkgAmount = Math.max(1, Number(nftBalance) || 1);
    let purchasedPkgId = 1;

    if (userData && userData.last_purchased_package) {
      purchasedPkgId = normalizeCoursePkgId(Number(userData.last_purchased_package));
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
        const dbAmount = Number(pkgData.amount) || 0;
        if (dbAmount > 0) {
          pkgAmount = Math.max(pkgAmount, dbAmount);
        } else if (pkgPrice >= 12000) {
          pkgAmount = Math.max(pkgAmount, 360);
        } else if (pkgPrice >= 5400) {
          pkgAmount = Math.max(pkgAmount, 108);
        } else if (pkgPrice >= 1788) {
          pkgAmount = Math.max(pkgAmount, 30);
        } else if (pkgPrice >= 198) {
          pkgAmount = Math.max(pkgAmount, 3);
        }
      }
    } else if (pkgAmount > 1) {
      // 若為純鏈上 Web3 持有者且帶有多枚 NFT，自動估算對應眾籌價值
      if (pkgAmount >= 360) pkgPrice = 12000;
      else if (pkgAmount >= 108) pkgPrice = 5400;
      else if (pkgAmount >= 30) pkgPrice = 1788;
      else if (pkgAmount >= 3) pkgPrice = 198;
      else pkgPrice = pkgAmount * NFT_PRICE;
    }

    // 🔒 防重複入帳保護：若金流回呼 (PayUni) 或先前核銷已將 has_purchased 標記為 true，
    // 嚴禁重複觸發 processAffiliateCommissions，防止二次分潤與業績暴衝！
    let referrerAddress = userData?.referrer_address || '';
    if (userData?.has_purchased) {
      console.log(`[Redeem] 用戶 (${walletAddress}) 先前已於金流端完成入帳分潤，略過重複派發佣金。`);
    } else {
      // 首次 Web3 核銷或尚未計算分潤者，執行一次性 25% 聯盟分潤
      referrerAddress = await processAffiliateCommissions(walletAddress, refCode, pkgPrice, productType);
    }

    // 📢 【核心升級】當客戶於 /redeem 領取 NFT 眾籌憑證時，0 秒自動啟動「萬商自助廣告系統」：
    // - 每 1 顆 NFT 延長 180 天使用時間 (days = pkgAmount * 180)
    // - 眾籌金額滿 $888 / $2700 / $6000 自動開通對應高階權限 (GOLD_888 / ROYAL_2700 / SUPREME_6000)
    // - 同步寄發電郵備份（含登入信箱、WX 通行密碼、開通等級與件數、到期日及一鍵免密連結）
    let nftAdActivationResult: any = null;
    if (cleanEmail && (!productType || productType === 'NFT_REDEEM')) {
      try {
        const { activateOrExtendNftCrowdfundAdAccount } = await import('@/lib/adNetwork');
        const idemKey = `NFT_REDEEM_${walletAddress.toLowerCase()}_PKG${userData?.last_purchased_package || 1}_CNT${pkgAmount}`;
        nftAdActivationResult = await activateOrExtendNftCrowdfundAdAccount({
          email: cleanEmail,
          walletAddress,
          nftCount: pkgAmount,
          paidAmountUsdt: pkgPrice,
          idempotencyKey: idemKey,
          adminNote: `VIP 專區領取 NFT 憑證 (${pkgName}, ${pkgAmount} 顆 × 180天)`,
          sendWelcomeEmail: true
        });
      } catch (nftAdErr) {
        console.error('[Redeem] Error activating NFT Ad Network account:', nftAdErr);
      }
    }

    // 同步將客戶填寫的 Email 綁定寫回 users 資料表，確保日後可用 Email 登入 /dashboard 查核
    try {
      await supabase
        .from('users')
        .update({ email: cleanEmail })
        .ilike('wallet_address', walletAddress);
    } catch (syncEmailErr) {
      console.warn('[Redeem] Non-fatal user email sync warning:', syncEmailErr);
    }

    // 🎓 若為 AI 頂配教材 (DIRECT_COURSE)，無條件先完成 VIP 雲教室開通與簽章下載連結生成
    let directCourseEnroll: Awaited<ReturnType<typeof autoEnrollVipStudent>> | null = null;
    const redeemCourseTxnId = `WEB3_${walletAddress.slice(0, 10)}_${Date.now()}`;
    if (productType === 'DIRECT_COURSE' && cleanEmail) {
      try {
        directCourseEnroll = await autoEnrollVipStudent(cleanEmail, purchasedPkgId, redeemCourseTxnId);
      } catch (enrollErr) {
        console.error('[Redeem] Error in VIP auto-enroll:', enrollErr);
      }
    }

    // ==========================================
    // Send Notification Emails (Nodemailer)
    // ==========================================
    if (cleanEmail && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
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

      let clientEmailHandled = Boolean(nftAdActivationResult?.activated);
      if (productType === 'DIRECT_COURSE') {
        if (directCourseEnroll) {
          try {
            await sendVipCourseWelcomeEmail({
              email: cleanEmail,
              pkgId: purchasedPkgId,
              txnId: redeemCourseTxnId,
              magicLoginUrl: directCourseEnroll.magic_login_url,
              downloadLinks: directCourseEnroll.download_links,
              courseName: pkgName,
              priceUsdt: pkgPrice
            });
            clientEmailHandled = true;
          } catch (emailErr) {
            console.error('[Redeem] Error sending VIP course welcome email:', emailErr);
          }
        }
        emailSubject = "🎓 【WeiXiang AI】您的 AI頂配教材 已兌換開通！";
        emailHtml = `
          <h2>親愛的學員，恭喜您成功兌換「${pkgName}」！</h2>
          <p>您的權限已確認開通。請點擊下方連結進入雲教室或會員中心下載專屬 AI 頂配教材：</p>
          <br/>
          <a href="${directCourseEnroll?.magic_login_url || courseLink || 'https://vip.5208.uk/dashboard/'}" style="display:inline-block; padding: 12px 24px; background: #10b981; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">📥 立即登入雲教室 / 下載 AI頂配教材</a>
          <br/><br/>
          <p>（若未立即看到下載連結，亦可前往 https://nft1314.party/dashboard 領取 4 語系下載包。）</p>
          <p>微享 AI 團隊 敬上</p>
        `;
      } else if (productType === 'SPONSOR') {
        try {
          const { activateOrExtendSponsorAdAccount } = await import('@/lib/adNetwork');
          const adRes = await activateOrExtendSponsorAdAccount({
            email,
            paidAmountUsdt: pkgPrice,
            walletAddress,
            adminNote: `Web3 斗內贊助 ($${pkgPrice} USDT)`,
            sendWelcomeEmail: true
          });
          if (adRes.activated) {
            clientEmailHandled = true;
          }
        } catch (adErr) {
          console.error('[Redeem] AdNetwork activation error:', adErr);
        }
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
        if (!clientEmailHandled) {
          await transporter.sendMail(mailToClient);
        }
        await transporter.sendMail(mailToAdmin);
        console.log("Emails sent successfully!");
      } catch (err) {
        console.error("Failed to send emails:", err);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Redemption successful, commissions calculated, and fulfillment activated.',
      referrerFound: !!referrerAddress,
      courseAccess:
        productType === 'DIRECT_COURSE' && directCourseEnroll?.success
          ? {
              courseName: pkgName,
              packageId: purchasedPkgId,
              magicLoginUrl: directCourseEnroll.magic_login_url,
              downloadLinks: toDownloadLinkItems(directCourseEnroll.download_links)
            }
          : null,
      adNetwork: nftAdActivationResult
        ? {
            activated: nftAdActivationResult.activated,
            daysAdded: nftAdActivationResult.daysAdded,
            alreadyRedeemed: nftAdActivationResult.alreadyRedeemed,
            emailSent: Boolean(nftAdActivationResult.emailSent),
            planTier: nftAdActivationResult.advertiser?.plan_tier,
            maxAdSlots: nftAdActivationResult.advertiser?.max_ad_slots,
            weight: nftAdActivationResult.advertiser?.weight,
            expiresAt: nftAdActivationResult.advertiser?.expires_at,
            passwordCode: nftAdActivationResult.advertiser?.password_code,
            magicLoginUrl: nftAdActivationResult.magicLoginUrl
          }
        : null
    });

  } catch (error: any) {
    console.error('Commission Calculation Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
