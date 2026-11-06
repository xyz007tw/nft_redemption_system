import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import { isPaymentDuplicate, acquirePaymentLock, releasePaymentLock, markPaymentProcessed } from '@/lib/idempotency';
import { PAYPAL_RECEIVER_EMAIL } from '@/components/PayPalButton';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_key'
);

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const params = new URLSearchParams(rawBody);

    const paymentStatus = params.get('payment_status') || '';
    const txnId = params.get('txn_id') || '';
    const receiverEmail = (params.get('receiver_email') || '').toLowerCase().trim();
    const custom = params.get('custom') || '';
    const mcGross = params.get('mc_gross') || '0';
    const mcCurrency = params.get('mc_currency') || 'USD';

    console.log(`[PayPal IPN] Received txn_id: ${txnId}, status: ${paymentStatus}, receiver: ${receiverEmail}, gross: ${mcGross} ${mcCurrency}`);

    // Verify Receiver Email
    if (receiverEmail && receiverEmail !== PAYPAL_RECEIVER_EMAIL.toLowerCase()) {
      console.warn(`[PayPal IPN] Receiver email mismatch: ${receiverEmail} vs expected ${PAYPAL_RECEIVER_EMAIL}`);
      return new Response('OK', { status: 200 });
    }

    // Only process Completed payments
    if (paymentStatus !== 'Completed') {
      console.log(`[PayPal IPN] Payment status is not Completed (${paymentStatus}), ignoring.`);
      return new Response('OK', { status: 200 });
    }

    if (!txnId) {
      console.error('[PayPal IPN] Missing txn_id');
      return new Response('Missing txn_id', { status: 400 });
    }

    // 🔒 冪等性鎖定 (Anti-Duplicate Lock)
    if (await isPaymentDuplicate(txnId)) {
      console.warn(`[PayPal IPN Idempotency] 交易已於先前成功入帳 (TxnId: ${txnId})，主動攔截重複派發。`);
      return new Response('OK', { status: 200 });
    }

    if (!acquirePaymentLock(txnId)) {
      console.warn(`[PayPal IPN Idempotency] 交易正在併發處理中 (In-Flight: ${txnId})。`);
      return new Response('OK', { status: 200 });
    }

    // Parse custom payload: pkgId|productType|price|email|refCode|address
    const parts = custom.split('|');
    const packageId = parts[0] || '101';
    const productType = parts[1] || 'DIRECT_COURSE';
    const priceUsdt = parseFloat(parts[2] || mcGross) || parseFloat(mcGross);
    const email = (parts[3] || params.get('payer_email') || '').toLowerCase().trim();
    const refCode = parts[4] || '';
    let walletAddress = parts[5] || '';

    if (!walletAddress || !walletAddress.startsWith('0x')) {
      const crypto = await import('crypto');
      const hash = crypto.createHash('sha256').update((email || `paypal_${txnId}`).toLowerCase().trim()).digest('hex');
      walletAddress = '0x' + hash.substring(0, 40);
    }

    const pkgNumericId = Number(packageId);

    // 1. Upsert buyer into Supabase users table
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

    // 2. Distribute 25% Affiliate Commissions if not SPONSOR
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

    // 3. Automated Material Delivery Email
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && email.includes('@')) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const downloadLinks = {
        zh_tw: `https://vip.5208.uk/wp-content/uploads/ebooks/material_${pkgNumericId}_zh_tw.pdf`,
        zh_cn: `https://vip.5208.uk/wp-content/uploads/ebooks/material_${pkgNumericId}_zh_cn.pdf`,
        en: `https://vip.5208.uk/wp-content/uploads/ebooks/material_${pkgNumericId}_en.pdf`,
        ja: `https://vip.5208.uk/wp-content/uploads/ebooks/material_${pkgNumericId}_ja.pdf`,
        code_zip: `https://vip.5208.uk/wp-content/uploads/ebooks/material_${pkgNumericId}_source_code.zip`,
        interactive_html: `https://1.5208.uk/ebooks/material_${pkgNumericId}/master_bilingual.html`
      };

      await transporter.sendMail({
        from: `"WeiXiang AI 學院" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `🎉 【WeiXiang AI】PayPal 付款成功！教材與學員權限已開通`,
        html: `
          <div style="font-family: sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 16px; background: #ffffff;">
            <h2 style="color: #111827; margin-bottom: 8px;">🎉 感謝您的購買！PayPal 款項已確認收訖</h2>
            <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
              親愛的學員，恭喜您成功解鎖微享 <strong>AI頂配實戰教材 #${pkgNumericId}</strong>！
            </p>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin: 20px 0;">
              <h4 style="margin: 0 0 12px; color: #0f172a; font-size: 15px;">📥 多語系教材與隨堂資產下載專區：</h4>
              <ul style="list-style: none; padding: 0; margin: 0; line-height: 2;">
                <li>🇹🇼 <a href="${downloadLinks.zh_tw}" style="color: #0284c7; text-decoration: none; font-weight: bold;">繁體中文版 PDF 下載</a></li>
                <li>🇨🇳 <a href="${downloadLinks.zh_cn}" style="color: #0284c7; text-decoration: none; font-weight: bold;">简体中文版 PDF 下载</a></li>
                <li>🇺🇸 <a href="${downloadLinks.en}" style="color: #0284c7; text-decoration: none; font-weight: bold;">English Edition PDF Download</a></li>
                <li>🇯🇵 <a href="${downloadLinks.ja}" style="color: #0284c7; text-decoration: none; font-weight: bold;">日本語版 PDF ダウンロード</a></li>
                <li>🌐 <a href="${downloadLinks.interactive_html}" style="color: #059669; text-decoration: none; font-weight: bold;">在線雙語互動閱讀器 (R2 邊緣高速)</a></li>
                <li>💻 <a href="${downloadLinks.code_zip}" style="color: #7c3aed; text-decoration: none; font-weight: bold;">實戰代碼與 Prompt 完整資產包 (.zip)</a></li>
              </ul>
            </div>
            <div style="margin: 28px 0; text-align: center;">
              <a href="https://vip.5208.uk" style="display: inline-block; padding: 14px 28px; background: linear-gradient(90deg, #10b981, #06b6d4); color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px;">
                🚀 進入 VIP 家教學院 (vip.5208.uk)
              </a>
            </div>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <p style="color: #9ca3af; font-size: 12px;">交易序號: ${txnId} · PayPal 專屬收款引擎</p>
          </div>
        `
      });
    }

    // 4. Mark payment processed & release lock
    await markPaymentProcessed({
      tradeKey: txnId,
      source: 'PAYPAL',
      tradeNo: txnId,
      amount: priceUsdt,
      wallet: walletAddress
    });
    releasePaymentLock(txnId);

    console.log(`[PayPal IPN] Successfully processed txn_id ${txnId} for user ${email}`);
    return new Response('OK', { status: 200 });
  } catch (error: any) {
    console.error('[PayPal IPN] Internal Server Error:', error);
    return new Response('OK', { status: 200 }); // Return 200 to acknowledge PayPal
  }
}
