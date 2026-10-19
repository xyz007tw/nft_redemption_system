'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

export default function VideoShoppableSection() {
  const { lang } = useLanguage();
  const isGlobalChinese = lang.includes('zh');
  const [localLang, setLocalLang] = useState<'zh' | 'en'>(isGlobalChinese ? 'zh' : 'en');
  const [copyToast, setCopyToast] = useState<string | null>(null);

  useEffect(() => {
    setLocalLang(isGlobalChinese ? 'zh' : 'en');
  }, [isGlobalChinese]);

  const isZh = localLang === 'zh';

  const handleCopyId = (idText: string, platformName: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(idText).catch(() => {});
    }
    setCopyToast(
      isZh
        ? `✅ 已成功複製 ${platformName} ID：【${idText}】，請直接開啟 App 貼上搜尋加好友！`
        : `✅ Copied ${platformName} ID: [${idText}] to clipboard!`
    );
    setTimeout(() => setCopyToast(null), 5000);
  };

  return (
    <section id="video-shoppable-service" className="w-full max-w-7xl px-6 py-12 scroll-mt-20">
      <div className="bg-[#f8fafc] text-[#1e293b] rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(2,132,199,0.25)] border-2 border-[#0284c7]">
        {/* 頂部導覽工具列 */}
        <div className="bg-[#0f172a] px-6 py-3.5 flex flex-wrap justify-between items-center gap-3 border-b border-white/15">
          <span className="text-[#38bdf8] text-xs md:text-sm font-extrabold tracking-wider">
            ⚡ CTO SEN ARCHITECTURE · 20 YRS EXP
          </span>
          <div className="flex items-center gap-3">
            <a
              href="#shoppable-contact-hub"
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-sky-600 text-white text-xs font-extrabold shadow-md hover:opacity-95 transition-all"
            >
              {isZh ? '💬 立即接洽規劃' : '💬 Contact CTO'}
            </a>
            <button
              type="button"
              onClick={() => setLocalLang(isZh ? 'en' : 'zh')}
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-[#0284c7] text-white border border-white/25 text-xs font-bold cursor-pointer transition-all"
            >
              🌐 {isZh ? '切換英文 / EN' : '切換中文 / 繁中'}
            </button>
          </div>
        </div>

        {/* 主標題區 (客製化服務定位) */}
        <div
          className="text-center px-6 py-10 text-white border-b-4 border-[#0284c7]"
          style={{ background: 'radial-gradient(circle at 50% 0%, #1e293b 0%, #0f172a 85%)' }}
        >
          <div className="inline-block bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-1.5 rounded-full text-xs font-extrabold shadow-lg mb-4">
            {isZh
              ? '企業/品牌客製化建置服務 · 專人架構對接'
              : 'Custom Enterprise Implementation · Direct CTO Consultation'}
          </div>

          <h2 className="text-2xl md:text-4xl font-black text-white mb-4 leading-tight">
            {isZh ? (
              <>
                新開發 AI「<span className="text-[#38bdf8]">影片導購系統</span>」客製化建置
              </>
            ) : (
              <>
                Custom AI <span className="text-[#38bdf8]">Video Shoppable System</span> Service
              </>
            )}
          </h2>

          <p className="text-sm md:text-base text-slate-300 max-w-3xl mx-auto mb-6 leading-relaxed">
            {isZh
              ? '觀看影片直接讓訪客點選，無縫直達您的官網、商城消費或聯盟推薦網址！由 20 年系統架構總工程師團隊為您量身整合官方 YouTube Data API v3，打造全自動化的超強流量變現閉環。'
              : 'Turn viewers into customers with direct in-video clicks to your store, website, or affiliate links. Custom-engineered with official YouTube Data API v3 for complete 24/7 marketing automation.'}
          </p>

          {/* 數據亮點標籤列 */}
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto mb-7">
            <div className="bg-white/10 border border-sky-400/30 px-4 py-1.5 rounded-full text-xs md:text-sm text-sky-100">
              {isZh ? (
                <>
                  ⚡ <strong className="text-[#38bdf8]">24H</strong> 自動化導購產線
                </>
              ) : (
                <>
                  ⚡ <strong className="text-[#38bdf8]">24/7</strong> Automated Production
                </>
              )}
            </div>
            <div className="bg-white/10 border border-sky-400/30 px-4 py-1.5 rounded-full text-xs md:text-sm text-sky-100">
              {isZh ? (
                <>
                  🔗 官方 <strong className="text-[#38bdf8]">YouTube Data API v3</strong>
                </>
              ) : (
                <>
                  🔗 Official <strong className="text-[#38bdf8]">YouTube Data API v3</strong>
                </>
              )}
            </div>
            <div className="bg-white/10 border border-sky-400/30 px-4 py-1.5 rounded-full text-xs md:text-sm text-sky-100">
              {isZh ? (
                <>
                  🎯 <strong className="text-[#38bdf8]">1變多</strong> 影分身導購閉環
                </>
              ) : (
                <>
                  🎯 <strong className="text-[#38bdf8]">1-to-Many</strong> Shoppable Loops
                </>
              )}
            </div>
          </div>

          {/* 頂部接洽 CTA 按鈕組 */}
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="#shoppable-contact-hub"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-sky-600 text-white font-extrabold text-sm md:text-base shadow-[0_6px_20px_rgba(16,185,129,0.35)] hover:-translate-y-0.5 transition-all border border-emerald-400"
            >
              {isZh
                ? '🤝 預約總工程師客製化評估 (Line / 微信 / 電郵)'
                : '🤝 Book Custom Architecture Consultation'}
            </a>
            <a
              href="#shoppable-custom-plans"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/30 transition-all"
            >
              {isZh ? '📋 查看客製化導入方案規格 ↓' : '📋 View Implementation Tiers ↓'}
            </a>
          </div>
        </div>

        {/* 內容主容器 */}
        <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-10">
          {/* 1. 視頻展示區塊 (16:9 黃金比例) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm text-center">
            <h3 className="text-lg md:text-xl font-extrabold text-slate-900 mb-3">
              {isZh ? '📺 系統實戰運作示範（點擊播放）' : '📺 Live System Demo (Watch Below)'}
            </h3>
            <div className="max-w-2xl mx-auto aspect-video rounded-xl overflow-hidden shadow-lg bg-black">
              <iframe
                width="100%"
                height="100%"
                src={
                  isZh
                    ? 'https://www.youtube.com/embed/PP4LAivRrHY'
                    : 'https://www.youtube.com/embed/9evL1vOMIVc'
                }
                title="AI Video Shoppable System Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>

          {/* 2. 20年總工程師專業剖析區塊 */}
          <div className="bg-white border-2 border-[#0284c7] rounded-2xl p-6 md:p-8 shadow-md">
            <div className="border-b border-slate-200 pb-4 mb-5">
              <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-2">
                {isZh
                  ? '開口即成片！為您的品牌量身打造 24 小時全自動短影音導購產線'
                  : 'Custom-Built 24/7 Automated AI Video Shoppable Pipeline for Your Brand'}
              </h3>
              <span className="inline-block bg-sky-100 text-[#0369a1] text-xs font-bold px-3 py-1 rounded-md">
                {isZh
                  ? '★ 20年跨領域系統架構與首席工程實戰研發'
                  : '★ Engineered by 20-Year Veteran Chief System Architect'}
              </span>
            </div>

            <p className="text-sm md:text-base text-slate-700 mb-6 leading-relaxed">
              {isZh ? (
                <>
                  本客製化服務將最複雜的自動化底層邏輯（API 調度、自動化工作流、分散式分流）為您的商品量身封裝成「一鍵落地」的商業變現系統。
                  <strong className="text-slate-900">核心思維：不靠單點運氣，靠系統工程！</strong>{' '}
                  就像幫您的網路生意鋪設一條「24小時自動運轉的數位高鐵」，底層程式與伺服器架構由我們幫您規劃建置，您只需專注收單與服務客戶。
                </>
              ) : (
                <>
                  Our custom implementation service encapsulates complex low-level engineering (API orchestration, automated workflows, distributed routing) into a turn-key monetization machine tailored to your products.{' '}
                  <strong className="text-slate-900">
                    Core philosophy: Success is not about algorithmic luck; it&apos;s about system engineering.
                  </strong>{' '}
                  Like a 24/7 high-speed digital railway, we build the backend pipelines so you can focus on closing sales.
                </>
              )}
            </p>

            {/* 深度技術模組說明 */}
            <div className="space-y-4 mb-6">
              {/* 技術 1 */}
              <div className="bg-slate-50 border border-slate-200 border-l-4 border-l-[#0284c7] rounded-xl p-5">
                <h4 className="font-extrabold text-slate-900 text-base md:text-lg mb-2">
                  {isZh
                    ? '🚀 雙軌流量引擎（Shorts + WP-SEO）雙重灌入機制'
                    : '🚀 Dual-Track Traffic Engine (Shorts + WP-SEO)'}
                </h4>
                {isZh ? (
                  <div className="text-sm text-slate-600 space-y-1.5">
                    <p>
                      • <strong className="text-slate-800">軌道一（AI 短影音矩陣）</strong>：快速抓住演算法紅利，瞬間拉高曝光與觸及，在極短時間內將泛流量導入目標頻道。
                    </p>
                    <p>
                      • <strong className="text-slate-800">軌道二（WordPress 自動化 SEO 站群）</strong>：透過 AI 自動產出多語系高品質內容，卡位 Google 等搜尋引擎關鍵字，帶來源源不絕的被動長尾流量。
                    </p>
                    <div className="mt-2.5 bg-blue-50 border border-dashed border-blue-300 rounded-lg p-3 text-blue-900 text-xs md:text-sm">
                      💡 <strong>白話解析：</strong>短影音是「短跑衝刺」（瞬間吸客），WP-SEO 是「馬拉松長跑」（天天有被動流量），兩者合力把精準買家像開水龍頭一樣灌入您的導購頁面！
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-slate-600 space-y-1.5">
                    <p>
                      • <strong className="text-slate-800">Track 1 (AI Shorts Matrix):</strong> Captures immediate algorithmic surges to funnel massive broad traffic to your channel.
                    </p>
                    <p>
                      • <strong className="text-slate-800">Track 2 (WordPress Automated SEO Sites):</strong> AI generates multilingual high-value articles ranking on Google, delivering relentless passive long-tail leads.
                    </p>
                    <div className="mt-2.5 bg-blue-50 border border-dashed border-blue-300 rounded-lg p-3 text-blue-900 text-xs md:text-sm">
                      💡 <strong>In Plain English:</strong> Shorts is your sprint (instant eyeballs), WP-SEO is your marathon (evergreen search traffic). Together, they turn your traffic faucet on full blast.
                    </div>
                  </div>
                )}
              </div>

              {/* 技術 2 */}
              <div className="bg-slate-50 border border-slate-200 border-l-4 border-l-[#0284c7] rounded-xl p-5">
                <h4 className="font-extrabold text-slate-900 text-base md:text-lg mb-2">
                  {isZh
                    ? '🛡️ 外部協流技術：徹底破解 YouTube 限流，加速通過 YPP 獲利門檻'
                    : '🛡️ External Traffic Coordination: Bypass Algorithmic Limits & Fast-Track YPP'}
                </h4>
                {isZh ? (
                  <div className="text-sm text-slate-600 space-y-1.5">
                    <p>
                      • <strong className="text-slate-800">痛點破解</strong>：傳統創作者常因頻道權重不足、受眾標籤混亂，被演算法直接打入冷宮限流。
                    </p>
                    <p>
                      • <strong className="text-slate-800">協流技術突破</strong>：系統透過外部高權重 SEO 與多平台短影音雙向「協流」，將外部真實搜尋意圖與活躍流量精準注入頻道，重新喚醒演算法信任，以穩定數據迅速跨過 YPP 門檻，提早啟動官方廣告分潤！
                    </p>
                  </div>
                ) : (
                  <div className="text-sm text-slate-600 space-y-1.5">
                    <p>
                      • <strong className="text-slate-800">The Problem:</strong> Low channel authority and muddled audience tags trap creators in algorithmic view suppression.
                    </p>
                    <p>
                      • <strong className="text-slate-800">The Fix:</strong> We inject high-authority SEO search intent and multi-platform views back into YouTube. This resets algorithmic trust, rapidly accumulating watch hours to smash YPP thresholds fast.
                    </p>
                  </div>
                )}
              </div>

              {/* 技術 3 */}
              <div className="bg-slate-50 border border-slate-200 border-l-4 border-l-[#0284c7] rounded-xl p-5">
                <h4 className="font-extrabold text-slate-900 text-base md:text-lg mb-2">
                  {isZh
                    ? '⚡ 獨家首創「YT 影分身流」：單一內容 1變多裂變導購技術'
                    : '⚡ Proprietary "YT Shadow Clone Flow": 1-to-Many Shoppable Multiplication'}
                </h4>
                {isZh ? (
                  <div className="text-sm text-slate-600 space-y-1.5">
                    <p>
                      • <strong className="text-slate-800">裂變技術</strong>：利用自動化機制將單一核心內容裂變為多視角、多切角的影分身節點，全面覆蓋不同受眾的搜尋路徑。
                    </p>
                    <p>
                      • <strong className="text-slate-800">多重變現閉環</strong>：突破單一廣告分潤，直接在影分身中無縫嵌入：1. <strong>影片導購（E-commerce）</strong>、2. <strong>官網/購物車引流</strong>、3. <strong>聯盟行銷（Affiliate Links）</strong>。
                    </p>
                    <div className="mt-2.5 bg-blue-50 border border-dashed border-blue-300 rounded-lg p-3 text-blue-900 text-xs md:text-sm">
                      💡 <strong>白話解析：</strong>就像鳴人的影分身術，派出幾十個分身同時幫您在網路上各角落發傳單、展示商品並導流到收銀機，24 小時多管道自動導購！
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-slate-600 space-y-1.5">
                    <p>
                      • <strong className="text-slate-800">Multiplying Reach:</strong> Transforms 1 piece of core content into multi-angle shadow clone nodes covering countless search pathways.
                    </p>
                    <p>
                      • <strong className="text-slate-800">Monetization Loop:</strong> Breaks free from ad pennies by integrating: 1. Video Shoppable Links, 2. Storefront Direct Funnels, 3. High-Ticket Affiliate URLs.
                    </p>
                    <div className="mt-2.5 bg-blue-50 border border-dashed border-blue-300 rounded-lg p-3 text-blue-900 text-xs md:text-sm">
                      💡 <strong>In Plain English:</strong> Like Naruto&apos;s Shadow Clone jutsu—dozens of automated clones distribute flyers and drive checkout clicks 24/7 across every corner of the web!
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 對比方塊 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-50 border border-red-200 border-l-4 border-l-red-500 rounded-r-xl p-5">
                <span className="font-extrabold text-red-700 text-sm md:text-base block mb-2">
                  {isZh ? '❌ 傳統自建團隊困境' : '❌ In-House Bottlenecks'}
                </span>
                <ul className="list-disc pl-5 text-xs md:text-sm text-slate-700 space-y-1">
                  {isZh ? (
                    <>
                      <li>
                        <strong>剪輯成本高昂：</strong>聘請剪輯師或逐字調字幕找素材，耗盡預算與精力。
                      </li>
                      <li>
                        <strong>冷宮限流：</strong>頻道缺乏權重，發布幾十支短影音播放量依舊個位數。
                      </li>
                      <li>
                        <strong>無法直接帶貨：</strong>觀眾看完影片不知去哪買，白白流失黃金購買衝動。
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <strong>High Editing Overhead:</strong> Endless hours and budget lost to manual cutting.
                      </li>
                      <li>
                        <strong>Zero Impressions:</strong> Unranked channels suffer zero-view shadowbans.
                      </li>
                      <li>
                        <strong>Broken Conversion:</strong> Viewers watch but have no direct clickable path to buy.
                      </li>
                    </>
                  )}
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 border-l-4 border-l-green-600 rounded-r-xl p-5">
                <span className="font-extrabold text-green-800 text-sm md:text-base block mb-2">
                  {isZh ? '✅ 總工程師客製化建置方案' : '✅ Our Custom Engineered Solution'}
                </span>
                <ul className="list-disc pl-5 text-xs md:text-sm text-green-900 space-y-1">
                  {isZh ? (
                    <>
                      <li>
                        <strong>專人代建置與調校：</strong>依您的商品特性量身配置 AI 導購與自動化管線。
                      </li>
                      <li>
                        <strong>雙軌破限流：</strong>Shorts 爆發力 + WP-SEO 長尾流量，快速匯聚精準買家。
                      </li>
                      <li>
                        <strong>影分身秒級導購：</strong>影片畫面直接點選商品跳轉官網結帳，轉化率倍增！
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <strong>Turn-Key Custom Setup:</strong> Tailored to your exact product catalog and URLs.
                      </li>
                      <li>
                        <strong>Dual-Track Flow:</strong> Shorts velocity + SEO endurance to beat shadowbans.
                      </li>
                      <li>
                        <strong>Direct Shoppable Loops:</strong> Viewers click products inside the video to checkout!
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* 3. 核心技術優勢雙卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 border-t-4 border-t-[#0284c7] shadow-sm">
              <h3 className="text-lg font-extrabold text-slate-900 mb-2">
                {isZh ? '🚀 官方 API 深度客製串接' : '🚀 Official YouTube API v3 Integration'}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {isZh
                  ? '完整提供官方 YouTube Data API v3 專案串接，支援自動化影片上傳、精確配置自訂標題、多語標籤與商品導購錨點設定，解放您的行銷人力。'
                  : 'Fully certified YouTube Data API v3 integration enabling hands-off automatic uploads, multilingual metadata, and high-converting shoppable product hooks.'}
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 border-t-4 border-t-[#0284c7] shadow-sm">
              <h3 className="text-lg font-extrabold text-slate-900 mb-2">
                {isZh ? '🎁 專案贈送 13 個月 AI 自來客系統' : '🎁 Bonus 13-Month AI Autopilot Service'}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {isZh
                  ? '凡委託客製化導入方案，即享高達 13 個月（一年期加贈 1 個月）「AI-自來客系統服務」，全天候自動化排程發佈，持續放大您的自然搜尋長尾流量。'
                  : 'Every custom implementation plan includes 13 full months of our AI Autopilot System service, keeping your brand active and pumping in consistent organic leads.'}
              </p>
            </div>
          </div>

          {/* 4. 客製化導入方案與預算參考 */}
          <div id="shoppable-custom-plans" className="scroll-mt-24">
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 text-center mb-2">
              {isZh ? '客製化導入方案與預算參考' : 'Custom Implementation Tiers & Budget Guide'}
            </h3>
            <p className="text-xs md:text-sm text-slate-500 text-center mb-6">
              {isZh
                ? '※ 本服務採「專人一對一需求評估與客製建置」，請依您欲上線的導購商品數量選擇適合規模並聯繫總工程師接洽：'
                : '※ All plans are custom-configured for your brand. Select a tier below to schedule a direct consultation with our Chief Architect:'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 啟動方案 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between text-center hover:-translate-y-1 transition-all">
                <div>
                  <h4 className="text-lg font-extrabold text-slate-900">
                    {isZh ? '啟動客製方案' : 'Startup Custom Plan'}
                  </h4>
                  <div className="text-2xl font-black text-slate-900 my-3">
                    {isZh ? '$8,880 TWD' : '$300 USD'}
                    <div className="text-xs font-normal text-slate-500 mt-0.5">
                      {isZh ? '(約 $300 USD)' : '($8,880 TWD)'}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold mb-3">
                    {isZh ? '首次含系統建置費 $2,880 ($96) + 1件導購商品' : 'Includes $96 Setup + 1 Shoppable Product'}
                  </p>
                  <p className="text-xs text-slate-600">
                    {isZh ? (
                      <>
                        後續擴充單件：<br />
                        <strong>$6,000 TWD ($198 USD)</strong> / 件
                      </>
                    ) : (
                      <>
                        Additional items:<br />
                        <strong>$198 USD ($6,000 TWD)</strong> / item
                      </>
                    )}
                  </p>
                </div>
                <a
                  href="#shoppable-contact-hub"
                  className="mt-4 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-[#0284c7] text-white text-xs font-bold transition-colors block"
                >
                  {isZh ? '💬 接洽此方案' : '💬 Inquire Startup Plan'}
                </a>
              </div>

              {/* 超值方案 */}
              <div className="bg-white p-6 rounded-2xl border-2 border-[#0284c7] shadow-md flex flex-col justify-between text-center relative hover:-translate-y-1 transition-all">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0284c7] text-white text-[11px] font-bold px-3 py-0.5 rounded-full whitespace-nowrap">
                  {isZh ? '★ 免收建置費' : '★ Free Setup'}
                </span>
                <div>
                  <h4 className="text-lg font-extrabold text-slate-900">
                    {isZh ? '超值客製方案 (6件)' : 'Value Plan (6 Items)'}
                  </h4>
                  <div className="text-2xl font-black text-slate-900 my-3">
                    {isZh ? '$30,000 TWD' : '$990 USD'}
                    <div className="text-xs font-normal text-slate-500 mt-0.5">
                      {isZh ? '(約 $990 USD)' : '($30,000 TWD)'}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold mb-3">
                    {isZh ? '平均單件僅：$5,000 TWD ($168 USD)' : 'Only $168 USD ($5,000 TWD) / item'}
                  </p>
                  <p className="text-xs font-bold text-[#0284c7]">
                    {isZh ? '★ 滿額免收 $96 (2,880元) 建置費' : '★ $96 Setup Fee Fully Waived'}
                  </p>
                </div>
                <a
                  href="#shoppable-contact-hub"
                  className="mt-4 w-full py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold transition-colors block"
                >
                  {isZh ? '🔥 預約超值方案評估' : '🔥 Inquire Value Plan'}
                </a>
              </div>

              {/* 專業方案 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between text-center hover:-translate-y-1 transition-all">
                <div>
                  <h4 className="text-lg font-extrabold text-slate-900">
                    {isZh ? '專業客製方案 (20件)' : 'Pro Plan (20 Items)'}
                  </h4>
                  <div className="text-2xl font-black text-slate-900 my-3">
                    {isZh ? '$90,000 TWD' : '$2,880 USD'}
                    <div className="text-xs font-normal text-slate-500 mt-0.5">
                      {isZh ? '(約 $2,880 USD)' : '($90,000 TWD)'}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold mb-3">
                    {isZh ? '單件大幅降至：$4,500 TWD ($150 USD)' : 'Reduced to $150 USD ($4,500 TWD) / item'}
                  </p>
                  <p className="text-xs font-bold text-[#0284c7]">
                    {isZh ? '★ 滿額免收 $96 (2,880元) 建置費' : '★ $96 Setup Fee Fully Waived'}
                  </p>
                </div>
                <a
                  href="#shoppable-contact-hub"
                  className="mt-4 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-[#0284c7] text-white text-xs font-bold transition-colors block"
                >
                  {isZh ? '💬 接洽專業方案' : '💬 Inquire Pro Plan'}
                </a>
              </div>

              {/* 企業買斷 */}
              <div className="bg-white p-6 rounded-2xl border-2 border-amber-500 shadow-sm flex flex-col justify-between text-center hover:-translate-y-1 transition-all">
                <div>
                  <h4 className="text-lg font-extrabold text-amber-600">
                    {isZh ? '企業旗艦專案 (100件)' : 'Enterprise (100 Items)'}
                  </h4>
                  <div className="text-2xl font-black text-slate-900 my-3">
                    {isZh ? '$300,000 TWD' : '$9,900 USD'}
                    <div className="text-xs font-normal text-slate-500 mt-0.5">
                      {isZh ? '(約 $9,900 USD)' : '($300,000 TWD)'}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold mb-3">
                    {isZh ? '成本極致價：每件 $3,000 TWD ($99 USD)' : 'Ultimate Cost: $99 USD ($3,000 TWD) / item'}
                  </p>
                  <p className="text-xs font-bold text-[#0284c7]">
                    {isZh ? '★ 滿額免收 $96 (2,880元) 建置費' : '★ $96 Setup Fee Fully Waived'}
                  </p>
                </div>
                <a
                  href="#shoppable-contact-hub"
                  className="mt-4 w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors block"
                >
                  {isZh ? '👑 預約企業專案接洽' : '👑 Inquire Enterprise'}
                </a>
              </div>
            </div>
          </div>

          {/* 5. 彈性升級與合約權益保障 */}
          <div className="bg-blue-50 border border-blue-200 border-l-4 border-l-[#0284c7] rounded-r-xl p-6 text-sm text-slate-700">
            <h4 className="font-extrabold text-slate-900 text-base mb-2">
              {isZh ? '📜 客製化彈性升級與合約權益保障' : '📜 Flexible Upgrades & Service Guarantees'}
            </h4>
            <ul className="list-disc pl-5 space-y-1.5">
              {isZh ? (
                <>
                  <li>
                    <strong>一個月彈性調整：</strong>系統上線 1 個月內可隨時更換或擴充「上線導購商品數」，僅需補足差額即可無痛升級。
                  </li>
                  <li>
                    <strong>客製頻率升級：</strong>可依您的行業特性與業務需求，量身商議升級「AI 自來客系統」的每日排程發布頻率。
                  </li>
                  <li>
                    <strong>超值 13 個月上線期：</strong>合約基本期為一年，我們主動延長贈送 1 個月系統調校與運行期，<strong>實際可上線運作時間長達 13 個月</strong>！
                  </li>
                  <li>
                    <strong>建置費減免規則：</strong>一般首次設置費為 2,880 元 ($96 美元)。凡單次委託達 3 萬元 ($990 美元) 以上方案即享有「免收建置費」優惠。
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <strong>1-Month Flexibility:</strong> Adjust or expand your active product slots within the first month by simply paying the tier difference.
                  </li>
                  <li>
                    <strong>Custom Posting Cadence:</strong> Upgrade your AI Autopilot System publishing frequency through tailored consultation.
                  </li>
                  <li>
                    <strong>Extended 13-Month Term:</strong> Although nominally a 1-year contract, you receive <strong>13 full months of live operational uptime</strong>.
                  </li>
                  <li>
                    <strong>Setup Fee Policy:</strong> Standard setup is $96 USD ($2,880 TWD). Custom plans at or above $990 USD ($30,000 TWD) <strong>fully waive this setup fee</strong>.
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* 6. 🤝 專屬客製化接洽聯絡中心 (電郵 + Line + 微信) */}
          <div
            id="shoppable-contact-hub"
            className="rounded-2xl p-6 md:p-8 text-center text-white border-2 border-[#38bdf8] shadow-xl scroll-mt-24"
            style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
          >
            <h3 className="text-xl md:text-2xl font-black text-white mb-2">
              {isZh
                ? '🤝 立即接洽總工程師 SEN・預約客製化評估'
                : '🤝 Contact Chief Architect SEN for Custom Setup'}
            </h3>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl mx-auto mb-6 leading-relaxed">
              {isZh
                ? '無需自行摸索複雜設定！請透過下方任一管道聯繫總工程師，提供您的「品牌/商城網址」與「預計上線商品數量」，我們將為您提供一對一架構規劃與導入排程：'
                : 'Skip the technical guesswork! Reach out directly via Email, Line, or WeChat with your store URL and target product count for a 1-on-1 implementation plan:'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {/* 電郵 Email */}
              <div className="bg-white/5 border border-white/15 hover:border-[#38bdf8] rounded-xl p-5 flex flex-col justify-between items-center transition-all">
                <div>
                  <div className="text-3xl mb-2">📧</div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider">
                    {isZh ? '商務與技術諮詢信箱' : 'Business & CTO Email'}
                  </div>
                  <div className="text-sm md:text-base font-extrabold text-[#38bdf8] my-2 break-all">
                    xyz007tw@gmail.com
                  </div>
                </div>
                <a
                  href="mailto:xyz007tw@gmail.com?subject=%E3%80%90%E5%AE%A2%E8%A3%BD%E5%8C%96%E6%9C%8D%E5%8B%99%E6%B4%BD%E8%A9%A2%E3%80%91AI%E5%BD%B1%E7%89%87%E5%B0%8E%E8%B3%BC%E7%B3%BB%E7%B5%B1%E8%88%87%E9%9B%99%E8%BB%8C%E6%B5%81%E9%87%8F%E5%B0%88%E6%A1%88"
                  className="mt-2 w-full py-2.5 px-4 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-extrabold transition-colors"
                >
                  {isZh ? '✉️ 一鍵發送接洽電郵' : '✉️ Send Inquiry Email'}
                </a>
              </div>

              {/* LINE */}
              <div className="bg-white/5 border border-white/15 hover:border-[#38bdf8] rounded-xl p-5 flex flex-col justify-between items-center transition-all">
                <div>
                  <div className="text-3xl mb-2">💚</div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider">
                    {isZh ? 'LINE 官方專人接洽 ID' : 'Official LINE ID'}
                  </div>
                  <div className="text-base font-extrabold text-[#38bdf8] my-2">xyz007tw</div>
                </div>
                <a
                  href="https://line.me/ti/p/~xyz007tw"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleCopyId('xyz007tw', 'LINE')}
                  className="mt-2 w-full py-2.5 px-4 rounded-lg bg-[#06c755] hover:bg-[#05a847] text-white text-xs font-extrabold transition-colors"
                >
                  {isZh ? '📲 點擊加 LINE 好友洽詢' : '📲 Add on LINE (xyz007tw)'}
                </a>
              </div>

              {/* WeChat */}
              <div className="bg-white/5 border border-white/15 hover:border-[#38bdf8] rounded-xl p-5 flex flex-col justify-between items-center transition-all">
                <div>
                  <div className="text-3xl mb-2">💬</div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider">
                    {isZh ? '微信 (WeChat) 專人接洽 ID' : 'WeChat Official ID'}
                  </div>
                  <div className="text-base font-extrabold text-[#38bdf8] my-2">xyz007tw</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyId('xyz007tw', 'WeChat / 微信')}
                  className="mt-2 w-full py-2.5 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold cursor-pointer transition-colors"
                >
                  {isZh ? '📋 一鍵複製微信 ID 加好友' : '📋 Copy WeChat ID: xyz007tw'}
                </button>
              </div>
            </div>

            {copyToast && (
              <div className="mt-4 inline-block px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-bold">
                {copyToast}
              </div>
            )}
          </div>

          {/* 免責聲明 */}
          <div className="text-center text-xs text-slate-400 border-t border-slate-200 pt-4">
            {isZh
              ? '【客製化技術服務聲明】本專案專注提供「獨家 YT 影分身工作流」、「AI 影片導購錨點」及雙軌流量架構之客製化系統工程建置服務。工具旨在協助企業與品牌達成全自動化運營與官方 API 對接，本團隊不干預亦不負擔客戶終端商品實際銷售之盈虧責任。'
              : '【Technical Service Disclaimer】This custom service exclusively covers system architecture implementation for the proprietary "YT Shadow Clone Workflow" and automated shoppable video hooks. We do not assume liability for external retail profit or loss resulting from client operations.'}
          </div>
        </div>
      </div>
    </section>
  );
}
