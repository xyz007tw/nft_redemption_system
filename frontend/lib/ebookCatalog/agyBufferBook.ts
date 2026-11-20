import type { EBookProject } from '@/lib/ebookEngine';

/**
 * 旗艦暢銷實戰教材：Zero-Code AI Traffic Engine (AGY 對話流 × SEO/GEO × 6 語系 × Buffer 自動發佈)
 * 定價：原價 $39 ｜ 2027 年前優惠價 $27 ｜ VIP 全館月訂閱 $15/月
 * 試閱機制：第 1~2 章免費完整開放（含對話截圖圖解與入門提示詞），第 3~8 章付費解鎖
 */
export const AGY_BUFFER_EBOOK: EBookProject = {
  id: 'ebook-agy-buffer-001',
  author_wallet: '0xea693e358f1527f8aa6563c9f6ebd42e37ee14fc',
  author_name: 'CTO SEN (20年總工程師)',
  author_email: 'xyz007tw@gmail.com',
  author_cta_url: 'https://aitutor.vip/waia',
  author_line_id: 'xyz007tw',
  title_zh: '不寫一行程式！用對話打造你的 24H AI 自動來客流：從 SEO/GEO 爆款寫作到 Buffer 全自動發佈小白實戰',
  title_zh_cn: '不写一行程序！用对话打造你的 24H AI 自动来客流：从 SEO/GEO 爆款写作到 Buffer 全自动发布小白实战',
  title_en: 'Zero-Code AI Traffic Engine: Build Your 24/7 SEO, GEO & Buffer Content Autopilot Using Only Plain Conversation',
  title_ja: 'コードゼロで構築する24時間AI自動集客エンジン：自然言語対話だけでSEO・GEO記事生成からBuffer自動投稿まで完全自動化バイブル',
  title_vi: 'Không Cần Viết Mã! Tự Động Hóa Kênh Lưu Lượng AI 24/7 Bằng Hội Thoại: Từ SEO/GEO Đến Lên Lịch Buffer Cho Người Mới',
  title_id: 'Mesin Trafik AI Tanpa Kode 24/7: Bangun Penulisan SEO/GEO & Publikasi Otomatis Buffer Hanya Dengan Percakapan Sederhana',
  subtitle_zh: 'my_video202605 實戰對話截圖 × 圖表解說｜原價 $39・2027年前限時優惠 $27（第 1~2 章免費試閱）',
  subtitle_zh_cn: 'my_video202605 实战对话截图 × 图表解说｜原价 $39・2027年前限时优惠 $27（第 1~2 章免费试阅）',
  subtitle_en: 'Illustrated AGY Chat Screenshots × System Diagrams | Reg. $39, Pre-2027 Special $27 (Chapters 1-2 Free Preview)',
  subtitle_ja: '実戦AGY対話スクリーンショット×図解｜定価$39・2027年前限定$27（第1〜2章無料公開）',
  subtitle_vi: 'Ảnh Hội Thoại AGY Thực Tế × Sơ Đồ Hệ Thống | Giá gốc $39, Ưu đãi trước 2027 chỉ $27 (Miễn phí Chương 1-2)',
  subtitle_id: 'Tangkapan Layar Dialog AGY × Diagram Sistem | Normal $39, Promo Pra-2027 $27 (Gratis Bab 1-2)',
  lang_pair: 'ZH_EN',
  theme_id: 'tech_blue',
  bilingual_mode: true,
  price_single_usdt: 27,
  price_original_usdt: 39,
  promo_until: '2027-01-01T00:00:00+08:00',
  promo_label_zh: '🔥 2027年前早鳥優惠 $27',
  promo_label_en: '🔥 Pre-2027 Offer $27',
  price_monthly_sub_usdt: 15,
  free_preview_chapters: 2,
  status: 'APPROVED_PUBLISHED',
  cover_image_url: '/images/ebooks/agy-buffer/cover.png',
  r2_published_urls: {
    primary_url: 'https://nft1314.party/api/ebook/reader?bookId=ebook-agy-buffer-001',
    mirror_url: 'https://nft1314.party/ebook-store?book=ebook-agy-buffer-001',
    uploaded_at: '2026-11-20T18:00:00Z'
  },
  submitted_at: '2026-11-20T17:30:00Z',
  reviewed_at: '2026-11-20T18:00:00Z',
  review_note: '官方旗艦實戰新書（含第1~2章免費試閱與2027年前$27早鳥優惠）',
  created_at: '2026-11-20T17:00:00Z',
  updated_at: '2026-11-20T18:00:00Z',
  chapters: [
    {
      id: 'agy-ch-1',
      title_zh: '第一章（免費試閱）：別再背指令了！為什麼「跟 AI 聊天」就是最強的自動化工廠？',
      title_zh_cn: '第一章（免费试阅）：别再背指令了！为什么“跟 AI 聊天”就是最强的自动化工厂？',
      title_en: 'Chapter 1 (Free Preview): Stop Memorizing Syntax—Why Talking to AI Is the Ultimate Automation Factory',
      title_ja: '第1章（無料公開）：コマンド暗記は不要！AIとの「会話」こそが最強の自動化工場である理由',
      title_vi: 'Chương 1 (Miễn Phí): Ngừng Học Thuộc Lệnh! Vì Sao Trò Chuyện Với AI Là Nhà Máy Tự Động Hóa Tối Thượng?',
      title_id: 'Bab 1 (Gratis): Berhenti Menghafal Kode! Mengapa Berbicara Dengan AI Adalah Pabrik Otomatisasi Terkuat?',
      content_zh: `許多想做自媒體、跨境電商或知識變現的新手，一聽到「SEO 自動寫作」、「Buffer API 自動排程」，腦袋裡立刻浮現密密麻麻的黑色程式碼視窗，接著就直接放棄了。但擁有 20 年系統架構經驗的我想告訴你一個秘密：在 Antigravity (AGY) 的雙向對話工作區裡，寫程式已經從「手寫語法」變成了「餐廳點菜」。

你不需要自己進廚房開火（寫 Python 或 JavaScript），你只需要學會當一個「清楚表達需求的老闆」。就像我們在 my_video202605 這套實戰系統中驗證過的：只要在對話框用最日常的台灣白話文講清楚目標、限制與驗收條件，AGY 就會主動幫你拆解成「最高憲法規範（GEMINI.md）」、「SEO/GEO 文案造血機」、「6 大語系在地化引擎」以及「Buffer 全自動排程發佈器」四大核心模組。

【圖表對照解說】請看上方架構對比圖：左邊是傳統工程師花半年才寫得出來的脆弱腳本；右邊則是我們用 AGY 自然語言小白版「點菜式開發」的四段流水線。只要先把架構想清楚，每一塊都能交給 AI 在幾分鐘內落地完成！

【小白複製即可用提示卡①】
「我完全不會寫程式，但我希望建立一個自動幫我寫文章並排程發到社群的工具。在寫任何程式前，請先用白話文跟我確認我們需要哪幾個資料夾，並幫我列出一份簡單的執行步驟計畫，等我看懂說好再動手。」

【20年架構師避坑提醒】千萬不要一開對話框就喊「幫我做一個全自動系統」！大需求一定要先讓 AI 列出階段清單，這才是零基礎學員不翻車的第一條鐵律。`,
      content_zh_cn: `许多想做自媒体、跨境电商或知识变现的新手，一听到“SEO 自动写作”、“Buffer API 自动排程”，脑袋里立刻浮现密密麻麻的黑色程序代码窗口，接着就直接放弃了。但拥有 20 年系统架构经验的我想告诉你一个秘密：在 Antigravity (AGY) 的双向对话工作区里，写程序已经从“手写语法”变成了“餐厅点菜”。

你不需要自己进厨房开火（写 Python 或 JavaScript），你只需要学会当一个“清楚表达需求的老板”。就像我们在 my_video202605 这套实战系统中验证过的：只要在对话框用最日常的大白话讲清楚目标、限制与验收条件，AGY 就会主动帮你拆解成“最高宪法规范（GEMINI.md）”、“SEO/GEO 文案造血机”、“6 大语系本地化引擎”以及“Buffer 全自动排程发布器”四大核心模块。

【图表对照解说】请看上方架构对比图：左边是传统工程师花半年才写得出来的脆弱脚本；右边则是我们用 AGY 自然语言小白版“点菜式开发”的四段流水线。只要先把架构想清楚，每一块都能交给 AI 在几分钟内落地完成！

【小白复制即可用提示卡①】
“我完全不会写程序，但我希望建立一个自动帮我写文章并排程发到社群的工具。在写任何程序前，请先用大白话跟我确认我们需要哪几个文件夹，并帮我列出一份简单的执行步骤计划，等我看懂说好再动手。”

【20年架构师避坑提醒】千万不要一开对话框就喊“帮我做一个全自动系统”！大需求一定要先让 AI 列出阶段清单，这才是零基础学员不翻车的第一条铁律。`,
      content_en: `When beginners hear terms like "automated SEO writing" or "Buffer API scheduling," they immediately picture intimidating black terminal windows packed with cryptic code—and give up before starting. After 20 years of building automated software systems, let me share a core truth: inside an Antigravity (AGY) bidirectional workspace, building software has shifted from "memorizing syntax" to "ordering from a head chef."

You don't have to cook in the kitchen (hand-coding Python or Node.js). You simply need to state what outcome you want clearly, like a decisive founder. As proven in our production workspace (my_video202605), speaking to AGY in plain conversation lets the AI scaffold four industrial-grade modules for you: the System Constitution (GEMINI.md), the SEO/GEO Content Generator, the 6-Language Localization Engine, and the Buffer Auto-Publisher.

[Diagram Walkthrough] Compare the red left card with the emerald right card above: the old way breaks whenever an API changes; the plain-English AGY workflow keeps every stage modular, readable, and self-healing.

[Copy-Paste Beginner Prompt #1]
"I have zero coding background, and I want to build a pipeline that drafts SEO/GEO articles and schedules them to Buffer. Before writing any code, explain in plain English what folders we need and give me a step-by-step plan for approval first."

[20-Year Architect Pitfall Warning] Never shout "Build me a complete automation system!" in one prompt. Always ask AGY to propose a plain-language plan before editing any files.`,
      content_ja: `SNS集客やコンテンツ販売を始めたい初心者の多くは、「SEO自動執筆」や「Buffer API連携」と聞いた瞬間に難解な黒いコード画面を想像して諦めてしまいます。しかし、20年のシステム設計経験を持つ立場からお伝えしたいのは、Antigravity（AGY）の対話ワークスペースではプログラミングが「構文の暗記」から「一流シェフへのオーダー」に変わったという事実です。

自分でコードを書く必要はありません。必要なのは「何を自動化したいか」を日本語で明確に伝える経営者視点だけです。私たちの実証環境（my_video202605）で検証された通り、AGYに普段の言葉で指示するだけで、システム憲法（GEMINI.md）、SEO/GEO記事生成、6言語ローカライズ、Buffer自動予約投稿の4大モジュールを数分で構築できます。

【図解解説】上図の左側（従来の開発）はAPI変更に弱く膨大な学習コストがかかりますが、右側（AGY自然言語フロー）は各工程が独立しており、エラーが出てもAIが自己修復できます。

【初心者向けコピペ用プロンプト①】
「プログラミングは未経験ですが、SEO/GEO記事を作成してBufferに自動予約投稿する仕組みを作りたいです。コードを書く前に、必要なフォルダ構成とステップ計画をわかりやすい日本語で提案し、私の承認を待ってください。」`,
      content_vi: `Nhiều người mới làm MMO hay thương mại điện tử thường bỏ cuộc ngay khi nghe đến "viết SEO tự động" hay "kết nối API Buffer" vì nghĩ phải biết lập trình. Với 20 năm kinh nghiệm kiến trúc hệ thống, tôi khẳng định: trong không gian đối thoại Antigravity (AGY), việc phát triển phần mềm đã chuyển từ "gõ code" sang "đặt món với bếp trưởng".

Bạn chỉ cần diễn đạt mục tiêu bằng tiếng Việt tự nhiên. Như đã chứng minh trong hệ thống thực chiến my_video202605, AGY sẽ tự động tách thành 4 mô-đun: Quy tắc gốc (GEMINI.md), Động cơ viết SEO/GEO, Hệ thống bản địa hóa 6 ngôn ngữ và Bộ lập lịch tự động lên Buffer.

[Câu Lệnh Mẫu Dành Cho Người Mới #1]
"Tôi không biết viết code, nhưng muốn xây dựng luồng tự động viết bài SEO/GEO và lên lịch đăng lên Buffer. Trước khi viết bất kỳ mã nào, hãy giải thích bằng ngôn ngữ đơn giản chúng ta cần những thư mục nào và lập kế hoạch từng bước để tôi duyệt trước."`,
      content_id: `Banyak pemula bisnis digital langsung menyerah saat mendengar "penulisan SEO otomatis" atau "API Buffer" karena membayangkan baris kode yang rumit. Dengan pengalaman 20 tahun membangun sistem otomatis, saya tegaskan: di dalam ruang obrolan Antigravity (AGY), membuat sistem telah berubah dari "menghafal sintaks" menjadi "memesan menu ke koki ahli".

Anda cukup menjelaskan tujuan dengan bahasa sehari-hari. Seperti yang telah terbukti di my_video202605, AGY mampu merancang 4 modul inti secara otomatis: Konstitusi Sistem (GEMINI.md), Penulis SEO/GEO, Lokalisasi 6 Bahasa, dan Penjadwal Otomatis Buffer.

[Kartu Prompt Pemula #1]
"Saya tidak bisa coding sama sekali, tetapi ingin membuat alur otomatis menulis artikel SEO/GEO dan menjadwalkannya ke Buffer. Sebelum menulis kode apa pun, jelaskan dengan bahasa sederhana folder apa yang dibutuhkan dan buat rencana langkah demi langkah untuk saya setujui."`,
      image_url: '/images/ebooks/agy-buffer/ch1_diagram.png',
      image_caption: '圖 1-1｜傳統寫程式 vs. AGY 自然語言小白「點菜式開發」與 4 大核心模組對比圖',
      references: [
        { title: 'Google Search Central: Creating Helpful, Reliable, People-First Content', url: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content' },
        { title: 'my_video202605 Architecture Blueprint (GEMINI.md)', url: 'https://nft1314.party/ebook-store' }
      ]
    },
    {
      id: 'agy-ch-2',
      title_zh: '第二章（免費試閱）：實戰起手式——用「自然語言小白版」跟 AGY 下第一道架構指令',
      title_zh_cn: '第二章（免费试阅）：实战起手式——用“自然语言小白版”跟 AGY 下第一道架构指令',
      title_en: 'Chapter 2 (Free Preview): Your First Live Prompt—Establishing the AI Constitution & Folder Architecture',
      title_ja: '第2章（無料公開）：実践スターター——自然な言葉でAGYに最初の「憲法とフォルダ構成」を作らせる方法',
      title_vi: 'Chương 2 (Miễn Phí): Khởi Động Thực Chiến—Ra Lệnh Thiết Lập Quy Tắc & Thư Mục Đầu Tiên Cho AGY',
      title_id: 'Bab 2 (Gratis): Langkah Awal Praktis—Memberi Perintah Pertama Kepada AGY Untuk Membuat Aturan & Folder',
      content_zh: `為什麼一般人用 AI 寫自動化工具，今天寫完、明天改一下就整個壞掉？答案很簡單：因為你沒有幫專案建立「憲法（最高指導原則）」。在實戰工作區中，所有能 24 小時穩定跑的流水線，第一步都不是寫腳本，而是先讓 AGY 幫你建立一份系統規則檔（例如 GEMINI.md）和乾淨的資料夾。

【對應 AGY 對話截圖① 解說】請仔細看上圖左側的真實對話視窗，我們標註了 ① ② ③ 三個關鍵互動節點：
• 標註 ①（你說的話）：你只用三句話指定「建立規則檔、規定寫作與 Buffer 發佈都要照著目錄走、先別亂改舊檔案」。注意最後那句「先別亂改舊檔」，能保護你既有的心血不被誤刪。
• 標註 ②（AGY 背後動作）：AGY 自動呼叫 write_file 建立 GEMINI.md，並開好 V2_Workspace/Article_Pool 資料夾。
• 標註 ③（AI 回報驗收）：AI 清楚列出建立了哪幾個規範，包含「主題去重紀錄」與「金鑰安全隔離」。

這一步完成後，以後無論你開了多少個新對話視窗、換了多少個子代理，AI 一進場就會先讀這份「憲法」，再也不會忘記你的文章要寫給誰看、圖片要放哪裡、或是不小心把重複的主題又寫一遍！

【小白複製即可用提示卡②】
「請幫我在工作區根目錄建立一份系統規範檔 GEMINI.md，設定以下規則：1. 所有待寫主題與完稿文章統一放在 Article_Pool 資料夾；2. 每次產出新文章前必須檢查 published_topics_history.txt 絕對不寫重複主題；3. 禁止把 API 密碼直接寫死在程式碼內。請建立完成後回報檔案清單給我。」

🔒 【讀完前兩章，你已經看見自然語言開發的威力！從第三章開始，我們將進入雙向 PDCA 提問心法、SEO+GEO 雙引擎結構設計、6 大語系文化轉譯以及 Buffer GraphQL 自動排程發佈實戰，立即解鎖全書與全套提示卡！】`,
      content_zh_cn: `为什么一般人用 AI 写自动化工具，今天写完、明天改一下就整个坏掉？答案很简单：因为你没有帮项目建立“宪法（最高指导原则）”。在实战工作区中，所有能 24 小时稳定跑的流水线，第一步都不是写脚本，而是先让 AGY 帮你建立一份系统规则档（例如 GEMINI.md）和干净的文件夹。

【对应 AGY 对话截图① 解说】请仔细看上图左侧的真实对话窗口，我们标注了 ① ② ③ 三个关键互动节点：
• 标注 ①（你说的话）：你只用三句话指定“建立规则档、规定写作与 Buffer 发布都要照着目录走、先别乱改旧文件”。注意最后那句“先别乱改旧档”，能保护你既有的心血不被误删。
• 标注 ②（AGY 背后动作）：AGY 自动呼叫 write_file 建立 GEMINI.md，并开好 V2_Workspace/Article_Pool 文件夹。
• 标注 ③（AI 回报验收）：AI 清楚列出建立了哪几个规范，包含“主题去重记录”与“密钥安全隔离”。

这一步完成后，以后无论你开了多少个新对话窗口、换了多少个子代理，AI 一进场就会先读这份“宪法”，再也不会忘记你的文章要写给谁看、图片要放哪里、或是不小心把重复的主题又写一遍！

【小白复制即可用提示卡②】
“请帮我在工作区根目录建立一份系统规范档 GEMINI.md，设定以下规则：1. 所有待写主题与完稿文章统一放在 Article_Pool 文件夹；2. 每次产出新文章前必须检查 published_topics_history.txt 绝对不写重复主题；3. 禁止把 API 密码直接写死在程序代码内。请建立完成后回报文件清单给我。”

🔒 【读完前两章，你已经看见自然语言开发的威力！从第三章开始，我们将进入双向 PDCA 提问心法、SEO+GEO 双引擎结构设计、6 大语系文化转译以及 Buffer GraphQL 自动排程发布实战，立即解锁全书与全套提示卡！】`,
      content_en: `Why do most beginner AI automation scripts break the very next day after a minor tweak? Because there is no shared "Constitution" governing the workspace. In every resilient production pipeline, Step 1 is never writing logic—it is instructing AGY to create a permanent rulebook (such as GEMINI.md) and a clean folder boundary.

[AGY Screenshot #1 Walkthrough] Look closely at callouts ①, ②, and ③ on the left panel above:
• Callout ① (Your Plain-English Prompt): You state three simple rules—create the master rulebook, separate topic queues from finished articles, and never touch unrelated legacy files.
• Callout ② (AGY Tool Execution): AGY automatically invokes write_file to author GEMINI.md and scaffolds V2_Workspace/Article_Pool cleanly.
• Callout ③ (AI Verification Reply): AGY confirms exact paths, topic deduplication history tracking, and secret isolation rules.

Once this constitution is in place, even if you start a brand-new chat thread next week, AGY automatically obeys your exact rules without forgetting your niche, target languages, or deduplication history!

[Copy-Paste Beginner Prompt #2]
"Create a master rulebook file named GEMINI.md at the workspace root with these rules: 1. Keep all pending topics and finished articles inside Article_Pool/; 2. Always check published_topics_history.txt before generating new copy so no topic is repeated; 3. Never hardcode API tokens inside scripts. Confirm the created files once done."

🔒 [Unlock Chapters 3–8 below to get the complete Bidirectional PDCA Playbook, SEO+GEO Dual-Engine Templates, 6-Language Localization Architecture, Buffer Auto-Scheduler Prompts, and Monetization Blueprint!]`,
      content_ja: `初心者がAIで作った自動化ツールが「次の日に少し直しただけで壊れる」最大の理由は、プロジェクトの「憲法（基本ルールブック）」が存在しないからです。24時間安定稼働するパイプラインでは、コードを書く前にまずAGYにルールファイル（GEMINI.md）とフォルダ構造を作らせます。

【AGY対話スクリーンショット①解説】上図左側の①②③に注目してください。
• ①（ユーザーの自然言語指示）：「ルールブックを作成し、記事プールと履歴管理フォルダを分け、既存ファイルには触れないで」と3行で伝えるだけです。
• ②（AGYの自動実行）：AGYが自律的にwrite_fileを呼び出し、GEMINI.mdとV2_Workspace/Article_Poolを構築します。
• ③（完了レポート）：重複防止とAPIキー保護のルールまで確実に組み込まれたことが確認できます。

【コピペ用プロンプト②】
「ルートディレクトリにGEMINI.mdを作成し、1. 記事は全てArticle_Poolに保存、2. 新規作成前に必ずpublished_topics_history.txtを確認し重複禁止、3. APIトークンをコードに直接書かない、の3原則を設定してください。」`,
      content_vi: `Tại sao các công cụ tự động hóa do người mới làm bằng AI hôm nay chạy được, ngày mai sửa nhẹ lại hỏng? Bởi vì bạn chưa thiết lập "Hiến pháp" cho dự án. Bước 1 không phải là viết script, mà là yêu cầu AGY tạo file quy tắc GEMINI.md và cấu trúc thư mục sạch sẽ.

[Giải thích ảnh chụp hội thoại AGY #1] Hãy nhìn vào 3 điểm đánh dấu ① ② ③ bên trái: bạn chỉ cần ra lệnh bằng ngôn ngữ tự nhiên (không chạm vào file cũ), AGY tự động tạo GEMINI.md và thư mục Article_Pool đồng thời thiết lập cơ chế chống trùng lặp chủ đề.

[Câu Lệnh Mẫu #2]
"Hãy tạo file quy tắc gốc GEMINI.md với 3 điều kiện: 1. Lưu bài viết trong thư mục Article_Pool; 2. Luôn đối chiếu published_topics_history.txt để không trùng chủ đề; 3. Tuyệt đối không viết cứng mã khóa API vào trong code."`,
      content_id: `Mengapa sistem otomatisasi pemula sering rusak keesokan harinya setelah sedikit perubahan? Karena tidak ada "Konstitusi" yang mengatur ruang kerja. Langkah pertama bukanlah menulis script, melainkan meminta AGY membuat file aturan GEMINI.md dan struktur folder yang rapi.

[Penjelasan Tangkapan Layar AGY #1] Perhatikan tanda ① ② ③ di sebelah kiri: Anda cukup memberi instruksi bahasa sehari-hari, lalu AGY otomatis membuat GEMINI.md beserta folder Article_Pool dan mekanisme anti-duplikasi topik.

[Kartu Prompt Pemula #2]
"Buatkan file aturan utama GEMINI.md dengan ketentuan: 1. Simpan semua draf di folder Article_Pool; 2. Selalu cek published_topics_history.txt agar tidak menulis topik berulang; 3. Dilarang menulis token API langsung di dalam kode."`,
      image_url: '/images/ebooks/agy-buffer/ch2_agy_chat.png',
      image_caption: '圖 2-1｜AGY 對話截圖① × 系統架構圖：小白三句話建立 GEMINI.md 憲法與安全資料夾',
      references: [
        { title: 'Google Antigravity Customization & GEMINI.md Rules Spec', url: 'https://nft1314.party/ebook-store' },
        { title: 'Clean Architecture Separation of Concerns', url: 'https://martinfowler.com/architecture/' }
      ]
    },
    {
      id: 'agy-ch-3',
      title_zh: '第三章：雙向設計心法——怎麼跟 AGY「一問一答」把需求逼出工業級規格？',
      title_zh_cn: '第三章：双向设计心法——怎么跟 AGY “一问一答”把需求逼出工业级规格？',
      title_en: 'Chapter 3: Bidirectional Prompt Engineering—Using Q&A Loops to Force Industrial-Grade Specs',
      title_ja: '第3章：双方向対話の極意——AGYとのQ&Aで要件をプロ品質へ引き上げるPDCA対話術',
      title_vi: 'Chương 3: Nghệ Thuật Thiết Kế Hai Chiều—Hỏi Đáp Với AGY Để Ép Ra Thông Số Chuẩn Công Nghiệp',
      title_id: 'Bab 3: Seni Desain Dua Arah—Tanya Jawab Dengan AGY Untuk Menghasilkan Spesifikasi Standar Industri',
      content_zh: `很多新手把 AI 當成「許願池」——丟一句話就期待它一次把全套產品變出來；結果 AI 漏東漏西、猜錯你的意思，最後寫出一堆不能動的程式。真正的 20 年資深工程師，把 AGY 當成「雙向設計合夥人」，強制執行 **PDCA 對話四拍節奏 (Plan → Do → Check → Act)**。

【對應 AGY 對話截圖② 解說】看上圖對話框如何進行「逼出工業級規格」的一問一答：
• 標註 ①（鎖定先想後做）：你在指令結尾加上關鍵護欄——「請先設計提案方略與測試方案，確認後再寫程式」。
• 標註 ②（AI 唯讀勘查）：AGY 不會魯莽覆蓋檔案，而是先用 read_file 與搜尋指令盤點你目前的資料夾與環境。
• 標註 ③（條列規劃待審）：AI 回覆四階段藍圖並列出「先測試 1 篇草稿進 Buffer」的驗收門檻。

只要學會這招，哪怕你看不懂任何一行程式語言，也能透過「要求 AI 先講清楚計畫、要求 AI 自己跑一次單篇測試、把測試成功截圖給我看」，牢牢掌控系統品質！

【小白複製即可用提示卡③】
「針對剛規劃好的寫文與 Buffer 發佈流，請先提出你的完整設計方略：1. 預計新增或修改哪些檔案？2. 如何保證網路斷線或限流時不會當機？3. 完成後你會怎麼測試給我看？先不要寫程式，回覆方案讓我確認。」

【20年架構師避坑提醒】當 AGY 一次想改超過 5 個檔案時，立刻喊停！「每次只讓我驗收一個小功能」，永遠比「一次生成整個專案卻找不到哪裡壞掉」快十倍。`,
      content_zh_cn: `很多新手把 AI 当成“许愿池”——丢一句话就期待它一次把全套产品变出来；结果 AI 漏东漏西、猜错你的意思，最后写出一堆不能动的程序。真正的 20 年资深工程师，把 AGY 当成“双向设计合伙人”，强制执行 PDCA 对话四拍节奏 (Plan -> Do -> Check -> Act)。

【对应 AGY 对话截图② 解说】看上图对话框如何进行“逼出工业级规格”的一问一答：
• 标注 ①（锁定先想后做）：你在指令结尾加上关键护栏——“请先设计提案方略与测试方案，确认后再写程序”。
• 标注 ②（AI 只读勘查）：AGY 不会鲁莽覆盖文件，而是先用 read_file 与搜索指令盘点你目前的文件夹与环境。
• 标注 ③（条列规划待审）：AI 回复四阶段蓝图并列出“先测试 1 篇草稿进 Buffer”的验收门槛。

【小白复制即可用提示卡③】
“针对刚规划好的写文与 Buffer 发布流，请先提出你的完整设计方略：1. 预计新增或修改哪些文件？2. 如何保证网络断线或限流时不会当机？3. 完成后你会怎么测试给我看？先不要写程序，回复方案让我确认。”`,
      content_en: `Beginners often treat AI like a wishing well—tossing one vague request and hoping for a finished product. Instead, veteran architects treat AGY as a bidirectional design partner enforcing a strict **PDCA Loop (Plan -> Do -> Check -> Act)**.

[AGY Screenshot #2 Walkthrough] Notice how callouts ①, ②, and ③ prevent brittle code:
• Callout ① (Plan Guardrail): End your prompt with "Design the blueprint and verification test plan first; do not edit code until I approve."
• Callout ② (Read-Only Audit): AGY inspects existing scripts cleanly before proposing changes.
• Callout ③ (Clear Milestone Proposal): You review the safety checks and Buffer single-post test plan in plain English before any code runs.

[Copy-Paste Beginner Prompt #3]
"For this writing-to-Buffer pipeline, propose your design plan first without editing code: 1. Which files will be created? 2. How do we prevent crashes on network timeouts? 3. How will you run a 1-post verification test to prove it works?"`,
      content_ja: `初心者はAIを「魔法のランプ」のように扱いがちですが、プロの設計者はAGYを対等なパートナーとして「PDCA対話ループ（計画→実行→検証→改善）」を回します。

【AGY対話スクリーンショット②解説】上図のように「コードを書く前に計画書とテスト方法だけ先に提案して」と指示することで、AIが既存環境を読み取り、安全な設計図を日本語で提示してくれます。

【コピペ用プロンプト③】
「記事作成からBuffer投稿までの設計プランを、まだコードを書かずに提案してください：1. 作成ファイル一覧、2. 通信エラー時の自動リトライ対策、3. 本番前に1件だけテスト確認する方法。」`,
      content_vi: `Người mới hay coi AI như chiếc đũa thần—nhập một câu và mong có ngay sản phẩm hoàn chỉnh. Kiến trúc sư 20 năm kinh nghiệm luôn ép AGY chạy theo vòng lặp **PDCA (Lập kế hoạch -> Thực thi -> Kiểm tra -> Cải tiến)** trước khi đụng vào file.

[Câu Lệnh Mẫu #3]
"Đối với quy trình viết bài và đăng lên Buffer này, hãy trình bày phương án thiết kế trước (chưa viết code): 1. Sẽ tạo những file nào? 2. Cách chống treo khi mạng lỗi? 3. Cách chạy thử nghiệm 1 bài để chứng minh thành công?"`,
      content_id: `Pemula sering memperlakukan AI seperti lampu ajaib—memberi satu perintah singkat lalu berharap sistem langsung jadi. Arsitek berpengalaman mewajibkan AGY menjalankan siklus **PDCA (Plan -> Do -> Check -> Act)** sebelum mengubah file.

[Kartu Prompt Pemula #3]
"Untuk alur penulisan ke Buffer ini, buatkan rencana desain terlebih dahulu tanpa menulis kode: 1. File apa saja yang akan dibuat? 2. Bagaimana mencegah error saat jaringan terputus? 3. Bagaimana cara menguji 1 draf postingan untuk membuktikan keberhasilannya?"`,
      image_url: '/images/ebooks/agy-buffer/ch3_agy_pdca.png',
      image_caption: '圖 3-1｜AGY 對話截圖② × 雙向 PDCA 圖解：先談方略再寫碼，小白照樣掌控工業級品質',
      references: [
        { title: 'W. Edwards Deming PDCA Quality Management Cycle', url: 'https://deming.org/' }
      ]
    },
    {
      id: 'agy-ch-4',
      title_zh: '第四章：寫出會被 Google 與 AI 推薦的文章——SEO + GEO 文案自動生蛋流規劃',
      title_zh_cn: '第四章：写出会被 Google 与 AI 推荐的文章——SEO + GEO 文案自动生蛋流规划',
      title_en: 'Chapter 4: Writing Articles Loved by Both Google & AI—Architecting the SEO + GEO Dual Content Engine',
      title_ja: '第4章：Google検索とAI回答の両方に選ばれる！SEO＋GEO二重構造コンテンツ自動生成設計',
      title_vi: 'Chương 4: Viết Bài Chuẩn Google Lẫn AI Gợi Ý—Thiết Kế Động Cơ Văn Bản Kép SEO + GEO',
      title_id: 'Bab 4: Menulis Artikel Yang Direkomendasikan Google & AI—Merancang Mesin Konten Ganda SEO + GEO',
      content_zh: `2026 年做自媒體流量，只懂傳統 **SEO（搜尋引擎排名）** 已經不夠了！越來越多人直接問 ChatGPT、Gemini 或 Perplexity：「哪套自動化播放器最輕巧？」、「什麼軟體免安裝最好用？」。想讓 AI 主動把你的品牌寫進答案裡，你必須導入 **GEO（Generative Engine Optimization，生成式引擎優化）**！

在 my_video202605 產線（參考 scripts/bulk_en_next.py 的零歷史記憶去重設計）中，我們讓 AGY 寫出的每一篇母文案都強制具備三層黃金結構：
1. **題庫去重護欄**：先讀取 published_topics_history.txt，確保 365 天絕不寫出「換湯不換藥」的重複題材。
2. **SEO 搜尋結構層**：包含精準 H1 主標題、長尾關鍵字 H2/H3 段落與高價值實測數據。
3. **GEO AI 引用層**：開頭先給一段 **60 字高密度「核心結論定義盒 (Answer Box)」**，並於文末嵌入 **3~5 組真實 FAQ 問答與權威來源引述**——這正是大型語言模型爬蟲最喜歡擷取並署名的結構！

【小白複製即可用提示卡④】
「請幫我設計一個『SEO + GEO 長文案自動生成腳本』：每次執行時先讀取歷史標題檔避開重複主題；文章開頭必須有 60 字精準結論摘要（讓 AI 搜尋引擎直接引用），正文採用 H2/H3 關鍵字架構並附上 3 個真實讀者 FAQ 問答與 CTA 導流段。」

【20年架構師避坑提醒】絕對不要讓 AI 自己憑空捏造假數據或假權威網站！在指令中明確要求「只引用我們提供的連結或已知權威官方機構名稱」，才不會損害品牌信譽。`,
      content_zh_cn: `2026 年做自媒体流量，只懂传统 **SEO（搜索引擎排名）** 已经不够了！越来越多人直接问 ChatGPT、Gemini 或 Perplexity：“哪套自动化工具最轻量？”、“什么方案最好用？”。想让 AI 主动把你的品牌写进答案里，你必须导入 **GEO（Generative Engine Optimization，生成式引擎优化）**！

在 my_video202605 产线（参考 scripts/bulk_en_next.py 的零历史记忆去重设计）中，我们让 AGY 写出的每一篇母文案都强制具备三层黄金结构：
1. **题库去重护栏**：先读取 published_topics_history.txt，确保 365 天绝不写出重复题材。
2. **SEO 搜索结构层**：包含精准 H1 主标题、长尾关键字 H2/H3 段落与实测数据。
3. **GEO AI 引用层**：开头先给一段 **60 字高密度“核心结论定义盒”**，文末嵌入 **3~5 组 FAQ 问答与权威来源引述**——这正是 AI 最喜欢撷取并署名的结构！

【小白复制即可用提示卡④】
“请帮我设计一个‘SEO + GEO 长文案自动生成脚本’：每次执行时先读取历史标题档避开重复主题；文章开头必须有 60 字精准结论摘要（让 AI 搜索引擎直接引用），正文采用 H2/H3 关键字架构并附上 3 个 FAQ 问答与 CTA 导流段。”`,
      content_en: `In 2026 and beyond, ranking only for traditional **SEO** is half the battle. Millions of buyers now ask ChatGPT, Gemini, and Perplexity directly for recommendations. To make AI answer engines cite your brand, every article needs **GEO (Generative Engine Optimization)**.

Inspired by scripts/bulk_en_next.py in my_video202605, our plain-English AGY workflow enforces a 3-layer blueprint:
1. **Strict Topic Deduplication**: Check published_topics_history.txt before drafting so zero duplicate angles are written.
2. **SEO Scannable Spine**: Long-tail H1/H2/H3 hierarchy, concrete comparisons, and high dwell-time formatting.
3. **GEO Citation Magnet**: Open with a crisp 60-word direct "Answer Summary" plus structured FAQ blocks and verifiable references—precisely what AI search models love to quote!

[Copy-Paste Beginner Prompt #4]
"Build an automated SEO + GEO article generator script: read our published history file first to guarantee zero duplicate topics, start every article with a crisp 60-word direct Answer Box for AI search engines, use H2/H3 keyword subheadings, and end with 3 practical FAQs plus our call-to-action."`,
      content_ja: `これからの集客では従来のSEOだけでなく、ChatGPTやGeminiなどの生成AIに自社ブランドを推薦・引用させる「GEO（生成エンジン最適化）」が不可欠です。

my_video202605の実戦パイプラインに基づき、すべての元記事に「重複チェック」「SEO見出し階層」「冒頭60字の結論サマリー＋FAQ構造（GEO引用マグネット）」を組み込ませます。

【コピペ用プロンプト④】
「履歴ファイルを照合して重複トピックを完全に避け、冒頭にAI検索が引用しやすい要約ボックス、本文にH2/H3のSEO構造、末尾にFAQ3問とCTAを含む記事自動生成スクリプトを作成してください。」`,
      content_vi: `Năm 2026, chỉ làm SEO cho Google là chưa đủ! Ngày càng nhiều khách hàng hỏi thẳng ChatGPT hay Gemini. Để AI chủ động đề xuất thương hiệu của bạn, bài viết bắt buộc phải chuẩn **GEO (Tối ưu hóa Công cụ Tạo sinh)** với hộp tóm tắt 60 từ ngay đầu bài, bảng so sánh số liệu và cụm FAQ cuối bài.

[Câu Lệnh Mẫu #4]
"Hãy tạo công cụ sinh bài viết chuẩn SEO + GEO: đọc file lịch sử để chống trùng chủ đề, mở đầu bằng đoạn tóm tắt 60 từ chuẩn AI trích dẫn, phân cấp thẻ H2/H3 và kết thúc bằng 3 câu hỏi FAQ cùng lời kêu gọi hành động CTA."`,
      content_id: `Di era pencarian AI, mengandalkan SEO tradisional saja tidak cukup. Agar merek Anda dikutip langsung oleh ChatGPT dan Gemini, artikel wajib menerapkan struktur **GEO (Generative Engine Optimization)** berupa kotak kesimpulan ringkas 60 kata di paragraf awal serta FAQ terstruktur di akhir artikel.

[Kartu Prompt Pemula #4]
"Buatkan skrip penulis artikel otomatis SEO + GEO: baca riwayat topik agar tidak duplikat, awali dengan ringkasan jawaban 60 kata untuk mesin AI, gunakan struktur subjudul H2/H3, dan tutup dengan 3 FAQ beserta CTA."`,
      image_url: '/images/ebooks/agy-buffer/ch4_seo_geo.png',
      image_caption: '圖 4-1｜AGY 對話截圖③ × SEO + GEO 雙引擎文案自動生成與去重架構',
      references: [
        { title: 'Princeton & Georgia Tech Research: GEO Generative Engine Optimization', url: 'https://arxiv.org/abs/2311.09735' },
        { title: 'Schema.org FAQPage & Article Structured Data', url: 'https://schema.org/FAQPage' }
      ]
    },
    {
      id: 'agy-ch-5',
      title_zh: '第五章：一魚六吃的魔法——從單一母文案自動轉譯為全球 6 大語系在地化架構',
      title_zh_cn: '第五章：一鱼六吃的魔法——从单一母文案自动转译为全球 6 大语系本地化架构',
      title_en: 'Chapter 5: One Master Draft, Six Global Markets—Native Localization Beyond Machine Translation',
      title_ja: '第5章：1本の記事から世界6言語市場を制覇！機械翻訳を超えたネイティブ・ローカライズ自動変換',
      title_vi: 'Chương 5: Một Bản Gốc, Sáu Thị Trường—Bản Địa Hóa Tự Động Chuẩn Văn Hóa Bản Xứ',
      title_id: 'Bab 5: Satu Naskah Induk, Enam Pasar Global—Lokalisasi Native Otomatis Melampaui Terjemahan Mesin',
      content_zh: `如果你只用單一語系發文章，等同於放棄了全球 85% 的潛在買家！但傳統請翻譯社翻譯一篇 2,000 字長文，翻成 6 種語言可能就要台幣上萬元；就算自己丟進免費翻譯網頁複製貼上，翻出來的日文沒禮貌、越南文像機器人，發出去反而毀掉專業品牌形象。

在 my_video202605（參照 scripts/run_smart_translator.py 架構）中，我們教 AGY 用「**先產高品質母稿 → 再執行文化語境轉譯（Transcreation）**」的兩段式管線：
• **🇹🇼 繁中 / 🇨🇳 簡中**：精準區分兩岸習慣用語（例如「伺服器 vs. 服务器」、「預設 vs. 默认」、「隨身碟 vs. U盘」），絕不生硬混用。
• **🇺🇸 英文**：直接採用歐美科技媒體簡潔直擊痛點句法，去除中式繞彎修飾語。
• **🇯🇵 日文**：強制使用商務敬語（です・ます體），舉例貼合日本創作者常用的 X 與 Note 生態。
• **🇻🇳 越南文 / 🇮🇩 印尼文**：語氣熱情親切，強調高 CP 值與行動端／社群快速變現場景。

同時加上 **「編碼防污染與限流自動輪替」**：所有輸出強制存成 UTF-8 JSON，萬一免費 API 遇到 429 限流就自動等待切換，絕不讓整條產線崩潰！

【小白複製即可用提示卡⑤】
「請幫我寫一個多語系在地化腳本，把英文或中文母稿轉換成繁中、簡中、英文、日文、越南文、印尼文 6 個版本。重點要求：不要字面直譯，日文必須用商務敬語，東南亞語氣要親切接地氣，全部存成統一的 UTF-8 JSON 檔準備送給發佈器使用。」`,
      content_zh_cn: `如果你只用单一语系发文章，等同于放弃了全球 85% 的潜在买家！但传统请翻译社翻译一篇 2,000 字长文，翻成 6 种语言可能就要高昂外包费；自己用网页机翻又会生硬毁品牌。

在 my_video202605（参照 scripts/run_smart_translator.py 架构）中，我们教 AGY 用“先产高质量母稿 -> 再执行文化语境转译”的两段式管线，精准区分繁简用词、英文直击痛点、日文商务敬语以及越印亲切社群语气，并强制采用 UTF-8 JSON 存储防乱码与限流自动切换！

【小白复制即可用提示卡⑤】
“请帮我写一个多语系本地化脚本，把英文或中文母稿转换成繁中、简中、英文、日文、越南文、印尼文 6 个版本。重点要求：不要字面直译，日文必须用商务敬语，东南亚语气要亲切接地气，全部存成统一的 UTF-8 JSON 档。”`,
      content_en: `Publishing in only one language leaves 85% of global buyers untouched. Yet hiring agencies for 6 languages costs hundreds per article, while raw machine translation sounds stiff and harms trust (especially in Japanese keigo or Southeast Asian social copy).

Inside my_video202605 (scripts/run_smart_translator.py), AGY solves this with **Two-Stage Cultural Transcreation**:
• **zh-TW / zh-CN**: Adapts regional tech vocabulary accurately rather than blindly swapping characters.
• **en-US**: Punchy, outcome-led Silicon Valley clarity.
• **ja-JP**: Polite business register (desu/masu) tailored to Japanese X and Note readers.
• **vi-VN / id-ID**: Warm, mobile-first growth tone aligned with FB/TikTok/Shopee entrepreneurs.
All variants are saved into structured UTF-8 JSON packages with automatic 429 rate-limit fallback!

[Copy-Paste Beginner Prompt #5]
"Create a localization script converting each master article into 6 native variants (zh-TW, zh-CN, en-US, ja-JP, vi-VN, id-ID). Do not translate word-for-word—enforce polite business Japanese, crisp US clarity, and approachable SEA social tone. Save everything cleanly in UTF-8 JSON."`,
      content_ja: `単一言語だけの発信では世界市場の85%を逃します。AGYに「文化的ローカライズ（Transcreation）」を指示することで、英語・繁中・簡中・日本語（丁寧なビジネス敬語）・ベトナム語・インドネシア語の6言語JSONをUTF-8で崩れなく一括生成します。

【コピペ用プロンプト⑤】
「元記事を6言語（繁中・簡中・英・日・越・印）へ文化的ローカライズするスクリプトを作成してください。直訳は禁止し、日本語は丁寧なビジネス敬語、東南アジアは親しみやすいSNS口調で統一UTF-8 JSONに出力してください。」`,
      content_vi: `Chỉ đăng bài bằng 1 ngôn ngữ là bạn đã bỏ lỡ 85% khách hàng toàn cầu! Quy trình bản địa hóa hai bước của AGY giúp chuyển thể 1 bản gốc thành 6 ngôn ngữ (Phồn thể, Giản thể, Anh, Nhật kính ngữ, Việt, Indonesia) lưu chuẩn UTF-8 JSON không lỗi font.

[Câu Lệnh Mẫu #5]
"Hãy viết công cụ bản địa hóa bài viết gốc sang 6 ngôn ngữ (zh-TW, zh-CN, en-US, ja-JP, vi-VN, id-ID). Không dịch từng chữ máy móc—tiếng Nhật phải dùng kính ngữ, tiếng Việt/Indo tự nhiên thân thiện và lưu toàn bộ thành file JSON chuẩn UTF-8."`,
      content_id: `Menerbitkan konten dalam satu bahasa saja berarti melewatkan 85% pembeli global. Dengan transkreasi 2 tahap di AGY, satu naskah induk otomatis disesuaikan menjadi 6 bahasa (zh-TW, zh-CN, en-US, ja-JP, vi-VN, id-ID) secara alami dalam format UTF-8 JSON yang rapi.

[Kartu Prompt Pemula #5]
"Buatkan skrip lokalisasi artikel induk ke 6 bahasa secara alami (bukan terjemahan kaku), sesuaikan gaya bahasa bisnis Jepang dan nada akrab media sosial Asia Tenggara, lalu simpan sebagai UTF-8 JSON."`,
      image_url: '/images/ebooks/agy-buffer/ch5_6lang_flow.png',
      image_caption: '圖 5-1｜AGY 對話截圖④ × 1 篇母稿轉譯 6 大語系在地化與限流防護架構',
      references: [
        { title: 'Unicode UTF-8 Localization Best Practices (W3C)', url: 'https://www.w3.org/International/' }
      ]
    },
    {
      id: 'agy-ch-6',
      title_zh: '第六章：打通最後一哩路——從資料夾直接全自動推播至 Buffer 排程發佈',
      title_zh_cn: '第六章：打通最后一哩路——从文件夹直接全自动推播至 Buffer 排程发布',
      title_en: 'Chapter 6: The Final Mile—Pushing Directly from Folders to Buffer Automated Social Queues',
      title_ja: '第6章：ラストワンマイルを自動化——ローカルフォルダからBufferスケジュールキューへ安全に自動配信',
      title_vi: 'Chương 6: Chặng Cuối Tự Động—Đẩy Bài Trực Tiếp Từ Thư Mục Lên Hàng Đợi Lịch Đăng Buffer',
      title_id: 'Bab 6: Langkah Terakhir—Mengirim Konten Otomatis Dari Folder Langsung Ke Antrean Jadwal Buffer',
      content_zh: `文章寫好了、也翻譯成 6 種語言了，如果每天還是要手動複製貼上到臉書、X (Twitter)、LinkedIn 或 Instagram，那就不叫「AI 自動來客系統」。真正解放雙手的關鍵，就是透過 **Buffer** 當你的多社群排程中樞，再讓 AGY 幫你寫一支全自動發佈橋接器！

在 my_video202605 實戰案例（scripts/post-to-buffer.js 與 scripts/buffer_gql.js）中，小白只需要向 AGY 強調三個安全與穩定要求：
1. **金鑰安全隔離**：告訴 AGY「Buffer 的 Access Token 和各頻道 Profile ID 統一從本地設定檔讀取，絕對不可以硬編碼寫進公開檔案」。
2. **智能組裝貼文**：發佈器讀取 6 語系 JSON 裡的 AI 專屬標題、Hook 短文、Hashtags 與配圖網址，組裝成最適合各平台字數限制的貼文送進 Buffer 排程佇列（Add to Queue）。
3. **60 秒超時熔斷 ＋ 看門狗重試**：網路難免偶發不穩，請 AGY 幫每個請求加上 60 秒 Timeout 與指數退避重試（Retry），並先實發 **1 篇草稿驗證成功** 才啟動批量排程！

【小白複製即可用提示卡⑥】
「請幫我寫一個自動發佈器讀取多語系待發 JSON 資料夾，透過 Buffer API 把貼文排程送入各語系頻道佇列。請將 Token 與頻道 ID 抽離放在設定檔裡保護；加上 60 秒超時與失敗重試 3 次機制。寫完後請先用測試模式送 1 篇確認回傳成功給我看。」`,
      content_zh_cn: `文章写好了、也翻译成 6 种语言了，如果每天还是要手动复制粘贴到各大社群，那就不叫自动化。真正解放双手的诀窍，就是以 Buffer 为多社群排程中枢，请 AGY 建立支持“密钥与设定档分离”、“智能组装标题与标签”、“60 秒超时熔断＋重试”的自动发布桥梁（参考 post-to-buffer.js）。

【小白复制即可用提示卡⑥】
“请帮我写一个自动发布器读取多语系待发 JSON 文件夹，透过 Buffer API 把贴文排程送入各语系频道队列。请将 Token 与频道 ID 抽离放在设定档里保护；加上 60 秒超时与失败重试 3 次机制。写完后请先用测试模式送 1 篇确认回传成功给我看。”`,
      content_en: `Writing and translating 6-language copy still isn't true automation if you manually copy-paste posts every day. By turning **Buffer** into your multi-channel distribution hub—as implemented in scripts/post-to-buffer.js and scripts/buffer_gql.js—you let AGY bridge your local folder straight into scheduled global posts.

Tell AGY to build three industrial safeguards:
1. **Credential Isolation**: Load Buffer Access Tokens and Profile IDs strictly from isolated config files—never hardcode secrets.
2. **Smart Payload Assembly**: Prioritize localized AI titles, sharp hooks, hashtags, and cover URLs per platform.
3. **60s Hard Timeout + Exponential Retry + 1-Post Dry Test**: Always ask AGY to push a single live verification item first before queuing batches.

[Copy-Paste Beginner Prompt #6]
"Build a Buffer auto-publisher reading our localized JSON queue and pushing posts to each channel's schedule. Keep tokens strictly in a local config file, enforce a 60s timeout with 3 retries, and push 1 verification test post first to prove the integration works."`,
      content_ja: `多言語記事が完成しても、手動コピペでSNSに投稿していては自動化とは言えません。my_video202605のpost-to-buffer.jsと同様に、Bufferを配信ハブとして認証情報の安全な分離、60秒タイムアウトと3回リトライ、そして「まず1件だけのテスト投稿検証」をAGYに組み込ませます。

【コピペ用プロンプト⑥】
「ローカルの多言語JSONを読み込み、Buffer APIで予約キューへ送信するスクリプトを作成してください。トークンは設定ファイルに分離し、60秒タイムアウトと自動リトライを実装し、まず1件だけテスト送信して成功を確認してください。」`,
      content_vi: `Viết và dịch xong vẫn chưa phải tự động hóa nếu ngày nào bạn cũng phải copy-paste lên mạng xã hội! Dùng **Buffer** làm trung tâm điều phối (tham khảo post-to-buffer.js), yêu cầu AGY tách biệt Token bảo mật, thêm bộ bảo vệ Timeout 60 giây và chạy thử nghiệm 1 bài đầu tiên.

[Câu Lệnh Mẫu #6]
"Hãy viết công cụ đọc thư mục JSON đa ngôn ngữ và đẩy bài vào hàng đợi Buffer API. Tách Token ra file cấu hình riêng an toàn, thêm cơ chế Timeout 60s với 3 lần thử lại, và chạy thử 1 bài trước để tôi kiểm chứng."`,
      content_id: `Menulis dan menerjemahkan artikel belumlah otomatis jika Anda masih harus menyalinnya secara manual ke media sosial. Gunakan **Buffer** sebagai pusat penjadwalan (seperti pada post-to-buffer.js), dan minta AGY memisahkan Token secara aman, menambahkan batas waktu 60 detik, serta menguji 1 postingan lebih dulu.

[Kartu Prompt Pemula #6]
"Buatkan pengirim otomatis yang membaca antrean JSON multibahasa dan menjadwalkannya ke Buffer API. Pisahkan token di file konfigurasi terpisah, tambahkan batas waktu 60 detik dengan 3x percobaan ulang, dan kirim 1 postingan uji coba terlebih dahulu."`,
      image_url: '/images/ebooks/agy-buffer/ch6_buffer_api.png',
      image_caption: '圖 6-1｜AGY 對話截圖⑤ × Buffer API 安全權杖隔離與超時自癒發佈架構',
      references: [
        { title: 'Buffer Developer API & GraphQL Scheduling Architecture', url: 'https://buffer.com/developers' }
      ]
    },
    {
      id: 'agy-ch-7',
      title_zh: '第七章：全流程開發「對話截圖 × 圖表解說」全景總覽與小白複製提示庫',
      title_zh_cn: '第七章：全流程开发“对话截图 × 图表解说”全景总览与小白复制提示库',
      title_en: 'Chapter 7: The Complete Visual Map—End-to-End Screenshots, Diagrams & Beginner Prompt Vault',
      title_ja: '第7章：全体設計パーフェクトマップ——対話スクリーンショット×図解総覧＆コピペ用プロンプト全集',
      title_vi: 'Chương 7: Bản Đồ Tổng Thể Toàn Quy Trình—Ảnh Hội Thoại × Sơ Đồ & Kho Câu Lệnh Cho Người Mới',
      title_id: 'Bab 7: Peta Visual Menyeluruh—Ringkasan Tangkapan Layar Dialog × Diagram & Gudang Prompt Pemula',
      content_zh: `現在，我們把第二章到第六章拆解過的每一個對話框動作，串聯成一張完整的「**一鍵全自動 SEO/GEO ➔ Buffer 流水線全景圖**」。只要依照以下 5 個對話節拍指揮 AGY，任何零基礎學員都能在一個週末內複刻出屬於自己的 24 小時內容帝國：

1. **節拍 ①｜定憲法**：讓 AGY 寫好 GEMINI.md 與 Article_Pool 目錄規範。
2. **節拍 ②｜造血＋去重**：用 bulk_en_next 概念讀取歷史清單，避開舊題材寫出高密度 SEO/GEO 母文。
3. **節拍 ③｜6 語系轉譯**：用 run_smart_translator 文化改寫繁中/簡中/英/日/越/印版本並存成 UTF-8 JSON。
4. **節拍 ④｜Buffer 排程＋即時索引**：透過 post-to-buffer.js 推進各國社群，同時搭配 IndexNow 推播通知搜尋引擎秒收錄。
5. **節拍 ⑤｜QA Watchdog 自癒檢查**：如同我們的 Axis C 查核機制，每日排程跑完自動比對「預期發佈篇數 vs. 實際成功篇數」，缺 1 篇就立刻自動補發，真正做到「零人工巡檢」！

【全自動總控一鍵串接提示卡⑦】
「請幫我寫一支總控執行腳本（如 daily_auto_publisher.py），按順序串接：1. 檢查主題庫存，不足就自動補滿；2. 生成不重複的 SEO/GEO 母文；3. 轉譯成 6 語系 JSON；4. 發佈進 Buffer 排程；5. 最後執行一次全自動查核報告，確認預期篇數與實際成功數 100% 一致，若有任何失敗項目自動重試補正。」`,
      content_zh_cn: `现在，我们把第二章到第六章拆解过的每一个对话框动作，串联成一张完整的“**一键全自动 SEO/GEO -> Buffer 流水线全景图**”。只要依照以下 5 个对话节拍指挥 AGY，任何零基础学员都能在一个周末内复刻出属于自己的 24 小时内容帝国：

1. 定宪法（GEMINI.md）-> 2. 造血去重（SEO/GEO 母文）-> 3. 6 语系文化转译 -> 4. Buffer 排程推播 -> 5. QA Watchdog 自动查核漏发即补！

【全自动总控一键串接提示卡⑦】
“请帮我写一支总控执行脚本，按顺序串接：1. 检查主题库存不足自动补满；2. 生成不重复的 SEO/GEO 母文；3. 转译成 6 语系 JSON；4. 发布进 Buffer 排程；5. 最后执行自动查核，确保预期篇数与实际成功数 100% 一致，失败项自动补发。”`,
      content_en: `Let us now connect Chapters 2 through 6 into one unified **End-to-End Zero-Code Autopilot Map**. Follow these five conversational milestones with AGY to replicate a 24/7 multilingual publishing engine over a single weekend:

1. **Constitution First** (GEMINI.md rules) -> 2. **Deduplicated SEO/GEO Drafting** -> 3. **6-Language Cultural Transcreation** -> 4. **Buffer Queue Scheduling & Search Indexing** -> 5. **QA Watchdog Auto-Healing** (comparing expected vs. published counts and retrying any missed slot before you ever notice!).

[Master Orchestrator Prompt #7]
"Create a master runner script that executes in sequence: 1. Replenish topics if queue is low; 2. Draft deduplicated SEO/GEO articles; 3. Localize into 6 UTF-8 JSON editions; 4. Push to Buffer schedules; 5. Run a QA audit comparing expected vs. sent counts and auto-retry any missed item."`,
      content_ja: `第2章〜第6章のすべての対話ステップを1枚の完全マップに統合します。「①憲法策定 → ②重複なしSEO/GEO生成 → ③6言語ローカライズ → ④Buffer予約配信＆インデックス通知 → ⑤QA自動検知・リトライ修復」という5ステップをそのままAGYへ順番に指示するだけで完成します。

【統合オーケストレーター用プロンプト⑦】
「1.トピック残数補充、2.重複なしSEO/GEO記事生成、3.6言語JSON変換、4.Buffer予約投稿、5.送信完了数と失敗時の自動再送監査、を順番に実行する統合ランナーを作成してください。」`,
      content_vi: `Bây giờ hãy ghép nối toàn bộ các bước từ Chương 2 đến Chương 6 thành một bản đồ tổng thể 5 nhịp hoàn chỉnh: 1. Hiến pháp GEMINI.md -> 2. Viết SEO/GEO không trùng -> 3. Chuyển ngữ 6 thứ tiếng -> 4. Lên lịch Buffer -> 5. Watchdog tự kiểm tra và bù bài lỗi.

[Câu Lệnh Mẫu Tổng Hợp #7]
"Hãy tạo một script tổng điều phối chạy tuần tự: 1. Bổ sung chủ đề nếu thiếu; 2. Viết bài SEO/GEO không trùng; 3. Bản địa hóa 6 ngôn ngữ; 4. Đẩy vào Buffer; 5. Chạy kiểm toán QA tự động gửi lại nếu có bài bị sót."`,
      content_id: `Kini satukan seluruh langkah dari Bab 2 hingga Bab 6 menjadi satu Peta Induk Otomatis 5 Tahap: 1. Konstitusi GEMINI.md -> 2. Artikel SEO/GEO anti-duplikat -> 3. Lokalisasi 6 bahasa -> 4. Penjadwalan Buffer -> 5. QA Watchdog otomatis menambal postingan yang gagal.

[Kartu Prompt Induk #7]
"Buatkan skrip koordinator utama yang menjalankan berurutan: 1. Isi ulang topik jika menipis; 2. Buat artikel SEO/GEO unik; 3. Lokalisasi ke 6 bahasa JSON; 4. Kirim ke antrean Buffer; 5. Lakukan audit QA otomatis untuk mengulang postingan yang gagal."`,
      image_url: '/images/ebooks/agy-buffer/ch7_master_map.png',
      image_caption: '圖 7-1｜五步打通 AGY 對話設計 -> 編程 -> 6 語系 -> Buffer 全自動發佈與 QA 自癒全景圖',
      references: [
        { title: 'IndexNow Instant Search Engine Indexing Protocol', url: 'https://www.indexnow.org/' }
      ]
    },
    {
      id: 'agy-ch-8',
      title_zh: '第八章：自動化之後呢？把「SEO/GEO 流量流水線」變現的全球商業閉環',
      title_zh_cn: '第八章：自动化之后呢？把“SEO/GEO 流量流水线”变现的全球商业闭环',
      title_en: 'Chapter 8: Beyond Automation—Turning Your SEO/GEO & Buffer Traffic into Global Recurring Revenue',
      title_ja: '第8章：自動化のその先へ——SEO・GEO×Buffer集客を電子書籍と25%紹介報酬へ繋ぐ収益ループ設計',
      title_vi: 'Chương 8: Sau Tự Động Hóa Là Gì? Khép Kín Vòng Quay Thu Nhập Toàn Cầu Từ Lưu Lượng SEO/GEO & Buffer',
      title_id: 'Bab 8: Setelah Otomatisasi—Mengubah Trafik SEO/GEO & Buffer Menjadi Mesin Pendapatan Global',
      content_zh: `跑通全自動寫文與 Buffer 發佈只是「點亮引擎」；一個真正懂商業變現的暢銷作家，會確保每一篇透過 AI 發出去的 6 語系文章與社群貼文，都在最後一段接上清晰的 **「無摩擦收單閉環」**！

檢視我們這套微享 AI-ATM 生態的商業設計，你就能看見自動化流量如何滾雪球：
1. **免費體驗入口（Franchised Hook）**：你在 Buffer 發的每一篇知識貼文，結尾導向「免費試閱本書第 1～2 章」——讀者不用馬上付錢，先親自看到真實 AGY 截圖與可複製提示卡，信任感瞬間拉滿。
2. **階梯式數位變現**：對工具好奇的讀者用 **$27 早鳥優惠價（2027 年起恢復 $39）** 單本買斷或 **$15/月** 訂閱 VIP 書櫃，刷卡／PayPal／USDT 結帳後秒收加密閱讀連結與浮水印 PDF。
3. **25% 聯盟人脈裂變網絡**：每位買家與學員都可以複製本書專屬推廣連結，推薦親友或讀者購書即享 25% 推廣體系分潤（10% 級差 + 10% 對等 + 5% 全球領袖分紅）；而你想擁有自己 3 台專書自動販賣機的創作者，更可透過 $990 方案獲得「10% 系統服務費 100% 倒抵」零風險啟動！

記住：寫程式這件事，AGY 已經幫你免費代勞了 95%；剩下 5% 最值錢的事，就是像現在一樣「清楚思考你的商業漏斗，然後把自動流量水龍頭打開」。歡迎來到零門檻 AI 自動來客時代！`,
      content_zh_cn: `跑通全自动写文与 Buffer 发布只是“点亮引擎”；真正懂商业变现的畅销作家，会确保每一篇发出去的 6 语系文章与社群贴文，都在最后一段接上清晰的“无摩擦收单闭环”：

1. Buffer 与 SEO/GEO 在全球 24H 导流 -> 2. 免费试阅第 1~2 章建立极高信任 -> 3. 2027年前 $27 早鸟优惠（原价 $39）或 VIP $15/月无缝成交 -> 4. 启动 25% 联盟裂变与 $990 知识自动贩卖机飞轮！

记住：写程序这件事 AGY 已经帮你代劳了 95%；最值钱的 5%，是设计好商业漏斗并打开自动流量水龙头！`,
      content_en: `Running automated SEO/GEO writing and Buffer posting is only igniting the engine. What separates profitable creators from hobbyists is attaching a **frictionless monetization loop** at the tail of every post:

1. **Zero-Resistance Entry Hook**: Every 6-language Buffer post invites readers into the **Free Chapters 1–2 Preview**—letting them verify real AGY screenshots before paying a cent.
2. **Smooth Digital Checkout**: Readers unlock the full blueprint at **$27 Pre-2027 Early Bird (Reg. $39)** or **$15/mo VIP Access**, receiving instant encrypted reader links and watermarked PDFs.
3. **25% Viral Affiliate Flywheel**: Every buyer and creator gets a single-click referral link sharing 25% commissions (10% Differential + 10% Matching + 5% Global Pool), while creators can launch their own 3-book AI-ATM Knowledge Vending Machines with 100% fee credits!

AGY handles 95% of the technical heavy lifting. Your highest-leverage 5% is designing the funnel—and turning on the tap.`,
      content_ja: `自動生成とBuffer自動投稿はエンジンの始動に過ぎません。真の収益化には、すべての多言語投稿の末尾に「第1〜2章の無料体験 → 2027年前限定$27（定価$39）での即時決済 → 25%紹介アフィリエイト循環」という摩擦のない導線を組み込むことが鍵となります。技術実装の95%はAGYに任せ、あなたは価値あるビジネス設計の5%に集中してください。`,
      content_vi: `Chạy tự động hóa mới chỉ là nổ máy. Bí quyết kiếm tiền bền vững là gắn phễu chuyển đổi không điểm chạm vào cuối mỗi bài đăng Buffer: Mời đọc miễn phí Chương 1-2 -> Mở khóa trọn bộ ưu đãi trước 2027 chỉ $27 (giá gốc $39) -> Kích hoạt mạng lưới tiếp thị liên kết 25% tự động lan tỏa!`,
      content_id: `Menjalankan penulisan dan penjadwalan otomatis barulah menyalakan mesin. Kunci monetisasi sejati adalah menautkan corong konversi di setiap akhir postingan Buffer: Undangan baca gratis Bab 1-2 -> Buka akses penuh promo Pra-2027 $27 (normal $39) -> Aktifkan roda gila afiliasi viral 25%!`,
      image_url: '/images/ebooks/agy-buffer/ch8_monetization.png',
      image_caption: '圖 8-1｜SEO/GEO + Buffer 自動吸客 ➔ 免費試閱第1~2章 ➔ $27/$39 變現與 25% 裂變飛輪',
      references: [
        { title: 'WeiXiang 25% Affiliate Matrix & $990 100% Fee-Credit Architecture', url: 'https://nft1314.party' }
      ]
    }
  ]
};
