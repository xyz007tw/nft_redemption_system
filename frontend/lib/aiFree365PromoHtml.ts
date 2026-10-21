export const AI_FREE365_PROMO_HTML = `<!-- === 客製與協辦 03：AI尋客365天攏免錢 ($600 USD 全球網購連鎖店計劃・已升級 $198 頂配教材、25% 分潤制度、主站 6 國語系連動) === -->
<div id="ai-landing-wrapper">
    <style>
        #ai-landing-wrapper,
        #ai-landing-wrapper *,
        #ai-landing-wrapper *::before,
        #ai-landing-wrapper *::after {
            box-sizing: border-box;
        }

        #ai-landing-wrapper {
            --primary-bg: #0b0f19;
            --card-bg: #161d30;
            --accent-color: #0d9488;
            --accent-glow: #14b8a6;
            --text-main: #ffffff;
            --text-muted: #cbd5e1;
            --warning-color: #f59e0b;
            --danger-glow: rgba(239, 68, 68, 0.15);
            font-family: 'Noto Sans TC', 'Poppins', sans-serif !important;
            color: var(--text-main) !important;
            background-color: var(--primary-bg) !important;
            line-height: 1.8 !important;
            letter-spacing: 0.5px !important;
            padding: 20px 0 40px 0;
            text-align: center !important;
            display: flex;
            flex-direction: column;
            align-items: center !important;
            border-radius: 20px;
            width: 100%;
            overflow: hidden;
        }

        /* 頂部主站 6 國語系切換條 */
        #ai-landing-wrapper .top-lang-bar {
            width: 100%;
            max-width: 850px;
            padding: 12px 24px;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            margin-bottom: 10px;
        }

        #ai-landing-wrapper .lang-select-pill {
            background: rgba(22, 29, 48, 0.95) !important;
            padding: 6px 14px;
            border-radius: 50px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            border: 1.5px solid var(--accent-glow);
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        #ai-landing-wrapper .lang-select-el {
            background: transparent !important;
            border: none !important;
            color: #ffffff !important;
            font-weight: 800 !important;
            font-size: 13px !important;
            cursor: pointer;
            outline: none;
        }

        #ai-landing-wrapper .lang-select-el option {
            background: #0b0f19;
            color: #ffffff;
        }

        /* 限制最大寬度的中央容器 */
        #ai-landing-wrapper .container {
            width: 100%;
            max-width: 850px;
            margin: 0 auto !important;
            padding: 0 20px;
            display: flex;
            flex-direction: column;
            align-items: center !important;
        }

        /* 頂部 Hero 視覺區 */
        #ai-landing-wrapper header {
            padding: 50px 0 40px 0;
            width: 100%;
            text-align: center !important;
            background: radial-gradient(circle at 50% 30%, rgba(13, 148, 136, 0.18) 0%, transparent 70%) !important;
            display: flex;
            flex-direction: column;
            align-items: center !important;
        }

        #ai-landing-wrapper .badge {
            background-color: rgba(245, 158, 11, 0.1) !important;
            border: 1px solid var(--warning-color) !important;
            color: var(--warning-color) !important;
            padding: 8px 18px !important;
            border-radius: 50px !important;
            font-size: 14px !important;
            font-weight: 700 !important;
            display: inline-block;
            margin: 0 auto 25px auto !important;
            letter-spacing: 1.5px !important;
        }

        #ai-landing-wrapper h1 {
            font-size: 2.5rem !important;
            font-weight: 900 !important;
            line-height: 1.3 !important;
            margin-bottom: 25px !important;
            color: #ffffff !important;
            text-align: center !important;
            background: linear-gradient(135deg, #ffffff 30%, var(--accent-glow) 100%) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            width: 100%;
        }

        #ai-landing-wrapper .intro-lead {
            font-size: 1.15rem !important;
            color: var(--text-muted) !important;
            max-width: 700px;
            margin: 0 auto 35px auto !important;
            font-weight: 400 !important;
            text-align: center !important;
        }

        /* 3 大黑幕警示卡片 */
        #ai-landing-wrapper .pain-section {
            background-color: rgba(220, 38, 38, 0.03) !important;
            border: 1px solid rgba(220, 38, 38, 0.2) !important;
            padding: 36px 24px;
            border-radius: 24px;
            margin: 30px 0;
            text-align: center !important;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center !important;
        }

        #ai-landing-wrapper .pain-title {
            color: #fca5a5 !important;
            font-size: 1.5rem !important;
            font-weight: 800 !important;
            margin-bottom: 26px !important;
            text-align: center !important;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        #ai-landing-wrapper .pain-cards-container {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 20px !important;
            width: 100%;
            margin-top: 10px;
        }

        #ai-landing-wrapper .pain-card {
            background: rgba(220, 38, 38, 0.04) !important;
            border: 1px solid rgba(239, 68, 68, 0.15) !important;
            border-radius: 16px !important;
            padding: 25px 20px !important;
            text-align: center !important;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            align-items: center !important;
        }

        #ai-landing-wrapper .pain-card:hover {
            transform: translateY(-3px) !important;
            background: rgba(220, 38, 38, 0.08) !important;
            border-color: rgba(239, 68, 68, 0.4) !important;
            box-shadow: 0 10px 25px var(--danger-glow) !important;
        }

        #ai-landing-wrapper .pain-card-icon {
            font-size: 1.8rem !important;
            margin-bottom: 15px !important;
        }

        #ai-landing-wrapper .pain-card-title {
            font-size: 1.15rem !important;
            font-weight: 800 !important;
            color: #fca5a5 !important;
            margin-bottom: 12px !important;
            text-align: center !important;
        }

        #ai-landing-wrapper .pain-card-desc {
            font-size: 0.9rem !important;
            color: #cbd5e1 !important;
            line-height: 1.6 !important;
            text-align: center !important;
        }

        /* 影片實戰區域 */
        #ai-landing-wrapper .video-section {
            margin: 40px 0;
            text-align: center !important;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center !important;
        }

        #ai-landing-wrapper .section-title {
            color: #ffffff !important;
            font-size: 1.75rem !important;
            font-weight: 800 !important;
            margin-bottom: 15px !important;
            text-align: center !important;
            width: 100%;
        }

        #ai-landing-wrapper .video-wrapper {
            width: 100%;
            max-width: 340px;
            margin: 25px auto 35px auto !important;
            border-radius: 24px;
            overflow: hidden;
            border: 4px solid var(--accent-color) !important;
            box-shadow: 0 0 35px rgba(20, 184, 166, 0.4) !important;
            background: #000000 !important;
        }

        #ai-landing-wrapper .video-ratio {
            position: relative;
            padding-bottom: 177.77%;
            height: 0;
        }

        #ai-landing-wrapper .video-ratio iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100% !important;
            height: 100% !important;
            border: none !important;
        }

        /* 數據佐證卡片置中 */
        #ai-landing-wrapper .stats-grid {
            display: flex !important;
            flex-wrap: wrap !important;
            justify-content: center !important;
            gap: 20px;
            margin: 10px auto 20px auto !important;
            width: 100%;
            max-width: 750px;
        }

        #ai-landing-wrapper .stat-card {
            background: var(--card-bg) !important;
            padding: 20px;
            border-radius: 16px;
            border: 1px solid rgba(255,255,255,0.08) !important;
            text-align: center !important;
            flex: 1 1 200px;
            max-width: 230px;
        }

        #ai-landing-wrapper .stat-num {
            font-size: 1.8rem !important;
            font-weight: 800 !important;
            color: var(--accent-glow) !important;
            text-align: center !important;
            display: block;
        }

        #ai-landing-wrapper .stat-label {
            font-size: 13px !important;
            color: var(--text-muted) !important;
            text-align: center !important;
            display: block;
            margin-top: 5px;
        }

        /* 四大圖列式網格 */
        #ai-landing-wrapper .tech-grid-section {
            width: 100%;
            margin: 40px 0;
            text-align: center !important;
        }

        #ai-landing-wrapper .tech-grid {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 24px !important;
            width: 100%;
            margin-top: 30px;
        }

        #ai-landing-wrapper .tech-card {
            background: linear-gradient(135deg, #161d30 0%, #0f172a 100%) !important;
            border: 1px solid rgba(20, 184, 166, 0.15) !important;
            border-radius: 20px !important;
            padding: 32px 26px !important;
            text-align: center !important;
            display: flex;
            flex-direction: column;
            align-items: center !important;
            justify-content: space-between;
            transition: all 0.3s ease;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2) !important;
        }

        #ai-landing-wrapper .tech-card:hover {
            transform: translateY(-5px) !important;
            border-color: var(--accent-glow) !important;
            box-shadow: 0 15px 35px rgba(20, 184, 166, 0.15) !important;
        }

        #ai-landing-wrapper .tech-icon-box {
            width: 70px;
            height: 70px;
            background: rgba(20, 184, 166, 0.1) !important;
            border: 2px solid var(--accent-color) !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 2rem !important;
            margin: 0 auto 20px auto !important;
            box-shadow: 0 0 15px rgba(20, 184, 166, 0.2) !important;
        }

        #ai-landing-wrapper .tech-card-title {
            font-size: 1.25rem !important;
            font-weight: 800 !important;
            color: #ffffff !important;
            margin-bottom: 12px !important;
            text-align: center !important;
        }

        #ai-landing-wrapper .tech-card-desc {
            font-size: 0.95rem !important;
            color: #cbd5e1 !important;
            line-height: 1.7 !important;
            text-align: center !important;
        }

        /* 卡片三內部專屬健康產品連結按鈕與 LiveGood 官方 YT 按鈕 */
        #ai-landing-wrapper .health-link-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-top: 18px;
            padding: 10px 22px;
            border-radius: 50px;
            background: linear-gradient(135deg, #10b981 0%, #0d9488 100%) !important;
            color: #ffffff !important;
            font-weight: 800 !important;
            font-size: 0.9rem !important;
            text-decoration: none !important;
            border: 1px solid #34d399 !important;
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.35) !important;
            transition: all 0.25s ease;
        }

        #ai-landing-wrapper .health-link-btn:hover {
            transform: scale(1.04);
            box-shadow: 0 6px 22px rgba(20, 184, 166, 0.55) !important;
        }

        #ai-landing-wrapper .lg-yt-link-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-top: 10px;
            padding: 10px 22px;
            border-radius: 50px;
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
            color: #ffffff !important;
            font-weight: 800 !important;
            font-size: 0.88rem !important;
            text-decoration: none !important;
            border: 1px solid #f87171 !important;
            box-shadow: 0 4px 15px rgba(239, 68, 68, 0.35) !important;
            transition: all 0.25s ease;
        }

        #ai-landing-wrapper .lg-yt-link-btn:hover {
            transform: scale(1.04);
            box-shadow: 0 6px 22px rgba(239, 68, 68, 0.6) !important;
        }

        /* 高階教材展示與 25% 分潤專區 */
        #ai-landing-wrapper .bonus-revenue-section {
            background: linear-gradient(135deg, rgba(251, 191, 36, 0.05) 0%, rgba(245, 158, 11, 0.12) 100%) !important;
            border: 2px dashed var(--warning-color) !important;
            border-radius: 24px !important;
            padding: 40px 28px !important;
            margin: 40px 0 !important;
            width: 100%;
            text-align: center !important;
            box-shadow: 0 0 25px rgba(251, 191, 36, 0.1) !important;
            display: flex;
            flex-direction: column;
            align-items: center !important;
        }

        #ai-landing-wrapper .bonus-title {
            font-size: 1.75rem !important;
            font-weight: 900 !important;
            color: var(--warning-color) !important;
            margin-bottom: 15px !important;
            text-align: center !important;
        }

        #ai-landing-wrapper .bonus-desc {
            font-size: 1.05rem !important;
            color: #ffffff !important;
            max-width: 720px;
            margin: 0 auto 20px auto !important;
            line-height: 1.8 !important;
            text-align: center !important;
        }

        #ai-landing-wrapper .bonus-highlight {
            color: #38bdf8 !important;
            font-weight: bold;
        }

        #ai-landing-wrapper .course-detail-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 11px 26px;
            border-radius: 50px;
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
            color: #0b0f19 !important;
            font-weight: 900 !important;
            font-size: 0.95rem !important;
            text-decoration: none !important;
            box-shadow: 0 4px 20px rgba(245, 158, 11, 0.4) !important;
            margin-bottom: 15px;
            transition: all 0.25s ease;
        }

        #ai-landing-wrapper .course-detail-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 25px rgba(245, 158, 11, 0.65) !important;
        }

        /* 雙語教材封面展示容器 */
        #ai-landing-wrapper .book-cover-container {
            display: flex !important;
            flex-wrap: wrap !important;
            justify-content: center !important;
            gap: 28px;
            margin: 20px auto 30px auto !important;
            width: 100%;
            max-width: 700px;
        }

        #ai-landing-wrapper .book-card {
            flex: 1 1 280px;
            max-width: 320px;
            background: rgba(15, 23, 42, 0.7) !important;
            padding: 16px;
            border-radius: 16px;
            border: 1px solid rgba(250, 204, 21, 0.3);
            text-align: center !important;
            text-decoration: none !important;
            display: block;
            transition: all 0.3s ease;
        }

        #ai-landing-wrapper .book-card:hover {
            transform: translateY(-4px);
            border-color: var(--warning-color);
            box-shadow: 0 12px 30px rgba(245, 158, 11, 0.25);
        }

        #ai-landing-wrapper .book-img {
            width: 100%;
            height: auto;
            border-radius: 10px;
            box-shadow: 0 15px 30px rgba(0,0,0,0.5);
            transition: transform 0.3s ease;
            border: 1px solid rgba(255,255,255,0.1);
        }

        #ai-landing-wrapper .book-label {
            display: block;
            font-size: 0.95rem;
            font-weight: 700;
            color: #a7f3d0;
            margin-top: 15px;
            text-align: center;
        }

        #ai-landing-wrapper .revenue-share-box {
            background: rgba(22, 29, 48, 0.85) !important;
            padding: 25px;
            border-radius: 16px;
            border: 1px solid rgba(251, 191, 36, 0.3);
            display: inline-block;
            max-width: 680px;
            width: 100%;
            text-align: center !important;
        }

        /* 商業模式對比表格 */
        #ai-landing-wrapper .table-wrap {
            width: 100%;
            overflow-x: auto;
            margin: 30px 0 !important;
        }

        #ai-landing-wrapper table {
            width: 100% !important;
            border-collapse: collapse !important;
            background: var(--card-bg) !important;
            border-radius: 16px !important;
            overflow: hidden !important;
        }

        #ai-landing-wrapper th,
        #ai-landing-wrapper td {
            padding: 16px !important;
            text-align: center !important;
            border-bottom: 1px solid rgba(255,255,255,0.08) !important;
            color: #ffffff !important;
        }

        #ai-landing-wrapper th {
            background-color: rgba(13, 148, 136, 0.3) !important;
            font-weight: 700 !important;
        }

        /* FAQ 區塊 */
        #ai-landing-wrapper .faq-section {
            margin: 40px 0;
            text-align: center !important;
            width: 100%;
        }

        #ai-landing-wrapper .faq-title {
            text-align: center !important;
            font-size: 1.85rem !important;
            font-weight: 800 !important;
            margin-bottom: 30px !important;
            color: #ffffff !important;
            width: 100%;
        }

        #ai-landing-wrapper .faq-item {
            background: var(--card-bg) !important;
            padding: 26px 24px;
            border-radius: 16px;
            margin-bottom: 18px;
            border: 1px solid rgba(255,255,255,0.08) !important;
            text-align: center !important;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center !important;
        }

        #ai-landing-wrapper .faq-q {
            font-weight: 700 !important;
            font-size: 1.15rem !important;
            color: var(--accent-glow) !important;
            margin-bottom: 12px !important;
            text-align: center !important;
            width: 100%;
        }

        #ai-landing-wrapper .faq-a {
            color: #e2e8f0 !important;
            font-size: 0.95rem !important;
            text-align: center !important;
            max-width: 700px;
            margin: 0 auto !important;
            width: 100%;
        }

        /* 底部成交區 */
        #ai-landing-wrapper .closing-section {
            background: linear-gradient(135deg, rgba(22, 29, 48, 0.9) 0%, rgba(13, 148, 136, 0.15) 100%) !important;
            border: 1px solid var(--accent-color) !important;
            border-radius: 32px;
            padding: 50px 30px;
            text-align: center !important;
            margin: 40px 0 20px 0;
            backdrop-filter: blur(10px);
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center !important;
        }

        #ai-landing-wrapper .closing-title {
            color: #ffffff !important;
            font-size: 2rem !important;
            font-weight: 900 !important;
            margin-bottom: 20px !important;
            text-align: center !important;
        }

        #ai-landing-wrapper .cta-btn {
            display: inline-block;
            background: linear-gradient(135deg, #0d9488 0%, #0284c7 100%) !important;
            color: #ffffff !important;
            padding: 18px 40px !important;
            font-size: 1.2rem !important;
            font-weight: 900 !important;
            text-decoration: none !important;
            border-radius: 50px !important;
            box-shadow: 0 0 30px rgba(20, 184, 166, 0.6) !important;
            transition: all 0.3s ease;
            margin: 25px auto 10px auto !important;
            letter-spacing: 1px !important;
            border: 1.5px solid #2dd4bf !important;
            cursor: pointer;
            text-align: center !important;
        }

        #ai-landing-wrapper .cta-btn:hover {
            transform: scale(1.04) !important;
            box-shadow: 0 0 40px var(--accent-glow) !important;
        }

        #ai-landing-wrapper footer {
            text-align: center !important;
            padding: 30px 0 10px 0;
            color: #94a3b8 !important;
            border-top: 1px solid rgba(255,255,255,0.08) !important;
            font-size: 13px !important;
            width: 100%;
        }

        #ai-landing-wrapper .lang-zh,
        #ai-landing-wrapper .lang-en {
            display: none;
        }

        @media (max-width: 768px) {
            #ai-landing-wrapper h1 { font-size: 1.85rem !important; }
            #ai-landing-wrapper .pain-cards-container {
                grid-template-columns: 1fr !important;
                gap: 15px !important;
            }
            #ai-landing-wrapper .tech-grid {
                grid-template-columns: 1fr !important;
                gap: 20px !important;
            }
            #ai-landing-wrapper .stats-grid { 
                flex-direction: column !important; 
                align-items: center !important; 
            }
            #ai-landing-wrapper .stat-card {
                width: 100% !important;
                max-width: 280px !important;
            }
            #ai-landing-wrapper .book-cover-container {
                flex-direction: column !important;
                align-items: center !important;
            }
            #ai-landing-wrapper .bonus-revenue-section { padding: 28px 18px !important; }
            #ai-landing-wrapper .bonus-title { font-size: 1.35rem !important; }
            #ai-landing-wrapper th, #ai-landing-wrapper td { padding: 10px !important; font-size: 13px !important; }
            #ai-landing-wrapper .cta-btn {
                padding: 15px 24px !important;
                font-size: 1rem !important;
                width: 100%;
            }
        }
    </style>

    <!-- 頂部品牌與主站 6 國語系同步選單 -->
    <div class="top-lang-bar">
        <div style="color: #14b8a6; font-weight: 900; font-size: 14px; letter-spacing: 0.5px;">
            🚀 AI 365-DAY FREE LEAD ENGINE · $600 FRANCHISE
        </div>
        <div class="lang-select-pill">
            <span style="font-size: 13px;">🌐</span>
            <select id="free365LangSelect" class="lang-select-el" aria-label="Select Language">
                <option value="zh-TW">繁體中文</option>
                <option value="zh-CN">简体中文</option>
                <option value="en-US">English</option>
                <option value="ja-JP">日本語</option>
                <option value="ko-KR">한국어</option>
                <option value="vi-VN">Tiếng Việt</option>
            </select>
        </div>
    </div>

    <header class="container">
        <span class="badge lang-zh" id="f365-badge-zh">🚀 全球獨家！限額席次・AI變現革命</span>
        <span class="badge lang-en" id="f365-badge-en">🚀 EXCLUSIVE! Limited Nodes・AI Monetization</span>
        
        <h1 class="lang-zh" id="f365-h1-zh">別再像奴隸般推銷！<br>「AI尋客365天攏免錢」全球網購連鎖店計劃</h1>
        <h1 class="lang-en" id="f365-h1-en">Stop Selling Like a Slave!<br>「AI Get Clients 365 Days Free」Global E-Store</h1>
        
        <p class="intro-lead lang-zh">我們整合了全球最火爆的 <strong>LiveGood 訂閱制電商</strong> 與 <strong>20年架構師自主研發的 AI 自來客系統</strong>。您不需要發傳單、不需要煩朋友，更不需要重消囤貨——讓 365 天自動化流量為您在全世界收單！</p>
        <p class="intro-lead lang-en">We integrate <strong>LiveGood's subscription system</strong> with our <strong>20-year architect custom-built AI engine</strong>. No spamming friends, no auto-ships. Let the hands-free traffic capture global members for you!</p>
        
        <div class="price-tag" style="border: 2px solid var(--accent-color); padding: 25px 40px; border-radius: 20px; display: inline-block; background-color: rgba(13, 148, 136, 0.1);">
            <div class="lang-zh" style="font-size: 14px; color: #cbd5e1; margin-bottom: 8px;">一次性加盟技術費（終身鎖定系統權益）</div>
            <div class="lang-en" style="font-size: 14px; color: #cbd5e1; margin-bottom: 8px;">One-Time Franchise & Tech Fee</div>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--accent-glow);">NT$ 18,000 / $600 USD</div>
        </div>
    </header>

    <section class="container">
        <div class="pain-section">
            <h2 class="pain-title lang-zh">🛑 揭穿傳統直銷與微商的「三大致命黑幕」</h2>
            <h2 class="pain-title lang-en">🛑 The 3 Fatal Traps of Traditional Network Marketing</h2>
            
            <div class="pain-cards-container">
                <div class="pain-card">
                    <div class="pain-card-icon">💸</div>
                    <h3 class="pain-card-title lang-zh">瘋狂溢價的暴利產品</h3>
                    <h3 class="pain-card-title lang-en">10x Markups</h3>
                    <p class="pain-card-desc lang-zh">把成本 3 美元的保健品包裝成 80 美元賣給親友，透支人際信用，良心不安。</p>
                    <p class="pain-card-desc lang-en">Forcing you to sell extremely overpriced products to friends and family, ruining your reputation.</p>
                </div>
                
                <div class="pain-card">
                    <div class="pain-card-icon">📦</div>
                    <h3 class="pain-card-title lang-zh">強迫重消與囤貨壓力</h3>
                    <h3 class="pain-card-title lang-en">Forced Auto-ships</h3>
                    <p class="pain-card-desc lang-zh">每個月不買就取消佣金資格，家裡堆滿吃不完的保健品，還沒賺錢先負債。</p>
                    <p class="pain-card-desc lang-en">Forced to purchase expensive inventory monthly to maintain eligibility, leading to heavy debts.</p>
                </div>
                
                <div class="pain-card">
                    <div class="pain-card-icon">❌</div>
                    <h3 class="pain-card-title lang-zh">人脈與客源極限枯竭</h3>
                    <h3 class="pain-card-title lang-en">Running Out of Leads</h3>
                    <p class="pain-card-desc lang-zh">身邊的人問完後再無新客，淪落到天天狂發朋友圈、騷擾陌生人，越做越累。</p>
                    <p class="pain-card-desc lang-en">Exhausted your warm lead list? Stuck spamming social feeds daily with zero target conversions.</p>
                </div>
            </div>
        </div>
    </section>

    <section class="container video-section">
        <h2 class="section-title lang-zh">📊 用真實數據說話！拒絕造假虛無承諾</h2>
        <h2 class="section-title lang-en">📊 Real Data Speaks Louder Than Words!</h2>
        
        <p class="lang-zh" style="color: var(--text-muted); margin-bottom: 10px;">看看我們的「AI免錢自來客系統」如何在一週內用 0 元廣告預算引爆全網：</p>
        <p class="lang-en" style="color: var(--text-muted); margin-bottom: 10px;">See how our "Free AI Client Capture System" detonated social networks in just 7 days with zero ad budget:</p>

        <div class="video-wrapper">
            <div class="video-ratio">
                <iframe src="https://www.youtube.com/embed/4bZTwegmcJM?autoplay=1&mute=1&loop=1&playlist=4bZTwegmcJM" title="AI尋客實戰效益影片" allowfullscreen></iframe>
            </div>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-num lang-zh">10,000+ 次</div>
                <div class="stat-num lang-en">10,000+</div>
                <div class="stat-label lang-zh">YouTube 全球曝光點閱</div>
                <div class="stat-label lang-en">YouTube Global Views</div>
            </div>
            <div class="stat-card">
                <div class="stat-num lang-zh">20 倍</div>
                <div class="stat-num lang-en">20x</div>
                <div class="stat-label lang-zh">AI流量裂變成長</div>
                <div class="stat-label lang-en">Global Team Traffic Growth</div>
            </div>
            <div class="stat-card">
                <div class="stat-num lang-zh">24 / 7</div>
                <div class="stat-num lang-en">24 / 7</div>
                <div class="stat-label lang-zh">全球八大社群全自動接單</div>
                <div class="stat-label lang-en">Multi-Platform Auto Sync</div>
            </div>
        </div>
    </section>

    <section class="container tech-grid-section">
        <h2 class="section-title lang-zh">🔥 600美元 加盟方案：四大神級科技與權益圖列</h2>
        <h2 class="section-title lang-en">🔥 $600 USD Package: 4 Core Pillars Illustrated</h2>
        
        <div class="tech-grid">
            <div class="tech-card">
                <div>
                    <div class="tech-icon-box">🤖</div>
                    <h3 class="tech-card-title lang-zh">一、免錢・多語系 AI 自來客系統</h3>
                    <h3 class="tech-card-title lang-en">I. 365-Day Multilingual AI Traffic</h3>
                    <p class="tech-card-desc lang-zh">系統全自動鎖定全球熱搜關鍵詞，<strong>365天無休為您自動撰寫中/英/日/越等多語系爆款文案、自動跨平台精準發帖，並聯動轉送全球八大社群</strong>，讓精準被動客源不間斷自來！</p>
                    <p class="tech-card-desc lang-en">AI targeted copywriting, programmatic auto-posting, and multi-platform cross-syndication running 365 days hands-free to secure endless international traffic nodes.</p>
                </div>
            </div>

            <div class="tech-card">
                <div>
                    <div class="tech-icon-box">🎬</div>
                    <h3 class="tech-card-title lang-zh">二、教您免錢・多語系視頻客製法</h3>
                    <h3 class="tech-card-title lang-en">II. Multilingual Video Customization Course</h3>
                    <p class="tech-card-desc lang-zh">獨家隨系統<strong>傳授「免錢-多語系短影音客製複製法」</strong>！教您如何零成本將同一部影片一鍵繁衍出多國語音、多語字幕版（TikTok/Reels/Shorts），輕鬆在全球流量池霸屏！</p>
                    <p class="tech-card-desc lang-en">Master our custom method to generate free multilingual short videos with synthetic local voiceovers and dual subtitles. Replicate global short video dominance effortlessly.</p>
                </div>
            </div>

            <!-- 修改項目 1：第三張卡片「三、送『全球AI健康』實體產品」內嵌連結至 https://aitutor.vip/po009 的按鈕 + 下方 LiveGood 官方 YouTube 頻道按鈕 -->
            <div class="tech-card">
                <div>
                    <div class="tech-icon-box">🎁</div>
                    <h3 class="tech-card-title lang-zh">三、送「全球AI健康」實體產品</h3>
                    <h3 class="tech-card-title lang-en">III. Complimentary Product Gift</h3>
                    <p class="tech-card-desc lang-zh">立即免費贈送您一套 LiveGood 原廠生產的頂級營養體驗包。無任何重消壓力，帶您體驗「破壞式定價」帶來的極致高品質競爭力！</p>
                    <p class="tech-card-desc lang-en">Receive a complimentary physical wellness set directly from LiveGood. No forced auto-ships, experience the extreme cost-to-quality advantage first-hand.</p>
                </div>
                <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">
                    <a href="https://aitutor.vip/po009" target="_blank" rel="noopener noreferrer" class="health-link-btn lang-zh">
                        🌿 參觀「全球AI健康」官方產品與制度 ↗
                    </a>
                    <a href="https://aitutor.vip/po009" target="_blank" rel="noopener noreferrer" class="health-link-btn lang-en">
                        🌿 Explore Global AI Wellness Products ↗
                    </a>
                    <a href="https://www.youtube.com/@livegoodsupplements" target="_blank" rel="noopener noreferrer" class="lg-yt-link-btn lang-zh">
                        ▶️ 前往 LiveGood 官方 YouTube 頻道（產品與制度介紹） ↗
                    </a>
                    <a href="https://www.youtube.com/@livegoodsupplements" target="_blank" rel="noopener noreferrer" class="lg-yt-link-btn lang-en">
                        ▶️ Visit LiveGood Official YouTube Channel ↗
                    </a>
                </div>
            </div>

            <div class="tech-card">
                <div>
                    <div class="tech-icon-box">💰</div>
                    <h3 class="tech-card-title lang-zh">四、一整年份會員訂閱分潤</h3>
                    <h3 class="tech-card-title lang-en">IV. 365-Day Subscription Payouts</h3>
                    <p class="tech-card-desc lang-zh">完美對接全球最火熱的 LiveGood 會員訂閱制系統。長達一整年（365天）自動為您綁定流量、追蹤分潤。所有的快速啟動、零售及矩陣滑落收益全歸您！</p>
                    <p class="tech-card-desc lang-en">Fully connected with LiveGood. Secures a 365-day tracking cookie for your traffic to continuously generate Fast Start, retail, and matrix spillover pools.</p>
                </div>
            </div>
        </div>
    </section>

    <section class="container">
        <div class="bonus-revenue-section">
            <!-- 修改項目 2：金額原 $168 改為 $198，並連結至「AI頂配教材」說明頁 (可外連) -->
            <h2 class="bonus-title lang-zh">💎 重磅加盟特權：贈送高階 AI 實戰教材 (價值 $198 美元)</h2>
            <h2 class="bonus-title lang-en">💎 Super Bonus: High-End AI Course Included (Value $198 USD)</h2>
            
            <p class="bonus-desc lang-zh">
                好消息！現在加入，我們將免費為您開通 1 套<span class="bonus-highlight">官方對外單獨販售 198 美元</span>的頂級高階 AI 實戰教材（含雙枚微享 NFT 360 天系統賦能）。這套教材包含完整的中英雙語版本，能完美幫助您打通跨國流量脈絡！
            </p>
            <p class="bonus-desc lang-en">
                Get full access to our premium High-End AI practical course <span class="bonus-highlight">(Retail Price: $198 USD)</span> for free! This comprehensive guide comes with localized multi-language tracks to secure global traffic nodes.
            </p>

            <div>
                <a href="https://nft1314.party/#tutor-courses" target="_blank" rel="noopener noreferrer" class="course-detail-btn lang-zh">
                    🎓 點擊查看「AI頂配教材 ($198)」完整說明專區 ↗
                </a>
                <a href="https://nft1314.party/#tutor-courses" target="_blank" rel="noopener noreferrer" class="course-detail-btn lang-en">
                    🎓 View "AI Master Course ($198)" Full Details ↗
                </a>
            </div>
            
            <div class="book-cover-container">
                <a href="https://nft1314.party/#tutor-courses" target="_blank" rel="noopener noreferrer" class="book-card">
                    <img src="https://1.5208.uk/5208.jpg" class="book-img" alt="AI自來客教材 中文版封面">
                    <span class="book-label">📘 AI自來客頂配教材 (繁體中文版) <br><b style="color:var(--warning-color);">官方售價: $198 USD（點擊查看說明 ↗）</b></span>
                </a>
                <a href="https://nft1314.party/#tutor-courses" target="_blank" rel="noopener noreferrer" class="book-card">
                    <img src="https://1.5208.uk/5208en.jpg" class="book-img" alt="AI Get Clients Course English Cover">
                    <span class="book-label">📕 AI Traffic Machine (English Version) <br><b style="color:var(--warning-color);">Retail Price: $198 USD (View Details ↗)</b></span>
                </a>
            </div>
            
            <!-- 修改項目 3：授權全球推廣改為 25% (原 50% 取消)，金額同步為 $198 -->
            <div class="revenue-share-box">
                <p class="lang-zh" style="font-size: 1.35rem; font-weight: 900; color: var(--warning-color); margin-bottom: 8px;">🤖 授權 AI 系統為您工作・享最高 25% 聯盟推廣分潤！</p>
                <p class="lang-en" style="font-size: 1.2rem; font-weight: 900; color: var(--warning-color); margin-bottom: 8px;">🤖 Deploy AI Cluster to Work 24/7・Earn Up to 25% Affiliate Commission!</p>
                
                <p class="lang-zh" style="font-size: 0.95rem; color: #cbd5e1; line-height: 1.7;">更狂的是：您可以直接授權「AI自來客系統」全天候代替您去推廣、發帖這套 <span class="bonus-highlight">販售 198 美元</span> 的 AI 頂配教材。所有由系統自動化引流、自動洽談並成功成交的教材訂單，<strong>享有高達 25% 的聯盟推廣分潤（10% 無限代級差 ＋ 10% 對等匹配 ＋ 5% 全球領袖分紅）全數撥入您的帳戶</strong>！真正實現零操作賺取全球被動美金！</p>
                <p class="lang-en" style="font-size: 0.95rem; color: #cbd5e1; line-height: 1.7;">Let our automated AI infrastructure promote this $198 USD AI Master Course for you. Every sales order generated by the system codes to your account, rewarding you with up to 25% affiliate commissions (10% Differential + 10% Matching + 5% Global Pool) hands-free!</p>
            </div>
        </div>
    </section>

    <section class="container">
        <h2 class="section-title lang-zh">🥊 商業模式大對決：誰能幫你真正賺到錢？</h2>
        <h2 class="section-title lang-en">🥊 Why We Easily Beat Traditional Systems</h2>
        
        <div class="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th class="lang-zh">項目</th>
                        <th class="lang-en">Features</th>
                        <th class="lang-zh">傳統直銷/微商</th>
                        <th class="lang-en">Traditional MLM</th>
                        <th class="lang-zh" style="color: var(--accent-glow);">我們 (AI尋客+LiveGood)</th>
                        <th class="lang-en" style="color: var(--accent-glow);">Our System</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="lang-zh">每月重消壓力</td>
                        <td class="lang-en">Auto-ships</td>
                        <td class="lang-zh">強制每月購買數千元囤貨</td>
                        <td class="lang-en">Mandatory ($100-$200/mo)</td>
                        <td class="lang-zh" style="font-weight: bold; color: var(--accent-glow);">免囤貨、無任何強制消費</td>
                        <td class="lang-en" style="font-weight: bold; color: var(--accent-glow);">Zero Forced Quotas</td>
                    </tr>
                    <tr>
                        <td class="lang-zh">客源開發模式</td>
                        <td class="lang-en">Lead Gen</td>
                        <td class="lang-zh">列名單、騷擾親友</td>
                        <td class="lang-en">Cold calling & spamming friends</td>
                        <td class="lang-zh" style="font-weight: bold; color: var(--accent-glow);">AI八大社群多語系全自動引流</td>
                        <td class="lang-en" style="font-weight: bold; color: var(--accent-glow);">AI-Powered Multilingual SEO Funnel</td>
                    </tr>
                    <tr>
                        <td class="lang-zh">產品價格優勢</td>
                        <td class="lang-en">Product Price</td>
                        <td class="lang-zh">5-10倍嚴重溢價</td>
                        <td class="lang-en">Bloated, 5x-10x retail markups</td>
                        <td class="lang-zh" style="font-weight: bold; color: var(--accent-glow);">原廠平價（比市價便宜50-80%）</td>
                        <td class="lang-en" style="font-weight: bold; color: var(--accent-glow);">Factory Direct (Save up to 80%)</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>

    <section class="container faq-section">
        <h2 class="faq-title lang-zh">💬 關於 18,000台幣（600美元）方案，你想問的都在這：</h2>
        <h2 class="faq-title lang-en">💬 Frequently Asked Questions (FAQ):</h2>
        
        <div class="faq-item">
            <div class="faq-q lang-zh">Q1：除了加盟的 18,000台幣，後面還有其他隱藏系統費嗎？</div>
            <div class="faq-q lang-en">Q1: Are there any hidden fees after paying the $600 USD?</div>
            <div class="faq-a lang-zh">完全沒有！一次性投入，即可擁有長達一整年（365天）由20年經驗架構師維護的「AI多語系文案自動生成、全渠道定時發帖、多平台社群轉送聯動」完整系統服務。</div>
            <div class="faq-a lang-en">None! The tech fee secures your 12-month license to the AI Client Capture machine including 365-day automated copy generation, scheduled posting, and social syndication.</div>
        </div>

        <!-- 修改項目 3：Q2 問答同步改為 25% 與 $198 美元 -->
        <div class="faq-item">
            <div class="faq-q lang-zh">Q2：我不會剪片、不懂其他國家語言，加碼的「25%教材分潤」要怎麼拿到？</div>
            <div class="faq-q lang-en">Q2: I don't know AI or foreign languages. How can I get the 25% course commission?</div>
            <div class="faq-a lang-zh">這正是本系統最狂的價值！您完全不需要自己去賣教材，我們會直接幫您把專屬分潤代碼設定進後台。AI 自來客系統會全自動化在全網多語系發帖引流並成交這套<strong>販售 198 美元</strong>的 AI頂配教材，<strong>而您什麼都不用做，直接享有每筆自動訂單高達 25% 的聯盟推廣分潤（10% 級差 + 10% 對等 + 5% 全球領袖分紅）</strong>！</div>
            <div class="faq-a lang-en">You don't need to sell anything manually. Our AI system handles the copy, targeting, posting, and closing internationally for the $198 USD AI Master Course. You simply lock your positioning and sit back to enjoy up to 25% automated affiliate commissions (10% Differential + 10% Matching + 5% Global Pool)!</div>
        </div>

        <div class="faq-item">
            <div class="faq-q lang-zh">Q3：LiveGood 的矩陣公排是怎麼回事？我真的能「躺平」分潤嗎？</div>
            <div class="faq-q lang-en">Q3: How does the Matrix spillover work? Is passive income real?</div>
            <div class="faq-a lang-zh">LiveGood 採取全球雙軌強排滑落機制。當您加入我們的 AI 變現商隊，由於我們龐大的 AI 系統不間斷在引進新會員，後續進來的人會被自動滑落並安置在您的組織下方。即使您一個人都沒有推薦，組織下方的訂閱人數累積起來後，依然有機會享受每月最高 $2047.50 美元的滑落被動收益。</div>
            <div class="faq-a lang-en">LiveGood uses a global forced-matrix algorithm. Because our AI cluster perpetually feeds new accounts into the system, they naturally spill over beneath active nodes. Qualified matrixes can yield up to $2,047.50/mo even with no personal recruiting.</div>
        </div>
    </section>

    <section class="container">
        <div class="closing-section">
            <h2 class="closing-title lang-zh">🚀 現在就加入，讓 AI 為你工作！</h2>
            <h2 class="closing-title lang-en">🚀 Join the Revolution, Let AI Work For You!</h2>
            
            <p class="lang-zh" style="color: #cbd5e1; font-size: 1.1rem; max-width: 700px; margin: 0 auto 15px;">不要再用體力與親友的信任去換取微薄的直銷佣金。科技已經改變了商業規則。這是一次將 20 年架構技術與全球破壞式電商完美結合的機會。</p>
            <p class="lang-en" style="color: #cbd5e1; font-size: 1.1rem; max-width: 700px; margin: 0 auto 15px;">Stop burning your social capital for overpriced MLM margins. The game has changed. Combine 20 years of technical architecture with the world's fastest-growing subscription platform.</p>
            
            <p class="lang-zh" style="color: var(--warning-color); font-weight: 700; margin-top: 15px;">🔥 全球高流量節點限量釋出，越早鎖定位置，上方滑落的客群越多！</p>
            <p class="lang-en" style="color: var(--warning-color); font-weight: 700; margin-top: 15px;">🔥 Traffic positions are assigned chronologically. Lock your spot now to benefit from immediate spillover!</p>

            <!-- 修改項目 4：取消原雙排按鈕，改為單一隨語系切換的「🤝 立即預約總工程師・專人協辦本方案 ($600 全包辦)」直達下方接洽中心 -->
            <a href="#shoppable-contact-hub" class="cta-btn lang-zh">🤝 立即預約總工程師・專人協辦本方案 ($600 全包辦) 👇</a>
            <a href="#shoppable-contact-hub" class="cta-btn lang-en">🤝 Book 1-on-1 Concierge Setup ($600 All-Inclusive) 👇</a>
        </div>
    </section>

    <footer>
        <div class="container">
            <p>© 1996-2026 廿年AI程式設計團隊 & AI變現商隊 版權所有.</p>
            <p style="margin-top: 10px; color: #94a3b8; font-size: 12px;">免責聲明：本系統所提及之任何數據、矩陣收益皆來自實戰數據與 LiveGood 官方分酬制度，實際分潤多寡會因全球市場訂閱人數及系統加入時機而有所差異。</p>
            <p style="margin-top: 5px; color: #94a3b8; font-size: 12px;">技術聯絡信箱：xyz007tw@gmail.com</p>
        </div>
    </footer>
</div>

<script>
(function() {
    const root = document.getElementById('ai-landing-wrapper');
    if (!root) return;

    const heroLocaleMap = {
        'zh-TW': {
            badge: "🚀 全球獨家！限額席次・AI變現革命",
            h1: "別再像奴隸般推銷！<br>「AI尋客365天攏免錢」全球網購連鎖店計劃"
        },
        'zh-CN': {
            badge: "🚀 全球独家！限额席次・AI变现革命",
            h1: "别再像奴隶般推销！<br>「AI寻客365天全免费」全球网购连锁店计划"
        },
        'en-US': {
            badge: "🚀 EXCLUSIVE! Limited Nodes・AI Monetization",
            h1: "Stop Selling Like a Slave!<br>「AI Get Clients 365 Days Free」Global E-Store"
        },
        'ja-JP': {
            badge: "🚀 世界独占！限定枠・AI収益化革命",
            h1: "もう売り込みは不要！<br>「AI集客365日完全無料」グローバルECチェーン計画"
        },
        'ko-KR': {
            badge: "🚀 글로벌 독점! 한정석 · AI 수익화 혁명",
            h1: "더 이상 힘들게 영업하지 마세요!<br>「AI 365일 무료 모객」 글로벌 쇼핑몰 체인 플랜"
        },
        'vi-VN': {
            badge: "🚀 ĐỘC QUYỀN TOÀN CẦU! Cách Mạng Kiếm Tiền AI",
            h1: "Đừng Bán Hàng Như Nô Lệ Nữa!<br>Kế Hoạch Chuỗi Cửa Hàng 「AI Tìm Khách 365 Ngày Miễn Phí」"
        }
    };

    function getGlobalLocale() {
        return window.__WEIXIANG_LANG__ || localStorage.getItem('lang') || document.documentElement.lang || 'zh-TW';
    }

    function applyFree365Lang(localeCode) {
        const code = localeCode || 'zh-TW';
        const isZh = String(code).toLowerCase().includes('zh');

        root.querySelectorAll('.lang-zh').forEach(function(el) {
            el.style.setProperty('display', 'none', 'important');
        });
        root.querySelectorAll('.lang-en').forEach(function(el) {
            el.style.setProperty('display', 'none', 'important');
        });

        const targetClass = isZh ? '.lang-zh' : '.lang-en';
        root.querySelectorAll(targetClass).forEach(function(el) {
            if (el.tagName === 'TD' || el.tagName === 'TH') {
                el.style.setProperty('display', 'table-cell', 'important');
            } else if (el.classList.contains('cta-btn') || el.classList.contains('health-link-btn') || el.classList.contains('lg-yt-link-btn') || el.classList.contains('course-detail-btn') || el.classList.contains('badge')) {
                el.style.setProperty('display', 'inline-flex', 'important');
            } else {
                el.style.setProperty('display', 'block', 'important');
            }
        });

        const hInfo = heroLocaleMap[code];
        if (hInfo) {
            if (isZh) {
                const bZh = document.getElementById('f365-badge-zh');
                const hZh = document.getElementById('f365-h1-zh');
                if (bZh) bZh.textContent = hInfo.badge;
                if (hZh) hZh.innerHTML = hInfo.h1;
            } else {
                const bEn = document.getElementById('f365-badge-en');
                const hEn = document.getElementById('f365-h1-en');
                if (bEn) bEn.textContent = hInfo.badge;
                if (hEn) hEn.innerHTML = hInfo.h1;
            }
        }

        const sel = document.getElementById('free365LangSelect');
        if (sel && sel.value !== code) {
            sel.value = code;
        }
    }

    setTimeout(function() {
        applyFree365Lang(getGlobalLocale());

        const sel = document.getElementById('free365LangSelect');
        if (sel) {
            sel.onchange = function(e) {
                const chosen = e.target.value;
                applyFree365Lang(chosen);
                window.dispatchEvent(new CustomEvent('weixiang-select-lang', { detail: { lang: chosen } }));
            };
        }

        window.addEventListener('weixiang-lang-change', function(e) {
            if (e && e.detail && e.detail.lang) {
                applyFree365Lang(e.detail.lang);
            }
        });
    }, 60);
})();
</script>
<!-- === 客製與協辦 03：AI尋客365天攏免錢結束 === -->`;
