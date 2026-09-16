'use client';

import { useState } from 'react';
import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { WEIXIANG_NFT_ABI, WEIXIANG_NFT_ADDRESS } from '@/lib/contractAbi';
import { formatUnits, parseUnits } from 'viem';

export default function AdminNFTPage() {
  const { isConnected } = useAccount();
  const [newPrice, setNewPrice] = useState('');
  
  const { data: currentPrice, refetch: refetchPrice } = useReadContract({
    address: WEIXIANG_NFT_ADDRESS as `0x${string}`,
    abi: WEIXIANG_NFT_ABI,
    functionName: 'priceInUSDT',
  });

  const { data: maxSupply } = useReadContract({
    address: WEIXIANG_NFT_ADDRESS as `0x${string}`,
    abi: WEIXIANG_NFT_ABI,
    functionName: 'maxSupply',
  });

  const { data: totalSupply } = useReadContract({
    address: WEIXIANG_NFT_ADDRESS as `0x${string}`,
    abi: WEIXIANG_NFT_ABI,
    functionName: 'totalSupply',
  });

  const { writeContract, isPending } = useWriteContract();

  const handleUpdatePrice = async () => {
    if (!newPrice) return alert("請輸入新價格");
    
    // USDT has 6 decimals
    const priceInWei = parseUnits(newPrice, 6);
    
    writeContract({
      address: WEIXIANG_NFT_ADDRESS as `0x${string}`,
      abi: WEIXIANG_NFT_ABI,
      functionName: 'setPrice',
      args: [priceInWei],
    }, {
      onSuccess: () => {
        alert("改價請求已送出！請等待區塊鏈確認。");
        setTimeout(() => refetchPrice(), 5000);
      },
      onError: (err) => {
        console.error(err);
        alert("操作失敗: " + (err.message || "未知錯誤"));
      }
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">📦 NFT 智能合約管理</h1>
      
      {/* 區塊鏈合約狀態 */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-8">
        <h2 className="text-xl font-bold mb-6">合約實時數據</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 p-4 rounded-lg">
            <p className="text-sm text-gray-400">目前售價 (USDT)</p>
            <p className="text-2xl font-bold text-green-400">
              {currentPrice ? formatUnits(currentPrice as bigint, 6) : "讀取中..."}
            </p>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg">
            <p className="text-sm text-gray-400">已售出數量</p>
            <p className="text-2xl font-bold text-blue-400">
              {totalSupply !== undefined ? (totalSupply as bigint).toString() : "讀取中..."}
            </p>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg">
            <p className="text-sm text-gray-400">最大發行量</p>
            <p className="text-2xl font-bold text-purple-400">
              {maxSupply !== undefined ? (maxSupply as bigint).toString() : "讀取中..."}
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-4">Contract Address: {WEIXIANG_NFT_ADDRESS}</p>
      </div>

      {/* 改價器 */}
      <div className="bg-gray-800 p-6 rounded-xl border border-red-900/50 mb-8">
        <h2 className="text-xl font-bold mb-2">💰 智能定價器</h2>
        <p className="text-sm text-gray-400 mb-4">
          修改後台的 NFT 價格。送出後將呼叫您的 MetaMask 簽名，將新價格直接寫入區塊鏈。
        </p>
        <div className="flex gap-4">
          <input 
            type="number" 
            placeholder="輸入新價格 (USDT)" 
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
          />
          <button 
            onClick={handleUpdatePrice}
            disabled={isPending || !isConnected}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg font-bold transition-all"
          >
            {isPending ? '交易送出中...' : '確認修改上鏈'}
          </button>
        </div>
      </div>
    </div>
  );
}
