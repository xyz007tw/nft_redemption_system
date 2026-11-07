import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import { isPaymentDuplicate, acquirePaymentLock, releasePaymentLock, markPaymentProcessed } from '@/lib/idempotency';
import { PAYPAL_RECEIVER_EMAIL } from '@/components/PayPalButton';
import { autoEnrollVipStudent, sendVipCourseWelcomeEmail, normalizeCoursePkgId } from '@/lib/vipEnroll';

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

    const pkgNumericId = normalizeCoursePkgId(Number(packageId));

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

    // 3. Automated VIP Course Enrollment & Email Delivery
    if (email && email.includes('@')) {
      try {
        console.log(`[PayPal IPN] Auto enrolling user ${email} into package ${pkgNumericId}...`);
        const enrollResult = await autoEnrollVipStudent(email, pkgNumericId, txnId);
        console.log(`[PayPal IPN] Auto enroll result:`, enrollResult);

        await sendVipCourseWelcomeEmail({
          email,
          pkgId: pkgNumericId,
          txnId,
          magicLoginUrl: enrollResult.magic_login_url,
          priceUsdt
        });
      } catch (enrollErr) {
        console.error('[PayPal IPN] Error in auto-enroll or welcome email:', enrollErr);
      }
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
