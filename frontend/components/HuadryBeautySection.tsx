'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

export default function HuadryBeautySection() {
  const { lang } = useLanguage();
  const [innerLang, setInnerLang] = useState<'zh' | 'en'>(lang === 'en-US' ? 'en' : 'zh');
  const [copyMsg, setCopyMsg] = useState<string | null>(null);

  const isZh = innerLang === 'zh';

  const handleCopyUrl = (url: string, label: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
    setCopyMsg(isZh ? `✅ 已複製【${label}】網址，可直接貼上分享！` : `✅ Copied [${label}] link!`);
    setTimeout(() => setCopyMsg(null), 4000);
  };

  return (
    <div id="beauty" className="w-full bg-[#fef0f8] text-[#333] pb-12 scroll-mt-24">
      {/* 04 專屬廣告直達網址複製列 */}
      <div className="max-w-5xl mx-auto pt-6 px-4">
        <div className="p-4 bg-gradient-to-r from-[#831843] via-[#9d174d] to-[#be185d] rounded-2xl border-2 border-[#ffd700] shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl">💄</span>
            <div>
              <div className="text-xs sm:text-sm font-black text-[#ffd700] flex flex-wrap items-center gap-2">
                <span>
                  {isZh
                    ? '【客製與協辦 04】萬商客集・AI 全球美業（花緹生技 × 60天AI純服務陪跑）專屬直達網址'
                    : '【Service 04】Global AI Beauty Alliance (Huadry Biotech × 60-Day AI Coaching) Direct Link'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ffd700]/20 text-[#ffd700] border border-[#ffd700]/50">
                  {isZh ? '可直接轉址推廣' : 'Direct Share URL'}
                </span>
              </div>
              <div className="text-xs text-pink-200 font-mono mt-0.5 select-all break-all">
                https://nft1314.party/#video-shoppable-service?tab=beauty
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="inline-flex rounded-full bg-black/30 p-1 border border-white/20">
              <button
                type="button"
                onClick={() => setInnerLang('zh')}
                className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
                  isZh ? 'bg-[#ffd700] text-[#831843]' : 'text-white hover:text-[#ffd700]'
                }`}
              >
                繁中
              </button>
              <button
                type="button"
                onClick={() => setInnerLang('en')}
                className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
                  !isZh ? 'bg-[#ffd700] text-[#831843]' : 'text-white hover:text-[#ffd700]'
                }`}
              >
                EN
              </button>
            </div>
            <button
              type="button"
              onClick={() =>
                handleCopyUrl(
                  'https://nft1314.party/#video-shoppable-service?tab=beauty',
                  isZh ? '04 萬商客集・AI全球美業' : '04 AI Global Beauty'
                )
              }
              className="px-4 py-2 rounded-full bg-gradient-to-r from-[#ffd700] to-[#ffed4e] hover:opacity-95 text-[#831843] text-xs font-black shadow-lg hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <span>📋</span>
              <span>{isZh ? '複製本頁網址' : 'Copy Link'}</span>
            </button>
          </div>
        </div>
        {copyMsg && (
          <div className="mt-2 text-center text-xs font-bold text-[#9d174d] bg-pink-100 border border-pink-300 rounded-xl py-2 px-4">
            {copyMsg}
          </div>
        )}
      </div>

      {/* HERO BANNER */}
      <div
        className="mt-6 mx-4 sm:mx-8 rounded-3xl text-white px-6 py-12 md:py-16 text-center relative overflow-hidden shadow-[0_12px_40px_rgba(194,57,179,0.28)]"
        style={{ background: 'linear-gradient(140deg, #ff6b9d 0%, #c239b3 60%, #831843 100%)' }}
      >
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/30 text-[#ffd700] text-xs md:text-sm font-black mb-4 backdrop-blur-sm">
            <span>👑 萬商客集 · AI 全球美業創富計畫</span>
            <span>｜</span>
            <span>花緹生技 (Huadry Biotech) × 微享 AI-ATM</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black leading-tight mb-4 drop-shadow-md">
            {isZh ? (
              <>
                💎 一張臉養出「睡後副業」！<br />
                萬商客集 · AI 全球美業邀您美麗又有全球副業收入
              </>
            ) : (
              <>
                💎 Turn Your Skincare Routine Into a Global Side Income!<br />
                Global AI Beauty Alliance × Huadry Biotech
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-pink-50 max-w-3xl mx-auto leading-relaxed mb-6 font-medium">
            {isZh
              ? '✨ $0 免費加入花緹會員 × 自我培訓專業美業技能 × 60天純服務輔導 AI Agent 數位員工為您開創專屬收入 × 斗內 $15 全網協播廣告 1 個月輕鬆賺取產品差價！'
              : '✨ $0 Free Huadry Membership × Self-Paced Pro Beauty Skill Training × 60-Day Pure-Service AI Agent Coaching × $15/mo Global Ad Co-Broadcasting to Earn Retail & Wholesale Margins!'}
          </p>

          {/* 核心亮點膠囊徽章 */}
          <div className="flex flex-wrap justify-center gap-2.5 mb-8">
            <span className="px-4 py-2 rounded-full bg-[#ffd700] text-[#831843] font-black text-xs sm:text-sm shadow-lg">
              {isZh ? '🎁 STEP 1：$0 免費註冊花緹官網會員' : '🎁 STEP 1: $0 Free Huadry Registration'}
            </span>
            <span className="px-4 py-2 rounded-full bg-white text-[#c239b3] font-black text-xs sm:text-sm shadow-lg">
              {isZh ? '🤖 贈「60天體驗期純服務」輔導 AI 員工幫您找客' : '🤖 60-Day Pure-Service AI Agent Coaching'}
            </span>
            <span className="px-4 py-2 rounded-full bg-[#ffd700] text-[#831843] font-black text-xs sm:text-sm shadow-lg">
              {isZh ? '📢 斗內 $15 全球百站協播廣告 30 天賺差價' : '📢 $15 Global Ad Broadcast for 30 Days'}
            </span>
            <span className="px-4 py-2 rounded-full bg-white/20 border border-white/40 text-white font-black text-xs sm:text-sm">
              {isZh ? '🎯 累積 28,000 PV 解鎖 365 天 AI 無限分身全球尋客' : '🎯 Reach 28,000 PV for 365-Day AI Global Lead Gen'}
            </span>
          </div>

          {/* 雙核心主行動按鈕 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://aitutor.vip/f0"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#ffd700] via-[#ffed4e] to-[#ffd700] text-[#831843] font-black text-base md:text-lg shadow-[0_10px_30px_rgba(255,215,0,0.45)] hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <span>🌸</span>
              <span>
                {isZh
                  ? '立即免費加入「花緹生技」會員 (推薦碼專屬通道)'
                  : 'Join Huadry Biotech for FREE Now (Official Referral)'}
              </span>
              <span>➔</span>
            </a>
            <a
              href="/sponsor"
              className="w-full sm:w-auto px-7 py-4 rounded-full bg-white/15 hover:bg-white/25 border-2 border-white text-white font-black text-sm md:text-base shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <span>📢</span>
              <span>
                {isZh
                  ? '斗內 $15 開通「萬商廣告協播 30 天」推美業賺差價'
                  : 'Sponsor $15 for 30-Day Global Ad Broadcast'}
              </span>
            </a>
          </div>
          <p className="text-xs text-pink-100 mt-3 opacity-90">
            {isZh
              ? '🔗 官方專屬免費註冊連結：https://aitutor.vip/f0 （點擊後立即可選購花緹醫美級保養品自用體驗、預約試臉及深化美容技術）'
              : '🔗 Official Free Signup Link: https://aitutor.vip/f0 (Instantly shop Honey Belle skincare & start your beauty training)'}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-10 space-y-10">
        {/* 區塊一：影片與 AI 全球美業趨勢圖 (16:9 影片 + 1:1 趨勢圖雙欄對照) */}
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-[0_8px_30px_rgba(194,57,179,0.12)] border border-pink-100">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#c239b3] text-center mb-2">
            {isZh
              ? '🎬 AI 全球美業方案介紹 ＆ 市場發展大趨勢'
              : '🎬 AI Global Beauty Introduction & Market Trends'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 text-center mb-8 max-w-2xl mx-auto">
            {isZh
              ? '結合「台灣花緹生技 (Huadry Biotech) SGS 安心驗證醫美級保養品」與「微享 24H AI Agent 自動化引流系統」，打造一個人也能跨國經營的雲端美容事業！'
              : 'Combining Huadry Biotech SGS-certified skincare with WeiXiang 24/7 AI Agent lead generation.'}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* 左側 16:9 YouTube 影片 */}
            <div className="lg:col-span-7">
              <div className="relative w-full pt-[56.25%] rounded-2xl overflow-hidden shadow-[0_12px_35px_rgba(194,57,179,0.22)] border-2 border-[#ff6b9d]">
                <iframe
                  src={isZh ? 'https://www.youtube.com/embed/Bx6U6z12WNc' : 'https://www.youtube.com/embed/N-8VOA5viII'}
                  title="AI Global Beauty Program"
                  className="absolute inset-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 px-1">
                <span className="font-bold text-[#c239b3]">
                  {isZh ? '▲ 3 分鐘看懂：如何用美業技能 ＋ AI 員工開創全球被動副業' : '▲ 3-Min Video: Beauty Skills + AI Agent Global Business'}
                </span>
                <a
                  href="https://www.huadry.com.tw/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#9d174d] font-black underline hover:opacity-80"
                >
                  {isZh ? '🌐 參觀花緹生技官方網站 (huadry.com.tw) ➔' : '🌐 Visit Huadry Official Website ➔'}
                </a>
              </div>
            </div>

            {/* 右側 1:1 視覺圖卡 */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-[380px] aspect-square rounded-2xl overflow-hidden shadow-[0_12px_35px_rgba(194,57,179,0.18)] border border-pink-200 bg-white">
                <img
                  src={isZh ? 'https://1.5208.uk/yes.jpg?text=PC+ZH' : 'https://1.5208.uk/yes.jpg?text=PC+EN'}
                  alt="AI Global Beauty Trend"
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>
              <span className="mt-2.5 text-xs font-bold text-slate-500">
                {isZh ? '📊 AI 全球美業發展趨勢與雙軌倍增模型' : '📊 AI Global Beauty Growth & Dual-Engine Model'}
              </span>
            </div>
          </div>
        </div>

        {/* 區塊二：🔥 網小白也能輕鬆上手的「4 步美麗創富 SOP 飛輪」（核心行銷計劃） */}
        <div className="bg-gradient-to-br from-white via-[#fff5fa] to-[#ffe4f2] rounded-3xl p-6 md:p-10 shadow-[0_8px_30px_rgba(194,57,179,0.14)] border-2 border-[#ff6b9d]">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#c239b3] text-white text-xs font-black mb-2">
              {isZh ? '🗺️ 零風險・先體驗後放大・4 步美麗變現藍圖' : '🗺️ Zero-Risk 4-Step Beauty & AI Income Blueprint'}
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#831843]">
              {isZh
                ? '不用囤貨壓力！從「免費加入 ➔ 試臉培訓 ➔ $15 全球打廣告賺差價」完整攻略'
                : 'No Inventory Pressure! From Free Signup to $15 Global Ad Co-Broadcasting'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              {isZh
                ? '我們把傳統美業最難的「技術學習」與「找客戶打廣告」全部標準化，跟著以下 4 步走，讓您自己變美、身邊朋友變美，還能賺取全球差價收入：'
                : 'We standardized both beauty skill training and global AI customer acquisition into 4 simple steps:'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* STEP 1 */}
            <div className="bg-white rounded-2xl p-6 border-2 border-pink-200 hover:border-[#c239b3] shadow-md transition-all flex flex-col justify-between relative">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full bg-pink-100 text-[#c239b3] text-xs font-black">
                    STEP 01｜$0 免費啟動
                  </span>
                  <span className="text-2xl">🌸</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#831843] mb-2">
                  {isZh ? '免費註冊花緹官網會員' : 'Free Huadry Member Signup'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {isZh
                    ? '點擊專屬推薦通道（https://aitutor.vip/f0）免費加入花緹生技官方會員！零入會費，立即解鎖官網商城選購權限與專屬美容學習資源。'
                    : 'Click our official link (https://aitutor.vip/f0) to register as a Huadry member for FREE! Zero joining fee.'}
                </p>
              </div>
              <a
                href="https://aitutor.vip/f0"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-[#ff6b9d] to-[#c239b3] text-white text-xs font-black text-center shadow hover:opacity-95 transition-all block"
              >
                {isZh ? '👉 點此免費註冊花緹會員' : '👉 Free Signup (aitutor.vip/f0)'}
              </a>
            </div>

            {/* STEP 2 */}
            <div className="bg-white rounded-2xl p-6 border-2 border-pink-200 hover:border-[#c239b3] shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full bg-pink-100 text-[#c239b3] text-xs font-black">
                    STEP 02｜體驗 × 累積分升等
                  </span>
                  <span className="text-2xl">💆‍♀️</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#831843] mb-2">
                  {isZh ? '自用或幫客戶試臉・累積 PV 拿貨更優惠' : 'Self-Use or Facial Trials · Accumulate PV for Deeper Discounts'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {isZh
                    ? '自由選購花緹產品自己體驗或幫客戶試臉！搭配系統化美容課程深化手法，每一筆選購自動累積「產品積分 (PV)」，積分越高直接升等，下次拿貨批發價更優惠、利潤空間更大！'
                    : 'Try products yourself or offer facial trials to clients! Every order accumulates PV points to upgrade your tier for deeper wholesale discounts on future orders.'}
                </p>
              </div>
              <div className="mt-4 py-2 px-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] font-bold text-amber-900 text-center">
                {isZh ? '💡 越用越便宜・邊學技術邊賺試臉與零售差價' : '💡 Accumulate PV to unlock higher wholesale margins'}
              </div>
            </div>

            {/* STEP 3 */}
            <div className="bg-white rounded-2xl p-6 border-2 border-amber-400 shadow-lg transition-all flex flex-col justify-between relative">
              <div className="absolute -top-3 right-3 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 text-[10px] font-black shadow">
                {isZh ? '🔥 小資爆單神器' : '🔥 Best CP Value'}
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black">
                    STEP 03｜$15 全球協播
                  </span>
                  <span className="text-2xl">📢</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#831843] mb-2">
                  {isZh ? '斗內 $15 全球協播廣告 1 個月・推薦產品賺差價' : 'Sponsor $15 for 30-Day Global Ad Broadcast & Earn Margins'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {isZh
                    ? '不敢開口推銷？只要在官網斗內 $15 USD（每天不到台幣 16 元），立即開通「萬商自助廣告系統」整整 30 天！把您的花緹推薦連結與試臉服務掛上我們邁向 100 站的全球多語系網站自動輪播，吸引全球買家主動找您買產品賺差價！'
                    : 'Dont like cold-calling? Sponsor just $15 USD to broadcast your Huadry referral link across our 100-site multilingual network for 30 days and earn retail/wholesale price differences!'}
                </p>
              </div>
              <a
                href="/sponsor"
                className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black text-center shadow hover:opacity-95 transition-all block"
              >
                {isZh ? '👉 前往斗內 $15 開通 30 天全網廣告' : '👉 Launch $15/mo Global Ad Now'}
              </a>
            </div>

            {/* STEP 4 */}
            <div className="bg-white rounded-2xl p-6 border-2 border-purple-300 hover:border-purple-600 shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-black">
                    STEP 04｜60天陪跑 ➔ 365天免錢
                  </span>
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#831843] mb-2">
                  {isZh ? '60天純服務輔導 AI 員工 ＆ 滿 28,000 PV 享 365天自動來客' : '60-Day AI Agent Coaching & 365-Day AI Lead Gen at 28,000 PV'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {isZh
                    ? '享有「60天體驗期純服務」手把手輔導您駕馭全球化 AI Agent 數位員工！當批發採購累積達 28,000 PV，更直接解鎖「365天 AI 無限分身全球自動化尋客」＋免費贈送鈔級業務輔助神器！'
                    : 'Enjoy our 60-Day Pure-Service Coaching to deploy your AI Agent staff! Once your cumulative orders hit 28,000 PV, unlock 365 days of full AI global automated lead generation + free Super Sales Artifact!'}
                </p>
              </div>
              <a
                href="#shoppable-contact-hub"
                className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-black text-center shadow hover:opacity-95 transition-all block"
              >
                {isZh ? '👉 預約 60 天 AI 純服務輔導諮詢' : '👉 Book 60-Day AI Coaching'}
              </a>
            </div>
          </div>
        </div>

        {/* 區塊三：🤖 獨家王牌亮點 —— 什麼是「60天體驗期純服務：美業技能自我培訓 × 全球化 AI Agent 員工輔導」？ */}
        <div className="bg-gradient-to-r from-[#2e1065] via-[#4a044e] to-[#831843] text-white rounded-3xl p-6 md:p-10 shadow-xl border-2 border-[#ffd700]/60">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <span className="inline-block px-4 py-1 rounded-full bg-[#ffd700] text-[#4a044e] text-xs font-black mb-3">
              {isZh ? '👑 業界首創 · 雙導師陪跑賦能（美業技術導師 × 20年 AI 總工程師團隊）' : '👑 Dual-Mentorship: Pro Beauty Trainers × 20-Yr Chief AI Architect'}
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-snug">
              {isZh
                ? '給您「60 天體驗期純服務」：一手練好頂尖護膚手藝，一手養出 24H 為您跨國找客的 AI Agent 數位員工！'
                : '60-Day Pure-Service Empowerment: Master Pro Skincare Skills & Train Your 24/7 Global AI Agent Staff!'}
            </h2>
            <p className="text-xs sm:text-sm text-pink-100 mt-3 leading-relaxed">
              {isZh
                ? '很多愛美夥伴想做美業副業，卻卡在「不會專業手法」或「臉皮薄不敢推銷」。我們提供整整 60 天純服務體驗輔導（不收高昂學費、純技術與系統陪跑），幫您把「手藝」與「客源」一次搞定：'
                : 'Many beauty lovers struggle with professional facial techniques or shy away from sales. Our 60-Day Pure-Service program solves both:'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-3xl mb-3">🎓</div>
              <h3 className="text-base sm:text-lg font-black text-[#ffd700] mb-2">
                {isZh ? '01｜協助自我培訓美業專業技能' : '01 | Self-Paced Pro Beauty Skill Training'}
              </h3>
              <p className="text-xs sm:text-sm text-pink-50 leading-relaxed">
                {isZh
                  ? '結合花緹生技「高績效銷售特訓營」與專業教育培訓課程，從肌膚檢測、屏障修護、逆時緊緻拉提手法到「幫閨蜜/客戶試臉半邊臉立即有感」的實戰SOP，讓素人在家也能練成美業專家！'
                  : 'From skin analysis and barrier repair to instant-result half-face trial SOPs, learn professional aesthetic techniques step by step.'}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-[#ffd700]/60 shadow-[0_0_25px_rgba(255,215,0,0.2)]">
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="text-base sm:text-lg font-black text-[#ffd700] mb-2">
                {isZh ? '02｜60天純服務輔導 AI Agent 數位員工' : '02 | 60-Day Pure-Service AI Agent Coaching'}
              </h3>
              <p className="text-xs sm:text-sm text-pink-50 leading-relaxed">
                {isZh
                  ? '整整 60 天體驗期內，由我們團隊純服務輔導您設定專屬「全球化 AI Agent 員工」—— 教您一鍵翻譯繁/簡/英/日 4 國語言美業宣傳卡、自動回答客戶保養諮詢，讓您下班睡覺時 AI 員工還在幫您開創全球專屬收入！'
                  : 'During the 60-day trial period, our team coaches you on configuring your Global AI Agent to auto-translate beauty ads into 4 languages and attract clients 24/7.'}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="text-base sm:text-lg font-black text-[#ffd700] mb-2">
                {isZh ? '03｜$15 萬商協播 × 升等批發價差雙重賺' : '03 | $15 Global Ad × Wholesale Margin Flywheel'}
              </h3>
              <p className="text-xs sm:text-sm text-pink-50 leading-relaxed">
                {isZh
                  ? '透過斗內 $15 啟動全網百站協播 1 個月，將您的花緹專屬推薦碼與試臉預約表曝光給全球精準受眾；客戶下單或您進貨幫客戶做臉，皆可累積 PV 升級拿更低折數，穩穩賺取豐厚產品差價！'
                  : 'Broadcast your Huadry link across 100+ sites for just $15/mo. Every customer order or facial trial builds your PV for higher wholesale discounts and retail profit margins!'}
              </p>
            </div>
          </div>
        </div>

        {/* 區塊四：🌸 台灣花緹生技 (Huadry Biotech) 嚴選明星商品 × PV 積分對照表 */}
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-[0_8px_30px_rgba(194,57,179,0.12)] border border-pink-100">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <span className="inline-block px-3.5 py-1 rounded-full bg-pink-100 text-[#c239b3] text-xs font-black mb-2">
              {isZh ? '🏅 SGS 安心檢驗認證 · 台灣醫學美容保養領導品牌' : '🏅 SGS Certified · Premier Medical-Grade Skincare from Taiwan'}
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#c239b3]">
              {isZh
                ? '🌸 花緹生技 (Honey Belle 系列 & 保健專區) 熱門體驗商品與 PV 積分一覽'
                : '🌸 Huadry Biotech Featured Skincare & PV Points Overview'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              {isZh
                ? '改變與改善的安全醫學美容保養品！先從單瓶自用或「花緹夢幻旅行組」幫朋友試臉開始，每一筆訂單皆可累積 PV 積分，晉升更優惠批發拿貨等級：'
                : 'Start with a single bottle or the Dream Travel Set for client facial trials. Every purchase accumulates PV points toward wholesale upgrades:'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {[
              {
                tag: isZh ? '👑 試臉＆入門首選' : '👑 Best for Facial Trials',
                name: isZh ? '花緹夢幻旅行組 / HT耀時屏障修護乳霜 (5ml×21支)' : 'Huadry Dream Travel Set / HT Barrier Repair Cream',
                price: 'NT$ 12,800',
                pv: '10,800 PV',
                desc: isZh
                  ? '獨立安瓶包裝最衛生！出門幫客戶試臉、旅遊隨身保養首選，單組即累積高達 10,800 PV！'
                  : 'Hygienic individual ampoules—ideal for client facial demonstrations and travel. Earns 10,800 PV per set!'
              },
              {
                tag: isZh ? '💎 殿堂級亮白王牌' : '💎 Whitening Flagship',
                name: isZh ? '微晶淨白 C 粉 (12g×10支)' : 'Micro-Crystal Brightening Vitamin C Powder (12g×10)',
                price: 'NT$ 19,800',
                pv: '17,000 PV',
                desc: isZh
                  ? '沙龍級高濃度煥白修護，針對暗沉瑕疵肌膚試臉效果驚艷，單盒高達 17,000 PV（2盒直衝 23,800 PV）！'
                  : 'Salon-grade brightening powder with dramatic trial results. Earns 17,000 PV per box!'
              },
              {
                tag: isZh ? '✨ 逆時緊緻必備' : '✨ Anti-Aging Bestseller',
                name: isZh ? '全效青春精華元素 / 奇肌煥膚調理霜 / 激光淨白精華霜' : 'Youth Essence / Miracle Renewal Cream / Laser Brightening Cream',
                price: 'NT$ 3,980 ~ 4,200',
                pv: '3,000 ~ 3,600 PV',
                desc: isZh
                  ? '深入肌底撫平歲月痕跡，搭配拉提手技讓客戶當場感受緊緻光采，回購率第一名！'
                  : 'Deeply rejuvenates skin with visible lifting results during facial sessions—our #1 repeat-order items!'
              },
              {
                tag: isZh ? '☀️ 素顏發光女神' : '☀️ Daily UV & Glow',
                name: isZh ? '全護勻亮防曬霜 / 心機潤色防曬霜 / 抗痕豐潤彈力霜' : 'UV Brightening Sunscreen / Tinted Sunscreen / Firming Cream',
                price: 'NT$ 3,990',
                pv: '3,500 PV',
                desc: isZh
                  ? '擦上立即擁有偽素顏好氣色，朋友看到主動問「妳擦了什麼？」，最容易分享成交的爆款單品！'
                  : 'Creates an instant natural glow that makes friends ask what youre wearing—easiest item to recommend!'
              },
              {
                tag: isZh ? '💧 小資無痛入門' : '💧 Starter Essentials',
                name: isZh ? '清透淨化潔顏露 / 平衡水漾柔膚露 / 舒顏柔敏修護精華 / 抗引力逆時抗皺霜' : 'Cleansing Gel / Balancing Toner / Soothing Serum / Anti-Wrinkle Cream',
                price: 'NT$ 1,995 ~ 2,415',
                pv: '1,600 ~ 2,000 PV',
                desc: isZh
                  ? '不到兩千元即可體驗花緹醫美級洗卸與基礎保濕修護，天天必用消耗品，穩定創造長尾續購！'
                  : 'Under NT$2,000 to experience Huadry medical-grade daily cleansing and hydration—high repeat consumption!'
              },
              {
                tag: isZh ? '🌿 內外兼修保健系列' : '🌿 Inner Beauty Supplements',
                name: isZh ? '唐肽棕定序苦瓜多肽 / 妍皙素 / 嬌澎元素 / 視易清 / 馥孅' : 'Bitter Melon Peptide / Brightening / Collagen / Eye Care / Slimming',
                price: 'NT$ 2,880 ~ 3,299',
                pv: '2,100 ~ 2,300 PV',
                desc: isZh
                  ? '不只外在擦保養，更從內在調理體態、膠原澎潤與晶亮健康，全方位滿足全家人的美麗健康需求！'
                  : 'Complete inner-and-outer beauty care covering collagen, metabolism, and daily wellness.'
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl p-5 bg-gradient-to-br from-[#fff5fa] to-white border border-pink-200 hover:border-[#c239b3] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-pink-100 text-[#c239b3] text-[11px] font-black">
                      {item.tag}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#ffd700]/30 text-[#831843] text-xs font-black">
                      ⭐ {item.pv}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 mb-1.5">{item.name}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">{item.desc}</p>
                </div>
                <div className="pt-2 border-t border-pink-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">
                    {isZh ? '官方參考價：' : 'Retail:'} <strong className="text-[#c239b3] text-sm">{item.price}</strong>
                  </span>
                  <a
                    href="https://aitutor.vip/f0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-black text-[#9d174d] hover:underline"
                  >
                    {isZh ? '免費入會選購 ➔' : 'Join & Shop ➔'}
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <a
              href="https://aitutor.vip/f0"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#ff6b9d] to-[#c239b3] text-white font-black text-sm md:text-base shadow-lg hover:scale-105 transition-all"
            >
              <span>🛒</span>
              <span>
                {isZh
                  ? '點此透過專屬推薦碼 (aitutor.vip/f0) 免費加入花緹會員・瀏覽全系列商品與批發積分'
                  : 'Click Here (aitutor.vip/f0) for Free Huadry Membership & Full Catalog'}
              </span>
            </a>
          </div>
        </div>

        {/* 區塊五：🌟 為什麼選擇「萬商客集 · AI 全球美業」？（6 大核心優勢 + 28,000 PV 國際加盟方案） */}
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-[0_8px_30px_rgba(194,57,179,0.12)] border border-pink-100">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#c239b3] text-center mb-8">
            {isZh ? '🌟 為什麼選擇「萬商客集 · AI 全球美業」？' : '🌟 Why Choose Global AI Beauty Alliance?'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {[
              {
                icon: '🎓',
                title: isZh ? '專業美容技術自我培訓' : 'Professional Beauty Skill Training',
                desc: isZh
                  ? '提供系統化美容護膚與高績效特訓課程，從基礎保養、試臉實操到進階諮詢手法，助您快速練成美業專家。'
                  : 'Systematic skincare and facial trial courses from basics to advanced client consultation.'
              },
              {
                icon: '🛍️',
                title: isZh ? '優質醫美產品批發與積分升等' : 'Premium Wholesale & PV Tier Upgrades',
                desc: isZh
                  ? '嚴選花緹 SGS 檢驗安心保養品，自用或幫客戶試臉皆可累積 PV 積分，升等後下次拿貨享更優批發價差！'
                  : 'Accumulate PV points with every order to unlock deeper wholesale discounts and higher retail margins.'
              },
              {
                icon: '📢',
                title: isZh ? '斗內 $15 全球百站協播 1 個月' : '$15 Global 100-Site Ad Co-Broadcast',
                desc: isZh
                  ? '免學複雜投放！斗內 $15 即可在微享全球多語系網站群自助上架花緹推薦廣告 30 天，輕鬆引流賺取產品差價。'
                  : 'Just $15 to broadcast your Huadry ad across our global multilingual sites for 30 days.'
              },
              {
                icon: '🤖',
                title: isZh ? '60天純服務輔導 AI Agent 員工' : '60-Day Pure-Service AI Agent Coaching',
                desc: isZh
                  ? '專屬 60 天體驗期純服務陪跑，教您運用全球化 AI Agent 數位員工自動產出多國語系美業圖文，24H 為您開創副業收入。'
                  : '60 days of hands-on coaching to set up your AI Agent staff for 24/7 global beauty marketing.'
              },
              {
                icon: '🌐',
                title: isZh ? '滿 28,000 PV 享 365天 AI 無限分身尋客' : '365-Day AI Global Lead Gen at 28,000 PV',
                desc: isZh
                  ? '累積批發達 28,000 PV 即成為正式國際加盟商，直接解鎖一整年 365 天多語系 SEO＋雙語短影音＋社群全球自動尋客免錢！'
                  : 'Reach 28,000 PV to unlock 365 days of multilingual SEO + bilingual short video global lead generation for free!'
              },
              {
                icon: '🚀',
                title: isZh ? '加碼贈送「鈔級業務輔助神器」' : 'Bonus: Free Super Sales Assistant Artifact',
                desc: isZh
                  ? '達標國際加盟方案再加碼贈送一套微享「鈔級業務輔助神器」，可任選最合適的 AI 系統工具，日常維護 0 成本！'
                  : 'Includes a free Super Sales Assistant AI tool with zero daily maintenance cost!'
              }
            ].map((card, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 bg-gradient-to-br from-[#fff0f8] to-[#ffe6f2] border-2 border-transparent hover:border-[#ff6b9d] transition-all text-center shadow-sm"
              >
                <div className="text-4xl mb-3">{card.icon}</div>
                <h3 className="text-base sm:text-lg font-black text-[#c239b3] mb-2">{card.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>

          {/* 💎 28,000 PV 國際加盟方案 5 大完整權益 */}
          <div className="rounded-3xl p-6 md:p-8 bg-gradient-to-br from-[#fdf2f8] via-white to-[#fffbeb] border-2 border-[#c239b3]/30">
            <div className="text-center mb-6">
              <div className="inline-block px-4 py-1 rounded-full bg-[#ffd700] text-[#831843] text-xs font-black mb-2">
                {isZh ? '💎 進階事業跳板 · 批發累積即可達標' : '💎 Official International Franchise Milestone'}
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#c239b3]">
                {isZh ? '累積批發積數 28,000 PV · 國際加盟方案 5 大尊榮權益' : 'Accumulate 28,000 PV · 5 Franchisee Privileges'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl mx-auto">
                {isZh
                  ? '💡 什麼是 PV？PV = 批發積分點數 (Purchase Volume)。您自己購買體驗、進貨幫客戶試臉或推廣成交的訂單都會累積相應 PV，累計滿 28,000 PV 立即免費解鎖以下全套跨國 AI 美業武器：'
                  : '💡 What is PV? PV = Purchase Volume points accumulated through your orders. Reach 28,000 PV to unlock all 5 privileges:'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                {
                  num: '01',
                  title: isZh ? '📚 美容技術培訓課程' : '📚 Pro Beauty Training',
                  items: isZh
                    ? ['基礎美容護膚技術', '進階功能操作教學', '客戶試臉與諮詢技巧', '產品知識深度培訓']
                    : ['Basic skincare techniques', 'Advanced facial operations', 'Client consultation skills', 'In-depth product training']
                },
                {
                  num: '02',
                  title: isZh ? '🛒 優惠產品批發權限' : '🛒 Wholesale Privileges',
                  items: isZh
                    ? ['升等獲得優惠批發價格', '多樣化醫美產品線選擇', '定期新品優先供應', '穩定賺取零售與批發價差']
                    : ['Discounted wholesale pricing', 'Full skincare & wellness line', 'Priority new product access', 'Higher retail profit margins']
                },
                {
                  num: '03',
                  title: isZh ? '🌍 365天 AI 全球自動尋客' : '🌍 365-Day AI Global Lead Gen',
                  items: isZh
                    ? ['規劃一整年 365 天 AI 尋客免錢', '多語系 SEO + 雙語視頻協播', '轉發全球社群多重曝光', '打造 24H 自動化來客系統']
                    : ['365 days free AI lead gen', 'Multilingual SEO + video', 'Global social syndication', '24/7 automated client funnel']
                },
                {
                  num: '04',
                  title: isZh ? '🎁 行銷素材與推廣工具' : '🎁 Marketing Kit & Tools',
                  items: isZh
                    ? ['專業品牌視覺設計包', '宣傳海報與試臉文宣模板', '社群經營內容範本', '專屬線上推薦連結系統']
                    : ['Brand visual design kit', 'Facial trial poster templates', 'Social media copywriting', 'Online referral link system']
                },
                {
                  num: '05',
                  title: isZh ? '🚀 贈鈔級業務輔助神器' : '🚀 Super Sales Artifact',
                  items: isZh
                    ? ['加碼贈送鈔級業務輔助系統', '可任選最合適的 AI 工具', '系統使用完全免錢', '後續日常維護 0 成本']
                    : ['Bonus super sales AI system', 'Pick the best tool for you', '100% free system usage', 'Zero maintenance cost']
                }
              ].map((step, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-4 border border-pink-200 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="text-xs font-black text-white bg-gradient-to-r from-[#ff6b9d] to-[#c239b3] inline-block px-2.5 py-0.5 rounded-full mb-2">
                      STEP {step.num}
                    </div>
                    <h4 className="text-sm font-black text-[#831843] mb-2">{step.title}</h4>
                    <ul className="text-xs text-slate-600 space-y-1.5">
                      {step.items.map((li, j) => (
                        <li key={j} className="flex items-start gap-1.5">
                          <span className="text-[#c239b3] font-bold">•</span>
                          <span>{li}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 區塊六：🎯 適合對象 ＆ 底部雙軌行動號召 */}
        <div
          className="rounded-3xl p-6 md:p-10 text-white text-center shadow-2xl relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #c239b3 0%, #831843 100%)' }}
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black mb-6">
            {isZh ? '🎯 誰最適合加入「萬商客集 · AI 全球美業」？' : '🎯 Who Should Join the Global AI Beauty Alliance?'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 text-left">
            {[
              {
                icon: '👩‍💼',
                title: isZh ? '美容美甲美睫從業者' : 'Beauty Salon Professionals',
                desc: isZh ? '想引進高利潤醫美保養品、透過 AI 自動尋客擴大客源與被動收入的美容師。' : 'Expand salon offerings and attract new clients automatically with AI.'
              },
              {
                icon: '🌟',
                title: isZh ? '愛美素人心動創業者' : 'Beauty Lovers & Starters',
                desc: isZh ? '零基礎想先免費註冊、學會幫自己與朋友護膚試臉，低門檻開啟美麗事業的您。' : 'Start with $0 registration, learn facial skills, and build a beauty business.'
              },
              {
                icon: '💡',
                title: isZh ? '追求睡後收入的斜槓族' : 'Side-Hustle & Slash Workers',
                desc: isZh ? '下班後沒時間跑業務，想靠「斗內 $15 全球廣告協播 + 60天 AI 員工陪跑」賺取全球差價的上班族。' : 'Leverage $15/mo global ads and 24/7 AI Agents to earn after-hours income.'
              },
              {
                icon: '💖',
                title: isZh ? '愛美與樂於分享生活家' : 'Skincare & Lifestyle Sharers',
                desc: isZh ? '喜歡保養、想越用越便宜，結交愛美同好一起變美又有副業獎金入帳的生活家。' : 'Enjoy wholesale skincare discounts while sharing beauty with friends.'
              }
            ].map((t, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                <div className="text-3xl mb-2">{t.icon}</div>
                <h3 className="text-sm sm:text-base font-black text-[#ffd700] mb-1">{t.title}</h3>
                <p className="text-xs text-pink-50 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto bg-black/25 rounded-2xl p-6 border border-[#ffd700]/40 mb-6">
            <h3 className="text-lg sm:text-xl font-black text-[#ffd700] mb-2">
              {isZh
                ? '🚀 準備好開啟您的「美麗 × AI 全球副業收入」了嗎？'
                : '🚀 Ready to Launch Your Beauty & Global AI Side Income?'}
            </h3>
            <p className="text-xs sm:text-sm text-pink-100 leading-relaxed mb-5">
              {isZh
                ? '現在就透過下方第 1 步「免費註冊花緹官網會員」，接著可任選一瓶保養品自用/試臉累積積分，並搭配「斗內 $15 萬商全球協播 30 天」與「60天 AI Agent 純服務輔導」，讓全球客源主動找上門！'
                : 'Step 1: Register your FREE Huadry account below. Step 2: Experience products & accumulate PV. Step 3: Sponsor $15 for 30-day global ad co-broadcasting + 60-day AI Agent coaching!'}
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3">
              <a
                href="https://aitutor.vip/f0"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#ffd700] hover:bg-[#ffed4e] text-[#831843] font-black text-sm md:text-base shadow-xl hover:scale-105 transition-all"
              >
                {isZh ? '🌸 STEP 1：免費加入花緹會員 (aitutor.vip/f0)' : '🌸 STEP 1: Free Huadry Signup (aitutor.vip/f0)'}
              </a>
              <a
                href="/sponsor"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white text-[#c239b3] font-black text-sm md:text-base shadow-xl hover:scale-105 transition-all"
              >
                {isZh ? '📢 STEP 2：斗內 $15 全球協播廣告 1 個月' : '📢 STEP 2: $15 Global Ad Broadcast (30 Days)'}
              </a>
              <a
                href="#shoppable-contact-hub"
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/15 hover:bg-white/25 border border-white text-white font-black text-sm shadow-lg transition-all"
              >
                {isZh ? '💬 預約 60 天 AI 純服務輔導' : '💬 Book 60-Day AI Coaching'}
              </a>
            </div>
          </div>

          <div className="text-xs text-pink-100 space-y-1 opacity-95">
            <p>
              📞 <strong>LINE / WeChat 諮詢總窗口：</strong>xyz007tw（或美業專線：ceo1314home） ｜ 📧 <strong>Email：</strong>xyz007tw@gmail.com
            </p>
            <p>
              🌸 <strong>花緹生技專屬免費註冊推薦網址：</strong>
              <a href="https://aitutor.vip/f0" target="_blank" rel="noopener noreferrer" className="underline text-[#ffd700] font-bold ml-1">
                https://aitutor.vip/f0
              </a>
              {' '}｜ <strong>花緹官方網站：</strong>
              <a href="https://www.huadry.com.tw/" target="_blank" rel="noopener noreferrer" className="underline text-pink-200 ml-1">
                https://www.huadry.com.tw/
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
