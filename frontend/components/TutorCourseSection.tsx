'use client';

import { useState, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { useLanguage } from '@/lib/LanguageContext';
import BuyNFTButton from './BuyNFTButton';
import PayUniButton from './PayUniButton';
import { BIGMONEY_PROMO_HTML_ZH, BIGMONEY_PROMO_HTML_EN } from '@/lib/bigmoneyPromoHtml';

interface TutorCourseSectionProps {
  courses: any[];
}

export default function TutorCourseSection({ courses }: TutorCourseSectionProps) {
  const { lang } = useLanguage();
  const { address } = useAccount();
  const isChinese = lang.includes('zh');
  const promoContainerRef = useRef<HTMLDivElement | null>(null);

  const fallbackCourse = {
    id: 6,
    name_zh: 'BIGMONEY.AI・AI頂配實戰全套教材（贈微享NFT 2枚）',
    name_en: 'BIGMONEY.AI · AI Master Practical Materials (Incl. 2 NFTs)',
    amount: 2,
    price: 198,
    discount_text: isChinese ? '🔥 贈微享NFT 2枚 (360天系統)＋享 25% 推廣分潤' : '🔥 Bonus 2 NFTs (360d) · 25% Affiliate Eligible',
    product_type: 'DIRECT_COURSE',
    course_link: '',
    promo_html_zh: BIGMONEY_PROMO_HTML_ZH,
    promo_html_en: BIGMONEY_PROMO_HTML_EN
  };

  const displayCourses = courses && courses.length > 0 ? courses : [fallbackCourse];
  const [selectedCourseId, setSelectedCourseId] = useState<number>(displayCourses[0].id);
  const selectedCourse = displayCourses.find(c => c.id === selectedCourseId) || displayCourses[0];

  // AI頂配教材大綱導覽卡片 (AI Master Materials Showcase)
  const curriculumModules = [
    {
      badge: isChinese ? 'AI頂配教材 01' : 'Master Material 01',
      icon: '🎬',
      title: isChinese ? 'AI 短影音與爆款圖卡全自動產線' : 'Automated AI Short Video & Viral Infographic Pipeline',
      desc: isChinese
        ? '手把手拆解如何運用 AI 腳本生成、多語系配音與高轉化資訊圖表，一鍵打造日產百支跨國短影音的流量印鈔機。'
        : 'Step-by-step guide to building an automated AI video, voiceover, and viral infographic production matrix.',
      points: isChinese
        ? ['✓ 零剪輯基礎也能 24H 自動產片', '✓ 跨平台自動排程發佈實戰', '✓ 專屬 QR Code 導流私域秘笈']
        : ['✓ Zero editing skills required', '✓ Multi-platform auto-publishing', '✓ High-converting QR funnel setup'],
      color: 'from-emerald-500 to-teal-600',
      border: 'hover:border-emerald-400/60'
    },
    {
      badge: isChinese ? 'AI頂配教材 02' : 'Master Material 02',
      icon: '🌐',
      title: isChinese ? '全球多語系 SEO 矩陣與精準截流' : 'Global Multilingual SEO Matrix & Traffic Capture',
      desc: isChinese
        ? '掌握 AI 雙大腦自動化長文造血技術，自動翻譯並佈署中、英、日、韓、越等多國語系網站，精準收割全球搜尋引擎自然流量。'
        : 'Master dual-brain AI long-form SEO generation across 6+ languages to dominate global search engine traffic.',
      points: isChinese
        ? ['✓ 熱門趨勢話題自動抓取與去重', '✓ WordPress 全自動發文串接', '✓ 打造被動搜尋流量護城河']
        : ['✓ Automated trend harvesting', '✓ Seamless WordPress integration', '✓ Evergreen organic search moat'],
      color: 'from-cyan-500 to-blue-600',
      border: 'hover:border-cyan-400/60'
    },
    {
      badge: isChinese ? 'AI頂配教材 03' : 'Master Material 03',
      icon: '💎',
      title: isChinese ? 'Web2 刷卡 + Web3 錢包自動收單與 25% 裂變' : 'Web2 + Web3 Auto-Checkout & 25% Viral Affiliate System',
      desc: isChinese
        ? '完整收錄如何將您的知識產品、電子書或服務結合自動發貨系統與 25% 聯盟分潤機制，讓全球學員成為您的自動推廣大軍！'
        : 'Complete blueprint on combining digital products with automated fulfillment and a 25% viral affiliate engine.',
      points: isChinese
        ? ['✓ 信用卡與 USDT 雙軌收款實戰', '✓ 24H AI 智能客服自動成交配置', '✓ 10%級差 + 10%對等 + 5%分紅解析']
        : ['✓ Credit Card & USDT dual checkout', '✓ 24/7 AI sales agent configuration', '✓ 25% affiliate viral loop blueprint'],
      color: 'from-amber-500 to-orange-600',
      border: 'hover:border-amber-400/60'
    }
  ];

  // Email forwarding & download state
  const [buyerEmail, setBuyerEmail] = useState('');
  const [targetEmail, setTargetEmail] = useState('');
  const [isForwarding, setIsForwarding] = useState(false);
  const [unlockedLink, setUnlockedLink] = useState<string | null>(null);
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
        setStatusMsg({
          type: 'success',
          text: isChinese
            ? `✅ 驗證成功！AI頂配教材連結已轉發至 ${targetEmail}，您也可以直接點擊下方按鈕下載！`
            : `✅ Verified! AI Master Material link forwarded to ${targetEmail}, and unlocked below!`
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

  const customPromoHtml = isChinese
    ? (selectedCourse.promo_html_zh || selectedCourse.promo_html_en || BIGMONEY_PROMO_HTML_ZH)
    : (selectedCourse.promo_html_en || selectedCourse.promo_html_zh || BIGMONEY_PROMO_HTML_EN);

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
  }, [customPromoHtml, selectedCourseId, isChinese]);

  return (
    <section id="tutor-courses" className="w-full max-w-7xl px-6 py-16 scroll-mt-20">
      <div className="bg-gradient-to-br from-emerald-950/60 via-slate-900/90 to-cyan-950/60 border border-emerald-500/40 rounded-3xl p-8 md:p-14 relative overflow-hidden shadow-[0_0_60px_rgba(16,185,129,0.2)]">
        {/* 背景裝飾光暈 */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />

        {/* 1. 頂部標題導覽區 */}
        <div className="text-center mb-12 relative z-10">
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

        {/* 2. AI頂配教材宣傳文案 HTML 或預設三大核心大綱導覽卡片 */}
        <div className="mb-12 relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
            <h3 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
              <span>📚</span>
              {isChinese ? 'AI頂配教材・核心實戰模組導覽' : 'AI Master Materials · Core Practical Modules'}
            </h3>
            <span className="text-xs md:text-sm font-bold text-amber-300 bg-amber-500/15 border border-amber-400/30 px-3 py-1 rounded-full">
              {isChinese ? '✨ 付費即享完整 AI 頂配教材與實戰 SOP' : '✨ Includes Complete AI Master Materials & SOPs'}
            </span>
          </div>

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
              />
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-800"></div>
                <span className="flex-shrink-0 mx-4 text-gray-500 text-xs font-medium">OR WEB3 USDT</span>
                <div className="flex-grow border-t border-gray-800"></div>
              </div>
              <BuyNFTButton
                packageId={selectedCourse.id}
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
                <a
                  href={unlockedLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full py-3.5 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-black font-black rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  <span>📥</span>
                  {isChinese ? '立即點擊下載 / 觀看 AI頂配教材' : 'Click Here to Download / Access AI Master Materials'}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
