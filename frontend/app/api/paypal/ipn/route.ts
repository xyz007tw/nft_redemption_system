import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isPaymentDuplicate, acquirePaymentLock, releasePaymentLock, markPaymentProcessed } from '@/lib/idempotency';
import { PAYPAL_RECEIVER_EMAIL } from '@/components/PayPalButton';
import { autoEnrollVipStudent, sendVipCourseWelcomeEmail, normalizeCoursePkgId } from '@/lib/vipEnroll';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_key'
);

const MIN_PKG_PRICE_MAP: Record<number, number> = {
  100: 198,
  101: 39,
  102: 39,
  103: 39,
  104: 49,
  105: 59,
  106: 49,
  107: 29,
  108: 39,
  109: 29,
  110: 59,
};

export async function POST(req: Request) {
  let lockedTxnId: string | null = null;
  try {
    const rawBody = await req.text();
    const params = new URLSearchParams(rawBody);

    const paymentStatus = params.get('payment_status') || '';
    const txnId = (params.get('txn_id') || '').trim();
    const receiverEmail = (params.get('receiver_email') || params.get('business') || '').toLowerCase().trim();
    const custom = params.get('custom') || '';
    const mcGross = params.get('mc_gross') || '0';
    const mcCurrency = (params.get('mc_currency') || 'USD').toUpperCase().trim();

    console.log(`[PayPal IPN] Received txn_id: ${txnId}, status: ${paymentStatus}, receiver: ${receiverEmail}, gross: ${mcGross} ${mcCurrency}`);

    // 1. Strict Receiver Email & Currency Verification
    if (!receiverEmail || receiverEmail !== PAYPAL_RECEIVER_EMAIL.toLowerCase()) {
      console.warn(`[PayPal IPN Security] Receiver email mismatch or missing: ${receiverEmail} vs expected ${PAYPAL_RECEIVER_EMAIL}`);
      return new Response('OK', { status: 200 });
    }

    if (mcCurrency !== 'USD') {
      console.warn(`[PayPal IPN Security] Invalid currency: ${mcCurrency}`);
      return new Response('OK', { status: 200 });
    }

    // 2. Only process Completed payments
    if (paymentStatus !== 'Completed') {
      console.log(`[PayPal IPN] Payment status is not Completed (${paymentStatus}), ignoring.`);
      return new Response('OK', { status: 200 });
    }

    if (!txnId) {
      console.error('[PayPal IPN] Missing txn_id');
      return new Response('Missing txn_id', { status: 400 });
    }

    // 3. 🛡️ Official PayPal IPN Postback Verification (cmd=_notify-validate, fail-closed on unverified/error so PayPal retries)
    const verifyUrl = process.env.PAYPAL_SANDBOX === 'true'
      ? 'https://ipnpb.sandbox.paypal.com/cgi-bin/webscr'
      : 'https://ipnpb.paypal.com/cgi-bin/webscr';

    let verifiedStatus = '';
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const verifyResp = await fetch(verifyUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'WeiXiang-IPN-Security-Verifier/1.0'
          },
          body: `cmd=_notify-validate&${rawBody}`,
          signal: AbortSignal.timeout(12000)
        });
        verifiedStatus = (await verifyResp.text()).trim();
        if (verifiedStatus === 'VERIFIED' || verifiedStatus === 'INVALID') {
          break;
        }
      } catch (verifyNetErr) {
        console.warn(`[PayPal IPN] Postback attempt ${attempt} network error:`, verifyNetErr);
      }
    }

    if (verifiedStatus === 'INVALID') {
      console.error(`[PayPal IPN Security] Forged IPN explicitly rejected by PayPal! Response: ${verifiedStatus}`);
      return new Response('Invalid IPN', { status: 400 });
    }
    if (verifiedStatus !== 'VERIFIED') {
      console.error(`[PayPal IPN Security] Postback verification did not return VERIFIED (got "${verifiedStatus}"). Returning 500 for PayPal retry.`);
      return new Response('IPN Verification Retry', { status: 500 });
    }

    // 4. 🔒 Idempotency & Concurrency Lock
    if (await isPaymentDuplicate(txnId)) {
      console.warn(`[PayPal IPN Idempotency] 交易已於先前成功入帳 (TxnId: ${txnId})，主動攔截重複派發。`);
      return new Response('OK', { status: 200 });
    }

    if (!acquirePaymentLock(txnId)) {
      console.warn(`[PayPal IPN Idempotency] 交易正在併發處理中 (In-Flight: ${txnId})。`);
      return new Response('OK', { status: 200 });
    }
    lockedTxnId = txnId;

    // 5. Parse custom payload & enforce actual paid gross amount (never trust client-supplied price)
    const parts = custom.split('|');
    const packageId = parts[0] || '101';
    const productType = parts[1] || 'DIRECT_COURSE';
    const actualPaidUsd = parseFloat(mcGross) || 0;
    const email = (parts[3] || params.get('payer_email') || '').toLowerCase().trim();
    const refCode = parts[4] || '';
    let walletAddress = parts[5] || '';
    const bookId = parts[6] || '';

    const pkgNumericId = normalizeCoursePkgId(Number(packageId));
    const expectedMinPrice = MIN_PKG_PRICE_MAP[pkgNumericId] || 0;

    if (actualPaidUsd <= 0) {
      console.error(`[PayPal IPN Security] Zero/negative payment ignored for pkg ${pkgNumericId}: paid $${actualPaidUsd}`);
      return new Response('OK', { status: 200 });
    }
    if (expectedMinPrice > 0 && actualPaidUsd + 0.5 < expectedMinPrice) {
      console.warn(`[PayPal IPN Notice] Paid $${actualPaidUsd} vs list price $${expectedMinPrice} for pkg ${pkgNumericId}; calculating commission strictly on actual paid amount $${actualPaidUsd} while preserving customer access.`);
    }

    const priceUsdt = actualPaidUsd;

    if (!walletAddress || !walletAddress.startsWith('0x')) {
      const crypto = await import('crypto');
      const hash = crypto.createHash('sha256').update((email || `paypal_${txnId}`).toLowerCase().trim()).digest('hex');
      walletAddress = '0x' + hash.substring(0, 40);
    }

    // 6. Upsert buyer into Supabase users table
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, total_sales, has_purchased')
      .eq('email', email)
      .single();

    const previousSales = existingUser?.total_sales || 0;
    const newTotalSales = previousSales + priceUsdt;

    await supabase
      .from('users')
      .upsert({
        email,
        wallet_address: walletAddress,
        has_purchased: true,
        last_purchased_package: pkgNumericId,
        total_sales: newTotalSales,
        updated_at: new Date().toISOString()
      }, { onConflict: 'email' });

    // 7. Distribute 25% Affiliate Commissions if not SPONSOR
    if (productType !== 'SPONSOR') {
      try {
        const { processAffiliateCommissions } = await import('@/lib/affiliate');
        await processAffiliateCommissions(
          walletAddress,
          refCode || null,
          priceUsdt,
          productType || 'DIRECT_COURSE'
        );
      } catch (commErr) {
        console.error('[PayPal IPN] Commission distribution error:', commErr);
      }
    }

    // 8. Automated VIP Course Enrollment OR E-Book Franchise Settlement & Email Delivery
    if (productType === 'EBOOK_PURCHASE' || Number(packageId) === 991 || Number(packageId) === 992) {
      try {
        const { settleRealEBookPurchase } = await import('@/lib/ebookSettlement');
        const ebookSettle = await settleRealEBookPurchase({
          bookId: bookId || 'ebook-demo-001',
          amountUsdt: priceUsdt,
          readerEmail: email
        });
        if (email && email.includes('@') && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
          const nodemailer = await import('nodemailer');
          const transporter = nodemailer.default.createTransport({
            service: 'gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
          });
          const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nft1314.party';
          const bookTitle = ebookSettle?.book?.title_zh || '精裝雙語電子書';
          const targetBookId = encodeURIComponent(bookId || 'ebook-demo-001');
          const readerUrl = ebookSettle?.readerUrl || `${siteUrl}/ebook-store?book=${targetBookId}`;
          const storeUrl = ebookSettle?.storeUrl || `${siteUrl}/ebook-store?book=${targetBookId}`;
          await transporter.sendMail({
            from: `"WeiXiang AI" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `📖 【WeiXiang AI】PayPal 購書成功！《${bookTitle}》專屬防盜版閱讀與下載通行證`,
            html: `
              <div style="font-family: sans-serif; max-width: 640px; padding: 24px; border: 1px solid #e5e7eb; border-radius: 16px;">
                <h2 style="color: #0f172a; margin-top: 0;">🎉 恭喜您成功解鎖《${bookTitle}》！</h2>
                <p>您的 PayPal 款項（$${priceUsdt} USD）已確認收訖，系統已為您的信箱 <strong>${email}</strong> 開通永久閱讀與下載授權：</p>
                <div style="background: #f8fafc; padding: 18px; border-radius: 12px; margin: 18px 0; border: 1px solid #cbd5e1;">
                  <p style="margin: 8px 0;"><a href="${readerUrl}" style="display:inline-block; background:#10b981; color:#ffffff; text-decoration:none; font-weight:bold; padding:10px 18px; border-radius:8px;">📖 開啟專屬浮水印雙語互動閱讀器</a></p>
                  <p style="margin: 8px 0;"><a href="${storeUrl}" style="display:inline-block; background:#4f46e5; color:#ffffff; text-decoration:none; font-weight:bold; padding:10px 18px; border-radius:8px;">📚 前往 VIP 讀者書櫃下載浮水印 PDF</a></p>
                </div>
              </div>
            `
          });
        }
      } catch (ebErr) {
        console.error('[PayPal IPN] Error in EBook settlement:', ebErr);
      }
    } else if (productType === 'SPONSOR' || [901, 915, 920, 925, 927, 960].includes(Number(packageId))) {
      if (email && email.includes('@')) {
        try {
          const { activateOrExtendSponsorAdAccount } = await import('@/lib/adNetwork');
          await activateOrExtendSponsorAdAccount({
            email,
            paidAmountUsdt: priceUsdt,
            walletAddress,
            adminNote: `PayPal 斗內贊助 ($${priceUsdt} USD)`,
            sendWelcomeEmail: true
          });
        } catch (adErr) {
          console.error('[PayPal IPN] AdNetwork activation error:', adErr);
        }
      }
    } else if (productType === 'NFT_REDEEM' || [1, 2, 3, 4, 5].includes(Number(packageId))) {
      if (email && email.includes('@')) {
        try {
          const { activateOrExtendNftCrowdfundAdAccount } = await import('@/lib/adNetwork');
          const nftCnt =
            priceUsdt >= 12000
              ? 360
              : priceUsdt >= 5400
              ? 108
              : priceUsdt >= 1788
              ? 30
              : priceUsdt >= 198
              ? 3
              : 1;
          const idemKey = `NFT_REDEEM_${walletAddress.toLowerCase()}_PKG${packageId}_CNT${nftCnt}`;
          await activateOrExtendNftCrowdfundAdAccount({
            email,
            walletAddress,
            nftCount: nftCnt,
            paidAmountUsdt: priceUsdt,
            idempotencyKey: idemKey,
            adminNote: `PayPal 眾籌憑證開通 (${nftCnt}顆 × 180天, $${priceUsdt} USD)`,
            sendWelcomeEmail: true
          });
        } catch (nftAdErr) {
          console.error('[PayPal IPN] NFT AdNetwork activation error:', nftAdErr);
        }
      }
    } else if (email && email.includes('@')) {
      try {
        console.log(`[PayPal IPN] Auto enrolling user ${email} into package ${pkgNumericId}...`);
        const enrollResult = await autoEnrollVipStudent(email, pkgNumericId, txnId);
        console.log(`[PayPal IPN] Auto enroll result:`, enrollResult);
        const { grantVipBundleEBookAccess } = await import('@/lib/ebookSettlement');
        const bundledEbookResult = await grantVipBundleEBookAccess({
          email,
          pkgId: pkgNumericId,
          priceUsdt
        });

        await sendVipCourseWelcomeEmail({
          email,
          pkgId: pkgNumericId,
          txnId,
          magicLoginUrl: enrollResult.magic_login_url,
          downloadLinks: enrollResult.download_links,
          priceUsdt,
          bundledEbookReaderUrl: bundledEbookResult?.readerUrl,
          bundledEbookStoreUrl: bundledEbookResult?.storeUrl
        });
      } catch (enrollErr) {
        console.error('[PayPal IPN] Error in auto-enroll or welcome email:', enrollErr);
      }
    }

    // 8B. Notify System Admin (xyz007tw@gmail.com) & Backup Email (qqww0614@gmail.com) for ALL PayPal payments
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const nodemailer = await import('nodemailer');
        const transporter = nodemailer.default.createTransport({
          service: 'gmail',
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });
        const adminToList = Array.from(
          new Set(['xyz007tw@gmail.com', process.env.ADMIN_EMAIL, process.env.EMAIL_USER].filter(Boolean))
        ).join(', ');

        await transporter.sendMail({
          from: `"WeiXiang AI 系統管理通知" <${process.env.EMAIL_USER}>`,
          to: adminToList,
          cc: 'qqww0614@gmail.com',
          subject: `💰 【PayPal 收款通知】$${priceUsdt} USD｜${productType || 'DIRECT_COURSE'} (Pkg ${packageId})`,
          html: `
            <div style="font-family: sans-serif; max-width: 640px; padding: 24px; border: 1px solid #e5e7eb; border-radius: 16px;">
              <h2 style="color: #0f172a; margin-top: 0;">💰 PayPal 即時收款與自動開通通知</h2>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin: 16px 0;">
                <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #64748b;">交易編號 (Txn ID)</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">${txnId}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #64748b;">付款金額</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #059669;">$${priceUsdt} USD</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #64748b;">品項類型 / 編號</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${productType || 'DIRECT_COURSE'} (Package ID: ${packageId}${bookId ? `, Book: ${bookId}` : ''})</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #64748b;">買家信箱</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${email || '未提供'}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #64748b;">歸戶錢包</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-family: monospace;">${walletAddress}</td></tr>
              </table>
              <p style="color: #6b7280; font-size: 12px; margin-bottom: 0;">此通知已自動寄送至 xyz007tw@gmail.com 並副本 (CC) 至 qqww0614@gmail.com。</p>
            </div>
          `
        });
      } catch (adminMailErr) {
        console.error('[PayPal IPN] Admin notification email error:', adminMailErr);
      }
    }

    // 9. Mark payment processed
    await markPaymentProcessed({
      tradeKey: txnId,
      source: 'PAYPAL',
      tradeNo: txnId,
      amount: priceUsdt,
      wallet: walletAddress
    });

    console.log(`[PayPal IPN] Successfully processed txn_id ${txnId} for user ${email}`);
    return new Response('OK', { status: 200 });
  } catch (error: any) {
    console.error('[PayPal IPN] Internal Server Error:', error);
    return new Response('OK', { status: 200 });
  } finally {
    if (lockedTxnId) {
      releasePaymentLock(lockedTxnId);
    }
  }
}
