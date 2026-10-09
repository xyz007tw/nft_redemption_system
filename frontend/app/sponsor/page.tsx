'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import BuyNFTButton from '@/components/BuyNFTButton';
import PayUniButton from '@/components/PayUniButton';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Link from 'next/link';

export default function SponsorPage() {
  const { t, lang } = useLanguage();
  const isChinese = lang.includes('zh');
  const introVideoUrl = isChinese ? 'https://www.youtube.com/embed/nm2lVetbkaw' : 'https://www.youtube.com/embed/yMWApJ4uvcU';
  
  const pitchTitle = isChinese ? '關於微享 AI 基礎設施計畫' : 'About WeiXiang AI Infrastructure';
  const pitchDesc = isChinese ? '您的贊助將被運用於：' : 'Your sponsorship will be used to:';
  const point1 = isChinese ? '擴建全球 AI 算力節點' : 'Expand global AI compute nodes';
  const point2 = isChinese ? '優化 Web3 分潤引擎系統' : 'Optimize the Web3 affiliate engine';
  const point3 = isChinese ? '推動去中心化行銷技術的普及' : 'Promote decentralized marketing tech';
  const pitchFooter = isChinese ? '（請在此觀看我們的計畫願景，您的每一分贊助都是推動 AI 革命的燃料）' : '(Watch our vision here. Every bit of support fuels the AI revolution)';
  const selectSponsorTitle = isChinese ? '⚡ 選擇您的贊助方案' : '⚡ Choose Your Sponsorship Tier';
  const selectSponsorDesc = isChinese ? '您的贊助將幫助我們維持 AI 節點的運作。贊助者將獲得一枚專屬區塊鏈紀念憑證。' : 'Your sponsorship helps us maintain AI nodes. Sponsors receive an exclusive blockchain NFT.';

  const disclaimerText = isChinese ? '*使用法幣贊助將獲得感謝信件。使用 USDT 贊助將自動空投專屬憑證至您的錢包。' : '*Fiat sponsorship yields a thank-you letter. USDT sponsorship automatically airdrops an exclusive NFT to your wallet.';
  const [packages, setPackages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/packages')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Filter ONLY SPONSOR packages
          const activeSponsorPackages = data.packages.filter((pkg: any) => pkg.is_active && pkg.product_type === 'SPONSOR');
          
          // Sort by price ascending
          activeSponsorPackages.sort((a: any, b: any) => Number(a.price) - Number(b.price));
          
          setPackages(activeSponsorPackages);
          if (activeSponsorPackages.length > 0) {
            setSelectedPackage(activeSponsorPackages[0]);
          }
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center pt-28 pb-20 px-4 relative">

      {/* 頂部導覽列 */}
      <div className="w-full max-w-7xl flex justify-between items-center p-6 absolute top-0 left-0 right-0 mx-auto">
        <Link href="/" className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 cursor-pointer hover:scale-105 transition-transform">
          WeiXiang AI
        </Link>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
        </div>
      </div>

      {/* 標題區 */}
      <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-6 text-center">
        {t.sponsorPageTitle}
      </h1>
      <p className="text-gray-400 max-w-2xl text-center mb-12 text-lg">
        {t.sponsorPageSub}
      </p>

      {/* 內容/影音播放區 */}
      <div className="w-full max-w-5xl bg-gradient-to-b from-gray-900/80 to-black/90 border border-purple-500/30 rounded-3xl p-6 md:p-10 mb-16 shadow-[0_0_50px_rgba(168,85,247,0.15)] flex flex-col items-center relative overflow-hidden">
        {/* 背景裝飾 */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <h2 className="text-3xl md:text-4xl font-black mb-10 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 text-center tracking-wide z-10">
          {isChinese ? '💎 共創 AI 流量革命：贊助微享 AI-ATM 研發' : '💎 CO-CREATE THE AI TRAFFIC REVOLUTION'}
        </h2>
        
        {/* Infographic Image */}
        <div className="w-full mb-12 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/10 z-10 group">
          <img 
            src={isChinese ? '/sponsor-zh.jpg' : '/sponsor-en.jpg'} 
            alt="Sponsorship Infographic" 
            className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-700"
          />
        </div>

        {/* YouTube Short Video & Features */}
        <div className="w-full flex flex-col md:flex-row items-center md:items-stretch gap-8 z-10">
          
          {/* Shorts Video */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <div className="w-[315px] h-[560px] bg-black rounded-3xl overflow-hidden relative shadow-[0_0_40px_rgba(147,51,234,0.3)] border border-purple-500/40 hover:border-purple-400 transition-colors duration-300">
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

          {/* Text Guide (More Eye-Catching) */}
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors duration-300 shadow-xl h-full flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <span className="text-3xl">🚀</span> {pitchTitle}
              </h3>
              <p className="text-gray-300 mb-8 text-lg">{pitchDesc}</p>
              
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full p-1.5 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="text-gray-200 text-lg font-medium leading-relaxed">{point1}</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-1.5 shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="text-gray-200 text-lg font-medium leading-relaxed">{point2}</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full p-1.5 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="text-gray-200 text-lg font-medium leading-relaxed">{point3}</span>
                </li>
              </ul>
              
              <div className="mt-auto pt-8 border-t border-white/10">
                <p className="text-sm text-cyan-400 font-medium italic flex items-center gap-2">
                  ✨ {pitchFooter}
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* 贊助方案 */}
      <div className="w-full max-w-lg bg-gradient-to-b from-gray-900 to-black border border-white/10 rounded-3xl p-8 relative overflow-hidden">
        {/* 背景裝飾 */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>

        <h3 className="text-2xl font-bold text-center mb-2">{selectSponsorTitle}</h3>
        <p className="text-gray-400 text-center mb-8 text-sm">
          {selectSponsorDesc}
        </p>

        {isLoading ? (
          <div className="text-center py-10 text-gray-500">讀取贊助方案...</div>
        ) : packages.length === 0 ? (
          <div className="text-center py-10 text-gray-500">目前無開放的贊助方案</div>
        ) : (
          <div className="flex flex-col gap-6 relative z-10">
            {/* 方案按鈕 */}
            <div className="grid grid-cols-3 gap-3">
              {packages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg)}
                  className={`py-3 px-2 rounded-xl border text-center transition-all ${
                    selectedPackage?.id === pkg.id 
                    ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                    : 'border-white/10 bg-black/30 hover:border-white/30'
                  }`}
                >
                  <div className="text-lg font-bold text-blue-400">${pkg.price}</div>
                  <div className="text-xs text-gray-400 mt-1 truncate px-1">
                    {lang === 'zh-TW' ? pkg.name_zh : pkg.name_en}
                  </div>
                </button>
              ))}
            </div>

            {/* 結帳區 */}
            {selectedPackage && (
              <div className="mt-4 flex flex-col gap-4">
                <BuyNFTButton 
                  packageId={selectedPackage.id} 
                  priceInUSDT={selectedPackage.price}
                />
                
                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-white/10"></div>
                  <span className="flex-shrink-0 mx-4 text-white/30 text-sm">OR</span>
                  <div className="flex-grow border-t border-white/10"></div>
                </div>

                <PayUniButton 
                  packageId={selectedPackage.id}
                  priceInUSDT={selectedPackage.price}
                />
              </div>
            )}
            
            <p className="text-center text-xs text-gray-500 mt-4">
              {disclaimerText}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
