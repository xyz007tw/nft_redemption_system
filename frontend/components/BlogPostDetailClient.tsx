'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BLOG_CATEGORIES, BlogPost, getLocalizedPost } from '@/lib/blogEngine';
import { SiteNavbar } from '@/components/SiteNavbar';
import { useLanguage } from '@/lib/LanguageContext';

interface BlogPostDetailClientProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

const UI_TEXTS: Record<string, any> = {
  'zh-TW': {
    home: '微享官網首頁',
    blog: '斜槓創客專欄',
    jump: '直達本文介紹的官網專區 →',
    readMin: (m: number) => `⏱️ ${m} 分鐘實戰閱讀`,
    publishedAt: '發布於',
    askChatbot: '💬 詢問右下角 AI 客服本文方案',
    execSummary: '📌 部落客實戰重點速覽 (EXECUTIVE SUMMARY)',
    ctaPre: '🔥 網路小白・下班創客・斜槓族零風險首選',
    ctaTitle: '看完這篇部落客實測，準備好啟動您的 24H「知識自動販賣機 AI-ATM」了嗎？',
    ctaDesc: '不用自己架網站、不用煩惱沒流量！現在就前往微享官網對應專區，或直接點擊右下角「💬 歡迎聊聊 ✨」讓 24 小時 AI 客服與總工程師 SEN 為您服務。所有自消費（含 $3 斗內、$990 電子書加盟、買教材）皆 100% 併入您的級差升等累積業績！',
    ctaChat: '💬 喚起右下角 AI 客服一對一諮詢',
    faqTitle: '💡 新手常見問題 Q&A（網路小白必看）',
    sidebarNav: '微享官網・全項目快速導覽',
    sidebarNavBadge: '24H 自動變現',
    sidebarNavDesc: '點擊下方任一項目即可直接跳轉至官網對應功能區：',
    vending: '🏪 知識自動販賣機 AI-ATM',
    vendingSub: '$990 倒抵 →',
    architect: '👑 總工程師20年 AI-ATM 接案',
    architectSub: '專案客製 →',
    course: '🎓 AI 頂配家教實戰教材',
    courseSub: '秒級下載 →',
    ebook: '📚 VIP 全球名家電子書櫃',
    ebookSub: '免費試閱 →',
    shoppable: '🛒 AI 影片導購 & 365天免錢',
    shoppableSub: '$300 / $660 →',
    affiliate: '💰 25% 人推人脈複利分潤後台',
    affiliateSub: '查看業績 →',
    sponsor: '💎 請總工程師喝珍奶 ($3 起)',
    sponsorSub: '解鎖25%流水 →',
    contactTitle: '🤖 24H 全自動 AI 客服 ＆ 總工程師窗口',
    contactSub: '有客製化需求或想了解如何斜槓起步？',
    contactDesc: '畫面右下角設有「🛠️ AI客製服務」、「🎓 AI頂配教材」與「💬 歡迎聊聊 ✨」懸浮捷徑（手機版位於畫面正下方導覽列），隨時為您解答！',
    contactSEN: '👨‍💻 總窗口：CTO SEN / 總工程師 SEN',
    contactEmail: '📧 信箱：xyz007tw@gmail.com',
    contactSocial: '💬 LINE / 微信 ID：xyz007tw',
    contactBtn: '💬 立即開啟右下角 AI 客服對話',
    relatedTitle: '📚 更多創客實戰延伸閱讀',
    viewAll: '查看全部創客部落格文章 →',
    translating: '🌐 正在為您智慧切換語系中...',
  },
  'zh-CN': {
    home: '微享官网首页',
    blog: '斜杠创客专栏',
    jump: '直达本文介绍的官网专区 →',
    readMin: (m: number) => `⏱️ ${m} 分钟实战阅读`,
    publishedAt: '发布于',
    askChatbot: '💬 询问右下角 AI 客服本文方案',
    execSummary: '📌 部落客实战重点速览 (EXECUTIVE SUMMARY)',
    ctaPre: '🔥 网络小白・下班创客・斜杠族零风险首选',
    ctaTitle: '看完这篇部落客实测，准备好启动您的 24H“知识自动贩卖机 AI-ATM”了吗？',
    ctaDesc: '不用自己搭建网站、不用烦恼没有流量！现在就前往微享官网对应专区，或直接点击右下角“💬 欢迎聊聊 ✨”让 24 小时 AI 客服与总工程师 SEN 为您服务。所有自消费（含 $3 赞助、$990 电子书加盟、买教材）皆 100% 算入您的级差升级累计业绩！',
    ctaChat: '💬 唤起右下角 AI 客服一对一咨询',
    faqTitle: '💡 新手常见问题 Q&A（网络小白必看）',
    sidebarNav: '微享官网・全项目快速导航',
    sidebarNavBadge: '24H 自动变现',
    sidebarNavDesc: '点击下方任一项目即可直接跳转至官网对应功能区：',
    vending: '🏪 知识自动贩卖机 AI-ATM',
    vendingSub: '$990 倒抵 →',
    architect: '👑 总工程师20年 AI-ATM 接案',
    architectSub: '专案客制 →',
    course: '🎓 AI 顶配家教实战教材',
    courseSub: '秒级下载 →',
    ebook: '📚 VIP 全球名家电子书柜',
    ebookSub: '免费试阅 →',
    shoppable: '🛒 AI 影片导购 & 365天免钱',
    shoppableSub: '$300 / $660 →',
    affiliate: '💰 25% 人推人脉复利分润后台',
    affiliateSub: '查看业绩 →',
    sponsor: '💎 请总工程师喝珍奶 ($3 起)',
    sponsorSub: '解锁25%流水 →',
    contactTitle: '🤖 24H 全自动 AI 客服 ＆ 总工程师窗口',
    contactSub: '有客制化需求或想了解如何斜杠起步？',
    contactDesc: '画面右下角设有“🛠️ AI客制服务”、“🎓 AI顶配教材”与“💬 欢迎聊聊 ✨”悬浮快捷方式（手机版位于画面正下方导航栏），随时为您解答！',
    contactSEN: '👨‍💻 总窗口：CTO SEN / 总工程师 SEN',
    contactEmail: '📧 邮箱：xyz007tw@gmail.com',
    contactSocial: '💬 LINE / 微信 ID：xyz007tw',
    contactBtn: '💬 立即开启右下角 AI 客服对话',
    relatedTitle: '📚 更多创客实战延伸阅读',
    viewAll: '查看全部创客部落格文章 →',
    translating: '🌐 正在为您智能切换语系中...',
  },
  'en-US': {
    home: 'Home',
    blog: 'Creator Blog',
    jump: 'Jump to Official Feature →',
    readMin: (m: number) => `⏱️ ${m} min read`,
    publishedAt: 'Published on',
    askChatbot: '💬 Ask AI Chatbot About This Plan',
    execSummary: '📌 EXECUTIVE SUMMARY (Key Takeaways)',
    ctaPre: '🔥 Zero-Risk Pick for Beginners, Side-Hustlers & Creators',
    ctaTitle: 'Ready to Launch Your 24/7 "Knowledge Vending Machine AI-ATM"?',
    ctaDesc: 'No website coding required, zero traffic worries! Head over to the official feature section or click "Chat with us ✨" at bottom right to consult with Chief Engineer SEN. Every self-purchase ($3 sponsor, $990 franchise, courses) stacks 100% toward your tier qualification!',
    ctaChat: '💬 Chat 1-on-1 with AI Assistant',
    faqTitle: '💡 Beginner FAQs & Practical Answers',
    sidebarNav: 'WeiXiang Official Core Navigation',
    sidebarNavBadge: '24/7 Cashflow',
    sidebarNavDesc: 'Click any module below to jump directly to the live feature:',
    vending: '🏪 Knowledge Vending AI-ATM',
    vendingSub: '$990 Credit →',
    architect: '👑 20-Yr CTO Bespoke AI-ATM',
    architectSub: 'Bespoke →',
    course: '🎓 AI Master Courses',
    courseSub: 'Instant Download →',
    ebook: '📚 VIP Multilingual E-Book Store',
    ebookSub: 'Free Preview →',
    shoppable: '🛒 AI Shoppable & 365-Day Free Traffic',
    shoppableSub: '$300 / $660 →',
    affiliate: '💰 25% Viral Affiliate Dashboard',
    affiliateSub: 'Check Sales →',
    sponsor: '💎 Buy Bubble Tea ($3+) & Unlock Cashflow',
    sponsorSub: 'Unlock 25% →',
    contactTitle: '🤖 24/7 AI Sales Concierge & Chief Engineer Desk',
    contactSub: 'Have custom needs or want to start your side hustle?',
    contactDesc: 'Floating shortcuts for AI Services, AI Courses, and AI Chat are available at the bottom right (bottom bar on mobile).',
    contactSEN: '👨‍💻 Chief Architect: CTO SEN',
    contactEmail: '📧 Email: xyz007tw@gmail.com',
    contactSocial: '💬 LINE / WeChat ID: xyz007tw',
    contactBtn: '💬 Open AI Chatbot Now',
    relatedTitle: '📚 More Creator Practical Guides',
    viewAll: 'View All Creator Blog Posts →',
    translating: '🌐 Switching to your language...',
  },
  'ja-JP': {
    home: 'ホーム',
    blog: '実践ブログ',
    jump: '公式サイト該当機能へ直行 →',
    readMin: (m: number) => `⏱️ 読了目安 ${m}分`,
    publishedAt: '公開日',
    askChatbot: '💬 右下のAIチャットで相談する',
    execSummary: '📌 実践ポイント速報 (EXECUTIVE SUMMARY)',
    ctaPre: '🔥 初心者・副業クリエイターにノーリスクで選ばれる理由',
    ctaTitle: '24時間稼働の「知識の自動販売機 AI-ATM」を今すぐ始めませんか？',
    ctaDesc: 'Webサイト構築不要、集客の悩みもゼロ！公式サイトの専用エリアへ進むか、右下の「💬 チャットする ✨」で24時間AIサポート及び総エンジニアSENにご相談ください。自己購入（$3支援、$990フランチャイズ、教材）も100%昇格資格に累積されます！',
    ctaChat: '💬 AIチャットボットで個別相談',
    faqTitle: '💡 初心者向けよくある質問 Q&A',
    sidebarNav: '公式サイト・全プロジェクト目次',
    sidebarNavBadge: '24H 自動収益',
    sidebarNavDesc: '下記をクリックして公式サイトの各機能へ直接ジャンプ：',
    vending: '🏪 知識の自動販売機 AI-ATM',
    vendingSub: '$990 相殺 →',
    architect: '👑 20年の実績｜AI-ATM受託開発',
    architectSub: 'カスタム →',
    course: '🎓 AI最高峰マスター教材',
    courseSub: '即時DL →',
    ebook: '📚 VIPグローバル電子書籍',
    ebookSub: '無料試読 →',
    shoppable: '🛒 AI動画購買＆365日無料集客',
    shoppableSub: '$300 / $660 →',
    affiliate: '💰 25%紹介ネットワーク報酬管理',
    affiliateSub: '実績確認 →',
    sponsor: '💎 $3支援で25%報酬解放',
    sponsorSub: '25%解放 →',
    contactTitle: '🤖 24H 全自動AI窓口＆総エンジニア',
    contactSub: '受託開発のご相談や副業の始め方について',
    contactDesc: '画面右下に「🛠️ AIカスタム」「🎓 AI教材」「💬 チャットする」のショートカットを常備しています（スマホ版は最下部バー）。',
    contactSEN: '👨‍💻 総合窓口：CTO SEN / 総エンジニア SEN',
    contactEmail: '📧 メール：xyz007tw@gmail.com',
    contactSocial: '💬 LINE / WeChat ID：xyz007tw',
    contactBtn: '💬 今すぐAIチャットを開く',
    relatedTitle: '📚 おすすめ実践記事一覧',
    viewAll: 'すべてのブログ記事を見る →',
    translating: '🌐 言語を切り替えています...',
  },
  'ko-KR': {
    home: '홈',
    blog: '크리에이터 칼럼',
    jump: '공식 사이트 바로가기 →',
    readMin: (m: number) => `⏱️ ${m}분 소요`,
    publishedAt: '게시일',
    askChatbot: '💬 우측 하단 AI 상담원에게 문의',
    execSummary: '📌 핵심 요약 (EXECUTIVE SUMMARY)',
    ctaPre: '🔥 초보자・퇴근 후 크리에이터・N잡러 제로리스크 추천',
    ctaTitle: '24시간 무인 \'지식 자판기 AI-ATM\'을 시작할 준비가 되셨나요?',
    ctaDesc: '코딩과 사이트 제작 필요 없음! 모객 걱정도 제로! 공식 사이트 해당 섹션으로 이동하거나 우측 하단 \'💬 채팅하기 ✨\'를 통해 24시간 AI 비서 및 총괄 엔지니어 SEN에게 문의하세요. 모든 자가 소비($3 후원, $990 전자책 가맹 등)도 승급 실적에 100% 반영됩니다!',
    ctaChat: '💬 AI 비서와 1:1 상담하기',
    faqTitle: '💡 초보자를 위한 FAQ & 핵심 안내',
    sidebarNav: '공식 사이트 전체 핵심 메뉴',
    sidebarNavBadge: '24H 자동 수익',
    sidebarNavDesc: '아래 항목을 클릭하여 해당 기능으로 바로 이동하세요:',
    vending: '🏪 지식 자판기 AI-ATM',
    vendingSub: '$990 상쇄 →',
    architect: '👑 20년 경력｜AI-ATM 맞춤개발',
    architectSub: '상세보기 →',
    course: '🎓 AI 마스터 실전 교재',
    courseSub: '즉시 다운로드 →',
    ebook: '📚 VIP 글로벌 전자책 서재',
    ebookSub: '무료 미리보기 →',
    shoppable: '🛒 AI 영상 쇼핑 & 365일 모객',
    shoppableSub: '$300 / $660 →',
    affiliate: '💰 25% 추천 수익 파트너 대시보드',
    affiliateSub: '실적 확인 →',
    sponsor: '💎 $3 후원으로 25% 유동성 해금',
    sponsorSub: '25% 해금 →',
    contactTitle: '🤖 24시간 AI 상담원 & 총괄 엔지니어',
    contactSub: '맞춤형 개발 문의나 부업 시작이 궁금하신가요?',
    contactDesc: '화면 우측 하단에 AI 맞춤, AI 교재, AI 채팅 바로가기가 상시 제공됩니다.',
    contactSEN: '👨‍💻 총괄 창구: CTO SEN',
    contactEmail: '📧 이메일: xyz007tw@gmail.com',
    contactSocial: '💬 LINE / WeChat ID: xyz007tw',
    contactBtn: '💬 AI 상담 채팅 시작하기',
    relatedTitle: '📚 크리에이터 실전 칼럼 더보기',
    viewAll: '모든 칼럼 보기 →',
    translating: '🌐 언어 전환 중...',
  },
  'vi-VN': {
    home: 'Trang chủ',
    blog: 'Blog Thực Chiến',
    jump: 'Chuyển thẳng đến Tính năng Chính thức →',
    readMin: (m: number) => `⏱️ ${m} phút đọc`,
    publishedAt: 'Đăng ngày',
    askChatbot: '💬 Hỏi Trợ lý AI ở góc phải',
    execSummary: '📌 TÓM TẮT THỰC CHIẾN (EXECUTIVE SUMMARY)',
    ctaPre: '🔥 Lựa chọn Không Rủi Ro cho Người Mới & Nhà Sáng Tạo',
    ctaTitle: 'Sẵn sàng Khởi động "Máy Bán Tri Thức AI-ATM" 24/7 của Bạn?',
    ctaDesc: 'Không cần biết lập trình, không lo thiếu khách! Đến ngay khu vực chuyên biệt trên trang chính thức hoặc nhấp vào "💬 Trò chuyện ✨" góc phải để nhận tư vấn từ Trợ lý AI 24/7 và Tổng kỹ sư SEN. Mọi khoản tự chi tiêu ($3 tài trợ, $990 nhượng quyền) đều tích lũy 100% để nâng bậc hoa hồng!',
    ctaChat: '💬 Trò chuyện 1-1 với Trợ lý AI',
    faqTitle: '💡 Câu hỏi thường gặp cho Người mới Q&A',
    sidebarNav: 'Điều hướng Toàn bộ Dự án Chính thức',
    sidebarNavBadge: 'Tự động Hóa 24/7',
    sidebarNavDesc: 'Nhấp vào bất kỳ mục nào để chuyển đến tính năng tương ứng:',
    vending: '🏪 Máy Bán Tri Thức AI-ATM',
    vendingSub: 'Hoàn 990$ →',
    architect: '👑 20 Năm Kinh Nghiệm｜Gia công AI-ATM',
    architectSub: 'Tùy chỉnh →',
    course: '🎓 Giáo trình Thực chiến AI Đỉnh cao',
    courseSub: 'Tải ngay →',
    ebook: '📚 Tủ sách VIP Đa ngôn ngữ',
    ebookSub: 'Đọc thử Miễn phí →',
    shoppable: '🛒 Video Mua sắm AI & Tìm khách 365 ngày',
    shoppableSub: '300$ / 660$ →',
    affiliate: '💰 Bàn làm việc Hoa hồng 25%',
    affiliateSub: 'Xem Doanh số →',
    sponsor: '💎 Mời Trà sữa ($3+) & Mở khóa 25%',
    sponsorSub: 'Mở khóa 25% →',
    contactTitle: '🤖 Trợ lý AI 24/7 & Cửa sổ Tổng kỹ sư SEN',
    contactSub: 'Cần giải pháp tùy chỉnh hoặc muốn bắt đầu kiếm tiền thụ động?',
    contactDesc: 'Các nút tắt AI Dịch vụ, AI Giáo trình, AI Chat luôn sẵn sàng ở góc dưới bên phải.',
    contactSEN: '👨‍💻 Đầu mối Kỹ thuật: CTO SEN',
    contactEmail: '📧 Email: xyz007tw@gmail.com',
    contactSocial: '💬 LINE / WeChat ID: xyz007tw',
    contactBtn: '💬 Mở Cuộc trò chuyện AI Ngay',
    relatedTitle: '📚 Bài viết Thực chiến Liên quan',
    viewAll: 'Xem tất cả Bài viết Blog →',
    translating: '🌐 Đang chuyển đổi ngôn ngữ...',
  },
};

