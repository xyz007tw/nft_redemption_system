'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import BuyNFTButton from '@/components/BuyNFTButton';
import PayUniButton from '@/components/PayUniButton';
import TutorCourseSection from '@/components/TutorCourseSection';
import VideoShoppableSection from '@/components/VideoShoppableSection';
import { useState, useEffect } from 'react';

export default function Home() {
  const { t, lang } = useLanguage();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref');
    if (refCode) {
      localStorage.setItem('weixiang_referrer', refCode);
    }
  }, []);

  const isChinese = lang.includes('zh');
  const introVideoUrl = isChinese ? 'https://www.youtube.com/embed/ZGyXZiW9hH0' : 'https://www.youtube.com/embed/jolRAnobFds';
  const introImageUrl = isChinese ? '/images/intro-zh.jpg' : '/images/intro-en.jpg';
  const tutorialVideoUrl = isChinese ? 'https://www.youtube.com/embed/flO2mSCrSI8' : 'https://www.youtube.com/embed/4BfEWd2F014';

  const connectLabel =
    lang === 'zh-TW' ? '連接錢包' :
    lang === 'zh-CN' ? '连接钱包' :
    lang === 'ja-JP' ? 'ウォレットを接続' :
    lang === 'ko-KR' ? '지갑 연결' :
    lang === 'vi-VN' ? 'Kết nối ví' :
    'Connect Wallet';

  const navCourseText =
    lang === 'zh-TW' ? '🎓 AI頂配教材' :
    lang === 'zh-CN' ? '🎓 AI顶配教材' :
    lang === 'ja-JP' ? '🎓 AIマスター教材' :
    lang === 'ko-KR' ? '🎓 AI 마스터 교재' :
    lang === 'vi-VN' ? '🎓 Giáo trình AI' :
    '🎓 AI Master Courses';

  const navSponsorText =
    lang === 'zh-TW' ? '💎 斗內解鎖25%流水' :
    lang === 'zh-CN' ? '💎 斗内解锁25%流水' :
    lang === 'ja-JP' ? '💎 支援して25%報酬解放' :
    lang === 'ko-KR' ? '💎 후원하고 25% 수익 해제' :
    lang === 'vi-VN' ? '💎 Tài trợ Mở khóa 25%' :
    '💎 Sponsor & Unlock 25%';

  const navShoppableText =
    lang === 'zh-TW' ? '🛒 AI影片導購客製' :
    lang === 'zh-CN' ? '🛒 AI影片导购客制' :
    lang === 'ja-JP' ? '🛒 AI動画コマース開発' :
    lang === 'ko-KR' ? '🛒 AI 영상 커머스 구축' :
    lang === 'vi-VN' ? '🛒 Hệ thống Video Mua sắm AI' :
    '🛒 AI Video Shoppable';

  const heroBadgeText =
    lang === 'zh-TW' ? 'DePIN × Enterprise AI Agent 基礎設施' :
    lang === 'zh-CN' ? 'DePIN × Enterprise AI Agent 基础设施' :
    lang === 'ja-JP' ? 'DePIN × Enterprise AI Agent インフラストラクチャ' :
    lang === 'ko-KR' ? 'DePIN × Enterprise AI Agent 인프라' :
    lang === 'vi-VN' ? 'Hạ tầng DePIN × Enterprise AI Agent' :
    'DePIN × Enterprise AI Agent Infrastructure';

  const step1LinkText =
    lang === 'zh-TW' ? '👉 挑選方案・前往購買' :
    lang === 'zh-CN' ? '👉 挑选方案・前往购买' :
    lang === 'ja-JP' ? '👉 プランを選択・購入へ' :
    lang === 'ko-KR' ? '👉 플랜 선택 · 구매하기' :
    lang === 'vi-VN' ? '👉 Chọn Gói · Mua Ngay' :
    '👉 Choose Plan · Buy Now';

  const step2LinkText =
    lang === 'zh-TW' ? '👉 前往兌換專區 (Redeem)' :
    lang === 'zh-CN' ? '👉 前往兑换专区 (Redeem)' :
    lang === 'ja-JP' ? '👉 引き換えセンターへ (Redeem)' :
    lang === 'ko-KR' ? '👉 리딤 센터로 이동 (Redeem)' :
    lang === 'vi-VN' ? '👉 Đến Trung tâm Đổi quà (Redeem)' :
    '👉 Go to Redeem Hub (Redeem)';

  const step3LinkText =
    lang === 'zh-TW' ? '👉 進入會員數據後台' :
    lang === 'zh-CN' ? '👉 进入会员数据后台' :
    lang === 'ja-JP' ? '👉 会員ダッシュボードへ' :
    lang === 'ko-KR' ? '👉 회원 대시보드 입장' :
    lang === 'vi-VN' ? '👉 Vào Bảng điều khiển Thành viên' :
    '👉 Enter Member Dashboard';

  const tutorialBadgeText =
    lang === 'zh-TW' ? 'AI 自來客系統・實戰操作說明影音' :
    lang === 'zh-CN' ? 'AI 自来客系统・实战操作说明影音' :
    lang === 'ja-JP' ? 'WeiXiang AIシステム・実践操作ガイド動画' :
    lang === 'ko-KR' ? 'WeiXiang AI 시스템 · 실전 조작 가이드 영상' :
    lang === 'vi-VN' ? 'Hệ thống WeiXiang AI · Video Hướng dẫn Thực chiến' :
    'WeiXiang AI-ATM · Practical Operation Guide Video';

  const sponsorHeadingText =
    lang === 'zh-TW' ? '💎 共創 AI 流量革命：贊助微享 AI-ATM 研發' :
    lang === 'zh-CN' ? '💎 共创 AI 流量革命：赞助微享 AI-ATM 研发' :
    lang === 'ja-JP' ? '💎 AIトラフィック革命を共創：WeiXiang AI研究開発を支援' :
    lang === 'ko-KR' ? '💎 AI 트래픽 혁명 공동 창조: WeiXiang AI 연구개발 후원' :
    lang === 'vi-VN' ? '💎 Đồng kiến tạo Cách mạng Lưu lượng AI: Tài trợ R&D WeiXiang AI' :
    '💎 CO-CREATE THE AI TRAFFIC REVOLUTION';

  const getPkgName = (pkg: any) => {
    const i18nNames: Record<number, string> = {
      1: t.pkg1Name,
      2: t.pkg2Name,
      3: t.pkg3Name,
      4: t.pkg4Name,
      5: t.pkg5Name,
    };
    if (i18nNames[pkg.id]) {
      if (lang === 'zh-TW' && pkg.name_zh) return pkg.name_zh;
      if (lang === 'en-US' && pkg.name_en) return pkg.name_en;
      return i18nNames[pkg.id];
    }
    return isChinese ? pkg.name_zh : (pkg.name_en || pkg.name_zh);
  };

  const getPkgDiscount = (pkg: any) => {
    const i18nDiscounts: Record<number, string> = {
      1: t.disc1,
      2: t.disc2,
      3: t.disc3,
      4: t.disc4,
      5: t.disc5,
    };
    if (i18nDiscounts[pkg.id]) {
      if (lang === 'zh-TW' && pkg.discount_text) return pkg.discount_text;
      return i18nDiscounts[pkg.id];
    }
    return pkg.discount_text || pkg.discount;
  };

  const defaultPackages = [
    { id: 1, name_zh: t.pkg1Name, amount: 1, price: 99, discount_text: t.disc1, roi: '-' },
    { id: 2, name_zh: t.pkg2Name, amount: 3, price: 198, discount_text: t.disc2, roi: '+50%' },
    { id: 3, name_zh: t.pkg3Name, amount: 30, price: 1788, discount_text: t.disc3, roi: '+66%' },
    { id: 4, name_zh: t.pkg4Name, amount: 108, price: 5400, discount_text: t.disc4, roi: '+98%' },
    { id: 5, name_zh: t.pkg5Name, amount: 360, price: 12000, discount_text: t.disc5, roi: '+197%' },
  ];

  const [packages, setPackages] = useState<any[]>(defaultPackages);
  const [selectedPackageId, setSelectedPackageId] = useState(1);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch('/api/admin/packages');
        const data = await res.json();
        if (data.success && data.packages && data.packages.length > 0) {
          setPackages(data.packages);
        }
      } catch (e) {
        console.error("Failed to fetch dynamic packages", e);
      }
    };
    fetchPackages();
  }, []);

  const crowdfundPackages = packages.filter(p => !p.product_type || p.product_type === 'NFT_REDEEM');
  const coursePackages = packages.filter(p => p.product_type === 'DIRECT_COURSE');
  const displayCrowdfundPackages = crowdfundPackages.length > 0 ? crowdfundPackages : packages;
  const selectedPackage = displayCrowdfundPackages.find(p => p.id === selectedPackageId) || displayCrowdfundPackages[0];

  return (
    <main className="flex min-h-screen flex-col items-center bg-[#0a0a0f] text-white font-sans selection:bg-purple-500/30">
      {/* 頂部導覽列 */}
      <nav className="fixed top-0 left-0 w-full flex justify-center z-50 bg-[#0a0a0f]/80 backdrop-blur-lg border-b border-white/5">
        <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6 p-4 md:p-6">
          <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
            WeiXiang AI
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            <a
              href="#tutor-courses"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-cyan-500/20 hover:from-amber-500/30 hover:to-cyan-500/30 border border-emerald-400/50 text-emerald-300 font-bold text-sm transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-105 whitespace-nowrap"
            >
              {navCourseText}
            </a>
            <a
              href="#video-shoppable-service"
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-500/20 via-cyan-500/20 to-amber-500/20 hover:from-sky-500/35 hover:to-amber-500/35 border border-sky-400/50 text-sky-300 font-bold text-sm transition-all shadow-[0_0_15px_rgba(56,189,248,0.3)] hover:scale-105 whitespace-nowrap"
            >
              {navShoppableText}
            </a>
            <Link
              href="/sponsor"
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-amber-500/20 hover:from-purple-500/35 hover:to-amber-500/35 border border-purple-400/50 text-purple-200 font-bold text-sm transition-all shadow-[0_0_15px_rgba(168,85,247,0.35)] hover:scale-105 whitespace-nowrap"
            >
              {navSponsorText}
            </Link>
            <LanguageSwitcher />
            <ConnectButton label={connectLabel} />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full max-w-7xl px-6 py-16 md:py-24 mt-20 flex flex-col items-center text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none -z-10" />
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 text-sm md:text-base font-medium text-purple-300">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
          </span>
          {heroBadgeText}
        </div>

        <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight leading-[1.1]">
          {t.heroTitle1}
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            {t.heroTitle2}
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl leading-relaxed">
          {t.heroSub}
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <a href="#crowdfund" className="px-8 py-4 bg-white text-black hover:bg-gray-200 rounded-xl text-lg font-bold transition-all transform hover:scale-105">
            {t.btnCrowdfund}
          </a>
          <a href="#whitepaper" className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-lg font-bold transition-all backdrop-blur-sm">
            {t.btnWhitepaper}
          </a>
        </div>
      </section>

            {/* 影音與圖解介紹區 (雙語系) - 優化版排版 */}
      <section className="w-full max-w-5xl px-6 pb-16 flex flex-col items-center gap-10">
        {/* 資訊圖表 Infographic (置上，滿版) */}
        <div className="w-full rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/10 group">
          <img 
            src={introImageUrl} 
            alt="WeiXiang AI Infographic" 
            className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-700"
          />
        </div>

        {/* YouTube Short Video (置中) */}
        <div className="w-full flex justify-center">
          <div className="w-[315px] h-[560px] rounded-3xl overflow-hidden relative shadow-[0_0_40px_rgba(147,51,234,0.3)] border border-purple-500/40 hover:border-purple-400 transition-colors duration-300">
            <iframe 
              width="100%" 
              height="100%" 
              src={introVideoUrl} 
              title="WeiXiang AI Introduction" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="absolute inset-0"
            ></iframe>
          </div>
        </div>
      </section>

      {/* 核心價值主張 */}
      <section id="whitepaper" className="w-full max-w-7xl px-6 py-12 md:py-16 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6 border border-emerald-500/30">
              <span className="text-2xl">⏳</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">{t.val1Title}</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              {t.val1Desc}
            </p>
          </div>
          
          <div className="p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 border border-blue-500/30">
              <span className="text-2xl">⚖️</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">{t.val2Title}</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              {t.val2Desc}
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10">
            <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-6 border border-pink-500/30">
              <span className="text-2xl">📈</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">{t.val3Title}</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              {t.val3Desc}
            </p>
          </div>
        </div>
      </section>

      {/* 全球作者群 × 電子書自動交付 SaaS 合作計畫 */}
      <section id="author-coop" className="w-full max-w-7xl px-6 py-16">
        <div className="bg-gradient-to-br from-purple-900/50 via-indigo-950/60 to-pink-950/40 border border-pink-500/30 rounded-3xl p-8 md:p-14 text-center relative overflow-hidden shadow-[0_0_50px_rgba(236,72,153,0.15)]">
          {/* 背景裝飾光暈 */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

          {/* 徽章 Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-sm font-semibold mb-6">
            {t.coopBadge}
          </div>

          <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight text-white drop-shadow-lg leading-tight">
            {t.coopTitle}
          </h2>
          
          <p className="text-lg md:text-2xl text-pink-200 mb-10 max-w-4xl mx-auto leading-relaxed font-medium">
            {t.coopDesc}
          </p>

          {/* 三大亮點特色卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
            {/* 卡片 1: 24H 全自動發貨 SaaS */}
            <div className="bg-white/5 border border-white/10 hover:border-pink-500/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(236,72,153,0.25)] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-2xl mb-4 shadow-lg">
                  ⚡
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {t.coopCard1Title}
                </h3>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                  {t.coopCard1Desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 text-xs font-semibold text-pink-400">
                {t.coopCard1Tag}
              </div>
            </div>

            {/* 卡片 2: 一次性 $990 合作 NFT */}
            <div className="bg-white/5 border border-white/10 hover:border-purple-500/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(168,85,247,0.25)] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-2xl mb-4 shadow-lg">
                  🛡️
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {t.coopCard2Title}
                </h3>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                  {t.coopCard2Desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 text-xs font-semibold text-purple-400">
                {t.coopCard2Tag}
              </div>
            </div>

            {/* 卡片 3: 首創 100% 倒抵零風險機制 */}
            <div className="bg-white/5 border border-white/10 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(16,185,129,0.25)] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-2xl mb-4 shadow-lg">
                  💎
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {t.coopCard3Title}
                </h3>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                  {t.coopCard3Desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 text-xs font-semibold text-emerald-400">
                {t.coopCard3Tag}
              </div>
            </div>
          </div>

          {/* CTA 行動按鈕 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('open-ai-chat', { 
                    detail: { query: isChinese ? '我想諮詢全球作者電子書 $990 合作方案' : 'I would like to inquire about the Global Author E-Book $990 partnership plan' } 
                  }));
                }
              }}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white rounded-xl text-lg font-bold transition-all shadow-[0_0_30px_rgba(236,72,153,0.5)] transform hover:scale-105 cursor-pointer flex items-center gap-2"
            >
              {t.coopBtn}
            </button>
            <a 
              href="mailto:xyz007tw@gmail.com?subject=全球作者電子書SaaS合作諮詢"
              className="px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-base font-medium transition-all backdrop-blur-sm hover:scale-105 flex items-center gap-2"
            >
              {t.coopBtnMail}
            </a>
          </div>
        </div>
      </section>

      {/* 眾籌認購區塊 */}

      {/* 操作流程引導 (3-Step Guide) */}
      <section className="w-full max-w-7xl px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">{t.guideTitle}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* 連接線 (只在桌面版顯示) */}
          <div className="hidden md:block absolute top-[4.5rem] left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 -z-10"></div>
          
          {/* Step 1 */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md hover:bg-white/10 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center shadow-xl">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center text-3xl font-black mb-6 shadow-lg shadow-blue-500/30 transform rotate-3 hover:rotate-0 transition-transform">💳</div>
            <h3 className="text-2xl font-bold mb-4">{t.guideStep1Title}</h3>
            <p className="text-gray-400 leading-relaxed mb-4">{t.guideStep1Desc}</p>
            <a href="#crowdfund" className="mt-auto inline-flex items-center gap-1 text-sm font-bold text-cyan-400 hover:text-cyan-300 hover:underline">
              {step1LinkText}
            </a>
          </div>
          {/* Step 2 */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md hover:bg-white/10 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center shadow-xl">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center text-3xl font-black mb-6 shadow-lg shadow-purple-500/30 transform -rotate-3 hover:rotate-0 transition-transform">🎟️</div>
            <h3 className="text-2xl font-bold mb-4">{t.guideStep2Title}</h3>
            <p className="text-gray-400 leading-relaxed mb-4">{t.guideStep2Desc}</p>
            <Link href="/redeem" className="mt-auto inline-flex items-center gap-1 text-sm font-bold text-indigo-400 hover:text-indigo-300 hover:underline">
              {step2LinkText}
            </Link>
          </div>
          {/* Step 3 */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md hover:bg-white/10 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center shadow-xl">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center text-3xl font-black mb-6 shadow-lg shadow-pink-500/30 transform rotate-3 hover:rotate-0 transition-transform">📊</div>
            <h3 className="text-2xl font-bold mb-4">{t.guideStep3Title}</h3>
            <p className="text-gray-400 leading-relaxed mb-4">{t.guideStep3Desc}</p>
            <Link href="/dashboard" className="mt-auto inline-flex items-center gap-1 text-sm font-bold text-pink-400 hover:text-pink-300 hover:underline">
              {step3LinkText}
            </Link>
          </div>
        </div>

        {/* AI自來客系統 實戰操作說明影音 (雙語系) */}
        <div className="mt-14 w-full max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-base md:text-lg font-bold shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              🎬 {tutorialBadgeText}
            </span>
          </div>
          <div className="w-full aspect-video rounded-3xl overflow-hidden relative shadow-[0_0_40px_rgba(6,182,212,0.25)] border border-cyan-500/30 hover:border-cyan-400 transition-colors duration-300 bg-black/40">
            <iframe
              width="100%"
              height="100%"
              src={tutorialVideoUrl}
              title="WeiXiang AI Practical Operation Guide"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </section>

      <section id="crowdfund" className="w-full max-w-7xl px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6">{t.crowdTitle}</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t.crowdDesc}
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl mb-16">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-6 text-sm text-gray-400 font-semibold tracking-wider uppercase">{t.colLevel}</th>
                <th className="p-6 text-sm text-gray-400 font-semibold tracking-wider uppercase">{t.colAmount}</th>
                <th className="p-6 text-sm text-gray-400 font-semibold tracking-wider uppercase">{t.colPrice}</th>
                <th className="p-6 text-sm text-gray-400 font-semibold tracking-wider uppercase">{t.colUnitPrice}</th>
                <th className="p-6 text-sm text-gray-400 font-semibold tracking-wider uppercase">{t.colDiscount}</th>
                <th className="p-6 text-sm text-emerald-400 font-bold tracking-wider uppercase">ROI</th>
              </tr>
            </thead>
              <tbody className="divide-y divide-white/5">
                {displayCrowdfundPackages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-6 font-bold text-lg">{getPkgName(pkg)}</td>
                    <td className="p-6">{pkg.amount} {t.unitCount}</td>
                    <td className="p-6 font-mono text-xl">${pkg.price.toLocaleString()}</td>
                    <td className="p-6 font-mono text-gray-400">${(pkg.price / pkg.amount).toFixed(1)}</td>
                    <td className="p-6 text-green-400 font-bold">{getPkgDiscount(pkg)}</td>
                    <td className="p-6 text-purple-400 font-bold">{pkg.roi_text || pkg.roi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        {/* 互動購買區塊 */}
        <div className="max-w-xl mx-auto bg-gradient-to-br from-gray-800 to-gray-900 p-8 md:p-12 rounded-3xl border border-gray-700 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]" />
          <div className="relative z-10">
            <h3 className="text-3xl font-black mb-2 text-center">{t.checkoutTitle}</h3>
            <p className="text-center text-gray-400 mb-8">{t.checkoutSub}</p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">{t.checkoutSelectLabel}</label>
              <select 
                value={selectedPackageId}
                onChange={(e) => setSelectedPackageId(Number(e.target.value))}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                {displayCrowdfundPackages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {getPkgName(pkg)} - {pkg.amount} {t.unitCount} (${pkg.price})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-4">
              <BuyNFTButton 
                packageId={selectedPackage.id} 
                priceInUSDT={selectedPackage.price}
              />
              
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-700"></div>
                <span className="flex-shrink-0 mx-4 text-gray-500 text-sm font-medium">OR</span>
                <div className="flex-grow border-t border-gray-700"></div>
              </div>

              <div className="w-full relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
                <PayUniButton 
                  packageId={selectedPackage.id}
                  priceInUSDT={selectedPackage.price}
                />
                <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transform rotate-12 animate-pulse">
                  {t.payCard}
                </div>
              </div>
            </div>
            
            <p className="text-xs text-center text-gray-500 mt-6">
              {t.footerNotice}
            </p>
          </div>
        </div>
      </section>


            {/* 贊助圖文與影音區 */}
      <section className="w-full max-w-5xl mx-auto px-6 pb-12">
        <div className="bg-black/40 border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-emerald-400 text-center tracking-wide">
            {sponsorHeadingText}
          </h2>
          
          <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 mb-10">
            <img 
              src={isChinese ? '/sponsor-zh.jpg' : '/sponsor-en.jpg'} 
              alt="Sponsorship Infographic" 
              className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-700"
            />
          </div>

          <div className="flex justify-center w-full">
            <div className="w-[315px] h-[560px] bg-gray-800 rounded-2xl overflow-hidden relative shadow-[0_0_40px_rgba(168,85,247,0.3)] border border-purple-500/30 hover:shadow-[0_0_60px_rgba(168,85,247,0.5)] transition-shadow duration-500">
              <iframe 
                width="100%" 
                height="100%" 
                src={isChinese ? 'https://www.youtube.com/embed/nm2lVetbkaw' : 'https://www.youtube.com/embed/yMWApJ4uvcU'} 
                title="WeiXiang AI Sponsorship" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="absolute inset-0"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* 贊助圖文與影音區 */}
      <section className="w-full max-w-5xl mx-auto px-6 pb-12">
        <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-purple-500/30 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden group hover:border-purple-500/60 transition-all">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 group-hover:bg-purple-500/30 transition-all"></div>
          
          <div className="flex-1 z-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-3 text-white">
              {t.sponsorBannerTitle}
            </h3>
            <p className="text-purple-200 text-lg font-medium">
              {t.sponsorBannerSub1} <span className="text-yellow-400 font-bold bg-yellow-400/10 px-2 py-1 rounded">{t.sponsorBannerSub1Highlight}</span>！
            </p>
            <p className="text-gray-400 mt-2 text-sm">
              {t.sponsorBannerSub2}
            </p>
          </div>
          <div className="z-10 w-full md:w-auto">
            <Link href="/sponsor">
              <button className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all hover:-translate-y-1 text-lg whitespace-nowrap">
                {t.sponsorBannerBtn}
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* AI頂配教材導覽專區 (擺放於「想要支持去中心化 AI 基礎設施？」正下方) */}
      <TutorCourseSection courses={coursePackages} />

      {/* 新開發 AI「影片導購系統」客製化建置服務專區 */}
      <VideoShoppableSection />

      {/* 推廣區塊 */}
      <section className="w-full bg-white/5 border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h4 className="text-xl font-bold mb-2">{t.footerNodeTitle}</h4>
            <p className="text-gray-400">{t.footerNodeDesc}</p>
          </div>
          <Link href="/dashboard">
            <button className="px-8 py-4 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-xl text-lg font-bold transition-all">
              {t.footerNodeBtn}
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
