import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';
import { EBookProject, FranchiseeProfile, scanBannedContent } from '@/lib/ebookEngine';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_key'
);

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// 使用 packages 表中特殊保留 ID (990990) 的 roi_text 欄位作為免 SQL 遷移的高可用雲端 JSON Store
const STORE_PKG_ID = 990990;
const STORE_PREFIX = '__WX_EBOOK_STORE__:';

interface EBookCloudStore {
  franchisees: Record<string, FranchiseeProfile>;
  books: EBookProject[];
}

const DEFAULT_STORE: EBookCloudStore = {
  franchisees: {
    'demo_author': {
      wallet_address: '0xea693e358f1527f8aa6563c9f6ebd42e37ee14fc',
      email: 'xyz007tw@gmail.com',
      plan_status: 'ACTIVE_YEAR_1',
      agreed_terms_at: '2026-10-27T08:00:00Z',
      book_quota_total: 3,
      book_created_count: 1,
      fee_credit_balance: 990,
      total_sales_usdt: 0,
      ai_traffic_enabled: true,
      expires_at: '2027-10-27T08:00:00Z'
    }
  },
  books: [
    {
      id: 'ebook-demo-001',
      author_wallet: '0xea693e358f1527f8aa6563c9f6ebd42e37ee14fc',
      author_name: 'CTO SEN (總工程師)',
      author_email: 'xyz007tw@gmail.com',
      author_cta_url: 'https://aitutor.vip/waia',
      author_line_id: 'xyz007tw',
      title_zh: 'Antigravity × Remotion 全自動印鈔級影音與電子書實戰指南',
      title_en: 'Antigravity × Remotion Automated Video & E-Book Practical Guide',
      subtitle_zh: '掌握 AI 自動來客矩陣與 100% 倒抵零風險變現核心秘密',
      subtitle_en: 'Master the AI Traffic Matrix and 100% Fee-Credit Monetization System',
      theme_id: 'tech_blue',
      bilingual_mode: true,
      price_single_usdt: 39,
      price_monthly_sub_usdt: 15,
      status: 'APPROVED_PUBLISHED',
      submitted_at: '2026-10-27T07:30:00Z',
      reviewed_at: '2026-10-27T08:00:00Z',
      review_note: '官方旗艦示範雙語電子書（書審通過）',
      created_at: '2026-10-27T07:00:00Z',
      updated_at: '2026-10-27T08:00:00Z',
      chapters: [
        {
          id: 'ch-1',
          title_zh: '第一章：為什麼知識創作者需要 AI 自動來客系統？',
          title_en: 'Chapter 1: Why Creators Need the AI Auto-Traffic Matrix',
          content_zh: '傳統寫書與出版最大的痛點，不是寫不出好內容，而是「排版外包昂貴」與「出版後沒有流量」。微享全球電子書 SaaS 結合首年 $990 合作方案，不僅讓您一鍵生成雙語精裝電子書，更直接協作「AI 自動來客系統」每天在全球社群幫您打廣告找客人！\n更重要的是，首年支付的 $990 與次年維護費 $330，皆享有 100% 先收後抵交易 1 成（10%）服務費的零風險保障。',
          content_en: 'The biggest pain point in traditional publishing is not writing, but expensive typesetting and zero traffic after launch. WeiXiang E-Book SaaS combines our $990 partnership plan with our AI Auto-Traffic Matrix to promote your books globally 24/7.\nEven better, both the first-year $990 fee and second-year $330 maintenance fee are 100% credited back against our 10% platform transaction fee.'
        },
        {
          id: 'ch-2',
          title_zh: '第二章：三級管理平台（管理員、加盟商、讀者訂閱）運作全解析',
          title_en: 'Chapter 2: Three-Tier SaaS Architecture (Admin, Franchisee, Reader)',
          content_zh: '在加盟商創作者工作台（/studio）中，您可以享有首年 3 本電子書免費開發配額（第 4 本起每本開發費 $330）。完成設定後，您可以立即「自行下載高解析 PDF 與網頁母檔」保存，並一鍵送交總管理後台進行 3~7 天書審。\n書審通過後，系統即刻為您開通 VIP 讀者防盜版線上書櫃與 25% 聯盟分潤裂變連結！',
          content_en: 'Inside the Franchisee Studio (/studio), your $990 plan includes 3 e-book development quotas ($330 per additional book from the 4th book). You can download master PDF/HTML files anytime and submit your book for our 3-7 day compliance review.\nOnce approved, your book goes live in the VIP Reader Bookstore with 25% affiliate viral sharing enabled!'
        }
      ]
    }
  ]
};

