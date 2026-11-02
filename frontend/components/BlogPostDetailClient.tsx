'use client';

import React from 'react';
import Link from 'next/link';
import { BLOG_CATEGORIES, BlogPost } from '@/lib/blogEngine';
import { SiteNavbar } from '@/components/SiteNavbar';
import { useLanguage } from '@/lib/LanguageContext';

interface BlogPostDetailClientProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export function BlogPostDetailClient({ post, relatedPosts }: BlogPostDetailClientProps) {
  const { lang } = useLanguage();

  const handleOpenChatbot = (defaultQuestion?: string) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('wx-open-ai-chat', {
          detail: { question: defaultQuestion || `我想了解《${post.title_zh}》介紹的方案細節！` },
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
              🏠 {lang === 'en-US' ? 'Home' : '微享官網首頁'}
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-amber-300 font-bold">
              📝 {lang === 'en-US' ? 'Creator Blog' : '斜槓創客專欄'}
            </Link>
            <span>/</span>
            <span className="text-pink-300 font-bold">{lang === 'en-US' ? post.badge_en : post.badge_zh}</span>
          </div>
          <Link
            href={post.target_section_href}
            className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/30 to-purple-500/30 border border-pink-400/60 text-pink-200 font-black hover:scale-105 transition-all"
          >
            ⚡ {lang === 'en-US' ? 'Jump to Official Feature →' : '直達本文介紹的官網專區 →'}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 左側：部落客正文區 (8 cols) */}
          <article className="lg:col-span-8">
            {/* 文章標頭卡片 */}
            <header className="mb-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/20 border border-pink-400/50 text-pink-200 text-xs font-black mb-4">
                <span>{lang === 'en-US' ? post.badge_en : post.badge_zh}</span>
                <span>•</span>
                <span>⏱️ {post.read_minutes} 分鐘實戰閱讀</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight mb-4">
                {lang === 'en-US' ? post.title_en : post.title_zh}
              </h1>

              <p className="text-base sm:text-lg text-amber-200/90 font-bold leading-relaxed mb-6">
                {lang === 'en-US' ? post.subtitle_en : post.subtitle_zh}
              </p>

              {/* 部落客作者資訊欄 */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-500/30 to-indigo-500/30 border border-pink-400/50 flex items-center justify-center text-2xl">
                    {post.author_avatar}
                  </div>
                  <div>
                    <div className="text-sm font-black text-white">{post.author_name}</div>
                    <div className="text-xs text-slate-400">
                      {post.author_role_zh} · 發布於 {post.published_at}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenChatbot()}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500/25 to-cyan-500/25 hover:from-emerald-500/40 hover:to-cyan-500/40 border border-emerald-400/50 text-emerald-200 font-black text-xs cursor-pointer transition-all"
                >
                  💬 詢問右下角 AI 客服本文方案
                </button>
              </div>
            </header>

            {/* 封面視覺圖 */}
            <div className="rounded-3xl overflow-hidden border border-white/15 mb-8 shadow-2xl relative h-64 sm:h-80 bg-slate-950">
              <img
                src={post.cover_image}
                alt={post.title_zh}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-1.5">
                {post.seo_keywords.map((kw) => (
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
                📌 部落客實戰重點速覽 (Executive Summary)
              </div>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                {lang === 'en-US' ? post.excerpt_en : post.excerpt_zh}
              </p>
            </div>

            {/* 正文各章節 */}
            <div className="space-y-8">
              {post.sections.map((sec, idx) => (
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
                <span>網路小白・下班創客・斜槓族零風險首選</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mb-3">
                看完這篇部落客實測，準備好啟動您的 24H「知識自動販賣機 AI-ATM」了嗎？
              </h3>
              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed mb-5">
                不用自己架網站、不用煩惱沒流量！現在就前往微享官網對應專區，或直接點擊右下角「💬 歡迎聊聊 ✨」讓 24 小時 AI 客服與總工程師 SEN 為您服務。所有自消費（含 $3 斗內、$990 電子書加盟、買教材）皆 100% 併入您的級差升等累積業績！
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={post.target_section_href}
                  className="flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-400 hover:to-indigo-400 text-white font-black text-sm text-center shadow-lg transition-all"
                >
                  {lang === 'en-US' ? post.target_cta_text_en : post.target_cta_text_zh}
                </Link>
                <button
                  type="button"
                  onClick={() => handleOpenChatbot(`嗨！我剛看完部落客文章《${post.title_zh}》，想請教如何開始？`)}
                  className="py-3.5 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-amber-400/60 text-amber-300 font-black text-sm cursor-pointer transition-all"
                >
                  💬 喚起右下角 AI 客服一對一諮詢
                </button>
              </div>
            </div>

            {/* 常見問題 FAQ 區塊 (支援 Google FAQ Rich Snippets) */}
            {post.faqs && post.faqs.length > 0 && (
              <section className="mt-10 p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-white/10">
                <h2 className="text-xl sm:text-2xl font-black text-white mb-5 flex items-center gap-2">
                  <span>💡</span>
                  <span>新手常見問題 Q&A（網路小白必看）</span>
                </h2>
                <div className="space-y-4">
                  {post.faqs.map((faq, fIdx) => (
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
                    <span>微享官網・全項目快速導覽</span>
                  </h3>
                  <span className="text-[10px] bg-pink-500 text-white px-2 py-0.5 rounded-full font-black">
                    24H 自動變現
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  點擊下方任一項目即可直接跳轉至官網對應功能區：
                </p>
                <div className="space-y-2.5">
                  <Link
                    href="/#author-coop"
                    className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-pink-950/90 to-purple-950/90 border border-pink-400/60 text-pink-200 text-xs font-black hover:scale-[1.02] transition-all"
                  >
                    <span>🏪 知識自動販賣機 AI-ATM</span>
                    <span className="text-amber-300">$990 倒抵 →</span>
                  </Link>
                  <Link
                    href="/#video-shoppable-service?tab=architecture"
                    className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-sky-950/90 to-indigo-950/90 border border-amber-400/60 text-amber-200 text-xs font-black hover:scale-[1.02] transition-all"
                  >
                    <span>👑 總工程師20年 AI-ATM 接案</span>
                    <span className="text-sky-300">專案客製 →</span>
                  </Link>
                  <Link
                    href="/#tutor-courses"
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-emerald-400/40 text-emerald-300 text-xs font-bold transition-all"
                  >
                    <span>🎓 AI 頂配家教實戰教材</span>
                    <span>秒級下載 →</span>
                  </Link>
                  <Link
                    href="/#featured-ebooks"
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-indigo-400/40 text-indigo-300 text-xs font-bold transition-all"
                  >
                    <span>📚 VIP 全球名家電子書櫃</span>
                    <span>免費試閱 →</span>
                  </Link>
                  <Link
                    href="/#video-shoppable-service"
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-sky-400/40 text-sky-300 text-xs font-bold transition-all"
                  >
                    <span>🛒 AI 影片導購 & 365天免錢</span>
                    <span>$300 / $660 →</span>
                  </Link>
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-amber-400/40 text-amber-200 text-xs font-bold transition-all"
                  >
                    <span>💰 25% 人推人脈複利分潤後台</span>
                    <span>查看業績 →</span>
                  </Link>
                  <Link
                    href="/sponsor"
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-purple-400/40 text-purple-200 text-xs font-bold transition-all"
                  >
                    <span>💎 請總工程師喝珍奶 ($3 起)</span>
                    <span>解鎖25%流水 →</span>
                  </Link>
                </div>
              </div>

              {/* 總工程師 SEN 與右下角 AI 客服提示卡 */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-950/90 via-slate-900 to-purple-950/90 border border-cyan-400/40 shadow-xl">
                <div className="text-xs font-black text-cyan-300 mb-1">
                  🤖 24H 全自動 AI 客服 ＆ 總工程師窗口
                </div>
                <h4 className="text-sm font-black text-white mb-2">
                  有客製化需求或想了解如何斜槓起步？
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  畫面右下角設有「🛠️ AI客製服務」、「🎓 AI頂配教材」與「💬 歡迎聊聊 ✨」懸浮捷徑（手機版位於畫面正下方導覽列），隨時為您解答！
                </p>
                <div className="text-xs text-slate-300 space-y-1 mb-4 bg-black/40 p-3 rounded-xl border border-white/10">
                  <div>👨‍💻 總窗口：CTO SEN / 總工程師 SEN</div>
                  <div>📧 信箱：xyz007tw@gmail.com</div>
                  <div>💬 LINE / 微信 ID：xyz007tw</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenChatbot()}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-black text-xs cursor-pointer shadow-md hover:opacity-95 transition-all"
                >
                  💬 立即開啟右下角 AI 客服對話
                </button>
              </div>

              {/* 延伸閱讀其他部落客文章 */}
              <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10">
                <h4 className="text-sm font-black text-amber-300 mb-3">
                  📚 更多創客實戰延伸閱讀
                </h4>
                <div className="space-y-3">
                  {relatedPosts.slice(0, 4).map((rp) => (
                    <Link
                      key={rp.slug}
                      href={`/blog/${rp.slug}`}
                      className="block p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-pink-400/40 transition-all"
                    >
                      <div className="text-[11px] text-pink-300 font-bold mb-1">
                        {rp.badge_zh}
                      </div>
                      <div className="text-xs font-bold text-white line-clamp-2 leading-snug">
                        {rp.title_zh}
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/blog"
                  className="mt-4 block text-center py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 font-bold"
                >
                  查看全部創客部落格文章 →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
