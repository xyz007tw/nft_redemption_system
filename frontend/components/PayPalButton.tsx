'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useLanguage } from '@/lib/LanguageContext';

interface PayPalButtonProps {
  packageId: number;
  priceInUSDT: number;
  productType?: string;
  productName?: string;
}

export const PAYPAL_RECEIVER_EMAIL = 'qqww11003@gmail.com';

export default function PayPalButton({ packageId, priceInUSDT, productType, productName }: PayPalButtonProps) {
  const { address } = useAccount();
  const { lang } = useLanguage();
  const isChinese = lang.includes('zh');
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePayPalCheckout = async () => {
    setErrorMsg(null);
    if (!email || !email.includes('@')) {
      setErrorMsg(
        isChinese
          ? '⚠️ 請填寫有效的聯絡電子信箱 (Email) 以接收教材下載與開通知！'
          : '⚠️ Please enter a valid email address to receive materials.'
      );
      return;
    }

    setIsProcessing(true);
    try {
      const refCode = typeof window !== 'undefined' ? (localStorage.getItem('weixiang_referrer') || '') : '';
      const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://nft1314.party';

      // Assemble custom field payload: pkgId|productType|price|email|refCode|address
      const customPayload = [
        packageId,
        productType || 'DIRECT_COURSE',
        priceInUSDT,
        email.trim().toLowerCase(),
        refCode,
        address || ''
      ].join('|');

      const itemName = productName || `WeiXiang AI Package #${packageId}`;

      // Create a hidden form and submit it to PayPal Standard Checkout
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://www.paypal.com/cgi-bin/webscr';
      form.target = '_self';

      const fields: Record<string, string> = {
        cmd: '_xclick',
        business: PAYPAL_RECEIVER_EMAIL,
        item_name: itemName,
        item_number: String(packageId),
        amount: String(priceInUSDT),
        currency_code: 'USD',
        no_shipping: '1',
        no_note: '1',
        charset: 'utf-8',
        custom: customPayload,
        return: `${siteUrl}/api/paypal/success?pkg=${packageId}&email=${encodeURIComponent(email.trim().toLowerCase())}`,
        cancel_return: `${siteUrl}/#tutor-courses`,
        notify_url: `${siteUrl}/api/paypal/ipn`
      };

      for (const [key, value] of Object.entries(fields)) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      }

      document.body.appendChild(form);
      form.submit();
    } catch (err: any) {
      console.error('PayPal checkout error:', err);
      setErrorMsg(err.message || (isChinese ? 'PayPal 金流發起失敗' : 'PayPal checkout failed'));
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full">
      {!showEmailInput ? (
        <button
          onClick={() => setShowEmailInput(true)}
          className="w-full py-4 bg-gradient-to-r from-[#003087] via-[#0079C1] to-[#00457C] hover:from-[#00256B] hover:to-[#003B6B] text-white font-black rounded-xl shadow-[0_0_25px_rgba(0,121,193,0.35)] transition-all cursor-pointer flex flex-col items-center justify-center gap-1 border border-cyan-400/30 hover:scale-[1.01]"
        >
          <div className="flex items-center gap-2 text-base md:text-lg">
            <span className="font-mono text-amber-400 font-black">🅿️ PayPal</span>
            <span>/ 信用卡 / 銀聯卡 結帳</span>
          </div>
          <span className="text-[11px] font-semibold text-cyan-200">
            {isChinese
              ? '💳 支援全球 Visa · MasterCard · 中國大陸銀聯卡 · PayPal 餘額'
              : '💳 Global Credit Cards · China UnionPay · PayPal Balance'}
          </span>
        </button>
      ) : (
        <div className="p-4 rounded-xl bg-slate-900/95 border border-cyan-500/50 space-y-3 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold font-mono">🅿️ PayPal</span>
              <span className="text-xs font-bold text-cyan-300">
                {isChinese ? '跨國外幣與銀聯卡收款通道' : 'International & UnionPay Gateway'}
              </span>
            </div>
            <button
              onClick={() => setShowEmailInput(false)}
              className="text-xs text-gray-400 hover:text-white"
            >
              ✕ 取消
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1">
              {isChinese ? '請輸入接收教材與憑證的電子信箱 (Email)：' : 'Enter your email to receive materials & receipts:'}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="w-full bg-black/80 border border-cyan-500/40 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              {isChinese
                ? `收款商戶: ${PAYPAL_RECEIVER_EMAIL} (柯驊哲) · 付款後秒發專屬電子書與教材`
                : `Merchant: ${PAYPAL_RECEIVER_EMAIL} · Instant material download delivery`}
            </p>
          </div>

          {errorMsg && (
            <div className="text-xs text-red-400 font-bold bg-red-950/40 p-2 rounded border border-red-500/30">
              {errorMsg}
            </div>
          )}

          <button
            onClick={handlePayPalCheckout}
            disabled={isProcessing}
            className="w-full py-3 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 disabled:opacity-50 text-slate-950 font-black rounded-lg shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>🔒</span>
            {isProcessing
              ? (isChinese ? '正在安全跳轉至 PayPal...' : 'Redirecting to PayPal...')
              : (isChinese ? `前往 PayPal 支付 $${priceInUSDT} USD` : `Proceed to PayPal ($${priceInUSDT} USD)`)}
          </button>
        </div>
      )}
    </div>
  );
}
