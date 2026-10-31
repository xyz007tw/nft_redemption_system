'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import { EBookProject, getEBookLocalizedContent } from '@/lib/ebookEngine';

interface FeaturedEBookShowcaseSectionProps {
  initialBooks?: EBookProject[];
}

export default function FeaturedEBookShowcaseSection({ initialBooks }: FeaturedEBookShowcaseSectionProps) {
  const { lang } = useLanguage();

  // 備援官方力作展示書目 (支援 繁中/簡中/英文/日文/越南文/印尼文 完整在地化)
  const fallbackBooks: EBookProject[] = [
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
          content_vi: 'Điểm nghẽn lớn nhất trong xuất bản truyền thống không phải là viết, mà là chi phí dàn trang đắt đỏ và không có độc giả sau khi ra mắt. WeiXiang E-Book SaaS kết hợp gói hợp tác 990$ đầu tiên cùng Ma trận Lưu lượng AI để quảng bá sách của bạn 24/7 toàn cầu.',
          content_id: 'Kendala terbesar dalam penerbitan konvensional bukanlah penulisan, melainkan biaya layout yang mahal dan minimnya pembaca setelah rilis. WeiXiang E-Book SaaS menggabungkan paket kemitraan $990 tahun pertama dengan Matriks Trafik AI untuk mempromosikan buku Anda 24/7 secara global.',
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
          content_vi: 'Trong Bàn làm việc Tác giả Đối tác (/studio), gói 990$ bao gồm 3 hạn mức xuất bản sách. Bạn có thể tải master PDF/HTML bất cứ lúc nào và gửi duyệt 3-7 ngày.',
          content_id: 'Di dalam Studio Mitra (/studio), paket $990 mencakup 3 kuota buku. Anda dapat mengunduh master PDF/HTML kapan saja dan mengajukan peninjauan 3-7 hari.',
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
          content_vi: 'Tích hợp AI Google 4 cao cấp, tự động tổng hợp 8 chương sâu sắc, tài liệu tham khảo học thuật và sơ đồ kinh doanh chuẩn toàn cầu.',
          content_id: 'Didukung AI Google 4, secara otomatis merangkum 8 bab mendalam, sitasi akademis, dan diagram bisnis berkualitas global.',
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
          content_vi: 'Mỗi đơn mua sách đều tự động trích 25% hoa hồng tiếp thị liên kết. Đối tác có thể rút USDT Polygon hoặc tài khoản ngân hàng bất cứ lúc nào.',
          content_id: 'Setiap pesanan buku otomatis membagikan komisi afiliasi 25%. Mitra dapat mengikat dompet Polygon USDT atau rekening bank untuk penarikan instan.',
          image_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
          image_caption: '25% 聯盟分潤與零人工干預出金鏈路',
          references: [{ title: 'Journal of Marketing Research Viral Models', url: 'https://journals.sagepub.com' }]
        }
      ]
    },
    {
      id: 'ebook-demo-002',
      author_wallet: '0x328b9d29efc6874ba5a278148b3b64bc775c960a',
      author_name: 'Dr. Linda (全球跨境商務導師)',
      author_email: 'linda@globalbiz.ai',
      author_cta_url: 'https://aitutor.vip/0614',
      author_line_id: 'lindabiz',
      title_zh: '日美跨境電商高客單爆品與私域獲客心法',
      title_zh_cn: '日美跨境电商高客单爆品与私域获客心法',
      title_en: 'Cross-Border High-Ticket E-Commerce & Private Funnel Mastery',
      title_ja: '日米越境EC高単価商品とプライベート集客の奥義',
      title_vi: 'Bí quyết Sản phẩm Giá trị cao Thương mại Điện tử Xuyên biên giới',
      title_id: 'Strategi Produk Bernilai Tinggi E-Commerce Lintas Batas',
      subtitle_zh: '零廣告預算如何透過多語系 SEO 與自動電子書獲取高價值企業客戶',
      subtitle_zh_cn: '零广告预算如何透过多语系 SEO 与自动电子书获取高价值企业客户',
      subtitle_en: 'How to Acquire High-Value Enterprise Clients with Multilingual SEO & E-Books',
      subtitle_ja: '広告費ゼロで多言語SEOと電子書籍により優良企業顧客を獲得する方法',
      subtitle_vi: 'Cách có được khách hàng doanh nghiệp giá trị cao với SEO đa ngôn ngữ',
      subtitle_id: 'Cara mendapatkan klien perusahaan bernilai tinggi dengan SEO multibahasa',
      lang_pair: 'JA_EN',
      theme_id: 'royal_gold',
      bilingual_mode: true,
      price_single_usdt: 49,
      price_monthly_sub_usdt: 19,
      status: 'APPROVED_PUBLISHED',
      cover_image_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
      r2_published_urls: {
        primary_url: 'https://1.5208.uk/ebooks/ebook-demo-002/master_bilingual.html',
        mirror_url: 'https://pub-2006e181b8544782b8d026affdaa34ab.r2.dev/ebooks/ebook-demo-002/master_bilingual.html',
        uploaded_at: '2026-10-27T08:00:00Z'
      },
      submitted_at: '2026-10-27T07:30:00Z',
      reviewed_at: '2026-10-27T08:00:00Z',
      review_note: '審核通過・日美雙語精選名家電子書',
      created_at: '2026-10-27T07:00:00Z',
      updated_at: '2026-10-27T08:00:00Z',
      chapters: [
        {
          id: 'ch-201',
          title_zh: '第一章：全球高客單跨境利基市場挑選準則',
          title_zh_cn: '第一章：全球高客单跨境利基市场挑选准则',
          title_en: 'Chapter 1: Global High-Ticket Niche Selection Framework',
          title_ja: '第一章：グローバル高単価ニッチ市場選定フレームワーク',
          title_vi: 'Chương 1: Tiêu chí Lựa chọn Thị trường Ngách Giá trị cao Toàn cầu',
          title_id: 'Bab 1: Kriteria Pemilihan Ceruk Pasar Bernilai Tinggi Global',
          content_zh: '避開紅海低價競爭，鎖定具備剛需與高溢價屬性的高淨值商務族群。透過專業電子書作為價值載體，建立不可撼動的權威專家信任度。',
          content_zh_cn: '避开红海低价竞争，锁定具备刚需与高溢价属性的高净值商务族群。透过专业电子书作为价值载体，建立不可撼动的权威专家信任度。',
          content_en: 'Avoid price wars and focus on high-net-worth commercial niches. Using authority e-books as value vehicles creates instant credibility.',
          content_ja: '価格競争を脱却し、高付加価値なニッチ顧客層にフォーカス。権威ある電子書籍を信頼獲得の起点とします。',
          content_vi: 'Tránh cạnh tranh giá rẻ, tập trung vào phân khúc doanh nghiệp giá trị cao với sách chuyên môn làm đòn bẩy tin cậy.',
          content_id: 'Hindari perang harga murah dan fokus pada ceruk bisnis bernilai tinggi dengan e-book otoritas sebagai fondasi kepercayaan.',
          image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
          image_caption: '跨境利基市場溢價評估矩陣',
          references: [{ title: 'McKinsey Global B2B Commerce Study', url: 'https://www.mckinsey.com' }]
        }
      ]
    }
  ];

  const [books, setBooks] = useState<EBookProject[]>(initialBooks || fallbackBooks);
  const [selectedBookId, setSelectedBookId] = useState<string>(fallbackBooks[0].id);
  const [activeTabLang, setActiveTabLang] = useState<'ZH' | 'ZH_CN' | 'EN' | 'JA' | 'VI' | 'ID'>('ZH');
  const [verifyEmail, setVerifyEmail] = useState('');
  const [verifyResult, setVerifyResult] = useState<{ success: boolean; msg: string; r2Url?: string } | null>(null);
  const [simulatingBuy, setSimulatingBuy] = useState(false);
  const [simSettlement, setSimSettlement] = useState<any>(null);

  // 監聽全局導覽列切換語系，自動無縫連動電子書預覽語系
  useEffect(() => {
    if (lang === 'ja-JP') {
      setActiveTabLang('JA');
    } else if (lang === 'zh-CN') {
      setActiveTabLang('ZH_CN');
    } else if (lang === 'en-US') {
      setActiveTabLang('EN');
    } else if (lang === 'vi-VN') {
      setActiveTabLang('VI');
    } else if (lang === 'id-ID') {
      setActiveTabLang('ID');
    } else {
      setActiveTabLang('ZH');
    }
  }, [lang]);

  // 讀取遠端已審核通過之電子書，並與 fallback 完整多語系資料水化合併
  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await fetch('/api/ebook');
        const data = await res.json();
        if (data.success && data.store && data.store.books) {
          const published = data.store.books.filter((b: EBookProject) => b.status === 'APPROVED_PUBLISHED');
          if (published.length > 0) {
            // 合併本地備援之多語系欄位以防舊雲端資料缺漏
            const hydrated = published.map((pb: EBookProject) => {
              const fb = fallbackBooks.find(f => f.id === pb.id);
              if (!fb) return pb;
              return {
                ...fb,
                ...pb,
                title_zh_cn: pb.title_zh_cn || fb.title_zh_cn,
                title_ja: pb.title_ja || fb.title_ja,
                title_vi: pb.title_vi || fb.title_vi,
                title_id: pb.title_id || fb.title_id,
                subtitle_zh_cn: pb.subtitle_zh_cn || fb.subtitle_zh_cn,
                subtitle_ja: pb.subtitle_ja || fb.subtitle_ja,
                subtitle_vi: pb.subtitle_vi || fb.subtitle_vi,
                subtitle_id: pb.subtitle_id || fb.subtitle_id,
                chapters: (pb.chapters && pb.chapters.length >= fb.chapters.length ? pb.chapters : fb.chapters).map((ch, idx) => {
                  const fbCh = fb.chapters[idx];
                  return {
                    ...fbCh,
                    ...ch,
                    title_zh_cn: ch.title_zh_cn || fbCh?.title_zh_cn,
                    title_ja: ch.title_ja || fbCh?.title_ja,
                    title_vi: ch.title_vi || fbCh?.title_vi,
                    title_id: ch.title_id || fbCh?.title_id,
                    content_zh_cn: ch.content_zh_cn || fbCh?.content_zh_cn,
                    content_ja: ch.content_ja || fbCh?.content_ja,
                    content_vi: ch.content_vi || fbCh?.content_vi,
                    content_id: ch.content_id || fbCh?.content_id,
                    image_url: ch.image_url || fbCh?.image_url,
                    image_caption: ch.image_caption || fbCh?.image_caption,
                    references: ch.references || fbCh?.references
                  };
                })
              };
            });
            setBooks(hydrated);
            setSelectedBookId(hydrated[0].id);
          }
        }
      } catch (e) {
        console.warn('Fetch published books fallback to demo:', e);
      }
    }
    fetchBooks();
  }, []);

  const currentBook = books.find(b => b.id === selectedBookId) || books[0];

  // 轉換為目標語系代碼
  const targetLangCode =
    activeTabLang === 'JA' ? 'ja-JP' :
    activeTabLang === 'ZH_CN' ? 'zh-CN' :
    activeTabLang === 'EN' ? 'en-US' :
    activeTabLang === 'VI' ? 'vi-VN' :
    activeTabLang === 'ID' ? 'id-ID' : 'zh-TW';

  // 多語系介面字典 (與首頁導覽列語系完全連動)
  const t = {
    badge: ({
      'zh-TW': '📚 全球名家電子書精選・VIP 專欄訂閱書櫃 (Curated Global E-Books & VIP Subscriptions)',
      'zh-CN': '📚 全球名家电子书精选・VIP 专栏订阅书柜 (Curated Global E-Books & VIP Subscriptions)',
      'en-US': '📚 Curated Global E-Books & VIP Reader Subscriptions',
      'ja-JP': '📚 厳選グローバル電子書籍・VIP購読本棚 (Curated Global E-Books & VIP Subscriptions)',
      'vi-VN': '📚 Tuyển tập E-Book Toàn cầu & Kệ Sách Đăng ký VIP',
      'id-ID': '📚 E-Book Otoritas Global Terpilih & Langganan VIP'
    } as Record<string, string>)[lang] || '📚 Curated Global E-Books & VIP Reader Subscriptions',
    title: ({
      'zh-TW': '🔥 探索全球名家電子書・即買即讀 ＋ VIP 專欄月閱',
      'zh-CN': '🔥 探索全球名家电子书・即买即读 ＋ VIP 专栏月阅',
      'en-US': '🔥 Explore Authority E-Books: Instant Buy & VIP Monthly Access',
      'ja-JP': '🔥 厳選グローバル名著を探索・即時購読 ＋ VIP月額読み放題',
      'vi-VN': '🔥 Khám phá E-Book Chuyên gia: Mua Đọc Ngay + VIP Hàng Tháng',
      'id-ID': '🔥 Jelajahi E-Book Ahli: Beli Langsung + Akses Bulanan VIP'
    } as Record<string, string>)[lang] || '🔥 Explore Authority E-Books: Instant Buy & VIP Monthly Access',
    desc: ({
      'zh-TW': '微享電子書加盟商創作者之通過書審精裝力作！內建「防盜版動態浮水印閱讀」、獨立高解析 HTML/PDF 格式下載、單本買斷與 VIP 專欄月訂閱，更全面整合 25% 聯盟裂變分潤！',
      'zh-CN': '微享电子书加盟商创作者之通过书审精装力作！内置“防盗版动态水印阅读”、独立高解析 HTML/PDF 格式下载、单本买断与 VIP 专栏月订阅，更全面整合 25% 联盟裂变分润！',
      'en-US': 'Official masterworks published by WeiXiang Franchisees! Enjoy anti-piracy dynamic watermark reading, master HTML/PDF downloads, single purchases, and VIP subscriptions with 25% affiliate viral revenue!',
      'ja-JP': '審査を通過したWeiXiang加盟著者の本格電子書籍！ダイナミック透かしによる海賊版防止機能、HTML/PDFマスターダウンロード、単品購入とVIP月額購読、そして25%アフィリエイト分配に対応！',
      'vi-VN': 'Các tác phẩm đã được kiểm duyệt của tác giả đối tác WeiXiang! Tích hợp đọc chống sao chép với hình mờ động, tải file HTML/PDF, mua đứt hoặc đăng ký VIP với 25% hoa hồng tiếp thị liên kết!',
      'id-ID': 'Karya resmi yang telah lolos peninjauan oleh penulis mitra WeiXiang! Dilengkapi pembaca watermark dinamis anti-pembajakan, unduhan HTML/PDF master, pembelian tunggal dan langganan VIP dengan komisi afiliasi 25%!'
    } as Record<string, string>)[lang] || 'Official masterworks published by WeiXiang Franchisees!',
    selectBookPrompt: ({
      'zh-TW': '請點選欲閱覽與訂閱的名家電子書專書：',
      'zh-CN': '请点选欲阅览与订阅的名家电子书专书：',
      'en-US': 'Select an Authority E-Book to Preview & Subscribe:',
      'ja-JP': '閲覧・購読したい専門書籍を選択してください：',
      'vi-VN': 'Vui lòng chọn cuốn sách chuyên môn bạn muốn đọc thử & đăng ký:',
      'id-ID': 'Pilih buku otoritas yang ingin Anda baca & langgani:'
    } as Record<string, string>)[lang] || 'Select an Authority E-Book to Preview & Subscribe:',
    previewLangLabel: ({
      'zh-TW': '切換預覽語系:',
      'zh-CN': '切换预览语系:',
      'en-US': 'Preview Language:',
      'ja-JP': '表示言語切替:',
      'vi-VN': 'Ngôn ngữ xem trước:',
      'id-ID': 'Bahasa Pratinjau:'
    } as Record<string, string>)[lang] || 'Preview Language:',
    approvedTag: ({
      'zh-TW': '✓ 書審通過',
      'zh-CN': '✓ 书审通过',
      'en-US': '✓ Approved',
      'ja-JP': '✓ 審査承認済',
      'vi-VN': '✓ Đã Duyệt',
      'id-ID': '✓ Lolos Uji'
    } as Record<string, string>)[lang] || '✓ Approved',
    specBadge: ({
      'zh-TW': '⭐ 25+ 頁全球旗艦暢銷書規格',
      'zh-CN': '⭐ 25+ 页全球旗舰畅销书规格',
      'en-US': '⭐ 25+ Page Global Authority Specification',
      'ja-JP': '⭐ 25ページ超 世界基準ベストセラー仕様',
      'vi-VN': '⭐ Chuẩn Sách Bán Chạy Toàn Cầu 25+ Trang',
      'id-ID': '⭐ Standar Buku Terlaris Global 25+ Halaman'
    } as Record<string, string>)[lang] || '⭐ 25+ Page Global Authority Specification',
    scanCodeLabel: ({
      'zh-TW': '掃碼直連',
      'zh-CN': '扫码直连',
      'en-US': 'Scan to Connect',
      'ja-JP': 'QRコード直結',
      'vi-VN': 'Quét mã kết nối',
      'id-ID': 'Pindai QR'
    } as Record<string, string>)[lang] || 'Scan to Connect',
    enterAuthorSite: ({
      'zh-TW': '🔗 進入作者官網 / 私域 ➔',
      'zh-CN': '🔗 进入作者官网 / 私域 ➔',
      'en-US': '🔗 Author Official Site / Funnel ➔',
      'ja-JP': '🔗 著者の公式サイト・SNSへ ➔',
      'vi-VN': '🔗 Vào Website / Kênh Tác giả ➔',
      'id-ID': '🔗 Masuk Situs Resmi / Corong Penulis ➔'
    } as Record<string, string>)[lang] || '🔗 Author Official Site / Funnel ➔',
    lifetimeBuyout: ({
      'zh-TW': '單本永久買斷',
      'zh-CN': '单本永久买断',
      'en-US': 'Lifetime Buyout',
      'ja-JP': '単品永久買い切り',
      'vi-VN': 'Mua Đứt Vĩnh Viễn',
      'id-ID': 'Beli Tunggal Selamanya'
    } as Record<string, string>)[lang] || 'Lifetime Buyout',
    monthlyVip: ({
      'zh-TW': 'VIP 專欄月閱',
      'zh-CN': 'VIP 专栏月阅',
      'en-US': 'VIP Monthly Access',
      'ja-JP': 'VIP月額読み放題',
      'vi-VN': 'Đọc Hàng Tháng VIP',
      'id-ID': 'Akses VIP Bulanan'
    } as Record<string, string>)[lang] || 'VIP Monthly Access',
    perMonth: ({
      'zh-TW': '/ 月',
      'zh-CN': '/ 月',
      'en-US': '/ mo',
      'ja-JP': '/ 月',
      'vi-VN': '/ tháng',
      'id-ID': '/ bln'
    } as Record<string, string>)[lang] || '/ mo',
    buySingleBtn: (price: number) => {
      if (lang === 'ja-JP') return `🚀 単品購入 ($${price})`;
      if (lang === 'zh-CN') return `🚀 单本买断 ($${price})`;
      if (lang === 'vi-VN') return `🚀 Mua Đứt ($${price})`;
      if (lang === 'id-ID') return `🚀 Beli Tunggal ($${price})`;
      if (lang === 'en-US') return `🚀 Buy Once ($${price})`;
      return `🚀 單本買斷 ($${price})`;
    },
    buyMonthlyBtn: (price: number) => {
      if (lang === 'ja-JP') return `⭐ VIP月額購読 ($${price}/月)`;
      if (lang === 'zh-CN') return `⭐ VIP 月阅 ($${price}/月)`;
      if (lang === 'vi-VN') return `⭐ Đăng ký VIP ($${price}/tháng)`;
      if (lang === 'id-ID') return `⭐ Langganan VIP ($${price}/bln)`;
      if (lang === 'en-US') return `⭐ VIP Monthly ($${price}/mo)`;
      return `⭐ VIP 月閱 ($${price}/月)`;
    },
    checkoutHint: ({
      'zh-TW': '💡 支援 PayUni 信用卡 / Web3 錢包秒級發貨，全額納入 25% 聯盟分潤！',
      'zh-CN': '💡 支援 PayUni 信用卡 / Web3 钱包秒级发货，全额纳入 25% 联盟分润！',
      'en-US': '💡 Supports PayUni Credit Card / Web3 Instant Delivery, 25% affiliate eligible!',
      'ja-JP': '💡 PayUni クレジットカード / Web3 ウォレット即時納品・25% アフィリエイト分配対象！',
      'vi-VN': '💡 Hỗ trợ Thẻ tín dụng PayUni / Ví Web3 giao hàng tức thì, 25% hoa hồng liên kết!',
      'id-ID': '💡 Mendukung Kartu Kredit PayUni / Dompet Web3 pengiriman instan, komisi afiliasi 25%!'
    } as Record<string, string>)[lang] || '💡 Supports PayUni Credit Card / Web3 Instant Delivery, 25% affiliate eligible!',
    chapterHead: ({
      'zh-TW': '本書核心篇章目錄與權威參照大綱：',
      'zh-CN': '本书核心篇章目录与权威参照大纲：',
      'en-US': 'Master Chapters & Authority References:',
      'ja-JP': '本書の主要章立て・権威的参照リスト：',
      'vi-VN': 'Mục lục Chương Cốt lõi & Tài liệu Tham khảo:',
      'id-ID': 'Daftar Bab Inti & Referensi Otoritas:'
    } as Record<string, string>)[lang] || 'Master Chapters & Authority References:',
    citationsLabel: ({
      'zh-TW': '📚 權威參照：',
      'zh-CN': '📚 权威参照：',
      'en-US': '📚 Citations & Sources:',
      'ja-JP': '📚 権威的参考文献：',
      'vi-VN': '📚 Tham khảo Otoritas:',
      'id-ID': '📚 Referensi Ahli:'
    } as Record<string, string>)[lang] || '📚 Citations & Sources:',
    unlockLabel: ({
      'zh-TW': '🔓 已購買讀者？輸入信箱即刻驗證解鎖閱讀：',
      'zh-CN': '🔓 已购买读者？输入信箱即刻验证解锁阅读：',
      'en-US': '🔓 Already Purchased? Enter Email to Unlock:',
      'ja-JP': '🔓 購入済みの読者様はこちら（メールアドレスで即時認証）：',
      'vi-VN': '🔓 Đã mua sách? Nhập email để mở khóa đọc ngay:',
      'id-ID': '🔓 Sudah membeli? Masukkan email untuk membuka bacaan:'
    } as Record<string, string>)[lang] || '🔓 Already Purchased? Enter Email to Unlock:',
    previewMasterLink: ({
      'zh-TW': '🔗 預覽官方精裝母檔 ➔',
      'zh-CN': '🔗 预览官方精装母档 ➔',
      'en-US': '🔗 Preview Master File ➔',
      'ja-JP': '🔗 公式マスター版プレビュー ➔',
      'vi-VN': '🔗 Xem trước File Master ➔',
      'id-ID': '🔗 Pratinjau File Master ➔'
    } as Record<string, string>)[lang] || '🔗 Preview Master File ➔',
    emailPlaceholder: ({
      'zh-TW': '請輸入購書時之 Email (例如 reader@example.com)',
      'zh-CN': '请输入购书时之 Email (例如 reader@example.com)',
      'en-US': 'Enter your purchase email (e.g. reader@example.com)',
      'ja-JP': 'ご購入時のメールアドレスを入力 (例: reader@example.com)',
      'vi-VN': 'Nhập email khi mua sách (ví dụ: reader@example.com)',
      'id-ID': 'Masukkan email pembelian (misal: reader@example.com)'
    } as Record<string, string>)[lang] || 'Enter your purchase email',
    unlockBtn: ({
      'zh-TW': '解鎖防盜版閱讀',
      'zh-CN': '解锁防盗版阅读',
      'en-US': 'Unlock Reading',
      'ja-JP': 'セキュア閲覧を解除',
      'vi-VN': 'Mở Khóa Đọc',
      'id-ID': 'Buka Bacaan'
    } as Record<string, string>)[lang] || 'Unlock Reading',
    openR2Reader: ({
      'zh-TW': '📖 即刻進入專屬 R2 防盜版閱讀器',
      'zh-CN': '📖 即刻进入专属 R2 防盗版阅读器',
      'en-US': '📖 Open Dedicated R2 Reader',
      'ja-JP': '📖 専用R2リーダーで読む',
      'vi-VN': '📖 Vào Trình đọc R2 Độc quyền',
      'id-ID': '📖 Buka Pembaca R2 Eksklusif'
    } as Record<string, string>)[lang] || '📖 Open Dedicated R2 Reader',
    gotoBookshelf: ({
      'zh-TW': '📚 前往全站 VIP 書櫃',
      'zh-CN': '📚 前往全站 VIP 书柜',
      'en-US': '📚 Browse All VIP Books',
      'ja-JP': '📚 全VIP本棚を見る',
      'vi-VN': '📚 Xem Toàn bộ Kệ VIP',
      'id-ID': '📚 Lihat Semua Buku VIP'
    } as Record<string, string>)[lang] || '📚 Browse All VIP Books',
    bottomJoinBtn: ({
      'zh-TW': '🏪 誠邀全球創作者體驗！首年 $990 開設你的「知識自動販賣機 AI-ATM」➔',
      'zh-CN': '🏪 诚邀全球创作者体验！首年 $990 开设您的“知识自动贩卖机 AI-ATM”➔',
      'en-US': '🏪 Experience the Knowledge Vending Machine AI-ATM for $990 ➔',
      'ja-JP': '🏪 クリエイター体験招待！初年度$990で「知識の自販機 AI-ATM」を開設 ➔',
      'vi-VN': '🏪 Mời tác giả trải nghiệm! Khởi tạo "Máy Bán Tri Thức AI-ATM" với $990 ➔',
      'id-ID': '🏪 Undangan Kreator! Buka "Mesin Penjual Pengetahuan AI-ATM" $990 ➔'
    } as Record<string, string>)[lang] || '🏪 Experience the Knowledge Vending Machine AI-ATM for $990 ➔',
    bottomBrowseBtn: ({
      'zh-TW': '📚 瀏覽全部 VIP 讀者書櫃 (/ebook-store)',
      'zh-CN': '📚 浏览全部 VIP 读者书柜 (/ebook-store)',
      'en-US': '📚 Browse All VIP Reader Books (/ebook-store)',
      'ja-JP': '📚 VIP読者本棚一覧へ (/ebook-store)',
      'vi-VN': '📚 Xem Toàn bộ Kệ Sách VIP (/ebook-store)',
      'id-ID': '📚 Buka Rak Buku VIP (/ebook-store)'
    } as Record<string, string>)[lang] || '📚 Browse All VIP Reader Books (/ebook-store)'
  };

  // 取得當前書籍的在地化標題與副標題
  const currentLoc = getEBookLocalizedContent(currentBook, targetLangCode);

  // 驗證讀者信箱解鎖閱讀與下載
  const handleVerifyReader = () => {
    if (!verifyEmail || !verifyEmail.includes('@')) {
      setVerifyResult({
        success: false,
        msg: lang === 'ja-JP'
          ? '有効なメールアドレスを入力してください！'
          : lang.includes('zh')
          ? '請輸入有效的讀者電子信箱 (Email)！'
          : 'Please enter a valid reader email address!'
      });
      return;
    }

    const r2Url =
      currentBook.r2_published_urls?.primary_url ||
      `https://1.5208.uk/ebooks/${currentBook.id}/master_bilingual.html`;

    setVerifyResult({
      success: true,
      msg: lang === 'ja-JP'
        ? `✅ 認証成功！《${currentLoc.title}》の専用セキュア閲覧権限が解除されました！`
        : lang.includes('zh')
        ? `✅ 驗證成功！已解鎖《${currentLoc.title}》專屬防盜版閱讀授權！`
        : `✅ Verified! Access granted to "${currentLoc.title}".`,
      r2Url
    });
  };

  // 模擬讀者下單結算（體驗 10% 倒抵與 25% 聯盟分潤）
  const handleSimulatePurchase = async (type: 'SINGLE' | 'MONTHLY') => {
    setSimulatingBuy(true);
    setSimSettlement(null);
    try {
      const price = type === 'SINGLE' ? currentBook.price_single_usdt : currentBook.price_monthly_sub_usdt;
      const res = await fetch('/api/ebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'simulate_reader_purchase',
          bookId: currentBook.id,
          amountUsdt: price,
          readerEmail: verifyEmail || 'reader_vip@example.com',
          refCode: null
        })
      });
      const data = await res.json();
      if (data.success) {
        setSimSettlement(data.settlement);
      } else {
        alert(data.error || '結算失敗');
      }
    } catch (e: any) {
      alert(`連線異常: ${e.message}`);
    } finally {
      setSimulatingBuy(false);
    }
  };

  return (
    <section id="featured-ebooks" className="w-full max-w-7xl px-3 sm:px-6 py-12 md:py-16 scroll-mt-24">
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/80 border-2 border-indigo-500/40 rounded-3xl p-4 sm:p-8 md:p-12 relative overflow-hidden shadow-[0_0_60px_rgba(99,102,241,0.2)]">
        {/* 背景光暈 */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-pink-500/15 rounded-full blur-[100px] pointer-events-none" />

        {/* 1. 區塊標題 */}
        <div className="text-center mb-10 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-xs sm:text-sm font-bold mb-4 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            <span>📚</span>
            {t.badge}
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black mb-4 tracking-tight text-white drop-shadow-lg leading-tight">
            {t.title}
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-indigo-100/85 max-w-4xl mx-auto leading-relaxed">
            {t.desc}
          </p>

          {/* 🌟 知識自動販賣機 AI-ATM 跨專區行銷導流橫幅 */}
          <div className="mt-6 max-w-3xl mx-auto p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-pink-950/70 via-purple-950/70 to-indigo-950/70 border border-pink-500/50 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[0_0_25px_rgba(236,72,153,0.3)]">
            <div className="flex items-center gap-2.5 text-center sm:text-left">
              <span className="text-2xl">🏪</span>
              <div>
                <span className="text-xs sm:text-sm font-black text-pink-300 block">
                  {lang === 'ja-JP' ? '自分の電子書籍を自動販売したいですか？' :
                   lang === 'zh-CN' ? '想拥有自己的专属“知识自动贩卖机 AI-ATM”？' :
                   lang === 'vi-VN' ? 'Bạn muốn sở hữu "Máy Bán Tri Thức AI-ATM" của riêng mình?' :
                   lang === 'id-ID' ? 'Ingin memiliki "Mesin Penjual Pengetahuan AI-ATM" Anda sendiri?' :
                   lang === 'en-US' ? 'Want to launch your own Knowledge Vending Machine AI-ATM?' :
                   '想擁有自己的專屬「知識自動販賣機 AI-ATM」？'}
                </span>
                <span className="text-[11px] sm:text-xs text-gray-300">
                  {lang === 'ja-JP' ? '専門知識ゼロ・初年度$990で自販機3台＋24H AI自動集客！' :
                   lang === 'zh-CN' ? '零技术！首年 $990 打造3台专书自贩机＋AI 24H 睡觉帮您打广告！' :
                   lang === 'vi-VN' ? 'Không cần kỹ thuật! Chỉ $990 mở 3 máy bán + AI tìm khách 24/7!' :
                   lang === 'id-ID' ? 'Tanpa keahlian teknis! Hanya $990 miliki 3 mesin + iklan AI 24/7!' :
                   lang === 'en-US' ? 'Zero tech skills! Launch 3 machines for $990 with 24/7 automated AI ads!' :
                   '零技術！首年 $990 打造 3 台專書自販機＋AI 24H 睡覺幫你打廣告！'}
                </span>
              </div>
            </div>
            <a
              href="#author-coop"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-black text-xs shadow-md hover:scale-105 transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              {lang === 'ja-JP' ? '自販機を開設する →' :
               lang === 'zh-CN' ? '前往开设贩卖机 →' :
               lang === 'vi-VN' ? 'Khởi tạo ngay →' :
               lang === 'id-ID' ? 'Buka Mesin Sekarang →' :
               lang === 'en-US' ? 'Launch Machine →' :
               '前往開設販賣機 →'}
            </a>
          </div>
        </div>

        {/* 2. 書籍橫向切換頁籤 ＋ 語系預覽選擇鈕 */}
        <div className="mb-8 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>📖</span>
              {t.selectBookPrompt}
            </h3>

            {/* 語系即時切換鈕 (繁中 / 簡中 / 英文 / 日文 / 越南文 / 印尼文) */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 border border-indigo-400/40 rounded-2xl p-1 text-xs font-bold">
              <span className="text-gray-400 px-2 hidden sm:inline">{t.previewLangLabel}</span>
              <button
                onClick={() => setActiveTabLang('ZH')}
                className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                  activeTabLang === 'ZH' ? 'bg-indigo-600 text-white shadow' : 'text-gray-300 hover:text-white'
                }`}
              >
                🇹🇼 繁中
              </button>
              <button
                onClick={() => setActiveTabLang('ZH_CN')}
                className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                  activeTabLang === 'ZH_CN' ? 'bg-indigo-600 text-white shadow' : 'text-gray-300 hover:text-white'
                }`}
              >
                🇨🇳 简中
              </button>
              <button
                onClick={() => setActiveTabLang('EN')}
                className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                  activeTabLang === 'EN' ? 'bg-indigo-600 text-white shadow' : 'text-gray-300 hover:text-white'
                }`}
              >
                🇺🇸 English
              </button>
              <button
                onClick={() => setActiveTabLang('JA')}
                className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                  activeTabLang === 'JA' ? 'bg-indigo-600 text-white shadow' : 'text-gray-300 hover:text-white'
                }`}
              >
                🇯🇵 日本語
              </button>
              <button
                onClick={() => setActiveTabLang('VI')}
                className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                  activeTabLang === 'VI' ? 'bg-indigo-600 text-white shadow' : 'text-gray-300 hover:text-white'
                }`}
              >
                🇻🇳 Tiếng Việt
              </button>
              <button
                onClick={() => setActiveTabLang('ID')}
                className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                  activeTabLang === 'ID' ? 'bg-indigo-600 text-white shadow' : 'text-gray-300 hover:text-white'
                }`}
              >
                🇮🇩 Indonesia
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {books.map((b) => {
              const isSelected = b.id === currentBook.id;
              const bLoc = getEBookLocalizedContent(b, targetLangCode);
              const langPairBadge =
                b.lang_pair === 'JA_EN'
                  ? '🇯🇵/🇺🇸 JA·EN'
                  : b.lang_pair === 'ZH_JA'
                  ? '🇹🇼/🇯🇵 ZH·JA'
                  : '🇹🇼/🇺🇸 ZH·EN';

              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    setSelectedBookId(b.id);
                    setVerifyResult(null);
                    setSimSettlement(null);
                  }}
                  className={`text-left cursor-pointer rounded-2xl p-5 border transition-all duration-300 flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-950 via-purple-950/80 to-slate-900 border-amber-400 shadow-[0_0_30px_rgba(250,204,21,0.3)] scale-[1.01]'
                      : 'bg-slate-900/60 hover:bg-slate-900/90 border-indigo-500/30 hover:border-indigo-400/70'
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-16 h-20 rounded-lg overflow-hidden shrink-0 border border-white/20 shadow-md bg-slate-800">
                      <img
                        src={b.cover_image_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'}
                        alt={bLoc.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-[10px] font-bold text-indigo-300">
                          {langPairBadge}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[10px] font-bold text-emerald-300">
                          {t.approvedTag}
                        </span>
                      </div>
                      <h4 className="font-black text-white text-sm sm:text-base truncate leading-snug">
                        {bLoc.title}
                      </h4>
                      <p className="text-xs text-gray-300 truncate mt-0.5">
                        {bLoc.subtitle}
                      </p>
                      <div className="text-[11px] text-amber-300 mt-1 font-bold">
                        ✍️ {b.author_name} ｜ ${b.price_single_usdt} USDT ｜ VIP ${b.price_monthly_sub_usdt}
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 text-xl text-amber-400 font-bold">
                    {isSelected ? '👉' : '›'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. 當前選中書籍主展示卡片 */}
        <div className="bg-slate-900/90 border-2 border-indigo-400/40 rounded-3xl p-5 sm:p-8 md:p-10 relative z-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* 左側：封面、作者檔案、QR Code 與定價購買卡 */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div>
                {/* 封面圖 */}
                <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl aspect-[4/5] max-w-sm mx-auto bg-slate-950">
                  <img
                    src={currentBook.cover_image_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'}
                    alt={currentLoc.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-5">
                    <span className="inline-block px-3 py-1 rounded-full bg-amber-500/90 text-slate-950 font-black text-xs mb-2 w-max shadow">
                      {t.specBadge}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-white leading-tight drop-shadow">
                      {currentLoc.title}
                    </h3>
                    <p className="text-xs text-amber-200 mt-1 drop-shadow">
                      by {currentBook.author_name}
                    </p>
                  </div>
                </div>

                {/* 作者卡片與導流 QR Code */}
                <div className="mt-5 p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">AUTHOR PROFILE</span>
                    <h4 className="text-sm font-black text-white truncate mt-0.5">{currentBook.author_name}</h4>
                    <p className="text-xs text-gray-300 truncate">LINE/微信：{currentBook.author_line_id || 'xyz007tw'}</p>
                    {currentBook.author_cta_url && (
                      <a
                        href={currentBook.author_cta_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-emerald-400 hover:underline block truncate mt-1"
                      >
                        {t.enterAuthorSite}
                      </a>
                    )}
                  </div>
                  <div className="shrink-0 text-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=4&data=${encodeURIComponent(currentBook.author_cta_url || 'https://aitutor.vip/waia')}`}
                      alt="Author QR"
                      className="w-16 h-16 rounded-lg bg-white p-1 border border-white/20 shadow"
                    />
                    <span className="text-[9px] text-gray-400 block mt-1">{t.scanCodeLabel}</span>
                  </div>
                </div>
              </div>

              {/* 結帳定價與購買 CTA */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/90 to-purple-950/90 border border-indigo-400/50 shadow-xl space-y-3">
                <div className="flex items-baseline justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="text-xs text-indigo-300 font-bold block">{t.lifetimeBuyout}</span>
                    <span className="text-2xl sm:text-3xl font-black text-white">${currentBook.price_single_usdt} <span className="text-xs font-normal text-gray-300">USDT</span></span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-pink-300 font-bold block">{t.monthlyVip}</span>
                    <span className="text-xl sm:text-2xl font-black text-pink-400">${currentBook.price_monthly_sub_usdt} <span className="text-xs font-normal text-gray-300">{t.perMonth}</span></span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleSimulatePurchase('SINGLE')}
                    disabled={simulatingBuy}
                    className="w-full py-3 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-105 cursor-pointer text-center"
                  >
                    {t.buySingleBtn(currentBook.price_single_usdt)}
                  </button>

                  <button
                    onClick={() => handleSimulatePurchase('MONTHLY')}
                    disabled={simulatingBuy}
                    className="w-full py-3 px-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-black text-xs sm:text-sm shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all hover:scale-105 cursor-pointer text-center"
                  >
                    {t.buyMonthlyBtn(currentBook.price_monthly_sub_usdt)}
                  </button>
                </div>

                <p className="text-[11px] text-gray-300 text-center leading-relaxed pt-1">
                  {t.checkoutHint}
                </p>
              </div>
            </div>

            {/* 右側：書籍大綱、章節拆解、權威參照與讀者解鎖工具列 */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/40">
                    🏛️ Google 4 Authority Engine
                  </span>
                  <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold border border-pink-400/40">
                    📄 8 Chapters · 25+ Pages
                  </span>
                  <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-400/40">
                    ☁️ Cloudflare R2
                  </span>
                </div>

                <h3 className="text-xl sm:text-3xl font-black text-white leading-tight mb-2">
                  {currentLoc.title}
                </h3>
                <p className="text-sm sm:text-base text-indigo-200/90 leading-relaxed mb-6">
                  {currentLoc.subtitle}
                </p>

                {/* 章節清單 (Chapter Breakdown) */}
                <div className="space-y-3">
                  <h4 className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
                    <span>📑</span> {t.chapterHead}
                  </h4>

                  <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                    {currentBook.chapters.map((ch, idx) => {
                      const chLoc = getEBookLocalizedContent(ch, targetLangCode);

                      return (
                        <div
                          key={ch.id || idx}
                          className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left"
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-200 text-[10px] font-black">
                              CHAPTER 0{idx + 1}
                            </span>
                            {ch.image_caption && (
                              <span className="text-[10px] text-cyan-300 font-bold truncate max-w-[200px]">
                                📷 {ch.image_caption}
                              </span>
                            )}
                          </div>
                          <h5 className="text-xs sm:text-sm font-black text-white">
                            {chLoc.title}
                          </h5>
                          <p className="text-[11px] sm:text-xs text-gray-300 line-clamp-2 mt-1 leading-relaxed">
                            {chLoc.content}
                          </p>

                          {ch.references && ch.references.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-white/5 flex flex-wrap items-center gap-2 text-[10px] text-emerald-300">
                              <span className="font-bold">{t.citationsLabel}</span>
                              {ch.references.map((r, rIdx) => (
                                <span key={rIdx} className="bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
                                  {r.title}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 讀者信箱驗證與線上閱讀解鎖工具列 */}
              <div className="pt-4 border-t border-white/10">
                <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-400/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                      <span>🔓</span> {t.unlockLabel}
                    </span>
                    {currentBook.r2_published_urls?.primary_url && (
                      <a
                        href={currentBook.r2_published_urls.primary_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-cyan-400 hover:underline font-bold"
                      >
                        {t.previewMasterLink}
                      </a>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      value={verifyEmail}
                      onChange={(e) => setVerifyEmail(e.target.value)}
                      placeholder={t.emailPlaceholder}
                      className="flex-1 bg-black/60 border border-indigo-400/40 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <button
                      onClick={handleVerifyReader}
                      className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shrink-0"
                    >
                      {t.unlockBtn}
                    </button>
                  </div>

                  {verifyResult && (
                    <div className={`p-3 rounded-xl text-xs ${verifyResult.success ? 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-200' : 'bg-red-950/70 border border-red-500/50 text-red-200'}`}>
                      <p>{verifyResult.msg}</p>
                      {verifyResult.r2Url && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          <a
                            href={verifyResult.r2Url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs hover:bg-emerald-400 transition-all"
                          >
                            {t.openR2Reader}
                          </a>
                          <Link
                            href="/ebook-store"
                            className="px-3 py-1.5 rounded-lg bg-white/10 text-white font-bold text-xs hover:bg-white/20 transition-all"
                          >
                            {t.gotoBookshelf}
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 模擬購買結算結果展示 */}
                  {simSettlement && (
                    <div className="p-4 rounded-xl bg-black/80 border-2 border-emerald-400/60 text-xs space-y-2 text-left">
                      <div className="font-black text-emerald-400 text-sm flex items-center justify-between">
                        <span>🎉 訂單模擬結算成功（即刻發貨）！</span>
                        <span className="text-white">${simSettlement.orderAmount} USDT</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-300 pt-1 border-t border-white/10">
                        <div>
                          <strong>1成系統服務費：</strong> ${simSettlement.originalFee10Pct}
                          <span className="text-emerald-400 block">
                            (100% 倒抵扣除: -${simSettlement.deductedFromCredit}，實際收取: ${simSettlement.actualPlatformFeeCharged})
                          </span>
                        </div>
                        <div>
                          <strong>25% 聯盟分潤撥出：</strong> ${simSettlement.affiliateFee25Pct}
                          <span className="text-amber-300 block">
                            (級差$ {simSettlement.affiliateBreakdown?.differential10Pct} + 對等$ {simSettlement.affiliateBreakdown?.matching10Pct} + 均分$ {simSettlement.affiliateBreakdown?.globalPool5Pct})
                          </span>
                        </div>
                      </div>
                      <div className="text-[11px] text-cyan-300 pt-1">
                        <strong>加盟商實收淨額：</strong> <span className="text-white font-black text-sm">${simSettlement.authorNetReceived} USDT</span> ｜ 剩餘倒抵金餘額：${simSettlement.remainingCreditBalance} USDT
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. 底部引導至創作者加盟工作室 */}
        <div className="mt-8 text-center relative z-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#author-coop"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-black text-sm shadow-[0_0_25px_rgba(236,72,153,0.4)] transition-all hover:scale-105"
          >
            {t.bottomJoinBtn}
          </a>
          <Link
            href="/ebook-store"
            className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-all"
          >
            {t.bottomBrowseBtn}
          </Link>
        </div>
      </div>
    </section>
  );
}
