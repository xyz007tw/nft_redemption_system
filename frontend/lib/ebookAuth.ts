import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import type { EBookChapter, EBookProject, FranchiseeProfile } from '@/lib/ebookEngine';
import { DEFAULT_EBOOK_STORE, hydrateEBookCloudStore } from '@/lib/ebookDefaultStore';

export interface EBookCloudStoreShape {
  franchisees: Record<string, FranchiseeProfile>;
  books: EBookProject[];
  reader_purchases?: Record<string, string[]>;
  payout_requests?: any[];
}

const EBOOK_STORE_PKG_ID = 990990;
const EBOOK_STORE_PREFIX = '__WX_EBOOK_STORE__:';

/**
 * 從 Supabase packages(id=990990) 讀取電子書商店 JSON 狀態（附旗艦預設書庫 fallback 與章節補全）
 */
export async function loadEBookCloudStore(
  defaultStore: EBookCloudStoreShape = DEFAULT_EBOOK_STORE
): Promise<EBookCloudStoreShape> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key'
  );
  try {
    const { data, error } = await supabase
      .from('packages')
      .select('roi_text')
      .eq('id', EBOOK_STORE_PKG_ID)
      .maybeSingle();

    if (!error && data?.roi_text && data.roi_text.startsWith(EBOOK_STORE_PREFIX)) {
      const parsed = JSON.parse(data.roi_text.slice(EBOOK_STORE_PREFIX.length)) as EBookCloudStoreShape;
      return hydrateEBookCloudStore(parsed);
    }
  } catch (err) {
    console.warn('[ebookAuth] loadEBookCloudStore fallback:', err);
  }
  return defaultStore;
}

function getEBookSigningSecret(): string {
  return (
    process.env.EBOOK_ACCESS_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.PRIVATE_KEY ||
    process.env.PAYUNI_HASH_KEY ||
    ''
  );
}

/**
 * 簽發購買者專屬電子書解鎖憑證 (格式: `<expUnix>.<hmacHex>`)
 */
export function signEBookAccess(email: string, bookId: string, ttlSeconds = 180 * 86400): string {
  const secret = getEBookSigningSecret();
  const cleanEmail = (email || '').toLowerCase().trim();
  const cleanBookId = (bookId || '').trim();
  if (!secret || !cleanEmail || !cleanBookId) return '';

  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = `${cleanEmail}|${cleanBookId}|${exp}`;
  const mac = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return `${exp}.${mac}`;
}

/**
 * 驗證購買者專屬電子書解鎖憑證 (Time-constant 比對 + 期限檢查)
 */
export function verifyEBookAccess(email: string, bookId: string, sig: string): boolean {
  const secret = getEBookSigningSecret();
  const cleanEmail = (email || '').toLowerCase().trim();
  const cleanBookId = (bookId || '').trim();
  if (!secret || !cleanEmail || !cleanBookId || !sig || !sig.includes('.')) {
    return false;
  }

  const [expStr, macHex] = sig.split('.');
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp <= Math.floor(Date.now() / 1000)) {
    return false;
  }
  if (!macHex || !/^[a-f0-9]{64}$/i.test(macHex)) {
    return false;
  }

  const expectedHex = crypto
    .createHmac('sha256', secret)
    .update(`${cleanEmail}|${cleanBookId}|${expStr}`)
    .digest('hex');

  try {
    return crypto.timingSafeEqual(Buffer.from(macHex, 'hex'), Buffer.from(expectedHex, 'hex'));
  } catch {
    return false;
  }
}

/**
 * 查驗指定 Email 是否已在雲端資料庫購買指定電子書或全館 ALL_VIP
 */
export function hasPurchasedEBookInStore(
  store: Pick<EBookCloudStoreShape, 'reader_purchases'>,
  readerEmail: string,
  bookId: string
): boolean {
  const cleanEmail = (readerEmail || '').toLowerCase().trim();
  if (!cleanEmail) return false;
  const purchased = store.reader_purchases?.[cleanEmail] || [];
  return purchased.includes('ALL_VIP') || purchased.includes(bookId);
}

/**
 * 依購買狀態或合法作者/管理員權限，安全裁切章節內容與敏感金流/PII 欄位
 */
