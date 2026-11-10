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
  const { t } = useLanguage();
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
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [buyerEmail, setBuyerEmail] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('weixiang_user_email');
    if (saved && saved.includes('@')) {
      setBuyerEmail(saved);
    }
  }, []);

  useEffect(() => {
    if (isConfirmed) {
      if (txType === 'approve') {
        refetchAllowance();
      } else if (txType === 'buy') {
        if (buyerEmail && buyerEmail.includes('@')) {
          localStorage.setItem('weixiang_user_email', buyerEmail.trim().toLowerCase());
        }
        setStatusMsg("🎉 眾籌成功！即將為您導向兌換與萬商廣告開通頁面...");
        setTimeout(() => router.push('/redeem'), 1000);
      }
      setTxType(null);
    }
  }, [isConfirmed, txType, refetchAllowance, router, buyerEmail]);

  const handleAction = () => {
    if (!isConnected) {
      setStatusMsg("⚠️ 請先連結錢包");
      return;
    }
    if (!buyerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerEmail.trim())) {
      setStatusMsg("⚠️ 請先填寫有效的電子信箱 (Email)，以便核銷時同步寄發您的「萬商廣告通行證 (帳密與一鍵免密連結)」電郵備份！");
      return;
    }
    localStorage.setItem('weixiang_user_email', buyerEmail.trim().toLowerCase());
    setStatusMsg(null);

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

  let buttonText = t.buyBtn2;
  if (isPending || isConfirming) {
    buttonText = txType === 'approve' ? t.buyApproving : t.buyMinting;
  } else if (isConnected && needsApproval) {
    buttonText = t.buyBtn1;
  } else if (isConnected && !needsApproval) {
    buttonText = `${t.buyBtn2} ($${priceInUSDT})`;
  }

  return (
    <div className="flex flex-col items-center w-full">
      {isConnected && (
        <div className="w-full mb-3 text-left bg-gray-900/90 border border-purple-500/40 rounded-xl p-3">
          <label className="block text-xs font-bold text-purple-300 mb-1.5">
            📩 請先填寫接收「萬商廣告通行證 (帳密備份)」之電子信箱 (必填)：
          </label>
          <input
            type="email"
            value={buyerEmail}
            onChange={(e) => {
              setBuyerEmail(e.target.value);
              if (statusMsg) setStatusMsg(null);
            }}
            placeholder="example@gmail.com"
            className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
            required
          />
          <p className="text-[11px] text-gray-400 mt-1">
            ✓ 核銷時除網頁直接彈出通行證外，將同步寄送一份相同帳密與免密連結至此信箱防滑掉遺失！
          </p>
        </div>
      )}
      <button 
        type="button"
        onClick={handleAction}
        disabled={isPending || isConfirming || !isConnected}
        className="w-full py-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-lg font-bold transition-all shadow-[0_0_20px_rgba(147,51,234,0.4)] cursor-pointer"
      >
        {buttonText}
      </button>
      {statusMsg && (
        <p className={`${statusMsg.startsWith('⚠️') ? 'text-amber-300' : 'text-emerald-400'} text-xs mt-2 font-bold text-center`}>{statusMsg}</p>
      )}
      {isConfirmed && txType === 'approve' && (
        <p className="text-green-400 text-sm mt-2">{t.buyApproveSuccess}</p>
      )}
      {!isConnected && (
        <p className="text-red-400 text-xs mt-2">{t.buyConnect}</p>
      )}
    </div>
  );
}
