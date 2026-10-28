'use client';

import React, { useState } from 'react';
import { useLanguage, Lang } from '@/lib/LanguageContext';

export default function CustomArchitectureSection() {
  const { lang } = useLanguage();

  // 表單狀態
  const [clientName, setClientName] = useState('');
  const [contactChannel, setContactChannel] = useState<'email' | 'line' | 'wechat' | 'other'>('email');
  const [contactValue, setContactValue] = useState('');
  const [projectType, setProjectType] = useState('AI-ATM 全球自動化變現系統');
  const [budgetRange, setBudgetRange] = useState('$1,000 ~ $3,000 USD (專業級系統)');
  const [requirement, setRequirement] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // 複製通知 Toast
  const [copyToast, setCopyToast] = useState<string | null>(null);

  const handleCopyId = (idText: string, platformName: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(idText).catch(() => {});
    }
    const msg =
      lang.includes('zh')
        ? `✅ 已複製 ${platformName} ID：【${idText}】，請打開 App 搜尋加好友洽談！`
        : `✅ Copied ${platformName} ID: [${idText}] to clipboard!`;
    setCopyToast(msg);
    setTimeout(() => setCopyToast(null), 5000);
  };

  const handleOpenAIChat = (customPrompt?: string) => {
    if (typeof window !== 'undefined') {
      const defaultQuery =
        lang.includes('zh')
          ? '我想諮詢 20 年首席架構師 SEN 的 AI-ATM 客製化系統接案與專屬開發服務'
          : 'I would like to inquire about 20-Year Chief Architect SEN bespoke AI-ATM development services';
      window.dispatchEvent(
        new CustomEvent('open-ai-chat', {
          detail: { query: customPrompt || defaultQuery }
        })
      );
    }
  };

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitResult(null);

    if (!clientName.trim() || !contactValue.trim() || !requirement.trim()) {
      setSubmitResult({
        type: 'err',
        text:
          lang.includes('zh')
            ? '⚠️ 請完整填寫稱呼、聯絡管道與需求描述！'
            : '⚠️ Please fill in your name, contact info, and project description!'
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/custom-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: clientName.trim(),
          contactChannel,
          contactValue: contactValue.trim(),
          projectType,
          budgetRange,
          requirement: requirement.trim(),
          language: lang
        })
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || '提交失敗');
      }

      setSubmitResult({
        type: 'ok',
        text: data.message
      });
      setRequirement('');
    } catch (err: any) {
      setSubmitResult({
        type: 'err',
        text: `❌ 提交失敗：${err.message || '請直接來信 xyz007tw@gmail.com 或加 LINE/微信 (ID: xyz007tw)'}`
      });
    } finally {
      setSubmitting(false);
    }
  };

  // 6 語系文案字典
  const isZhTW = lang === 'zh-TW';
  const isZhCN = lang === 'zh-CN';
  const isEn = lang === 'en-US';
  const isJa = lang === 'ja-JP';
  const isKo = lang === 'ko-KR';
  const isVi = lang === 'vi-VN';

  return (
    <div className="space-y-10 text-[#0f172a]">
      {/* 1. 👑 20年首席架構師形象與核心資歷旗艦卡 */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-10 text-white shadow-2xl border-2 border-sky-400 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-3.5 py-1 rounded-full bg-sky-500/20 border border-sky-400/50 text-sky-300 text-xs font-black uppercase tracking-wider">
              {isZhTW ? '👑 20年資歷 AI Agent 自然語言總工程師 · 首席架構師' :
               isZhCN ? '👑 20年资历 AI Agent 自然语言总工程师 · 首席架构师' :
               isJa ? '👑 20年の実績 AIエージェント自然言語総エンジニア・首席アーキテクト' :
               isKo ? '👑 20년 경력 AI 에이전트 자연어 수석 엔지니어 · 치프 아키텍트' :
               isVi ? '👑 Kiến Trúc Sư Trưởng 20 Năm Kinh Nghiệm AI Agent & Ngôn Ngữ Tự Nhiên' :
               '👑 20-Year Chief Architect & Veteran AI Agent Systems Engineer'}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-extrabold">
              {isZhTW ? '⚡ 24H 零人工看守 AI-ATM 自動商業變現' :
               isZhCN ? '⚡ 24H 零人工看守 AI-ATM 自动商业变现' :
               isJa ? '⚡ 24H 自動稼働 AI-ATM 商業収益化' :
               isKo ? '⚡ 24H 무인 가동 AI-ATM 자동 수익화' :
               isVi ? '⚡ Vận Hành Tự Động 24/7 AI-ATM' :
               '⚡ 24/7 Autonomous AI-ATM Monetization Engine'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight mb-4">
            {isZhTW ? '讓你有本錢可以在全球語系推廣自品牌賺錢 (AI-ATM)' :
             isZhCN ? '让你有本钱可以在全球语系推广自品牌赚钱 (AI-ATM)' :
             isJa ? '世界言語市場で自社ブランドを収益化する実力を手に入れる (AI-ATM)' :
             isKo ? '전 세계 다국어 시장에서 자체 브랜드를 글로벌 머니타이징할 수 있는 실전 인프라 (AI-ATM)' :
             isVi ? 'Trao Bạn Bản Lĩnh Quảng Bá Thương Hiệu Toàn Cầu Đa Ngôn Ngữ (AI-ATM)' :
             'Empowering Your Brand to Monetize Globally Across Multi-Language Markets (AI-ATM)'}
          </h2>

          <p className="text-base sm:text-lg text-slate-200 font-medium max-w-4xl leading-relaxed mb-6">
            {isZhTW ? '輔導師：20年架構程式為自動化賺錢系統 (例 AI-ATM) 的專業資歷。幫您省時、省力、更省麻煩，可以在下班後、睡覺時，讓 AI Agent (AI員工) 24小時不休息還在全力助您賺大錢！' :
             isZhCN ? '辅导师：20年架构程式为自动化赚钱系统 (例 AI-ATM) 的专业资历。帮您省时、省力、更省麻烦，可以在下班后、睡觉时，让 AI Agent (AI员工) 24小时不休息还在全力助您赚大钱！' :
             isJa ? '指導者：20年間、自動収益化システム（AI-ATM）を設計・開発してきたプロフェッショナル。時間・労力・面倒を極限まで省き、退勤後や就寝中でもAIエージェント（AI社員）が24時間休まず全力で利益を生み出し続けます！' :
             isKo ? '멘토: 20년간 자동 수익화 프로그램(AI-ATM)을 설계·개발해 온 독보적 경력. 시간과 노력, 번거로움을 획기적으로 줄여 퇴근 후나 수면 중에도 AI 에이전트(AI 직원)가 24시간 쉬지 않고 당신의 비즈니스를 확장합니다!' :
             isVi ? 'Cố vấn: 20 năm chuyên môn kiến trúc hệ thống kiếm tiền tự động (AI-ATM). Giúp bạn tiết kiệm thời gian, công sức và rắc rối, để AI Agent (nhân viên AI) làm việc không ngừng nghỉ 24/7 tạo doanh thu ngay cả khi bạn đang ngủ!' :
             'Mentor: 20-year veteran specializing in coding automated revenue systems (AI-ATM). Save time, eliminate stress, and let autonomous AI Agents (your 24/7 AI workforce) tirelessly generate revenue while you rest!'}
          </p>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-sky-400/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎯</span>
              <div>
                <div className="text-xs uppercase tracking-wider text-sky-300 font-black">
                  {isZhTW ? '首席工程師實戰承諾' :
                   isZhCN ? '首席工程师实战承诺' :
                   isJa ? 'チーフアーキテクトの実戦コミットメント' :
                   isKo ? '수석 엔ジ니어 실전 약속' :
                   isVi ? 'CAM KẾT CỦA KIẾN TRÚC SƯ TRƯỞNG' :
                   'CHIEF ARCHITECT COMMITMENT'}
                </div>
                <div className="text-sm sm:text-base font-extrabold text-white">
                  {isZhTW ? '精準駕控 AI 程序 · 客製真誠對應 · 系統需求任務認真執行 (無需其他廢言)' :
                   isZhCN ? '精准驾控 AI 程序 · 客制真诚对应 · 系统需求任务认真执行 (无需其他废言)' :
                   isJa ? '高度なAIプログラム制御・誠実な個別対応・要件タスクの確実な完遂（余計な言葉は不要）' :
                   isKo ? '정밀한 AI 제어 · 진정성 있는 맞춤 응대 · 시스템 요구과업의 철저한 실행 (군더더기 없는 완결)' :
                   isVi ? 'Làm chủ chương trình AI · Đối ứng chân thành · Thực thi nhiệm vụ chuẩn xác, không vòng vo' :
                   'Precise AI Engineering Control · Sincere Custom Alignment · Rigorous Task Execution (Zero Fluff)'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href="#custom-intake-form"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-xs shadow-lg transition-all"
              >
                {isZhTW ? '📝 立即提交接案需求' :
                 isZhCN ? '📝 立即提交接案需求' :
                 isJa ? '📝 案件相談・要件提出' :
                 isKo ? '📝 맞춤 개발 의뢰 제출' :
                 isVi ? '📝 Gửi Yêu Cầu Dự Án' :
                 '📝 Submit Project Intake'}
              </a>
              <button
                type="button"
                onClick={() => handleOpenAIChat()}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>💬</span>
                {isZhTW ? '諮詢 AI 客服' :
                 isZhCN ? '咨询 AI 客服' :
                 isJa ? '💬 AIチャット相談' :
                 isKo ? '💬 AI 상담하기' :
                 isVi ? '💬 Chat với AI' :
                 'Chat with AI'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 🧠 四大核心架構與策略 Q&A (深度技術 + 小白通俗理解) */}
      <div className="space-y-6">
        <div className="border-b-2 border-slate-200 pb-3">
          <span className="text-xs font-black text-sky-600 uppercase tracking-widest">
            {isJa ? 'アーキテクチャ設計・戦略ブループリント' :
             isZhCN ? '战略架构与变现蓝图' :
             isZhTW ? '戰略架構與變現藍圖' :
             'STRATEGIC ARCHITECTURE & BLUEPRINT'}
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {isZhTW ? '💡 4 大核心架構技術實力與變現閉環解析' :
             isZhCN ? '💡 4 大核心架构技术实力与变现闭环解析' :
             isJa ? '💡 4大コア技術アーキテクチャ＆自動収益化ループ徹底解説' :
             isKo ? '💡 4대 핵심 아키텍처 기술력 & 수익화 완결 구조 분석' :
             isVi ? '💡 4 Trụ Cột Công Nghệ & Vòng Lặp Kiếm Tiền Tự Động Chi Tiết' :
             '💡 4 Core Architectural Capabilities & Automated Revenue Loops'}
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Q1: 核心技術與架構實力 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-md hover:border-sky-400 transition-all">
            <div className="flex items-start gap-4">
              <span className="px-3 py-1 rounded-xl bg-sky-100 text-sky-800 font-black text-sm shrink-0">Q1</span>
              <div className="space-y-3">
                <h4 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                  {isZhTW ? '這個系統的背後核心技術與架構實力是什麼？' :
                   isZhCN ? '这个系统的背后核心技术与架构实力是什么？' :
                   isJa ? 'このシステムの背後にあるコア技術とアーキテクチャの実力とは？' :
                   isKo ? '이 시스템의 이면에 있는 핵심 기술과 아키텍처 실체는 무엇인가요?' :
                   isVi ? 'Công nghệ cốt lõi và năng lực kiến trúc đằng sau hệ thống này là gì?' :
                   'What is the core technology and architectural prowess powering this system?'}
                </h4>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                  {isZhTW ? '本系統由具備「20年跨領域系統架構與首席工程實戰經驗」深度研發，將複雜的自動化底層邏輯（API 調度、自動化工作流、分散式分流）封裝成「一鍵落地」的商業變現系統。' :
                   isZhCN ? '本系统由具备「20年跨领域系统架构与首席工程实战经验」深度研发，将复杂的自动化底层逻辑（API 调度、自动化工作流、分散式分流）封装成「一键落地」的商业变现系统。' :
                   isJa ? '20年のクロスドメイン・システム設計および首席エンジニアとしての実戦経験を結集。複雑なAPI呼び出し、自動ワークフロー、分散トラフィック制御を「ワンクリックで即稼働」する商業マネタイズ基盤としてカプセル化しています。' :
                   isKo ? '20년간의 크로스도메인 시스템 설계 및 수석 엔지니어 실전 경험을 집약하여, 복잡한 API 오케스트레이션, 자동화 워크플로우, 분산 트래픽 제어를 단 한 번의 클릭으로 안착시키는 상용 수익화 엔진으로 패키징했습니다.' :
                   isVi ? 'Hệ thống được phát triển chuyên sâu từ 20 năm kinh nghiệm kiến trúc hệ thống và kỹ sư trưởng, đóng gói toàn bộ logic phức tạp (điều phối API, luồng tự động, phân luồng lưu lượng) thành giải pháp thương mại hoá 1 chạm.' :
                   'Engineered from 20 years of cross-domain system architecture and chief engineering expertise, abstracting complex backend logic (API orchestration, automated workflows, distributed routing) into a turnkey monetization engine.'}
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-600 font-medium">
                  <li>
                    <strong className="text-slate-900">
                      {isZhTW ? '核心思維：' :
                       isZhCN ? '核心思维：' :
                       isJa ? 'コア思想：' :
                       isKo ? '핵심 철학:' :
                       isVi ? 'Tư duy cốt lõi:' :
                       'Core Philosophy: '}
                    </strong>
                    {isZhTW ? '不靠單點運氣，靠系統工程。透過精密的架構整合，讓 AI Agent 協作編程，打造高穩定度、低運營成本的全球商業變現閉環。' :
                     isZhCN ? '不靠单点运气，靠系统工程。透过精密的架构整合，让 AI Agent 协作编程，打造高稳定度、低运营成本的全球商业变现闭环。' :
                     isJa ? '運に頼るのではなく、システムエンジニアリングを追求。AIエージェントの協調プログラミングにより、高安定性・低運用コストのグローバル商業収益化ループを構築します。' :
                     isKo ? '요행에 기대지 않고 시스템 엔지니어링으로 승부합니다. 정밀한 아키텍처 통합을 통해 AI 에이전트들이 협력 코딩하여 높은 안정성과 낮은 운영비의 글로벌 머니타이징 완결 구조를 만듭니다.' :
                     isVi ? 'Không phụ thuộc vào may mắn, dựa trên kỹ thuật hệ thống. Thông qua tích hợp kiến trúc chính xác, để các AI Agent hợp tác lập trình tạo vòng khép kín thương mại hoá toàn cầu chi phí thấp.' :
                     'Not relying on luck, but on systems engineering. Precision AI Agent collaboration achieves maximum stability and near-zero operational overhead.'}
                  </li>
                </ul>
                <div className="mt-3 p-4 rounded-2xl bg-sky-50 border border-sky-200 text-sky-900 text-xs sm:text-sm">
                  <strong className="font-black text-sky-800 flex items-center gap-1.5 mb-1">
                    <span>💡</span>
                    {isZhTW ? '小白通俗理解：' :
                     isZhCN ? '小白通俗理解：' :
                     isJa ? '初心者向け解説：' :
                     isKo ? '초보자를 위한 쉬운 이해:' :
                     isVi ? 'Giải thích dễ hiểu:' :
                     'Beginner Analogy:'}
                  </strong>
                  {isZhTW ? '就像幫你的網路生意打造一條「24小時自動運轉的數位高鐵」，把底層複雜的程式與伺服器架構全都鋪好，你只需要負責坐著收成。' :
                   isZhCN ? '就像帮你的网络生意打造一条「24小时自动运转的数字高铁」，把底层复杂的程式与伺服器架构全都铺好，你只需要负责坐着收成。' :
                   isJa ? 'まるであなたのネットビジネスのために「24時間走り続けるデジタル新幹線」を建設するようなもの。複雑な線路やサーバーはすべて完成済みなので、あなたは座って成果を受け取るだけです。' :
                   isKo ? '귀하의 온라인 비즈니스를 위해 「24시간 멈추지 않는 디지털 고속철도」를 구축해 드리는 것과 같습니다. 복잡한 철로와 인프라는 다 깔려 있으니 편안히 탑승해 결실을 거두시면 됩니다.' :
                   isVi ? 'Giống như xây dựng một tuyến đường sắt cao tốc kỹ thuật số chạy 24/7 cho doanh nghiệp của bạn, toàn bộ đường ray phức tạp đã xong, bạn chỉ cần ngồi thu hoạch.' :
                   'Like laying down a 24/7 autonomous high-speed digital railway for your business; with all tracks and complex infrastructure preset, you simply collect the proceeds.'}
                </div>
              </div>
            </div>
          </div>

          {/* Q2: 多軌流量引擎 (含軌道三最佳寫法) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-md hover:border-purple-400 transition-all">
            <div className="flex items-start gap-4">
              <span className="px-3 py-1 rounded-xl bg-purple-100 text-purple-800 font-black text-sm shrink-0">Q2</span>
              <div className="space-y-3 w-full">
                <h4 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                  {isZhTW ? '什麼是「多軌流量引擎（Shorts + WP-SEO + 人推人脈複利）」？' :
                   isZhCN ? '什么是「多轨流量引擎（Shorts + WP-SEO + 人推人脉复利）」？' :
                   isJa ? '「マルチトラック・トラフィックエンジン（Shorts ＋ WP-SEO ＋ 人脈複利）」とは？' :
                   isKo ? '「다중 궤도 트래픽 엔진 (Shorts + WP-SEO + 인맥 복리)」이란 무엇인가요?' :
                   isVi ? 'Động Cơ Lưu Lượng Đa Tuyến (Shorts + WP-SEO + Lãi Kép Nhân Mạch) Là Gì?' :
                   'What is the Multi-Track Traffic Engine (Shorts + WP-SEO + Word-of-Mouth Compounding)?'}
                </h4>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                  {isZhTW ? '結合「即時爆發力」、「長尾永續力」與「人脈指數裂變」的三重全維度流量灌入機制：' :
                   isZhCN ? '结合「即时爆发力」、「长尾永续力」与「人脉指数裂变」的三重全维度流量灌入机制：' :
                   isJa ? '「即効性のある爆発力」「永続的なロングテール集客」「人脈の指数関数的バイラル」を三位一体で融合した全次元トラフィック流入メカニズム：' :
                   isKo ? '「즉각적인 폭발력」, 「롱테일 지속성」, 「인맥 지수형 바이럴」을 융합한 전방위 트래픽 유입 메커니즘:' :
                   isVi ? 'Cơ chế đưa lưu lượng đa chiều kết hợp sức bùng nổ tức thì, tính bền vững dài hạn và lan truyền cấp số nhân:' :
                   'A triple-engine traffic inflow mechanism blending explosive instant reach, perpetual search long-tail visibility, and exponential viral network compounding:'}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                      {isJa ? '軌道一' : isZhCN ? '轨道一' : isZhTW ? '軌道一' : 'Track 1'}
                    </span>
                    <h5 className="font-extrabold text-slate-900 text-sm my-1.5">
                      {isJa ? 'AI ショート動画マトリクス' :
                       isZhCN ? 'AI 短影音矩阵' :
                       isZhTW ? 'AI 短影音矩陣' :
                       isKo ? 'AI 숏폼 비디오 매트릭스' :
                       isVi ? 'Ma trận Video Ngắn AI' :
                       'AI Short-Form Video Matrix'}
                    </h5>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {isJa ? 'アルゴリズムのボーナスを迅速に捉え、露出とリーチを瞬時に急拡大。短期間でYouTubeチャンネルや公式販売導線へ大量のトラフィックを誘導します。' :
                       isZhCN ? '快速抓住演算法红利，瞬间拉高曝光与触及，在极短时间内将泛流量导入目标 YouTube 频道与官方销售漏斗。' :
                       isZhTW ? '快速抓住演算法紅利，瞬間拉高曝光與觸及，在極短時間內將泛流量導入目標 YouTube 頻道與官方銷售漏斗。' :
                       'Capturing algorithm dividends instantly to skyrocket reach and channel massive traffic into target funnels.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                      {isJa ? '軌道二' : isZhCN ? '轨道二' : isZhTW ? '軌道二' : 'Track 2'}
                    </span>
                    <h5 className="font-extrabold text-slate-900 text-sm my-1.5">
                      {isJa ? 'WordPress 自動化 SEO サイト群' :
                       isZhCN ? 'WordPress 自动化 SEO 站群' :
                       isZhTW ? 'WordPress 自動化 SEO 站群' :
                       isKo ? 'WordPress 자동화 SEO 사이트군' :
                       isVi ? 'Hệ thống Vệ tinh SEO WordPress' :
                       'Automated WordPress SEO Network'}
                    </h5>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {isJa ? 'AIが多言語の高品質コンテンツを自動生成し、Google等の検索エンジンの主要キーワードを制覇。途切れることのない信頼度の高い検索受動トラフィックをもたらします。' :
                       isZhCN ? '透过 AI 自动产出多语系高质量内容，卡位 Google 等搜索引擎关键字，带来源源不绝、信任度极高的被动长尾搜寻客流。' :
                       isZhTW ? '透過 AI 自動產出多語系高品質內容，卡位 Google 等搜尋引擎關鍵字，帶來源源不絕、信任度極高的被動長尾搜尋客流。' :
                       'Autonomous AI generates multilingual content to capture Google search keywords for endless passive long-tail organic traffic.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-purple-200 text-purple-800">
                      {isJa ? '軌道三【人推人脈複利】' :
                       isZhCN ? '轨道三【人推人脉复利】' :
                       isZhTW ? '軌道三【人推人脈複利】' :
                       'Track 3 [Word-of-Mouth]'}
                    </span>
                    <h5 className="font-extrabold text-purple-950 text-sm my-1.5">
                      {isJa ? '25% アフィリエイト人脈バイラルネットワーク' :
                       isZhCN ? '25% 联盟分润人脉裂变网络' :
                       isZhTW ? '25% 聯盟分潤人脈裂變網絡' :
                       '25% Affiliate Compounding Network'}
                    </h5>
                    <p className="text-xs text-purple-900 leading-relaxed font-medium">
                      {isJa ? 'スマート紹介リンクと25%アフィリエイト分配プロトコル（10%級差 + 10%対等 + 5%グローバル均分）を活用。受講生やパートナー全員があなたのグローバルビジネスパートナーへと自動転換し、雪だるま式に広がる「人脈複利ネットワーク」を実現します！' :
                       isZhCN ? '运用智能推荐链路与 25% 联盟分润协议（10%级差 + 10%对等 + 5%全球领袖均分），让每个学员与伙伴自动转化为你的全球业务合伙人；透过人脉与利润共享的指数级裂变，将单向流量昇华为自我造血、滚雪球般的「人推人脉复利网络」！' :
                       isZhTW ? '運用智能推薦鏈路與 25% 聯盟分潤協議（10%級差 + 10%對等 + 5%全球領袖均分），讓每個學員與夥伴自動轉化為你的全球業務合夥人；透過人脈與利潤共享的指數級裂變，將單向流量昇華為自我造血、滾雪球般的「人推人脈複利網絡」！' :
                       'Leveraging smart referral chains and 25% affiliate protocols (10% tier + 10% matching + 5% global pool) turns every partner into a global business associate for compounding viral expansion!'}
                    </p>
                  </div>
                </div>

                <div className="mt-3 p-4 rounded-2xl bg-purple-100/70 border border-purple-300 text-purple-950 text-xs sm:text-sm">
                  <strong className="font-black text-purple-900 flex items-center gap-1.5 mb-1">
                    <span>💡</span>
                    {isZhTW ? '小白通俗理解此軌道三與整體力量：' :
                     isZhCN ? '小白通俗理解此轨道三与整体力量：' :
                     isJa ? '初心者向け解説（軌道三と相乗効果）：' :
                     isKo ? '초보자를 위한 쉬운 이해 (궤도3과 시너지):' :
                     isVi ? 'Giải thích dễ hiểu về Tuyến 3 và sức mạnh tổng thể:' :
                     'Beginner Analogy for Track 3:'}
                  </strong>
                  {isJa ? 'ショート動画は「短距離ダッシュ」（迅速な集客）、WP-SEOは「マラソン」（毎日の受動的ロングテール流入）、そして人脈複利は「連鎖加盟店のバイラル展開」（満足した顧客が自発的に友人を紹介し、1人が10人、10人が100人へと雪だるま式にビジネスを拡大！）。3つの軌道が合力し、蛇口をひねるように優良顧客を成約システムへ注ぎ込みます！' :
                   isZhCN ? '短影音是「短跑冲刺」（快速吸客），WP-SEO 是「马拉松长跑」（天天有被动长尾流量），而人推人脉复利就是「开连锁加盟店的裂变网络」（满意的客户主动呼朋引伴帮你卖，一人带十人、十人带百人，你的生意就像滚雪球一样越滚越大！）。三轨合力，把精准客户像开水龙头一样源源不绝灌入你的成交系统！' :
                   isZhTW ? '短影音是「短跑衝刺」（快速吸客），WP-SEO 是「馬拉松長跑」（天天有被動長尾流量），而人推人脈複利就是「開連鎖加盟店的裂變網絡」（滿意的客戶主動呼朋引伴幫你賣，一人帶十人、十人帶百人，你的生意就像滾雪球一樣越滾越大！）。三軌合力，把精準客戶像開水龍頭一樣源源不絕灌入你的成交系統！' :
                   'Shorts are sprints (quick traffic), WP-SEO is a marathon (daily organic passive traffic), and affiliate compounding is a viral franchise network (delighted clients bring more partners exponentially). Together, they pour high-intent leads into your sales funnel like turning on a faucet!'}
                </div>
              </div>
            </div>
          </div>

          {/* Q3: 平行時間擴展多重收入與 1人全球化 AI-ATM */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-md hover:border-emerald-400 transition-all">
            <div className="flex items-start gap-4">
              <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 font-black text-sm shrink-0">Q3</span>
              <div className="space-y-3">
                <h4 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                  {isZhTW ? '什麼是「平行時間擴展多重收入」與「1人全球化 AI-ATM」？' :
                   isZhCN ? '什么是「平行时间扩展多重收入」与「1人全球化 AI-ATM」？' :
                   isJa ? '「並行時間多重収入拡大」と「1人グローバルAI-ATM」とは？' :
                   isKo ? '「병렬 시간 다중 수익 확장」과 「1인 글로벌 AI-ATM」이란?' :
                   isVi ? 'Thu Nhập Đa Tầng Thời Gian Song Song & AI-ATM 1 Người Toàn Cầu Là Gì?' :
                   'What is "Parallel Time Multi-Income Expansion" and "One-Person Global AI-ATM"?'}
                </h4>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                  <strong className="text-slate-900">
                    {isJa ? '概念の本質：' : isZhCN ? '概念本质：' : isZhTW ? '概念本質：' : 'Core Concept: '}
                  </strong>
                  {isJa ? '従来の労働は「1つの時間を1度売る」スタイルです。当システムは「20年のシステム設計・開発実績」とAIエージェント協調プログラミングを結集し、集客・受注・納品の全工程をソフトウェア化。「1つの時間を世界複数国へ並行展開し、24時間自動で入金され続ける仕組み」を実現します。' :
                   isZhCN ? '传统工作是「1份时间卖1次」；本系统透过「20年跨领域系统架构经验」与 AI Agent 协作编程，将寻客、接单、交付全流程软件化，实现「1份时间平行拓展到全球多国、24小时持续自动收钱」。' :
                   isZhTW ? '傳統工作是「1份時間賣1次」；本系統透過「20年跨領域系統架構經驗」與 AI Agent 協作編程，將尋客、接單、交付全流程軟體化，實現「1份時間平行拓展到全球多國、24小時持續自動收錢」。' :
                   'Traditional jobs sell 1 hour once. Our 20-year architecture and AI Agent orchestration software-automate lead acquisition, closing, and delivery—allowing 1 slice of time to multiply across countries, collecting automated revenues 24/7.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <strong className="block text-emerald-700 font-bold mb-1">
                      {isJa ? '1. 集客 (自動自来客システム)' :
                       isZhCN ? '1. 寻找客户 (自来客系统)' :
                       isZhTW ? '1. 尋找客戶 (自來客系統)' :
                       '1. Acquisition (Inbound Traffic)'}
                    </strong>
                    {isJa ? 'AIショート動画マトリクスとWordPress自動SEOサイト群を組み合わせ、高額広告費なしで永続的な自走集客を実現。' :
                     isZhCN ? 'AI 短影音矩阵结合 WordPress 自动化多语系 SEO 站群，打造永续自来客流，摆脱昂贵广告费。' :
                     isZhTW ? 'AI 短影音矩陣結合 WordPress 自動化多語系 SEO 站群，打造永續自來客流，擺脫昂貴廣告費。' :
                     'AI video matrices and multilingual SEO networks deliver perpetual inbound traffic without hefty ad spending.'}
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <strong className="block text-cyan-700 font-bold mb-1">
                      {isJa ? '2. 顧客対応 (多言語AIサポート)' :
                       isZhCN ? '2. 接洽客户 (全球客服系统)' :
                       isZhTW ? '2. 接洽客戶 (全球客服系統)' :
                       '2. Engagement (Multilingual AI)'}
                    </strong>
                    {isJa ? '多言語対応のAIエージェントが、時差ゼロ・即座に疑問を解消し、信頼構築と高成約クロージングを代行。' :
                     isZhCN ? '内嵌多国语言 AI 客服 Agent，跨时区、零秒差自动解答疑虑、引导信任并精准促单。' :
                     isZhTW ? '內嵌多國語言 AI 客服 Agent，跨時區、零秒差自動解答疑慮、引導信任並精準促單。' :
                     'Embedded 24/7 multilingual AI Agents resolve queries with zero delay, earning trust and driving conversions.'}
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <strong className="block text-purple-700 font-bold mb-1">
                      {isJa ? '3. 注文納品 (即時決済＆自動配信)' :
                       isZhCN ? '3. 订单交付 (收款发货系统)' :
                       isZhTW ? '3. 訂單交付 (收款發貨系統)' :
                       '3. Fulfillment (Auto-Checkout)'}
                    </strong>
                    {isJa ? '自動決済ゲートウェイとデジタル配信を統合。入金確認の瞬間に権限とマスターファイルを自動送付し、完全手放し運用を実現。' :
                     isZhCN ? '串接自动化支付闸道与数位交付流程，顾客付款成功瞬间自动发送权限与母档，零人力介入。' :
                     isZhTW ? '串接自動化支付閘道與數位交付流程，顧客付款成功瞬間自動發送權限與母檔，零人力介入。' :
                     'Integrated payment gateways and digital delivery dispatch licenses and files instantly upon payment with zero human effort.'}
                  </div>
                </div>

                <div className="mt-2 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs sm:text-sm">
                  <strong className="font-black text-emerald-900 flex items-center gap-1.5 mb-1">
                    <span>💡</span>
                    {isJa ? '初心者向け解説：' : isZhCN ? '小白通俗理解：' : isZhTW ? '小白通俗理解：' : 'Beginner Analogy:'}
                  </strong>
                  {isJa ? '世界中の主要都市に何十台もの無人自動販売機（AI-ATM）を設置するようなもの。チラシ配りから商品紹介、決済、納品まで、すべてAIロボットがあなたに代わって完結します。' :
                   isZhCN ? '就像在全世界各大城市开了几十台无人自动贩卖机（AI-ATM），从发传单、介绍商品到收钱出货，全部由 AI 机器人替你搞定。' :
                   isZhTW ? '就像在全世界各大城市開了幾十台無人自動販賣機（AI-ATM），從發傳單、介紹商品到收錢出貨，全部由 AI 機器人替你搞定。' :
                   'Like deploying dozens of unmanned smart vending machines (AI-ATMs) across major global cities: from distributing flyers to product demos, payment collection, and shipping, AI handles everything for you.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 💼 官方實戰作品集 (Portfolio Matrix - 首頁全數位產品與客製實例) */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">
              {isJa ? '稼働中ポートフォリオ' : 'LIVE PROVEN PORTFOLIO'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
              {isJa ? '💼 首席アーキテクト実績ポートフォリオ（全システム実稼働ツアー）' :
               isZhCN ? '💼 首席架构师作品集矩阵 (全系统实绩巡礼)' :
               isZhTW ? '💼 首席架構師作品集矩陣 (全系統實績巡禮)' :
               '💼 Proven Architecture Portfolio (Live System Showcase)'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {isJa ? '以下はすべて当公式サイト上で実際に稼働しているフラッグシップ・アーキテクチャです。スマートコントラクトから高並行AIアプリケーションまで、フルスタックの開発実力を証明しています：' :
               isZhCN ? '以下皆为已落地运行于本官网的旗舰级架构，证明我们具备由底层智能合约至顶层高并发 AI 应用的全端驾御实力：' :
               isZhTW ? '以下皆為已落地運行於本官網的旗艦級架構，證明我們具備由底層智能合約至頂層高併發 AI 應用的全端駕御實力：' :
               'All systems below are live production architectures running on this official site, showcasing full-stack mastery from Web3 contracts to high-concurrency AI applications:'}
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 whitespace-nowrap">
            {isJa ? '100% 自社開発・依存ゼロ' :
             isZhCN ? '100% 自研·无依赖' :
             isZhTW ? '100% 自研·無依賴' :
             '100% Proprietary & Turnkey'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* 作品 01 */}
          <div className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700 hover:border-sky-400 transition-all flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-sky-400">PORTFOLIO 01</span>
              <h4 className="font-black text-white text-base mt-1 mb-2">
                {isJa ? 'Web3 クラウドファンディングNFTバウチャーシステム' :
                 isZhCN ? 'Web3 万商算力众筹 NFT 凭证系统' :
                 isZhTW ? 'Web3 萬商算力眾籌 NFT 憑證系統' :
                 'Web3 Hashrate Crowdfund NFT Voucher System'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {isJa ? 'PayUni クレジットカード決済と Polygon USDT のデュアル決済を統合。自動コントラクト精算、ガス代不要の法定通貨ホワイトリスト、VIP算力引換フローを実装。' :
                 isZhCN ? '串接 PayUni 法币信用卡与 Polygon USDT 双轨支付，全自动合约结算、免 Gas 费法币白名单、VIP 算力凭证兑换流。' :
                 isZhTW ? '串接 PayUni 法幣信用卡與 Polygon USDT 雙軌支付，全自動合約結算、免 Gas 費法幣白名單、VIP 算力憑證兌換流。' :
                 'Dual-rail checkout with PayUni fiat credit cards and Polygon USDT, automated contract settlement, gasless whitelisting, and VIP voucher redemptions.'}
              </p>
            </div>
            <a href="#crowdfund-packages" className="text-xs font-bold text-sky-400 hover:text-sky-300">
              {isJa ? 'クラファン構成を見る →' : isZhCN ? '查看众筹架构 →' : isZhTW ? '查看眾籌架構 →' : 'View Crowdfund Architecture →'}
            </a>
          </div>

          {/* 作品 02 */}
          <div className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700 hover:border-emerald-400 transition-all flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-400">PORTFOLIO 02</span>
              <h4 className="font-black text-white text-base mt-1 mb-2">
                {isJa ? '🎓 AIマスター教材 即時決済・自動配信システム' :
                 isZhCN ? '🎓 AI 顶配教材付费秒级交付系统' :
                 isZhTW ? '🎓 AI 頂配教材付費秒級交付系統' :
                 '🎓 Master AI Course Instant Delivery Engine'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {isJa ? '決済後即時アンロック、専用R2高速ダウンロード、HTML高CVLP制作ツール、偽造防止認証と友人へのワンクリック転送エンジン。' :
                 isZhCN ? '付费秒级解锁、专用 R2 高速下载、HTML 爆款宣传工作台、防伪验证与亲友电邮一键转发引擎。' :
                 isZhTW ? '付費秒級解鎖、專用 R2 高速下載、HTML 爆款宣傳工作台、防偽驗證與親友電郵一鍵轉發引擎。' :
                 'Instant unlock upon payment, high-speed Cloudflare R2 downloads, HTML sales workbench, anti-counterfeit verification, and 1-click email forwarding.'}
              </p>
            </div>
            <a href="#tutor-courses" className="text-xs font-bold text-emerald-400 hover:text-emerald-300">
              {isJa ? '教材エリアを見る →' : isZhCN ? '查看教材专区 →' : isZhTW ? '查看教材專區 →' : 'View Master Courses →'}
            </a>
          </div>

          {/* 作品 03 */}
          <div className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700 hover:border-purple-400 transition-all flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-purple-400">PORTFOLIO 03</span>
              <h4 className="font-black text-white text-base mt-1 mb-2">
                {isJa ? '📚 3言語版電子書籍SaaSテンプレート＆本棚' :
                 isZhCN ? '📚 3 版语系电子书 SaaS 模版与书柜' :
                 isZhTW ? '📚 3 版語系電子書 SaaS 模版與書櫃' :
                 '📚 Tri-Lingual E-Book SaaS & Reader Bookshelf'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {isJa ? 'Google 4 旗艦エンジン、8章節25ページ超、バイリンガル/純日本語/純英語マスター生成、専用R2ホスティング、3〜7日審査と100%相殺制度。' :
                 isZhCN ? 'Google 4 旗舰大脑、8篇章25+页、中英双语/纯繁中/纯英文母档生成、专用 R2 托管、3~7天书审与 100% 倒抵机制。' :
                 isZhTW ? 'Google 4 旗艦大腦、8篇章25+頁、中英雙語/純繁中/純英文母檔生成、專用 R2 託管、3~7天書審與 100% 倒抵機制。' :
                 'Google 4 authority compilation, 8 chapters 25+ pages, bilingual/native master generation, R2 hosting, 3-7 day compliance review, and 100% fee rebates.'}
              </p>
            </div>
            <a href="/ebook-store" className="text-xs font-bold text-purple-400 hover:text-purple-300">
              {isJa ? '電子書籍ストアへ →' : isZhCN ? '查看电子书城 →' : isZhTW ? '查看電子書城 →' : 'Visit E-Book Store →'}
            </a>
          </div>

          {/* 作品 04 */}
          <div className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700 hover:border-amber-400 transition-all flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-amber-400">PORTFOLIO 04</span>
              <h4 className="font-black text-white text-base mt-1 mb-2">
                {isJa ? '🛒 YouTube 影分身動画ショッピングシステム' :
                 isZhCN ? '🛒 YouTube 影分身影片导购系统' :
                 isZhTW ? '🛒 YouTube 影分身影片導購系統' :
                 '🛒 YouTube Shadow Clone Video Commerce Engine'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {isJa ? '公式APIの深層統合、動画再生タイムラインのホットスポット固定、商品カードの即時ポップアップ、高コンバージョン購入フローを完結。' :
                 isZhCN ? '官方 API 深度整合，播放时间轴热点精准锚定、商品卡片秒级弹出、高转化电商跳转导购闭环。' :
                 isZhTW ? '官方 API 深度整合，播放時間軸熱點精準錨定、商品卡片秒級彈出、高轉化電商跳轉導購閉環。' :
                 'Deep official API orchestration, timeline hotspot pinning, instant product card popups, and high-conversion e-commerce funnels.'}
              </p>
            </div>
            <span className="text-xs font-bold text-amber-400">
              {isJa ? '下のタブで実機体験 ↑' : isZhCN ? '下方标签直接体验实机 ↑' : isZhTW ? '下方標籤直接體驗實機 ↑' : 'Test Live System in Tab Below ↑'}
            </span>
          </div>

          {/* 作品 05 */}
          <div className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700 hover:border-teal-400 transition-all flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-teal-400">PORTFOLIO 05</span>
              <h4 className="font-black text-white text-base mt-1 mb-2">
                {isJa ? '🌐 AI集客365日無料・グローバルオンラインチェーン店' :
                 isZhCN ? '🌐 AI寻客365天拢免钱・全球网购连锁店' :
                 isZhTW ? '🌐 AI尋客365天攏免錢・全球網購連鎖店' :
                 '🌐 AI Traffic 365 Days Free · Global Retail Network'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {isJa ? '$660 USD フルパッケージ、$198 教材進呈、25%アフィリエイト分配対象、LiveGood 会員定期購読の完全自動運用を統合。' :
                 isZhCN ? '$660 USD 全包办，赠送 $198 顶配教材、享 25% 联盟分润，并整合 LiveGood 全球会员订阅一条龙代操。' :
                 isZhTW ? '$660 USD 全包辦，贈送 $198 頂配教材、享 25% 聯盟分潤，並整合 LiveGood 全球會員訂閱一條龍代操。' :
                 'Turnkey $660 USD package with $198 course gift, 25% affiliate eligibility, and full automated concierge co-broadcasting for LiveGood global subscriptions.'}
              </p>
            </div>
            <span className="text-xs font-bold text-teal-400">
              {isJa ? '下のタブ 03 参照 ↑' : isZhCN ? '下方标签 03 详解 ↑' : isZhTW ? '下方標籤 03 詳解 ↑' : 'See Details in Tab 03 ↑'}
            </span>
          </div>

          {/* 作品 06 */}
          <div className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700 hover:border-pink-400 transition-all flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-pink-400">PORTFOLIO 06</span>
              <h4 className="font-black text-white text-base mt-1 mb-2">
                {isJa ? '👥 25% アフィリエイト分配＆無限世代差額精算エンジン' :
                 isZhCN ? '👥 25% 联盟分润与无限代级差结算器' :
                 isZhTW ? '👥 25% 聯盟分潤與無限代級差結算器' :
                 '👥 25% Viral Affiliate Differential Settlement Engine'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {isJa ? '10%級差 + 10%対等 + 5%グローバル均分、自己消費実績の合算判定、自然流入訪問者の最上位リーダー自動紐付けで漏れゼロ。' :
                 isZhCN ? '10% 级差 + 10% 对等 + 5% 全球领袖均分，自消费资格并入，非推荐人自然流量自动顶阶绑定零漏单。' :
                 isZhTW ? '10% 級差 + 10% 對等 + 5% 全球領袖均分，自消費資格併入，非推薦人自然流量自動頂階綁定零漏單。' :
                 '10% differential + 10% matching + 5% global pool, self-purchase tier credit, and automatic top-tier leader binding for organic visitors with zero missed commissions.'}
              </p>
            </div>
            <a href="/dashboard" className="text-xs font-bold text-pink-400 hover:text-pink-300">
              {isJa ? '会員センターへ →' : isZhCN ? '查看会员中心 →' : isZhTW ? '查看會員中心 →' : 'View Member Dashboard →'}
            </a>
          </div>
        </div>
      </div>

      {/* 4. 📝 線上提交「AI 架構系統客製接案需求」表單 (Client Intake Form) */}
      <div id="custom-intake-form" className="scroll-mt-28 rounded-3xl p-6 sm:p-10 border-2 border-sky-400 bg-white shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-200">
          <div>
            <span className="text-xs font-black text-sky-600 uppercase tracking-widest">
              {isJa ? 'システム受託開発ヒアリング' : 'BESPOKE SYSTEM COMMISSION INTAKE'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {isJa ? '📝 AIシステム受託開発・要件相談（チーフエンジニア直轄審査）' :
               isZhCN ? '📝 提交您的 AI 架构系统客制接案需求 (总工程师亲审)' :
               isZhTW ? '📝 提交您的 AI 架構系統客製接案需求 (總工程師親審)' :
               '📝 Submit Your Bespoke AI System Commission Intake (Reviewed by CTO)'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {isJa ? 'プロジェクトの目標を具体的にお知らせください。「誠実な対話・厳格な技術評価・誇大な約束の排除」をお約束します。送信後、チーフエンジニアSENが24時間以内にご連絡いたします！' :
               isZhCN ? '请详实填写您的专案目标。我们坚持「真诚对应、严谨评估、绝不夸大」。送出后将由总工程师 SEN 于 24 小时内与您联系！' :
               isZhTW ? '請詳實填寫您的專案目標。我們堅持「真誠對應、嚴謹評估、絕不誇大」。送出後將由總工程師 SEN 於 24 小時內與您聯繫！' :
               'Please detail your project objectives. We adhere to sincere alignment, rigorous technical evaluation, and zero false claims. CTO SEN will contact you within 24 hours!'}
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200 whitespace-nowrap">
            {isJa ? '🔒 機密情報厳守' : isZhCN ? '🔒 商业信息严格保密' : isZhTW ? '🔒 商業資訊嚴格保密' : '🔒 Strict Confidentiality'}
          </span>
        </div>

        <form onSubmit={handleSubmitInquiry} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5">
                {isJa ? '1. お名前 / 役職 / 会社名 *' :
                 isZhCN ? '1. 您的姓名 / 称呼 / 公司名称 *' :
                 isZhTW ? '1. 您的姓名 / 稱呼 / 公司名稱 *' :
                 '1. Your Name / Title / Company *'}
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder={isJa ? '例：山田 太郎 / 株式会社ABCマーケティング' : isZhCN ? '例：陈总裁 / ABC 数字行销' : isZhTW ? '例：陳總裁 / ABC 數位行銷' : 'e.g. John Doe / ABC Digital'}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5">
                {isJa ? '2. ご希望の連絡方法・アカウント / Email *' :
                 isZhCN ? '2. 偏好联系管道与账号 / Email *' :
                 isZhTW ? '2. 偏好聯繫管道與帳號 / Email *' :
                 '2. Preferred Contact Channel & Account / Email *'}
              </label>
              <div className="flex gap-2">
                <select
                  value={contactChannel}
                  onChange={(e) => setContactChannel(e.target.value as any)}
                  className="bg-slate-100 border border-slate-300 rounded-xl px-3 py-3 text-xs font-bold text-slate-700 focus:outline-none"
                >
                  <option value="email">Email</option>
                  <option value="line">LINE ID</option>
                  <option value="wechat">{isJa ? 'WeChat ID' : isZhCN ? '微信 ID' : '微信 ID'}</option>
                  <option value="other">{isJa ? '電話 / その他' : isZhCN ? '电话 / 其他' : isZhTW ? '電話 / 其他' : 'Phone / Other'}</option>
                </select>
                <input
                  type="text"
                  value={contactValue}
                  onChange={(e) => setContactValue(e.target.value)}
                  placeholder={isJa ? 'Email または ID を入力' : isZhCN ? '输入您的 Email 或 ID' : isZhTW ? '輸入您的 Email 或 ID' : 'Enter your Email or ID'}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none flex-1"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5">
                {isJa ? '3. 開発を希望するシステム種別 *' :
                 isZhCN ? '3. 欲客制开发之系统类型 *' :
                 isZhTW ? '3. 欲客製開發的系統類型 *' :
                 '3. Desired System Architecture Type *'}
              </label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:outline-none font-bold"
              >
                <option value="AI-ATM 全球自動化變現系統">{isJa ? 'AI-ATM グローバル自動収益化システム' : isZhCN ? 'AI-ATM 全球自动化变现系统' : 'AI-ATM 全球自動化變現系統'}</option>
                <option value="多語系 AI 智能客服 Agent 系統">{isJa ? '多言語 AI カスタマーサポート Agent システム' : isZhCN ? '多语系 AI 智能客服 Agent 系统' : '多語系 AI 智能客服 Agent 系統'}</option>
                <option value="電子書 / 課程教材 SaaS 自動交付系統">{isJa ? '電子書籍 / 教材 SaaS 自動配信システム' : isZhCN ? '电子书 / 课程教材 SaaS 自动交付系统' : '電子書 / 課程教材 SaaS 自動交付系統'}</option>
                <option value="YouTube 官方 API 影片導購系統">{isJa ? 'YouTube 公式 API 動画ショッピングシステム' : isZhCN ? 'YouTube 官方 API 影片导购系统' : 'YouTube 官方 API 影片導購系統'}</option>
                <option value="AI 短影音 + WP-SEO 雙軌自來客矩陣">{isJa ? 'AI ショート動画 ＋ WP-SEO デュアル集客マトリクス' : isZhCN ? 'AI 短影音 + WP-SEO 双轨自来客矩阵' : 'AI 短影音 + WP-SEO 雙軌自來客矩陣'}</option>
                <option value="Web3 智能合約與 PayUni 混合支付閘道">{isJa ? 'Web3 スマートコントラクト ＆ PayUni ハイブリッド決済' : isZhCN ? 'Web3 智能合约与 PayUni 混合支付闸道' : 'Web3 智能合約與 PayUni 混合支付閘道'}</option>
                <option value="其他企業專屬客製化程式開發">{isJa ? 'その他 企業専用カスタム開発' : isZhCN ? '其他企业专属客制化程式开发' : '其他企業專屬客製化程式開發'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5">
                {isJa ? '4. ご予算目安 (USDT / USD) *' :
                 isZhCN ? '4. 预算规划区间 (USDT / USD) *' :
                 isZhTW ? '4. 預算規劃區間 (USDT / USD) *' :
                 '4. Estimated Budget Range (USDT / USD) *'}
              </label>
              <select
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:outline-none font-bold"
              >
                <option value="$300 ~ $1,000 USD (入門輕量功能)">{isJa ? '$300 ~ $1,000 USD (エントリー・軽量機能)' : isZhCN ? '$300 ~ $1,000 USD (入门轻量功能)' : '$300 ~ $1,000 USD (入門輕量功能)'}</option>
                <option value="$1,000 ~ $3,000 USD (標準商業系統)">{isJa ? '$1,000 ~ $3,000 USD (標準ビジネスシステム)' : isZhCN ? '$1,000 ~ $3,000 USD (标准商业系统)' : '$1,000 ~ $3,000 USD (標準商業系統)'}</option>
                <option value="$3,000 ~ $10,000 USD (企業級全自動閉環)">{isJa ? '$3,000 ~ $10,000 USD (エンタープライズ全自動ループ)' : isZhCN ? '$3,000 ~ $10,000 USD (企业级全自动闭环)' : '$3,000 ~ $10,000 USD (企業級全自動閉環)'}</option>
                <option value="$10,000+ USD (全球化旗艦客製與專屬託管)">{isJa ? '$10,000+ USD (グローバル旗艦カスタム・専用保守)' : isZhCN ? '$10,000+ USD (全球化旗舰客制与专属托管)' : '$10,000+ USD (全球化旗艦客製與專屬託管)'}</option>
                <option value="面議 / 依需求評估議價">{isJa ? '相談 / 要件評価後に見積' : isZhCN ? '面议 / 依需求评估议价' : '面議 / 依需求評估議價'}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 mb-1.5">
              {isJa ? '5. システムのコア業務、要件、解決したい課題の概要 *' :
               isZhCN ? '5. 系统核心任务、业务流程与客制需求描述 *' :
               isZhTW ? '5. 系統核心任務、業務流程與客製需求描述 *' :
               '5. Core System Tasks, Workflows & Requirement Description *'}
            </label>
            <textarea
              rows={4}
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              placeholder={isJa ? '業界、解決したい課題、想定ユーザーフロー、連携したい外部API・決済サービスなどをご記入ください...' : isZhCN ? '请简述您的产业背景、想要解决的痛点、预期使用者流程，或需要对接的外部平台 API / 金流...' : isZhTW ? '請簡述您的產業背景、想要解決的痛點、預期使用者流程，或需要對接的外部平台 API / 金流...' : 'Please describe your industry background, pain points to solve, expected user journeys, or external APIs/gateways needed...'}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 text-sm text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p className="text-xs text-slate-500">
              {isJa ? '※ 要件受領後、チーフエンジニアSENが技術的実現性、納期、見積を自ら評価いたします。営業を挟まないダイレクト対応です。' :
               isZhCN ? '※ 收到需求后，总工程师 SEN 将亲自评估技术可行性、开发工期与精准报价，绝不假手业务推托。' :
               isZhTW ? '※ 收到需求後，總工程師 SEN 將親自評估技術可行性、開發工期與精準報價，絕不假手業務推託。' :
               '※ Upon receiving your intake, CTO SEN will directly assess technical feasibility, timeline, and exact pricing with zero sales intermediaries.'}
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white font-black text-sm rounded-xl shadow-xl shadow-sky-600/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              {submitting
                ? (isJa ? '🚀 チーフエンジニアへ送信中...' : isZhCN ? '🚀 正在传送至总工程师...' : isZhTW ? '🚀 正在傳送至總工程師...' : '🚀 Submitting to CTO...')
                : (isJa ? '🚀 要件をチーフエンジニアSENへ送信' : isZhCN ? '🚀 送出客制接案需求单' : isZhTW ? '🚀 送出客製接案需求單' : '🚀 Submit Project Intake to CTO')}
            </button>
          </div>
        </form>

        {submitResult && (
          <div
            className={`mt-4 p-4 rounded-xl text-xs sm:text-sm font-bold border ${
              submitResult.type === 'ok'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-red-50 border-red-300 text-red-800'
            }`}
          >
            {submitResult.text}
          </div>
        )}
      </div>

      {/* 5. 🤝 官方總工程師 SEN 專屬窗口 & 一鍵 AI 客服諮詢雙入口 */}
      <div className="rounded-3xl p-6 sm:p-8 text-center text-white border-2 border-sky-400 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 shadow-xl">
        <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
          {isJa ? '🤝 以下の公式窓口より、チーフエンジニアSENと直接ご相談いただけます' :
           isZhCN ? '🤝 亦可透过以下官方管道，直接与总工程师 SEN 深度对接' :
           isZhTW ? '🤝 亦可透過以下官方管道，直接與總工程師 SEN 深度對接' :
           '🤝 Connect Directly with CTO SEN via Official Channels'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto mb-6 leading-relaxed">
          {isJa ? 'NDA（秘密保持契約）の締結が必要な場合や、即時のアーキテクチャ相談は、メール・LINE・WeChat公式窓口をご利用ください：' :
           isZhCN ? '若您的专案需签署保密协议 (NDA) 或有即时架构咨询需求，欢迎随时透过信箱、LINE 或微信官方窗口直连：' :
           isZhTW ? '若您的專案需簽署保密協議 (NDA) 或有即時架構諮詢需求，歡迎隨時透過信箱、LINE 或微信官方窗口直連：' :
           'If your project requires an NDA or immediate architectural consultation, connect directly via Email, LINE, or WeChat:'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {/* 電郵 Email */}
          <div className="bg-white/5 border border-white/10 hover:border-sky-400 rounded-2xl p-4 flex flex-col justify-between items-center transition-all">
            <div>
              <span className="text-2xl">📧</span>
              <div className="text-[11px] text-slate-400 mt-1 uppercase font-bold">
                {isJa ? 'チーフエンジニア直通メール' : isZhCN ? '总工程师信箱' : isZhTW ? '總工程師信箱' : 'CTO Direct Email'}
              </div>
              <div className="text-sm font-extrabold text-sky-300 my-1 break-all">xyz007tw@gmail.com</div>
            </div>
            <a
              href="mailto:xyz007tw@gmail.com?subject=【AI客製專案洽詢】20年架構師系統開發合作"
              className="mt-2 w-full py-2 px-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all text-center"
            >
              {isJa ? '✉️ メールを送る' : isZhCN ? '✉️ 发送电邮' : isZhTW ? '✉️ 發送電郵' : '✉️ Send Email'}
            </a>
          </div>

          {/* LINE */}
          <div className="bg-white/5 border border-white/10 hover:border-sky-400 rounded-2xl p-4 flex flex-col justify-between items-center transition-all">
            <div>
              <span className="text-2xl">💚</span>
              <div className="text-[11px] text-slate-400 mt-1 uppercase font-bold">
                {isJa ? '公式 LINE ID' : isZhCN ? '官方 LINE ID' : isZhTW ? '官方 LINE ID' : 'Official LINE ID'}
              </div>
              <div className="text-base font-extrabold text-sky-300 my-1">xyz007tw</div>
            </div>
            <a
              href="https://line.me/ti/p/~xyz007tw"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleCopyId('xyz007tw', 'LINE')}
              className="mt-2 w-full py-2 px-3 rounded-lg bg-[#06c755] hover:bg-[#05a847] text-white text-xs font-bold transition-all text-center"
            >
              {isJa ? '📲 LINEで友達追加' : isZhCN ? '📲 加 LINE 好友' : isZhTW ? '📲 加 LINE 好友' : '📲 Add LINE Friend'}
            </a>
          </div>

          {/* WeChat */}
          <div className="bg-white/5 border border-white/10 hover:border-sky-400 rounded-2xl p-4 flex flex-col justify-between items-center transition-all">
            <div>
              <span className="text-2xl">💬</span>
              <div className="text-[11px] text-slate-400 mt-1 uppercase font-bold">
                {isJa ? '公式 WeChat ID' : isZhCN ? '官方 微信 ID' : isZhTW ? '官方 微信 ID' : 'Official WeChat ID'}
              </div>
              <div className="text-base font-extrabold text-sky-300 my-1">xyz007tw</div>
            </div>
            <button
              type="button"
              onClick={() => handleCopyId('xyz007tw', 'WeChat / 微信')}
              className="mt-2 w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer text-center"
            >
              {isJa ? '📋 WeChat IDをコピー' : isZhCN ? '📋 复制微信 ID' : isZhTW ? '📋 複製微信 ID' : '📋 Copy WeChat ID'}
            </button>
          </div>

          {/* AI 客服 */}
          <div className="bg-gradient-to-b from-sky-500/20 to-purple-500/20 border border-sky-400/60 rounded-2xl p-4 flex flex-col justify-between items-center">
            <div>
              <span className="text-2xl">🤖</span>
              <div className="text-[11px] text-sky-300 mt-1 uppercase font-bold">
                {isJa ? '24時間 即時対応' : isZhCN ? '24H 零时差' : isZhTW ? '24H 零時差' : '24/7 Zero Latency'}
              </div>
              <div className="text-sm font-black text-white my-1">
                {isJa ? 'WeiXiang AI サポート' : isZhCN ? '微享 AI 智能客服' : isZhTW ? '微享 AI 智能客服' : 'WeiXiang AI Support'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleOpenAIChat()}
              className="mt-2 w-full py-2 px-3 rounded-lg bg-gradient-to-r from-sky-500 to-purple-600 hover:from-sky-400 hover:to-purple-500 text-white text-xs font-black shadow-md cursor-pointer text-center"
            >
              {isJa ? '⚡ 今すぐAIに相談' : isZhCN ? '⚡ 立即唤起客服' : isZhTW ? '⚡ 立即喚起客服' : '⚡ Chat with AI'}
            </button>
          </div>
        </div>

        {copyToast && (
          <div className="mt-4 inline-block px-4 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-bold">
            {copyToast}
          </div>
        )}
      </div>
    </div>
  );
}
