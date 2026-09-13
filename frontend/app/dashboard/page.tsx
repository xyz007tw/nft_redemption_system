'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { createClient } from '@supabase/supabase-js';

// 初始化 Supabase 客戶端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const [referralLink, setReferralLink] = useState('');
  const [stats, setStats] = useState({ totalSales: 0, pendingCommission: 0 });

  useEffect(() => {
    if (address) {
      // 1. 自動為該錢包地址產生專屬推廣連結 (取錢包前綴作為推廣碼)
      const code = address.substring(2, 8).toUpperCase();
      setReferralLink(`https://weixiang.com/buy?ref=${code}`);

      // 2. 即時連線至 Supabase 撈取業績與獎金資料
      const fetchStats = async () => {
        // 抓取累積業績 (若剛註冊則為 0)
        const { data: user } = await supabase.from('nft_users').select('total_personal_sales').eq('wallet_address', address).single();
        
        // 抓取未結算獎金總額
        const { data: commissions } = await supabase.from('nft_commissions')
          .select('amount_usd')
          .eq('affiliate_wallet', address)
          .eq('status', 'Pending');
          
        const pending = commissions?.reduce((sum, c) => sum + Number(c.amount_usd), 0) || 0;

        setStats({
          totalSales: user?.total_personal_sales || 0,
          pendingCommission: pending
        });
      };
      fetchStats();
    }
  }, [address]);

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-4 text-red-400">⚠️ 拒絕存取</h1>
        <p className="text-gray-400">請先點擊首頁右上角的按鈕連線您的 Web3 錢包，以驗證業務身分！</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 tracking-wide">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            戰情儀表板
          </span> 
          <span className="text-xl text-gray-400 ml-4 font-normal">({address?.substring(0, 6)}...{address?.substring(38)})</span>
        </h1>
        
        {/* 財務數據區塊 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-lg">
            <h3 className="text-gray-400 mb-2 font-medium">本月未發放獎金</h3>
            <p className="text-5xl font-black text-green-400">${stats.pendingCommission.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-2">結帳日：每月 5 號</p>
          </div>
          
          <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-lg">
            <h3 className="text-gray-400 mb-2 font-medium">團隊總業績</h3>
            <p className="text-5xl font-black text-blue-400">${stats.totalSales.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-2">包含直推與傘下業績</p>
          </div>
          
          <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-lg">
            <h3 className="text-gray-400 mb-2 font-medium">目前極差級別</h3>
            <p className="text-5xl font-black text-purple-400">
              {stats.totalSales >= 6000 ? '10%' : stats.totalSales >= 600 ? '6%' : '3%'}
            </p>
            <p className="text-sm text-gray-500 mt-2">下一階門檻：$600</p>
          </div>
        </div>

        {/* 專屬推廣工具區塊 */}
        <div className="bg-gray-800 p-10 rounded-2xl border border-purple-900/50 shadow-[0_0_30px_rgba(147,51,234,0.15)]">
          <h2 className="text-3xl font-bold mb-4">您的專屬推廣連結 🔗</h2>
          <p className="text-gray-400 mb-6 text-lg">
            將此連結貼在您的 YouTube 影片下方，或是分享到 LINE 群組。只要客戶點擊此連結購買 NFT，系統將在區塊鏈上<strong className="text-white">永久綁定</strong>您為他的推薦人。
          </p>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <input 
              type="text" 
              readOnly 
              value={referralLink} 
              className="flex-1 bg-gray-900 border border-gray-600 rounded-xl px-6 py-4 text-white text-lg focus:outline-none focus:border-purple-500 transition-colors"
            />
            <button 
              onClick={() => {
                navigator.clipboard.writeText(referralLink);
                alert('已複製到剪貼簿！');
              }}
              className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-xl text-xl font-bold transition-all shadow-[0_0_20px_rgba(147,51,234,0.4)]"
            >
              一鍵複製
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
