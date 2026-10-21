'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useLanguage } from '@/lib/LanguageContext';

interface PayUniButtonProps {
  packageId: number;
  priceInUSDT: number;
  productType?: string;
  productName?: string;
}

export default function PayUniButton({ packageId, priceInUSDT, productType, productName }: PayUniButtonProps) {
  const { address } = useAccount();
  const { t, lang } = useLanguage();
  const isChinese = lang.includes('zh');
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePayUniCheckout = async () => {
    setErrorMsg(null);
    if (!email || !email.includes('@')) {
      setErrorMsg(isChinese ? '⚠️ 請填寫有效的聯絡電子信箱 (Email) 以接收憑證與開通知！' : '⚠️ Please enter a valid email address.');
      return;
    }
    
    setIsProcessing(true);
    try {
      const refCode = localStorage.getItem('weixiang_referrer') || '';
      const response = await fetch('/api/payuni/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId,
          priceInUSDT,
          productType: productType || '',
          productName: productName || '',
          buyerAddress: address || '',
          email: email.trim().toLowerCase(),
          refCode
        })
      });
      const data = await response.json();
      
      if (!data.success) throw new Error(data.error || '金流建立失敗');

      // Create a hidden form and submit it to PayUni
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://api.payuni.com.tw/api/upp'; // Production URL
      form.target = '_self';
      
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
      setErrorMsg('❌ 錯誤: ' + (err.message || '連線異常'));
      setIsProcessing(false);
    }
  };

  if (!showEmailInput) {
    return (
      <button 
        type="button"
        onClick={() => setShowEmailInput(true)}
        className="relative z-10 w-full mt-4 py-4 px-4 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 active:scale-[0.99] rounded-xl text-base md:text-lg font-extrabold text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>💳</span> {t.payCard}
      </button>
    );
  }

  return (
    <div className="relative z-10 w-full mt-4 p-4 bg-gray-900 border-2 border-emerald-500/60 rounded-xl text-left shadow-xl">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs sm:text-sm font-bold text-emerald-300">{t.payEmailLabel}</p>
        <button
          type="button"
          onClick={() => {
            setShowEmailInput(false);
            setErrorMsg(null);
          }}
          className="text-xs text-gray-400 hover:text-white px-1.5 cursor-pointer"
        >
          ✕
        </button>
      </div>
      <input
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (errorMsg) setErrorMsg(null);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handlePayUniCheckout();
          }
        }}
        autoFocus
        placeholder="example@gmail.com"
        className="w-full mb-3 bg-black border border-gray-600 rounded-lg px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
      />
      {errorMsg && (
        <div className="mb-3 p-2.5 rounded-lg bg-red-500/20 border border-red-500/40 text-red-200 text-xs font-bold">
          {errorMsg}
        </div>
      )}
      <button 
        type="button"
        onClick={handlePayUniCheckout}
        disabled={isProcessing}
        className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 disabled:opacity-50 rounded-lg font-extrabold text-white transition-all cursor-pointer shadow-lg"
      >
        {isProcessing ? t.payJumping : `${t.payConfirm} (NT$ ${(priceInUSDT * 32).toLocaleString()})`}
      </button>
      <p className="text-gray-400 text-xs mt-3 text-center">
        {address 
          ? (isChinese ? `✓ 已綁定錢包: ${address.substring(0, 6)}...${address.substring(38)}` : `✓ Wallet Linked: ${address.substring(0, 6)}...${address.substring(38)}`)
          : (isChinese ? '✓ 免連接錢包！系統將自動以 Email 建立專屬會員權限' : '✓ No wallet needed! System automatically binds membership via Email')}
      </p>
    </div>
  );
}
