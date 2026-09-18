'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import BuyNFTButton from '@/components/BuyNFTButton';

export default function Home() {
  const { t } = useLanguage();

  const packages = [
    { id: 1, name: '體驗創始包', amount: 1, price: 99, unitPrice: 99.0, discount: '原價', roi: '-' },
    { id: 2, name: '輕量增長包', amount: 3, price: 198, unitPrice: 66.0, discount: '66 折', roi: '+50%' },
    { id: 3, name: '商隊矩陣包', amount: 30, price: 1788, unitPrice: 59.6, discount: '60 折', roi: '+66%' },
    { id: 4, name: '超級節點包', amount: 108, price: 5400, unitPrice: 50.0, discount: '50 折', roi: '+98%' },
    { id: 5, name: '創世財團包', amount: 360, price: 12000, unitPrice: 33.3, discount: '33 折 (極致底價)', roi: '+197%' },
  ];

  const [selectedPackageId, setSelectedPackageId] = useState(1);
  const selectedPackage = packages.find(p => p.id === selectedPackageId) || packages[0];

  return (
    <main className="flex min-h-screen flex-col items-center bg-[#0a0a0f] text-white overflow-x-hidden font-sans selection:bg-purple-500/30">
      {/* 頂部導覽列 */}
      <nav className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6 p-6 border-b border-white/5 backdrop-blur-md sticky top-0 z-50">
        <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
          WeiXiang AI
        </h1>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <ConnectButton />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full max-w-7xl px-6 py-20 md:py-32 flex flex-col items-center text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none -z-10" />
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 text-sm md:text-base font-medium text-purple-300">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
          </span>
          DePIN × Enterprise AI Agent 基礎設施
        </div>

        <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight leading-[1.1]">
          基於非稀釋性資產憑證之
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            去中心化流量生產力網路
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl leading-relaxed">
          打破全球企業「獲客成本通膨」與「注意力稀缺」危機。
          結合 NFT 服務預售模式與 AI 自來客自動化系統，打造主動精準吸引的終極利器。
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <a href="#crowdfund" className="px-8 py-4 bg-white text-black hover:bg-gray-200 rounded-xl text-lg font-bold transition-all transform hover:scale-105">
            參與節點眾籌
          </a>
          <a href="#whitepaper" className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-lg font-bold transition-all backdrop-blur-sm">
            閱讀白皮書摘要
          </a>
        </div>
      </section>

      {/* 核心價值主張 */}
      <section id="whitepaper" className="w-full max-w-7xl px-6 py-20 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6 border border-emerald-500/30">
              <span className="text-2xl">⏳</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">180 天產能絕對錨定</h3>
            <p className="text-gray-400 leading-relaxed">
              每枚微享 NFT 嚴格對應 AI 系統 180 天核心功能使用權，將資金直接轉化為確定性的生產力工具，非純投機迷因。
            </p>
          </div>
          
          <div className="p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 border border-blue-500/30">
              <span className="text-2xl">⚖️</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">合規避險架構</h3>
            <p className="text-gray-400 leading-relaxed">
              憑證嚴格限定於「數位服務交換契約 (Digital Service Voucher)」，有效規避 Howey Test 證券化風險，符合歐美 SEC/MiCA 框架。
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10">
            <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-6 border border-pink-500/30">
              <span className="text-2xl">📈</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">批發轉售套利 (Arbitrage)</h3>
            <p className="text-gray-400 leading-relaxed">
              憑證可於 OpenSea、Magic Eden 等二級市場無限制自由交易。早期大戶以極低底價認購，創造高達 197% 的明確套利空間。
            </p>
          </div>
        </div>
      </section>

      {/* 萬商全球戰略大合作 */}
      <section className="w-full max-w-7xl px-6 py-16">
        <div className="bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-red-900/40 border border-pink-500/30 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
          <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight text-white drop-shadow-lg">
            🤝 歡迎萬商全球戰略大合作
          </h2>
          <p className="text-lg md:text-2xl text-pink-200 mb-8 max-w-4xl mx-auto leading-relaxed">
            我們正在尋找全球各地的百業商企、行銷團隊與 DAO 組織。
            將您的產品與微享 AI 流量憑證結合，打造極具競爭力的「買贈搭售」方案，共同瓜分 AI 自動化時代的流量紅利！
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white rounded-xl text-lg font-bold transition-all shadow-[0_0_30px_rgba(236,72,153,0.5)] transform hover:scale-105">
            立即洽詢全球合作方案
          </button>
        </div>
      </section>

      {/* 眾籌認購區塊 */}
      <section id="crowdfund" className="w-full max-w-7xl px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6">階梯式節點眾籌方案</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            專注於「批發巨額價差」、「即買即省生產力」與「二級市場自由流通」。
            提早佈局，掌握未來 AI 流量分發定價權。
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl mb-16">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-6 text-sm text-gray-400 font-semibold tracking-wider uppercase">方案級別</th>
                <th className="p-6 text-sm text-gray-400 font-semibold tracking-wider uppercase">憑證數量</th>
                <th className="p-6 text-sm text-gray-400 font-semibold tracking-wider uppercase">總售價 (USD)</th>
                <th className="p-6 text-sm text-gray-400 font-semibold tracking-wider uppercase">單枚成本</th>
                <th className="p-6 text-sm text-gray-400 font-semibold tracking-wider uppercase">折扣</th>
                <th className="p-6 text-sm text-emerald-400 font-bold tracking-wider uppercase">預估 ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {packages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-6 font-bold text-lg">{pkg.name}</td>
                  <td className="p-6">{pkg.amount} 枚</td>
                  <td className="p-6 font-mono text-xl">${pkg.price.toLocaleString()}</td>
                  <td className="p-6 font-mono text-gray-400">${pkg.unitPrice.toFixed(1)}</td>
                  <td className="p-6"><span className="px-3 py-1 rounded-full bg-white/10 text-sm">{pkg.discount}</span></td>
                  <td className="p-6 font-black text-emerald-400">{pkg.roi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 互動購買區塊 */}
        <div className="max-w-xl mx-auto bg-gradient-to-br from-gray-800 to-gray-900 p-8 md:p-12 rounded-3xl border border-gray-700 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]" />
          <div className="relative z-10">
            <h3 className="text-3xl font-black mb-2 text-center">立即參與眾籌</h3>
            <p className="text-center text-gray-400 mb-8">選擇方案並連接錢包，獲取您的微享 AI 生產力憑證</p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">請選擇認購方案：</label>
              <select 
                value={selectedPackageId}
                onChange={(e) => setSelectedPackageId(Number(e.target.value))}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name} - {pkg.amount} 枚 (${pkg.price})
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-black/40 p-6 rounded-2xl border border-white/5 mb-6 text-center">
               <div className="text-4xl font-bold mb-6">${selectedPackage.price} <span className="text-xl text-gray-500">USDT</span></div>
               <BuyNFTButton packageId={selectedPackage.id} priceInUSDT={selectedPackage.price} />
            </div>
            
            <p className="text-xs text-center text-gray-500 mt-6">
              * 您所選擇的方案將直接透過智能合約進行去中心化結算。
            </p>
          </div>
        </div>
      </section>

      {/* 推廣連結 */}
      <section className="w-full bg-white/5 border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h4 className="text-xl font-bold mb-2">已是節點投資人？</h4>
            <p className="text-gray-400">前往管理面板取得您的專屬聯盟行銷推廣連結，享受最高達 25% 的智能合約分佣。</p>
          </div>
          <Link href="/dashboard">
            <button className="px-8 py-4 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-xl text-lg font-bold transition-all">
              進入投資人儀表板
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
