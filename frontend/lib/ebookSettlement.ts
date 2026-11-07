import { createClient } from '@supabase/supabase-js';
import { EBookProject, FranchiseeProfile } from '@/lib/ebookEngine';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_key'
);

const STORE_PKG_ID = 990990;
const STORE_PREFIX = '__WX_EBOOK_STORE__:';

export interface EBookCloudStore {
  franchisees: Record<string, FranchiseeProfile>;
  books: EBookProject[];
  reader_purchases?: Record<string, string[]>;
}

export async function settleRealEBookPurchase(params: {
  bookId?: string;
  amountUsdt: number;
  readerEmail?: string;
}) {
  try {
    const { data, error } = await supabase
      .from('packages')
      .select('roi_text')
      .eq('id', STORE_PKG_ID)
      .single();

    if (error || !data || typeof data.roi_text !== 'string' || !data.roi_text.startsWith(STORE_PREFIX)) {
      return null;
    }

    const store: EBookCloudStore = JSON.parse(data.roi_text.slice(STORE_PREFIX.length));
    if (!store || !Array.isArray(store.books) || store.books.length === 0) {
      return null;
    }

    const targetBookId = params.bookId || store.books[0]?.id || 'ebook-demo-001';
    const book = store.books.find(b => b.id === targetBookId) || store.books[0];
    if (!book) return null;

    const authorKey = (book.author_wallet || book.author_email || 'demo_author').toLowerCase();
    const profile = store.franchisees?.[authorKey] || store.franchisees?.['demo_author'];
    if (!profile) return null;

    const price = Number(params.amountUsdt || book.price_single_usdt || 39);
    const standardPlatformFee10Pct = Number((price * 0.1).toFixed(2));
    const affiliateFee25Pct = Number((price * 0.25).toFixed(2));

    let deductedFromCredit = 0;
    let actualPlatformFeeCharged = 0;

    if (profile.fee_credit_balance >= standardPlatformFee10Pct) {
      deductedFromCredit = standardPlatformFee10Pct;
      profile.fee_credit_balance = Number((profile.fee_credit_balance - standardPlatformFee10Pct).toFixed(2));
      actualPlatformFeeCharged = 0;
    } else if (profile.fee_credit_balance > 0) {
      deductedFromCredit = profile.fee_credit_balance;
      actualPlatformFeeCharged = Number((standardPlatformFee10Pct - profile.fee_credit_balance).toFixed(2));
      profile.fee_credit_balance = 0;
    } else {
      actualPlatformFeeCharged = standardPlatformFee10Pct;
    }

    profile.total_sales_usdt = Number((profile.total_sales_usdt + price).toFixed(2));

    if (params.readerEmail) {
      const cleanMail = params.readerEmail.trim().toLowerCase();
      if (!store.reader_purchases) store.reader_purchases = {};
      if (!store.reader_purchases[cleanMail]) store.reader_purchases[cleanMail] = [];
      const isMonthly = price <= (book.price_monthly_sub_usdt || 15) + 2;
      const unlockTag = isMonthly ? 'ALL_VIP' : book.id;
      if (!store.reader_purchases[cleanMail].includes(unlockTag)) {
        store.reader_purchases[cleanMail].push(unlockTag);
      }
      if (!store.reader_purchases[cleanMail].includes(book.id)) {
        store.reader_purchases[cleanMail].push(book.id);
      }
    }

    const payload = STORE_PREFIX + JSON.stringify(store);
    await supabase.from('packages').upsert(
      {
        id: STORE_PKG_ID,
        name_zh: '__SYSTEM_EBOOK_STORE__',
        name_en: '__SYSTEM_EBOOK_STORE__',
        amount: 1,
        price: 990,
        discount_text: 'SYSTEM_STORE',
        roi_text: payload,
        is_active: false
      },
      { onConflict: 'id' }
    );

    const r2Url =
      book.r2_published_urls?.primary_url ||
      `https://1.5208.uk/ebooks/${book.id}/master_bilingual.html`;

    return {
      book,
      profile,
      r2Url,
      settlement: {
        orderAmount: price,
        originalFee10Pct: standardPlatformFee10Pct,
        affiliateFee25Pct,
        deductedFromCredit,
        actualPlatformFeeCharged,
        authorNetReceived: Number((price - actualPlatformFeeCharged - affiliateFee25Pct).toFixed(2)),
        remainingCreditBalance: profile.fee_credit_balance
      }
    };
  } catch (err) {
    console.error('[settleRealEBookPurchase] Error:', err);
    return null;
  }
}
