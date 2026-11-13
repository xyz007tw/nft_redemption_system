import type { EBookProject } from '@/lib/ebookEngine';
import type { EBookCloudStoreShape } from '@/lib/ebookAuth';

export const DEFAULT_EBOOK_STORE: EBookCloudStoreShape = {
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

/**
 * 補齊旗艦示範書籍的多語系與預設章節結構
 */
export function hydrateEBookCloudStore(parsedStore: EBookCloudStoreShape): EBookCloudStoreShape {
  if (!parsedStore || !Array.isArray(parsedStore.books)) {
    return parsedStore;
  }
  const defBook = DEFAULT_EBOOK_STORE.books[0];
  parsedStore.books = parsedStore.books.map((b: EBookProject) => {
    if (b.id !== 'ebook-demo-001') return b;
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
        return existingCh
          ? {
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
            }
          : defCh;
      })
    };
  });
  return parsedStore;
}
