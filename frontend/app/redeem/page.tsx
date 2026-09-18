'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useSignMessage } from 'wagmi';
import { WEIXIANG_NFT_ADDRESS, WEIXIANG_NFT_ABI } from '@/lib/contractAbi';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RedeemPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);

  const { data: balance, isLoading: isReadingBalance } = useReadContract({
    address: WEIXIANG_NFT_ADDRESS as `0x${string}`,
    abi: WEIXIANG_NFT_ABI,
    functionName: 'balanceOf',
    args: address ? [address, BigInt(1)] : undefined,
    query: {
      enabled: !!address,
    }
  });

  const { signMessageAsync } = useSignMessage();

  const hasNFT = balance && (balance as bigint) > BigInt(0);

  const handleRedeem = async () => {
    if (!address) return;
    try {
      setIsVerifying(true);
      
      // 1. 簽名驗證身分 (Proof of ownership)
      const message = `我同意使用錢包 ${address} 開通 Web3 自動來客系統權限。\n時間戳: ${Date.now()}`;
      await signMessageAsync({ message });

      // 2. 呼叫後端 API，開通權限並計算發放極差獎金
      const refCode = localStorage.getItem('weixiang_referrer');
      const response = await fetch('/api/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address, refCode })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'API 請求失敗');
      }

      alert("🎉 開通成功！您的帳號權限已解鎖，獎金已自動結算。");
      router.push('/dashboard');
      
    } catch (error) {
      console.error(error);
      alert("開通失敗，請確認您已拒絕簽名或稍後再試。");
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
        <h1 className="text-3xl font-bold mb-4">尚未連結錢包</h1>
        <p className="text-gray-400 mb-8">請先連結錢包以驗證您的 NFT 憑證。</p>
        <button onClick={() => router.push('/')} className="px-6 py-3 bg-gray-800 rounded-lg">回首頁</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center pt-24 text-white">
      <div className="max-w-2xl w-full bg-gray-800 p-8 rounded-2xl border border-gray-700 text-center shadow-2xl">
        <h1 className="text-4xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
          VIP 權限開通專區
        </h1>
        <p className="text-gray-400 mb-8 text-lg">系統正在驗證您錢包內的「微享 NFT」...</p>

        {isReadingBalance ? (
          <div className="text-xl text-yellow-400 animate-pulse">正在掃描區塊鏈...</div>
        ) : hasNFT ? (
          <div className="space-y-6">
            <div className="p-6 bg-green-900/30 border border-green-500/50 rounded-xl">
              <span className="text-4xl block mb-2">✅</span>
              <h2 className="text-2xl font-bold text-green-400">驗證成功！</h2>
              <p className="text-green-200 mt-2">您的錢包內持有 {balance?.toString()} 枚微享 NFT 憑證。</p>
            </div>
            <button 
              onClick={handleRedeem}
              disabled={isVerifying}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 rounded-xl text-xl font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)]"
            >
              {isVerifying ? "開通中，請在錢包簽名..." : "立即開通系統權限"}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-6 bg-red-900/30 border border-red-500/50 rounded-xl">
              <span className="text-4xl block mb-2">❌</span>
              <h2 className="text-2xl font-bold text-red-400">未偵測到憑證</h2>
              <p className="text-red-200 mt-2">您的錢包內沒有微享 NFT。請先前往首頁購買，等待區塊鏈確認後再回來。</p>
            </div>
            <button onClick={() => router.push('/')} className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
              前往購買頁面
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
