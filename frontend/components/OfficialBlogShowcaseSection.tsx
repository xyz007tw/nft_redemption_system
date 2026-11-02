'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BlogPost, SEED_BLOG_POSTS } from '@/lib/blogEngine';
import { useLanguage } from '@/lib/LanguageContext';

export function OfficialBlogShowcaseSection() {
  const { lang } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>(SEED_BLOG_POSTS.slice(0, 6));

  useEffect(() => {
    fetch('/api/blog')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.posts) && data.posts.length > 0) {
          setPosts(data.posts.slice(0, 6));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section
      id="official-seo-blog"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-14 border-t border-white/10"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-black mb-3">
            <span>📝</span>
            <span>
              {lang === 'en-US'
                ? 'Official SEO Creator Blog · Updated Daily'
                : lang === 'ja-JP'
                ? '公式SEOクリエイター実践コラム・毎日更新'
                : '微享官網 SEO 創客實戰部落格・每日自動更新'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            {lang === 'en-US'
              ? 'Plain-English Side-Hustle & AI-ATM Blogger Reviews'
              : lang === 'ja-JP'
              ? '初心者・副業族のための「知識の自販機 AI-ATM」実践開箱コラム'
              : '網路小白 & 下班創客必看！「AI-ATM 睡後收入」實戰開箱專欄'}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-3xl">
            {lang === 'en-US'
              ? 'Explore daily automated articles covering Knowledge Vending Machine AI-ATM, 20-Yr CTO Bespoke Systems, AI Master Courses, VIP E-Books, and 25% Viral Commissions.'
              : '針對官網所有核心項目（知識自動販賣機 AI-ATM、總工程師 20 年客製接案、AI 頂配教材、VIP 讀者書櫃、25% 分潤），每日自動產出深入淺出的部落客實測文章！'}
          </p>
        </div>

        <Link
          href="/blog"
          className="self-start md:self-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-black text-xs sm:text-sm whitespace-nowrap shadow-[0_0_20px_rgba(236,72,153,0.35)] transition-all"
        >
          {lang === 'en-US' ? '📚 View All Blogger Articles →' : '📚 進入創客部落格看全部文章 →'}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="group rounded-3xl bg-slate-900/75 border border-white/10 hover:border-amber-400/60 overflow-hidden shadow-lg hover:shadow-[0_8px_30px_rgba(245,158,11,0.2)] transition-all flex flex-col justify-between"
          >
            <div>
              <Link href={`/blog/${post.slug}`} className="block relative h-44 overflow-hidden bg-slate-950">
                <img
                  src={post.cover_image}
                  alt={post.title_zh}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/85 border border-pink-400/50 text-pink-200 text-[11px] font-black">
                  {lang === 'en-US' ? post.badge_en : post.badge_zh}
                </span>
                <span className="absolute bottom-2.5 right-3 text-[11px] text-amber-300 font-bold bg-black/70 px-2 py-0.5 rounded">
                  {post.published_at}
                </span>
              </Link>

              <div className="p-5">
                <Link href={`/blog/${post.slug}`}>
                  <h3 className="text-base sm:text-lg font-black text-white group-hover:text-amber-300 transition-colors leading-snug mb-2 line-clamp-2">
                    {lang === 'en-US' ? post.title_en : post.title_zh}
                  </h3>
                </Link>
                <p className="text-slate-300 text-xs leading-relaxed line-clamp-3">
                  {lang === 'en-US' ? post.excerpt_en : post.excerpt_zh}
                </p>
              </div>
            </div>

            <div className="px-5 pb-4 pt-2 border-t border-white/10 flex items-center justify-between gap-2">
              <Link
                href={`/blog/${post.slug}`}
                className="text-xs font-black text-pink-300 hover:text-pink-200"
              >
                {lang === 'en-US' ? '📖 Read Article →' : '📖 閱讀開箱全文 →'}
              </Link>
              <Link
                href={post.target_section_href}
                className="text-[11px] font-bold text-amber-300 bg-amber-500/15 border border-amber-400/40 px-2.5 py-1 rounded-lg hover:bg-amber-500/30"
              >
                {lang === 'en-US' ? '⚡ Go to Feature' : '⚡ 前往該專區'}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
