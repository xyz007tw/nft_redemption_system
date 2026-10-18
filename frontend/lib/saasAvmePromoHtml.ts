export const SAAS_AVME_PROMO_HTML_ZH = `<!-- === 第 2 套教材：SaaS-AVME 3.0 雙引擎 AI 短影音自動化大師手冊 ($99 方案・25%分潤制度・USDT與信用卡雙軌結帳) === -->
<div id="saas-avme-wrapper" class="landing-root text-left font-sans" style="background-color: #030712 !important; background-image: radial-gradient(circle at 50% 0%, #1e1b4b 0%, #030712 80%) !important; color: #f8fafc !important; border-radius: 20px; padding: 24px 16px; margin: 0 auto; max-width: 960px; line-height: 1.65; border: 1px solid rgba(250, 204, 21, 0.35); overflow: hidden; position: relative;">

    <style>
        #saas-avme-wrapper * { box-sizing: border-box; }
        #saas-avme-wrapper p,
        #saas-avme-wrapper span,
        #saas-avme-wrapper li,
        #saas-avme-wrapper div {
            color: #f1f5f9;
        }
        #saas-avme-wrapper h1, 
        #saas-avme-wrapper h2, 
        #saas-avme-wrapper h3, 
        #saas-avme-wrapper h4 {
            color: #ffffff !important;
            text-shadow: 0 2px 14px rgba(0, 0, 0, 0.9) !important;
        }
        #saas-avme-wrapper .text-gold {
            color: #facc15 !important;
            text-shadow: 0 0 25px rgba(250, 204, 21, 0.5) !important;
        }
        #saas-avme-wrapper .glass-card {
            background: rgba(17, 24, 39, 0.9) !important;
            backdrop-filter: blur(12px) !important;
            -webkit-backdrop-filter: blur(12px) !important;
            border: 1px solid rgba(255, 255, 255, 0.15) !important;
            border-radius: 1.5rem;
            transition: transform 0.25s ease, border-color 0.25s ease;
        }
        #saas-avme-wrapper .glass-card:hover {
            transform: translateY(-4px);
            border-color: rgba(99, 102, 241, 0.7) !important;
        }
        #saas-avme-wrapper .glass-card p,
        #saas-avme-wrapper .glass-card li,
        #saas-avme-wrapper .glass-card span {
            color: #e2e8f0 !important;
        }
        #saas-avme-wrapper .glass-card strong {
            color: #ffffff !important;
        }
        #saas-avme-wrapper .shorts-container {
            position: relative;
            width: 100%;
            max-width: 340px;
            margin: 0 auto;
            aspect-ratio: 9 / 16;
            border-radius: 1.5rem;
            overflow: hidden;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(250, 204, 21, 0.2);
            border: 2px solid rgba(250, 204, 21, 0.4);
            background: #000 !important;
        }
        #saas-avme-wrapper .shorts-container::after {
            display: block;
            content: "";
            padding-top: 177.77%;
        }
        #saas-avme-wrapper .shorts-container iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: none;
        }
        #saas-avme-wrapper .avme-lang-bar {
            background: rgba(15, 23, 42, 0.95);
            border: 1.5px solid rgba(250, 204, 21, 0.6);
            border-radius: 9999px;
            padding: 0.3rem 0.75rem;
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
        }
        #saas-avme-wrapper .avme-lang-btn {
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 0.75rem;
            font-weight: 800;
            color: #94a3b8;
            background: transparent;
            border: none;
            padding: 4px 10px;
            border-radius: 20px;
        }
        #saas-avme-wrapper .avme-lang-btn.active {
            color: #030712 !important;
            background: #facc15 !important;
        }
        @keyframes avme-pulse-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(245, 158, 11, 0.4); }
            50% { box-shadow: 0 0 40px rgba(245, 158, 11, 0.75); }
        }
        #saas-avme-wrapper .highlight-banner {
            animation: avme-pulse-glow 2.5s ease-in-out infinite;
            border: 2px solid #facc15 !important;
        }
        #saas-avme-wrapper .notes-card-box {
            background: #111827 !important;
            border: 1.5px solid rgba(99, 102, 241, 0.5) !important;
        }
        #saas-avme-wrapper .notes-card-box li,
        #saas-avme-wrapper .notes-card-box span {
            color: #f1f5f9 !important;
        }
        #saas-avme-wrapper .checkout-cta-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background: linear-gradient(135deg, #facc15 0%, #f59e0b 100%);
            color: #030712 !important;
            font-weight: 900;
            font-size: 14px;
            padding: 12px 24px;
            border-radius: 12px;
            text-decoration: none !important;
            box-shadow: 0 0 25px rgba(250, 204, 21, 0.4);
            transition: all 0.2s ease;
            cursor: pointer;
        }
        #saas-avme-wrapper .checkout-cta-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 0 35px rgba(250, 204, 21, 0.65);
        }
        /* 微享 AI 技術作品集自動輪播 CSS */
        #saas-avme-wrapper .portfolio-carousel-wrapper {
            position: relative;
            width: 100%;
            overflow: hidden;
            border-radius: 1.5rem;
            background: rgba(10, 15, 30, 0.85);
            border: 1px solid rgba(99, 102, 241, 0.3);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6);
            padding: 24px 16px;
        }
        #saas-avme-wrapper .portfolio-carousel-track {
            display: flex;
            transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
            gap: 16px;
        }
        #saas-avme-wrapper .portfolio-card {
            flex: 0 0 calc(33.333% - 11px);
            min-width: 240px;
            background: rgba(17, 24, 39, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 1.2rem;
            padding: 20px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            transition: transform 0.3s ease, border-color 0.3s ease;
        }
        #saas-avme-wrapper .portfolio-card:hover {
            transform: translateY(-5px);
            border-color: #facc15;
        }
        #saas-avme-wrapper .portfolio-thumb {
            width: 100%;
            height: 100px;
            border-radius: 0.8rem;
            background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
            margin-bottom: 14px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        #saas-avme-wrapper .portfolio-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            width: 100%;
            background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%);
            color: #ffffff !important;
            padding: 9px 16px;
            border-radius: 0.75rem;
            font-weight: 700;
            font-size: 0.82rem;
            text-decoration: none !important;
            margin-top: 14px;
            transition: opacity 0.2s ease, filter 0.2s ease;
        }
        #saas-avme-wrapper .portfolio-btn:hover {
            opacity: 0.92;
            filter: brightness(1.15);
        }
        #saas-avme-wrapper .carousel-arrow-btn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 38px;
            height: 38px;
            border-radius: 50%;
            background: rgba(15, 23, 42, 0.92);
            border: 1px solid #facc15;
            color: #facc15 !important;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 20;
            transition: all 0.2s ease;
        }
        #saas-avme-wrapper .carousel-arrow-btn:hover {
            background: #facc15;
            color: #0f172a !important;
        }
        #saas-avme-wrapper .carousel-arrow-btn.prev { left: 10px; }
        #saas-avme-wrapper .carousel-arrow-btn.next { right: 10px; }
        @media (max-width: 900px) {
            #saas-avme-wrapper .portfolio-card { flex: 0 0 calc(50% - 8px); }
        }
        @media (max-width: 600px) {
            #saas-avme-wrapper .portfolio-card { flex: 0 0 100%; min-width: 100%; }
        }
    </style>

    <!-- 頂部品牌條與語言切換膠囊 -->
    <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; padding-bottom: 16px; margin-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,0.1);">
        <div style="font-weight: 900; font-size: 20px; letter-spacing: -0.02em; color: #ffffff;">
            SaaS-AVME 3.0 <span style="color: #facc15; font-style: italic; font-family: monospace; font-size: 13px; margin-left: 6px;">DUAL-ENGINE STACK</span>
        </div>
        <div class="avme-lang-bar">
            <span style="color: #facc15; font-size: 12px;">🌐</span>
            <button type="button" id="avme-lang-zh" class="avme-lang-btn active">繁中</button>
            <span style="color: #64748b; font-size: 12px;">|</span>
            <button type="button" id="avme-lang-en" class="avme-lang-btn">EN</button>
        </div>
    </div>

    <!-- Hero 主視覺：20年總架構師核心命題 -->
    <div class="text-center mb-12 px-2">
        <div class="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-yellow-400/10 border border-yellow-400/30 font-bold text-xs md:text-sm tracking-widest uppercase mb-6" style="color: #facc15 !important;">
            <span>🛡️</span>
            <span data-avme="badge_tag" style="color: #facc15 !important;">20 年系統架構總工程師的解題協議</span>
        </div>

        <h1 class="text-3xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
            <span data-avme="hero_h1">開口即成片！</span><br>
            <span class="text-gold" data-avme="hero_h2">用白話文指揮 AI，打造 24 小時全自動短影音生產線</span>
        </h1>

        <p class="text-base md:text-lg max-w-3xl mx-auto leading-relaxed mb-6" data-avme="hero_desc" style="color: #e2e8f0 !important;">
            傳統外包一支短影音要價數千元、反覆修改 7 天起跳；自己學剪輯又卡死在時間軸拖拉、字幕對齊與調色的技術泥淖。擁有 20 年架構經驗的系統團隊，將價值 $5,000 美元的無人值守雙引擎工作流封裝落地——小白免寫程式、免學剪輯，一句白話文指令，系統即刻自編、自導、自剪成片！
        </p>

        <div class="mb-4">
            <a href="#course-checkout-box" class="checkout-cta-btn">
                <span>👇</span>
                <span data-avme="hero_cta_hint" style="color: #030712 !important;">請於下方 STEP 1 選擇【信用卡/ATM 刷卡】或【Web3 USDT】即刻解鎖 $99 大師手冊</span>
            </a>
        </div>

        <div class="flex flex-wrap justify-center gap-4 text-xs mt-4">
            <span style="color: #cbd5e1 !important;">✔ <span data-avme="hero_b1">付款秒級發信下載 ＋ 支援電郵轉發</span></span>
            <span style="color: #cbd5e1 !important;">✔ <span data-avme="hero_b2">全額納入 25% 聯盟推廣分潤 (10%級差+10%對等+5%分紅)</span></span>
            <span style="color: #cbd5e1 !important;">✔ <span data-avme="hero_b3">選購教材系列滿 $198 加碼送 AI 尋客 365 天</span></span>
        </div>
    </div>

    <!-- 9:16 Shorts 視頻介紹展示 (中/英文動態對應) -->
    <div class="py-8 px-2 mb-10">
        <div class="max-w-4xl mx-auto text-center mb-6">
            <div class="inline-block px-5 py-1.5 bg-indigo-500/10 border border-indigo-400/30 rounded-full mb-3">
                <span class="text-indigo-400 text-xs font-bold uppercase tracking-widest" style="color: #818cf8 !important;">
                    ▶ Live Showcase
                </span>
            </div>
            <h2 class="text-2xl md:text-3xl font-black text-white mb-2" data-avme="video_title">
                雙引擎短影音實戰成果演示
            </h2>
            <p class="text-sm md:text-base max-w-xl mx-auto" data-avme="video_sub" style="color: #cbd5e1 !important;">
                真實呈現無人值守流水線：波形氣口精確切除 + React 網頁級渲染 + 毫秒級高留存字卡
            </p>
        </div>

        <div class="shorts-container">
            <iframe 
                id="avme-shorts-frame"
                src="https://www.youtube.com/embed/QDzkcIcJvYg" 
                title="SaaS-AVME 3.0 Video Showcase"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowfullscreen 
                loading="lazy">
            </iframe>
        </div>

        <div class="text-center mt-4">
            <p class="text-xs md:text-sm" style="color: #cbd5e1 !important;">
                ✨ <span data-avme="video_hint">60 秒感受自然語言瞬間編譯為爆款影音的震撼效果（隨語系自動切換中/英影片）</span>
            </p>
        </div>
    </div>

    <!-- 20 年工程師深入痛點解析 -->
    <div class="py-10 px-4 bg-slate-950/60 border-y border-white/10 rounded-2xl mb-12">
        <div class="text-center max-w-3xl mx-auto mb-10">
            <h2 class="text-2xl md:text-3xl font-black mb-3">
                <span data-avme="pain_heading_1">為什麼 90% 的自媒體新手，</span><br>
                <span class="text-gold" data-avme="pain_heading_2">最終都放棄在「剪輯地獄」裡？</span>
            </h2>
            <p class="text-sm md:text-base" data-avme="pain_sub" style="color: #cbd5e1 !important;">
                身為歷經 20 年從底層程式、分散式架構到大型整合的工程師，我看過太多創作者因為錯誤的工具鏈，被困在低效的體力勞動中：
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="glass-card p-6 border-t-4 !border-t-rose-500">
                <div class="text-2xl mb-3">⏳</div>
                <h3 class="text-lg font-bold text-white mb-2" data-avme="p1_title">痛點一：時間黑洞與低效切氣口</h3>
                <p class="text-sm leading-relaxed" data-avme="p1_desc" style="color: #e2e8f0 !important;">
                    錄音 10 分鐘，卻得花 2 小時逐格放大軌道聽呼吸贅音、切除卡頓。人工標籤費時費力，每天能產出的內容極限只有 1 支，根本追不上平台的流量演算法！
                </p>
                <div class="mt-4 pt-3 border-t border-white/10 text-xs font-semibold" style="color: #34d399 !important;">
                    ✔ <span data-avme="s1_title" style="color: #34d399 !important;">解法：antigranity 波形聲學分析，4% 靜音自動切除，單片處理僅 3 秒</span>
                </div>
            </div>

            <div class="glass-card p-6 border-t-4 !border-t-yellow-500">
                <div class="text-2xl mb-3">🧠</div>
                <h3 class="text-lg font-bold text-white mb-2" data-avme="p2_title">痛點二：腳本靈感枯竭與事實幻覺</h3>
                <p class="text-sm leading-relaxed" data-avme="p2_desc" style="color: #e2e8f0 !important;">
                    想轉發長文章或專業教材，一般聊天 AI 常常胡言亂語、生成充滿空話的廢稿；創作者自己熬夜手寫劇本，往往缺乏短影音前 3 秒吸引眼球的黃金 Hook。
                </p>
                <div class="mt-4 pt-3 border-t border-white/10 text-xs font-semibold" style="color: #34d399 !important;">
                    ✔ <span data-avme="s2_title" style="color: #34d399 !important;">解法：Google Notebook 知識接地技術，支援長影音摘要，生成零幻覺精華腳本</span>
                </div>
            </div>

            <div class="glass-card p-6 border-t-4 !border-t-indigo-500">
                <div class="text-2xl mb-3">💻</div>
                <h3 class="text-lg font-bold text-white mb-2" data-avme="p3_title">痛點三：傳統剪輯 GUI 無法規模化</h3>
                <p class="text-sm leading-relaxed" data-avme="p3_desc" style="color: #e2e8f0 !important;">
                    使用 Premiere、剪映等桌面軟體，每做一支影片就要反覆手動微調字卡位置、重新匯出，不僅電腦風扇狂轉、耗盡儲存空間，更完全無法實現無人值守自動化。
                </p>
                <div class="mt-4 pt-3 border-t border-white/10 text-xs font-semibold" style="color: #34d399 !important;">
                    ✔ <span data-avme="s3_title" style="color: #34d399 !important;">解法：Remotion 網頁級代碼渲染，多核心無頭平行輸出，邊際成本近乎為零</span>
                </div>
            </div>
        </div>
    </div>

    <!-- 雙引擎架構拆解：系統一 + 系統二 -->
    <div class="mb-12 px-2">
        <div class="text-center max-w-3xl mx-auto mb-10">
            <h2 class="text-2xl md:text-3xl font-black mb-2 text-white" data-avme="arch_heading">
                兩大全球頂尖 AI 系統：協同分工架構
            </h2>
            <p class="text-sm md:text-base" data-avme="arch_sub" style="color: #cbd5e1 !important;">
                左腦負責「知識研判與精確劇本」，右腦負責「聲學切除與視覺動態渲染」
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="glass-card p-6 md:p-8 border-t-4 !border-t-yellow-400">
                <div class="flex items-center justify-between mb-4">
                    <span class="text-xs font-mono font-black tracking-wider uppercase bg-yellow-400/10 border border-yellow-400/30 px-3 py-1 rounded-full" style="color: #facc15 !important;">SYSTEM 01 · 開源引擎</span>
                    <span class="text-2xl">⚡</span>
                </div>
                <h3 class="text-xl font-black text-white mb-3" data-avme="sys1_title">
                    antigranity + Remotion 程式化渲染矩陣
                </h3>
                <p class="text-sm mb-4 leading-relaxed" data-avme="sys1_desc" style="color: #f1f5f9 !important;">
                    完全免除桌面軟體點擊，透過代碼控制音視頻合流：
                </p>
                <ul class="space-y-3 text-sm" style="color: #f8fafc !important;">
                    <li class="flex items-start gap-2">
                        <span style="color: #facc15 !important;">▸</span>
                        <span data-avme="sys1_f1"><strong style="color: #ffffff !important;">antigranity 聲學波形分析：</strong> 自動切除低於 4% 峰值音量，前後保留 2 幀緩衝，語速緊湊自然。</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span style="color: #facc15 !important;">▸</span>
                        <span data-avme="sys1_f2"><strong style="color: #ffffff !important;">Remotion Headless 渲染：</strong> 以 React 組件定義電影感呼吸運鏡（Spring Zoom）與黃色關鍵字動態高亮。</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span style="color: #facc15 !important;">▸</span>
                        <span data-avme="sys1_f3"><strong style="color: #ffffff !important;">C2PA 數位安全憑證：</strong> 渲染後自動寫入元數據與半透明標籤，符合平台演算法規範。</span>
                    </li>
                </ul>
            </div>

            <div class="glass-card p-6 md:p-8 border-t-4 !border-t-indigo-500">
                <div class="flex items-center justify-between mb-4">
                    <span class="text-xs font-mono font-black tracking-wider uppercase bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 rounded-full" style="color: #818cf8 !important;">SYSTEM 02 · 導播大腦</span>
                    <span class="text-2xl">🤖</span>
                </div>
                <h3 class="text-xl font-black text-white mb-3" data-avme="sys2_title">
                    Google Notebook 知識接地與 AI 導播流水線
                </h3>
                <p class="text-sm mb-4 leading-relaxed" data-avme="sys2_desc" style="color: #f1f5f9 !important;">
                    以強大的知識整合技術為後盾，提供 100% 事實依據的劇本來源：
                </p>
                <ul class="space-y-3 text-sm" style="color: #f8fafc !important;">
                    <li class="flex items-start gap-2">
                        <span style="color: #818cf8 !important;">▸</span>
                        <span data-avme="sys2_f1"><strong style="color: #ffffff !important;">多源文件直接吞吐：</strong> 支援一鍵匯入 PDF 講義、DOCX、網頁文章及 YouTube 影片長片連結。</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span style="color: #818cf8 !important;">▸</span>
                        <span data-avme="sys2_f2"><strong style="color: #ffffff !important;">長影音摘要轉化：</strong> 自動擷取長影片精華字幕，提煉黃金 3 大觀點並標註毫秒級時間軸。</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span style="color: #818cf8 !important;">▸</span>
                        <span data-avme="sys2_f3"><strong style="color: #ffffff !important;">高留存短影音腳本：</strong> 內建標準 Hook -> Stakes -> Solution -> CTA 模板，導出結構化數據直供渲染。</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <!-- 自然語言控制演示矩陣 -->
    <div class="py-10 px-4 bg-slate-950/70 border border-white/10 rounded-2xl mb-12">
        <div class="text-center mb-8">
            <h2 class="text-2xl md:text-3xl font-black text-white mb-2" data-avme="prompt_heading">
                小白自然語言口語指令：如何直接變成影片？
            </h2>
            <p class="text-sm" data-avme="prompt_sub" style="color: #cbd5e1 !important;">
                背後負責轉譯的 AI Agent 隨時待命，不需要你敲一行程式碼
            </p>
        </div>

        <div class="space-y-4 max-w-4xl mx-auto">
            <div class="glass-card p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                    <span class="w-8 h-8 rounded-full bg-yellow-400/20 flex items-center justify-center font-bold text-xs flex-shrink-0" style="color: #facc15 !important;">NL</span>
                    <div>
                        <div class="text-white font-bold text-sm" data-avme="nl_1" style="color: #ffffff !important;">「幫我切掉影片中所有沒說話的停頓與空白處」</div>
                        <div class="text-xs font-mono mt-0.5" data-avme="nl_1_sub" style="color: #94a3b8 !important;">Auto-cutting dead air and pauses</div>
                    </div>
                </div>
                <div class="bg-black/70 border border-white/10 px-4 py-2 rounded-xl text-xs font-mono flex-shrink-0" style="color: #34d399 !important;">
                    → antigranity --silent_threshold 0.04
                </div>
            </div>

            <div class="glass-card p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                    <span class="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center font-bold text-xs flex-shrink-0" style="color: #818cf8 !important;">NL</span>
                    <div>
                        <div class="text-white font-bold text-sm" data-avme="nl_2" style="color: #ffffff !important;">「套用科技感藍色主題，關鍵字用黃色大字體高亮」</div>
                        <div class="text-xs font-mono mt-0.5" data-avme="nl_2_sub" style="color: #94a3b8 !important;">Applying spring zoom &amp; yellow text highlights</div>
                    </div>
                </div>
                <div class="bg-black/70 border border-white/10 px-4 py-2 rounded-xl text-xs font-mono flex-shrink-0" style="color: #34d399 !important;">
                    → remotion render --props='{"theme":"tech-blue"}'
                </div>
            </div>

            <div class="glass-card p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                    <span class="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center font-bold text-xs flex-shrink-0" style="color: #38bdf8 !important;">NL</span>
                    <div>
                        <div class="text-white font-bold text-sm" data-avme="nl_3" style="color: #ffffff !important;">「分析這支長影片與講義，整理成 30 秒爆款短影音腳本」</div>
                        <div class="text-xs font-mono mt-0.5" data-avme="nl_3_sub" style="color: #94a3b8 !important;">Grounded context synthesis &amp; viral scriptwriting</div>
                    </div>
                </div>
                <div class="bg-black/70 border border-white/10 px-4 py-2 rounded-xl text-xs font-mono flex-shrink-0" style="color: #34d399 !important;">
                    → Google Notebook Source Grounding Pipeline
                </div>
            </div>
        </div>
    </div>

    <!-- 微享 AI 技術作品集 (可自動輪動型展廳) -->
    <div class="mb-12 px-2">
        <div class="text-center max-w-3xl mx-auto mb-8">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/30 font-bold text-xs uppercase tracking-widest mb-3" style="color: #facc15 !important;">
                <span>🌟</span>
                <span data-avme="portfolio_tag" style="color: #facc15 !important;">PROVEN ECOSYSTEM &amp; TECH STACK</span>
            </div>
            <h2 class="text-2xl md:text-3xl font-black mb-2 text-white" data-avme="portfolio_heading">
                我們微享 AI 技術作品集
            </h2>
            <p class="text-sm md:text-base" data-avme="portfolio_sub" style="color: #cbd5e1 !important;">
                歷經實戰驗證的自動化變現工具、數位教材與生態產品矩陣（全自動輪動）
            </p>
        </div>

        <div class="portfolio-carousel-wrapper" id="avme-weishare-carousel">
            <button type="button" class="carousel-arrow-btn prev" id="avme-port-prev" aria-label="Previous">❮</button>
            <button type="button" class="carousel-arrow-btn next" id="avme-port-next" aria-label="Next">❯</button>

            <div class="portfolio-carousel-track" id="avme-portfolio-track">
                <!-- 作品 1 -->
                <div class="portfolio-card">
                    <div class="portfolio-thumb">🤖</div>
                    <div>
                        <div class="text-xs font-mono font-bold uppercase mb-1" style="color: #facc15 !important;">AUTOMATED PROSPECTING</div>
                        <h4 class="text-base font-bold text-white mb-1.5" data-avme="port_1_title">WAIA 全自動化營銷系統</h4>
                        <p class="text-xs leading-relaxed" data-avme="port_1_desc" style="color: #cbd5e1 !important;">
                            專屬 AI 導客與全天候社交私域流量轉化系統，解放人力的流量攔截神器。
                        </p>
                    </div>
                    <a href="https://aitutor.vip/waia" target="_blank" rel="noopener noreferrer" class="portfolio-btn">
                        <span data-avme="port_btn">參觀作品專頁</span> <span>↗</span>
                    </a>
                </div>

                <!-- 作品 2 -->
                <div class="portfolio-card">
                    <div class="portfolio-thumb">💎</div>
                    <div>
                        <div class="text-xs font-mono font-bold uppercase mb-1" style="color: #facc15 !important;">ENTERPRISE SYSTEM</div>
                        <h4 class="text-base font-bold text-white mb-1.5" data-avme="port_2_title">AI 變現高階旗艦模組 $288</h4>
                        <p class="text-xs leading-relaxed" data-avme="port_2_desc" style="color: #cbd5e1 !important;">
                            整合多模態代碼、自動化發布與企業級商業變現的高階落地架構包。
                        </p>
                    </div>
                    <a href="https://zylvie.com/1314520/p/288" target="_blank" rel="noopener noreferrer" class="portfolio-btn">
                        <span data-avme="port_btn">參觀作品專頁</span> <span>↗</span>
                    </a>
                </div>

                <!-- 作品 3 -->
                <div class="portfolio-card">
                    <div class="portfolio-thumb">⚡</div>
                    <div>
                        <div class="text-xs font-mono font-bold uppercase mb-1" style="color: #facc15 !important;">STARTER BLUEPRINT</div>
                        <h4 class="text-base font-bold text-white mb-1.5" data-avme="port_3_title">AI 入門實踐核心指南 $99</h4>
                        <p class="text-xs leading-relaxed" data-avme="port_3_desc" style="color: #cbd5e1 !important;">
                            低門檻、極速上手的 AI 影音生產線，小白自媒體創作最佳起步選擇。
                        </p>
                    </div>
                    <a href="https://zylvie.com/1314520/p/99" target="_blank" rel="noopener noreferrer" class="portfolio-btn">
                        <span data-avme="port_btn">參觀作品專頁</span> <span>↗</span>
                    </a>
                </div>

                <!-- 作品 4 -->
                <div class="portfolio-card">
                    <div class="portfolio-thumb">🚀</div>
                    <div>
                        <div class="text-xs font-mono font-bold uppercase mb-1" style="color: #facc15 !important;">MONETIZATION PACK</div>
                        <h4 class="text-base font-bold text-white mb-1.5" data-avme="port_4_title">AI 增長變現收益套餐 $198</h4>
                        <p class="text-xs leading-relaxed" data-avme="port_4_desc" style="color: #cbd5e1 !important;">
                            涵蓋高轉化文案庫、自動化分銷模型與贈送 360 天尋客包的高 CP 組合。
                        </p>
                    </div>
                    <a href="https://zylvie.com/1314520/p/168" target="_blank" rel="noopener noreferrer" class="portfolio-btn">
                        <span data-avme="port_btn">參觀作品專頁</span> <span>↗</span>
                    </a>
                </div>

                <!-- 作品 5 -->
                <div class="portfolio-card">
                    <div class="portfolio-thumb">🤝</div>
                    <div>
                        <div class="text-xs font-mono font-bold uppercase mb-1" style="color: #facc15 !important;">CROWDFUNDING &amp; DONATE</div>
                        <h4 class="text-base font-bold text-white mb-1.5" data-avme="port_5_title">NFT1314 眾籌贊助生態中心</h4>
                        <p class="text-xs leading-relaxed" data-avme="port_5_desc" style="color: #cbd5e1 !important;">
                            社群共榮與眾籌贊助系統，支持優質創作者並解鎖更多優先內排特權。
                        </p>
                    </div>
                    <a href="https://nft1314.party/sponsor" target="_blank" rel="noopener noreferrer" class="portfolio-btn">
                        <span data-avme="port_btn">參觀作品專頁</span> <span>↗</span>
                    </a>
                </div>
            </div>
        </div>
    </div>

    <!-- 方案價值陳述 -->
    <div class="mb-12 px-2">
        <div class="max-w-3xl mx-auto">
            <div class="glass-card highlight-banner p-6 md:p-10 text-center relative overflow-hidden">
                <div class="inline-block px-4 py-1.5 rounded-full bg-yellow-400 font-black text-xs uppercase tracking-widest mb-4" style="color: #030712 !important;">
                    Flagship Master Manual · 25% Affiliate Eligible
                </div>

                <h2 class="text-2xl md:text-3xl font-black text-white mb-2" data-avme="tier_title">
                    SaaS-AVME 3.0 全自動影音大師手冊
                </h2>
                <div class="text-3xl md:text-4xl font-black my-3" style="color: #facc15 !important;">
                    $99 <span class="text-base font-normal" style="color: #cbd5e1 !important;">USDT / 約 NT$ 3,000</span>
                </div>

                <p class="text-sm max-w-xl mx-auto mb-6 leading-relaxed" data-avme="tier_sub" style="color: #e2e8f0 !important;">
                    將價值超過 $5,000 美元的系統架構、代碼資產與導播模板完整封裝。從底層依賴庫安裝到多平台發布，全流程拆解無保留交付！
                </p>

                <div class="text-left space-y-3 max-w-lg mx-auto mb-6 text-sm" style="color: #f8fafc !important;">
                    <div class="flex items-start gap-2.5">
                        <span style="color: #facc15 !important;">✔</span>
                        <span data-avme="t_f1"><strong style="color: #ffffff !important;">雙系統完整操作與「如何取得」SOP：</strong> 從官方免費通道到本地開源庫部署。</span>
                    </div>
                    <div class="flex items-start gap-2.5">
                        <span style="color: #facc15 !important;">✔</span>
                        <span data-avme="t_f2"><strong style="color: #ffffff !important;">一鍵環境配置腳本：</strong> 隨書提供自動化安裝檔，雙擊即可配置本地運行庫。</span>
                    </div>
                    <div class="flex items-start gap-2.5">
                        <span style="color: #facc15 !important;">✔</span>
                        <span data-avme="t_f3"><strong style="color: #ffffff !important;">Google Notebook 爆款提示詞庫：</strong> 包含 3 秒 Hook 提煉法與影片摘要指令集。</span>
                    </div>
                    <div class="flex items-start gap-2.5">
                        <span style="color: #facc15 !important;">✔</span>
                        <span data-avme="t_f4"><strong style="color: #ffffff !important;">Remotion 1080p 網頁渲染模板源碼：</strong> 開箱即用的 React 動態字卡組件。</span>
                    </div>
                    <div class="flex items-start gap-2.5">
                        <span style="color: #facc15 !important;">✔</span>
                        <span data-avme="t_f5"><strong style="color: #ffffff !important;">納入 25% 聯盟推廣分潤制度：</strong> 享有 10% 無限代級差 ＋ 10% 對等匹配 ＋ 5% 全球領袖分紅！</span>
                    </div>
                </div>

                <a href="#course-checkout-box" class="checkout-cta-btn">
                    <span>👇</span>
                    <span data-avme="bottom_cta_hint" style="color: #030712 !important;">立即前往下方 STEP 1 選擇 USDT 或信用卡刷卡完成開通</span>
                </a>
            </div>
        </div>
    </div>

    <!-- 置底重要備註與輔導師資訊 -->
    <div class="px-2">
        <div class="notes-card-box p-6 md:p-8 rounded-2xl shadow-2xl">
            <h4 class="font-bold text-base md:text-lg mb-4 flex items-center gap-2" style="color: #facc15 !important;">
                <span>🏆</span>
                <span data-avme="notes_title" style="color: #facc15 !important;">專案重要備註與專屬權益</span>
            </h4>
            <ul class="space-y-3 text-sm md:text-base" style="color: #ffffff !important;">
                <li class="flex items-start gap-2.5">
                    <span class="font-bold flex-shrink-0" style="color: #facc15 !important;">★</span>
                    <span data-avme="note_1" style="color: #ffffff !important;"># 附 20 年系統架構總工程師的安裝 antigranity + remotion 不再踩坑輔導書</span>
                </li>
                <li class="flex items-start gap-2.5">
                    <span class="font-bold flex-shrink-0" style="color: #facc15 !important;">★</span>
                    <span data-avme="note_2" style="color: #ffffff !important;"># 選購 AI 教材系列累積達 $198 以上，再加碼送 AI 尋客 365 天（且全系列皆計入 25% 推廣分潤）</span>
                </li>
                <li class="flex items-start gap-2.5">
                    <span class="font-bold flex-shrink-0" style="color: #facc15 !important;">★</span>
                    <span data-avme="note_3" style="color: #ffffff !important;"># 唯一友善系統輔導師：<a href="mailto:xyz007tw@gmail.com" style="color: #38bdf8 !important; text-decoration: underline;">xyz007tw@gmail.com</a></span>
                </li>
            </ul>
        </div>
    </div>

</div>

<!-- 雙語切換與作品集自動輪動腳本 -->
<script>
(function() {
    const i18nConfig = {
        zh: {
            video_src: "https://www.youtube.com/embed/QDzkcIcJvYg",
            badge_tag: "20 年系統架構總工程師的解題協議",
            hero_h1: "開口即成片！",
            hero_h2: "用白話文指揮 AI，打造 24 小時全自動短影音生產線",
            hero_desc: "傳統外包一支短影音要價數千元、反覆修改 7 天起跳；自己學剪輯又卡死在時間軸拖拉、字幕對齊與調色的技術泥淖。擁有 20 年架構經驗的系統團隊，將價值 $5,000 美元的無人值守雙引擎工作流封裝落地——小白免寫程式、免學剪輯，一句白話文指令，系統即刻自編、自導、自剪成片！",
            hero_cta_hint: "請於下方 STEP 1 選擇【信用卡/ATM 刷卡】或【Web3 USDT】即刻解鎖 $99 大師手冊",
            hero_b1: "付款秒級發信下載 ＋ 支援電郵轉發",
            hero_b2: "全額納入 25% 聯盟推廣分潤 (10%級差+10%對等+5%分紅)",
            hero_b3: "選購教材系列滿 $198 加碼送 AI 尋客 365 天",
            video_title: "雙引擎短影音實戰成果演示",
            video_sub: "真實呈現無人值守流水線：波形氣口精確切除 + React 網頁級渲染 + 毫秒級高留存字卡",
            video_hint: "60 秒感受自然語言瞬間編譯為爆款影音的震撼效果（隨語系自動切換中/英影片）",
            pain_heading_1: "為什麼 90% 的自媒體新手，",
            pain_heading_2: "最終都放棄在「剪輯地獄」裡？",
            pain_sub: "身為歷經 20 年從底層程式、分散式架構到大型整合的工程師，我看過太多創作者因為錯誤的工具鏈，被困在低效的體力勞動中：",
            p1_title: "痛點一：時間黑洞與低效切氣口",
            p1_desc: "錄音 10 分鐘，卻得花 2 小時逐格放大軌道聽呼吸贅音、切除卡頓。人工標籤費時費力，每天能產出的內容極限只有 1 支，根本追不上平台的流量演算法！",
            s1_title: "解法：antigranity 波形聲學分析，4% 靜音自動切除，單片處理僅 3 秒",
            p2_title: "痛點二：腳本靈感枯竭與事實幻覺",
            p2_desc: "想轉發長文章或專業教材，一般聊天 AI 常常胡言亂語、生成充滿空話的廢稿；創作者自己熬夜手寫劇本，往往缺乏短影音前 3 秒吸引眼球的黃金 Hook。",
            s2_title: "解法：Google Notebook 知識接地技術，支援長影音摘要，生成零幻覺精華腳本",
            p3_title: "痛點三：傳統剪輯 GUI 無法規模化",
            p3_desc: "使用 Premiere、剪映等桌面軟體，每做一支影片就要反覆手動微調字卡位置、重新匯出，不僅電腦風扇狂轉、耗盡儲存空間，更完全無法實現無人值守自動化。",
            s3_title: "解法：Remotion 網頁級代碼渲染，多核心無頭平行輸出，邊際成本近乎為零",
            arch_heading: "兩大全球頂尖 AI 系統：協同分工架構",
            arch_sub: "左腦負責「知識研判與精確劇本」，右腦負責「聲學切除與視覺動態渲染」",
            sys1_title: "antigranity + Remotion 程式化渲染矩陣",
            sys1_desc: "完全免除桌面軟體點擊，透過代碼控制音視頻合流：",
            sys1_f1: "<strong style='color:#fff!important'>antigranity 聲學波形分析：</strong> 自動切除低於 4% 峰值音量，前後保留 2 幀緩衝，語速緊湊自然。",
            sys1_f2: "<strong style='color:#fff!important'>Remotion Headless 渲染：</strong> 以 React 組件定義電影感呼吸運鏡（Spring Zoom）與黃色關鍵字動態高亮。",
            sys1_f3: "<strong style='color:#fff!important'>C2PA 數位安全憑證：</strong> 渲染後自動寫入元數據與半透明標籤，符合平台演算法規範。",
            sys2_title: "Google Notebook 知識接地與 AI 導播流水線",
            sys2_desc: "以強大的知識整合技術為後盾，提供 100% 事實依據的劇本來源：",
            sys2_f1: "<strong style='color:#fff!important'>多源文件直接吞吐：</strong> 支援一鍵匯入 PDF 講義、DOCX、網頁文章及 YouTube 影片長片連結。",
            sys2_f2: "<strong style='color:#fff!important'>長影音摘要轉化：</strong> 自動擷取長影片精華字幕，提煉黃金 3 大觀點並標註毫秒級時間軸。",
            sys2_f3: "<strong style='color:#fff!important'>高留存短影音腳本：</strong> 內建標準 Hook -> Stakes -> Solution -> CTA 模板，導出結構化數據直供渲染。",
            prompt_heading: "小白自然語言口語指令：如何直接變成影片？",
            prompt_sub: "背後負責轉譯的 AI Agent 隨時待命，不需要你敲一行程式碼",
            nl_1: "「幫我切掉影片中所有沒說話的停頓與空白處」",
            nl_1_sub: "Auto-cutting dead air and pauses",
            nl_2: "「套用科技感藍色主題，關鍵字用黃色大字體高亮」",
            nl_2_sub: "Applying spring zoom & yellow text highlights",
            nl_3: "「分析這支長影片與講義，整理成 30 秒爆款短影音腳本」",
            nl_3_sub: "Grounded context synthesis & viral scriptwriting",
            portfolio_tag: "實戰驗證 · 完整生態矩陣",
            portfolio_heading: "我們微享 AI 技術作品集",
            portfolio_sub: "歷經實戰驗證的自動化變現工具、數位教材與生態產品矩陣（全自動輪動）",
            port_btn: "參觀作品專頁",
            port_1_title: "WAIA 全自動化營銷系統",
            port_1_desc: "專屬 AI 導客與全天候社交私域流量轉化系統，解放人力的流量攔截神器。",
            port_2_title: "AI 變現高階旗艦模組 $288",
            port_2_desc: "整合多模態代碼、自動化發布與企業級商業變現的高階落地架構包。",
            port_3_title: "AI 入門實踐核心指南 $99",
            port_3_desc: "低門檻、極速上手的 AI 影音生產線，小白自媒體創作最佳起步選擇。",
            port_4_title: "AI 增長變現收益套餐 $198",
            port_4_desc: "涵蓋高轉化文案庫、自動化分銷模型與贈送 360 天尋客包的高 CP 組合。",
            port_5_title: "NFT1314 眾籌贊助生態中心",
            port_5_desc: "社群共榮與眾籌贊助系統，支持優質創作者並解鎖更多優先內排特權。",
            tier_title: "SaaS-AVME 3.0 全自動影音大師手冊",
            tier_sub: "將價值超過 $5,000 美元的系統架構、代碼資產與導播模板完整封裝。從底層依賴庫安裝到多平台發布，全流程拆解無保留交付！",
            t_f1: "<strong style='color:#fff!important'>雙系統完整操作與「如何取得」SOP：</strong> 從官方免費通道到本地開源庫部署。",
            t_f2: "<strong style='color:#fff!important'>一鍵環境配置腳本：</strong> 隨書提供自動化安裝檔，雙擊即可配置本地運行庫。",
            t_f3: "<strong style='color:#fff!important'>Google Notebook 爆款提示詞庫：</strong> 包含 3 秒 Hook 提煉法與影片摘要指令集。",
            t_f4: "<strong style='color:#fff!important'>Remotion 1080p 網頁渲染模板源碼：</strong> 開箱即用的 React 動態字卡組件。",
            t_f5: "<strong style='color:#fff!important'>納入 25% 聯盟推廣分潤制度：</strong> 享有 10% 無限代級差 ＋ 10% 對等匹配 ＋ 5% 全球領袖分紅！",
            bottom_cta_hint: "立即前往下方 STEP 1 選擇 USDT 或信用卡刷卡完成開通",
            notes_title: "專案重要備註與專屬權益",
            note_1: "# 附 20 年系統架構總工程師的安裝 antigranity + remotion 不再踩坑輔導書",
            note_2: "# 選購 AI 教材系列累積達 $198 以上，再加碼送 AI 尋客 365 天（且全系列皆計入 25% 推廣分潤）",
            note_3: "# 唯一友善系統輔導師：<a href='mailto:xyz007tw@gmail.com' style='color: #38bdf8 !important; text-decoration: underline;'>xyz007tw@gmail.com</a>"
        },
        en: {
            video_src: "https://www.youtube.com/embed/WgUdPCh-DKI",
            badge_tag: "20-Year Principal Systems Architect Protocol",
            hero_h1: "Speak It into Video:",
            hero_h2: "The Zero-Editing Blueprint for Viral AI Shorts",
            hero_desc: "Traditional video outsourcing costs $100s per clip and takes over a week; learning video editing traps you in tedious timeline dragging and keyframing. With 20 years of systems architecture experience, we package an enterprise-grade $5,000 dual-engine workflow: speak conversational natural language, and let AI script, direct, and render 24/7 on autopilot!",
            hero_cta_hint: "Scroll down to STEP 1 below to pay via Credit Card or Web3 USDT ($99 Master Manual)",
            hero_b1: "Instant Email Delivery + 1-Click Email Forwarding",
            hero_b2: "Full 25% Affiliate Commission Eligible (10% Diff + 10% Match + 5% Pool)",
            hero_b3: "Orders >= $198 Receive Bonus 365-Day AI Lead Generation",
            video_title: "Dual-Engine Production Showcase",
            video_sub: "Live autonomous pipeline: Waveform mute-cuts + React headless rendering + dynamic retention captions",
            video_hint: "Witness how conversational prompts compile into viral shorts in 60 seconds",
            pain_heading_1: "Why Do 90% of Creators Give Up",
            pain_heading_2: "in 'Editing Timeline Hell'?",
            pain_sub: "Having architected distributed systems for 20 years, I see too many creators defeated by inefficient, manual editing workflows:",
            p1_title: "Pain 1: The Infinite Time Sink of Rough Cuts",
            p1_desc: "A 10-minute recording takes 2 hours of painful timeline trimming to remove breath pauses and stutters. Output is bottlenecked at 1 video a day, falling far behind platform algorithms.",
            s1_title: "Fix: antigranity acoustic waveform cuts trims <4% silence with 2-frame margins in 3 seconds",
            p2_title: "Pain 2: Creative Burnout & Model Hallucinations",
            p2_desc: "Generic chat models hallucinate fluff when summarizing articles; creators drafting scripts from scratch miss the critical 3-second viral hook needed for audience retention.",
            s2_title: "Fix: Google Notebook Source Grounding digests long videos into zero-hallucination scripts",
            p3_title: "Pain 3: Unscalable Desktop Video Software",
            p3_desc: "Manual NLE software (Premiere/CapCut) requires endless clicking, heating up hardware without any option for unattended batch rendering.",
            s3_title: "Fix: Remotion React headless multi-core parallel rendering delivers near-zero marginal costs",
            arch_heading: "Dual-Engine System Synergy Architecture",
            arch_sub: "Left Brain: Grounded Knowledge Directing | Right Brain: Acoustic Cutting & Headless Video Rendering",
            sys1_title: "antigranity + Remotion Code Rendering Stack",
            sys1_desc: "Zero desktop software clicking—pure programmatic audio/video synthesis:",
            sys1_f1: "<strong style='color:#fff!important'>antigranity Acoustic Waveform Cuts:</strong> Trims amplitudes below 4% with a 2-frame safety buffer for natural pacing.",
            sys1_f2: "<strong style='color:#fff!important'>Remotion Headless Rendering:</strong> React components declare cinematic spring zooms and dynamic yellow text highlights.",
            sys1_f3: "<strong style='color:#fff!important'>C2PA Provenance Tags:</strong> Cryptographic metadata and overlay watermarks comply with platform safety rules.",
            sys2_title: "Google Notebook Grounded Directing Pipeline",
            sys2_desc: "Backed by enterprise multi-source synthesis for 100% factual scriptwriting:",
            sys2_f1: "<strong style='color:#fff!important'>Multi-Source Direct Ingestion:</strong> Ingests PDFs, DOCX guides, live URLs, and YouTube video links in one click.",
            sys2_f2: "<strong style='color:#fff!important'>Long-Video Summary Pipeline:</strong> Extracts transcripts and isolates the top 3 high-impact insights with timestamps.",
            sys2_f3: "<strong style='color:#fff!important'>High-Retention Script Generation:</strong> Formats Hook -> Stakes -> Solution -> CTA into structured data ready for rendering.",
            prompt_heading: "Conversational Prompts to Viral Videos",
            prompt_sub: "The background AI Agent parses directives without you writing a single line of code",
            nl_1: "\"Cut out all silent gaps and pauses in the video\"",
            nl_1_sub: "Auto-cutting dead air and pauses",
            nl_2: "\"Apply blue tech theme with yellow large highlighted text\"",
            nl_2_sub: "Applying spring zoom & yellow text highlights",
            nl_3: "\"Analyze this video and PDF to draft a 30s viral short script\"",
            nl_3_sub: "Grounded context synthesis & viral scriptwriting",
            portfolio_tag: "BATTLE-TESTED ECOSYSTEM",
            portfolio_heading: "Our Weishare AI Tech Portfolio",
            portfolio_sub: "Field-tested automation engines, digital curricula, and monetization assets (Auto-Rotating)",
            port_btn: "Visit Project Live",
            port_1_title: "WAIA Automated Marketing Stack",
            port_1_desc: "Proprietary AI lead prospector & 24/7 automated private traffic conversion funnel.",
            port_2_title: "AI Monetization Suite $288",
            port_2_desc: "Multimodal programmatic code, multi-channel distribution & commercial setup kit.",
            port_3_title: "AI Starter Blueprint $99",
            port_3_desc: "Low-barrier, turn-key AI video pipeline designed for rapid creator onboarding.",
            port_4_title: "AI Growth Monetization Pack $198",
            port_4_desc: "High-converting copy matrix, affiliate system models plus 360-day lead generation bonus.",
            port_5_title: "NFT1314 Crowdfunding Ecosystem",
            port_5_desc: "Community crowdfunding & donate system unlocking prioritized pipeline placements.",
            tier_title: "SaaS-AVME 3.0 Master Handbook",
            tier_sub: "Complete release of our $5,000 enterprise system architecture, code assets, and directing templates from local dependency setup to multi-channel publishing!",
            t_f1: "<strong style='color:#fff!important'>Dual-System Operations & 'How to Obtain' SOP:</strong> Free official channels to local open-source deployment.",
            t_f2: "<strong style='color:#fff!important'>One-Click Setup Scripts:</strong> Automated installers configure local environments in one click.",
            t_f3: "<strong style='color:#fff!important'>Google Notebook Prompt Matrix:</strong> Proven 3-second viral hook frameworks and video summarizers.",
            t_f4: "<strong style='color:#fff!important'>Remotion 1080p React Source Code:</strong> Production-ready dynamic caption and camera components.",
            t_f5: "<strong style='color:#fff!important'>25% Affiliate Commission Plan:</strong> Earn 10% Differential + 10% Matching + 5% Global Pool commissions!",
            bottom_cta_hint: "Proceed to STEP 1 below to checkout via USDT or Credit Card",
            notes_title: "Important Notice & Exclusive Rights",
            note_1: "# Includes the \"Zero-Trap\" antigranity + Remotion installation and setup handbook curated by a 20-year veteran Principal Systems Architect.",
            note_2: "# Orders of AI curriculum series totaling $198 USD or more receive an additional 365-day AI Automated Lead Generation package (all eligible for 25% affiliate commissions).",
            note_3: "# Sole Friendly Systems Mentor & CTO Support: <a href='mailto:xyz007tw@gmail.com' style='color: #38bdf8 !important; text-decoration: underline;'>xyz007tw@gmail.com</a>"
        }
    };

    const root = document.getElementById('saas-avme-wrapper');
    if (!root) return;

    const docLang = (document.documentElement.lang || '').toLowerCase();
    let currentLang = docLang.includes('en') ? 'en' : 'zh';

    function switchAvmeLang(lang) {
        currentLang = lang;
        const dict = i18nConfig[lang];
        if (!dict) return;

        root.querySelectorAll('[data-avme]').forEach(function(el) {
            const key = el.getAttribute('data-avme');
            if (key && dict[key]) {
                el.innerHTML = dict[key];
            }
        });

        const shortsFrame = document.getElementById('avme-shorts-frame');
        if (shortsFrame && dict.video_src) {
            if (shortsFrame.getAttribute('src') !== dict.video_src) {
                shortsFrame.setAttribute('src', dict.video_src);
            }
        }

        const btnZh = document.getElementById('avme-lang-zh');
        const btnEn = document.getElementById('avme-lang-en');
        if (btnZh && btnEn) {
            btnZh.classList.toggle('active', lang === 'zh');
            btnEn.classList.toggle('active', lang === 'en');
        }
    }

    function setupAvmeCarousel() {
        const track = document.getElementById('avme-portfolio-track');
        const prevBtn = document.getElementById('avme-port-prev');
        const nextBtn = document.getElementById('avme-port-next');
        if (!track || !prevBtn || !nextBtn) return;

        let portfolioIndex = 0;
        const cards = track.querySelectorAll('.portfolio-card');
        const total = cards.length;

        function getVisibleCardsCount() {
            const w = window.innerWidth;
            if (w <= 600) return 1;
            if (w <= 900) return 2;
            return 3;
        }

        function movePortfolio(direction) {
            const visibleCount = getVisibleCardsCount();
            const maxIndex = Math.max(0, total - visibleCount);
            portfolioIndex += direction;
            if (portfolioIndex > maxIndex) portfolioIndex = 0;
            if (portfolioIndex < 0) portfolioIndex = maxIndex;
            const cardWidthPercent = 100 / visibleCount;
            track.style.transform = 'translateX(-' + (portfolioIndex * cardWidthPercent) + '%)';
        }

        prevBtn.onclick = function() { movePortfolio(-1); };
        nextBtn.onclick = function() { movePortfolio(1); };
    }

    setTimeout(function() {
        switchAvmeLang(currentLang);
        setupAvmeCarousel();
        const btnZh = document.getElementById('avme-lang-zh');
        const btnEn = document.getElementById('avme-lang-en');
        if (btnZh) btnZh.onclick = function() { switchAvmeLang('zh'); };
        if (btnEn) btnEn.onclick = function() { switchAvmeLang('en'); };
    }, 80);
})();
</script>
<!-- === 第 2 套教材：SaaS-AVME 3.0 雙引擎 AI 短影音自動化大師手冊結束 === -->`;

export const SAAS_AVME_PROMO_HTML_EN = SAAS_AVME_PROMO_HTML_ZH.replace(
  "let currentLang = docLang.includes('en') ? 'en' : 'zh';",
  "let currentLang = 'en';"
);
