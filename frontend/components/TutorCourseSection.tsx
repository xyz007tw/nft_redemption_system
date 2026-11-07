'use client';

import { useState, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { useLanguage, Lang } from '@/lib/LanguageContext';
import BuyNFTButton from './BuyNFTButton';
import PayUniButton from './PayUniButton';
import PayPalButton from './PayPalButton';
import { BIGMONEY_PROMO_HTML_ZH, BIGMONEY_PROMO_HTML_EN } from '@/lib/bigmoneyPromoHtml';
import { SAAS_AVME_PROMO_HTML_ZH, SAAS_AVME_PROMO_HTML_EN } from '@/lib/saasAvmePromoHtml';

interface TutorCourseSectionProps {
  courses: any[];
}

export default function TutorCourseSection({ courses }: TutorCourseSectionProps) {
  const { lang, setLang } = useLanguage();
  const { address } = useAccount();
  const isChinese = lang.includes('zh');
  const promoContainerRef = useRef<HTMLDivElement | null>(null);
  const langOptions: { code: Lang; name: string }[] = [
    { code: 'zh-TW', name: '繁體中文' },
    { code: 'zh-CN', name: '简体中文' },
    { code: 'en-US', name: 'English' },
    { code: 'ja-JP', name: '日本語' },
    { code: 'ko-KR', name: '한국어' },
    { code: 'vi-VN', name: 'Tiếng Việt' }
  ];

  const fallbackCourses = [
    {
      id: 101,
      name_zh: '教材 01｜20年首席架構師 · AI-ATM 自動商業變現大師班',
      name_en: 'Course 01 | 20-Year Chief Architect · AI-ATM Commercial Monetization Masterclass',
      amount: 1,
      price: 39,
      discount_text: isChinese ? '🔥 20年老兵底層思維・現省$260・享25%分潤' : '🔥 20y Chief Architect · Save $260 · 25% Affiliate',
      product_type: 'DIRECT_COURSE',
      course_link: 'https://vip.5208.uk/wp-content/uploads/ebooks/material_101_ai_atm.pdf',
      promo_html_zh: BIGMONEY_PROMO_HTML_ZH,
      promo_html_en: BIGMONEY_PROMO_HTML_EN
    },
    {
      id: 102,
      name_zh: '教材 02｜SaaS-AVME 3.0 雙引擎 AI 短影音自動化大師手冊',
      name_en: 'Course 02 | SaaS-AVME 3.0 Dual-Engine AI Short Video Master Manual',
      amount: 1,
      price: 39,
      discount_text: isChinese ? '⚡ 開口即成片・雙引擎無頭渲染・享25%分潤' : '⚡ Speak It into Video · Save $160 · 25% Affiliate',
      product_type: 'DIRECT_COURSE',
      course_link: 'https://vip.5208.uk/wp-content/uploads/ebooks/material_102_saas_avme.pdf',
      promo_html_zh: SAAS_AVME_PROMO_HTML_ZH,
      promo_html_en: SAAS_AVME_PROMO_HTML_EN
    },
    {
      id: 103,
      name_zh: '教材 03｜WordPress 多語系自動化 SEO 站群變現術',
      name_en: 'Course 03 | WordPress Multilingual Automated SEO Network Monetization',
      amount: 1,
      price: 39,
      discount_text: isChinese ? '🌐 12站被動長尾流量・自動造血・享25%分潤' : '🌐 12-Site SEO Network · Save $160 · 25% Affiliate',
      product_type: 'DIRECT_COURSE',
      course_link: 'https://vip.5208.uk/wp-content/uploads/ebooks/material_103_wp_seo.pdf',
      promo_html_zh: '',
      promo_html_en: ''
    },
    {
      id: 104,
      name_zh: '教材 04｜24H 零人工看守：AI Agent 智慧客服搭建與 RAG 實戰',
      name_en: 'Course 04 | 24/7 Zero-Staff AI Agent Support & Enterprise RAG Masterclass',
      amount: 1,
      price: 49,
      discount_text: isChinese ? '🤖 私有知識庫・多語系自適應・享25%分潤' : '🤖 RAG Knowledge Base · Save $250 · 25% Affiliate',
      product_type: 'DIRECT_COURSE',
      course_link: 'https://vip.5208.uk/wp-content/uploads/ebooks/material_104_ai_agent.pdf',
      promo_html_zh: '',
      promo_html_en: ''
    },
    {
      id: 105,
      name_zh: '教材 05｜25% 聯盟裂變與全球金流自動交付系統深度解密',
      name_en: 'Course 05 | 25% Viral Affiliate Engine & Global Automated Payment Architecture',
      amount: 1,
      price: 59,
      discount_text: isChinese ? '💰 10%級差+10%對等+5%全球分紅・享25%分潤' : '💰 25% Viral Commission System · Save $340',
      product_type: 'DIRECT_COURSE',
      course_link: 'https://vip.5208.uk/wp-content/uploads/ebooks/material_105_affiliate_25.pdf',
      promo_html_zh: '',
      promo_html_en: ''
    },
    {
      id: 106,
      name_zh: '教材 06｜全球電子書自動交付與 100% 倒抵 SaaS 系統架構',
      name_en: 'Course 06 | Global EBook Automated Delivery & 100% Offset SaaS Architecture',
      amount: 1,
      price: 49,
      discount_text: isChinese ? '📖 數位資產SaaS・秒級交付・享25%分潤' : '📖 Digital Asset SaaS · Save $250 · 25% Affiliate',
      product_type: 'DIRECT_COURSE',
      course_link: 'https://vip.5208.uk/wp-content/uploads/ebooks/material_106_ebook_saas.pdf',
      promo_html_zh: '',
      promo_html_en: ''
    },
    {
      id: 107,
      name_zh: '教材 07｜LINE 貼圖 AI 批量生圖與全自動裁切上架實戰',
      name_en: 'Course 07 | LINE Sticker AI Batch Generation & Automated Publishing Masterclass',
      amount: 1,
      price: 29,
      discount_text: isChinese ? '🎨 圖文輕創業・小白即學即用・享25%分潤' : '🎨 Graphic Creative Moat · Save $70 · 25% Affiliate',
      product_type: 'DIRECT_COURSE',
      course_link: 'https://vip.5208.uk/wp-content/uploads/ebooks/material_107_line_sticker.pdf',
      promo_html_zh: '',
      promo_html_en: ''
    },
    {
      id: 108,
      name_zh: '教材 08｜LiveGood 智能協辦與 AI 協播自動化系統',
      name_en: 'Course 08 | LiveGood Smart Copilot & Automated AI Broadcasting Matrix',
      amount: 1,
      price: 39,
      discount_text: isChinese ? '⚡ 國際訂閱制漏斗・自動協播・享25%分潤' : '⚡ Global Subscription Funnel · Save $160',
      product_type: 'DIRECT_COURSE',
      course_link: 'https://vip.5208.uk/wp-content/uploads/ebooks/material_108_livegood_ai.pdf',
      promo_html_zh: '',
      promo_html_en: ''
    },
    {
      id: 109,
      name_zh: '教材 09｜零成本獲客：AI 尋客 365 天自動拓客實操指南',
      name_en: 'Course 09 | Zero-Cost Traffic Moat: 365-Day AI Automated Prospecting Manual',
      amount: 1,
      price: 29,
      discount_text: isChinese ? '🔍 爬蟲熱門採集・去重造血・享25%分潤' : '🔍 365-Day AI Prospecting · Save $100 · 25% Affiliate',
      product_type: 'DIRECT_COURSE',
      course_link: 'https://vip.5208.uk/wp-content/uploads/ebooks/material_109_ai_traffic.pdf',
      promo_html_zh: '',
      promo_html_en: ''
    },
    {
      id: 110,
      name_zh: '教材 10｜Web3 NFT 數位憑證與智能合約商務賦能大師手冊',
      name_en: 'Course 10 | Web3 NFT Certificate & Smart Contract Business Empowerment Manual',
      amount: 1,
      price: 59,
      discount_text: isChinese ? '💎 虛實整合・錢包免簽・享25%分潤' : '💎 Web3 NFT Smart Contract Moat · Save $340',
      product_type: 'DIRECT_COURSE',
      course_link: 'https://vip.5208.uk/wp-content/uploads/ebooks/material_110_web3_nft.pdf',
      promo_html_zh: '',
      promo_html_en: ''
    },
    {
      id: 100,
      name_zh: '🏆 全套 10 門課 VIP 終身旗艦合輯（贈 2 枚微享 NFT 憑證）',
      name_en: 'VIP 100 | Complete 10-Course Master Bundle (Incl. 2 Weixiang NFTs)',
      amount: 2,
      price: 198,
      discount_text: isChinese ? '👑 現省$232・贈2枚NFT(360天權限)＋享25%分潤' : '👑 Save $232 · Incl. 2 NFTs · 25% Affiliate',
      product_type: 'DIRECT_COURSE',
      course_link: 'https://vip.5208.uk/dashboard/',
      promo_html_zh: BIGMONEY_PROMO_HTML_ZH,
      promo_html_en: BIGMONEY_PROMO_HTML_EN
    }
  ];

  const displayCourses = courses && courses.length > 0 ? courses : fallbackCourses;
  const [selectedCourseId, setSelectedCourseId] = useState<number>(displayCourses[0].id);
  const selectedCourse = displayCourses.find(c => c.id === selectedCourseId) || displayCourses[0];
  const selectedCourseIndex = displayCourses.findIndex(c => c.id === selectedCourse.id);

  // AI頂配教材大綱導覽卡片 (AI Master Materials Showcase - 10 Modules)
  const curriculumModules = [
    {
      badge: isChinese ? '教材 01 · 旗艦架構' : 'Master 01 · Flagship Architecture',
      icon: '👑',
      title: isChinese ? '20年首席架構師 · AI-ATM 自動商業變現' : '20-Year Chief Architect · AI-ATM Commercial Monetization',
      desc: isChinese
        ? '徹底告別「1份時間賣1次」的傳統思維！結合短影音衝刺、WP-SEO馬拉松長跑與25%人脈裂變三軌流量，在全世界開幾十台24H無人自動販賣機。'
        : 'Break free from trading time for money. Leverage triple-track traffic (Shorts + SEO + 25% Affiliate) to build global automated money machines.',
      points: isChinese
        ? ['✓ 三軌流量引擎協同打法', '✓ 平行時間擴展多重被動收入', '✓ 20年工程實戰系統閉環思維']
        : ['✓ Triple-track traffic engine', '✓ Parallel multi-income expansion', '✓ 20y veteran architectural loop'],
      color: 'from-amber-500 to-yellow-600',
      border: 'hover:border-amber-400/60'
    },
    {
      badge: isChinese ? '教材 02 · 影音產線' : 'Master 02 · Video Automation',
      icon: '🎬',
      title: isChinese ? 'SaaS-AVME 3.0 雙引擎 AI 短影音自動化' : 'SaaS-AVME 3.0 Dual-Engine AI Short Video Matrix',
      desc: isChinese
        ? '手把手拆解 Remotion 代碼級無頭渲染＋開口即成片產線，打造日產百支跨國高品質短影音的超級印鈔機。'
        : 'Headless Remotion rendering + instant AI voiceover to mass-produce 100+ high-converting short videos daily.',
      points: isChinese
        ? ['✓ 零剪輯基礎 24H 自動出片', '✓ 多語系 AI 語音配音與字幕自動合成', '✓ 專屬 QR 導流高轉化漏斗']
        : ['✓ Zero editing skills required', '✓ Multilingual AI dubbing & auto-subtitles', '✓ High-converting QR funnel setup'],
      color: 'from-emerald-500 to-teal-600',
      border: 'hover:border-emerald-400/60'
    },
    {
      badge: isChinese ? '教材 03 · 站群長跑' : 'Master 03 · SEO Matrix',
      icon: '🌐',
      title: isChinese ? 'WordPress 多語系自動化 SEO 站群變現術' : 'WordPress Multilingual Automated SEO Network',
      desc: isChinese
        ? 'AI 雙大腦自動化造血，自動抓取趨勢熱門話題、去重、翻譯並自動發布至 12 個獨立站台，卡位 Google 長尾自然流量。'
        : 'Dual-brain AI trend harvesting, deduplication, translation, and automated publishing across 12 independent WP sites.',
      points: isChinese
        ? ['✓ 熱門話題自動採集與造血去重', '✓ 中/英/日多語系站群全自動發布', '✓ 建立被動搜尋流量護城河']
        : ['✓ Automated trend scraping & deduplication', '✓ Multilingual automated publishing', '✓ Evergreen organic search moat'],
      color: 'from-cyan-500 to-blue-600',
      border: 'hover:border-cyan-400/60'
    },
    {
      badge: isChinese ? '教材 04 · 智慧客服' : 'Master 04 · AI Agent Support',
      icon: '🤖',
      title: isChinese ? '24H 零人工看守：AI Agent 智慧客服與 RAG' : '24/7 Zero-Staff AI Agent Support & RAG Engine',
      desc: isChinese
        ? '將您的產品知識庫、常見問題、分潤規則寫入私有向量資料庫，打造跨時區、跨語系、秒級回應且主動促成轉化的 AI 員工。'
        : 'Embed knowledge bases into private vector stores to deploy 24/7 multilingual sales and support agents that convert.',
      points: isChinese
        ? ['✓ 私有 RAG 檢索增強生成架構', '✓ 智能巡檢與最優 CP 值模型容錯', '✓ 跨時區 24H 自動促單成交']
        : ['✓ Private RAG retrieval architecture', '✓ Model auto-patrol & fallback sequence', '✓ 24/7 automated closing & conversion'],
      color: 'from-purple-500 to-indigo-600',
      border: 'hover:border-purple-400/60'
    },
    {
      badge: isChinese ? '教材 05 · 裂變金流' : 'Master 05 · Viral Affiliate',
      icon: '💰',
      title: isChinese ? '25% 聯盟裂變與全球金流自動交付系統' : '25% Viral Affiliate Engine & Global Payments',
      desc: isChinese
        ? '10% 級差 + 10% 對等 + 5% 全球分紅裂變協議！結合信用卡、PayPal、銀聯與 USDT 雙軌收款，實現無人看守秒級分潤。'
        : '10% Tier + 10% Matching + 5% Global Pool viral model. Integrated fiat, PayPal, UnionPay, and Web3 crypto auto-payouts.',
      points: isChinese
        ? ['✓ 信用卡、PayPal、銀聯與 USDT 雙軌收單', '✓ 智能推薦鏈路與非推廣者訪客自動歸戶', '✓ 25% 聯盟分潤全自動結算合約']
        : ['✓ Fiat, PayPal, UnionPay & Web3 crypto payments', '✓ Organic visitor top-tier auto-bind', '✓ 100% automated 25% commission payout'],
      color: 'from-amber-500 to-orange-600',
      border: 'hover:border-amber-400/60'
    },
    {
      badge: isChinese ? '教材 06 · 電子書 SaaS' : 'Master 06 · EBook SaaS',
      icon: '📖',
      title: isChinese ? '全球電子書自動交付與 100% 倒抵 SaaS' : 'Global EBook Automated Delivery & 100% Offset SaaS',
      desc: isChinese
        ? '為全球知識創作者打造的無人看守 SaaS！一次性加盟費 100% 倒抵平台抽成，學員付款後秒級自動發送專屬加密閱讀連結。'
        : 'Zero-touch SaaS for digital authors: 100% setup fee offset against commissions with automated instant reader delivery.',
      points: isChinese
        ? ['✓ $990 加盟 100% 倒抵零風險機制', '✓ 專屬 Cloudflare R2 加密閱讀與下載', '✓ 中/英/日多語系自選雙語生成']
        : ['✓ 100% offset risk-free SaaS model', '✓ Dedicated R2 secure reading & download', '✓ Dual-language automatic compilation'],
      color: 'from-pink-500 to-rose-600',
      border: 'hover:border-pink-400/60'
    },
    {
      badge: isChinese ? '教材 07 · 輕量副業' : 'Master 07 · Graphic Creative',
      icon: '🎨',
      title: isChinese ? 'LINE 貼圖 AI 批量生圖與全自動裁切上架' : 'LINE Sticker AI Batch Generation & Publishing',
      desc: isChinese
        ? '運用 AI 批量產出高辨識度原創角色，配合自動化批次裁剪、打包與格式轉換腳本，快速攻佔 LINE 貼圖文創被動收入市場。'
        : 'Leverage generative AI to create viral IP characters with automated cropping, resizing, and one-click store packaging.',
      points: isChinese
        ? ['✓ 提示詞工程打造專屬角色 IP', '✓ Python 自動裁切合規尺寸與透明底', '✓ 快速上架搶佔文創被動分潤']
        : ['✓ IP prompt engineering blueprint', '✓ Auto-cropping & transparency processing', '✓ Instant submission to LINE store'],
      color: 'from-green-500 to-emerald-600',
      border: 'hover:border-green-400/60'
    },
    {
      badge: isChinese ? '教材 08 · 跨國協銷' : 'Master 08 · LiveGood Automation',
      icon: '⚡',
      title: isChinese ? 'LiveGood 智能協辦與 AI 協播自動化' : 'LiveGood Smart Copilot & Automated Broadcasting',
      desc: isChinese
        ? '專為國際訂閱制直銷量身打造的自動化協辦系統，AI 自動協播、多語系解說並自動鎖定推薦人，打造全球化拓展利器。'
        : 'Automated broadcasting, multilingual landing pages, and lead locking tailored for global subscription funnels.',
      points: isChinese
        ? ['✓ 國際訂閱制漏斗設計與自動追蹤', '✓ 多國語言 AI 影音即時解說', '✓ 自動綁定推薦碼與無漏單分潤']
        : ['✓ Global subscription funnel setup', '✓ Multilingual AI video presentations', '✓ Referral tracking & lead capture'],
      color: 'from-teal-500 to-cyan-600',
      border: 'hover:border-teal-400/60'
    },
    {
      badge: isChinese ? '教材 09 · 流量造血' : 'Master 09 · 365 Traffic Moat',
      icon: '🔍',
      title: isChinese ? '零成本獲客：AI 尋客 365 天自動拓客' : 'Zero-Cost Traffic: 365-Day AI Prospecting Moat',
      desc: isChinese
        ? '告別昂貴付費廣告！運用自動化找題爬蟲與趨勢雷達，365 天源源不絕製造精準潛在客戶感興趣的解決方案內容。'
        : 'Say goodbye to expensive ads! Deploy automated trend spiders to generate customer-attracting content 365 days a year.',
      points: isChinese
        ? ['✓ 趨勢話題自動監控與庫存補水', '✓ 零歷史依賴動態去重產線', '✓ $0 獲取高精準高轉化商業客戶']
        : ['✓ Trend radar & auto-replenishment', '✓ Zero-history deduplication engine', '✓ $0 cost for high-intent B2B/B2C leads'],
      color: 'from-sky-500 to-blue-600',
      border: 'hover:border-sky-400/60'
    },
    {
      badge: isChinese ? '教材 10 · 數位資產' : 'Master 10 · Web3 Smart Contract',
      icon: '💎',
      title: isChinese ? 'Web3 NFT 數位憑證與智能合約商務賦能' : 'Web3 NFT Certificate & Smart Contract Moat',
      desc: isChinese
        ? '鏈上不可篡改的數位會員證！結合 ERC-721/1155 智能合約，實現錢包免簽名身分認證、秒級收益提領與虛實權益兌換。'
        : 'Immutable on-chain membership passes. Deploy smart contracts for signature-free auth, instant payouts, and asset redemption.',
      points: isChinese
        ? ['✓ ERC-721 智能合約商務客製', '✓ Web3 錢包免註冊一鍵授權開課', '✓ 鏈上永久版權與防偽憑證']
        : ['✓ ERC-721 custom smart contracts', '✓ Web3 wallet 1-click authentication', '✓ Permanent on-chain IP & proof of ownership'],
      color: 'from-violet-500 to-purple-600',
      border: 'hover:border-violet-400/60'
    }
  ];

  // Email forwarding & download state
  const [buyerEmail, setBuyerEmail] = useState('');
  const [targetEmail, setTargetEmail] = useState('');
  const [isForwarding, setIsForwarding] = useState(false);
  const [unlockedLink, setUnlockedLink] = useState<string | null>(null);
  const [downloadLinks, setDownloadLinks] = useState<any | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleForwardAndUnlock = async () => {
    setStatusMsg(null);
    if (!targetEmail || !targetEmail.includes('@')) {
      setStatusMsg({
        type: 'error',
        text: isChinese ? '請輸入欲接收或轉發的有效電子信箱 (Email)' : 'Please enter a valid recipient email address.'
      });
      return;
    }

    setIsForwarding(true);
    try {
      const res = await fetch('/api/course/forward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerEmail: buyerEmail.trim() || targetEmail.trim(),
          walletAddress: address || '',
          targetEmail: targetEmail.trim(),
          packageId: selectedCourse.id
        })
      });
      const data = await res.json();
      if (data.success) {
        setUnlockedLink(data.courseLink);
        if (data.downloadLinks) setDownloadLinks(data.downloadLinks);
        setStatusMsg({
          type: 'success',
          text: isChinese
            ? `✅ 驗證成功！各語系教材與下載連結已發送至 ${targetEmail}，您也可以直接在下方點選各語系版本下載！`
            : `✅ Verified! Multi-language material links forwarded to ${targetEmail}, and unlocked below!`
        });
      } else {
        setStatusMsg({
          type: 'error',
          text: data.error || (isChinese ? '查無購買紀錄或轉發失敗' : 'Verification failed or no purchase record found.')
        });
      }
    } catch (e: any) {
      setStatusMsg({
        type: 'error',
        text: e.message || (isChinese ? '系統連線異常' : 'Network error')
      });
    } finally {
      setIsForwarding(false);
    }
  };

  // Determine default fallback HTML based on course name/price/index if not explicitly saved in DB
  const isAvmeCourse =
    selectedCourseIndex === 1 ||
    Number(selectedCourse.price) === 99 ||
    String(selectedCourse.name_zh || '').toLowerCase().includes('avme') ||
    String(selectedCourse.name_en || '').toLowerCase().includes('avme');

  const defaultHtmlZh = isAvmeCourse ? SAAS_AVME_PROMO_HTML_ZH : BIGMONEY_PROMO_HTML_ZH;
  const defaultHtmlEn = isAvmeCourse ? SAAS_AVME_PROMO_HTML_EN : BIGMONEY_PROMO_HTML_EN;

  const customPromoHtml = isChinese
    ? (selectedCourse.promo_html_zh || selectedCourse.promo_html_en || defaultHtmlZh)
    : (selectedCourse.promo_html_en || selectedCourse.promo_html_zh || defaultHtmlEn);

  // Hydrate and execute any <script> tags inside customPromoHtml (e.g. 5-project carousel & language toggle)
  useEffect(() => {
    const container = promoContainerRef.current;
    if (!container) return;

    const scripts = Array.from(container.querySelectorAll('script'));
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.text = oldScript.textContent || '';
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });
  }, [customPromoHtml, selectedCourseId, lang]);

  return (
    <section id="tutor-courses" className="w-full max-w-7xl px-3 sm:px-6 py-10 md:py-16 scroll-mt-24 overflow-hidden">
      <div className="bg-gradient-to-br from-emerald-950/60 via-slate-900/90 to-cyan-950/60 border border-emerald-500/40 rounded-3xl p-4 sm:p-8 md:p-14 relative overflow-hidden shadow-[0_0_60px_rgba(16,185,129,0.2)]">
        {/* 背景裝飾光暈 */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />

        {/* 1. 頂部標題導覽區 */}
        <div className="text-center mb-10 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-sm font-bold mb-5 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <span>🎓</span>
            {isChinese ? 'AI頂配教材導覽專區・付費秒級下載 ＋ 一鍵轉發電郵' : 'AI Master Materials Guide · Instant Download & Email Forwarding'}
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-5 tracking-tight text-white drop-shadow-lg leading-tight">
            {isChinese ? '🔥 AI頂配教材導覽專區・手把手實戰秘笈' : '🔥 AI Master Materials Guide & Practical Blueprint'}
          </h2>
          <p className="text-lg md:text-xl text-emerald-100/85 max-w-4xl mx-auto leading-relaxed">
            {isChinese
              ? '從零打造您的 24H 自動化獲客系統！購買後不僅立即解鎖「AI頂配教材」高清下載、自動寄送至您的信箱，還可隨時「一鍵轉發電郵」給團隊或朋友，並全額納入 25% 聯盟推廣分潤！'
              : 'Build your 24/7 automated client acquisition system from scratch! Unlock instant AI Master Materials download, automatic inbox delivery, 1-click email forwarding to your team, and full 25% affiliate commissions!'}
          </p>
        </div>

        {/* 1.5 頂部教材快速切換頁籤 (點擊即切換下方完整宣傳頁與結帳金額) */}
        <div className="mb-8 relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
            <h3 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
              <span>📚</span>
              {lang === 'zh-TW' ? '請點選欲閱覽與選購的「AI頂配教材」專題：' :
               lang === 'zh-CN' ? '请点选欲阅览与选购的「AI顶配教材」专题：' :
               lang === 'ja-JP' ? '閲覧・購入する「AIマスター教材」を選択してください：' :
               lang === 'ko-KR' ? '열람 및 구매할 「AI 마스터 교재」를 선택하세요:' :
               lang === 'vi-VN' ? 'Chọn chuyên đề 「Giáo trình AI」 để xem & đặt mua:' :
               'Select an AI Master Material to Preview & Order:'}
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-emerald-300">🌐</span>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as Lang)}
                aria-label="Select Language"
                className="bg-slate-900 hover:bg-slate-800 text-white border border-emerald-400/50 rounded-full px-3.5 py-1.5 text-xs font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)]"
              >
                {langOptions.map((opt) => (
                  <option key={opt.code} value={opt.code} className="bg-slate-900 text-white">
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayCourses.map((course, idx) => {
              const isSelected = course.id === selectedCourse.id;
              return (
                <button
                  key={course.id}
                  type="button"
                  onClick={() => setSelectedCourseId(course.id)}
                  className={`text-left cursor-pointer rounded-2xl p-5 border transition-all duration-300 flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-900/80 via-teal-900/70 to-cyan-900/80 border-amber-400 shadow-[0_0_30px_rgba(250,204,21,0.3)] scale-[1.01]'
                      : 'bg-black/50 border-white/15 hover:border-emerald-400/50 hover:bg-white/5'
                  }`}
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                        isSelected ? 'bg-amber-400 text-black' : 'bg-white/10 text-gray-300'
                      }`}>
                        {isChinese ? `🎓 頂配教材 0${idx + 1}` : `🎓 Course 0${idx + 1}`}
                      </span>
                      <span className="text-xs font-bold text-emerald-300">
                        {course.discount_text || (isChinese ? '享 25% 推廣分潤' : '25% Affiliate Eligible')}
                      </span>
                    </div>
                    <div className="font-black text-white text-base md:text-lg leading-snug">
                      {isChinese ? course.name_zh : (course.name_en || course.name_zh)}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-2xl md:text-3xl font-black font-mono text-amber-400">
                      ${course.price}
                    </div>
                    <div className="text-[11px] text-gray-300 font-bold">
                      {isSelected ? (isChinese ? '👁️ 當前預覽中' : '👁️ Viewing') : (isChinese ? '點擊切換 →' : 'View →')}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. AI頂配教材宣傳文案 HTML 或預設三大核心大綱導覽卡片 */}
        <div className="mb-12 relative z-10">
          {customPromoHtml.trim() ? (
            <div
              ref={promoContainerRef}
              className="w-full rounded-2xl overflow-hidden"
              dangerouslySetInnerHTML={{ __html: customPromoHtml }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {curriculumModules.map((mod, idx) => (
                <div
                  key={idx}
                  className={`bg-white/5 border border-white/10 ${mod.border} rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] flex flex-col justify-between backdrop-blur-md`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-emerald-300 border border-white/10">
                        {mod.badge}
                      </span>
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${mod.color} flex items-center justify-center text-2xl shadow-lg`}>
                        {mod.icon}
                      </div>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3 leading-snug">
                      {mod.title}
                    </h4>
                    <p className="text-gray-300 text-sm leading-relaxed mb-5">
                      {mod.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 space-y-1.5">
                    {mod.points.map((pt, pIdx) => (
                      <div key={pIdx} className="text-xs font-semibold text-emerald-300/90">
                        {pt}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. 多套教材快速切換卡片列 */}
        <div id="course-checkout-box" className="mb-10 relative z-10 scroll-mt-24">
          <h3 className="text-lg font-bold text-emerald-300 mb-4 flex items-center gap-2">
            <span>🎯</span>
            {isChinese ? '點選您要選購或領取的「AI頂配教材」方案：' : 'Select Your AI Master Materials Package:'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayCourses.map((course) => {
              const isSelected = course.id === selectedCourse.id;
              return (
                <div
                  key={course.id}
                  onClick={() => setSelectedCourseId(course.id)}
                  className={`cursor-pointer rounded-2xl p-5 border transition-all duration-300 flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-900/60 to-cyan-900/60 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.35)] scale-[1.01]'
                      : 'bg-black/40 border-white/10 hover:border-emerald-500/40 hover:bg-white/5'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-3 h-3 rounded-full ${isSelected ? 'bg-emerald-400 animate-pulse' : 'bg-gray-600'}`} />
                      <span className="text-xs font-bold text-emerald-300">
                        {course.discount_text || (isChinese ? '享 25% 推廣分潤' : '25% Affiliate Eligible')}
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-base md:text-lg">
                      {isChinese ? course.name_zh : (course.name_en || course.name_zh)}
                    </h4>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-2xl font-black font-mono text-emerald-400">
                      ${course.price}
                    </div>
                    <div className="text-[11px] text-gray-400">USDT</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. 左右雙欄：左側雙軌秒級結帳 / 右側學員下載與一鍵轉發電郵 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
          {/* 左側：教材選購結帳區 */}
          <div className="bg-gray-900/90 border border-emerald-500/30 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {isChinese ? 'STEP 1 · 立即結帳開通 AI頂配教材' : 'STEP 1 · Instant Materials Checkout'}
                </span>
                <span className="text-emerald-400 font-mono font-black text-2xl">
                  ${selectedCourse.price} USDT
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 mb-6">
                <div className="text-xs text-gray-400 mb-1">
                  {isChinese ? '當前選定 AI頂配教材：' : 'Selected AI Master Materials:'}
                </div>
                <div className="text-lg font-bold text-white mb-2">
                  {isChinese ? selectedCourse.name_zh : (selectedCourse.name_en || selectedCourse.name_zh)}
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    {isChinese ? '✓ 付款後自動寄送教材信件' : '✓ Auto Email Delivery'}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    {isChinese ? '✓ 計入 25% 推廣業績分潤' : '✓ 25% Affiliate Commission'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <PayUniButton
                packageId={selectedCourse.id}
                priceInUSDT={selectedCourse.price}
                productType="DIRECT_COURSE"
                productName={isChinese ? selectedCourse.name_zh : (selectedCourse.name_en || selectedCourse.name_zh)}
              />
              <PayPalButton
                packageId={selectedCourse.id}
                priceInUSDT={selectedCourse.price}
                productType="DIRECT_COURSE"
                productName={isChinese ? selectedCourse.name_zh : (selectedCourse.name_en || selectedCourse.name_zh)}
              />
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-800"></div>
                <span className="flex-shrink-0 mx-4 text-gray-500 text-xs font-medium">OR WEB3 USDT</span>
                <div className="flex-grow border-t border-gray-800"></div>
              </div>
              <BuyNFTButton
                packageId={selectedCourse.id === 101 ? 2 : selectedCourse.id === 102 ? 1 : selectedCourse.id}
                priceInUSDT={selectedCourse.price}
              />
            </div>
          </div>

          {/* 右側：學員下載 & 一鍵轉發電郵區 */}
          <div className="bg-gray-900/90 border border-cyan-500/30 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {isChinese ? 'STEP 2 · AI頂配教材下載 & 轉發電郵' : 'STEP 2 · Download & Forward Email'}
                </span>
                <span className="text-xs text-gray-400">
                  {address
                    ? (isChinese ? `已連結錢包: ${address.substring(0, 6)}...` : `Wallet: ${address.substring(0, 6)}...`)
                    : (isChinese ? '支援購買信箱驗證' : 'Email Verification')}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                {isChinese ? '📤 付費學員專屬：AI頂配教材下載與轉發電郵' : '📤 Student Portal: Download & Forward via Email'}
              </h3>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                {isChinese
                  ? '已完成購買之學員，請輸入您的「購買驗證信箱」（若已連接購買錢包可免填）以及「欲接收/轉發的目標信箱」，即可立即解鎖下載並將 AI頂配教材 轉寄至指定信箱！'
                  : 'Purchased students: Enter your purchase email (optional if wallet connected) and the target recipient email to immediately unlock the download link and forward the AI Master Materials via email!'}
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    {isChinese ? '1. 購買驗證信箱 (若使用信用卡購買請填寫)：' : '1. Your Purchase Email (for verification):'}
                  </label>
                  <input
                    type="email"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder={isChinese ? '輸入您購買時填寫的 Email' : 'Your purchase email address'}
                    className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-cyan-300 font-semibold mb-1">
                    {isChinese ? '2. 欲接收 / 轉發教材的目標電子信箱 (必填)：' : '2. Target Email to Receive / Forward Materials (Required):'}
                  </label>
                  <input
                    type="email"
                    value={targetEmail}
                    onChange={(e) => setTargetEmail(e.target.value)}
                    placeholder={isChinese ? '輸入欲接收教材的親友或個人 Email' : 'Recipient email to receive download link'}
                    className="w-full bg-black border border-cyan-500/50 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={handleForwardAndUnlock}
                disabled={isForwarding}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>📧</span>
                {isForwarding
                  ? (isChinese ? '驗證與發送信件中...' : 'Verifying & Sending Email...')
                  : (isChinese ? '一鍵轉發 AI頂配教材 至信箱 & 解鎖下載' : 'Forward AI Master Materials & Unlock Download')}
              </button>

              {statusMsg && (
                <div className={`mt-4 p-3 rounded-xl text-xs font-medium ${
                  statusMsg.type === 'success'
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                    : 'bg-red-500/20 border border-red-500/40 text-red-300'
                }`}>
                  {statusMsg.text}
                </div>
              )}

              {unlockedLink && (
                <div className="mt-4 space-y-3">
                  <a
                    href={unlockedLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-black font-black rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
                  >
                    <span>📥</span>
                    {isChinese ? '立即點擊下載 / 進入 vip.5208.uk 學員教室' : 'Click Here to Download / Enter vip.5208.uk Classroom'}
                  </a>

                  {downloadLinks && (
                    <div className="p-4 rounded-xl bg-black/60 border border-emerald-500/40 space-y-2">
                      <div className="text-xs font-bold text-emerald-300 mb-2">
                        {isChinese
                          ? '📚 統一由 VIP 創客實戰學院 (vip.5208.uk) 供檔・點選語系直接下載：'
                          : '📚 Hosted on VIP Academy (vip.5208.uk) · Select Language to Download:'}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                        <a href={downloadLinks.zh_tw} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 flex items-center justify-between">
                          <span>🇹🇼 繁體中文 PDF</span>
                          <span>⬇</span>
                        </a>
                        <a href={downloadLinks.zh_cn} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 flex items-center justify-between">
                          <span>🇨🇳 简体中文 PDF</span>
                          <span>⬇</span>
                        </a>
                        <a href={downloadLinks.en} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 flex items-center justify-between">
                          <span>🇺🇸 English PDF</span>
                          <span>⬇</span>
                        </a>
                        <a href={downloadLinks.ja} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 flex items-center justify-between">
                          <span>🇯🇵 日本語版 PDF</span>
                          <span>⬇</span>
                        </a>
                        <a href={downloadLinks.interactive_html} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/50 text-emerald-300 flex items-center justify-between">
                          <span>🌐 雙語互動閱讀器</span>
                          <span>↗</span>
                        </a>
                        <a href={downloadLinks.code_zip} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/50 text-purple-300 flex items-center justify-between">
                          <span>💻 實戰源碼包 (.zip)</span>
                          <span>⬇</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
