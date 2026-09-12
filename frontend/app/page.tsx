import { ConnectButton } from '@rainbow-me/rainbowkit';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-12">
      <nav className="w-full max-w-6xl flex justify-between items-center mb-24 border-b border-gray-800 pb-6">
        <h1 className="text-3xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Weixiang AI-ATM
        </h1>
        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          <ConnectButton />
        </div>
      </nav>
      
      <div className="flex flex-col items-center text-center max-w-3xl">
        <h2 className="text-6xl font-black mb-8 leading-tight">
          全自動 AI 來客系統 <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Web3 雙軌金流版
          </span>
        </h2>
        <p className="mb-12 text-xl text-gray-400">
          購買微享 NFT 憑證，立即解鎖您的專屬影音與 SEO 自動化行銷艦隊。支援錢包支付與信用卡刷卡。
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* 購買卡片 */}
          <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-purple-500 transition-colors">
            <h3 className="text-2xl font-bold mb-4">超值技術套餐</h3>
            <p className="text-gray-400 mb-6">內含 3 枚服務兌換憑證</p>
            <div className="text-4xl font-bold mb-8">$990 <span className="text-lg text-gray-500">USDT</span></div>
            <button className="w-full py-4 bg-purple-600 hover:bg-purple-700 rounded-xl text-lg font-bold transition-all shadow-[0_0_20px_rgba(147,51,234,0.4)]">
              立即購買 NFT (Buy)
            </button>
          </div>

          {/* 核銷/推廣卡片 */}
          <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-4">會員中心</h3>
            <p className="text-gray-400 mb-8">核銷您的服務憑證，或開通業務推廣權限賺取 25% 獎金。</p>
            <Link href="/dashboard" className="w-full">
              <button className="w-full py-4 bg-gray-700 hover:bg-gray-600 rounded-xl text-lg font-bold transition-all">
                進入戰情後台 (Dashboard)
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
