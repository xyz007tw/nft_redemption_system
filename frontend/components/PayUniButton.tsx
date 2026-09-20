'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';

interface PayUniButtonProps {
  packageId: number;
  priceInUSDT: number;
}

export default function PayUniButton({ packageId, priceInUSDT }: PayUniButtonProps) {
  const { address } = useAccount();
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);

  const handlePayUniCheckout = async () => {
    if (!address) return alert("請先連結您的 Web3 錢包，作為資產綁定地址");
    if (!email || !email.includes('@')) return alert("請輸入有效的聯絡信箱");

    try {
      setIsProcessing(true);
      const refCode = localStorage.getItem('weixiang_referrer') || '';
      
      const res = await fetch('/api/payuni/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId, priceInUSDT, walletAddress: address, email, refCode })
      });
      const data = await res.json();
      
      if (!data.success) throw new Error(data.error || '金流建立失敗');

      // Create a hidden form and submit it to PayUni
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://api.payuni.com.tw/api/upp'; // Production URL
      
      const fields = {
        MerID: data.MerID,
        TradeInfo: data.TradeInfo,
        TradeSha: data.TradeSha,
        Version: data.Version
      };

      for (const [key, value] of Object.entries(fields)) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      }

      document.body.appendChild(form);
      form.submit();
      
    } catch (err: any) {
      console.error(err);
      alert("錯誤: " + err.message);
      setIsProcessing(false);
    }
  };

  if (!showEmailInput) {
    return (
      <button 
        onClick={() => setShowEmailInput(true)}
        className="w-full mt-4 py-4 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 rounded-xl text-lg font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2"
      >
        <span>💳</span> 信用卡 / ATM 台幣專屬通道
      </button>
    );
  }

  return (
    <div className="w-full mt-4 p-4 bg-gray-900 border border-gray-700 rounded-xl text-left">
      <p className="text-sm text-gray-400 mb-2">請輸入您的聯絡信箱 (必填)</p>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="example@gmail.com"
        className="w-full mb-4 bg-black border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
      />
      <button 
        onClick={handlePayUniCheckout}
        disabled={isProcessing || !address}
        className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 disabled:opacity-50 rounded-lg font-bold transition-all"
      >
        {isProcessing ? "跳轉金流中..." : "確認並前往統一金流結帳"}
      </button>
      {!address && (
        <p className="text-red-400 text-xs mt-2 text-center">請先在右上角連結錢包</p>
      )}
    </div>
  );
}
