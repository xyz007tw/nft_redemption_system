import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key'
);

const LOCAL_PROCESSED_FILE = path.join(process.cwd(), 'data', 'processed_payments.json');

// In-memory set to prevent microsecond race conditions
const inFlightLocks = new Set<string>();

export interface PaymentRecord {
  tradeKey: string;
  source: string;
  merTradeNo?: string;
  tradeNo?: string;
  amount?: number;
  wallet?: string;
  processedAt: string;
}

function readLocalProcessed(): Record<string, PaymentRecord> {
  try {
    if (fs.existsSync(LOCAL_PROCESSED_FILE)) {
      const raw = fs.readFileSync(LOCAL_PROCESSED_FILE, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('[Idempotency] Error reading local payment records:', err);
  }
  return {};
}

function writeLocalProcessed(records: Record<string, PaymentRecord>) {
  try {
    const dir = path.dirname(LOCAL_PROCESSED_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_PROCESSED_FILE, JSON.stringify(records, null, 2), 'utf8');
  } catch (err) {
    console.warn('[Idempotency] Error writing local payment records:', err);
  }
}

/**
 * Check if a payment transaction has already been processed.
 * Returns true if duplicate (already processed or currently processing).
 */
export async function isPaymentDuplicate(tradeKey: string): Promise<boolean> {
  const cleanKey = String(tradeKey || '').trim();
  if (!cleanKey) return false;

  // 1. In-flight memory check
  if (inFlightLocks.has(cleanKey)) {
    console.warn(`[Idempotency] Payment ${cleanKey} is currently processing in-flight!`);
    return true;
  }

  // 2. Local storage check
  const localRecords = readLocalProcessed();
  if (localRecords[cleanKey]) {
    console.warn(`[Idempotency] Duplicate payment detected in local storage: ${cleanKey}`);
    return true;
  }

  // 3. Supabase check (gracefully ignored if table not migrated)
  try {
    const { data } = await supabase
      .from('processed_payments')
      .select('trade_key')
      .eq('trade_key', cleanKey)
      .maybeSingle();

    if (data?.trade_key) {
      console.warn(`[Idempotency] Duplicate payment detected in Supabase: ${cleanKey}`);
      return true;
    }
  } catch {
    // If table doesn't exist, ignore
  }

  return false;
}

/**
 * Acquire an in-flight lock for this payment.
 */
export function acquirePaymentLock(tradeKey: string): boolean {
  const cleanKey = String(tradeKey || '').trim();
  if (!cleanKey || inFlightLocks.has(cleanKey)) return false;
  inFlightLocks.add(cleanKey);
  return true;
}

/**
 * Release an in-flight lock.
 */
export function releasePaymentLock(tradeKey: string) {
  const cleanKey = String(tradeKey || '').trim();
  inFlightLocks.delete(cleanKey);
}

/**
 * Mark a payment transaction as successfully completed.
 * Saves to both local persistent file and Supabase.
 */
export async function markPaymentProcessed(details: {
  tradeKey: string;
  source: string;
  merTradeNo?: string;
  tradeNo?: string;
  amount?: number;
  wallet?: string;
}) {
  const cleanKey = String(details.tradeKey || '').trim();
  if (!cleanKey) return;

  const record: PaymentRecord = {
    tradeKey: cleanKey,
    source: details.source,
    merTradeNo: details.merTradeNo,
    tradeNo: details.tradeNo,
    amount: details.amount,
    wallet: details.wallet,
    processedAt: new Date().toISOString()
  };

  // 1. Save to local storage
  try {
    const localRecords = readLocalProcessed();
    localRecords[cleanKey] = record;
    writeLocalProcessed(localRecords);
  } catch (err) {
    console.warn('[Idempotency] Failed to write local record:', err);
  }

  // 2. Save to Supabase (best effort)
  try {
    await supabase.from('processed_payments').upsert({
      trade_key: cleanKey,
      source: details.source,
      mer_trade_no: details.merTradeNo || null,
      trade_no: details.tradeNo || null,
      amount: details.amount || 0,
      wallet_address: details.wallet || null,
      processed_at: record.processedAt
    }, { onConflict: 'trade_key' });
  } catch {
    // Ignore schema missing
  }

  // Release lock
  inFlightLocks.delete(cleanKey);
}
