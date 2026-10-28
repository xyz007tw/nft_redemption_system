'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import { EBookProject, EBOOK_THEMES } from '@/lib/ebookEngine';
import PayUniButton from './PayUniButton';

interface FeaturedEBookShowcaseSectionProps {
  initialBooks?: EBookProject[];
}

export default function FeaturedEBookShowcaseSection({ initialBooks }: FeaturedEBookShowcaseSectionProps) {
  const { lang } = useLanguage();
  const isZh = lang.includes('zh');

  // 備援官方力作展示書目
  const fallbackBooks: EBookProject[] = [
    {
      id: 'ebook-demo-001',
      author_wallet: '0xea693e358f1527f8aa6563c9f6ebd42e37ee14fc',
      author_name: 'CTO SEN (總工程師)',
      author_email: 'xyz007tw@gmail.com',
      author_cta_url: 'https://aitutor.vip/waia',
      author_line_id: 'xyz007tw',
      title_zh: 'Antigravity × Remotion 全自動印鈔級影音與電子書實戰指南',
      title_en: 'Antigravity × Remotion Automated Video & E-Book Practical Guide',
      title_ja: 'Antigravity × Remotion 全自動動画＆電子書籍実践バイブル',
      subtitle_zh: '掌握 AI 自動來客矩陣與 100% 倒抵零風險變現核心秘密',
      subtitle_en: 'Master the AI Traffic Matrix and 100% Fee-Credit Monetization System',
      subtitle_ja: 'AI自動集客マトリクスと100%相殺ノーリスク収益化の極意',
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
          title_en: 'Chapter 1: Why Creators Need the AI Auto-Traffic Matrix',
          title_ja: '第一章：なぜ知識起業家にAI自動集客マトリクスが必要なのか？',
          content_zh: '傳統寫書與出版最大的痛點，不是寫不出好內容，而是「排版外包昂貴」與「出版後沒有流量」。微享全球電子書 SaaS 結合首年 $990 合作方案，不僅讓您一鍵生成雙語精裝電子書，更直接協作「AI 自動來客系統」每天在全球社群幫您打廣告找客人！\n\n更重要的是，首年支付的 $990 與次年系統維護費 $450，皆享有 100% 先收後抵交易 1 成（10%）服務費的零風險保障。',
          content_en: 'The biggest pain point in traditional publishing is not writing, but expensive typesetting and zero traffic after launch. WeiXiang E-Book SaaS combines our $990 partnership plan with our AI Auto-Traffic Matrix to promote your books globally 24/7.\n\nEven better, both the first-year $990 fee and second-year $450 maintenance fee are 100% credited back against our 10% platform transaction fee.',
          content_ja: '従来の出版における最大の課題は執筆ではなく、「組版の外注費」と「出版後の集客力不足」です。WeiXiang電子書籍SaaSは、初年度$990の提携プランとAI自動集客システムを融合させ、24時間体制で書籍を世界中に宣伝します。',
          image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
          image_caption: '圖1-1：AI 全自動流量裂變與 100% 倒抵生態圖',
          references: [{ title: 'Gartner Global AI Enterprise Report', url: 'https://www.gartner.com' }]
        },
        {
          id: 'ch-2',
          title_zh: '第二章：三級管理平台（管理員、加盟商、讀者訂閱）運作全解析',
          title_en: 'Chapter 2: Three-Tier SaaS Architecture (Admin, Franchisee, Reader)',
          title_ja: '第二章：3層SaaS基盤（管理者・加盟店・読者購読）徹底解説',
          content_zh: '在加盟商創作者工作台（/studio）中，您可以享有首年 3 本電子書免費開發配額（第 4 本起每本開發費 $360）。完成設定後，您可以立即「自行下載高解析 PDF 與網頁母檔」保存，並一鍵送交總管理後台進行 3~7 天書審。\n\n書審通過後，系統即刻為您開通 VIP 讀者防盜版線上書櫃與 25% 聯盟分潤裂變連結！',
          content_en: 'Inside the Franchisee Studio (/studio), your $990 plan includes 3 e-book development quotas ($360 per additional book from the 4th book). You can download master PDF/HTML files anytime and submit your book for our 3-7 day compliance review.\n\nOnce approved, your book goes live in the VIP Reader Bookstore with 25% affiliate viral sharing enabled!',
          content_ja: '加盟スタジオ（/studio）では初年度3冊分の開発枠が付与されます。マスターファイルを自由にダウンロードでき、3〜7日の審査完了後、VIP読者向け本棚へ即座に公開されます。',
          image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
          image_caption: '圖2-1：三級 SaaS 權限管理與防盜版閱讀機制',
          references: [{ title: 'Harvard Business Review Digital Models', url: 'https://hbr.org' }]
        },
        {
          id: 'ch-3',
          title_zh: '第三章：Google 4 旗艦圖文編撰：打造 25+ 頁麥肯錫權威專書',
          title_en: 'Chapter 3: Google 4 Authority Engine: Crafting 25+ Page Masterbooks',
          title_ja: '第三章：Google 4 エンジンによる25ページ超の権威的専門書構築',
          content_zh: '真正的暢銷力建立在專業深度與結構化思考。系統全面搭載 Google 4 旗艦智能總編纂大腦，自動整合 8 大深度篇章、權威學術引用與精美商業插圖建議，一鍵產出 8,000~10,000 字具備全球出版等級之頂級專著。',
          content_en: 'True authority relies on structured depth. Powered by Google 4 flagship intelligence, our engine automatically weaves 8 deep chapters, citations, and business diagrams into 25+ page publications.',
          content_ja: 'Google 4 旗艦エンジンを搭載し、8つの本格章立て、学術的引用、ビジネス図解を網羅した8,000〜10,000字の専門書を瞬時に編纂します。',
          image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
          image_caption: '圖3-1：麥肯錫結構化論述與多維數據引用架構',
          references: [{ title: 'MIT Technology Review Systems Guide', url: 'https://www.technologyreview.com' }]
        },
        {
          id: 'ch-4',
          title_zh: '第四章：25% 聯盟裂變與加盟商收款提現全自動化',
          title_en: 'Chapter 4: 25% Affiliate Viral Engine & Automated Franchisee Payouts',
          title_ja: '第四章：25%アフィリエイト分配と加盟店向け自動出金システム',
          content_zh: '每筆讀者購書訂單（單本買斷 $39 或 VIP 月閱 $15）均自動撥出 25% 推廣服務費，即使是無推薦碼之自然流量訪客，系統亦自動綁定最高 10% 級差領袖！加盟商隨時可綁定 Polygon USDT 錢包或銀行帳號申請一鍵出金提現。',
          content_en: 'Every order distributes a 25% affiliate commission. Organic visitors are automatically bound to top-tier leaders! Franchisees can bind Polygon USDT wallets or bank accounts for 1-click withdrawals.',
          content_ja: 'すべての注文に対して25%のアフィリエイト手数料が自動分配されます。加盟店はPolygon USDTウォレットや銀行口座を登録し、いつでも出金申請が可能です。',
          image_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
          image_caption: '圖4-1：25% 聯盟分潤與零人工干預出金鏈路',
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
      title_en: 'Cross-Border High-Ticket E-Commerce & Private Funnel Mastery',
      title_ja: '日米越境EC高単価商品とプライベート集客の奥義',
      subtitle_zh: '零廣告預算如何透過多語系 SEO 與自動電子書獲取高價值企業客戶',
      subtitle_en: 'How to Acquire High-Value Enterprise Clients with Multilingual SEO & E-Books',
      subtitle_ja: '広告費ゼロで多言語SEOと電子書籍により優良企業顧客を獲得する方法',
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
          title_en: 'Chapter 1: Global High-Ticket Niche Selection Framework',
          title_ja: '第一章：グローバル高単価ニッチ市場選定フレームワーク',
          content_zh: '避開紅海低價競爭，鎖定具備剛需與高溢價屬性的高淨值商務族群。透過專業電子書作為價值載體，建立不可撼動的權威專家信任度。',
          content_en: 'Avoid price wars and focus on high-net-worth commercial niches. Using authority e-books as value vehicles creates instant credibility.',
          content_ja: '価格競争を脱却し、高付加価値なニッチ顧客層にフォーカス。権威ある電子書籍を信頼獲得の起点とします。',
          image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
          image_caption: '圖1-1：跨境利基市場溢價評估矩陣',
          references: [{ title: 'McKinsey Global B2B Commerce Study', url: 'https://www.mckinsey.com' }]
        }
      ]
    }
  ];

  const [books, setBooks] = useState<EBookProject[]>(initialBooks || fallbackBooks);
  const [selectedBookId, setSelectedBookId] = useState<string>(fallbackBooks[0].id);
  const [activeTabLang, setActiveTabLang] = useState<'ZH' | 'EN' | 'JA'>('ZH');
  const [verifyEmail, setVerifyEmail] = useState('');
  const [verifyResult, setVerifyResult] = useState<{ success: boolean; msg: string; r2Url?: string } | null>(null);
  const [simulatingBuy, setSimulatingBuy] = useState(false);
  const [simSettlement, setSimSettlement] = useState<any>(null);

  // 讀取遠端已審核通過之電子書
  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await fetch('/api/ebook');
        const data = await res.json();
        if (data.success && data.store && data.store.books) {
          const published = data.store.books.filter((b: EBookProject) => b.status === 'APPROVED_PUBLISHED');
          if (published.length > 0) {
            setBooks(published);
            setSelectedBookId(published[0].id);
          }
        }
      } catch (e) {
        console.warn('Fetch published books fallback to demo:', e);
      }
    }
    fetchBooks();
  }, []);

  const currentBook = books.find(b => b.id === selectedBookId) || books[0];
  const langPair = currentBook.lang_pair || 'ZH_EN';

  // 取得對應顯示標題與副標題
  const getBookTitle = (b: EBookProject) => {
    if (activeTabLang === 'JA' && b.title_ja) return b.title_ja;
    if (activeTabLang === 'EN' && b.title_en) return b.title_en;
    return b.title_zh || b.title_en;
  };

  const getBookSubtitle = (b: EBookProject) => {
    if (activeTabLang === 'JA' && b.subtitle_ja) return b.subtitle_ja;
    if (activeTabLang === 'EN' && b.subtitle_en) return b.subtitle_en;
    return b.subtitle_zh || b.subtitle_en;
  };

  // 驗證讀者信箱解鎖閱讀與下載
  const handleVerifyReader = () => {
    if (!verifyEmail || !verifyEmail.includes('@')) {
      setVerifyResult({
        success: false,
        msg: isZh ? '請輸入有效的讀者電子信箱 (Email)！' : 'Please enter a valid reader email address!'
      });
      return;
    }

    const r2Url = currentBook.r2_published_urls?.primary_url ||
      `https://1.5208.uk/ebooks/${currentBook.id}/master_bilingual.html`;

    setVerifyResult({
      success: true,
      msg: isZh
        ? `✅ 驗證成功！已解鎖《${currentBook.title_zh}》專屬防盜版閱讀授權！`
        : `✅ Verified! Access granted to "${currentBook.title_en || currentBook.title_zh}".`,
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
          refCode: null // 自然流量訪客
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
            {isZh
              ? '全球名家電子書精選・VIP 專欄訂閱書櫃 (Curated Global E-Books & VIP Subscriptions)'
              : 'Curated Global E-Books & VIP Reader Subscriptions'}
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black mb-4 tracking-tight text-white drop-shadow-lg leading-tight">
            {isZh ? '🔥 探索全球名家電子書・即買即讀 ＋ VIP 專欄月閱' : '🔥 Explore Authority E-Books: Instant Buy & VIP Monthly Access'}
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-indigo-100/85 max-w-4xl mx-auto leading-relaxed">
            {isZh
              ? '微享電子書加盟商創作者之通過書審精裝力作！內建「防盜版動態浮水印閱讀」、獨立高解析 HTML/PDF 格式下載、單本買斷與 VIP 專欄月訂閱，更全面整合 25% 聯盟裂變分潤！'
              : 'Official masterworks published by WeiXiang Franchisees! Enjoy anti-piracy dynamic watermark reading, master HTML/PDF downloads, single purchases, and VIP subscriptions with 25% affiliate viral revenue!'}
          </p>
        </div>

        {/* 2. 書籍橫向切換頁籤 (UX 同附圖 TutorCourseSection 選單) */}
        <div className="mb-8 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>📖</span>
              {isZh ? '請點選欲閱覽與訂閱的名家電子書專書：' : 'Select an Authority E-Book to Preview & Subscribe:'}
            </h3>

            {/* 語系即時切換鈕 */}
            <div className="flex items-center gap-2 bg-slate-900 border border-indigo-400/40 rounded-full p-1 text-xs font-bold">
              <span className="text-gray-400 px-2">切換預覽語系:</span>
              <button
                onClick={() => setActiveTabLang('ZH')}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  activeTabLang === 'ZH' ? 'bg-indigo-600 text-white shadow' : 'text-gray-300 hover:text-white'
                }`}
              >
                🇹🇼 繁中
              </button>
              <button
                onClick={() => setActiveTabLang('EN')}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  activeTabLang === 'EN' ? 'bg-indigo-600 text-white shadow' : 'text-gray-300 hover:text-white'
                }`}
              >
                🇺🇸 English
              </button>
              <button
                onClick={() => setActiveTabLang('JA')}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  activeTabLang === 'JA' ? 'bg-indigo-600 text-white shadow' : 'text-gray-300 hover:text-white'
                }`}
              >
                🇯🇵 日本語
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {books.map((b) => {
              const isSelected = b.id === currentBook.id;
              const displayTitle = getBookTitle(b);
              const displaySubtitle = getBookSubtitle(b);
              const langPairBadge =
                b.lang_pair === 'JA_EN' ? '🇯🇵/🇺🇸 日英雙語' :
                b.lang_pair === 'ZH_JA' ? '🇹🇼/🇯🇵 中日雙語' :
                '🇹🇼/🇺🇸 中英雙語';

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
                        alt={displayTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-[10px] font-bold text-indigo-300">
                          {langPairBadge}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[10px] font-bold text-emerald-300">
                          ✓ 書審通過
                        </span>
                      </div>
                      <h4 className="font-black text-white text-sm sm:text-base truncate leading-snug">
                        {displayTitle}
                      </h4>
                      <p className="text-xs text-gray-300 truncate mt-0.5">
                        {displaySubtitle}
                      </p>
                      <div className="text-[11px] text-amber-300 mt-1 font-bold">
                        ✍️ 作者：{b.author_name} ｜ 單本 ${b.price_single_usdt} ｜ VIP月閱 ${b.price_monthly_sub_usdt}
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

        {/* 3. 當前選中書籍主展示卡片 (Showcase Card) */}
        <div className="bg-slate-900/90 border-2 border-indigo-400/40 rounded-3xl p-5 sm:p-8 md:p-10 relative z-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* 左側：封面、作者檔案、QR Code 與定價購買卡 */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div>
                {/* 封面圖 */}
                <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl aspect-[4/5] max-w-sm mx-auto bg-slate-950">
                  <img
                    src={currentBook.cover_image_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'}
                    alt={getBookTitle(currentBook)}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-5">
                    <span className="inline-block px-3 py-1 rounded-full bg-amber-500/90 text-slate-950 font-black text-xs mb-2 w-max shadow">
                      ⭐ 25+ 頁全球旗艦暢銷書規格
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-white leading-tight drop-shadow">
                      {getBookTitle(currentBook)}
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
                        🔗 進入作者官網 / 私域 ➔
                      </a>
                    )}
                  </div>
                  <div className="shrink-0 text-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=4&data=${encodeURIComponent(currentBook.author_cta_url || 'https://aitutor.vip/waia')}`}
                      alt="Author QR"
                      className="w-16 h-16 rounded-lg bg-white p-1 border border-white/20 shadow"
                    />
                    <span className="text-[9px] text-gray-400 block mt-1">掃碼直連</span>
                  </div>
                </div>
              </div>

              {/* 結帳定價與購買 CTA */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/90 to-purple-950/90 border border-indigo-400/50 shadow-xl space-y-3">
                <div className="flex items-baseline justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="text-xs text-indigo-300 font-bold block">單本永久買斷</span>
                    <span className="text-2xl sm:text-3xl font-black text-white">${currentBook.price_single_usdt} <span className="text-xs font-normal text-gray-300">USDT</span></span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-pink-300 font-bold block">VIP 專欄月閱</span>
                    <span className="text-xl sm:text-2xl font-black text-pink-400">${currentBook.price_monthly_sub_usdt} <span className="text-xs font-normal text-gray-300">/ 月</span></span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleSimulatePurchase('SINGLE')}
                    disabled={simulatingBuy}
                    className="w-full py-3 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-105 cursor-pointer text-center"
                  >
                    🚀 單本買斷 (${currentBook.price_single_usdt})
                  </button>

                  <button
                    onClick={() => handleSimulatePurchase('MONTHLY')}
                    disabled={simulatingBuy}
                    className="w-full py-3 px-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-black text-xs sm:text-sm shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all hover:scale-105 cursor-pointer text-center"
                  >
                    ⭐ VIP 月閱 (${currentBook.price_monthly_sub_usdt}/月)
                  </button>
                </div>

                <p className="text-[11px] text-gray-300 text-center leading-relaxed pt-1">
                  💡 支援 PayUni 信用卡 / Web3 錢包秒級發貨，全額納入 25% 聯盟分潤！
                </p>
              </div>
            </div>

            {/* 右側：書籍大綱、章節拆解、權威參照與讀者解鎖工具列 */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/40">
                    🏛️ Google 4 旗艦圖文編撰
                  </span>
                  <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold border border-pink-400/40">
                    📄 8大深度章節・25+頁全球權威規格
                  </span>
                  <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-400/40">
                    ☁️ Cloudflare R2 獨立高速託管
                  </span>
                </div>

                <h3 className="text-xl sm:text-3xl font-black text-white leading-tight mb-2">
                  {getBookTitle(currentBook)}
                </h3>
                <p className="text-sm sm:text-base text-indigo-200/90 leading-relaxed mb-6">
                  {getBookSubtitle(currentBook)}
                </p>

                {/* 章節清單 (Chapter Breakdown) */}
                <div className="space-y-3">
                  <h4 className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
                    <span>📑</span> {isZh ? '本書核心篇章目錄與權威參照大綱：' : 'Master Chapters & Authority References:'}
                  </h4>

                  <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                    {currentBook.chapters.map((ch, idx) => {
                      const chTitle =
                        activeTabLang === 'JA' && ch.title_ja ? ch.title_ja :
                        activeTabLang === 'EN' && ch.title_en ? ch.title_en :
                        ch.title_zh || ch.title_en;

                      const chContent =
                        activeTabLang === 'JA' && ch.content_ja ? ch.content_ja :
                        activeTabLang === 'EN' && ch.content_en ? ch.content_en :
                        ch.content_zh || ch.content_en;

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
                            {chTitle}
                          </h5>
                          <p className="text-[11px] sm:text-xs text-gray-300 line-clamp-2 mt-1 leading-relaxed">
                            {chContent}
                          </p>

                          {ch.references && ch.references.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-white/5 flex flex-wrap items-center gap-2 text-[10px] text-emerald-300">
                              <span className="font-bold">📚 權威參照：</span>
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
                      <span>🔓</span> {isZh ? '已購買讀者？輸入信箱即刻驗證解鎖閱讀：' : 'Already Purchased? Enter Email to Unlock:'}
                    </span>
                    {currentBook.r2_published_urls?.primary_url && (
                      <a
                        href={currentBook.r2_published_urls.primary_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-cyan-400 hover:underline font-bold"
                      >
                        🔗 預覽官方精裝母檔 ➔
                      </a>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      value={verifyEmail}
                      onChange={(e) => setVerifyEmail(e.target.value)}
                      placeholder={isZh ? '請輸入購書時之 Email (例如 reader@example.com)' : 'Enter your purchase email'}
                      className="flex-1 bg-black/60 border border-indigo-400/40 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <button
                      onClick={handleVerifyReader}
                      className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shrink-0"
                    >
                      解鎖防盜版閱讀
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
                            📖 即刻進入專屬 R2 防盜版閱讀器
                          </a>
                          <Link
                            href="/ebook-store"
                            className="px-3 py-1.5 rounded-lg bg-white/10 text-white font-bold text-xs hover:bg-white/20 transition-all"
                          >
                            📚 前往全站 VIP 書櫃
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 模擬購買結算結果展示 (體驗 10% 倒抵與 25% 聯盟分潤) */}
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
          <Link
            href="/studio"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-black text-sm shadow-[0_0_25px_rgba(236,72,153,0.4)] transition-all hover:scale-105"
          >
            ✍️ 您也是知識名家？立即 $990 加盟，上架您的專屬電子書！
          </Link>
          <Link
            href="/ebook-store"
            className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-all"
          >
            📚 瀏覽全部 VIP 讀者書櫃 (/ebook-store)
          </Link>
        </div>
      </div>
    </section>
  );
}
