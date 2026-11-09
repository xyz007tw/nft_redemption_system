'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/lib/LanguageContext';

export function SiteNavbar() {
  const { lang } = useLanguage();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const connectLabel =
    lang === 'zh-TW'
      ? '連接錢包'
      : lang === 'zh-CN'
      ? '连接钱包'
      : lang === 'ja-JP'
      ? 'ウォレット接続'
      : lang === 'ko-KR'
      ? '지갑 연결'
      : lang === 'vi-VN'
      ? 'Kết nối ví'
      : 'Connect Wallet';

  const navVendingText =
    lang === 'zh-TW'
      ? '🏪 知識販賣機'
      : lang === 'zh-CN'
      ? '🏪 知识贩卖机'
      : lang === 'ja-JP'
      ? '🏪 知識の自販機'
      : lang === 'ko-KR'
      ? '🏪 지식 자판기'
      : lang === 'vi-VN'
      ? '🏪 Máy Bán Tri Thức'
      : '🏪 Knowledge AI-ATM';

  const navCourseText =
    lang === 'zh-TW'
      ? '🎓 AI頂配教材'
      : lang === 'zh-CN'
      ? '🎓 AI顶配教材'
      : lang === 'ja-JP'
      ? '🎓 AI最高峰教材'
      : lang === 'ko-KR'
      ? '🎓 AI 마스터 교재'
      : lang === 'vi-VN'
      ? '🎓 Giáo trình AI'
      : '🎓 AI Master Courses';

  const navEbookText =
    lang === 'zh-TW'
      ? '📚 讀者書櫃'
      : lang === 'zh-CN'
      ? '📚 读者书柜'
      : lang === 'ja-JP'
      ? '📚 読者本棚'
      : lang === 'ko-KR'
      ? '📚 전자책 서재'
      : lang === 'vi-VN'
      ? '📚 Tủ sách VIP'
      : '📚 E-Book Store';

  const navShoppableText =
    lang === 'zh-TW'
      ? '🛠️ AI客製服務'
      : lang === 'zh-CN'
      ? '🛠️ AI客制服务'
      : lang === 'ja-JP'
      ? '🛠️ AIカスタム開発'
      : lang === 'ko-KR'
      ? '🛠️ AI 맞춤 서비스'
      : lang === 'vi-VN'
      ? '🛠️ Dịch vụ AI'
      : '🛠️ AI Services';

  const navBlogText =
    lang === 'zh-TW'
      ? '📝 創客專欄'
      : lang === 'zh-CN'
      ? '📝 创客专栏'
      : lang === 'ja-JP'
      ? '📝 実践ブログ'
      : lang === 'ko-KR'
      ? '📝 크리에이터 칼럼'
      : lang === 'vi-VN'
      ? '📝 Blog Thực Chiến'
      : '📝 Creator Blog';

  const navSponsorText =
    lang === 'zh-TW'
      ? '💎 斗內解鎖25%流水'
      : lang === 'zh-CN'
      ? '💎 打赏解锁25%流水'
      : lang === 'ja-JP'
      ? '💎 支援で25%報酬解放'
      : lang === 'ko-KR'
      ? '💎 후원으로 25% 해금'
      : lang === 'vi-VN'
      ? '💎 Tài trợ Mở khóa 25%'
      : '💎 Sponsor & Unlock 25%';

  return (
    <nav className="fixed top-0 left-0 right-0 w-full z-50 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/10 transition-all">
      {/* 電腦版 (md+)：優雅橫向一體化導覽列 */}
      <div className="hidden md:flex w-full max-w-7xl mx-auto justify-between items-center px-6 py-3.5">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
            WeiXiang AI
          </span>
        </Link>
        <div className="flex items-center gap-2 lg:gap-2.5 flex-wrap justify-end">
          <Link
            href="/#author-coop"
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-500/25 via-purple-500/25 to-indigo-500/25 hover:from-pink-500/40 hover:to-indigo-500/40 border border-pink-400/60 text-pink-200 font-black text-xs lg:text-sm transition-all shadow-[0_0_15px_rgba(236,72,153,0.35)] hover:scale-105 whitespace-nowrap flex items-center gap-1"
          >
            <span>{navVendingText}</span>
            <span className="text-[10px] bg-pink-500 text-white px-1.5 py-0.2 rounded-full font-black animate-pulse">
              NEW
            </span>
          </Link>
          <Link
            href="/#tutor-courses"
            className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-cyan-500/20 hover:from-amber-500/30 hover:to-cyan-500/30 border border-emerald-400/50 text-emerald-300 font-bold text-xs lg:text-sm transition-all shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:scale-105 whitespace-nowrap"
          >
            {navCourseText}
          </Link>
          <Link
            href="/#featured-ebooks"
            className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 hover:from-indigo-500/35 hover:to-pink-500/35 border border-indigo-400/50 text-indigo-300 font-bold text-xs lg:text-sm transition-all shadow-[0_0_15px_rgba(99,102,241,0.25)] hover:scale-105 whitespace-nowrap"
          >
            {navEbookText}
          </Link>
          <Link
            href="/#video-shoppable-service"
            className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-500/20 via-cyan-500/20 to-amber-500/20 hover:from-sky-500/35 hover:to-amber-500/35 border border-sky-400/50 text-sky-300 font-bold text-xs lg:text-sm transition-all shadow-[0_0_15px_rgba(56,189,248,0.25)] hover:scale-105 whitespace-nowrap"
          >
            {navShoppableText}
          </Link>
          <Link
            href="/blog"
            className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/25 via-orange-500/25 to-rose-500/25 hover:from-amber-500/40 hover:to-rose-500/40 border border-amber-400/60 text-amber-200 font-black text-xs lg:text-sm transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:scale-105 whitespace-nowrap"
          >
            {navBlogText}
          </Link>
          <Link
            href="/sponsor"
            className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-amber-500/20 hover:from-purple-500/35 hover:to-amber-500/35 border border-purple-400/50 text-purple-200 font-bold text-xs lg:text-sm transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:scale-105 whitespace-nowrap"
          >
            {navSponsorText}
          </Link>
          <div className="shrink-0">
            <LanguageSwitcher />
          </div>
          <div className="shrink-0 whitespace-nowrap [&_button]:!whitespace-nowrap">
            <ConnectButton label={connectLabel} showBalance={false} chainStatus="icon" />
          </div>
        </div>
      </div>

      {/* 手機版 (< md)：緊湊單行 54px 高度，絕不遮擋主畫面 */}
      <div className="md:hidden w-full flex items-center justify-between px-3 py-2.5">
        <Link href="/" className="flex items-center gap-1.5">
          <span className="text-lg font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
            WeiXiang AI
          </span>
        </Link>
        <div className="flex items-center gap-1.5">
          <LanguageSwitcher />
          <div className="scale-90 origin-right">
            <ConnectButton label={connectLabel} />
          </div>
          <button
            type="button"
            onClick={() => setMobileNavOpen((prev) => !prev)}
            className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-500/25 via-purple-500/25 to-indigo-500/25 border border-pink-400/50 text-pink-200 font-extrabold text-xs flex items-center gap-1 shadow-md active:scale-95 transition-all cursor-pointer"
            aria-label="Toggle Theme Navigation Menu"
          >
            <span className="text-sm">{mobileNavOpen ? '✕' : '☰'}</span>
            <span className="text-[11px] font-black">{lang.includes('zh') ? '主題導覽' : 'Topics'}</span>
          </button>
        </div>
      </div>

      {/* 手機版主題項目收納折疊抽屜 */}
      {mobileNavOpen && (
        <div className="md:hidden w-full bg-[#0a0a0f]/95 backdrop-blur-2xl border-b border-white/10 px-4 py-3 flex flex-col gap-2 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <Link
            href="/#author-coop"
            onClick={() => setMobileNavOpen(false)}
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500/25 via-purple-500/25 to-indigo-500/25 border border-pink-400/60 text-pink-200 font-black text-xs shadow-md"
          >
            <span className="flex items-center gap-2">
              <span className="text-base">🏪</span>
              <span>{navVendingText}</span>
            </span>
            <span className="text-[10px] bg-pink-500 text-white px-2 py-0.5 rounded-full font-black animate-pulse">
              NEW 推薦
            </span>
          </Link>
          <Link
            href="/#tutor-courses"
            onClick={() => setMobileNavOpen(false)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-300 font-bold text-xs"
          >
            <span>🎓</span>
            <span>{navCourseText}</span>
          </Link>
          <Link
            href="/#featured-ebooks"
            onClick={() => setMobileNavOpen(false)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-indigo-300 font-bold text-xs"
          >
            <span>📚</span>
            <span>{navEbookText}</span>
          </Link>
          <Link
            href="/#video-shoppable-service"
            onClick={() => setMobileNavOpen(false)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sky-300 font-bold text-xs"
          >
            <span>🛠️</span>
            <span>{navShoppableText}</span>
          </Link>
          <Link
            href="/blog"
            onClick={() => setMobileNavOpen(false)}
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-200 font-black text-xs"
          >
            <span className="flex items-center gap-2">
              <span>📝</span>
              <span>{navBlogText}</span>
            </span>
            <span className="text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded font-black">
              SEO 每日更
            </span>
          </Link>
          <Link
            href="/sponsor"
            onClick={() => setMobileNavOpen(false)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-purple-200 font-bold text-xs"
          >
            <span>💎</span>
            <span>{navSponsorText}</span>
          </Link>
        </div>
      )}
    </nav>
  );
}
