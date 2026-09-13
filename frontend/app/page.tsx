'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

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
      
      <div className="flex flex-col items-center text-center max-w-3xl px-2 w-full">
        <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
          {t.title} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            {t.subtitle}
          </span>
        </h2>
        <p className="mb-12 text-base md:text-xl text-gray-400 px-4">
          {t.description}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* 購買卡片 */}
          <div className="bg-gray-800 p-6 md:p-8 rounded-2xl border border-gray-700 hover:border-purple-500 transition-colors">
            <h3 className="text-xl md:text-2xl font-bold mb-4">{t.buyPackageTitle}</h3>
            <p className="text-sm md:text-base text-gray-400 mb-6">{t.buyPackageDesc}</p>
            <div className="text-3xl md:text-4xl font-bold mb-8">$990 <span className="text-base md:text-lg text-gray-500">USDT</span></div>
            <button className="w-full py-4 bg-purple-600 hover:bg-purple-700 rounded-xl text-lg font-bold transition-all shadow-[0_0_20px_rgba(147,51,234,0.4)]">
              {t.buyBtn}
            </button>
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
