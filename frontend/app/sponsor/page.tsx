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
  const introVideoUrl = isChinese ? 'https://www.youtube.com/embed/ZGyXZiW9hH0' : 'https://www.youtube.com/embed/jolRAnobFds';
  
  const pitchTitle = isChinese ? '🚀 關於微享 AI 基礎設施計畫' : '🚀 About WeiXiang AI Infrastructure';
  const pitchDesc = isChinese ? '您的贊助將被運用於：' : 'Your sponsorship will be used to:';
  const point1 = isChinese ? '擴建全球 AI 算力節點' : 'Expand global AI compute nodes';
  const point2 = isChinese ? '優化 Web3 分潤引擎系統' : 'Optimize the Web3 affiliate engine';
  const point3 = isChinese ? '推動去中心化行銷技術的普及' : 'Promote decentralized marketing tech';
  const pitchFooter = isChinese ? '（請在此觀看我們的計畫願景，您的每一分贊助都是推動 AI 革命的燃料）' : '(Watch our vision here. Every bit of support fuels the AI revolution)';
  const selectSponsorTitle = isChinese ? '⚡ 選擇您的贊助方案' : '⚡ Choose Your Sponsorship Tier';
  const selectSponsorDesc = isChinese ? '您的贊助將幫助我們維持 AI 節點的運作。贊助者將獲得一枚專屬區塊鏈紀念憑證。' : 'Your sponsorship helps us maintain AI nodes. Sponsors receive an exclusive blockchain NFT.';

  const disclaimerText = isChinese ? '*使用法幣贊助將獲得感謝信件，使用 USDT 贊助將自動空投專屬憑證至您的錢包' : '*Fiat sponsorship yields a thank-you letter. USDT sponsorship automatically airdrops an exclusive NFT to your wallet.';
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

      {/* 內容/影片播放區 (Placeholder) */}
      <div className="w-full max-w-4xl bg-black/40 border border-white/10 rounded-2xl p-6 mb-16 shadow-2xl">
        <div className="aspect-video bg-gray-800 rounded-xl flex items-center justify-center mb-6 overflow-hidden relative shadow-2xl border border-purple-500/30">
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
        <h2 className="text-2xl font-bold mb-4">{pitchTitle}</h2>
        <div className="space-y-4 text-gray-300">
          <p>{pitchDesc}</p>
          <ul className="list-disc list-inside ml-4 space-y-2">
            <li>{point1}</li>
            <li>{point2}</li>
            <li>{point3}</li>
          </ul>
          <p className="mt-6 text-sm text-gray-500 italic">{pitchFooter}</p>
        </div>
      </div>

      {/* 贊助區塊 */}
      <div className="w-full max-w-lg bg-gradient-to-b from-gray-900 to-black border border-white/10 rounded-3xl p-8 relative overflow-hidden">
        {/* 發光裝飾 */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>

        <h3 className="text-2xl font-bold text-center mb-2">{selectSponsorTitle}</h3>
        <p className="text-gray-400 text-center mb-8 text-sm">
          {selectSponsorDesc}
        </p>

        {isLoading ? (
          <div className="text-center py-10 text-gray-500">正在讀取贊助方案...</div>
        ) : packages.length === 0 ? (
          <div className="text-center py-10 text-gray-500">目前尚無開放的贊助方案</div>
        ) : (
          <div className="flex flex-col gap-6 relative z-10">
            {/* 方案選擇器 */}
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

            {/* 結帳按鈕 (與首頁共用同樣的強大雙金流元件) */}
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