async function loadCloudStore(): Promise<EBookCloudStore> {
  try {
    const { data, error } = await supabase
      .from('packages')
      .select('roi_text')
      .eq('id', STORE_PKG_ID)
      .single();

    if (!error && data && typeof data.roi_text === 'string' && data.roi_text.startsWith(STORE_PREFIX)) {
      return JSON.parse(data.roi_text.slice(STORE_PREFIX.length));
    }
  } catch {
    // Fallback to default store
  }
  return DEFAULT_STORE;
}

async function saveCloudStore(store: EBookCloudStore): Promise<void> {
  try {
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
  } catch (e) {
    console.error('Save EBook Cloud Store warning:', e);
  }
}

export async function GET() {
  const store = await loadCloudStore();
  return NextResponse.json({ success: true, store });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;
    const store = await loadCloudStore();

    // 1. AI 智慧擴寫與中英雙語自動翻譯 (使用唯一指定模型 gemini-2.5-flash)
    if (action === 'ai_generate_chapter') {
      const { bookTitle, chapterTitle, outlineNotes } = body;

      const scanRes = scanBannedContent(`${bookTitle} ${chapterTitle} ${outlineNotes}`);
      if (!scanRes.passed) {
        return NextResponse.json(
          {
            success: false,
            error: `🚨 觸發全球 10 大禁書風控紅線（偵測到違禁詞：「${scanRes.matchedKeyword}」）。提醒您：違反禁書條款遭檢舉將強制下架封號且一律不退費！`
          },
          { status: 400 }
        );
      }

      if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json({
          success: true,
          chapter: {
            title_zh: chapterTitle || 'AI 實戰章節',
            title_en: 'AI Practical Chapter',
            content_zh: `【系統展示生成】針對「${outlineNotes || chapterTitle}」的深度解析：\n透過微享自動電子書模版引擎，創作者能夠將核心知識迅速結構化，並自動轉化為高價值數位資產。`,
            content_en: `[System Generated] In-depth analysis on "${outlineNotes || chapterTitle}":\nWith the WeiXiang Automated E-Book Template Engine, creators can rapidly structure core knowledge into high-value digital assets.`
          }
        });
      }

      const prompt = `你是一位頂級商業與專業書籍總編輯。請根據以下資訊，撰寫一個結構嚴謹、專業且極具閱讀吸引力的電子書章節，並同時提供「繁體中文」與「專業英文」雙語對照版本。
書名：${bookTitle}
本章標題：${chapterTitle}
本章核心大綱與要點：${outlineNotes}

請嚴格以 JSON 格式回傳（不要加上 markdown code block），欄位如下：
{
  "title_zh": "潤色後的繁體中文章節標題",
  "title_en": "Translated English Chapter Title",
  "content_zh": "繁體中文章節正文（約 400~600 字，分成 3~4 個自然段落，以換行符號 \\n 分隔）",
  "content_en": "Professional English chapter body corresponding to the Chinese content (3-4 paragraphs separated by \\n)"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { temperature: 0.7 }
      });

      const rawText = (response.text || '').replace(/```json/g, '').replace(/```/g, '').trim();
      let parsed;
      try {
        parsed = JSON.parse(rawText);
      } catch {
        parsed = {
          title_zh: chapterTitle,
          title_en: chapterTitle,
          content_zh: rawText,
          content_en: ''
        };
      }

      return NextResponse.json({ success: true, chapter: parsed });
    }

    // 1B. AI 一鍵全書自動編撰引擎 (輸入書名與主題，一次自動生成完整多章節中英雙語電子書)
    if (action === 'ai_generate_full_book') {
      const { bookTitle, bookSubtitle, topicSummary } = body;

      const scanRes = scanBannedContent(`${bookTitle} ${bookSubtitle} ${topicSummary}`);
      if (!scanRes.passed) {
        return NextResponse.json(
          {
            success: false,
            error: `🚨 觸發全球 10 大禁書風控紅線（偵測到違禁詞：「${scanRes.matchedKeyword}」）。違反禁書條款遭檢舉將強制下架封號且一律不退費！`
          },
          { status: 400 }
        );
      }

      if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json({
          success: true,
          bookMeta: {
            title_zh: bookTitle || 'AI 自動化實戰專書',
            title_en: 'AI Automation Practical Masterbook',
            subtitle_zh: bookSubtitle || '從零打造全自動數位資產與獲客系統',
            subtitle_en: 'Build Your Automated Digital Asset & Traffic System from Scratch'
          },
          chapters: [
            {
              id: `ch-${Date.now()}-1`,
              title_zh: '第一章：核心趨勢與破局思維',
              title_en: 'Chapter 1: Core Trends & Breakthrough Mindset',
              content_zh: `針對「${topicSummary || bookTitle}」，本章深入剖析產業痛點與 AI 自動化帶來的革命性機會，協助讀者建立高維度商業認知。`,
              content_en: `Focusing on "${topicSummary || bookTitle}", this chapter analyzes industry pain points and revolutionary AI opportunities.`
            },
            {
              id: `ch-${Date.now()}-2`,
              title_zh: '第二章：系統化落地架構與標準流程',
              title_en: 'Chapter 2: Systematic Architecture & Standard SOP',
              content_zh: '將複雜的專業知識拆解為可複製的標準化步驟，結合微享自動電子書模版與 AI 自動來客系統，實現全天候自動化價值交付。',
              content_en: 'Break down complex expertise into replicable SOPs, combining WeiXiang E-Book templates and AI Traffic Matrix for 24/7 value delivery.'
            },
            {
              id: `ch-${Date.now()}-3`,
              title_zh: '第三章：流量裂變與長期變現閉環',
              title_en: 'Chapter 3: Viral Traffic & Long-Term Monetization Loop',
              content_zh: '透過 25% 推廣聯盟服務費裂變機制與 10% 系統服務費 100% 倒抵優勢，讓每一位讀者都成為您的推廣合夥人。',
              content_en: 'Leverage the 25% affiliate viral mechanism and 100% system fee credit rebate to turn every reader into your promotional partner.'
            }
          ]
        });
      }

      const fullPrompt = `你是一位國際級暢銷商業書總編輯。請根據以下作者提供的主題，自動編撰一整本結構完整的「中英雙語專業電子書」（包含中英文書名、副標題，以及 4 個核心章節的完整中英文正文）。
作者指定書名：${bookTitle}
作者指定副標或方向：${bookSubtitle || ''}
全書核心主題與重點描述：${topicSummary || bookTitle}

請嚴格以 JSON 格式回傳（不要加上 markdown code block），結構如下：
{
  "title_zh": "精煉後的繁體中文書名",
  "title_en": "Professional English Book Title",
  "subtitle_zh": "具吸引力的繁體中文副標題",
  "subtitle_en": "Compelling English Subtitle",
  "chapters": [
    {
      "title_zh": "第一章：...",
      "title_en": "Chapter 1: ...",
      "content_zh": "第一章繁體中文完整內文（約 350~500 字，分段以 \\n 隔開，內容須充實有乾貨）",
      "content_en": "Chapter 1 complete English content corresponding to Chinese (separated by \\n)"
    },
    {
      "title_zh": "第二章：...",
      "title_en": "Chapter 2: ...",
      "content_zh": "第二章繁體中文完整內文...",
      "content_en": "Chapter 2 complete English content..."
    },
    {
      "title_zh": "第三章：...",
      "title_en": "Chapter 3: ...",
      "content_zh": "第三章繁體中文完整內文...",
      "content_en": "Chapter 3 complete English content..."
    },
    {
      "title_zh": "第四章：...",
      "title_en": "Chapter 4: ...",
      "content_zh": "第四章繁體中文完整內文...",
      "content_en": "Chapter 4 complete English content..."
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        config: { temperature: 0.7 }
      });

      const rawText = (response.text || '').replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(rawText);

      const chapters = (parsed.chapters || []).map((c: any, i: number) => ({
        id: `ch-${Date.now()}-${i + 1}`,
        title_zh: c.title_zh,
        title_en: c.title_en,
        content_zh: c.content_zh,
        content_en: c.content_en
      }));

      return NextResponse.json({
        success: true,
        bookMeta: {
          title_zh: parsed.title_zh || bookTitle,
          title_en: parsed.title_en || '',
          subtitle_zh: parsed.subtitle_zh || bookSubtitle,
          subtitle_en: parsed.subtitle_en || ''
        },
        chapters
      });
    }

    // 2. 儲存草稿或提交至管理後台「書審 (3~7天)」
    if (action === 'save_or_submit_book') {
      const { book, submitForReview } = body as { book: EBookProject; submitForReview?: boolean };

      // 掃描全書是否違反全球 10 大禁書條款
      const fullText = [
        book.title_zh,
        book.title_en,
        book.subtitle_zh,
        ...book.chapters.map(c => `${c.title_zh} ${c.content_zh} ${c.content_en}`)
      ].join(' ');

      const scanRes = scanBannedContent(fullText);
      if (!scanRes.passed) {
        return NextResponse.json(
          {
            success: false,
            error: `🚨 系統攔截：您的電子書內容包含全球禁書違規字眼（「${scanRes.matchedKeyword}」），無法儲存或送審！請遵守合規出版切結條款。`
          },
          { status: 400 }
        );
      }

      const existingIdx = store.books.findIndex(b => b.id === book.id);
      const authorKey = (book.author_wallet || book.author_email || 'demo_author').toLowerCase();

      if (!store.franchisees[authorKey]) {
        store.franchisees[authorKey] = {
          wallet_address: book.author_wallet || '',
          email: book.author_email || '',
          plan_status: 'ACTIVE_YEAR_1',
          agreed_terms_at: new Date().toISOString(),
          book_quota_total: 3, // 首年 $990 含 3 本配額
          book_created_count: 0,
          fee_credit_balance: 990,
          total_sales_usdt: 0,
          ai_traffic_enabled: true,
          expires_at: new Date(Date.now() + 365 * 86400000).toISOString()
        };
      }

      const profile = store.franchisees[authorKey];
      if (profile.plan_status === 'BANNED_NO_REFUND') {
        return NextResponse.json(
          { success: false, error: '🚨 您的加盟商帳號因違反全球禁書條款遭檢舉，已被永久凍結且依約不予退費！' },
          { status: 403 }
        );
      }

      // 若是新建書籍，檢查是否超過配額 (首年 $990 可開發 3 本，之後每本 $330)
      if (existingIdx === -1) {
        const myBooksCount = store.books.filter(
          b => (b.author_wallet || b.author_email || '').toLowerCase() === authorKey
        ).length;

        if (myBooksCount >= profile.book_quota_total) {
          return NextResponse.json(
            {
              success: false,
              needQuotaUpgrade: true,
              error: `📚 您的電子書開發配額已滿（目前已使用 ${myBooksCount} / ${profile.book_quota_total} 本）。首年 $990 方案含 3 本電子書開發，第 4 本起每新增開發 1 本電子書需支付 $330 USDT 開發費！`
            },
            { status: 402 }
          );
        }
        profile.book_created_count = myBooksCount + 1;
      }

      const now = new Date().toISOString();
      const updatedBook: EBookProject = {
        ...book,
        status: submitForReview ? 'PENDING_REVIEW' : (book.status || 'DRAFT'),
        submitted_at: submitForReview ? now : book.submitted_at,
        updated_at: now,
        created_at: book.created_at || now
      };

      if (existingIdx >= 0) {
        store.books[existingIdx] = updatedBook;
      } else {
        store.books.unshift(updatedBook);
      }

      await saveCloudStore(store);
      return NextResponse.json({
        success: true,
        book: updatedBook,
        profile,
        message: submitForReview
          ? '✅ 已成功送交總管理後台進行「書審」！書審時間為 3~7 個工作天，審核通過後將自動上架並啟動 AI 自動來客系統幫您打廣告！'
          : '✅ 電子書草稿與模版設定已儲存！您現在可隨時點擊「自行下載電子書」導出檔案。'
      });
    }

    // 3. 加購電子書配額 ($330 / 本) 或 次年續約維護費 ($330 享 100% 倒抵 10% 服務費)
    if (action === 'upgrade_quota_or_renew') {
      const { authorKey, upgradeType } = body;
      const key = (authorKey || 'demo_author').toLowerCase();
      if (!store.franchisees[key]) {
        store.franchisees[key] = { ...DEFAULT_STORE.franchisees['demo_author'], wallet_address: key };
      }
      const profile = store.franchisees[key];

      if (upgradeType === 'ADD_1_BOOK_330') {
        profile.book_quota_total += 1;
      } else if (upgradeType === 'RENEW_YEAR2_330') {
        profile.plan_status = 'ACTIVE_RENEWED';
        profile.fee_credit_balance += 330; // 次年 $330 一樣先收費後 100% 抵扣交易 1 成服務費
        profile.expires_at = new Date(Date.now() + 365 * 86400000).toISOString();
      }

      await saveCloudStore(store);
      return NextResponse.json({ success: true, profile });
    }

    // 4. 總管理員後台 (/admin/franchise) 書審操作：核准上架 / 退回修改 / 判定禁書封號不退費
    if (action === 'admin_review_book') {
      const { bookId, decision, reviewNote } = body as {
        bookId: string;
        decision: 'APPROVE' | 'REJECT_BANNED' | 'RETURN_DRAFT';
        reviewNote?: string;
      };

      const idx = store.books.findIndex(b => b.id === bookId);
      if (idx === -1) {
        return NextResponse.json({ success: false, error: '找不到該本電子書' }, { status: 404 });
      }

      const targetBook = store.books[idx];
      const authorKey = (targetBook.author_wallet || targetBook.author_email || 'demo_author').toLowerCase();

      if (decision === 'APPROVE') {
        targetBook.status = 'APPROVED_PUBLISHED';
        targetBook.reviewed_at = new Date().toISOString();
        targetBook.review_note = reviewNote || '書審通過（已納入 AI 自動來客廣告排程）';
      } else if (decision === 'RETURN_DRAFT') {
        targetBook.status = 'DRAFT';
        targetBook.reviewed_at = new Date().toISOString();
        targetBook.review_note = reviewNote || '請依管理員建議微調內容後再次送審';
      } else if (decision === 'REJECT_BANNED') {
        targetBook.status = 'REJECTED_BANNED';
        targetBook.reviewed_at = new Date().toISOString();
        targetBook.review_note = reviewNote || '🚨 違反全球 10 大禁書條款或遭檢舉查證屬實，強制下架且依切結條款一律不予退費！';
        if (store.franchisees[authorKey]) {
          store.franchisees[authorKey].plan_status = 'BANNED_NO_REFUND';
          store.franchisees[authorKey].fee_credit_balance = 0;
          store.franchisees[authorKey].ai_traffic_enabled = false;
        }
      }

      await saveCloudStore(store);
      return NextResponse.json({ success: true, book: targetBook, store });
    }

    // 5. 模擬讀者購買電子書 ➔ 觸發「10% 系統服務費（含提款與推廣服務費，由 $990/$330 抵用金 100% 倒抵）+ 25% 推廣聯盟服務費支出」結算器
    if (action === 'simulate_reader_purchase') {
      const { bookId, amountUsdt } = body;
      const book = store.books.find(b => b.id === bookId);
      if (!book) {
        return NextResponse.json({ success: false, error: '找不到書籍' }, { status: 404 });
      }

      const authorKey = (book.author_wallet || book.author_email || 'demo_author').toLowerCase();
      const profile = store.franchisees[authorKey] || store.franchisees['demo_author'];

      const price = Number(amountUsdt || book.price_single_usdt || 39);
      const standardPlatformFee10Pct = Number((price * 0.1).toFixed(2)); // 1 成系統服務費 (含提款服務費及推廣服務費)
      const affiliateFee25Pct = Number((price * 0.25).toFixed(2));       // 25% 推廣聯盟服務費支出 (10%級差+10%對等+5%全球分紅)

      let deductedFromCredit = 0;
      let actualPlatformFeeCharged = 0;

      if (profile.fee_credit_balance >= standardPlatformFee10Pct) {
        deductedFromCredit = standardPlatformFee10Pct;
        profile.fee_credit_balance = Number((profile.fee_credit_balance - standardPlatformFee10Pct).toFixed(2));
        actualPlatformFeeCharged = 0; // 倒抵期間享 0% 系統服務費抽成
      } else if (profile.fee_credit_balance > 0) {
        deductedFromCredit = profile.fee_credit_balance;
        actualPlatformFeeCharged = Number((standardPlatformFee10Pct - profile.fee_credit_balance).toFixed(2));
        profile.fee_credit_balance = 0;
      } else {
        actualPlatformFeeCharged = standardPlatformFee10Pct;
      }

      profile.total_sales_usdt = Number((profile.total_sales_usdt + price).toFixed(2));
      await saveCloudStore(store);

      return NextResponse.json({
        success: true,
        settlement: {
          orderAmount: price,
          originalFee10Pct: standardPlatformFee10Pct,
          affiliateFee25Pct,
          deductedFromCredit,
          actualPlatformFeeCharged,
          authorNetReceived: Number((price - actualPlatformFeeCharged - affiliateFee25Pct).toFixed(2)),
          remainingCreditBalance: profile.fee_credit_balance
        },
        profile
      });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
