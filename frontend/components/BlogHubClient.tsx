'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BLOG_CATEGORIES, BlogCategoryId, BlogPost, getLocalizedPost } from '@/lib/blogEngine';
import { SiteNavbar } from '@/components/SiteNavbar';
import { useLanguage } from '@/lib/LanguageContext';

interface BlogHubClientProps {
  initialPosts: BlogPost[];
}

export function BlogHubClient({ initialPosts }: BlogHubClientProps) {
  const { lang } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [selectedCategory, setSelectedCategory] = useState<BlogCategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [genMessage, setGenMessage] = useState('');

  const filteredPosts = posts.filter((post) => {
    const matchCategory = selectedCategory === 'all' || post.category_id === selectedCategory;
    if (!searchQuery.trim()) return matchCategory;
    const q = searchQuery.toLowerCase();
    return (
      matchCategory &&
      (post.title_zh.toLowerCase().includes(q) ||
        post.title_en.toLowerCase().includes(q) ||
        post.excerpt_zh.toLowerCase().includes(q) ||
        post.seo_keywords.some((k) => k.toLowerCase().includes(q)))
    );
  });

  const handleGenerateDailyArticle = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setGenMessage('🤖 正在呼叫 gemini-2.5-flash 為官網自動撰寫今日最新「類部落客 SEO 實戰文」...');
    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'auto_generate_daily',
          category_id: selectedCategory !== 'all' ? selectedCategory : undefined,
        }),
      });
      const data = await res.json();
      if (data.success && data.post) {
        setPosts((prev) => [data.post, ...prev.filter((p) => p.slug !== data.post.slug)]);
        setGenMessage(`✅ 今日新文章已自動發布上架：《${data.post.title_zh}》`);
      } else {
        setGenMessage(`⚠️ 生成提示：${data.error || '請稍後再試'}`);
      }
    } catch (e: any) {
      setGenMessage(`⚠️ 連線提示：${e?.message || '請稍後再試'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0f] text-white font-sans pb-28 md:pb-20">
      {/* 頂部導覽列（支援電腦版橫向導覽 ＋ 手機版 54px 收納抽屜） */}
      <SiteNavbar />

      {/* Hero 橫幅 */}
      <section className="relative pt-24 md:pt-32 pb-12 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-900/20 via-indigo-950/20 to-transparent pointer-events-none" />

        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-purple-500/20 border border-amber-400/50 text-amber-300 text-xs sm:text-sm font-black mb-4 shadow-lg">
            <span>📝</span>
            <span>
              {lang === 'en-US'
                ? 'WeiXiang Official SEO Creator Blog · Daily Automated Insights'
                : lang === 'ja-JP'
                ? 'WeiXiang 公式クリエイター実践ブログ · 毎日自動更新'
                : lang === 'ko-KR'
                ? 'WeiXiang 공식 SEO 크리에이터 실전 블로그 · 매일 자동 업데이트'
                : lang === 'vi-VN'
                ? 'Blog Thực Chiến SEO Chính Thức WeiXiang · Cập Nhật Tự Động Hàng Ngày'
                : lang === 'id-ID'
                ? 'Blog Kreator SEO Resmi WeiXiang · Wawasan Otomatis Harian'
                : lang === 'zh-CN'
                ? '微享官网 SEO 创客实战部落格 · 每日自动更新专栏'
                : '微享官網 SEO 創客實戰部落格 · 每日自動更新專欄'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-amber-200 to-pink-300">
            {lang === 'en-US'
              ? 'Side-Hustle & AI-ATM Blogger Playbooks'
              : lang === 'ja-JP'
              ? '初心者・副業クリエイターのための「AI-ATM 自動収益化」実践ノート'
              : lang === 'ko-KR'
              ? '초보자 & 부업 크리에이터를 위한 "AI-ATM 자동 수익화" 실전 플레이북'
              : lang === 'vi-VN'
              ? 'Cẩm Nang Thực Chiến "AI-ATM Thu Nhập Thụ Động" Cho Người Mới'
              : lang === 'id-ID'
              ? 'Panduan Praktis "AI-ATM Penghasilan Pasif" untuk Pemula & Kreator'
              : lang === 'zh-CN'
              ? '专为「网络小白 & 下班创客」打造的 AI-ATM 睡后收入实战笔记'
              : '專為「網路小白 & 下班創客」打造的 AI-ATM 睡後收入實戰筆記'}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl mx-auto mb-6">
            {lang === 'en-US'
              ? 'Plain-English reviews and step-by-step guides covering our Knowledge Vending Machine AI-ATM ($990 w/ 100% credit), 20-Yr CTO Bespoke Systems, AI Master Courses, VIP E-Books, and 25% Viral Affiliate Network.'
              : lang === 'ja-JP'
              ? '難しい専門用語はゼロ！知識の自動販売機 AI-ATM（初年度$990・100%相殺）、20年CTOカスタム開発、AIマスター教材、VIP電子書籍、25%アフィリエイトまで、初心者目線でわかりやすく解説します。'
              : lang === 'ko-KR'
              ? '어려운 기술 용어 없이 쉽게 풀어쓴 실전 리뷰! 지식 자판기 AI-ATM($990 100% 차감), 20년 경력 CTO 맞춤 개발, AI 마스터 교재, VIP 전자책, 25% 제휴 네트워크를 한눈에 확인하세요.'
              : lang === 'vi-VN'
              ? 'Không dùng thuật ngữ phức tạp! Khám phá góc nhìn thực tế về Máy Bán Tri Thức AI-ATM ($990 khấu trừ 100%), Hệ thống CTO 20 năm, Giáo trình AI, Sách điện tử VIP và Mạng lưới hoa hồng 25%.'
              : lang === 'id-ID'
              ? 'Tanpa istilah teknis yang rumit! Ulasan lengkap Mesin Penjual Pengetahuan AI-ATM ($990 kredit 100%), Sistem Kustom CTO 20 Tahun, Kursus Master AI, E-Book VIP, dan Komisi Afiliasi 25%.'
              : lang === 'zh-CN'
              ? '不讲生硬难懂的工程术语！这里用最白话的部落客开箱视角，带您一次看懂微享官网「🏪 知识自动贩卖机 AI-ATM」、「👑 总工程师20年客制系统」、「🎓 AI顶配教材」、「📚 读者书柜」与「💰 25% 人推人脉复利」如何帮您在睡觉时持续创造收入。'
              : '不講生硬難懂的工程術語！這裡用最白話的部落客開箱視角，帶您一次看懂微享官網「🏪 知識自動販賣機 AI-ATM」、「👑 總工程師20年客製系統」、「🎓 AI頂配教材」、「📚 讀者書櫃」與「💰 25% 人推人脈複利」如何幫您在睡覺時持續創造收入。'}
          </p>

          {/* 搜尋框與每日自動發文按鈕 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  lang === 'en-US'
                    ? 'Search keywords (e.g., AI-ATM, $990, 25% commission, course)...'
                    : lang === 'ja-JP'
                    ? '🔍 キーワード検索（例：AI-ATM、$990、25%報酬、教材）...'
                    : lang === 'ko-KR'
                    ? '🔍 키워드 검색 (예: AI-ATM, $990, 25% 커미션, 교재)...'
                    : lang === 'vi-VN'
                    ? '🔍 Tìm kiếm từ khóa (VD: AI-ATM, $990, hoa hồng 25%)...'
                    : lang === 'id-ID'
                    ? '🔍 Cari kata kunci (mis: AI-ATM, $990, komisi 25%)...'
                    : lang === 'zh-CN'
                    ? '🔍 搜索文章关键字（例：知识自动贩卖机、$990倒抵、25%分润、顶配教材）...'
                    : '🔍 搜尋文章關鍵字（例：知識自動販賣機、$990倒抵、25%分潤、頂配教材）...'
                }
                className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-white/15 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-pink-400 transition-all"
              />
            </div>
            <button
              type="button"
              onClick={handleGenerateDailyArticle}
              disabled={isGenerating}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-black text-xs sm:text-sm whitespace-nowrap shadow-[0_0_20px_rgba(236,72,153,0.4)] disabled:opacity-50 cursor-pointer transition-all"
            >
              {isGenerating
                ? '⏳ AI Writing...'
                : lang === 'en-US'
                ? '✨ Generate Today’s New Article'
                : lang === 'ja-JP'
                ? '✨ 今日の新しい記事をAI生成'
                : lang === 'ko-KR'
                ? '✨ 오늘의 새 칼럼 AI 생성'
                : lang === 'vi-VN'
                ? '✨ Tạo Bài Viết Mới Hôm Nay'
                : lang === 'id-ID'
                ? '✨ Buat Artikel Baru Hari Ini'
                : lang === 'zh-CN'
                ? '✨ 立即产出今日新文章'
                : '✨ 立即產出今日新文章'}
            </button>
          </div>

          {genMessage && (
            <p className="mt-3 text-xs sm:text-sm font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 rounded-xl px-4 py-2 inline-block">
              {genMessage}
            </p>
          )}
        </div>

        {/* 7 大官網核心項目分類篩選列 */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar justify-start lg:justify-center">
          {BLOG_CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border ${
                  active
                    ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white border-pink-300 shadow-[0_0_15px_rgba(236,72,153,0.45)] scale-105'
                    : 'bg-slate-900/80 text-slate-300 border-white/10 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{lang === 'ja-JP' ? cat.name_ja : lang.includes('zh') ? cat.name_zh : cat.name_en}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 文章卡片列表 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => {
            const loc = getLocalizedPost(post, lang);
            return (
              <article
                key={post.slug}
                className="group rounded-3xl bg-slate-900/80 border border-white/10 hover:border-pink-400/60 overflow-hidden shadow-xl hover:shadow-[0_10px_35px_rgba(236,72,153,0.2)] transition-all flex flex-col justify-between"
              >
                <div>
                  {/* 封面圖與分類徽章 */}
                  <Link href={`/blog/${post.slug}`} className="block relative h-48 overflow-hidden bg-slate-950">
                    <img
                      src={post.cover_image}
                      alt={loc.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-pink-400/50 text-pink-200 text-xs font-black">
                      {loc.badge}
                    </span>
                    <span className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-lg bg-black/70 text-amber-300 text-[11px] font-bold">
                      ⏱️ {post.read_minutes} min read
                    </span>
                  </Link>

                  {/* 標題與摘要 */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                      <span>{post.author_avatar}</span>
                      <span className="font-bold text-slate-300">{post.author_name}</span>
                      <span>•</span>
                      <span>{post.published_at}</span>
                    </div>

                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="text-lg sm:text-xl font-black text-white group-hover:text-pink-300 transition-colors leading-snug mb-2.5 line-clamp-2">
                        {loc.title}
                      </h2>
                    </Link>

                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-4">
                      {loc.excerpt}
                    </p>

                    {/* SEO 關鍵字標籤 */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {post.seo_keywords.slice(0, 4).map((kw) => (
                        <span
                          key={kw}
                          className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] text-slate-300"
                        >
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 底部雙按鈕：閱讀全文 ＋ 直達對應官網項目 */}
                <div className="px-5 pb-5 pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-pink-500/25 to-purple-500/25 hover:from-pink-500 hover:to-purple-600 border border-pink-400/50 text-pink-200 hover:text-white font-black text-xs text-center transition-all"
                  >
                    {lang === 'en-US'
                      ? '📖 Read Full Review →'
                      : lang === 'ja-JP'
                      ? '📖 実戦レビューを読む →'
                      : lang === 'ko-KR'
                      ? '📖 칼럼 전문 읽기 →'
                      : lang === 'vi-VN'
                      ? '📖 Đọc bài đánh giá →'
                      : lang === 'id-ID'
                      ? '📖 Baca Ulasan Lengkap →'
                      : lang === 'zh-CN'
                      ? '📖 阅读部落客开箱全文 →'
                      : '📖 閱讀部落客開箱全文 →'}
                  </Link>
                  <Link
                    href={post.target_section_href}
                    className="py-2.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/35 border border-amber-400/50 text-amber-300 font-black text-xs whitespace-nowrap transition-all"
                  >
                    {lang === 'en-US'
                      ? '⚡ Try Now'
                      : lang === 'ja-JP'
                      ? '⚡ 今すぐ体験'
                      : lang === 'ko-KR'
                      ? '⚡ 바로가기'
                      : lang === 'vi-VN'
                      ? '⚡ Trải nghiệm ngay'
                      : lang === 'id-ID'
                      ? '⚡ Coba Sekarang'
                      : lang === 'zh-CN'
                      ? '⚡ 直达该项目'
                      : '⚡ 直達該項目'}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 底部全站快速導覽矩陣（強化內部連結 SEO 權重） */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-16">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/60 to-purple-950/50 border border-pink-400/40 p-6 sm:p-8 shadow-2xl">
          <h3 className="text-xl sm:text-2xl font-black text-white mb-2 flex items-center gap-2">
            <span>🚀</span>
            <span>
              {lang === 'en-US'
                ? 'Quick Jump to WeiXiang Official Core Systems'
                : lang === 'ja-JP'
                ? 'WeiXiang 公式 7大コアシステム・クイックナビ'
                : lang === 'ko-KR'
                ? 'WeiXiang 공식 7대 핵심 자동 수익화 시스템 바로가기'
                : lang === 'vi-VN'
                ? 'Truy Cập Nhanh 7 Hệ Thống Tự Động Hóa Cốt Lõi WeiXiang'
                : lang === 'id-ID'
                ? 'Akses Cepat 7 Sistem Monetisasi Otomatis WeiXiang'
                : lang === 'zh-CN'
                ? '微享官网 7 大核心自动变现系统・一键快速导览'
                : '微享官網 7 大核心自動變現系統・一鍵快速導覽'}
            </span>
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm mb-6">
            {lang === 'en-US'
              ? 'Click any module below or use the bottom-right AI assistant to start your 24/7 passive income journey.'
              : lang === 'ja-JP'
              ? '気になる項目をクリックするか、右下の「💬 チャットする ✨」から24時間AIアシスタントにお気軽にご相談ください！'
              : lang === 'ko-KR'
              ? '아래 핵심 모듈을 클릭하거나 우측 하단의 "💬 채팅하기 ✨"를 눌러 24시간 AI 어시스턴트에게 문의하세요!'
              : lang === 'vi-VN'
              ? 'Nhấp vào bất kỳ mục nào bên dưới hoặc nhấn "💬 Trò chuyện ✨" ở góc dưới bên phải để được Trợ lý AI 24/7 hỗ trợ!'
              : lang === 'id-ID'
              ? 'Klik modul di bawah atau gunakan tombol "💬 Chat ✨" di kanan bawah untuk berkonsultasi dengan Asisten AI 24/7 kami!'
              : lang === 'zh-CN'
              ? '看完部落客实战文章后，您可以直接点击下方任一核心专区，或随时点击右下角「💬 欢迎聊聊 ✨」唤起 24H AI 客服为您解答！'
              : '看完部落客實戰文章後，您可以直接點擊下方任一核心專區，或隨時點擊右下角「💬 歡迎聊聊 ✨」喚起 24H AI 客服為您解答！'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Link
              href="/#author-coop"
              className="p-3.5 rounded-2xl bg-pink-500/15 hover:bg-pink-500/25 border border-pink-400/50 text-pink-200 font-black text-xs sm:text-sm flex items-center justify-between"
            >
              <span>🏪 知識自動販賣機 AI-ATM ($990 享100%倒抵)</span>
              <span>→</span>
            </Link>
            <Link
              href="/#video-shoppable-service?tab=architecture"
              className="p-3.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/50 text-amber-200 font-black text-xs sm:text-sm flex items-center justify-between"
            >
              <span>👑 總工程師20年資歷｜AI-ATM 客製接案</span>
              <span>→</span>
            </Link>
            <Link
              href="/#tutor-courses"
              className="p-3.5 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/50 text-emerald-200 font-black text-xs sm:text-sm flex items-center justify-between"
            >
              <span>🎓 AI 頂配家教教材（秒級下載＋轉發親友）</span>
              <span>→</span>
            </Link>
            <Link
              href="/#featured-ebooks"
              className="p-3.5 rounded-2xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-400/50 text-indigo-200 font-black text-xs sm:text-sm flex items-center justify-between"
            >
              <span>📚 VIP 全球名家多語系電子書櫃</span>
              <span>→</span>
            </Link>
            <Link
              href="/#video-shoppable-service"
              className="p-3.5 rounded-2xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/50 text-sky-200 font-black text-xs sm:text-sm flex items-center justify-between"
            >
              <span>🛒 AI 影片導購 & 尋客 365 天免錢 ($660)</span>
              <span>→</span>
            </Link>
            <Link
              href="/sponsor"
              className="p-3.5 rounded-2xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-400/50 text-purple-200 font-black text-xs sm:text-sm flex items-center justify-between"
            >
              <span>💎 $3 斗內總工程師喝珍奶・解鎖 25% 流水</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
