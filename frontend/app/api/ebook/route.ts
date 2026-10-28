import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';
import crypto from 'crypto';
import { EBookProject, FranchiseeProfile, scanBannedContent, generateStandaloneEBookHTML } from '@/lib/ebookEngine';
import { putObjectToDedicatedR2, R2_PRIMARY_PUBLIC_DOMAIN, R2_DEV_PUBLIC_DOMAIN } from '@/lib/r2Storage';

// 🤖 旗艦級電子書大腦模型序列 (優先採用 Google 4 Argon 系列，若遇更新或特定環境自動彈性容錯至最新旗艦序列)
const EBOOK_AI_MODEL_SEQUENCE = [
  'gemini-2.5-pro',      // 次世代旗艦級推理大腦 (具備聯網與深度文筆)
  'gemini-2.5-flash',    // 極速備援大腦
  'gemini-2.0-flash'
];

async function generateEBookAIWithFallback(contents: any[], tools?: any[]) {
  let lastError;
  for (const model of EBOOK_AI_MODEL_SEQUENCE) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          temperature: 0.7,
          ...(tools && tools.length > 0 ? { tools } : {})
        }
      });
      return { response, usedModel: model };
    } catch (err: any) {
      lastError = err;
      console.warn(`[EBook AI] Model ${model} failed, trying next...:`, err.message);
    }
  }
  throw lastError;
}

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
      payout_wallet: '0xea693e358f1527f8aa6563c9f6ebd42e37ee14fc',
      payout_bank: '808 玉山銀行 / 戶名：微享智能科技 / 帳號：0123-4567-8901',
      payout_requested_usdt: 0,
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
      title_zh_cn: 'Antigravity × Remotion 全自动印钞级影音与电子书实战指南',
      title_en: 'Antigravity × Remotion Automated Video & E-Book Practical Guide',
      title_ja: 'Antigravity × Remotion 全自動動画＆電子書籍実践バイブル',
      title_vi: 'Antigravity × Remotion Cẩm nang Thực chiến Video & E-Book Tự động Hóa',
      title_id: 'Antigravity × Remotion Panduan Praktis Video & E-Book Otomatis',
      subtitle_zh: '掌握 AI 自動來客矩陣與 100% 倒抵零風險變現核心秘密',
      subtitle_zh_cn: '掌握 AI 自动来客矩阵与 100% 倒抵零风险变现核心秘密',
      subtitle_en: 'Master the AI Traffic Matrix and 100% Fee-Credit Monetization System',
      subtitle_ja: 'AI自動集客マトリクスと100%相殺ノーリスク収益化の極意',
      subtitle_vi: 'Làm chủ Ma trận Lưu lượng AI & Hệ thống Hoàn vốn 100% Không Rủi ro',
      subtitle_id: 'Kuasai Matriks Trafik AI dan Sistem Pengurangan Biaya 100% Bebas Risiko',
      lang_pair: 'ZH_EN',
      theme_id: 'tech_blue',
      bilingual_mode: true,
      price_single_usdt: 39,
      price_monthly_sub_usdt: 15,
      status: 'APPROVED_PUBLISHED',
      cover_image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      r2_published_urls: {
        primary_url: 'https://1.5208.uk/ebooks/ebook-demo-001/master_bilingual.html',
        mirror_url: 'https://pub-2006e181b8544782b8d026affdaa34ab.r2.dev/ebooks/ebook-demo-001/master_bilingual.html',
        uploaded_at: '2026-10-27T08:00:00Z'
      },
      submitted_at: '2026-10-27T07:30:00Z',
      reviewed_at: '2026-10-27T08:00:00Z',
      review_note: '官方旗艦示範多語系電子書（書審通過）',
      created_at: '2026-10-27T07:00:00Z',
      updated_at: '2026-10-27T08:00:00Z',
      chapters: [
        {
          id: 'ch-1',
          title_zh: '第一章：為什麼知識創作者需要 AI 自動來客系統？',
          title_zh_cn: '第一章：为什么知识创作者需要 AI 自动来客系统？',
          title_en: 'Chapter 1: Why Creators Need the AI Auto-Traffic Matrix',
          title_ja: '第一章：なぜ知識起業家にAI自動集客マトリクスが必要なのか？',
          title_vi: 'Chương 1: Tại sao Người sáng tạo Kiến thức cần Hệ thống Lưu lượng AI?',
          title_id: 'Bab 1: Mengapa Kreator Pengetahuan Membutuhkan Matriks Trafik AI?',
          content_zh: '傳統寫書與出版最大的痛點，不是寫不出好內容，而是「排版外包昂貴」與「出版後沒有流量」。微享全球電子書 SaaS 結合首年 $990 合作方案，不僅讓您一鍵生成雙語精裝電子書，更直接協作「AI 自動來客系統」每天在全球社群幫您打廣告找客人！\n\n更重要的是，首年支付的 $990 與次年系統維護費 $450，皆享有 100% 先收後抵交易 1 成（10%）服務費的零風險保障。',
          content_zh_cn: '传统写书与出版最大的痛点，不是写不出好内容，而是“排版外包昂贵”与“出版后没有流量”。微享全球电子书 SaaS 结合首年 $990 合作方案，不仅让您一键生成双语精装电子书，更直接协作“AI 自动来客系统”每天在全球社群帮您打广告找客人！\n\n更重要的是，首年支付的 $990 与次年系统维护费 $450，皆享有 100% 先收后抵交易 1 成（10%）服务费的零风险保障。',
          content_en: 'The biggest pain point in traditional publishing is not writing, but expensive typesetting and zero traffic after launch. WeiXiang E-Book SaaS combines our $990 partnership plan with our AI Auto-Traffic Matrix to promote your books globally 24/7.\n\nEven better, both the first-year $990 fee and second-year $450 maintenance fee are 100% credited back against our 10% platform transaction fee.',
          content_ja: '従来の出版における最大の課題は執筆ではなく、「組版の外注費」と「出版後の集客力不足」です。WeiXiang電子書籍SaaSは、初年度$990の提携プランとAI自動集客システムを融合させ、24時間体制で書籍を世界中に宣伝します。\n\nさらに初年度の$990および次年度の保守費$450は、10%のシステム手数料から100%全額相殺されるノーリスク設計です。',
          content_vi: 'Điểm nghẽn lớn nhất trong xuất bản truyền thống không phải là viết, mà là chi phí dàn trang đắt đỏ và không có độc giả sau khi ra mắt. WeiXiang E-Book SaaS kết hợp gói hợp tác 990$ đầu tiên cùng Ma trận Lưu lượng AI để quảng bá sách của bạn 24/7 toàn cầu.\n\nQuan trọng hơn, cả khoản phí 990$ năm đầu và 450$ năm thứ hai đều được hoàn 100% cấn trừ vào 10% phí nền tảng giao dịch.',
          content_id: 'Kendala terbesar dalam penerbitan konvensional bukanlah penulisan, melainkan biaya layout yang mahal dan minimnya pembaca setelah rilis. WeiXiang E-Book SaaS menggabungkan paket kemitraan $990 tahun pertama dengan Matriks Trafik AI untuk mempromosikan buku Anda 24/7 secara global.\n\nLebih penting lagi, biaya $990 tahun pertama dan $450 tahun kedua 100% dapat dipotongkan dari biaya sistem transaksi 10%.',
          image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
          image_caption: 'AI 全自動流量裂變與 100% 倒抵生態圖',
          references: [{ title: 'Gartner Global AI Enterprise Report', url: 'https://www.gartner.com' }]
        },
        {
          id: 'ch-2',
          title_zh: '第二章：三級管理平台（管理員、加盟商、讀者訂閱）運作全解析',
          title_zh_cn: '第二章：三级管理平台（管理员、加盟商、读者订阅）运作全解析',
          title_en: 'Chapter 2: Three-Tier SaaS Architecture (Admin, Franchisee, Reader)',
          title_ja: '第二章：3層SaaS基盤（管理者・加盟店・読者購読）徹底解説',
          title_vi: 'Chương 2: Phân tích Toàn diện Kiến trúc SaaS Ba Cấp (Quản trị, Đối tác, Độc giả)',
          title_id: 'Bab 2: Analisis Mendalam Arsitektur SaaS Tiga Tingkat (Admin, Mitra, Pembaca)',
          content_zh: '在加盟商創作者工作台（/studio）中，您可以享有首年 3 本電子書免費開發配額（第 4 本起每本開發費 $360）。完成設定後，您可以立即「自行下載高解析 PDF 與網頁母檔」保存，並一鍵送交總管理後台進行 3~7 天書審。\n\n書審通過後，系統即刻為您開通 VIP 讀者防盜版線上書櫃與 25% 聯盟分潤裂變連結！',
          content_zh_cn: '在加盟商创作者工作台（/studio）中，您可以享有首年 3 本电子书免费开发配额（第 4 本起每本开发费 $360）。完成设定后，您可以立即“自行下载高解析 PDF 与网页母档”保存，并一键送交总管理后台进行 3~7 天书审。\n\n书审通过后，系统即刻为您开通 VIP 读者防盗版在线书柜与 25% 联盟分润裂变链接！',
          content_en: 'Inside the Franchisee Studio (/studio), your $990 plan includes 3 e-book development quotas ($360 per additional book from the 4th book). You can download master PDF/HTML files anytime and submit your book for our 3-7 day compliance review.\n\nOnce approved, your book goes live in the VIP Reader Bookstore with 25% affiliate viral sharing enabled!',
          content_ja: '加盟スタジオ（/studio）では初年度3冊分の開発枠が付与されます（4冊目以降は1冊$360）。マスターファイルを自由にダウンロードでき、3〜7日の審査完了後、VIP読者向け本棚へ即座に公開されます！',
          content_vi: 'Trong Bàn làm việc Tác giả Đối tác (/studio), gói 990$ bao gồm 3 hạn mức xuất bản sách (từ cuốn thứ 4 là 360$/cuốn). Sau khi cài đặt, bạn có thể tải ngay file master PDF/HTML và gửi duyệt 3-7 ngày.',
          content_id: 'Di dalam Studio Mitra (/studio), paket $990 mencakup 3 kuota buku (buku ke-4 dan seterusnya $360/buku). Anda dapat mengunduh master PDF/HTML kapan saja dan mengajukan peninjauan 3-7 hari.',
          image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
          image_caption: '三級 SaaS 權限管理與防盜版閱讀機制',
          references: [{ title: 'Harvard Business Review Digital Models', url: 'https://hbr.org' }]
        },
        {
          id: 'ch-3',
          title_zh: '第三章：Google 4 旗艦圖文編撰：打造 25+ 頁麥肯錫權威專書',
          title_zh_cn: '第三章：Google 4 旗舰图文编撰：打造 25+ 页麦肯锡权威专书',
          title_en: 'Chapter 3: Google 4 Authority Engine: Crafting 25+ Page Masterbooks',
          title_ja: '第三章：Google 4 エンジンによる25ページ超の権威的専門書構築',
          title_vi: 'Chương 3: Động cơ Google 4 Soạn thảo Trực quan: Tạo Sách Chuyên gia 25+ Trang',
          title_id: 'Bab 3: Mesin Google 4 Ilustrasi: Menyusun Buku Otoritas 25+ Halaman',
          content_zh: '真正的暢銷力建立在專業深度與結構化思考。系統全面搭載 Google 4 旗艦智能總編纂大腦，自動整合 8 大深度篇章、權威學術引用與精美商業插圖建議，一鍵產出 8,000~10,000 字具備全球出版等級之頂級專著。',
          content_zh_cn: '真正的畅销力建立在专业深度与结构化思考。系统全面搭载 Google 4 旗舰智能总编纂大脑，自动整合 8 大深度篇章、权威学术引用与精美商业插图建议，一键产出 8,000~10,000 字具备全球出版等级之顶级专著。',
          content_en: 'True authority relies on structured depth. Powered by Google 4 flagship intelligence, our engine automatically weaves 8 deep chapters, citations, and business diagrams into 25+ page publications.',
          content_ja: 'Google 4 旗艦エンジンを搭載し、8つの本格章立て、学術的引用、ビジネス図解を網羅した8,000〜10,000字（25ページ超）の専門書を瞬時に編纂します。',
          content_vi: 'Sức mạnh bán chạy thực sự đến từ chiều sâu và tư duy cấu trúc. Tích hợp AI Google 4 cao cấp, tự động tổng hợp 8 chương sâu sắc, tài liệu tham khảo học thuật và sơ đồ kinh doanh chuẩn toàn cầu.',
          content_id: 'Kekuatan buku terlaris sejati terletak pada kedalaman profesional dan pemikiran terstruktur. Didukung AI Google 4, secara otomatis merangkum 8 bab mendalam, sitasi akademis, dan diagram bisnis berkualitas global.',
          image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
          image_caption: '麥肯錫結構化論述與多維數據引用架構',
          references: [{ title: 'MIT Technology Review Systems Guide', url: 'https://www.technologyreview.com' }]
        },
        {
          id: 'ch-4',
          title_zh: '第四章：25% 聯盟裂變與加盟商收款提現全自動化',
          title_zh_cn: '第四章：25% 联盟裂变与加盟商收款提现全自动化',
          title_en: 'Chapter 4: 25% Affiliate Viral Engine & Automated Franchisee Payouts',
          title_ja: '第四章：25%アフィリエイト分配と加盟店向け自動出金システム',
          title_vi: 'Chương 4: Động cơ Lan tỏa Liên kết 25% & Tự động Hóa Rút tiền cho Đối tác',
          title_id: 'Bab 4: Mesin Afiliasi Viral 25% & Penarikan Dana Otomatis untuk Mitra',
          content_zh: '每筆讀者購書訂單（單本買斷 $39 或 VIP 月閱 $15）均自動撥出 25% 推廣服務費，即使是無推薦碼之自然流量訪客，系統亦自動綁定最高 10% 級差領袖！加盟商隨時可綁定 Polygon USDT 錢包或銀行帳號申請一鍵出金提現。',
          content_zh_cn: '每笔读者购书订单（单本买断 $39 或 VIP 月阅 $15）均自动拨出 25% 推广服务费，即使是无推荐码之自然流量访客，系统亦自动绑定最高 10% 级差领袖！加盟商随时可绑定 Polygon USDT 钱包或银行账号申请一键出金提现。',
          content_en: 'Every order distributes a 25% affiliate commission. Organic visitors are automatically bound to top-tier leaders! Franchisees can bind Polygon USDT wallets or bank accounts for 1-click withdrawals.',
          content_ja: 'すべての注文に対して25%のアフィリエイト手数料が自動分配されます。自然流入の訪問者も最高10%リーダーに自動紐付け！加盟店はPolygon USDTウォレットや銀行口座を登録し、いつでも出金申請が可能です。',
          content_vi: 'Mỗi đơn mua sách đều tự động trích 25% hoa hồng tiếp thị liên kết. Khách truy cập tự nhiên không có mã giới thiệu sẽ tự động liên kết với thủ lĩnh 10% cao nhất! Đối tác có thể rút USDT Polygon hoặc tài khoản ngân hàng bất cứ lúc nào.',
          content_id: 'Setiap pesanan buku otomatis membagikan komisi afiliasi 25%. Pengunjung organik tanpa kode referensi otomatis diikat ke pemimpin tingkat atas 10%! Mitra dapat mengikat dompet Polygon USDT atau rekening bank untuk penarikan instan.',
          image_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
          image_caption: '25% 聯盟分潤與零人工干預出金鏈路',
          references: [{ title: 'Journal of Marketing Research Viral Models', url: 'https://journals.sagepub.com' }]
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
      const parsedStore: EBookCloudStore = JSON.parse(data.roi_text.slice(STORE_PREFIX.length));
      if (parsedStore && Array.isArray(parsedStore.books)) {
        parsedStore.books = parsedStore.books.map((b: EBookProject) => {
          if (b.id === 'ebook-demo-001') {
            const defBook = DEFAULT_STORE.books[0];
            return {
              ...defBook,
              ...b,
              title_zh_cn: b.title_zh_cn || defBook.title_zh_cn,
              title_ja: b.title_ja || defBook.title_ja,
              title_vi: b.title_vi || defBook.title_vi,
              title_id: b.title_id || defBook.title_id,
              subtitle_zh_cn: b.subtitle_zh_cn || defBook.subtitle_zh_cn,
              subtitle_ja: b.subtitle_ja || defBook.subtitle_ja,
              subtitle_vi: b.subtitle_vi || defBook.subtitle_vi,
              subtitle_id: b.subtitle_id || defBook.subtitle_id,
              chapters: defBook.chapters.map((defCh, idx) => {
                const existingCh = b.chapters?.[idx];
                return existingCh ? {
                  ...defCh,
                  ...existingCh,
                  title_zh_cn: existingCh.title_zh_cn || defCh.title_zh_cn,
                  title_ja: existingCh.title_ja || defCh.title_ja,
                  title_vi: existingCh.title_vi || defCh.title_vi,
                  title_id: existingCh.title_id || defCh.title_id,
                  content_zh_cn: existingCh.content_zh_cn || defCh.content_zh_cn,
                  content_ja: existingCh.content_ja || defCh.content_ja,
                  content_vi: existingCh.content_vi || defCh.content_vi,
                  content_id: existingCh.content_id || defCh.content_id,
                  image_url: existingCh.image_url || defCh.image_url,
                  image_caption: existingCh.image_caption || defCh.image_caption,
                  references: existingCh.references || defCh.references
                } : defCh;
              })
            };
          }
          return b;
        });
      }
      return parsedStore;
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

    // 1. AI 智慧擴寫與多語系自動翻譯 (支援自選語系對：繁中/英 ZH_EN、日/英 JA_EN、繁中/日 ZH_JA)
    if (action === 'ai_generate_chapter') {
      const { bookTitle, chapterTitle, outlineNotes, langPair = 'ZH_EN' } = body;

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
            title_ja: 'AI実践チャプター',
            content_zh: `【系統展示生成】針對「${outlineNotes || chapterTitle}」的深度解析：\n透過微享自動電子書模版引擎，創作者能夠將核心知識迅速結構化，並自動轉化為高價值數位資產。`,
            content_en: `[System Generated] In-depth analysis on "${outlineNotes || chapterTitle}":\nWith the WeiXiang Automated E-Book Template Engine, creators can rapidly structure core knowledge into high-value digital assets.`,
            content_ja: `【自動生成サンプル】「${outlineNotes || chapterTitle}」の徹底解説：\nWeiXiang自動電子書籍エンジンにより、コアな知見を迅速に体系化し、高価値なデジタル資産へと自動変換します。`,
            image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
            image_caption: 'AI 數位資產與自動化獲客流程視覺圖解',
            references: [
              { title: 'McKinsey & Company: The Economic Potential of Generative AI', url: 'https://www.mckinsey.com' }
            ]
          }
        });
      }

      const langRuleDesc =
        langPair === 'JA_EN'
          ? '請產出「高水準商務日文（敬語體，約 600~900 字）」與「專業地道英文」雙語對照版，回傳包含 title_ja, title_en, content_ja, content_en。'
          : langPair === 'ZH_JA'
          ? '請產出「繁體中文」與「高水準商務日文」雙語對照版，回傳包含 title_zh, title_ja, content_zh, content_ja。'
          : '請產出「繁體中文」與「專業英文」雙語對照版，回傳包含 title_zh, title_en, content_zh, content_en。';

      const prompt = `你是一位頂級國際商業出版總編輯。請使用最新旗艦智能模型，根據以下主題，撰寫一個具備「圖文專業型」高水準的電子書章節。
語系設定：${langRuleDesc}
要求：
1. 內容嚴謹、富含行業乾貨與權威數據。
2. 同時提供兩語系專業對照版本，段落間以 \\n 分隔。
3. 提供符合本章主題的高質感商業插圖建議圖說 (image_caption)，以及 1~2 個權威參考資料來源 (references)。
書名：${bookTitle}
本章標題：${chapterTitle}
本章核心大綱與要點：${outlineNotes}

請嚴格以 JSON 格式回傳（不要加上 markdown code block），欄位格式：
{
  "title_zh": "繁體中文章節標題",
  "title_en": "Professional English Chapter Title",
  "title_ja": "プロフェッショナルな日本語章タイトル",
  "content_zh": "繁體中文章節正文",
  "content_en": "English chapter body",
  "content_ja": "日本語章本文（ビジネス敬語）",
  "image_caption": "章節專業圖說",
  "references": [
    { "title": "權威報告或文獻名稱", "url": "可選參考網址" }
  ]
}`;

      let parsed: any;
      try {
        const { response } = await generateEBookAIWithFallback([
          { role: 'user', parts: [{ text: prompt }] }
        ]);
        const rawText = (response.text || '').replace(/```json/g, '').replace(/```/g, '').trim();
        parsed = JSON.parse(rawText);
      } catch (e: any) {
        parsed = {
          title_zh: chapterTitle,
          title_en: chapterTitle,
          title_ja: chapterTitle,
          content_zh: `【自動生成】針對 ${chapterTitle} 的深度觀點解析。\n本章探討核心商業架構與實操落地方法。`,
          content_en: `[Auto-generated] In-depth analysis for ${chapterTitle}. Exploring core frameworks and implementation methods.`,
          content_ja: `【自動生成】${chapterTitle}に関する徹底考察。\n本章ではコアなビジネス構造と実装手順を詳解します。`,
          image_caption: '商業圖解架構示意圖'
        };
      }

      // 自動配置高解析商務預設圖 (亦支援加盟商自行更換或上傳至專屬 R2)
      if (!parsed.image_url) {
        const defaultImgs = [
          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80'
        ];
        parsed.image_url = defaultImgs[Math.floor(Math.random() * defaultImgs.length)];
      }

      return NextResponse.json({ success: true, chapter: parsed });
    }

    // 1B. AI 一鍵全書自動編撰引擎 (Google 4 旗艦圖文型專業電子書：8大深度篇章、8,000~10,000字、25頁以上全球權威暢銷書規格，支援多語系自選對：繁中/英 ZH_EN、日/英 JA_EN、繁中/日 ZH_JA)
    if (action === 'ai_generate_full_book') {
      const { bookTitle, bookSubtitle, topicSummary, langPair = 'ZH_EN' } = body;

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

      const sampleImages = [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80'
      ];

      // 若未配置 API Key，提供達標 25+ 頁規格的 8 大章節全球頂級暢銷示範書 (自動根據 langPair 帶入對應語系)
      if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json({
          success: true,
          bookMeta: {
            title_zh: bookTitle || 'AI 自動化來客實戰聖經：打造全天候自動化數位資產',
            title_en: 'The AI Automated Traffic Bible: Building 24/7 Digital Assets & Scalable Revenue',
            title_ja: 'AI自動化集客実践バイブル：24時間稼働型デジタル資産構築論',
            subtitle_zh: bookSubtitle || '全球頂級暢銷作家與麥肯錫顧問實戰心法・25頁深度權威專書',
            subtitle_en: 'Authority Playbook by Global Bestselling Authors & Strategic Consultants',
            subtitle_ja: '世界的ベストセラー作家と戦略コンサルタント直伝・25ページ超の権威的専門書',
            lang_pair: langPair,
            cover_image_url: sampleImages[0]
          },
          chapters: [
            {
              id: `ch-${Date.now()}-1`,
              title_zh: '第一章：全球產業範式轉移與破局心智',
              title_en: 'Chapter 1: Global Paradigm Shift & Core Breakthrough Mindset',
              title_ja: '第一章：グローバルパラダイムシフトとブレークスルー思考',
              content_zh: `在人工智慧與演算法重塑全球經濟的時代，針對「${topicSummary || bookTitle}」，傳統的勞力投入已遭遇邊際報酬遞減的嚴峻瓶頸。\n\n本章深入拆解全球最新商業動能，剖析企業與個人創作者如何擺脫低效競爭，從底層邏輯重構數位價值鏈。透過高維度認知躍遷，讀者將能精確鎖定利基市場，將每一次互動轉化為長期數位品牌資產。`,
              content_en: `In the era of AI and algorithmic disruption, focusing on "${topicSummary || bookTitle}", traditional labor input faces diminishing returns.\n\nThis chapter dissects modern commercial dynamics, revealing how creators break through low-efficiency competition to rebuild scalable digital assets.`,
              content_ja: `AIとアルゴリズムが世界経済を再構築する現代において、「${topicSummary || bookTitle}」を軸とした従来の労働投下モデルは急速に限界を迎えています。\n\n本章では最新の国際ビジネス潮流を解剖し、個人クリエイターや企業が消耗戦を脱却し、デジタル価値の連鎖を再構築するための根本的アプローチを明かします。`,
              image_url: sampleImages[1],
              image_caption: '圖1-1：全球產業範式躍遷與指數級成長破局曲線',
              references: [{ title: 'Gartner Emerging Tech & AI Trends Report', url: 'https://www.gartner.com' }]
            },
            {
              id: `ch-${Date.now()}-2`,
              title_zh: '第二章：底層架構心法與價值主張設計',
              title_en: 'Chapter 2: Foundational Principles & High-Value Proposition Design',
              title_ja: '第二章：基盤アーキテクチャと思考法・提供価値の設計',
              content_zh: '任何成功的自動化系統，其核心都在於不可替代的價值主張。\n\n我們引入麥肯錫 MECE 原則與全球暢銷書結構化寫作模型，帶領讀者提煉個人專業與品牌精華，建構具有高轉化率的產品磁鐵 (Lead Magnet) 與自動化引流鉤子。',
              content_en: 'At the heart of every sustainable automated system lies an irreplaceable value proposition.\n\nLeveraging McKinsey MECE frameworks, this chapter guides you in crafting high-conversion lead magnets and evergreen authority positioning.',
              content_ja: 'あらゆる自動化システムの成否は、代替不可能な提供価値の定義にかかっています。\n\nマッキンゼーのMECE原則を応用し、自身の知見を凝縮した高成約率のリードマグネットと自動集客の動線設計手法を伝授します。',
              image_url: sampleImages[2],
              image_caption: '圖2-1：麥肯錫 MECE 價值主張架構矩陣',
              references: [{ title: 'Harvard Business Review: The Elements of Value', url: 'https://hbr.org' }]
            },
            {
              id: `ch-${Date.now()}-3`,
              title_zh: '第三章：標準化執行 SOP 與核心落地路徑',
              title_en: 'Chapter 3: Standard Operating Procedures (SOP) & Execution Path',
              title_ja: '第三章：標準業務手順（SOP）と確実な実装ロードマップ',
              content_zh: '將宏觀戰略拆解為模組化、可標準化複製的微小日常動作。\n\n本章詳細提供「從零建構數位電子書與自動發貨通道」的四步落地法，涵蓋選題驗證、內容生長、排版美化到金流自動交付，讓專業知識化為永動的被動營收機器。',
              content_en: 'Transforming macro strategies into modular, replicable daily actions.\n\nHere is a 4-step SOP for digital e-book creation and automated fulfillment, ensuring passive value generation around the clock.',
              content_ja: '大局的な戦略を標準化・再現可能な日々のタスクへと分解します。\n\n電子書籍の企画からコンテンツ生成、デザイン、自動決済・納品までの4ステップを体系化し、知識の自動収益化基盤を構築します。',
              image_url: sampleImages[3],
              image_caption: '圖3-1：數位資產端到端標準化 SOP 交付鏈路',
              references: [{ title: 'MIT Technology Review: Enterprise AI Implementations', url: 'https://www.technologyreview.com' }]
            },
            {
              id: `ch-${Date.now()}-4`,
              title_zh: '第四章：AI 與自動化矩陣的槓桿賦能',
              title_en: 'Chapter 4: AI Matrix Leverage & Multi-Channel Traffic Flywheel',
              title_ja: '第四章：AIと自動化マトリクスによるレバレッジ最大化',
              content_zh: '單打獨鬥的時代已經過去，一人公司也能具備跨國媒體集團的產能。\n\n本章揭秘微享 24H AI 自動來客系統的運作架構：如何透過短影音矩陣 (t6/t7/t8)、社群長文案池以及 24 小時在線的智能客服代理，將全網注意力全天候導流至電子書專屬下單頁面。',
              content_en: 'Solo creators can now possess the productive leverage of a media conglomerate.\n\nExplore how WeiXiang AI Traffic Matrix activates continuous multi-channel exposure and routes qualified traffic to your e-book funnels.',
              content_ja: '個人でもメディア企業に匹敵する生産力を持つ時代です。\n\nショート動画マトリクス（t6/t7/t8）やSNS記事プール、24時間稼働のAI接客エージェントを活用し、全自動で集客と販売を完結させる仕組みを解説します。',
              image_url: sampleImages[4],
              image_caption: '圖4-1：24H AI 短影音與社群多渠道流量飛輪架構',
              references: [{ title: 'Stanford AI Index: Annual Performance & Multi-Modal Leverage', url: 'https://aiindex.stanford.edu' }]
            },
            {
              id: `ch-${Date.now()}-5`,
              title_zh: '第五章：實戰案例拆解與數據實證分析',
              title_en: 'Chapter 5: Real-World Case Studies & Empirical Data Verification',
              title_ja: '第五章：実践事例の徹底解剖と実証データ分析',
              content_zh: '數字說真話。我們挑選三個真實成功案例（知識顧問、電商培訓師、身心靈創作者），詳解他們如何自首日啟動，在 30 天內完成超過 500 筆自動訂單交付。\n\n從點擊率、閱讀完成度到推薦人轉化率，各維度數據巨細靡遺公諸於世。',
              content_en: 'Numbers tell the truth. We dissect three empirical case studies achieving over 500 automated orders within 30 days.\n\nFrom CTR to reader retention and referral conversions, every metric is thoroughly analyzed.',
              content_ja: '実績データに基づき、コンサルタントや教育事業者が導入初月から500件超の自動販売を達成したプロセスを分析。\n\nクリック率や読了率、紹介コンバージョン率など実数値を完全公開します。',
              image_url: sampleImages[5],
              image_caption: '圖5-1：30天獲客轉化率與讀者留存漏斗數據圖',
              references: [{ title: 'Statista Global E-Book & Digital Education Growth Report', url: 'https://www.statista.com' }]
            },
            {
              id: `ch-${Date.now()}-6`,
              title_zh: '第六章：常見陷阱避坑指南與風險防控',
              title_en: 'Chapter 6: Critical Pitfalls, Anti-Fragility & Risk Mitigation',
              title_ja: '第六章：陥りがちな罠の回避とリスクヘッジ防壁',
              content_zh: '在追逐自動化紅利的同時，絕不可忽視版權合規與內容風控。\n\n本章深入解析全球 10 大禁書紅線與平台審核規則，教導創作者如何建立反脆弱防線，避免帳號封鎖、被惡意投訴或遭遇退款紛爭，確保資產安全與長青經營。',
              content_en: 'While pursuing automation dividends, compliance and risk control remain non-negotiable.\n\nThis chapter outlines global content safety standards, helping you build anti-fragile operations free from platform suspensions.',
              content_ja: '収益化を進める上で、著作権遵守とリスク管理は必須です。\n\n禁止コンテンツの基準や審査基準を網羅し、アカウント停止やトラブルを未然に防ぐ堅牢な運用基盤の作り方を提示します。',
              image_url: sampleImages[6],
              image_caption: '圖6-1：合規防護與反脆弱長青運維防線圖',
              references: [{ title: 'WIPO: Intellectual Property & Digital Copyright Guidelines', url: 'https://www.wipo.int' }]
            },
            {
              id: `ch-${Date.now()}-7`,
              title_zh: '第七章：25% 聯盟裂變與長期商業變現閉環',
              title_en: 'Chapter 7: 25% Affiliate Viral Engine & Exponential Monetization',
              title_ja: '第七章：25%アフィリエイト連動とバイラル成長モデル',
              content_zh: '好的作品不該默默無聞。微享電子書系統獨創 25% 聯盟推廣分潤架構（10% 級差 + 10% 對等 + 5% 全球領袖均分）與 10% 系統服務費 100% 倒抵機制。\n\n每一位購買並受惠的讀者，都能無縫化身為您的利益共同體，推動裂變指數級擴散。',
              content_en: 'Great works deserve exponential reach. Discover how the 25% affiliate commission structure and 100% credit rebate align reader incentives with your scalable growth.',
              content_ja: '優れた知見を広く届けるための25%アフィリエイト分配設計（10%差額＋10%マッチング＋5%プール）と100%手数料相殺モデルのシナジーを詳解。\n\n読者が自然と推奨者へと変わる循環を生み出します。',
              image_url: sampleImages[7],
              image_caption: '圖7-1：微享 25% 聯盟推廣與 100% 倒抵閉環模型',
              references: [{ title: 'Journal of Marketing Research: Viral Incentive Mechanisms', url: 'https://journals.sagepub.com' }]
            },
            {
              id: `ch-${Date.now()}-8`,
              title_zh: '第八章：未來藍圖展望與 30 天大師行動清單',
              title_en: 'Chapter 8: Future Horizon & 30-Day Master Action Checklist',
              title_ja: '第八章：次世代の展望と30日マスターアクションプラン',
              content_zh: '行動是通往成功的唯一橋樑。本章總結全書智慧，為讀者制定專屬的 30 天每日落實行動清單。\n\n只要依照步驟穩健推進，下一個月，您將親自見證第一筆全自動被動收入通知響起的感動瞬間。',
              content_en: 'Action is the foundational key to all success. We summarize the master principles into a concrete 30-day implementation calendar.\n\nExecute day by day, and witness your first automated passive revenue notification within weeks.',
              content_ja: '知見を実行に移すための30日間デイリーアクションリスト。\n\nステップバイステップで確実に進めることで、翌月には完全自動の収益通知を受け取る感動を実感できます。',
              image_url: sampleImages[8],
              image_caption: '圖8-1：30天自動化數位資產落地執行時間軸',
              references: [{ title: 'McKinsey Global Institute: The Future of Automation and Work', url: 'https://www.mckinsey.com' }]
            }
          ]
        });
      }

      const langRuleDesc =
        langPair === 'JA_EN'
          ? '請編撰「高水準商務日文（敬語體，每章 800~1,200 字，content_ja）」與「專業地道英文（content_en）」雙語對照版，回傳包含 title_ja, title_en, subtitle_ja, subtitle_en 以及各章節的 title_ja, title_en, content_ja, content_en。'
          : langPair === 'ZH_JA'
          ? '請編撰「繁體中文（每章 800~1,200 字，content_zh）」與「高水準商務日文（content_ja）」雙語對照版，回傳包含 title_zh, title_ja, subtitle_zh, subtitle_ja 以及各章節的 title_zh, title_ja, content_zh, content_ja。'
          : '請編撰「繁體中文（每章 800~1,200 字，content_zh）」與「專業地道英文（每章 500~800 字，content_en）」雙語對照版，回傳包含 title_zh, title_en, subtitle_zh, subtitle_en 以及各章節的 title_zh, title_en, content_zh, content_en。';

      const fullPrompt = `你是由全球頂級暢銷書作者（如《Atomic Habits》《Zero to One》暢銷榜作家）與麥肯錫全球資深顧問合體之【Google 4 旗艦級全球出版總編纂 AI 代理】。
你的最高任務是根據作者指定的主題，撰寫一本具備全球權威、頂尖暢銷力、商業轉化力與【25 頁以上專業體量】的「圖文型專業電子書」。
語系要求：${langRuleDesc}

嚴格寫作規格要求：
1. 必須嚴格編撰【8 個核心深度篇章】（Chapter 1 至 Chapter 8），結構完整嚴密，層層遞進。
2. 章節內涵豐富、數據詳實、金句頻出、論證嚴密，段落間以 \\n\\n 分隔。
3. 每個章節必須指定 1 個精準具體的專業圖表/圖解說明（image_caption，例如「圖1-1：...」）。
4. 每個章節必須提供 1~2 個真實且權威的文獻出處或國際權威機構參照（references，含 title 與 url）。
5. 全書需達到 8,000 ~ 10,000 字體量，排版後穩定達到 25~35 頁權威專書體量。

作者指定書名：${bookTitle}
作者指定副標或方向：${bookSubtitle || ''}
全書核心主題與重點描述：${topicSummary || bookTitle}

請嚴格以純 JSON 格式回傳（嚴禁在最外層包含任何 markdown 標籤如 \`\`\`json 或任何其他文字說明），JSON 結構如下：
{
  "title_zh": "繁體中文主書名",
  "title_en": "Professional Bestselling English Main Title",
  "title_ja": "日本語メインタイトル",
  "subtitle_zh": "繁體中文副標題",
  "subtitle_en": "Compelling High-Converting English Subtitle",
  "subtitle_ja": "日本語サブタイトル",
  "chapters": [
    {
      "title_zh": "第一章：產業痛點與全球宏觀趨勢破局",
      "title_en": "Chapter 1: Global Paradigm Shift & Industry Pain Points",
      "title_ja": "第一章：世界的パラダイムシフトと課題解決",
      "content_zh": "第一章繁體中文正文（800~1,200字，以 \\n\\n 分段）",
      "content_en": "Chapter 1 complete English content (500~800 words, separated by \\n\\n)",
      "content_ja": "第一章日本語本文（ビジネス敬語）",
      "image_caption": "圖1-1：產業演進與破局成長曲線圖解",
      "references": [{ "title": "Gartner Emerging Trends Report", "url": "https://www.gartner.com" }]
    }
  ]
}`;

      let parsed: any;
      try {
        const { response } = await generateEBookAIWithFallback([
          { role: 'user', parts: [{ text: fullPrompt }] }
        ]);
        const rawText = (response.text || '').replace(/```json/g, '').replace(/```/g, '').trim();
        parsed = JSON.parse(rawText);
      } catch (err: any) {
        parsed = {
          title_zh: bookTitle,
          title_en: bookTitle,
          title_ja: bookTitle,
          subtitle_zh: bookSubtitle || 'Google 4 旗艦圖文專業指南',
          subtitle_en: 'Google 4 Illustrated Professional Authority Guide',
          subtitle_ja: 'Google 4 専門電子書籍ガイド',
          chapters: [
            {
              title_zh: '第一章：破局思維與趨勢',
              title_en: 'Chapter 1: Trends & Mindset',
              title_ja: '第一章：突破思考と潮流',
              content_zh: `針對 ${bookTitle} 的全面解析。\n\n建立自動化獲客資產與專業品牌聲望。`,
              content_en: `Comprehensive analysis for ${bookTitle}.\n\nBuilding automated traffic assets and brand prestige.`,
              content_ja: `${bookTitle}に関する包括的考察。\n\n自動集客資産とブランド価値を構築します。`,
              image_caption: '圖1-1：商業破局架構圖',
              references: [{ title: 'Gartner Tech Report', url: 'https://www.gartner.com' }]
            }
          ]
        };
      }

      const chapters = (parsed.chapters || []).map((c: any, i: number) => ({
        id: `ch-${Date.now()}-${i + 1}`,
        title_zh: c.title_zh || c.title_ja || c.title_en || `第 ${i + 1} 章`,
        title_en: c.title_en || c.title_zh || `Chapter ${i + 1}`,
        title_ja: c.title_ja || c.title_zh || `第 ${i + 1} 章`,
        content_zh: c.content_zh || '',
        content_en: c.content_en || '',
        content_ja: c.content_ja || '',
        image_url: sampleImages[(i + 1) % sampleImages.length],
        image_caption: c.image_caption || `圖${i + 1}-1：專業商務架構解析圖`,
        references: c.references || [
          { title: 'Google Cloud & AI Industry Practical Whitepaper', url: 'https://cloud.google.com' }
        ]
      }));

      return NextResponse.json({
        success: true,
        bookMeta: {
          title_zh: parsed.title_zh || bookTitle,
          title_en: parsed.title_en || '',
          title_ja: parsed.title_ja || '',
          subtitle_zh: parsed.subtitle_zh || bookSubtitle,
          subtitle_en: parsed.subtitle_en || '',
          subtitle_ja: parsed.subtitle_ja || '',
          lang_pair: langPair,
          cover_image_url: sampleImages[0]
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

      // 若是新建書籍，檢查是否超過配額 (首年 $990 可開發 3 本，之後每本 $360)
      if (existingIdx === -1) {
        const myBooksCount = store.books.filter(
          b => (b.author_wallet || b.author_email || '').toLowerCase() === authorKey
        ).length;

        if (myBooksCount >= profile.book_quota_total) {
          return NextResponse.json(
            {
              success: false,
              needQuotaUpgrade: true,
              error: `📚 您的電子書開發配額已滿（目前已使用 ${myBooksCount} / ${profile.book_quota_total} 本）。首年 $990 方案含 3 本電子書開發，第 4 本起每新增開發 1 本電子書需支付 $360 USDT 開發費！`
            },
            { status: 402 }
          );
        }
        profile.book_created_count = myBooksCount + 1;
      }

      // 若是既有書籍進行修改（包含草稿修改、完稿或上架後再修改），嚴格檢查每本書 30 次免費修改上限（超過後每付 $30 修改費可修改 1 次）
      let currentEditCount = 0;
      let currentEditMax = book.edit_quota_max || 30;

      if (existingIdx >= 0) {
        const oldBook = store.books[existingIdx];
        currentEditCount = oldBook.edit_count ?? 0;
        currentEditMax = oldBook.edit_quota_max ?? 30;

        if (currentEditCount >= currentEditMax) {
          return NextResponse.json(
            {
              success: false,
              needEditFee30: true,
              error: `✏️ 本書修改次數已達上限（已修改 ${currentEditCount} / ${currentEditMax} 次，含完稿後再修改）。依規範每本電子書免費修改次數為 30 次，超過後需支付修改費 $30 USDT / 次（每支付 $30 可再修改 1 次）！`
            },
            { status: 402 }
          );
        }
        currentEditCount += 1;
      }

      const now = new Date().toISOString();
      const updatedBook: EBookProject = {
        ...book,
        edit_count: currentEditCount,
        edit_quota_max: currentEditMax,
        status: submitForReview ? 'PENDING_REVIEW' : (book.status || 'DRAFT'),
        submitted_at: submitForReview ? now : book.submitted_at,
        updated_at: now,
        created_at: book.created_at || now
      };

      // 自動將最新電子書 HTML 母檔同步上傳至專用 Cloudflare R2 儲存槽 (1.5208.uk / pub-2006e181b8544782b8d026affdaa34ab.r2.dev)
      try {
        const htmlContent = generateStandaloneEBookHTML(updatedBook, undefined, 'BILINGUAL');
        const r2Key = `ebooks/${updatedBook.id}/master_bilingual.html`;
        const r2Res = await putObjectToDedicatedR2(r2Key, Buffer.from(htmlContent, 'utf-8'), 'text/html; charset=utf-8');
        updatedBook.r2_published_urls = {
          primary_url: r2Res.primaryUrl,
          mirror_url: r2Res.mirrorUrl,
          uploaded_at: now
        };
      } catch (e) {
        console.warn('[Save EBook R2 Sync] warning:', e);
      }

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
          ? `✅ 已成功上傳至專用 R2 (${updatedBook.r2_published_urls?.primary_url}) 並送交總管理後台進行「書審」（本書累計修改次數：${currentEditCount} / ${currentEditMax} 次）！書審時間為 3~7 個工作天。`
          : `✅ 電子書修改已儲存並同步上傳至專用 R2 儲存槽（本書累計修改次數：${currentEditCount} / ${currentEditMax} 次，超過 ${currentEditMax} 次後需付修改費 $30 可再修改 1 次）！`
      });
    }

    // 2B. 加盟商上傳圖片或離線修改後之電子書檔案（含圖及文章等）至專用 R2 儲存槽 (1.5208.uk / pub-2006e181b8544782b8d026affdaa34ab.r2.dev)
    if (action === 'upload_asset_or_book_to_r2') {
      const { bookId, fileName, contentType, base64Data, isModifiedBookUpload, parsedBookData } = body as {
        bookId: string;
        fileName: string;
        contentType: string;
        base64Data: string;
        isModifiedBookUpload?: boolean;
        parsedBookData?: EBookProject;
      };

      const safeFileName = (fileName || `asset_${Date.now()}.bin`).replace(/[^a-zA-Z0-9._-]/g, '_');
      const r2Key = `ebooks/${bookId || 'shared'}/${Date.now()}_${safeFileName}`;
      const cleanBase64 = (base64Data || '').replace(/^data:[^;]+;base64,/, '');
      const fileBuffer = Buffer.from(cleanBase64, 'base64');

      const uploadRes = await putObjectToDedicatedR2(
        r2Key,
        fileBuffer,
        contentType || 'application/octet-stream'
      );

      // 若是加盟商「自行下載並修改後重新上傳電子書（含圖及文章）」➔ 嚴格計算 1 次修改額度！
      if (isModifiedBookUpload && bookId) {
        const bIdx = store.books.findIndex(b => b.id === bookId);
        if (bIdx >= 0) {
          const oldBook = store.books[bIdx];
          const currentEditCount = oldBook.edit_count ?? 0;
          const currentEditMax = oldBook.edit_quota_max ?? 30;

          if (currentEditCount >= currentEditMax) {
            return NextResponse.json(
              {
                success: false,
                needEditFee30: true,
                error: `✏️ 本書修改次數已達上限（已修改 ${currentEditCount} / ${currentEditMax} 次）。自行下載並修改後上傳算 1 次修改額，請先支付修改費 $30 USDT 解鎖 +1 次修改權限！`
              },
              { status: 402 }
            );
          }

          const newEditCount = currentEditCount + 1;
          const now = new Date().toISOString();
          const mergedBook: EBookProject = {
            ...oldBook,
            ...(parsedBookData || {}),
            id: oldBook.id,
            edit_count: newEditCount,
            edit_quota_max: currentEditMax,
            r2_published_urls: {
              primary_url: uploadRes.primaryUrl,
              mirror_url: uploadRes.mirrorUrl,
              uploaded_at: now
            },
            updated_at: now
          };

          store.books[bIdx] = mergedBook;
          await saveCloudStore(store);

          return NextResponse.json({
            success: true,
            primaryUrl: uploadRes.primaryUrl,
            mirrorUrl: uploadRes.mirrorUrl,
            uploadedToCloud: uploadRes.uploadedToCloud,
            book: mergedBook,
            message: `☁️ 離線修改後之電子書已成功上傳至專用 R2 儲存槽（算 1 次修改額，目前累計：${newEditCount} / ${currentEditMax} 次）！\n🔗 專用網址 1：${uploadRes.primaryUrl}\n🔗 專用網址 2：${uploadRes.mirrorUrl}`
          });
        }
      }

      return NextResponse.json({
        success: true,
        primaryUrl: uploadRes.primaryUrl,
        mirrorUrl: uploadRes.mirrorUrl,
        uploadedToCloud: uploadRes.uploadedToCloud,
        message: `☁️ 圖片/附件已成功上傳至專用 R2 儲存槽！\n🔗 ${uploadRes.primaryUrl}`
      });
    }

    // 3. 加購電子書配額 ($360 / 本)、次年續約系統服務費 ($450 享 100% 倒抵 10% 服務費) 或 單書加購 1 次修改權限 ($30)
    if (action === 'upgrade_quota_or_renew') {
      const { authorKey, upgradeType, bookId } = body;
      const key = (authorKey || 'demo_author').toLowerCase();
      if (!store.franchisees[key]) {
        store.franchisees[key] = { ...DEFAULT_STORE.franchisees['demo_author'], wallet_address: key };
      }
      const profile = store.franchisees[key];

      if (upgradeType === 'ADD_1_BOOK_360' || upgradeType === 'ADD_1_BOOK_330') {
        profile.book_quota_total += 1;
      } else if (upgradeType === 'RENEW_YEAR2_450' || upgradeType === 'RENEW_YEAR2_330') {
        profile.plan_status = 'ACTIVE_RENEWED';
        profile.fee_credit_balance += 450; // 次年 $450 一樣先收費後 100% 抵扣交易 1 成服務費
        profile.expires_at = new Date(Date.now() + 365 * 86400000).toISOString();
      } else if (upgradeType === 'ADD_1_EDIT_30' || upgradeType === 'ADD_30_EDITS_30') {
        const bIdx = store.books.findIndex(b => b.id === bookId);
        if (bIdx >= 0) {
          store.books[bIdx].edit_quota_max = (store.books[bIdx].edit_quota_max ?? 30) + 1;
          await saveCloudStore(store);
          return NextResponse.json({
            success: true,
            profile,
            book: store.books[bIdx]
          });
        }
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

    // 4B. 總管理員後台 (/admin/franchise) 刪除機制：針對「次年未續約 ($450)」或違規之加盟商，一鍵刪除單本電子書、下架未續約書籍、或徹底刪除整個加盟商帳號與旗下所有電子書
    if (action === 'admin_delete_or_expire') {
      const { targetType, bookId, authorKey } = body as {
        targetType: 'DELETE_SINGLE_BOOK' | 'EXPIRE_UNRENEWED_FRANCHISEE' | 'PURGE_FRANCHISEE_ALL';
        bookId?: string;
        authorKey?: string;
      };

      if (targetType === 'DELETE_SINGLE_BOOK' && bookId) {
        store.books = store.books.filter(b => b.id !== bookId);
      } else if (targetType === 'EXPIRE_UNRENEWED_FRANCHISEE' && authorKey) {
        const key = authorKey.toLowerCase();
        if (store.franchisees[key]) {
          store.franchisees[key].plan_status = 'TRIAL';
          store.franchisees[key].ai_traffic_enabled = false;
          store.franchisees[key].fee_credit_balance = 0;
        }
        // 將該未續約加盟商旗下所有已上架電子書強制轉回草稿（從 /ebook-store 書櫃下架停止銷售）
        store.books = store.books.map(b => {
          const bKey = (b.author_wallet || b.author_email || '').toLowerCase();
          if (bKey === key) {
            return {
              ...b,
              status: 'DRAFT',
              review_note: '⚠️ 次年系統維護費 ($450) 逾期未續約，系統已自動下架並停止 AI 自動來客廣告協作。'
            };
          }
          return b;
        });
      } else if (targetType === 'PURGE_FRANCHISEE_ALL' && authorKey) {
        const key = authorKey.toLowerCase();
        delete store.franchisees[key];
        store.books = store.books.filter(
          b => (b.author_wallet || b.author_email || '').toLowerCase() !== key
        );
      }

      await saveCloudStore(store);
      return NextResponse.json({ success: true, store });
    }

    // 5. 模擬讀者購買電子書 ➔ 觸發「10% 系統服務費（含提款與推廣服務費，由 $990/$450 抵用金 100% 倒抵）+ 25% 推廣聯盟服務費支出」結算器
    if (action === 'simulate_reader_purchase') {
      const { bookId, amountUsdt, readerEmail, refCode } = body;
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

      // 同步觸發 25% 推廣服務費分潤引擎（若為非推廣者的自然流量訪客下單，系統自動綁定最高 10% 級差獎金、10% 對等獎金及永久 5% 均分全球分紅）
      let boundReferrer: string | null = null;
      try {
        const crypto = await import('crypto');
        const buyerHash = crypto
          .createHash('sha256')
          .update((readerEmail || `reader_${Date.now()}`).toLowerCase().trim())
          .digest('hex');
        const buyerWallet = '0x' + buyerHash.substring(0, 40);
        const { processAffiliateCommissions } = await import('@/lib/affiliate');
        boundReferrer = await processAffiliateCommissions(buyerWallet, refCode || null, price, 'EBOOK_PURCHASE');
      } catch (e) {
        console.warn('[EBook Purchase] Affiliate distribution warning:', e);
      }

      return NextResponse.json({
        success: true,
        settlement: {
          orderAmount: price,
          originalFee10Pct: standardPlatformFee10Pct,
          affiliateFee25Pct,
          affiliateBreakdown: {
            differential10Pct: Number((price * 0.1).toFixed(2)),
            matching10Pct: Number((price * 0.1).toFixed(2)),
            globalPool5Pct: Number((price * 0.05).toFixed(2)),
            boundReferrer: boundReferrer || '0xea693e358f1527f8aa6563c9f6ebd42e37ee14fc (自動綁定最高 10% 頂階領袖)'
          },
          deductedFromCredit,
          actualPlatformFeeCharged,
          authorNetReceived: Number((price - actualPlatformFeeCharged - affiliateFee25Pct).toFixed(2)),
          remainingCreditBalance: profile.fee_credit_balance
        },
        profile
      });
    }

    // 6. 加盟商設定提現資訊 (Polygon USDT 錢包地址 / 銀行帳號)
    if (action === 'save_payout_settings') {
      const { authorKey, payoutWallet, payoutBank } = body;
      const key = (authorKey || 'demo_author').toLowerCase();
      if (!store.franchisees[key]) {
        store.franchisees[key] = { ...DEFAULT_STORE.franchisees['demo_author'], wallet_address: key };
      }
      const profile = store.franchisees[key];
      if (payoutWallet !== undefined) profile.payout_wallet = payoutWallet;
      if (payoutBank !== undefined) profile.payout_bank = payoutBank;
      await saveCloudStore(store);
      return NextResponse.json({ success: true, profile, message: '✅ 收款與提現設定已成功更新！' });
    }

    // 7. 加盟商申請出金提現 (扣抵累計收益並進入審核/出金排程)
    if (action === 'request_payout') {
      const { authorKey, amountUsdt } = body;
      const key = (authorKey || 'demo_author').toLowerCase();
      const profile = store.franchisees[key];
      if (!profile) {
        return NextResponse.json({ success: false, error: '找不到加盟商資料' }, { status: 404 });
      }

      const reqAmt = Number(amountUsdt);
      if (!reqAmt || reqAmt <= 0) {
        return NextResponse.json({ success: false, error: '請輸入有效的提現金額！' }, { status: 400 });
      }

      const alreadyWithdrawn = profile.payout_requested_usdt || 0;
      const estimatedNetEarned = Number((profile.total_sales_usdt * 0.65).toFixed(2));
      const availableBalance = Math.max(0, Number((estimatedNetEarned - alreadyWithdrawn).toFixed(2)));

      if (reqAmt > availableBalance && availableBalance > 0) {
        return NextResponse.json({
          success: false,
          error: `提現金額超出目前可提現餘額！目前最高可提現：$${availableBalance} USDT`
        }, { status: 400 });
      }

      profile.payout_requested_usdt = alreadyWithdrawn + reqAmt;
      await saveCloudStore(store);

      return NextResponse.json({
        success: true,
        profile,
        message: `✅ 已成功提交提現申請（$${reqAmt} USDT）！平台將於 24 小時內核驗，並依您設定之收款方式（Polygon USDT 錢包或銀行）完成打款。`
      });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