export function buildSanitizedEBookStoreResponse(
  store: EBookCloudStoreShape,
  options: {
    isAdmin?: boolean;
    authorKey?: string;
    readerEmail?: string;
    readerSig?: string;
    targetBookId?: string;
  }
) {
  const cleanReader = (options.readerEmail || '').toLowerCase().trim();
  const cleanAuthor = (options.authorKey || '').toLowerCase().trim();
  const purchasedByReader = cleanReader ? store.reader_purchases?.[cleanReader] || [] : [];

  // 若呼叫者帶入有效的全館或單書 HMAC 憑證，視同該書已驗證解鎖
  const unlockedSet = new Set<string>(purchasedByReader);
  if (cleanReader && options.readerSig) {
    if (verifyEBookAccess(cleanReader, 'ALL_VIP', options.readerSig)) {
      unlockedSet.add('ALL_VIP');
    } else if (options.targetBookId && verifyEBookAccess(cleanReader, options.targetBookId, options.readerSig)) {
      unlockedSet.add(options.targetBookId);
    }
  }

  const isGlobalVip = unlockedSet.has('ALL_VIP');

  const safeBooks: EBookProject[] = (store.books || [])
    .filter((b) => {
      if (options.isAdmin) return true;
      if (cleanAuthor && cleanAuthor !== 'demo_author' && b.author_wallet?.toLowerCase() === cleanAuthor) {
        return true;
      }
      return b.status === 'APPROVED_PUBLISHED';
    })
    .map((book) => {
      const isBookOwner = Boolean(
        cleanAuthor &&
          cleanAuthor !== 'demo_author' &&
          (book.author_wallet?.toLowerCase() === cleanAuthor || book.author_email?.toLowerCase() === cleanAuthor)
      );
      const isBookUnlocked = Boolean(options.isAdmin || isBookOwner || isGlobalVip || unlockedSet.has(book.id));

      if (isBookUnlocked) {
        return book;
      }

      // 未購買訪客：僅保留第 1 章簡短試閱摘錄，隱藏第 2..N 章全文與私密 R2 連結
      const sanitizedChapters: EBookChapter[] = (book.chapters || []).map((ch, idx) => {
        if (idx === 0) {
          const truncate = (s?: string) => (s ? (s.length > 260 ? `${s.slice(0, 260)}...` : s) : s);
          return {
            ...ch,
            content_zh: truncate(ch.content_zh) || '',
            content_en: truncate(ch.content_en) || '',
            content_ja: truncate(ch.content_ja),
            content_zh_cn: truncate(ch.content_zh_cn),
            content_vi: truncate(ch.content_vi),
            content_id: truncate(ch.content_id)
          };
        }
        return {
          ...ch,
          content_zh: '🔒 付費解鎖後方可閱讀完整章節內容與雙語對照。',
          content_en: '🔒 Purchase this E-Book to unlock full chapter content.',
          content_ja: '🔒 ご購入後に本チャプターの全編をお読みいただけます。',
          content_zh_cn: '🔒 付费解锁后方可阅读完整章节内容与双语对照。',
          content_vi: '🔒 Mở khóa để đọc toàn bộ nội dung chương này.',
          content_id: '🔒 Buka kunci untuk membaca konten bab ini.'
        };
      });

      const { r2_published_urls: _omittedR2, ...bookWithoutPrivateUrls } = book;
      return {
        ...bookWithoutPrivateUrls,
        chapters: sanitizedChapters
      };
    });

  // 僅管理員與對應加盟商本人可看見自己的 profile；公開商店請求一律遮罩個資與購買者名單
  let safeFranchisees: Record<string, FranchiseeProfile> = {};
  if (options.isAdmin) {
    safeFranchisees = store.franchisees || {};
  } else if (cleanAuthor && cleanAuthor !== 'demo_author' && store.franchisees?.[cleanAuthor]) {
    safeFranchisees = { [cleanAuthor]: store.franchisees[cleanAuthor] };
  }

  // 為已驗證解鎖之購買者核發即時閱讀器簽章 (readerSigs)
  const unlockedBookIds = Array.from(unlockedSet);
  const readerSigs: Record<string, string> = {};
  if (cleanReader) {
    for (const b of safeBooks) {
      if (isGlobalVip || unlockedSet.has(b.id)) {
        const sig = signEBookAccess(cleanReader, b.id);
        if (sig) readerSigs[b.id] = sig;
      }
    }
  }

  return {
    store: {
      franchisees: safeFranchisees,
      books: safeBooks,
      ...(options.isAdmin ? { reader_purchases: store.reader_purchases || {}, payout_requests: store.payout_requests || [] } : {})
    },
    unlockedBookIds,
    readerSigs
  };
}
