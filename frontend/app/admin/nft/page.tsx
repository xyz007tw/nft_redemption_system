'use client';

import { useState } from 'react';
import { useWriteContract, useAccount } from 'wagmi';
import { WEIXIANG_NFT_ABI, WEIXIANG_NFT_ADDRESS } from '@/lib/contractAbi';
import { parseUnits } from 'viem';

export default function AdminNFTPage() {
  const { isConnected } = useAccount();
  const [newPrice, setNewPrice] = useState('');
  
  const { writeContract, isPending } = useWriteContract();

  const handleUpdatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrice) return alert("請輸入新價格");
    
    // USDT has 6 decimals
    const priceInWei = parseUnits(newPrice, 6);
    
    writeContract({
      address: WEIXIANG_NFT_ADDRESS as `0x${string}`,
      abi: WEIXIANG_NFT_ABI,
      functionName: 'setPackage',
      // Package 1: TokenId 1, Quantity 1, newPrice, isActive=true
      args: [BigInt(1), BigInt(1), BigInt(1), priceInWei, true],
    }, {
      onSuccess: () => {
        alert("價格更新已送出！請等待區塊鏈確認");
      },
      onError: (err) => {
        console.error(err);
        alert("失敗: " + (err.message || "未知錯誤"));
      }
    });
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">V2 智能合約管理後台</h1>
      
      <div className="bg-gray-800 p-6 rounded-xl mb-8">
        <h2 className="text-xl font-bold mb-4">修改方案 1 價格 (體驗創始包)</h2>
        <form onSubmit={handleUpdatePackage} className="flex gap-4">
          <input
            type="number"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            placeholder="輸入新價格 (USDT)"
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
          />
          <button 
            type="submit"
            disabled={isPending || !isConnected}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold disabled:opacity-50"
          >
            {isPending ? '交易中...' : '確認修改'}
          </button>
        </form>
      </div>
    </div>
  );
}
