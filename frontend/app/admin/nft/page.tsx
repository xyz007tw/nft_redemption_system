'use client';

import { useState } from 'react';
import { useWriteContract, useAccount } from 'wagmi';
import { WEIXIANG_NFT_ABI, WEIXIANG_NFT_ADDRESS } from '@/lib/contractAbi';
import { parseUnits } from 'viem';

export default function AdminNFTPage() {
  const { isConnected } = useAccount();
  const [prices, setPrices] = useState({
    1: '99', 2: '198', 3: '1788', 4: '5400', 5: '12000'
  });
  
  const { writeContract, isPending } = useWriteContract();

  const handleUpdatePackage = async (id: number) => {
    const newPrice = prices[id as keyof typeof prices];
    if (!newPrice) return alert("請輸入新價格");
    
    const priceInWei = parseUnits(newPrice, 6);
    
    writeContract({
      address: WEIXIANG_NFT_ADDRESS as `0x${string}`,
      abi: WEIXIANG_NFT_ABI,
      functionName: 'setPackage',
      // TokenId 1 is the NFT ID. In our contract, we just mint Token 1.
      args: [BigInt(id), BigInt(1), BigInt(id === 1 ? 1 : id === 2 ? 3 : id === 3 ? 30 : id === 4 ? 108 : 360), priceInWei, true],
    }, {
      onSuccess: () => alert("價格更新已送出！請等待區塊鏈確認"),
      onError: (err) => {
        console.error(err);
        alert("失敗: " + (err.message || "未知錯誤"));
      }
    });
  };

  const handleSaveFrontend = () => {
    alert("【系統提示】目前的方案名稱與價格為了極致的網頁載入速度，是寫死 (Hardcoded) 在前端程式碼中的。若要開啟動態資料庫模式 (由後台控制前台顯示)，請指示工程師建立 Supabase Packages 資料表。");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">NFT 產品項目管理</h1>
      <p className="text-gray-400 mb-8">
        此區塊可讓您設定每個眾籌方案的價格與數量。注意：智能合約的價格與前端顯示的價格目前是分開的。
      </p>

      <div className="bg-gray-800 p-6 rounded-xl mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">前端顯示參數設定 (UI Config)</h2>
          <button onClick={handleSaveFrontend} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-bold">
            儲存前端設定至資料庫
          </button>
        </div>
        <p className="text-sm text-gray-400 mb-6">
          修改前台展示的文字、價格與優惠折數。
        </p>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((id) => (
            <div key={`ui-${id}`} className="flex gap-4 items-center bg-gray-900 p-4 rounded-lg">
              <span className="font-bold w-20">方案 {id}</span>
              <input type="text" placeholder="方案名稱 (例如: 體驗創始包)" className="flex-1 bg-black border border-gray-700 rounded px-3 py-1" />
              <input type="number" placeholder="售價 (USDT)" className="w-32 bg-black border border-gray-700 rounded px-3 py-1" />
              <input type="text" placeholder="折扣文字 (例如: 66 折)" className="w-32 bg-black border border-gray-700 rounded px-3 py-1" />
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-gray-800 p-6 rounded-xl mb-8 border border-purple-500/30">
        <h2 className="text-xl font-bold mb-6 text-purple-400">區塊鏈合約價格設定 (Smart Contract)</h2>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((id) => (
            <div key={`sc-${id}`} className="flex gap-4 items-center bg-gray-900 p-4 rounded-lg">
              <span className="font-bold w-20">方案 {id}</span>
              <input
                type="number"
                value={prices[id as keyof typeof prices]}
                onChange={(e) => setPrices({ ...prices, [id]: e.target.value })}
                placeholder="USDT"
                className="w-32 bg-black border border-gray-700 rounded px-3 py-1 text-white"
              />
              <button 
                onClick={() => handleUpdatePackage(id)}
                disabled={isPending || !isConnected}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-bold disabled:opacity-50 ml-auto"
              >
                {isPending ? '交易中...' : '寫入區塊鏈'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
