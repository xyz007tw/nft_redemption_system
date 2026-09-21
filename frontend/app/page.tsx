'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import BuyNFTButton from '@/components/BuyNFTButton';
import PayUniButton from '@/components/PayUniButton';
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

  const selectedPackage = packages.find(p => p.id === selectedPackageId) || packages[0];

  return (
    <main className="flex min-h-screen flex-col items-center bg-[#0a0a0f] text-white font-sans selection:bg-purple-500/30">
      {/* 頂部導覽列 */}
      <nav className="fixed top-0 left-0 w-full flex justify-center z-50 bg-[#0a0a0f]/80 backdrop-blur-lg border-b border-white/5">
        <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6 p-4 md:p-6">
          <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
            WeiXiang AI
          </h1>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <ConnectButton />
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
          DePIN × Enterprise AI Agent 基礎設施
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

      {/* 影音與圖解介紹區塊 (隨語系切換) */}
      <section className="w-full max-w-7xl px-6 pb-16 flex flex-col md:flex-row items-center gap-12">
        {/* YouTube Short Video */}
        <div className="w-full md:w-1/3 flex justify-center">
          <div className="w-[315px] h-[560px] rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(147,51,234,0.3)] border border-purple-500/30">
            <iframe 
              width="315" 
              height="560" 
              src={introVideoUrl} 
              title="WeiXiang AI Introduction" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="w-full h-full object-cover"
            ></iframe>
          </div>
        </div>

        {/* 資訊圖表 Infographic */}
        <div className="w-full md:w-2/3 flex justify-center">
          <div className="w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-white/5">
            <img 
              src={introImageUrl} 
              alt="WeiXiang AI Infographic" 
              className="w-full h-auto object-contain"
            />
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

      {/* 萬商全球戰略大合作 */}
      <section className="w-full max-w-7xl px-6 py-16">
        <div className="bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-red-900/40 border border-pink-500/30 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
          <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight text-white drop-shadow-lg">
            {t.coopTitle}
          </h2>
          <p className="text-lg md:text-2xl text-pink-200 mb-8 max-w-4xl mx-auto leading-relaxed">
            {t.coopDesc}
          </p>
          <Link href="/dashboard#crowdfund-rules" className="inline-block px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white rounded-xl text-lg font-bold transition-all shadow-[0_0_30px_rgba(236,72,153,0.5)] transform hover:scale-105">
            {t.coopBtn}
          </Link>
        </div>
      </section>

      {/* 眾籌認購區塊 */}
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
                {packages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-6 font-bold text-lg">{isChinese ? pkg.name_zh : (pkg.name_en || pkg.name_zh)}</td>
                    <td className="p-6">{pkg.amount} {t.unitCount}</td>
                    <td className="p-6 font-mono text-xl">${pkg.price.toLocaleString()}</td>
                    <td className="p-6 font-mono text-gray-400">${(pkg.price / pkg.amount).toFixed(1)}</td>
                    <td className="p-6 text-green-400 font-bold">{pkg.discount_text || pkg.discount}</td>
                    <td className="p-6 text-purple-400 font-bold">{pkg.roi_text || pkg.roi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {isChinese ? pkg.name_zh : (pkg.name_en || pkg.name_zh)} - {pkg.amount} {t.unitCount} (${pkg.price})
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
