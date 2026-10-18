export const BIGMONEY_PROMO_HTML_ZH = `<!-- === BIGMONEY.AI 旗艦教材宣傳文案 (中文版・25%分潤制度・USDT與信用卡雙軌結帳) === -->
<div id="bigmoney-wrapper" class="zylvie-embed-container text-left font-sans" style="background-color: #090d16; color: #f8fafc; padding: 28px 20px; border-radius: 20px; margin: 0 auto; max-width: 960px; line-height: 1.6; border: 1px solid rgba(16, 185, 129, 0.3);">

    <style>
        #bigmoney-wrapper * { box-sizing: border-box; }
        #bigmoney-wrapper .glow-card {
            background: #111827 !important;
            border: 1px solid #334155 !important;
            border-radius: 12px;
            padding: 20px;
        }
        #bigmoney-wrapper .high-contrast-text {
            color: #cbd5e1 !important;
        }
        #bigmoney-wrapper .high-contrast-desc {
            color: #f1f5f9 !important;
        }
        #bigmoney-wrapper .text-gradient-gold {
            background: linear-gradient(135deg, #34d399 0%, #38bdf8 50%, #facc15 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        #bigmoney-wrapper .checkout-hint-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(16, 185, 129, 0.18);
            border: 1px solid #10b981;
            color: #6ee7b7;
            padding: 12px 22px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 800;
            text-decoration: none !important;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 0 20px rgba(16, 185, 129, 0.25);
        }
        #bigmoney-wrapper .checkout-hint-badge:hover {
            background: rgba(16, 185, 129, 0.3);
            transform: translateY(-2px);
        }
        /* Shorts 專用 9:16 沉浸式比例容器 */
        #bigmoney-wrapper .video-container-shorts {
            position: relative;
            width: 100%;
            max-width: 340px;
            margin: 0 auto;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
            border: 1px solid #334155;
            background: #000;
        }
        #bigmoney-wrapper .video-container-shorts::after {
            display: block;
            content: "";
            padding-top: 177.77%;
        }
        #bigmoney-wrapper .video-container-shorts iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: 0;
        }
        /* 統計卡片 */
        #bigmoney-wrapper .stat-box {
            background: rgba(15, 23, 42, 0.8);
            border: 1px solid #1e293b;
            border-radius: 10px;
            padding: 14px 16px;
        }
        /* 眾籌專用文字發光按鈕 */
        #bigmoney-wrapper .nft-crowdfund-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background: linear-gradient(135deg, #10b981 0%, #0284c7 100%);
            color: #ffffff !important;
            text-decoration: none !important;
            font-weight: 800;
            font-size: 14px;
            padding: 12px 24px;
            border-radius: 8px;
            border: 1px solid #38bdf8;
            box-shadow: 0 4px 14px rgba(56, 189, 248, 0.25);
            transition: all 0.2s ease-in-out;
            cursor: pointer;
        }
        #bigmoney-wrapper .nft-crowdfund-btn:hover {
            opacity: 0.95;
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(56, 189, 248, 0.4);
        }

        /* 5大作品集輪播模組專用樣式 */
        #bigmoney-wrapper .bm-carousel-wrapper {
            position: relative;
            display: flex;
            align-items: center;
            margin: 0 auto;
            max-width: 840px;
        }
        #bigmoney-wrapper .bm-carousel-track-container {
            overflow: hidden;
            width: 100%;
            border-radius: 14px;
        }
        #bigmoney-wrapper .bm-carousel-track {
            display: flex;
            transition: transform 0.45s cubic-bezier(0.25, 1, 0.5, 1);
            gap: 16px;
        }
        #bigmoney-wrapper .bm-slide-card {
            flex: 0 0 100%;
            background: #111827;
            border: 1px solid #334155;
            border-radius: 12px;
            overflow: hidden;
            text-decoration: none !important;
            display: flex;
            flex-direction: column;
            transition: transform 0.2s ease, border-color 0.2s ease;
        }
        @media (min-width: 640px) {
            #bigmoney-wrapper .bm-slide-card {
                flex: 0 0 calc(50% - 8px);
            }
        }
        #bigmoney-wrapper .bm-slide-card:hover {
            border-color: #38bdf8;
            transform: translateY(-2px);
        }
        #bigmoney-wrapper .bm-slide-img-box {
            position: relative;
            width: 100%;
            height: 190px;
            background: #0b1120;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            border-bottom: 1px solid #1e293b;
        }
        #bigmoney-wrapper .bm-slide-img-box img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: top center;
            display: block;
        }
        #bigmoney-wrapper .bm-slide-tag {
            position: absolute;
            top: 10px;
            left: 10px;
            background: rgba(15, 23, 42, 0.85);
            border: 1px solid #38bdf8;
            color: #38bdf8;
            font-size: 11px;
            font-weight: 700;
            padding: 3px 8px;
            border-radius: 6px;
            backdrop-filter: blur(4px);
        }
        #bigmoney-wrapper .bm-slide-info {
            padding: 14px 16px;
            text-align: left;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        #bigmoney-wrapper .bm-slide-title {
            font-size: 14px;
            font-weight: 800;
            color: #ffffff;
            margin-bottom: 4px;
            line-height: 1.4;
        }
        #bigmoney-wrapper .bm-slide-desc {
            font-size: 12px;
            color: #94a3b8;
            line-height: 1.5;
            margin-bottom: 8px;
        }
        #bigmoney-wrapper .bm-slide-link-hint {
            font-size: 11px;
            color: #34d399;
            font-weight: 700;
        }
        #bigmoney-wrapper .bm-carousel-nav {
            background: rgba(15, 23, 42, 0.9);
            border: 1px solid #334155;
            color: #38bdf8;
            font-size: 18px;
            width: 38px;
            height: 38px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 2;
            transition: all 0.2s ease;
            flex-shrink: 0;
        }
        #bigmoney-wrapper .bm-carousel-nav:hover {
            background: #1e293b;
            color: #34d399;
            border-color: #34d399;
        }
        #bigmoney-wrapper .bm-prev { margin-right: 10px; }
        #bigmoney-wrapper .bm-next { margin-left: 10px; }
        #bigmoney-wrapper .bm-carousel-dots {
            display: flex;
            justify-content: center;
            gap: 6px;
            margin-top: 14px;
        }
        #bigmoney-wrapper .bm-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #334155;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        #bigmoney-wrapper .bm-dot.active {
            background: #38bdf8;
            width: 22px;
            border-radius: 4px;
        }
    </style>

    <!-- 頂部導航與雙語切換列 -->
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; padding-bottom: 14px; margin-bottom: 28px;">
        <div style="font-weight: 800; font-size: 18px; letter-spacing: 0.05em; color: #f8fafc;">
            BIGMONEY<span style="color: #34d399;">.AI</span> · <span style="font-size: 13px; color: #38bdf8;">AI頂配實戰教材</span>
        </div>
        <button id="bmLangBtn" type="button" style="background: #1e293b; color: #34d399; border: 1px solid #334155; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; cursor: pointer;">
            🌐 English / 中文切換
        </button>
    </div>

    <!-- Hero 標題區 -->
    <div style="text-align: center; margin-bottom: 32px;">
        <div style="display: inline-block; background: rgba(6, 78, 59, 0.6); border: 1px solid #059669; color: #34d399; font-size: 12px; font-weight: 700; padding: 4px 14px; border-radius: 999px; margin-bottom: 16px;" data-bm="hero_badge">
            🛡️ 20 年系統架構總工程師 親手打造
        </div>
        <h1 style="font-size: 28px; font-weight: 900; line-height: 1.35; margin: 0 0 16px 0; color: #ffffff;">
            <span data-bm="hero_title_1">你的一個好點子，</span><br>
            <span class="text-gradient-gold" data-bm="hero_title_2">到底值多少錢？</span>
        </h1>
        <p class="high-contrast-desc" style="font-size: 15px; max-width: 680px; margin: 0 auto 20px auto;" data-bm="hero_desc">
            告別手動苦力！結合「AI 影分身流 ＋ 全自動收款發貨 ＋ 區塊鏈抗通膨協議」，讓靈感轉化為 24 小時為你打工的被動收益飛輪。
        </p>

        <!-- 引導至下方 USDT 與信用卡雙軌結帳面板 -->
        <div style="margin-bottom: 20px;">
            <a href="#course-checkout-box" class="checkout-hint-badge">
                <span>👇</span> <span data-bm="hero_direct_hint">請於下方「STEP 1 結帳面板」選擇【信用卡/ATM 刷卡】或【Web3 USDT】即刻解鎖完整教材</span>
            </a>
        </div>

        <!-- 承諾標籤 -->
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 16px; font-size: 12px; color: #94a3b8;">
            <span style="color: #cbd5e1;">✔ <span data-bm="trust_1">即刻下載 3 份實戰落地手冊 ＋ 一鍵轉發電郵</span></span>
            <span style="color: #cbd5e1;">✔ <span data-bm="trust_2">贈微享 NFT 2 枚 (享 360 天系統賦能)</span></span>
            <span style="color: #cbd5e1;">✔ <span data-bm="trust_3">納入 25% 聯盟推廣分潤 (10%級差+10%對等+5%全球分紅)</span></span>
        </div>
    </div>

    <!-- 動態 Shorts 影音展示區 -->
    <div style="margin-bottom: 36px;">
        <div style="text-align: center; margin-bottom: 14px;">
            <span style="color: #34d399; font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;">▶ 60 SEC SYSTEM PREVIEW</span>
            <h2 style="font-size: 18px; font-weight: 800; color: #ffffff; margin: 4px 0 0 0;" data-bm="video_title">
                60 秒看懂：AI 雙引擎如何全自動運作
            </h2>
        </div>
        <div class="video-container-shorts">
            <iframe id="bmShortsFrame" src="https://www.youtube.com/embed/Xe9IwB5Y0TU" title="AI Revenue Engine Shorts Preview" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>
        <div style="text-align: center; margin-top: 10px; font-size: 11px; color: #94a3b8;" data-bm="video_tip">
            ※ 上方影片隨語系切換自動播放中/英雙語版
        </div>
    </div>

    <!-- 總工程師的同知相惜：利潤透明化與生態飛輪 -->
    <div class="glow-card" style="margin-bottom: 36px; border-left: 4px solid #34d399 !important; background: linear-gradient(180deg, #111827 0%, #0b1120 100%) !important;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <span style="font-size: 18px;">🤝</span>
            <h3 style="font-weight: 800; font-size: 18px; color: #ffffff; margin: 0;" data-bm="sympathy_title">
                總工程師的同知相惜：與你打造全球 AI-ATM
            </h3>
        </div>
        <div style="color: #34d399; font-size: 11px; font-family: monospace; margin-bottom: 14px;">
            CHIEF ENGINEER PROTOCOL & 25% AFFILIATE ALLOCATION
        </div>
        
        <p class="high-contrast-desc" style="font-size: 13px; line-height: 1.75; margin-bottom: 16px;" data-bm="sympathy_p1">
            學習 AI 非一日可及，本 AI頂配教材 能使你快速進化，讓 AI 真正助你「省煩、省力、省時」來賺錢不封頂！更重要的是，在此「學習＋實作＋試營」的過程中，我們直接為你注入最強資產底氣 —— 本專案特別加贈「微享 NFT」2 枚，每枚直接賦能 180 天 AI 自來客系統使用優勢（雙枚累計達 360 天），讓系統自動幫你拓客！推廣本教材更全面納入微享「25% 聯盟推廣分潤制度（10% 無限代級差 ＋ 10% 對等匹配 ＋ 5% 全球領袖分紅）」，一起打造我們的全球 AI-ATM。
        </p>

        <!-- 專屬 NFT 眾籌說明按鈕區塊 -->
        <div style="background: rgba(15, 23, 42, 0.9); border: 1px dashed #38bdf8; border-radius: 10px; padding: 16px; margin-bottom: 18px; text-align: center;">
            <div style="font-size: 13px; color: #facc15; font-weight: 700; margin-bottom: 10px;" data-bm="nft_badge_notice">
                💎 限時重磅升級：資產代幣化賦能！贈微享 NFT 2 枚（享 360 天 AI 自來客管線）
            </div>
            <a href="https://aitutor.vip/waia" target="_blank" rel="noopener noreferrer" class="nft-crowdfund-btn" data-bm="nft_btn_text">
                🔥 查看 AI 自來客系統・NFT 代幣化眾籌細節 →
            </a>
            <div style="font-size: 11px; color: #94a3b8; margin-top: 8px;" data-bm="nft_btn_sub">
                ※ 點擊開新視窗了解代幣化眾籌機制、智能合約分配與 180 天系統賦能權益
            </div>
        </div>

        <!-- 成本與 25% 分潤機制透明卡片 -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; margin-top: 14px;">
            <div class="stat-box" style="border-left: 3px solid #38bdf8;">
                <div style="font-size: 11px; color: #94a3b8; margin-bottom: 4px;" data-bm="cost_label">本系統底層運營與算力支撐</div>
                <div style="font-size: 22px; font-weight: 900; color: #38bdf8;">24H 全自動</div>
                <div class="high-contrast-text" style="font-size: 12px; margin-top: 4px;" data-bm="cost_desc">
                    涵蓋高效雲端伺服器、AI 矩陣產線、自動化多語系 SEO 工具庫與雙軌金流秒級發貨架構。
                </div>
            </div>
            <div class="stat-box" style="border-left: 3px solid #facc15;">
                <div style="font-size: 11px; color: #94a3b8; margin-bottom: 4px;" data-bm="fuel_label">學員推廣裂變分潤提撥</div>
                <div style="font-size: 22px; font-weight: 900; color: #facc15;">25% 聯盟分潤</div>
                <div class="high-contrast-text" style="font-size: 12px; margin-top: 4px;" data-bm="fuel_desc">
                    推廣教材與眾籌皆享最高 25% 聯盟分潤（10% 級差 + 10% 對等 + 5% 全球領袖分紅），成為你源源不絕的創業燃料！
                </div>
            </div>
        </div>
    </div>

    <!-- 流程架構區 (Pipeline) -->
    <div style="background: #0d1322; border: 1px solid #1e293b; border-radius: 14px; padding: 24px 18px; margin-bottom: 36px;">
        <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="font-size: 20px; font-weight: 800; color: #ffffff; margin: 0 0 8px 0;" data-bm="pipe_title">
                一鍵看懂：全自動雙引擎運作架構
            </h2>
            <p style="color: #94a3b8; font-size: 13px; margin: 0;" data-bm="pipe_subtitle">
                無需複雜程式碼，3 步驟完成被動獲利閉環
            </p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;">
            <div class="glow-card">
                <div style="color: #34d399; font-size: 22px; font-weight: 900; margin-bottom: 6px;">01</div>
                <div style="font-weight: 800; font-size: 15px; color: #f8fafc; margin-bottom: 6px;" data-bm="pipe_s1_t">流量端：AI 影分身流</div>
                <div class="high-contrast-text" style="font-size: 12px; line-height: 1.6;" data-bm="pipe_s1_d">
                    透過自動化多語系影音與 SEO 批次產製系統，搭配自來客管線，24 小時不間斷捕捉全球公域流量。
                </div>
            </div>
            <div class="glow-card">
                <div style="color: #38bdf8; font-size: 22px; font-weight: 900; margin-bottom: 6px;">02</div>
                <div style="font-weight: 800; font-size: 15px; color: #f8fafc; margin-bottom: 6px;" data-bm="pipe_s2_t">轉化端：USDT 與信用卡秒級發貨</div>
                <div class="high-contrast-text" style="font-size: 12px; line-height: 1.6;" data-bm="pipe_s2_d">
                    全面支援信用卡/ATM 刷卡與 Web3 USDT 雙軌收款！客戶下單秒級自動寄送教材信件，並支援首頁一鍵轉發電郵。
                </div>
            </div>
            <div class="glow-card">
                <div style="color: #facc15; font-size: 22px; font-weight: 900; margin-bottom: 6px;">03</div>
                <div style="font-weight: 800; font-size: 15px; color: #f8fafc; margin-bottom: 6px;" data-bm="pipe_s3_t">複利端：區塊鏈護城河</div>
                <div class="high-contrast-text" style="font-size: 12px; line-height: 1.6;" data-bm="pipe_s3_d">
                    結合微享 NFT 代幣化生態與低風險穩定幣理財協議，抗通膨並啟動長期複利飛輪。
                </div>
            </div>
        </div>
    </div>

    <!-- 交付物清單 -->
    <div style="margin-bottom: 36px;">
        <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="font-size: 20px; font-weight: 800; color: #ffffff; margin: 0 0 6px 0;" data-bm="deliver_title">實戰交付物：所見即所得</h2>
            <p style="color: #94a3b8; font-size: 13px; margin: 0;" data-bm="deliver_subtitle">付款後立即解鎖專屬雲端教材資料夾下載 & 支援電郵轉發，無虛假包裝</p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px;">
            <div class="glow-card">
                <div style="color: #f87171; font-weight: 800; font-size: 13px; margin-bottom: 4px;">[PDF 檔案 01]</div>
                <div style="font-weight: 800; font-size: 14px; color: #ffffff; margin-bottom: 4px;" data-bm="d1_t">PayPal Taiwan 設置教學</div>
                <div style="color: #94a3b8; font-size: 11px; margin-bottom: 8px;">8 Pages · 4.7 MB</div>
                <div class="high-contrast-text" style="font-size: 12px;" data-bm="d1_d">避開帳號封控與匯率坑，手把手建立支援全球多幣別的個人商務金流。</div>
            </div>
            <div class="glow-card">
                <div style="color: #f87171; font-weight: 800; font-size: 13px; margin-bottom: 4px;">[PDF 檔案 02]</div>
                <div style="font-weight: 800; font-size: 14px; color: #ffffff; margin-bottom: 4px;" data-bm="d2_t">區塊鏈資產增值實戰手冊</div>
                <div style="color: #94a3b8; font-size: 11px; margin-bottom: 8px;">3 Pages · 291 KB</div>
                <div class="high-contrast-text" style="font-size: 12px;" data-bm="d2_d">總工程師私房低風險穩定幣配置、金流撥轉協議與抗通膨複利策略。</div>
            </div>
            <div class="glow-card">
                <div style="color: #f87171; font-weight: 800; font-size: 13px; margin-bottom: 4px;">[PDF 檔案 03]</div>
                <div style="font-weight: 800; font-size: 14px; color: #ffffff; margin-bottom: 4px;" data-bm="d3_t">雙引擎系統全解析藍圖</div>
                <div style="color: #94a3b8; font-size: 11px; margin-bottom: 8px;">17 Pages · 1.2 MB</div>
                <div class="high-contrast-text" style="font-size: 12px;" data-bm="d3_d">內含全自動化架構避坑指南，系統化拆解全流程部署細節。</div>
            </div>
        </div>
    </div>

    <!-- 常見問答 (FAQ) -->
    <div style="margin-bottom: 36px;">
        <h3 style="font-size: 18px; font-weight: 800; color: #ffffff; text-align: center; margin-bottom: 18px;" data-bm="faq_title">常見問題解答 (FAQ)</h3>
        <div style="display: flex; flex-direction: column; gap: 10px;">
            <div class="glow-card" style="padding: 14px 18px;">
                <div style="font-weight: 800; font-size: 13px; color: #38bdf8; margin-bottom: 4px;" data-bm="q1">我沒有深厚程式背景，也能跑得動這套系統嗎？</div>
                <div class="high-contrast-text" style="font-size: 12px;" data-bm="a1">可以。教材包含專為新手設計的避坑清單，核心管線皆模組化，照手冊設定即可跑通。</div>
            </div>
            <div class="glow-card" style="padding: 14px 18px;">
                <div style="font-weight: 800; font-size: 13px; color: #38bdf8; margin-bottom: 4px;" data-bm="q_nft">贈送的 2 枚「微享 NFT」如何使用與生效？</div>
                <div class="high-contrast-text" style="font-size: 12px;" data-bm="a_nft">購買後即可依專屬指引領取 2 枚微享 NFT。每枚賦能 180 天 AI 自來客系統優勢，雙枚累計可享 360 天免維護自動導流優勢，並享代幣化生態權益。</div>
            </div>
            <div class="glow-card" style="padding: 14px 18px;">
                <div style="font-weight: 800; font-size: 13px; color: #38bdf8; margin-bottom: 4px;" data-bm="q2">25% 聯盟推廣分潤權如何啟用？</div>
                <div class="high-contrast-text" style="font-size: 12px;" data-bm="a2">完成教材或眾籌購買後，即可透過「會員中心 (Dashboard)」取得您的專屬推廣連結（支援信箱免密碼登入或錢包登入），享有 10% 無限代級差 ＋ 10% 對等匹配 ＋ 5% 全球領袖分紅（合計 25% 推廣分潤）！</div>
            </div>
            <div class="glow-card" style="padding: 14px 18px;">
                <div style="font-weight: 800; font-size: 13px; color: #38bdf8; margin-bottom: 4px;" data-bm="q3">購買後如何下載教材與尋求技術諮詢？</div>
                <div class="high-contrast-text" style="font-size: 12px;" data-bm="a3">支援「信用卡/ATM 刷卡」與「Web3 USDT」雙軌付款！付款成功後系統會自動寄送教材雲端連結至您的信箱，您亦可直接在本區下方「STEP 2」輸入購買信箱一鍵解鎖下載或轉發電郵；同時提供總工程師輔導支援信箱（xyz007tw@gmail.com）協助解答。</div>
            </div>
        </div>
    </div>

    <!-- 5大實戰作品集輪播展示區 (Portfolio Showcase) -->
    <div style="margin-bottom: 36px;">
        <div style="text-align: center; margin-bottom: 18px;">
            <div style="display: inline-block; background: rgba(56, 189, 248, 0.15); border: 1px solid #0284c7; color: #38bdf8; font-size: 11px; font-weight: 800; letter-spacing: 0.1em; padding: 3px 12px; border-radius: 999px; margin-bottom: 6px; text-transform: uppercase;">
                ▶ SYSTEM ARCHITECTURE & PROOFS
            </div>
            <h2 style="font-size: 20px; font-weight: 800; color: #ffffff; margin: 4px 0 6px 0;" data-bm="portfolio_title">
                總工程師實戰成果：5 大商務自動化作品集
            </h2>
            <p style="color: #94a3b8; font-size: 13px; margin: 0;" data-bm="portfolio_sub">
                線上真實營運站點檢驗・點擊任一卡片即可直達線上環境實測
            </p>
        </div>

        <!-- 輪播視窗主體 -->
        <div class="bm-carousel-wrapper">
            <button class="bm-carousel-nav bm-prev" id="bmPortPrev" type="button" aria-label="Previous">❮</button>
            <div class="bm-carousel-track-container">
                <div class="bm-carousel-track" id="bmPortTrack">
                    
                    <!-- 作品 1 -->
                    <a href="https://aitutor.vip/waia" target="_blank" rel="noopener noreferrer" class="bm-slide-card">
                        <div class="bm-slide-img-box">
                            <span class="bm-slide-tag" data-bm="port_t1_tag">Web3 代幣化眾籌</span>
                            <img src="https://api.microlink.io/?url=https%3A%2F%2Faitutor.vip%2Fwaia&screenshot=true&meta=false&embed=screenshot.url" alt="微享NFT技術代幣化眾籌" loading="lazy" />
                        </div>
                        <div class="bm-slide-info">
                            <div>
                                <div class="bm-slide-title" data-bm="port_t1_title">微享NFT技術代幣化眾籌</div>
                                <div class="bm-slide-desc" data-bm="port_t1_desc">鏈上自動分潤架構、智能合約與 180 天 AI 自來客管線賦能節點。</div>
                            </div>
                            <div class="bm-slide-link-hint" data-bm="port_link_hint">點擊檢驗線上站點 ↗</div>
                        </div>
                    </a>

                    <!-- 作品 2 -->
                    <a href="https://zylvie.com/1314520/p/free123" target="_blank" rel="noopener noreferrer" class="bm-slide-card">
                        <div class="bm-slide-img-box">
                            <span class="bm-slide-tag" data-bm="port_t2_tag">自來客流量管線</span>
                            <img src="https://api.microlink.io/?url=https%3A%2F%2Fzylvie.com%2F1314520%2Fp%2Ffree123&screenshot=true&meta=false&embed=screenshot.url" alt="AI自來客系統-廣告業配" loading="lazy" />
                        </div>
                        <div class="bm-slide-info">
                            <div>
                                <div class="bm-slide-title" data-bm="port_t2_title">AI自來客系統・廣告業配</div>
                                <div class="bm-slide-desc" data-bm="port_t2_desc">高轉換著陸頁面與自動化篩選過濾器，自動捕捉精準潛在商務商機。</div>
                            </div>
                            <div class="bm-slide-link-hint" data-bm="port_link_hint">點擊檢驗線上站點 ↗</div>
                        </div>
                    </a>

                    <!-- 作品 3 -->
                    <a href="https://zylvie.com/1314520/p/99" target="_blank" rel="noopener noreferrer" class="bm-slide-card">
                        <div class="bm-slide-img-box">
                            <span class="bm-slide-tag" data-bm="port_t3_tag">影音生成引擎</span>
                            <img src="https://api.microlink.io/?url=https%3A%2F%2Fzylvie.com%2F1314520%2Fp%2F99&screenshot=true&meta=false&embed=screenshot.url" alt="AI自編自導自剪短視頻系統" loading="lazy" />
                        </div>
                        <div class="bm-slide-info">
                            <div>
                                <div class="bm-slide-title" data-bm="port_t3_title">AI自編自導自剪短視頻系統</div>
                                <div class="bm-slide-desc" data-bm="port_t3_desc">文案生成、素材配對與短影音程式化剪輯閉環，釋放全自動內容生產力。</div>
                            </div>
                            <div class="bm-slide-link-hint" data-bm="port_link_hint">點擊檢驗線上站點 ↗</div>
                        </div>
                    </a>

                    <!-- 作品 4 -->
                    <a href="https://zylvie.com/1314520/p/168" target="_blank" rel="noopener noreferrer" class="bm-slide-card">
                        <div class="bm-slide-img-box">
                            <span class="bm-slide-tag" data-bm="port_t4_tag">秒級收款與生息</span>
                            <img src="https://api.microlink.io/?url=https%3A%2F%2Fzylvie.com%2F1314520%2Fp%2F168&screenshot=true&meta=false&embed=screenshot.url" alt="AI自來客/收款即發貨/區塊鏈穩生息" loading="lazy" />
                        </div>
                        <div class="bm-slide-info">
                            <div>
                                <div class="bm-slide-title" data-bm="port_t4_title">AI自來客／收款即發貨／穩生息</div>
                                <div class="bm-slide-desc" data-bm="port_t4_desc">全自動化金流、秒級商品發送與 Web3 穩定幣理財協議整合實例。</div>
                            </div>
                            <div class="bm-slide-link-hint" data-bm="port_link_hint">點擊檢驗線上站點 ↗</div>
                        </div>
                    </a>

                    <!-- 作品 5 -->
                    <a href="https://zylvie.com/1314520/p/288" target="_blank" rel="noopener noreferrer" class="bm-slide-card">
                        <div class="bm-slide-img-box">
                            <span class="bm-slide-tag" data-bm="port_t5_tag">雙軌矩陣流量</span>
                            <img src="https://api.microlink.io/?url=https%3A%2F%2Fzylvie.com%2F1314520%2Fp%2F288&screenshot=true&meta=false&embed=screenshot.url" alt="YT影分身流+WP-SEO雙軌流量" loading="lazy" />
                        </div>
                        <div class="bm-slide-info">
                            <div>
                                <div class="bm-slide-title" data-bm="port_t5_title">YT影分身流＋WP-SEO雙軌流量</div>
                                <div class="bm-slide-desc" data-bm="port_t5_desc">YouTube 多語系矩陣搭配 WordPress 深度 SEO 站群，打造雙向公域護城河。</div>
                            </div>
                            <div class="bm-slide-link-hint" data-bm="port_link_hint">點擊檢驗線上站點 ↗</div>
                        </div>
                    </a>

                </div>
            </div>
            <button class="bm-carousel-nav bm-next" id="bmPortNext" type="button" aria-label="Next">❯</button>
        </div>

        <!-- 輪播分頁指示點 -->
        <div class="bm-carousel-dots" id="bmPortDots"></div>
    </div>

    <!-- 底部結帳指引卡片 -->
    <div style="text-align: center; padding: 24px 16px; background: #0f172a; border-radius: 14px; border: 1px solid #334155;">
        <h3 style="font-size: 20px; font-weight: 800; color: #ffffff; margin: 0 0 10px 0;" data-bm="cta_bottom_t">用系統的槓桿，放大好點子的價值</h3>
        <p style="color: #94a3b8; font-size: 13px; margin: 0 0 16px 0;" data-bm="cta_bottom_d">支援【信用卡/ATM 刷卡】與【Web3 USDT】雙軌結帳（含 2 枚微享 NFT 贈送＋雙引擎系統教材＋25% 推廣分潤權）</p>
        <a href="#course-checkout-box" class="checkout-hint-badge" style="margin: 0 auto;">
            <span>👇</span> <span data-bm="footer_direct_hint">立即前往下方 STEP 1 選擇 USDT 或信用卡刷卡完成開通</span>
        </a>
    </div>

</div>

<!-- 雙語切換與輪播互動腳本 -->
<script>
(function() {
    const shortsVideos = {
        zh: "https://www.youtube.com/embed/Xe9IwB5Y0TU",
        en: "https://www.youtube.com/embed/mEN6xEVKnRA"
    };

    const dict = {
        zh: {
            btn_toggle: "🌐 Switch to English",
            hero_badge: "🛡️ 20 年系統架構總工程師 親手打造",
            hero_title_1: "你的一個好點子，",
            hero_title_2: "到底值多少錢？",
            hero_desc: "告別手動苦力！結合「AI 影分身流 ＋ 全自動收款發貨 ＋ 區塊鏈抗通膨協議」，讓靈感轉化為 24 小時為你打工的被動收益飛輪。",
            hero_direct_hint: "請於下方「STEP 1 結帳面板」選擇【信用卡/ATM 刷卡】或【Web3 USDT】即刻解鎖完整教材",
            trust_1: "即刻下載 3 份實戰落地手冊 ＋ 一鍵轉發電郵",
            trust_2: "贈微享 NFT 2 枚 (享 360 天系統賦能)",
            trust_3: "納入 25% 聯盟推廣分潤 (10%級差+10%對等+5%全球分紅)",
            video_title: "60 秒看懂：AI 雙引擎如何全自動運作",
            video_tip: "※ 上方影片隨語系切換自動播放中/英雙語版",
            sympathy_title: "總工程師的同知相惜：與你打造全球 AI-ATM",
            sympathy_p1: "學習 AI 非一日可及，本 AI頂配教材 能使你快速進化，讓 AI 真正助你「省煩、省力、省時」來賺錢不封頂！更重要的是，在此「學習＋實作＋試營」的過程中，我們直接為你注入最強資產底氣 —— 本專案特別加贈「微享 NFT」2 枚，每枚直接賦能 180 天 AI 自來客系統使用優勢（雙枚累計達 360 天），讓系統自動幫你拓客！推廣本教材更全面納入微享「25% 聯盟推廣分潤制度（10% 無限代級差 ＋ 10% 對等匹配 ＋ 5% 全球領袖分紅）」，一起打造我們的全球 AI-ATM。",
            nft_badge_notice: "💎 限時重磅升級：資產代幣化賦能！贈微享 NFT 2 枚（享 360 天 AI 自來客管線）",
            nft_btn_text: "🔥 查看 AI 自來客系統・NFT 代幣化眾籌細節 →",
            nft_btn_sub: "※ 點擊開新視窗了解代幣化眾籌機制、智能合約分配與 180 天系統賦能權益",
            cost_label: "本系統底層運營與算力支撐",
            cost_desc: "涵蓋高效雲端伺服器、AI 矩陣產線、自動化多語系 SEO 工具庫與雙軌金流秒級發貨架構。",
            fuel_label: "學員推廣裂變分潤提撥",
            fuel_desc: "推廣教材與眾籌皆享最高 25% 聯盟分潤（10% 級差 + 10% 對等 + 5% 全球領袖分紅），成為你源源不絕的創業燃料！",
            pipe_title: "一鍵看懂：全自動雙引擎運作架構",
            pipe_subtitle: "無需複雜程式碼，3 步驟完成被動獲利閉環",
            pipe_s1_t: "流量端：AI 影分身流",
            pipe_s1_d: "透過自動化多語系影音與 SEO 批次產製系統，搭配自來客管線，24 小時不間斷捕捉全球公域流量。",
            pipe_s2_t: "轉化端：USDT 與信用卡秒級發貨",
            pipe_s2_d: "全面支援信用卡/ATM 刷卡與 Web3 USDT 雙軌收款！客戶下單秒級自動寄送教材信件，並支援首頁一鍵轉發電郵。",
            pipe_s3_t: "複利端：區塊鏈護城河",
            pipe_s3_d: "結合微享 NFT 代幣化生態與低風險穩定幣理財協議，抗通膨並啟動長期複利飛輪。",
            deliver_title: "實戰交付物：所見即所得",
            deliver_subtitle: "付款後立即解鎖專屬雲端教材資料夾下載 & 支援電郵轉發，無虛假包裝",
            d1_t: "PayPal Taiwan 設置教學",
            d1_d: "避開帳號封控與匯率坑，手把手建立支援全球多幣別的個人商務金流。",
            d2_t: "區塊鏈資產增值實戰手冊",
            d2_d: "總工程師私房低風險穩定幣配置、金流撥轉協議與抗通膨複利策略。",
            d3_t: "雙引擎系統全解析藍圖",
            d3_d: "內含全自動化架構避坑指南，系統化拆解全流程部署細節。",
            faq_title: "常見問題解答 (FAQ)",
            q1: "我沒有深厚程式背景，也能跑得動這套系統嗎？",
            a1: "可以。教材包含專為新手設計的避坑清單，核心管線皆模組化，照手冊設定即可跑通。",
            q_nft: "贈送的 2 枚「微享 NFT」如何使用與生效？",
            a_nft: "購買後即可依專屬指引領取 2 枚微享 NFT。每枚賦能 180 天 AI 自來客系統優勢，雙枚累計可享 360 天免維護自動導流優勢，並享代幣化生態權益。",
            q2: "25% 聯盟推廣分潤權如何啟用？",
            a2: "完成教材或眾籌購買後，即可透過「會員中心 (Dashboard)」取得您的專屬推廣連結（支援信箱免密碼登入或錢包登入），享有 10% 無限代級差 ＋ 10% 對等匹配 ＋ 5% 全球領袖分紅（合計 25% 推廣分潤）！",
            q3: "購買後如何下載教材與尋求技術諮詢？",
            a3: "支援「信用卡/ATM 刷卡」與「Web3 USDT」雙軌付款！付款成功後系統會自動寄送教材雲端連結至您的信箱，您亦可直接在本區下方「STEP 2」輸入購買信箱一鍵解鎖下載或轉發電郵；同時提供總工程師輔導支援信箱（xyz007tw@gmail.com）協助解答。",
            portfolio_title: "總工程師實戰成果：5 大商務自動化作品集",
            portfolio_sub: "線上真實營運站點檢驗・點擊任一卡片即可直達線上環境實測",
            port_link_hint: "點擊檢驗線上站點 ↗",
            port_t1_tag: "Web3 代幣化眾籌",
            port_t1_title: "微享NFT技術代幣化眾籌",
            port_t1_desc: "鏈上自動分潤架構、智能合約與 180 天 AI 自來客管線賦能節點。",
            port_t2_tag: "自來客流量管線",
            port_t2_title: "AI自來客系統・廣告業配",
            port_t2_desc: "高轉換著陸頁面與自動化篩選過濾器，自動捕捉精準潛在商務商機。",
            port_t3_tag: "影音生成引擎",
            port_t3_title: "AI自編自導自剪短視頻系統",
            port_t3_desc: "文案生成、素材配對與短影音程式化剪輯閉環，釋放全自動內容生產力。",
            port_t4_tag: "秒級收款與生息",
            port_t4_title: "AI自來客／收款即發貨／穩生息",
            port_t4_desc: "全自動化金流、秒級商品發送與 Web3 穩定幣理財協議整合實例。",
            port_t5_tag: "雙軌矩陣流量",
            port_t5_title: "YT影分身流＋WP-SEO雙軌流量",
            port_t5_desc: "YouTube 多語系矩陣搭配 WordPress 深度 SEO 站群，打造雙向公域護城河。",
            cta_bottom_t: "用系統的槓桿，放大好點子的價值",
            cta_bottom_d: "支援【信用卡/ATM 刷卡】與【Web3 USDT】雙軌結帳（含 2 枚微享 NFT 贈送＋雙引擎系統教材＋25% 推廣分潤權）",
            footer_direct_hint: "立即前往下方 STEP 1 選擇 USDT 或信用卡刷卡完成開通"
        },
        en: {
            btn_toggle: "🌐 切換繁體中文",
            hero_badge: "🛡️ Built by 20-Year Chief Software Architect",
            hero_title_1: "How Much Is Your",
            hero_title_2: "Best Idea Really Worth?",
            hero_desc: "Say goodbye to manual grind. Turn your inspiration into a 24/7 automated revenue engine powered by AI Video Pipeline, Instant Checkout, and Web3 Compounding.",
            hero_direct_hint: "Scroll down to 'STEP 1 Checkout Panel' below to pay via Credit Card or Web3 USDT",
            trust_1: "Instant Access to 3 Practical Manuals + 1-Click Email Forwarding",
            trust_2: "Bonus: 2 Micro-Share NFTs (360-Day System Access)",
            trust_3: "Eligible for 25% Viral Affiliate Commission (10% Diff + 10% Match + 5% Pool)",
            video_title: "60-Second Demo: How the AI Dual-Engine Works",
            video_tip: "※ Video dynamically switches between English and Chinese versions",
            sympathy_title: "Chief Engineer's Manifesto: Building the Global AI-ATM Together",
            sympathy_p1: "Mastering AI is a journey. This AI Master Material accelerates your progress to save hassle, effort, and time while unlocking uncapped revenue! To back you with tangible value, this release includes 2 complimentary 'Micro-Share NFTs'. Each NFT provides 180 days of automated AI Inbound System privileges (360 days total), plus full eligibility for our 25% Affiliate Commission Plan (10% Differential + 10% Matching + 5% Global Pool) to fuel your scalable AI-ATM.",
            nft_badge_notice: "💎 Exclusive Web3 Tokenized Upgrade: 2 Micro-Share NFTs Included (360-Day AI Inbound Pipeline)",
            nft_btn_text: "🔥 Explore AI Inbound System NFT Crowdfunding →",
            nft_btn_sub: "※ Click to inspect smart contract allocations, crowdfunding tokenomics, and 180-day utility rights",
            cost_label: "Underlying Operating & Compute Power",
            cost_desc: "Covers cloud servers, AI video matrix pipelines, multilingual SEO automation, and dual-rail instant checkout.",
            fuel_label: "Affiliate Viral Commission Allocation",
            fuel_desc: "Earn up to 25% affiliate commissions (10% Differential + 10% Matching + 5% Global Pool) to power your growth!",
            pipe_title: "Understand the Dual-Engine Architecture",
            pipe_subtitle: "Zero coding hurdles. Close the passive revenue loop in 3 steps.",
            pipe_s1_t: "Traffic: AI Video Pipeline",
            pipe_s1_d: "Automated video generation via Multilingual SEO pipelines, capturing global traffic across 6+ languages 24/7.",
            pipe_s2_t: "Conversion: Credit Card & USDT Instant Delivery",
            pipe_s2_d: "Supports both Credit Card/ATM and Web3 USDT checkout! Instant email delivery upon payment plus 1-click email forwarding.",
            pipe_s3_t: "Compounding: Blockchain Moat",
            pipe_s3_d: "Integrated with Micro-Share NFT tokenized assets and low-risk stablecoin yields, compounding safely.",
            deliver_title: "What You'll Get: Tangible Deliverables",
            deliver_subtitle: "Instant cloud folder unlock & email forwarding after checkout. No vanity metrics.",
            d1_t: "PayPal Taiwan Business Setup Guide",
            d1_d: "Avoid account freezing and FX losses. Step-by-step setup for cross-border global payments.",
            d2_t: "Blockchain Asset Growth Guide",
            d2_d: "Chief Engineer's private playbook for low-risk stablecoin yields and inflation-hedged assets.",
            d3_t: "Dual Engine Full Architecture Blueprint",
            d3_d: "Includes end-to-end architecture troubleshooting and scalable deployment blueprints.",
            faq_title: "Frequently Asked Questions",
            q1: "Do I need a strong coding background to deploy this?",
            a1: "No. The system includes step-by-step troubleshooting guides and ready-made commercial deployment templates.",
            q_nft: "How do the 2 complimentary Micro-Share NFTs work?",
            a_nft: "Upon purchase, you will receive instructions to claim 2 Micro-Share NFTs. Each unlocks 180 days of AI Inbound System advantages (360 days combined) plus tokenized community rights.",
            q2: "How does the 25% Affiliate Commission Plan work?",
            a2: "Once you purchase, log in to the Member Dashboard (via email or wallet) to grab your referral link and earn up to 25% commissions (10% Differential + 10% Matching + 5% Global Pool).",
            q3: "How do I download the materials and get technical support?",
            a3: "Pay via Credit Card or Web3 USDT! The download link is automatically emailed to you, and you can also unlock or forward it in STEP 2 below. Priority engineer support is available at xyz007tw@gmail.com.",
            portfolio_title: "Architect's Production Case Studies: 5 Automated Systems",
            portfolio_sub: "Live production environments. Click any card to inspect the real deployment.",
            port_link_hint: "Inspect Live Deployment ↗",
            port_t1_tag: "Web3 Crowdfunding",
            port_t1_title: "Micro-Share NFT Crowdfunding",
            port_t1_desc: "On-chain automated revenue share, smart contracts & 180-day AI inbound utility nodes.",
            port_t2_tag: "Inbound Funnel",
            port_t2_title: "AI Inbound System & Sponsorships",
            port_t2_desc: "High-conversion landing pages and smart filters, qualifying leads 24/7 on autopilot.",
            port_t3_tag: "Video Engine",
            port_t3_title: "AI Autonomous Video Production",
            port_t3_desc: "End-to-end script generation, asset sourcing & automated rendering pipelines.",
            port_t4_tag: "Instant Delivery",
            port_t4_title: "Inbound / Checkout / Yield Protocol",
            port_t4_desc: "Automated payment routing, sub-second delivery, and Web3 stablecoin yield allocation.",
            port_t5_tag: "Dual Traffic",
            port_t5_title: "YT Video Array + WP SEO Engines",
            port_t5_desc: "Multi-language YouTube channel array coupled with WordPress SEO cluster.",
            cta_bottom_t: "Leverage Systems to Scale Your Value",
            cta_bottom_d: "Supports Credit Card/ATM & Web3 USDT Checkout (Includes 2 Micro-Share NFTs + Dual-Engine Blueprint + 25% Affiliate Rights)",
            footer_direct_hint: "Proceed to STEP 1 below to checkout via USDT or Credit Card"
        }
    };

    const root = document.getElementById('bigmoney-wrapper');
    if (!root) return;

    const docLang = (document.documentElement.lang || '').toLowerCase();
    let cur = docLang.includes('en') ? 'en' : 'zh';

    function apply(lang) {
        cur = lang;
        const data = dict[lang];
        if (!data) return;

        root.querySelectorAll('[data-bm]').forEach(function(el) {
            const k = el.getAttribute('data-bm');
            if (k && data[k]) el.textContent = data[k];
        });

        const btn = document.getElementById('bmLangBtn');
        if (btn) btn.textContent = data.btn_toggle;

        const iframe = document.getElementById('bmShortsFrame');
        if (iframe && shortsVideos[lang]) {
            if (iframe.getAttribute('src') !== shortsVideos[lang]) {
                iframe.setAttribute('src', shortsVideos[lang]);
            }
        }
    }

    function setupCarousel() {
        const track = document.getElementById('bmPortTrack');
        const prevBtn = document.getElementById('bmPortPrev');
        const nextBtn = document.getElementById('bmPortNext');
        const dotsBox = document.getElementById('bmPortDots');
        if (!track || !prevBtn || !nextBtn || !dotsBox) return;

        const slides = Array.from(track.children);
        let currentIndex = 0;

        function getVisibleCount() {
            return window.innerWidth >= 640 ? 2 : 1;
        }

        function maxIndex() {
            return Math.max(0, slides.length - getVisibleCount());
        }

        function updateDots() {
            dotsBox.innerHTML = '';
            const totalDots = maxIndex() + 1;
            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement('div');
                dot.className = 'bm-dot' + (i === currentIndex ? ' active' : '');
                dot.addEventListener('click', function() { goTo(i); });
                dotsBox.appendChild(dot);
            }
        }

        function goTo(index) {
            currentIndex = Math.max(0, Math.min(index, maxIndex()));
            if (!slides[0]) return;
            const slideWidth = slides[0].getBoundingClientRect().width + 16;
            track.style.transform = 'translateX(-' + (currentIndex * slideWidth) + 'px)';
            updateDots();
        }

        prevBtn.onclick = function() {
            goTo(currentIndex === 0 ? maxIndex() : currentIndex - 1);
        };

        nextBtn.onclick = function() {
            goTo(currentIndex >= maxIndex() ? 0 : currentIndex + 1);
        };

        window.addEventListener('resize', function() {
            goTo(Math.min(currentIndex, maxIndex()));
        });

        updateDots();
    }

    setTimeout(function() {
        apply(cur);
        setupCarousel();
        const toggleBtn = document.getElementById('bmLangBtn');
        if (toggleBtn) {
            toggleBtn.onclick = function() {
                apply(cur === 'zh' ? 'en' : 'zh');
            };
        }
    }, 80);
})();
</script>
<!-- === BIGMONEY.AI 旗艦教材宣傳文案結束 === -->`;

export const BIGMONEY_PROMO_HTML_EN = BIGMONEY_PROMO_HTML_ZH.replace(
  "let cur = docLang.includes('en') ? 'en' : 'zh';",
  "let cur = 'en';"
);
