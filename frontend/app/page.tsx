'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import BuyNFTButton from '@/components/BuyNFTButton';

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-12 overflow-x-hidden">
      <nav className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6 mb-12 md:mb-24 border-b border-gray-800 pb-6 pt-4">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 text-center">
          Weixiang AI-ATM
        </h1>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <LanguageSwitcher />
          <ConnectButton />
        </div>
      </nav>
      
      <div className="flex-grow container mx-auto px-4 py-12 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-7xl font-extrabold mb-6 tracking-tight">
            <span className="text-white">全自動 AI 來客系統</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Web3 雙軌金流版 (v2.14.0)
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            購買微享 NFT 憑證，立即解鎖您的專屬影音與 SEO 自動化行銷艦隊。支援錢包支付與信用卡刷卡。
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* 購買卡片 */}
          <div className="bg-gray-800 p-6 md:p-8 rounded-2xl border border-gray-700 hover:border-purple-500 transition-colors">
            <h3 className="text-xl md:text-2xl font-bold mb-4">{t.buyPackageTitle}</h3>
            <p className="text-sm md:text-base text-gray-400 mb-6">{t.buyPackageDesc}</p>
            <BuyNFTButton />
          </div>

          {/* 核銷/推廣卡片 */}
          <div className="bg-gray-800 p-6 md:p-8 rounded-2xl border border-gray-700 flex flex-col justify-center">
            <h3 className="text-xl md:text-2xl font-bold mb-4">{t.dashboardTitle}</h3>
            <p className="text-sm md:text-base text-gray-400 mb-8">{t.dashboardDesc}</p>
            <Link href="/dashboard" className="w-full">
              <button className="w-full py-4 bg-gray-700 hover:bg-gray-600 rounded-xl text-lg font-bold transition-all">
                {t.dashboardBtn}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
