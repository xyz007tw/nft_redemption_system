export const LIVEGOOD_PROMO_HTML = `<!-- === AI 點子變現商隊 - LiveGood 會員訂閱與 AI 自動化協播 (保留原 HTML 架構・升級雙方案 $139.95 / $180・內嵌 6 國語系註冊流程指南) === -->
<div id="livegood-wrapper" style="width: 100%; font-family: 'Microsoft JhengHei', 'Segoe UI', sans-serif; color: #334155;">
    <style>
        #livegood-wrapper * {
            box-sizing: border-box;
        }
        #livegood-wrapper .lg-top-bar {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            background: #0f172a;
            padding: 12px 20px;
            border-radius: 14px 14px 0 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.15);
            max-width: 800px;
            margin: 0 auto;
        }
        #livegood-wrapper .lg-lang-select-box {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: rgba(14, 165, 233, 0.15);
            border: 1.5px solid #0ea5e9;
            padding: 6px 14px;
            border-radius: 50px;
        }
        #livegood-wrapper .lg-lang-select {
            background: transparent;
            color: #38bdf8;
            border: none;
            font-weight: 800;
            font-size: 13px;
            cursor: pointer;
            outline: none;
        }
        #livegood-wrapper .lg-lang-select option {
            background: #0f172a;
            color: #f8fafc;
        }

        /* 作品集輪播樣式 */
        #livegood-wrapper .carousel-container {
            position: relative;
            width: 100%;
            overflow: hidden;
            border-radius: 12px;
            background: #0f172a;
            padding: 20px 10px;
            margin: 25px 0;
        }

        #livegood-wrapper .carousel-track {
            display: flex;
            transition: transform 0.5s ease-in-out;
            gap: 16px;
        }

        #livegood-wrapper .carousel-card {
            min-width: 260px;
            flex: 0 0 calc(50% - 8px);
            background: #1e293b;
            border-radius: 10px;
            border: 1px solid #334155;
            padding: 16px;
            color: #fff;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        #livegood-wrapper .carousel-card-img {
            width: 100%;
            height: 120px;
            background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            margin-bottom: 12px;
        }

        #livegood-wrapper .carousel-btn {
            display: inline-block;
            background: #0ea5e9;
            color: #ffffff !important;
            text-align: center;
            padding: 8px 16px;
            border-radius: 6px;
            text-decoration: none !important;
            font-size: 13px;
            font-weight: bold;
            margin-top: 12px;
            transition: background 0.2s;
        }

        #livegood-wrapper .carousel-btn:hover {
            background: #0284c7;
        }

        #livegood-wrapper .carousel-nav-btn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(14, 165, 233, 0.85);
            color: white;
            border: none;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            cursor: pointer;
            z-index: 10;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            font-weight: bold;
        }

        #livegood-wrapper .carousel-nav-btn.prev { left: 10px; }
        #livegood-wrapper .carousel-nav-btn.next { right: 10px; }

        @media (max-width: 768px) {
            #livegood-wrapper .carousel-card {
                flex: 0 0 100%;
                min-width: 100%;
            }
        }

        /* 註冊指南獨立彈窗/內嵌樣式 (完全保留第二份 HTML 視覺設計) */
        #lg-guide-modal {
            display: none;
            position: fixed;
            inset: 0;
            z-index: 99999;
            background: rgba(15, 23, 42, 0.85);
            backdrop-filter: blur(8px);
            overflow-y: auto;
            padding: 20px 12px;
        }
        #lg-guide-modal.open {
            display: block;
        }
        #lg-guide-inner {
            max-width: 1050px;
            margin: 0 auto;
            background: linear-gradient(135deg, #F5F5F5 0%, #E8F5E9 100%);
            color: #333333;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 25px 70px rgba(0, 0, 0, 0.55);
            border: 3px solid #2C5F2D;
            position: relative;
        }
        #lg-guide-inner .guide-top-bar {
            background: #1E2761;
            padding: 12px 20px;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            border-bottom: 2px solid #97BC62;
        }
        #lg-guide-inner .guide-close-btn {
            background: #e11d48;
            color: #ffffff;
            border: none;
            padding: 8px 18px;
            border-radius: 30px;
            font-weight: 800;
            font-size: 13px;
            cursor: pointer;
        }
        #lg-guide-inner .guide-header {
            background: linear-gradient(135deg, #2C5F2D 0%, #1E2761 100%);
            color: #FFFFFF;
            padding: 45px 20px 40px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        #lg-guide-inner .guide-h1 {
            font-size: clamp(1.6rem, 4vw, 2.6rem);
            font-weight: 900;
            margin-bottom: 10px;
            color: #FFFFFF;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }
        #lg-guide-inner .guide-subtitle {
            font-size: clamp(1rem, 2vw, 1.3rem);
            color: #F9E795;
            font-weight: 600;
        }
        #lg-guide-inner .guide-container {
            max-width: 960px;
            margin: 0 auto;
            padding: 30px 20px;
        }
        #lg-guide-inner .step-card {
            background: #FFFFFF;
            border-radius: 20px;
            padding: 30px;
            margin-bottom: 24px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            display: flex;
            gap: 24px;
            align-items: flex-start;
            position: relative;
            overflow: hidden;
            transition: transform 0.3s ease;
        }
        #lg-guide-inner .step-card:hover {
            transform: translateY(-3px);
        }
        #lg-guide-inner .step-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 5px;
            height: 100%;
            background: linear-gradient(180deg, #97BC62 0%, #2C5F2D 100%);
        }
        #lg-guide-inner .step-number {
            flex-shrink: 0;
            width: 68px;
            height: 68px;
            background: linear-gradient(135deg, #97BC62 0%, #2C5F2D 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.7rem;
            font-weight: 900;
            color: #FFFFFF;
            box-shadow: 0 5px 20px rgba(44, 95, 45, 0.3);
        }
        #lg-guide-inner .step-content {
            flex: 1;
        }
        #lg-guide-inner .step-title {
            font-size: 1.45rem;
            font-weight: 900;
            color: #1E2761;
            margin-bottom: 10px;
        }
        #lg-guide-inner .step-description {
            font-size: 1.02rem;
            color: #333333;
            line-height: 1.75;
            white-space: pre-line;
        }
        #lg-guide-inner .warning {
            background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%);
            border-left: 5px solid #FF6F00;
            padding: 15px;
            border-radius: 10px;
            margin-top: 12px;
            font-weight: 700;
            color: #9a3412;
        }
        #lg-guide-inner .success-card {
            background: linear-gradient(135deg, #2C5F2D 0%, #1E2761 100%) !important;
            color: #FFFFFF !important;
        }
        #lg-guide-inner .success-card .step-title {
            color: #F9E795 !important;
        }
        #lg-guide-inner .success-card .step-description {
            color: #FFFFFF !important;
        }
        #lg-guide-inner .website-links {
            background: rgba(255, 255, 255, 0.2);
            padding: 16px;
            border-radius: 15px;
            margin-top: 16px;
        }
        #lg-guide-inner .website-links a {
            color: #F9E795 !important;
            text-decoration: underline;
            font-weight: 700;
        }
        #lg-guide-inner .guide-footer {
            background: #1E2761;
            color: #FFFFFF;
            text-align: center;
            padding: 22px 20px;
        }
        @media (max-width: 768px) {
            #lg-guide-inner .step-card {
                flex-direction: column;
                padding: 22px 18px;
            }
        }
    </style>

    <!-- 頂部主站 6 國語系同步切換列 -->
    <div class="lg-top-bar">
        <div style="color: #38bdf8; font-weight: 900; font-size: 14px; letter-spacing: 0.5px;">
            ⚡ LIVEGOOD × AI CO-BROADCASTING SQUAD
        </div>
        <div class="lg-lang-select-box">
            <span style="font-size: 13px;">🌐</span>
            <select id="lgMainLangSelect" class="lg-lang-select" aria-label="Select Language">
                <option value="zh-TW">繁體中文</option>
                <option value="zh-CN">简体中文</option>
                <option value="en-US">English</option>
                <option value="ja-JP">日本語</option>
                <option value="ko-KR">한국어</option>
                <option value="vi-VN">Tiếng Việt</option>
            </select>
        </div>
    </div>

    <!-- ================= 中文版內容 ================= -->
    <div id="lg-content-zh" style="display: block;">
        <div style="width: 100%; max-width: 800px; margin: 0 auto; background-color: #ffffff; color: #000000; font-family: 'Microsoft JhengHei', sans-serif; border: 1px solid #dddddd; border-radius: 0 0 14px 14px; padding: 0px; box-sizing: border-box;">

            <div style="background-color: #0f172a; padding: 35px 20px; text-align: center;">
                <p id="lg-hero-badge-zh" style="color: #0ea5e9; font-weight: bold; font-size: 16px; margin: 0 0 10px 0;">AI 點子變現商隊 ⚡ 合作互惠計劃</p>
                <h1 id="lg-hero-title-zh" style="color: #ffffff; font-size: 26px; margin: 0; line-height: 1.4; font-weight: bold;">用 AI 幫你全自動陌生開發，邁向被動永續分紅</h1>
            </div>

            <div style="padding: 25px;">
                
                <!-- 顛覆傳統與人性痛點區塊 -->
                <div style="background: linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%); border-left: 6px solid #e11d48; padding: 20px; margin-bottom: 25px; border-radius: 10px; box-shadow: 0 4px 15px rgba(225, 29, 72, 0.1);">
                    <strong style="color: #be123c; font-size: 18px; display: block; margin-bottom: 12px;">💡 顛覆傳統 直擊人性的終極方案</strong>
                    <p style="color: #334155; font-size: 15px; margin: 0 0 10px 0; line-height: 1.7;">
                        傳統直銷的失敗，源於<strong>「強迫拉人」</strong>與<strong>「每月重消」</strong>的沉重心理負擔。本系統迎合人性最真實的需求：解決<strong>「懶」</strong>得推銷、<strong>「貪」</strong>求高報酬、期望<strong>「低勞動高回報」</strong>的終極渴望。
                    </p>
                    <p style="color: #334155; font-size: 15px; margin: 0; line-height: 1.7;">
                        透過跨境訂閱制搭配 AI 全自動協播，我們將傳統令人反感的「主動推銷」，完美轉化為<strong>「被動精準流量攔截」</strong>，讓參與者實現真正的 AI 自動系統化收益！
                    </p>
                </div>

                <!-- AI 自動來客系統優勢 -->
                <h3 style="color: #ffffff; background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); padding: 15px 20px; font-size: 20px; margin: 10px 0 20px 0; font-weight: bold; border-radius: 10px; text-align: center; box-shadow: 0 4px 15px rgba(14, 165, 233, 0.4);">
                    🤖 AI 自動來客系統 - 24/7 不間斷陌生開發
                </h3>

                <!-- YouTube 16:9 影片區塊 -->
                <div style="margin: 0 auto 30px auto; max-width: 700px; text-align: center;">
                    <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 15px; box-shadow: 0 8px 30px rgba(0,0,0,0.15);">
                        <iframe 
                            src="https://www.youtube.com/embed/DYT8ZaSKOZw" 
                            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            allowfullscreen>
                        </iframe>
                    </div>
                    <p style="color: #0369a1; font-size: 14px; margin-top: 10px; font-weight: 600;">🎬 AI 自動來客系統 - SEO 多語系呈現</p>
                </div>

                <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 2px solid #0ea5e9; border-radius: 12px; padding: 25px 20px; margin-bottom: 30px;">
                    
                    <div style="background-color: #ffffff; padding: 18px; margin-bottom: 15px; border-radius: 8px; border-left: 4px solid #0ea5e9; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
                        <strong style="color: #0369a1; font-size: 16px; display: block; margin-bottom: 8px;">✨ 多語言內容與協播引擎</strong>
                        <p style="color: #334155; font-size: 14px; margin: 0; line-height: 1.6;">
                            免費為您設計推廣文案，並自動產生中文、英文、越南文等內容。透過每日協播您的專屬推薦碼，讓您的網站在 Google、YouTube 等平台自動曝光。
                        </p>
                    </div>

                    <div style="background-color: #ffffff; padding: 18px; margin-bottom: 15px; border-radius: 8px; border-left: 4px solid #0891b2; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
                        <strong style="color: #0c4a6e; font-size: 16px; display: block; margin-bottom: 8px;">🎯 精準鎖定「被動收入」族群</strong>
                        <p style="color: #334155; font-size: 14px; margin: 0; line-height: 1.6;">
                            AI 分析目標受眾痛點，自動推播「財務自由」、「零成本創業」、「在家賺美金」等高轉換內容，為您攔截精準流量，讓潛在客戶主動找上門。
                        </p>
                    </div>

                    <div style="background-color: #ffffff; padding: 18px; border-radius: 8px; border-left: 4px solid #0369a1; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
                        <strong style="color: #075985; font-size: 16px; display: block; margin-bottom: 8px;">⚙️ AI-SEO 全自動化工作流</strong>
                        <p style="color: #334155; font-size: 14px; margin: 0; line-height: 1.6;">
                            整合自動化發布工具，您只需設定一次，系統 24/7 自動運作，持續為您帶來尋求訂閱及網購消費的新客源。
                        </p>
                    </div>

                </div>

                <!-- ❶ 啟動成本 (升級為 2 項選擇費用：1. 自行處理 $139.95 / 2. 專人協辦 $180 含 $139.95) -->
                <h3 style="color: #000000; border-left: 6px solid #0ea5e9; padding-left: 15px; font-size: 20px; margin: 10px 0 20px 0; font-weight: bold;">❶ 啟動成本（提供 2 項選擇方案）</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-bottom: 25px;">
                    
                    <!-- 方案 1：原本自行處理 $139.95 USD -->
                    <div style="background-color: #f0f9ff; border: 2px solid #0ea5e9; padding: 22px 18px; border-radius: 12px; text-align: center; display: flex; flex-direction: column; justify-content: space-between;">
                        <div>
                            <div style="display: inline-block; background: #0284c7; color: #ffffff; font-size: 12px; font-weight: bold; padding: 3px 12px; border-radius: 99px; margin-bottom: 8px;">方案 1 · 自行註冊處理</div>
                            <div style="font-size: 16px; color: #0369a1; font-weight: bold; margin-bottom: 4px;">官方標準啟動總金額</div>
                            <div style="font-size: 36px; font-weight: 900; color: #000000; margin-bottom: 10px;">$139.95 <span style="font-size: 16px;">USD</span></div>
                            <div style="color: #475569; font-size: 14px; line-height: 1.75; text-align: left; background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #bae6fd;">
                                ✅ 依下方「註冊流程教學」自行於官網完成申請<br>
                                ✅ 含 LiveGood 一次性聯盟費 ($40) + 全年度會員訂閱費 ($99.95)<br>
                                <span style="color: #e11d48; font-weight: bold; display: inline-block; margin-top: 4px;">🎁 合作互惠計劃：全年 AI 每日協播與文案設計 0 元免費體驗！</span>
                            </div>
                        </div>
                        <div style="margin-top: 14px;">
                            <a href="https://aitutor.vip/po009" target="_blank" style="background: #0ea5e9; color: #ffffff; padding: 10px 20px; border-radius: 25px; font-size: 14px; font-weight: bold; text-decoration: none; display: inline-block; width: 100%;">👉 選擇方案 1：自行前往註冊 ($139.95)</a>
                        </div>
                    </div>

                    <!-- 方案 2：專人協辦 $180 USD (含 $139.95 USD) -->
                    <div style="background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%); border: 2px solid #8b5cf6; padding: 22px 18px; border-radius: 12px; text-align: center; display: flex; flex-direction: column; justify-content: space-between; position: relative; box-shadow: 0 6px 20px rgba(139, 92, 246, 0.15);">
                        <div>
                            <div style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); color: #ffffff; font-size: 12px; font-weight: bold; padding: 3px 12px; border-radius: 99px; margin-bottom: 8px;">★ 方案 2 · 專人一條龍協辦（省時免摸索）</div>
                            <div style="font-size: 16px; color: #6d28d9; font-weight: bold; margin-bottom: 4px;">專人代辦到好總金額</div>
                            <div style="font-size: 36px; font-weight: 900; color: #4c1d95; margin-bottom: 10px;">$180 <span style="font-size: 16px;">USD</span> <span style="font-size: 13px; color: #7c3aed; font-weight: bold;">(含 $139.95 官方費)</span></div>
                            <div style="color: #475569; font-size: 14px; line-height: 1.75; text-align: left; background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #ddd6fe;">
                                ✅ <strong>已內含 $139.95 美元</strong> LiveGood 官方聯盟費與全年訂閱費<br>
                                ✅ <strong>專人協辦註冊激活 + 金流協助 + AI 協播管線一次設定到好</strong><br>
                                <span style="color: #e11d48; font-weight: bold; display: inline-block; margin-top: 4px;">🎁 同享全年 AI 每日協播與多語系文案設計免費權益！</span>
                            </div>
                        </div>
                        <div style="margin-top: 14px;">
                            <a href="#shoppable-contact-hub" style="background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); color: #ffffff; padding: 10px 20px; border-radius: 25px; font-size: 14px; font-weight: bold; text-decoration: none; display: inline-block; width: 100%; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);">🤝 選擇方案 2：聯繫總工程師專人協辦 ($180)</a>
                        </div>
                    </div>

                </div>

                <!-- LiveGood 官方制度與分潤亮點 -->
                <h3 style="color: #000000; border-left: 6px solid #eab308; padding-left: 15px; font-size: 20px; margin: 30px 0 20px 0; font-weight: bold;">💎 認識 LiveGood：革命性全球訂閱批發電商</h3>
                
                <div style="background-color: #fefce8; border: 2px solid #facc15; padding: 22px; border-radius: 10px; margin-bottom: 25px;">
                    <strong style="color: #854d0e; font-size: 18px; display: block; margin-bottom: 10px;">🌟 LiveGood 顛覆性商業模式與 6 大分潤好康</strong>
                    <p style="color: #334155; font-size: 15px; margin: 0 0 12px 0; line-height: 1.7;">
                        LiveGood 打破傳統高價保健品與月月強迫囤貨的舊框架，採用類似 <strong>Costco 的會員訂閱制</strong>：以頂級有機天然成分，提供會員市場價 25折～3折 的出廠價批發優惠，退訂率極低，造就極高且長期的被動留存率！
                    </p>
                    <ul style="color: #1e293b; font-size: 14px; margin: 0; padding-left: 20px; line-height: 1.8;">
                        <li><strong>每週直推佣金（Weekly Fast Start）：</strong> 推薦好友加入立即獲得 50% 推薦獎金（高達 10 層穿透）。</li>
                        <li><strong>2×15 矩陣被動月分紅（Matrix Commissions）：</strong> 透過自動公排滑落，最高每月可享高達 $2,047.50 美元，進階會員更可領取每月 $16,383.50 美元。</li>
                        <li><strong>超高對等獎金（Matching Bonuses）：</strong> 直推會員矩陣收入的 50% 甚至多代提成，被動收入呈現爆發性成長。</li>
                        <li><strong>零售與產品分銷佣金：</strong> 顧客以零售價購買產品，賺取會員價差的 50%。</li>
                        <li><strong>頂級鑽石池分紅（Diamond Pool）：</strong> 躋身鑽石級別，每月平分全公司全球總業績營業額的 2% 分紅！</li>
                        <li><strong>零庫存、免月重消壓力：</strong> 單純享受高品質產品與全球網絡自動化延伸。</li>
                    </ul>

                    <!-- 新增：LiveGood 官方 YouTube 參考按鈕 -->
                    <div style="margin-top: 18px; padding-top: 15px; border-top: 1px dashed #eab308; text-align: center;">
                        <a href="https://www.youtube.com/@livegoodsupplements" target="_blank" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: #ffffff; padding: 10px 22px; border-radius: 20px; font-size: 14px; font-weight: bold; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 3px 10px rgba(239, 68, 68, 0.35); transition: opacity 0.2s;">
                            <span>▶️ 前往 LiveGood 官方 YouTube 頻道（產品與制度介紹）</span>
                        </a>
                    </div>
                </div>

                <!-- 眾籌斗內與優先內排機制 -->
                <h3 style="color: #000000; border-left: 6px solid #8b5cf6; padding-left: 15px; font-size: 20px; margin: 30px 0 20px 0; font-weight: bold;">⚡ 眾籌斗內系統：贊助越多，優先內排擇好客！</h3>
                
                <div style="background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%); border: 2px solid #8b5cf6; padding: 22px; border-radius: 12px; margin-bottom: 25px;">
                    <strong style="color: #6d28d9; font-size: 18px; display: block; margin-bottom: 10px;">🚀 加速召募！享有更多下線曝光權益</strong>
                    <p style="color: #334155; font-size: 14px; line-height: 1.7; margin: 0 0 15px 0;">
                        我們結合了 <a href="https://nft1314.party" target="_blank" style="color: #7c3aed; font-weight: bold; text-decoration: underline;">nft1314.party</a> 的專屬眾籌與斗內機制！<strong>「贊助越多、越能享有更多召會員成下線的曝光權重及優先內排擇好客」</strong>。讓您的推薦碼進入高頻曝光佇列，搶先在 AI 矩陣內排中獲得高價值、高活躍度的夥伴！
                    </p>
                    <div style="text-align: center; margin-top: 15px;">
                        <a href="https://nft1314.party/" target="_blank" style="background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); color: #ffffff; padding: 12px 28px; border-radius: 25px; font-size: 15px; font-weight: bold; text-decoration: none; display: inline-block; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.35);">
                            🌐 參觀 NFT1314 眾籌斗內系統 ➔
                        </a>
                    </div>
                </div>

                <!-- 微享 AI 技術作品集 (自動輪播) -->
                <h3 style="color: #000000; border-left: 6px solid #0ea5e9; padding-left: 15px; font-size: 20px; margin: 30px 0 20px 0; font-weight: bold;">🌟 我們微享 AI 技術作品集 (自動輪動)</h3>
                <p style="color: #64748b; font-size: 14px; margin-top: -10px; margin-bottom: 15px;">微享團隊為您量身打造的自動化、數位產品與變現工具矩陣：</p>

                <div class="carousel-container" id="portfolioCarousel-zh">
                    <button type="button" class="carousel-nav-btn prev" id="lgPrevZh">❮</button>
                    <button type="button" class="carousel-nav-btn next" id="lgNextZh">❯</button>
                    <div class="carousel-track">
                        
                        <!-- 作品 1 -->
                        <div class="carousel-card">
                            <div class="carousel-card-img">🤖</div>
                            <div>
                                <strong style="color: #38bdf8; font-size: 16px; display: block; margin-bottom: 6px;">WAIA 全自動化營銷</strong>
                                <p style="font-size: 13px; color: #cbd5e1; margin: 0; line-height: 1.5;">專屬 AI 導客與全自動社群私域轉化系統。</p>
                            </div>
                            <a href="https://aitutor.vip/waia" target="_blank" class="carousel-btn">查看作品 ➔</a>
                        </div>

                        <!-- 作品 2 -->
                        <div class="carousel-card">
                            <div class="carousel-card-img">💎</div>
                            <div>
                                <strong style="color: #38bdf8; font-size: 16px; display: block; margin-bottom: 6px;">AI 變現高階模組 $288</strong>
                                <p style="font-size: 13px; color: #cbd5e1; margin: 0; line-height: 1.5;">整合多模態與自動化落地商業變現專案。</p>
                            </div>
                            <a href="https://zylvie.com/1314520/p/288" target="_blank" class="carousel-btn">查看作品 ➔</a>
                        </div>

                        <!-- 作品 3 -->
                        <div class="carousel-card">
                            <div class="carousel-card-img">⚡</div>
                            <div>
                                <strong style="color: #38bdf8; font-size: 16px; display: block; margin-bottom: 6px;">AI 入門實踐方案 $99</strong>
                                <p style="font-size: 13px; color: #cbd5e1; margin: 0; line-height: 1.5;">低門檻快啟動的 AI 內容自動生長工作流。</p>
                            </div>
                            <a href="https://zylvie.com/1314520/p/99" target="_blank" class="carousel-btn">查看作品 ➔</a>
                        </div>

                        <!-- 作品 4 -->
                        <div class="carousel-card">
                            <div class="carousel-card-img">🚀</div>
                            <div>
                                <strong style="color: #38bdf8; font-size: 16px; display: block; margin-bottom: 6px;">精選收益套餐 $168</strong>
                                <p style="font-size: 13px; color: #cbd5e1; margin: 0; line-height: 1.5;">系統化多管道分銷與高轉化文案庫模板。</p>
                            </div>
                            <a href="https://zylvie.com/1314520/p/168" target="_blank" class="carousel-btn">查看作品 ➔</a>
                        </div>

                        <!-- 作品 5 -->
                        <div class="carousel-card">
                            <div class="carousel-card-img">🤝</div>
                            <div>
                                <strong style="color: #38bdf8; font-size: 16px; display: block; margin-bottom: 6px;">NFT1314 眾籌贊助中心</strong>
                                <p style="font-size: 13px; color: #cbd5e1; margin: 0; line-height: 1.5;">優先排線、流量配額斗內與支持生態系。</p>
                            </div>
                            <a href="https://nft1314.party/sponsor" target="_blank" class="carousel-btn">查看作品 ➔</a>
                        </div>

                    </div>
                </div>

                <div style="background-color: #1a202c; padding: 20px; border-radius: 10px; margin: 30px 0; border-left: 6px solid #0ea5e9;">
                    <p style="color: #ffffff; font-size: 15px; font-style: italic; line-height: 1.7; margin: 0;">「不需要拍片、不用學推銷。AI 系統每天免費幫你協播找客源，滿足你低勞動高回報的渴望，建立真正源源不絕的被動收入。」</p>
                </div>

                <!-- 操作二步驟 -->
                <h3 style="color: #ffffff; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 15px 20px; font-size: 20px; margin: 30px 0 25px 0; font-weight: bold; border-radius: 10px; text-align: center; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                    ⚡ 操作二步驟 - 立即啟動您的被動收入系統
                </h3>

                <div style="background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%); border: 2px solid #667eea; border-radius: 15px; padding: 25px 20px; margin-bottom: 30px;">
                    
                    <!-- 步驟 1 -->
                    <div style="background-color: #ffffff; border-left: 5px solid #8b5cf6; padding: 20px; margin-bottom: 15px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                        <div style="display: flex; align-items: center; margin-bottom: 10px;">
                            <div style="background-color: #8b5cf6; color: #ffffff; width: 35px; height: 35px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; margin-right: 12px;">1</div>
                            <strong style="color: #8b5cf6; font-size: 17px;">申請 LiveGood 聯盟權與全年訂閱（自行處理 $139.95 或 專人協辦 $180）</strong>
                        </div>
                        <p style="color: #334155; font-size: 14px; margin: 10px 0 15px 47px; line-height: 1.6;">
                            點擊下方按鈕，可選擇直接在 LiveGood 自行申請一次性聯盟費 + 全年度會員訂閱費（$139.95 美元），或選擇專人協辦方案（$180 美元，已含 $139.95 官方費用），立即獲得全球分紅資格。
                        </p>
                        <div style="margin-left: 47px; display: flex; flex-wrap: wrap; gap: 10px; align-items: center;">
                            <a href="https://aitutor.vip/po009" target="_blank" style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: #ffffff; padding: 12px 26px; border-radius: 25px; font-size: 15px; font-weight: bold; text-decoration: none; display: inline-block; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);">
                                👉 方案 1：立即自行申請 ($139.95)
                            </a>
                            <a href="#shoppable-contact-hub" style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: #ffffff; padding: 12px 26px; border-radius: 25px; font-size: 15px; font-weight: bold; text-decoration: none; display: inline-block; box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);">
                                🤝 方案 2：預約專人協辦 ($180 含官方費)
                            </a>
                            <div style="width: 100%; margin-top: 6px; padding-left: 5px;">
                                <button type="button" class="open-lg-guide-btn" style="background: #f5f3ff; border: 1.5px solid #8b5cf6; color: #6d28d9; padding: 8px 16px; border-radius: 20px; font-size: 14px; text-decoration: underline; font-weight: bold; cursor: pointer;">
                                    📝 備註：會員註冊流程教學請點此（點擊展開完整 10 步驟圖文指南）
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- 步驟 2 -->
                    <div style="background-color: #ffffff; border-left: 5px solid #ec4899; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                        <div style="display: flex; align-items: center; margin-bottom: 10px;">
                            <div style="background-color: #ec4899; color: #ffffff; width: 35px; height: 35px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; margin-right: 12px;">2</div>
                            <strong style="color: #ec4899; font-size: 17px;">加入「合作互惠計劃」啟動免付費協播</strong>
                        </div>
                        <p style="color: #334155; font-size: 14px; margin: 10px 0 15px 47px; line-height: 1.6;">
                            完成第一步後，填寫表單提供您的專屬推薦碼。我們將依「合作互惠計劃」免費為您設計推廣文案，並每日協播您的連結（您也可轉發至自己的社群）。免再花一毛錢體驗一整年，讓 AI 自動為您找尋訂閱與消費客群！
                        </p>
                        <div style="margin-left: 47px;">
                            <a href="https://www.surveycake.com/s/xkBx9" target="_blank" style="background: linear-gradient(135deg, #ec4899 0%, #db2777 100%); color: #ffffff; padding: 12px 30px; border-radius: 25px; font-size: 15px; font-weight: bold; text-decoration: none; display: inline-block; box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);">
                                🤖 設置免費 AI 協播
                            </a>
                        </div>
                    </div>

                </div>

                <div style="text-align: center; padding: 20px 0;">
                    <a href="https://aitutor.vip/po009" target="_blank" style="background-color: #0ea5e9; color: #ffffff; padding: 18px 50px; border-radius: 50px; font-size: 20px; font-weight: bold; text-decoration: none; display: inline-block; box-shadow: 0 6px 20px rgba(14, 165, 233, 0.4); transition: all 0.3s ease;">🚀 立刻啟動 AI 變現自動系統</a>
                </div>
            </div>
        </div>
    </div>

    <!-- ================= 英文 / 國際版內容 ================= -->
    <div id="lg-content-en" style="display: none;">
        <div style="width: 100%; max-width: 800px; margin: 0 auto; background-color: #ffffff; color: #000000; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; border: 1px solid #dddddd; border-radius: 0 0 14px 14px; padding: 0px; box-sizing: border-box;">

            <div style="background-color: #0f172a; padding: 35px 20px; text-align: center;">
                <p id="lg-hero-badge-en" style="color: #0ea5e9; font-weight: bold; font-size: 16px; margin: 0 0 10px 0;">AI Idea Monetization Squad ⚡ Mutual Benefit Plan</p>
                <h1 id="lg-hero-title-en" style="color: #ffffff; font-size: 26px; margin: 0; line-height: 1.4; font-weight: bold;">AI-Powered Automated Lead Generation - Build Long-Term Passive Revenue</h1>
            </div>

            <div style="padding: 25px;">
                
                <!-- Pain Points Section -->
                <div style="background: linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%); border-left: 6px solid #e11d48; padding: 20px; margin-bottom: 25px; border-radius: 10px; box-shadow: 0 4px 15px rgba(225, 29, 72, 0.1);">
                    <strong style="color: #be123c; font-size: 18px; display: block; margin-bottom: 12px;">💡 Disrupting Traditions: The Ultimate Solution for Human Nature</strong>
                    <p style="color: #334155; font-size: 15px; margin: 0 0 10px 0; line-height: 1.7;">
                        The failure of traditional MLM stems from the heavy psychological burden of <strong>"forced recruiting"</strong> and <strong>"monthly auto-ships"</strong>. This system caters to the truest human desires: solving the <strong>"reluctance"</strong> to sell, the <strong>"appetite"</strong> for high returns, and the expectation of <strong>"low effort, high reward"</strong>.
                    </p>
                    <p style="color: #334155; font-size: 15px; margin: 0; line-height: 1.7;">
                        Through a cross-border subscription model paired with AI automated co-broadcasting, we seamlessly transform obnoxious "active selling" into <strong>"passive precision traffic interception"</strong>. This allows participants to achieve true AI-automated systematic income!
                    </p>
                </div>

                <!-- AI Auto-Lead System -->
                <h3 style="color: #ffffff; background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); padding: 15px 20px; font-size: 20px; margin: 10px 0 20px 0; font-weight: bold; border-radius: 10px; text-align: center; box-shadow: 0 4px 15px rgba(14, 165, 233, 0.4);">
                    🤖 AI Auto-Lead System - 24/7 Non-Stop Prospecting
                </h3>

                <!-- YouTube 16:9 Video -->
                <div style="margin: 0 auto 30px auto; max-width: 700px; text-align: center;">
                    <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 15px; box-shadow: 0 8px 30px rgba(0,0,0,0.15);">
                        <iframe 
                            src="https://www.youtube.com/embed/5mLmKiCKDIE" 
                            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            allowfullscreen>
                        </iframe>
                    </div>
                    <p style="color: #0369a1; font-size: 14px; margin-top: 10px; font-weight: 600;">🎬 AI Auto-Lead System - Multilingual SEO Presentation</p>
                </div>

                <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 2px solid #0ea5e9; border-radius: 12px; padding: 25px 20px; margin-bottom: 30px;">
                    
                    <div style="background-color: #ffffff; padding: 18px; margin-bottom: 15px; border-radius: 8px; border-left: 4px solid #0ea5e9; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
                        <strong style="color: #0369a1; font-size: 16px; display: block; margin-bottom: 8px;">✨ Multilingual Content & Co-broadcasting Engine</strong>
                        <p style="color: #334155; font-size: 14px; margin: 0; line-height: 1.6;">
                            We design your promotional copy for free and automatically generate content in multiple languages. By daily co-broadcasting your referral code, your site gets auto-exposed on platforms like Google and YouTube.
                        </p>
                    </div>

                    <div style="background-color: #ffffff; padding: 18px; margin-bottom: 15px; border-radius: 8px; border-left: 4px solid #0891b2; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
                        <strong style="color: #0c4a6e; font-size: 16px; display: block; margin-bottom: 8px;">🎯 Precision Targeting "Passive Income" Seekers</strong>
                        <p style="color: #334155; font-size: 14px; margin: 0; line-height: 1.6;">
                            AI analyzes target audience pain points, auto-pushing high-conversion content around "Financial Freedom" and "Zero-Cost Business," intercepting precision traffic and bringing prospects directly to you.
                        </p>
                    </div>

                    <div style="background-color: #ffffff; padding: 18px; border-radius: 8px; border-left: 4px solid #0369a1; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
                        <strong style="color: #075985; font-size: 16px; display: block; margin-bottom: 8px;">⚙️ AI-SEO Full Automation Workflow</strong>
                        <p style="color: #334155; font-size: 14px; margin: 0; line-height: 1.6;">
                            Integrated with automated publishing tools. Set it up once, and the system operates 24/7, continuously bringing you new subscribers and e-commerce consumers.
                        </p>
                    </div>

                </div>

                <!-- ❶ Startup Cost (2 Options: 1. Self-Service $139.95 / 2. Concierge Done-For-You $180 incl. $139.95) -->
                <h3 style="color: #000000; border-left: 6px solid #0ea5e9; padding-left: 15px; font-size: 20px; margin: 10px 0 20px 0; font-weight: bold;">❶ Startup Investment (2 Flexible Options)</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-bottom: 25px;">
                    
                    <!-- Option 1: Self-Service $139.95 USD -->
                    <div style="background-color: #f0f9ff; border: 2px solid #0ea5e9; padding: 22px 18px; border-radius: 12px; text-align: center; display: flex; flex-direction: column; justify-content: space-between;">
                        <div>
                            <div style="display: inline-block; background: #0284c7; color: #ffffff; font-size: 12px; font-weight: bold; padding: 3px 12px; border-radius: 99px; margin-bottom: 8px;">Option 1 · Self-Registration</div>
                            <div style="font-size: 16px; color: #0369a1; font-weight: bold; margin-bottom: 4px;">Standard Activation Total</div>
                            <div style="font-size: 36px; font-weight: 900; color: #000000; margin-bottom: 10px;">$139.95 <span style="font-size: 16px;">USD</span></div>
                            <div style="color: #475569; font-size: 14px; line-height: 1.75; text-align: left; background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #bae6fd;">
                                ✅ Complete registration yourself using our Step-by-Step Guide<br>
                                ✅ LiveGood One-Time Affiliate Fee ($40) + Annual Membership ($99.95)<br>
                                <span style="color: #e11d48; font-weight: bold; display: inline-block; margin-top: 4px;">🎁 Mutual Benefit Plan: $0 Fee for AI Daily Co-broadcasting for a WHOLE YEAR!</span>
                            </div>
                        </div>
                        <div style="margin-top: 14px;">
                            <a href="https://aitutor.vip/po009" target="_blank" style="background: #0ea5e9; color: #ffffff; padding: 10px 20px; border-radius: 25px; font-size: 14px; font-weight: bold; text-decoration: none; display: inline-block; width: 100%;">👉 Option 1: Self-Register ($139.95)</a>
                        </div>
                    </div>

                    <!-- Option 2: Done-For-You Concierge $180 USD (Includes $139.95) -->
                    <div style="background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%); border: 2px solid #8b5cf6; padding: 22px 18px; border-radius: 12px; text-align: center; display: flex; flex-direction: column; justify-content: space-between; position: relative; box-shadow: 0 6px 20px rgba(139, 92, 246, 0.15);">
                        <div>
                            <div style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); color: #ffffff; font-size: 12px; font-weight: bold; padding: 3px 12px; border-radius: 99px; margin-bottom: 8px;">★ Option 2 · Done-For-You Concierge</div>
                            <div style="font-size: 16px; color: #6d28d9; font-weight: bold; margin-bottom: 4px;">Full Concierge Setup Total</div>
                            <div style="font-size: 36px; font-weight: 900; color: #4c1d95; margin-bottom: 10px;">$180 <span style="font-size: 16px;">USD</span> <span style="font-size: 13px; color: #7c3aed; font-weight: bold;">(Incl. $139.95)</span></div>
                            <div style="color: #475569; font-size: 14px; line-height: 1.75; text-align: left; background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #ddd6fe;">
                                ✅ <strong>Includes the $139.95 USD</strong> official LiveGood Affiliate & Annual Fee<br>
                                ✅ <strong>1-on-1 Assisted Registration, Payment Handling & Full AI Co-Broadcasting Setup</strong><br>
                                <span style="color: #e11d48; font-weight: bold; display: inline-block; margin-top: 4px;">🎁 Includes 1 Full Year of AI Daily Co-Broadcasting & Multilingual Copywriting!</span>
                            </div>
                        </div>
                        <div style="margin-top: 14px;">
                            <a href="#shoppable-contact-hub" style="background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); color: #ffffff; padding: 10px 20px; border-radius: 25px; font-size: 14px; font-weight: bold; text-decoration: none; display: inline-block; width: 100%; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);">🤝 Option 2: Book Concierge Setup ($180)</a>
                        </div>
                    </div>

                </div>

                <!-- LiveGood Overview & Compensation -->
                <h3 style="color: #000000; border-left: 6px solid #eab308; padding-left: 15px; font-size: 20px; margin: 30px 0 20px 0; font-weight: bold;">💎 About LiveGood: Disruptive E-Commerce Club</h3>
                
                <div style="background-color: #fefce8; border: 2px solid #facc15; padding: 22px; border-radius: 10px; margin-bottom: 25px;">
                    <strong style="color: #854d0e; font-size: 18px; display: block; margin-bottom: 10px;">🏆 LiveGood Key Advantages & Compensation Highlights</strong>
                    <p style="color: #334155; font-size: 15px; margin: 0 0 12px 0; line-height: 1.7;">
                        Operating like the <strong>Costco of wellness</strong>, LiveGood provides USDA-certified organic, premium nutrition directly to subscribers at wholesale prices up to 75% off retail. No expensive markups, no mandatory monthly autoships.
                    </p>
                    <ul style="color: #1e293b; font-size: 14px; margin: 0; padding-left: 20px; line-height: 1.8;">
                        <li><strong>Weekly Fast Start:</strong> Earn 50% commission instantly on personal referrals, down to 10 generations.</li>
                        <li><strong>2×15 Matrix Commissions:</strong> Earn up to $2,047.50/month with zero personal recruiting via spillover, or up to $16,383.50/month as you rank up.</li>
                        <li><strong>Matching Bonuses:</strong> Match 50% of matrix checks on everyone you personally enroll, compounding monthly.</li>
                        <li><strong>Retail & Product Commissions:</strong> Earn 50% of the difference between member and retail prices.</li>
                        <li><strong>Diamond Bonus Pool:</strong> 2% of total company sales split among all qualifying Diamond members monthly!</li>
                        <li><strong>Zero Inventory:</strong> 100% cloud-based e-commerce platform.</li>
                    </ul>

                    <!-- Added: LiveGood Official YouTube Button -->
                    <div style="margin-top: 18px; padding-top: 15px; border-top: 1px dashed #eab308; text-align: center;">
                        <a href="https://www.youtube.com/@livegoodsupplements" target="_blank" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: #ffffff; padding: 10px 22px; border-radius: 20px; font-size: 14px; font-weight: bold; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 3px 10px rgba(239, 68, 68, 0.35); transition: opacity 0.2s;">
                            <span>▶️ Visit Official LiveGood YouTube Channel (Products & Overview)</span>
                        </a>
                    </div>
                </div>

                <!-- Crowdfunding & Prioritized Spillover -->
                <h3 style="color: #000000; border-left: 6px solid #8b5cf6; padding-left: 15px; font-size: 20px; margin: 30px 0 20px 0; font-weight: bold;">⚡ Crowdfunding & Donate: More Sponsor, Better Priority!</h3>
                
                <div style="background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%); border: 2px solid #8b5cf6; padding: 22px; border-radius: 12px; margin-bottom: 25px;">
                    <strong style="color: #6d28d9; font-size: 18px; display: block; margin-bottom: 10px;">🚀 Boost Your Team with NFT1314 Priority Placement</strong>
                    <p style="color: #334155; font-size: 14px; line-height: 1.7; margin: 0 0 15px 0;">
                        Powered by <a href="https://nft1314.party" target="_blank" style="color: #7c3aed; font-weight: bold; text-decoration: underline;">nft1314.party</a> crowdfunding system: <strong>"The more you sponsor, the higher your exposure priority and placement for top active downstream members."</strong> Get high-traffic queue slots to build your active network faster!
                    </p>
                    <div style="text-align: center; margin-top: 15px;">
                        <a href="https://nft1314.party/" target="_blank" style="background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); color: #ffffff; padding: 12px 28px; border-radius: 25px; font-size: 15px; font-weight: bold; text-decoration: none; display: inline-block; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.35);">
                            🌐 Explore NFT1314 Crowdfunding System ➔
                        </a>
                    </div>
                </div>

                <!-- Weishare AI Portfolio (Auto Carousel) -->
                <h3 style="color: #000000; border-left: 6px solid #0ea5e9; padding-left: 15px; font-size: 20px; margin: 30px 0 20px 0; font-weight: bold;">🌟 Weishare AI Tech Portfolio (Auto-Rotating)</h3>
                <p style="color: #64748b; font-size: 14px; margin-top: -10px; margin-bottom: 15px;">Explore our battle-tested AI automation engines and digital products:</p>

                <div class="carousel-container" id="portfolioCarousel-en">
                    <button type="button" class="carousel-nav-btn prev" id="lgPrevEn">❮</button>
                    <button type="button" class="carousel-nav-btn next" id="lgNextEn">❯</button>
                    <div class="carousel-track">
                        
                        <div class="carousel-card">
                            <div class="carousel-card-img">🤖</div>
                            <div>
                                <strong style="color: #38bdf8; font-size: 16px; display: block; margin-bottom: 6px;">WAIA Automated Marketing</strong>
                                <p style="font-size: 13px; color: #cbd5e1; margin: 0; line-height: 1.5;">Automated AI traffic prospecting and social funnel.</p>
                            </div>
                            <a href="https://aitutor.vip/waia" target="_blank" class="carousel-btn">View Live ➔</a>
                        </div>

                        <div class="carousel-card">
                            <div class="carousel-card-img">💎</div>
                            <div>
                                <strong style="color: #38bdf8; font-size: 16px; display: block; margin-bottom: 6px;">AI Monetization Kit $288</strong>
                                <p style="font-size: 13px; color: #cbd5e1; margin: 0; line-height: 1.5;">Multimodal automated commercial setup.</p>
                            </div>
                            <a href="https://zylvie.com/1314520/p/288" target="_blank" class="carousel-btn">View Live ➔</a>
                        </div>

                        <div class="carousel-card">
                            <div class="carousel-card-img">⚡</div>
                            <div>
                                <strong style="color: #38bdf8; font-size: 16px; display: block; margin-bottom: 6px;">AI Starter Package $99</strong>
                                <p style="font-size: 13px; color: #cbd5e1; margin: 0; line-height: 1.5;">Rapid turn-key AI content workflows.</p>
                            </div>
                            <a href="https://zylvie.com/1314520/p/99" target="_blank" class="carousel-btn">View Live ➔</a>
                        </div>

                        <div class="carousel-card">
                            <div class="carousel-card-img">🚀</div>
                            <div>
                                <strong style="color: #38bdf8; font-size: 16px; display: block; margin-bottom: 6px;">Growth Revenue Suite $168</strong>
                                <p style="font-size: 13px; color: #cbd5e1; margin: 0; line-height: 1.5;">Multi-channel affiliate & sales copywriting templates.</p>
                            </div>
                            <a href="https://zylvie.com/1314520/p/168" target="_blank" class="carousel-btn">View Live ➔</a>
                        </div>

                        <div class="carousel-card">
                            <div class="carousel-card-img">🤝</div>
                            <div>
                                <strong style="color: #38bdf8; font-size: 16px; display: block; margin-bottom: 6px;">NFT1314 Sponsor Center</strong>
                                <p style="font-size: 13px; color: #cbd5e1; margin: 0; line-height: 1.5;">Crowdfunding support & prioritized pipeline.</p>
                            </div>
                            <a href="https://nft1314.party/sponsor" target="_blank" class="carousel-btn">View Live ➔</a>
                        </div>

                    </div>
                </div>

                <div style="background-color: #1a202c; padding: 20px; border-radius: 10px; margin: 30px 0; border-left: 6px solid #0ea5e9;">
                    <p style="color: #ffffff; font-size: 15px; font-style: italic; line-height: 1.7; margin: 0;">"No filming, no selling required. Our AI system co-broadcasts to find customers for you daily for FREE. Catering to your desire for 'low effort, high reward' and long-term passive revenue."</p>
                </div>

                <!-- Two-Step Operation -->
                <h3 style="color: #ffffff; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 15px 20px; font-size: 20px; margin: 30px 0 25px 0; font-weight: bold; border-radius: 10px; text-align: center; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                    ⚡ 2 Simple Steps - Launch Your Passive Income System Now
                </h3>

                <div style="background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%); border: 2px solid #667eea; border-radius: 15px; padding: 25px 20px; margin-bottom: 30px;">
                    
                    <!-- Step 1 -->
                    <div style="background-color: #ffffff; border-left: 5px solid #8b5cf6; padding: 20px; margin-bottom: 15px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                        <div style="display: flex; align-items: center; margin-bottom: 10px;">
                            <div style="background-color: #8b5cf6; color: #ffffff; width: 35px; height: 35px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; margin-right: 12px;">1</div>
                            <strong style="color: #8b5cf6; font-size: 17px;">Apply for LiveGood Affiliate & Annual Sub ($139.95 Self-Service or $180 Concierge)</strong>
                        </div>
                        <p style="color: #334155; font-size: 14px; margin: 10px 0 15px 47px; line-height: 1.6;">
                            Choose Option 1 to apply directly on LiveGood ($139.95 USD total), or Option 2 for our 1-on-1 Concierge Done-For-You Setup ($180 USD, which includes the $139.95 official fee).
                        </p>
                        <div style="margin-left: 47px; display: flex; flex-wrap: wrap; gap: 10px; align-items: center;">
                            <a href="https://aitutor.vip/po009" target="_blank" style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: #ffffff; padding: 12px 26px; border-radius: 25px; font-size: 15px; font-weight: bold; text-decoration: none; display: inline-block; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);">
                                👉 Option 1: Apply Yourself ($139.95)
                            </a>
                            <a href="#shoppable-contact-hub" style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: #ffffff; padding: 12px 26px; border-radius: 25px; font-size: 15px; font-weight: bold; text-decoration: none; display: inline-block; box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);">
                                🤝 Option 2: Concierge Setup ($180 Incl. Fee)
                            </a>
                            <div style="width: 100%; margin-top: 6px; padding-left: 5px;">
                                <button type="button" class="open-lg-guide-btn" style="background: #f5f3ff; border: 1.5px solid #8b5cf6; color: #6d28d9; padding: 8px 16px; border-radius: 20px; font-size: 14px; text-decoration: underline; font-weight: bold; cursor: pointer;">
                                    📝 Note: Click here for the member registration tutorial (10-Step Guide)
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Step 2 -->
                    <div style="background-color: #ffffff; border-left: 5px solid #ec4899; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                        <div style="display: flex; align-items: center; margin-bottom: 10px;">
                            <div style="background-color: #ec4899; color: #ffffff; width: 35px; height: 35px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; margin-right: 12px;">2</div>
                            <strong style="color: #ec4899; font-size: 17px;">Join "Mutual Benefit Plan" for Free Auto-Lead</strong>
                        </div>
                        <p style="color: #334155; font-size: 14px; margin: 10px 0 15px 47px; line-height: 1.6;">
                            After completing Step 1, fill out the form with your referral code. Under our "Mutual Benefit Plan," we will design your copy and co-broadcast your link daily for FREE (you can also share it on your socials). Experience it all year without spending an extra dime!
                        </p>
                        <div style="margin-left: 47px;">
                            <a href="https://www.surveycake.com/s/xkBx9" target="_blank" style="background: linear-gradient(135deg, #ec4899 0%, #db2777 100%); color: #ffffff; padding: 12px 30px; border-radius: 25px; font-size: 15px; font-weight: bold; text-decoration: none; display: inline-block; box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);">
                                🤖 Set Up Free AI System
                            </a>
                        </div>
                    </div>

                </div>

                <div style="text-align: center; padding: 20px 0;">
                    <a href="https://aitutor.vip/po009" target="_blank" style="background-color: #0ea5e9; color: #ffffff; padding: 18px 50px; border-radius: 50px; font-size: 20px; font-weight: bold; text-decoration: none; display: inline-block; box-shadow: 0 6px 20px rgba(14, 165, 233, 0.4); transition: all 0.3s ease;">🚀 Launch Your AI System Now</a>
                </div>
            </div>
        </div>
    </div>

    <!-- ================= 內嵌：LiveGood 新用戶註冊激活流程 (第二份 HTML 完整整合・支援主站 6 國語系) ================= -->
    <div id="lg-guide-modal" role="dialog" aria-modal="true">
        <div id="lg-guide-inner">
            <div class="guide-top-bar">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="color: #F9E795; font-weight: 900; font-size: 14px;">📘 LiveGood Registration Guide</span>
                    <div class="lg-lang-select-box" style="background: rgba(255,255,255,0.12); border-color: #97BC62;">
                        <span style="font-size: 12px;">🌐</span>
                        <select id="lgGuideLangSelect" class="lg-lang-select" style="color: #F9E795;" aria-label="Guide Language">
                            <option value="zh-TW">繁體中文</option>
                            <option value="zh-CN">简体中文</option>
                            <option value="en-US">English</option>
                            <option value="ja-JP">日本語</option>
                            <option value="ko-KR">한국어</option>
                            <option value="vi-VN">Tiếng Việt</option>
                        </select>
                    </div>
                </div>
                <button type="button" id="lgGuideCloseBtn" class="guide-close-btn">✕ 關閉教學 / Close</button>
            </div>

            <div class="guide-header">
                <h1 class="guide-h1" id="lg-guide-main-title">LiveGood 新用戶註冊激活流程</h1>
                <p class="guide-subtitle" id="lg-guide-subtitle">完整操作指南</p>
            </div>

            <div class="guide-container" id="lg-guide-steps-container"></div>

            <div class="guide-footer">
                <p id="lg-guide-footer-text">美商 LiveGood | AI點子1200倍變現商隊</p>
            </div>
        </div>
    </div>
</div>

<script>
(function() {
    const wrapper = document.getElementById('livegood-wrapper');
    if (!wrapper) return;

    const guideContent = {
        'zh-TW': {
            title: "LiveGood 新用戶註冊激活流程",
            subtitle: "完整操作指南",
            footer: "美商 LiveGood | AI點子1200倍變現商隊",
            steps: [
                { num: "1", title: "獲取註冊鏈接", desc: "找到推薦老師的邀請註冊鏈接\\n例如：https://LiveGoodTour.com/用戶名\\n\\n或進入推薦老師會員後台查看新用戶註冊鏈接" },
                { num: "2", title: "開始註冊", desc: "點擊推薦老師的會員邀請註冊鏈接\\n\\n填寫：\\n• 姓名\\n• 郵箱\\n• 立即鎖定新客戶" },
                { num: "3", title: "鎖定位置", desc: "點擊「鎖定你的位置」按鈕\\n\\n然後點擊下一步繼續" },
                { num: "4", title: "完善個人信息", desc: "填寫以下信息：\\n• 用戶名\\n• 密碼\\n• 收貨地址\\n• 選擇數字貨幣支付\\n• 選擇會員一次性加盟費+年費 $139.95（或選擇 $180 專人協辦方案）\\n\\n完成後點擊下一步" },
                { num: "5", title: "確認信息", desc: "確認新會員的所有信息\\n\\n勾選同意條款\\n\\n點擊下一步" },
                { num: "6", title: "選擇支付方式", desc: "選擇數字貨幣進行付款激活\\n\\n建議使用：\\nUSDT (TRON) 波場鏈\\n波動小、更安全\\n\\n也可選擇信用卡來支付激活" },
                { num: "7", title: "重要提醒", desc: "使用數字貨幣付款時，切記：\\n\\n轉給公司的數量 + 平台手續費 + 0.01\\n\\n確保金額準確", warning: true },
                { num: "8", title: "查看支付狀態", desc: "支付完成後\\n\\n點擊「查看狀態」\\n\\n確認支付成功" },
                { num: "9", title: "查看會員信息", desc: "點擊左側選單\\n\\n選擇「我的信息」\\n\\n查看會員詳細信息" },
                { num: "10", title: "編輯並保存", desc: "進行信息編輯和儲存\\n\\n可修改：用戶名、密碼、地址等\\n\\n⚠️ 切記不可更改郵箱\\n（否則收不到公司郵件）", warning: true },
                {
                    num: "✓",
                    title: "恭喜完成！",
                    desc: "您已成功加盟 LiveGood 會員\\n\\n成為 AI點子1200倍變現商隊成員，請後續再填寫個人訊息表單（操作二步驟的第二步）",
                    success: true,
                    websites: [
                        { label: "會員後台", url: "LiveGood.com/用戶名" },
                        { label: "推薦註冊", url: "LiveGoodTour.com/用戶名" },
                        { label: "零售購物", url: "ShopLiveGood.com/用戶名" }
                    ]
                }
            ]
        },
        'zh-CN': {
            title: "LiveGood 新用户注册激活流程",
            subtitle: "完整操作指南",
            footer: "美商 LiveGood | AI点子1200倍变现商队",
            steps: [
                { num: "1", title: "获取注册链接", desc: "找到推荐老师的邀请注册链接\\n例如：https://LiveGoodTour.com/用户名\\n\\n或进入推荐老师会员后台查看新用户注册链接" },
                { num: "2", title: "开始注册", desc: "点击推荐老师的会员邀请注册链接\\n\\n填写：\\n• 姓名\\n• 邮箱\\n• 立即锁定新客户" },
                { num: "3", title: "锁定位置", desc: "点击「锁定你的位置」按钮\\n\\n然后点击下一步继续" },
                { num: "4", title: "完善个人信息", desc: "填写以下信息：\\n• 用户名\\n• 密码\\n• 收货地址\\n• 选择数字货币支付\\n• 选择会员一次性加盟费+年费 $139.95（或选择 $180 专人协办方案）\\n\\n完成后点击下一步" },
                { num: "5", title: "确认信息", desc: "确认新会员的所有信息\\n\\n勾选同意条款\\n\\n点击下一步" },
                { num: "6", title: "选择支付方式", desc: "选择数字货币进行付款激活\\n\\n建议使用：\\nUSDT (TRON) 波场链\\n波动小、更安全\\n\\n也可选择信用卡来支付激活" },
                { num: "7", title: "重要提醒", desc: "使用数字货币付款时，切记：\\n\\n转给公司的数量 + 平台手续费 + 0.01\\n\\n确保金额准确", warning: true },
                { num: "8", title: "查看支付状态", desc: "支付完成后\\n\\n点击「查看状态」\\n\\n确认支付成功" },
                { num: "9", title: "查看会员信息", desc: "点击左侧选单\\n\\n选择「我的信息」\\n\\n查看会员详细信息" },
                { num: "10", title: "编辑并保存", desc: "进行信息编辑和储存\\n\\n可修改：用户名、密码、地址等\\n\\n⚠️ 切记不可更改邮箱\\n（否则收不到公司邮件）", warning: true },
                {
                    num: "✓",
                    title: "恭喜完成！",
                    desc: "您已成功加盟 LiveGood 会员\\n\\n成为 AI点子1200倍变现商队成员，请后续再填写个人信息表单（操作二步骤的第二步）",
                    success: true,
                    websites: [
                        { label: "会员后台", url: "LiveGood.com/用户名" },
                        { label: "推荐注册", url: "LiveGoodTour.com/用户名" },
                        { label: "零售购物", url: "ShopLiveGood.com/用户名" }
                    ]
                }
            ]
        },
        'en-US': {
            title: "LiveGood New User Registration & Activation",
            subtitle: "Complete Step-by-Step Guide",
            footer: "LiveGood USA | AI Ideas 1200x Monetization Squad",
            steps: [
                { num: "1", title: "Get Registration Link", desc: "Find your sponsor's invitation link\\nExample: https://LiveGoodTour.com/username\\n\\nOr access the sponsor's member dashboard to view the new user registration link" },
                { num: "2", title: "Start Registration", desc: "Click your sponsor's member invitation link\\n\\nFill in:\\n• Name\\n• Email\\n• Lock in new customer" },
                { num: "3", title: "Lock Position", desc: "Click 'Lock Your Position' button\\n\\nThen click Next to continue" },
                { num: "4", title: "Complete Personal Info", desc: "Fill in the following:\\n• Username\\n• Password\\n• Shipping address\\n• Select cryptocurrency payment\\n• Select one-time membership fee + Annual fee $139.95 (or $180 Concierge Done-For-You Plan)\\n\\nClick Next when done" },
                { num: "5", title: "Confirm Information", desc: "Confirm all new member information\\n\\nCheck agreement box\\n\\nClick Next" },
                { num: "6", title: "Choose Payment Method", desc: "Select cryptocurrency for payment activation\\n\\nRecommended:\\nUSDT (TRON) Tron Chain\\nLow volatility, more secure\\n\\nYou can also choose credit card for payment activation" },
                { num: "7", title: "Important Notice", desc: "When paying with cryptocurrency:\\n\\nAmount to company + Platform fee + 0.01\\n\\nEnsure accurate amount", warning: true },
                { num: "8", title: "Check Payment Status", desc: "After payment completion\\n\\nClick 'Check Status'\\n\\nConfirm successful payment" },
                { num: "9", title: "View Member Info", desc: "Click left menu\\n\\nSelect 'My Information'\\n\\nView detailed member info" },
                { num: "10", title: "Edit & Save", desc: "Edit and save information\\n\\nModifiable: username, password, address, etc.\\n\\n⚠️ DO NOT change email\\n(Otherwise you won't receive company emails)", warning: true },
                {
                    num: "✓",
                    title: "Congratulations!",
                    desc: "You've successfully joined LiveGood\\n\\nTo become a member of AI Ideas 1200x Monetization Squad, please complete the personal information form (Step 2 of the 2-step process) for free daily AI co-broadcasting",
                    success: true,
                    websites: [
                        { label: "Member Dashboard", url: "LiveGood.com/username" },
                        { label: "Referral Link", url: "LiveGoodTour.com/username" },
                        { label: "Retail Shop", url: "ShopLiveGood.com/username" }
                    ]
                }
            ]
        },
        'vi-VN': {
            title: "Hướng Dẫn Đăng Ký & Kích Hoạt LiveGood",
            subtitle: "Quy Trình Từng Bước Chi Tiết",
            footer: "LiveGood Hoa Kỳ | Đội Biến Tiền Hóa Ý Tưởng AI 1200 Lần",
            steps: [
                { num: "1", title: "Lấy Link Đăng Ký", desc: "Tìm link mời từ người giới thiệu\\nVí dụ: https://LiveGoodTour.com/tênngườidùng\\n\\nHoặc vào bảng điều khiển thành viên của người giới thiệu để xem link đăng ký" },
                { num: "2", title: "Bắt Đầu Đăng Ký", desc: "Nhấp vào link mời thành viên\\n\\nĐiền:\\n• Họ tên\\n• Email\\n• Khóa khách hàng mới ngay" },
                { num: "3", title: "Khóa Vị Trí", desc: "Nhấp nút 'Khóa Vị Trí Của Bạn'\\n\\nSau đó nhấp Tiếp theo để tiếp tục" },
                { num: "4", title: "Hoàn Thiện Thông Tin", desc: "Điền các thông tin sau:\\n• Tên người dùng\\n• Mật khẩu\\n• Địa chỉ giao hàng\\n• Chọn thanh toán tiền mã hóa\\n• Chọn phí gia nhập một lần + Phí thường niên $139.95 (hoặc gói hỗ trợ trọn gói $180)\\n\\nNhấp Tiếp theo khi hoàn tất" },
                { num: "5", title: "Xác Nhận Thông Tin", desc: "Xác nhận tất cả thông tin thành viên mới\\n\\nĐánh dấu đồng ý điều khoản\\n\\nNhấp Tiếp theo" },
                { num: "6", title: "Chọn Phương Thức Thanh Toán", desc: "Chọn tiền mã hóa để thanh toán kích hoạt\\n\\nKhuyến nghị:\\nUSDT (TRON) Tron Chain\\nDao động thấp, an toàn hơn\\n\\nBạn cũng có thể chọn thẻ tín dụng để thanh toán kích hoạt" },
                { num: "7", title: "Lưu Ý Quan Trọng", desc: "Khi thanh toán bằng tiền mã hóa:\\n\\nSố tiền chuyển cho công ty + Phí nền tảng + 0.01\\n\\nĐảm bảo số tiền chính xác", warning: true },
                { num: "8", title: "Kiểm Tra Trạng Thái", desc: "Sau khi hoàn tất thanh toán\\n\\nNhấp 'Kiểm Tra Trạng Thái'\\n\\nXác nhận thanh toán thành công" },
                { num: "9", title: "Xem Thông Tin Thành Viên", desc: "Nhấp menu bên trái\\n\\nChọn 'Thông Tin Của Tôi'\\n\\nXem thông tin chi tiết thành viên" },
                { num: "10", title: "Chỉnh Sửa & Lưu", desc: "Chỉnh sửa và lưu thông tin\\n\\nCó thể sửa: tên người dùng, mật khẩu, địa chỉ, v.v.\\n\\n⚠️ KHÔNG thay đổi email\\n(Nếu không sẽ không nhận được email từ công ty)", warning: true },
                {
                    num: "✓",
                    title: "Chúc Mừng!",
                    desc: "Bạn đã tham gia thành công LiveGood\\n\\nĐể trở thành thành viên của Đội Biến Tiền Hóa Ý Tưởng AI 1200 Lần, vui lòng hoàn thành biểu mẫu thông tin cá nhân (Bước 2 của quy trình 2 bước)",
                    success: true,
                    websites: [
                        { label: "Bảng Điều Khiển", url: "LiveGood.com/tênngườidùng" },
                        { label: "Link Giới Thiệu", url: "LiveGoodTour.com/tênngườidùng" },
                        { label: "Cửa Hàng Lẻ", url: "ShopLiveGood.com/tênngườidùng" }
                    ]
                }
            ]
        },
        'ja-JP': {
            title: "LiveGood 新規会員登録＆有効化ガイド",
            subtitle: "ステップバイステップ完全マニュアル",
            footer: "LiveGood USA | AIアイデア1200倍収益化チーム",
            steps: [
                { num: "1", title: "登録リンクの取得", desc: "紹介者の招待リンクを確認します\\n例：https://LiveGoodTour.com/username" },
                { num: "2", title: "登録開始", desc: "招待リンクをクリックし、氏名（ローマ字）とメールアドレスを入力して仮ポジションを確保します" },
                { num: "3", title: "ポジションのロック", desc: "「Lock Your Position」ボタンをクリックし、次へ進みます" },
                { num: "4", title: "個人情報の入力", desc: "ユーザー名・パスワード・配送先住所を入力し、アフィリエイト登録費＋年会費合計 $139.95（または $180 代行サポートプラン）を選択します" },
                { num: "5", title: "入力内容の確認", desc: "すべての登録情報を確認し、利用規約に同意して次へ進みます" },
                { num: "6", title: "支払い方法の選択", desc: "暗号資産（推奨：USDT TRON/TRC20）またはクレジットカードを選択して決済を行います" },
                { num: "7", title: "重要なお知らせ", desc: "暗号資産で支払う場合は、送金手数料＋0.01 USDT を加味して正確な金額を送金してください", warning: true },
                { num: "8", title: "決済ステータスの確認", desc: "支払い完了後、「Check Status」をクリックして有効化を確認します" },
                { num: "9", title: "会員情報の確認", desc: "左メニューの「My Information」から会員情報を確認します" },
                { num: "10", title: "保存と注意事項", desc: "ユーザー名や住所は変更可能ですが、⚠️ メールアドレスは変更しないでください", warning: true },
                {
                    num: "✓",
                    title: "登録完了！おめでとうございます！",
                    desc: "LiveGood会員登録が完了しました！続けてステップ2のフォームからあなたの紹介コードを送信し、1年間の無料AI自動協播を開始しましょう。",
                    success: true,
                    websites: [
                        { label: "会員ダッシュボード", url: "LiveGood.com/username" },
                        { label: "紹介登録リンク", url: "LiveGoodTour.com/username" },
                        { label: "リテールショップ", url: "ShopLiveGood.com/username" }
                    ]
                }
            ]
        },
        'ko-KR': {
            title: "LiveGood 신규 회원 가입 및 활성화 가이드",
            subtitle: "완벽한 단계별 매뉴얼",
            footer: "LiveGood USA | AI 아이디어 1200배 수익화 팀",
            steps: [
                { num: "1", title: "가입 링크 확인", desc: "추천인의 초대 링크를 확인합니다\\n예: https://LiveGoodTour.com/username" },
                { num: "2", title: "가입 시작", desc: "초대 링크를 클릭하고 영문 성명과 이메일을 입력하여 포지션을 선점합니다" },
                { num: "3", title: "포지션 잠금", desc: "'Lock Your Position' 버튼을 클릭한 후 다음 단계로 이동합니다" },
                { num: "4", title: "개인 정보 입력", desc: "아이디, 비밀번호, 배송 주소를 입력하고 제휴비+연회비 통합 $139.95(또는 $180 전담 대행 플랜)를 선택합니다" },
                { num: "5", title: "정보 확인", desc: "입력한 모든 정보를 확인하고 약관 동의 후 다음을 클릭합니다" },
                { num: "6", title: "결제 수단 선택", desc: "암호화폐(USDT-TRC20 권장) 또는 해외 결제 신용카드로 결제를 진행합니다" },
                { num: "7", title: "중요 안내", desc: "암호화폐 결제 시 거래소 수수료 + 0.01을 포함해 정확한 금액이 입금되도록 주의하세요", warning: true },
                { num: "8", title: "결제 상태 확인", desc: "결제 완료 후 'Check Status'를 클릭하여 활성화를 확인합니다" },
                { num: "9", title: "회원 정보 확인", desc: "좌측 메뉴에서 'My Information'을 선택해 상세 정보를 확인합니다" },
                { num: "10", title: "수정 및 저장 주의사항", desc: "아이디, 비밀번호, 주소는 변경 가능하지만 ⚠️ 이메일 주소는 절대 변경하지 마세요", warning: true },
                {
                    num: "✓",
                    title: "가입 완료! 축하합니다!",
                    desc: "LiveGood 가입이 완료되었습니다! 이어서 2단계 신청 폼에 추천인 코드를 제출하여 1년 무료 AI 자동 홍보 시스템을 가동하세요.",
                    success: true,
                    websites: [
                        { label: "회원 대시보드", url: "LiveGood.com/username" },
                        { label: "추천 가입 링크", url: "LiveGoodTour.com/username" },
                        { label: "소매 쇼핑몰", url: "ShopLiveGood.com/username" }
                    ]
                }
            ]
        }
    };

    const heroHeaderLocaleMap = {
        'zh-TW': { badge: "AI 點子變現商隊 ⚡ 合作互惠計劃", title: "用 AI 幫你全自動陌生開發，邁向被動永續分紅" },
        'zh-CN': { badge: "AI 点子变现商队 ⚡ 合作互惠计划", title: "用 AI 帮你全自动陌生开发，迈向被动永续分红" },
        'en-US': { badge: "AI Idea Monetization Squad ⚡ Mutual Benefit Plan", title: "AI-Powered Automated Lead Generation - Build Long-Term Passive Revenue" },
        'ja-JP': { badge: "AI アイデア収益化チーム ⚡ 相互互恵プラン", title: "AIで24時間全自動集客！継続的なパッシブ収益を構築" },
        'ko-KR': { badge: "AI 아이디어 수익화 팀 ⚡ 상호 호혜 플랜", title: "AI 24시간 전자동 잠재고객 발굴로 지속 가능한 패시브 인컴 구축" },
        'vi-VN': { badge: "Đội Kiếm Tiền Ý Tưởng AI ⚡ Kế Hoạch Hợp Tác Đôi Bên", title: "AI Tự Động Tìm Khách Hàng 24/7 - Xây Dựng Thu Nhập Thụ Động Bền Vững" }
    };

    function getGlobalLocale() {
        return window.__WEIXIANG_LANG__ || localStorage.getItem('lang') || document.documentElement.lang || 'zh-TW';
    }

    function renderGuideSteps(localeCode) {
        const gData = guideContent[localeCode] || guideContent['en-US'];
        const titleEl = document.getElementById('lg-guide-main-title');
        const subEl = document.getElementById('lg-guide-subtitle');
        const footEl = document.getElementById('lg-guide-footer-text');
        const container = document.getElementById('lg-guide-steps-container');
        if (!container || !gData) return;

        if (titleEl) titleEl.textContent = gData.title;
        if (subEl) subEl.textContent = gData.subtitle;
        if (footEl) footEl.textContent = gData.footer;

        container.innerHTML = '';
        gData.steps.forEach(function(step) {
            const stepCard = document.createElement('div');
            stepCard.className = 'step-card' + (step.success ? ' success-card' : '');

            let html = '<div class="step-number">' + step.num + '</div>' +
                       '<div class="step-content">' +
                       '<div class="step-title">' + step.title + '</div>' +
                       '<div class="step-description">' + step.desc + '</div>';

            if (step.warning) {
                html += '<div class="warning">⚠️ ' + step.desc.split('\\n')[0] + '</div>';
            }

            if (step.websites) {
                html += '<div class="website-links">';
                step.websites.forEach(function(site) {
                    html += '<div>✅ ' + site.label + ': <a href="https://' + site.url + '" target="_blank" rel="noopener noreferrer">' + site.url + '</a></div>';
                });
                html += '</div>';
            }

            html += '</div>';
            stepCard.innerHTML = html;
            container.appendChild(stepCard);
        });
    }

    function applyLiveGoodLang(localeCode) {
        const code = localeCode || 'zh-TW';
        const isZh = String(code).toLowerCase().includes('zh');
        const zhBox = document.getElementById('lg-content-zh');
        const enBox = document.getElementById('lg-content-en');

        if (zhBox && enBox) {
            zhBox.style.display = isZh ? 'block' : 'none';
            enBox.style.display = isZh ? 'none' : 'block';
        }

        const headerInfo = heroHeaderLocaleMap[code];
        if (headerInfo) {
            if (isZh) {
                const bZh = document.getElementById('lg-hero-badge-zh');
                const tZh = document.getElementById('lg-hero-title-zh');
                if (bZh) bZh.textContent = headerInfo.badge;
                if (tZh) tZh.textContent = headerInfo.title;
            } else {
                const bEn = document.getElementById('lg-hero-badge-en');
                const tEn = document.getElementById('lg-hero-title-en');
                if (bEn) bEn.textContent = headerInfo.badge;
                if (tEn) tEn.textContent = headerInfo.title;
            }
        }

        const mainSel = document.getElementById('lgMainLangSelect');
        if (mainSel && mainSel.value !== code) mainSel.value = code;

        const guideSel = document.getElementById('lgGuideLangSelect');
        if (guideSel && guideSel.value !== code) guideSel.value = code;

        renderGuideSteps(code);
    }

    const carouselIndices = {
        'portfolioCarousel-zh': 0,
        'portfolioCarousel-en': 0
    };

    function moveCarousel(id, direction) {
        const container = document.getElementById(id);
        if (!container) return;
        const track = container.querySelector('.carousel-track');
        const cards = container.querySelectorAll('.carousel-card');
        const total = cards.length;
        if (!track || total === 0) return;

        const isMobile = window.innerWidth <= 768;
        const maxIndex = Math.max(0, isMobile ? total - 1 : total - 2);

        carouselIndices[id] = (carouselIndices[id] || 0) + direction;
        if (carouselIndices[id] > maxIndex) carouselIndices[id] = 0;
        if (carouselIndices[id] < 0) carouselIndices[id] = maxIndex;

        const shiftPercentage = isMobile ? 100 : 50;
        track.style.transform = 'translateX(-' + (carouselIndices[id] * shiftPercentage) + '%)';
    }

    setTimeout(function() {
        applyLiveGoodLang(getGlobalLocale());

        const mainSel = document.getElementById('lgMainLangSelect');
        if (mainSel) {
            mainSel.onchange = function(e) {
                const chosen = e.target.value;
                applyLiveGoodLang(chosen);
                window.dispatchEvent(new CustomEvent('weixiang-select-lang', { detail: { lang: chosen } }));
            };
        }

        const guideSel = document.getElementById('lgGuideLangSelect');
        if (guideSel) {
            guideSel.onchange = function(e) {
                const chosen = e.target.value;
                applyLiveGoodLang(chosen);
                window.dispatchEvent(new CustomEvent('weixiang-select-lang', { detail: { lang: chosen } }));
            };
        }

        window.addEventListener('weixiang-lang-change', function(e) {
            if (e && e.detail && e.detail.lang) {
                applyLiveGoodLang(e.detail.lang);
            }
        });

        const prevZh = document.getElementById('lgPrevZh');
        const nextZh = document.getElementById('lgNextZh');
        const prevEn = document.getElementById('lgPrevEn');
        const nextEn = document.getElementById('lgNextEn');
        if (prevZh) prevZh.onclick = function() { moveCarousel('portfolioCarousel-zh', -1); };
        if (nextZh) nextZh.onclick = function() { moveCarousel('portfolioCarousel-zh', 1); };
        if (prevEn) prevEn.onclick = function() { moveCarousel('portfolioCarousel-en', -1); };
        if (nextEn) nextEn.onclick = function() { moveCarousel('portfolioCarousel-en', 1); };

        const modal = document.getElementById('lg-guide-modal');
        const closeBtn = document.getElementById('lgGuideCloseBtn');
        wrapper.querySelectorAll('.open-lg-guide-btn').forEach(function(btn) {
            btn.onclick = function() {
                if (modal) {
                    modal.classList.add('open');
                    renderGuideSteps(getGlobalLocale());
                }
            };
        });
        if (closeBtn && modal) {
            closeBtn.onclick = function() { modal.classList.remove('open'); };
            modal.onclick = function(e) {
                if (e.target === modal) modal.classList.remove('open');
            };
        }
    }, 60);
})();
</script>
<!-- === AI 點子變現商隊 - LiveGood 會員訂閱與 AI 自動化協播結束 === -->`;
