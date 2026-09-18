'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { 
  WEIXIANG_NFT_ADDRESS, 
  WEIXIANG_NFT_ABI, 
  POLYGON_USDT_ADDRESS, 
  USDT_ABI 
} from '@/lib/contractAbi';
import { useLanguage } from '@/lib/LanguageContext';
import { useRouter } from 'next/navigation';

interface BuyNFTButtonProps {
  packageId: number;
  priceInUSDT: number;
}

export default function BuyNFTButton({ packageId, priceInUSDT }: BuyNFTButtonProps) {
  const { address, isConnected } = useAccount();
  const router = useRouter();

  const price = parseUnits(priceInUSDT.toString(), 6);

  // Read USDT Allowance
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

  // Write Contracts (Approve & Buy)
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
        alert("🎉 眾籌成功！即將為您導向兌換與分佣頁面...");
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
        functionName: 'buyPackage',
        args: [BigInt(packageId)]
      });
    }
  };

  let buttonText = "選擇此方案並結帳";
  if (isPending || isConfirming) {
    buttonText = txType === 'approve' ? "授權中(請在錢包確認)..." : "鑄造中(等待區塊鏈確認)...";
  } else if (isConnected && needsApproval) {
    buttonText = "1. 授權扣款 (Approve USDT)";
  } else if (isConnected && !needsApproval) {
    buttonText = `2. 確認認購 ($${priceInUSDT})`;
  }

  return (
    <div className="flex flex-col items-center w-full">
      <button 
        onClick={handleAction}
        disabled={isPending || isConfirming}
        className="w-full py-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-lg font-bold transition-all shadow-[0_0_20px_rgba(147,51,234,0.4)]"
      >
        {buttonText}
      </button>
      {isConfirmed && txType === 'approve' && (
        <p className="text-green-400 text-sm mt-2">授權成功！請點擊確認認購。</p>
      )}
    </div>
  );
}
