'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { 
  WEIXIANG_NFT_ADDRESS, 
  WEIXIANG_NFT_ABI, 
  POLYGON_USDT_ADDRESS, 
  USDT_ABI 
} from '@/lib/contractAbi';
import { useLanguage } from '@/lib/LanguageContext';
import { useRouter } from 'next/navigation';

export default function BuyNFTButton() {
  const { address, isConnected } = useAccount();
  const { t } = useLanguage();
  const router = useRouter();

  // 1. Read NFT Price
  const { data: priceData } = useReadContract({
    address: WEIXIANG_NFT_ADDRESS as `0x${string}`,
    abi: WEIXIANG_NFT_ABI,
    functionName: 'priceInUSDT',
  });

  const price = priceData ? (priceData as bigint) : parseUnits("99", 6);
  const displayPrice = formatUnits(price, 6);

  // 2. Read USDT Allowance
  const { data: allowanceData, refetch: refetchAllowance } = useReadContract({
    address: POLYGON_USDT_ADDRESS as `0x${string}`,
    abi: USDT_ABI,
    functionName: 'allowance',
    args: address ? [address, WEIXIANG_NFT_ADDRESS] : undefined,
    query: {
      enabled: !!address,
    }
  });

  const allowance = allowanceData ? (allowanceData as bigint) : BigInt(0);
  const needsApproval = allowance < price;

  // 3. Write Contracts (Approve & Buy)
  const { data: hash, writeContract, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const [txType, setTxType] = useState<'approve' | 'buy' | null>(null);

  useEffect(() => {
    if (isConfirmed) {
      if (txType === 'approve') {
        refetchAllowance();
      } else if (txType === 'buy') {
        alert("🎉 購買成功！即將為您導向兌換開通頁面...");
        router.push('/redeem');
      }
      setTxType(null);
    }
  }, [isConfirmed, txType, refetchAllowance, router]);

  const handleAction = () => {
    if (!isConnected) {
      alert("請先連結錢包");
      return;
    }

    if (needsApproval) {
      setTxType('approve');
      writeContract({
        address: POLYGON_USDT_ADDRESS as `0x${string}`,
        abi: USDT_ABI,
        functionName: 'approve',
        args: [WEIXIANG_NFT_ADDRESS, price],
      });
    } else {
      setTxType('buy');
      writeContract({
        address: WEIXIANG_NFT_ADDRESS as `0x${string}`,
        abi: WEIXIANG_NFT_ABI,
        functionName: 'buyNFT',
      });
    }
  };

  let buttonText = t.buyBtn;
  if (isPending || isConfirming) {
    buttonText = txType === 'approve' ? "授權中..." : "購買中(等待區塊鏈確認)...";
  } else if (isConnected && needsApproval) {
    buttonText = "1. 授權扣款 (Approve USDT)";
  } else if (isConnected && !needsApproval) {
    buttonText = "2. 確認購買 (Buy NFT)";
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="text-3xl md:text-4xl font-bold mb-8">
        ${displayPrice} <span className="text-base md:text-lg text-gray-500">USDT</span>
      </div>
      <button 
        onClick={handleAction}
        disabled={isPending || isConfirming}
        className="w-full py-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-lg font-bold transition-all shadow-[0_0_20px_rgba(147,51,234,0.4)]"
      >
        {buttonText}
      </button>
      {isConfirmed && txType === 'approve' && (
        <p className="text-green-400 text-sm mt-2">授權成功！請點擊確認購買。</p>
      )}
    </div>
  );
}