export function BlogPostDetailClient({ post, relatedPosts }: BlogPostDetailClientProps) {
  const { lang } = useLanguage();
  const [activePost, setActivePost] = useState<BlogPost>(post);
  const [isTranslating, setIsTranslating] = useState(false);

  // 當使用者在切換語系 (例如英文/日文/簡中/韓文/越文) 時，若本地尚無快取翻譯，即刻背景請求 AI 專屬語系套件
  useEffect(() => {
    if (lang === 'zh-TW') return;
    if (activePost.translations && activePost.translations[lang]) return;

    setIsTranslating(true);
    fetch('/api/blog/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: activePost.slug, target_lang: lang }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.translation) {
          setActivePost((prev) => ({
            ...prev,
            translations: {
              ...(prev.translations || {}),
              [lang]: data.translation,
            },
          }));
        }
      })
      .catch((err) => console.error('[Auto-Translate Error]:', err))
      .finally(() => setIsTranslating(false));
  }, [lang, activePost.slug]);

  const ui = UI_TEXTS[lang] || UI_TEXTS['en-US'];
  const loc = getLocalizedPost(activePost, lang);

  const handleOpenChatbot = (defaultQuestion?: string) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('wx-open-ai-chat', {
          detail: { question: defaultQuestion || `我想了解《${loc.title}》介紹的方案細節！` },
        })
      );
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0f] text-white font-sans pb-28 md:pb-24">
      {/* 上側導覽項目列（電腦版完整橫向導覽 ＋ 手機版 54px 收納式主題抽屜） */}
      <SiteNavbar />

      {/* 文章主容器 */}
      <main className="max-w-6xl mx-auto pt-24 md:pt-32 px-4 sm:px-6">
        {/* 麵包屑與分類快捷導覽列 */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-white/10 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-emerald-300 font-bold">
              🏠 {ui.home}
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-amber-300 font-bold">
              📝 {ui.blog}
            </Link>
            <span>/</span>
            <span className="text-pink-300 font-bold">{loc.badge}</span>
          </div>
          <Link
            href={activePost.target_section_href}
            className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/30 to-purple-500/30 border border-pink-400/60 text-pink-200 font-black hover:scale-105 transition-all"
          >
            ⚡ {ui.jump}
          </Link>
        </div>

        {/* 智慧語系切換中提示浮條 */}
        {isTranslating && (
          <div className="mb-4 p-3 rounded-2xl bg-indigo-950/80 border border-indigo-400/50 text-indigo-200 text-xs flex items-center justify-between animate-pulse">
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span>
              <span>{ui.translating}</span>
            </span>
            <span className="text-[11px] text-amber-300 font-bold">Gemini 2.5 Flash Native AI</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 左側：部落客正文區 (8 cols) */}
          <article className="lg:col-span-8">
            {/* 文章標頭卡片 */}
            <header className="mb-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/20 border border-pink-400/50 text-pink-200 text-xs font-black mb-4">
                <span>{loc.badge}</span>
                <span>•</span>
                <span>{ui.readMin(activePost.read_minutes)}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight mb-4">
                {loc.title}
              </h1>

              <p className="text-base sm:text-lg text-amber-200/90 font-bold leading-relaxed mb-6">
                {loc.subtitle}
              </p>

              {/* 部落客作者資訊欄 */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-500/30 to-indigo-500/30 border border-pink-400/50 flex items-center justify-center text-2xl">
                    {activePost.author_avatar}
                  </div>
                  <div>
                    <div className="text-sm font-black text-white">{activePost.author_name}</div>
                    <div className="text-xs text-slate-400">
                      {loc.author_role} · {ui.publishedAt} {activePost.published_at}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenChatbot()}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500/25 to-cyan-500/25 hover:from-emerald-500/40 hover:to-cyan-500/40 border border-emerald-400/50 text-emerald-200 font-black text-xs cursor-pointer transition-all"
                >
                  {ui.askChatbot}
                </button>
              </div>
            </header>

            {/* 封面視覺圖 */}
            <div className="rounded-3xl overflow-hidden border border-white/15 mb-8 shadow-2xl relative h-64 sm:h-80 bg-slate-950">
              <img
                src={activePost.cover_image}
                alt={loc.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-1.5">
                {activePost.seo_keywords.map((kw) => (
                  <span
                    key={kw}
                    className="px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md border border-white/15 text-xs text-amber-300 font-bold"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>

            {/* 核心摘要導讀盒 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-purple-950/60 to-pink-950/50 border border-indigo-400/40 mb-8">
              <div className="text-xs font-black text-indigo-300 uppercase tracking-wider mb-1.5">
                {ui.execSummary}
              </div>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                {loc.excerpt}
              </p>
            </div>

            {/* 正文各章節（完全支援 6 國語系即時切換） */}
            <div className="space-y-8">
              {loc.sections.map((sec, idx) => (
                <section
                  key={idx}
                  className="p-6 sm:p-7 rounded-3xl bg-slate-900/65 border border-white/10 shadow-lg"
                >
                  <h2 className="text-xl sm:text-2xl font-black text-amber-300 mb-4 leading-snug">
                    {sec.heading}
                  </h2>
                  <div className="space-y-4 text-slate-200 text-sm sm:text-base leading-relaxed">
                    {sec.body.split('\n\n').map((para, pIdx) => (
                      <p key={pIdx} className="whitespace-pre-line">
                        {para}
                      </p>
                    ))}
                  </div>
                  {sec.highlight_tip && (
                    <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-pink-500/15 via-purple-500/15 to-amber-500/15 border-l-4 border-pink-400 text-pink-100 text-xs sm:text-sm font-bold leading-relaxed">
                      {sec.highlight_tip}
                    </div>
                  )}
                </section>
              ))}
            </div>

            {/* 文章中段強勢導流行動卡 (CTA Box) */}
            <div className="my-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-pink-950/80 via-purple-950/80 to-indigo-950/90 border-2 border-pink-400/70 shadow-[0_0_35px_rgba(236,72,153,0.25)]">
              <div className="flex items-center gap-2 text-amber-300 text-xs sm:text-sm font-black mb-2">
                <span>🔥</span>
                <span>{ui.ctaPre}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mb-3">
                {ui.ctaTitle}
              </h3>
              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed mb-5">
                {ui.ctaDesc}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={activePost.target_section_href}
                  className="flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-400 hover:to-indigo-400 text-white font-black text-sm text-center shadow-lg transition-all"
                >
                  {loc.target_cta_text}
                </Link>
                <button
                  type="button"
                  onClick={() => handleOpenChatbot(`嗨！我剛看完部落客文章《${loc.title}》，想請教如何開始？`)}
                  className="py-3.5 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-amber-400/60 text-amber-300 font-black text-sm cursor-pointer transition-all"
                >
                  {ui.ctaChat}
                </button>
              </div>
            </div>

            {/* 常見問題 FAQ 區塊 (支援 Google FAQ Rich Snippets) */}
            {loc.faqs && loc.faqs.length > 0 && (
              <section className="mt-10 p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-white/10">
                <h2 className="text-xl sm:text-2xl font-black text-white mb-5 flex items-center gap-2">
                  <span>💡</span>
                  <span>{ui.faqTitle}</span>
                </h2>
                <div className="space-y-4">
                  {loc.faqs.map((faq, fIdx) => (
                    <div
                      key={fIdx}
                      className="p-4 rounded-2xl bg-slate-950/80 border border-white/10"
                    >
                      <h3 className="text-sm sm:text-base font-black text-emerald-300 mb-2">
                        Q{fIdx + 1}：{faq.q}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* 右側：全站導覽項目列 & 24H AI 客服引導側欄 (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="sticky top-24 space-y-6">
              {/* 官網全項目快速導覽盒 */}
              <div className="p-5 rounded-3xl bg-slate-900/90 border border-pink-400/40 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-black text-white flex items-center gap-1.5">
                    <span>🧭</span>
                    <span>{ui.sidebarNav}</span>
                  </h3>
                  <span className="text-[10px] bg-pink-500 text-white px-2 py-0.5 rounded-full font-black">
                    {ui.sidebarNavBadge}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  {ui.sidebarNavDesc}
                </p>
                <div className="space-y-2.5">
                  <Link
                    href="/#author-coop"
                    className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-pink-950/90 to-purple-950/90 border border-pink-400/60 text-pink-200 text-xs font-black hover:scale-[1.02] transition-all"
                  >
                    <span>{ui.vending}</span>
                    <span className="text-amber-300">{ui.vendingSub}</span>
                  </Link>
                  <Link
                    href="/#video-shoppable-service?tab=architecture"
                    className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-sky-950/90 to-indigo-950/90 border border-amber-400/60 text-amber-200 text-xs font-black hover:scale-[1.02] transition-all"
                  >
                    <span>{ui.architect}</span>
                    <span className="text-sky-300">{ui.architectSub}</span>
                  </Link>
                  <Link
                    href="/#tutor-courses"
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-emerald-400/40 text-emerald-300 text-xs font-bold transition-all"
                  >
                    <span>{ui.course}</span>
                    <span>{ui.courseSub}</span>
                  </Link>
                  <Link
                    href="/#featured-ebooks"
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-indigo-400/40 text-indigo-300 text-xs font-bold transition-all"
                  >
                    <span>{ui.ebook}</span>
                    <span>{ui.ebookSub}</span>
                  </Link>
                  <Link
                    href="/#video-shoppable-service"
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-sky-400/40 text-sky-300 text-xs font-bold transition-all"
                  >
                    <span>{ui.shoppable}</span>
                    <span>{ui.shoppableSub}</span>
                  </Link>
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-amber-400/40 text-amber-200 text-xs font-bold transition-all"
                  >
                    <span>{ui.affiliate}</span>
                    <span>{ui.affiliateSub}</span>
                  </Link>
                  <Link
                    href="/sponsor"
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-purple-400/40 text-purple-200 text-xs font-bold transition-all"
                  >
                    <span>{ui.sponsor}</span>
                    <span>{ui.sponsorSub}</span>
                  </Link>
                </div>
              </div>

              {/* 總工程師 SEN 與右下角 AI 客服提示卡 */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-950/90 via-slate-900 to-purple-950/90 border border-cyan-400/40 shadow-xl">
                <div className="text-xs font-black text-cyan-300 mb-1">
                  {ui.contactTitle}
                </div>
                <h4 className="text-sm font-black text-white mb-2">
                  {ui.contactSub}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {ui.contactDesc}
                </p>
                <div className="text-xs text-slate-300 space-y-1 mb-4 bg-black/40 p-3 rounded-xl border border-white/10">
                  <div>{ui.contactSEN}</div>
                  <div>{ui.contactEmail}</div>
                  <div>{ui.contactSocial}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenChatbot()}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-black text-xs cursor-pointer shadow-md hover:opacity-95 transition-all"
                >
                  {ui.contactBtn}
                </button>
              </div>

              {/* 延伸閱讀其他部落客文章（標題與分類徽章同步切換為當前語系） */}
              <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10">
                <h4 className="text-sm font-black text-amber-300 mb-3">
                  {ui.relatedTitle}
                </h4>
                <div className="space-y-3">
                  {relatedPosts.slice(0, 4).map((rp) => {
                    const rpLoc = getLocalizedPost(rp, lang);
                    return (
                      <Link
                        key={rp.slug}
                        href={`/blog/${rp.slug}`}
                        className="block p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-pink-400/40 transition-all"
                      >
                        <div className="text-[11px] text-pink-300 font-bold mb-1">
                          {rpLoc.badge}
                        </div>
                        <div className="text-xs font-bold text-white line-clamp-2 leading-snug">
                          {rpLoc.title}
                        </div>
                      </Link>
                    );
                  })}
                </div>
                <Link
                  href="/blog"
                  className="mt-4 block text-center py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 font-bold"
                >
                  {ui.viewAll}
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
