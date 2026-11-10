'use client';

import { useState } from 'react';
import { useAccount, useReadContract, useSignMessage } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { WEIXIANG_NFT_ADDRESS, WEIXIANG_NFT_ABI } from '@/lib/contractAbi';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function RedeemPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);
  const [email, setEmail] = useState('');
  const [statusBanner, setStatusBanner] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [adAccountResult, setAdAccountResult] = useState<{
    daysAdded: number;
    alreadyRedeemed?: boolean;
    planTier?: string;
    maxAdSlots?: number;
    weight?: number;
    expiresAt?: string;
    passwordCode?: string;
    magicLoginUrl?: string;
    email?: string;
  } | null>(null);
  
  // 信用卡/Email 用戶核銷狀態
  const [fiatEmail, setFiatEmail] = useState('');
  const [isFiatVerifying, setIsFiatVerifying] = useState(false);

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

  // 檢查用戶是否有 NFT
  const hasNFT = balance && (balance as bigint) > BigInt(0);

  // 1. Web3 錢包持有者核銷流程
  const handleRedeem = async () => {
    setStatusBanner(null);
    if (!address) {
      setStatusBanner({ type: 'error', text: '⚠️ 請先連結錢包' });
      return;
    }
    if (!email || !email.includes('@')) {
      setStatusBanner({ type: 'error', text: '⚠️ 請輸入有效的電子郵件，我們將發送系統設定表單給您。' });
      return;
    }

    try {
      setIsVerifying(true);
      
      const message = `我同意使用錢包 ${address} 開通 Web3 自動來客系統權限。\n時間戳: ${Date.now()}`;
      const signature = await signMessageAsync({ message });

      const refCode = localStorage.getItem('weixiang_referrer');
      const nftBalanceNum = balance ? Number(balance) : 1;
      const response = await fetch('/api/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          signature,
          message,
          email: email.trim().toLowerCase(),
          refCode,
          nftBalance: nftBalanceNum
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'API 請求失敗');
      }

      localStorage.setItem('weixiang_user_email', email.trim().toLowerCase());
      if (data.adNetwork?.activated) {
        setAdAccountResult({
          ...data.adNetwork,
          email: email.trim().toLowerCase()
        });
        setStatusBanner({
          type: 'success',
          text: data.adNetwork.alreadyRedeemed
            ? `🎉 驗證成功！您的「萬商自助廣告系統」帳號已開通，可直接點擊下方按鈕進入設定廣告！`
            : `🎉 領取成功！已依您的 NFT 憑證為您自動延長 +${data.adNetwork.daysAdded} 天「萬商自助廣告系統」使用權限（可上架 ${data.adNetwork.maxAdSlots || 2} 件廣告）！`
        });
      } else {
        setStatusBanner({ type: 'success', text: '🎉 開通成功！我們已發送專屬開通信至您的信箱，即將導向會員中心...' });
        setTimeout(() => router.push('/dashboard'), 1500);
      }
      
    } catch (error: any) {
      console.error(error);
      setStatusBanner({ type: 'error', text: '❌ 錯誤: ' + (error.message || '開通失敗，請確認簽名或稍後再試。') });
    } finally {
      setIsVerifying(false);
    }
  };

  // 2. 信用卡 / ATM 刷卡用戶 Email 核銷流程
  const handleFiatRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusBanner(null);
    if (!fiatEmail || !fiatEmail.includes('@')) {
      setStatusBanner({ type: 'error', text: '⚠️ 請輸入有效的付款電子郵件地址' });
      return;
    }

    try {
      setIsFiatVerifying(true);
      const cleanEmail = fiatEmail.trim().toLowerCase();
      
      // 呼叫 email 登入/註冊 API 取得衍生錢包地址
      const authRes = await fetch('/api/auth/email-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      });
      const authData = await authRes.json();
      if (!authData.success) throw new Error(authData.error || '驗證失敗');

      const refCode = localStorage.getItem('weixiang_referrer');
      const response = await fetch('/api/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: authData.userAddress,
          signature: 'FIAT_VERIFIED_SIGNATURE',
          message: `Fiat purchase redeemed by ${cleanEmail}`,
          email: cleanEmail,
          refCode
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || '核銷開通失敗');
      }

      // 儲存 Email 登入狀態
      localStorage.setItem('weixiang_user_email', cleanEmail);
      localStorage.setItem('weixiang_user_address', authData.userAddress);

      if (data.adNetwork?.activated) {
        setAdAccountResult({
          ...data.adNetwork,
          email: cleanEmail
        });
        setStatusBanner({
          type: 'success',
          text: data.adNetwork.alreadyRedeemed
            ? `🎉 驗證成功！您的「萬商自助廣告系統」帳號已開通，可直接點擊下方按鈕進入設定廣告！`
            : `🎉 領取成功！已依您的 NFT 眾籌憑證自動延長 +${data.adNetwork.daysAdded} 天「萬商自助廣告系統」權限（可上架 ${data.adNetwork.maxAdSlots || 2} 件廣告）！`
        });
      } else {
        setStatusBanner({ type: 'success', text: '🎉 兌換成功！已為您的帳號啟用 180 天 AI 自動來客產線，即將導向會員中心...' });
        setTimeout(() => router.push('/dashboard'), 1500);
      }
    } catch (err: any) {
      console.error(err);
      setStatusBanner({ type: 'error', text: '❌ 核銷失敗: ' + (err.message || '請確認您輸入的 Email 與付款時相同') });
    } finally {
      setIsFiatVerifying(false);
    }
  };

  // =========================================================
  // 未連線狀態：提供 Web3 連線 與 信用卡 Email 兩種兌換途徑
  // =========================================================
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-4 pt-24 pb-28 md:p-6 relative">
        <div className="absolute top-6 left-4 md:top-8 md:left-8 z-20">
          <Link href="/" className="text-lg md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            ← 回首頁
          </Link>
        </div>
        <div className="absolute top-6 right-4 md:top-8 md:right-8 z-20">
          <LanguageSwitcher />
        </div>

        <div className="max-w-xl w-full bg-gray-900/90 border border-gray-800 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-3xl font-black mx-auto mb-6 shadow-lg shadow-purple-500/30">
            🎟️
          </div>
          <h1 className="text-3xl font-black mb-3">VIP 權限領取 ＆ 萬商廣告開通專區</h1>
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            驗證您的微享 NFT 憑證，每 <strong className="text-amber-300">1 顆 NFT 立即延長 180 天</strong>「萬商自助廣告系統」全網百站協播權限（眾籌滿 <strong className="text-emerald-300">$888 / $2,700 / $6,000</strong> 自動解鎖高頻率與最多 5～30 件廣告槽位）！
          </p>

          {statusBanner && (
            <div className={`mb-6 p-3.5 rounded-xl border text-xs md:text-sm font-bold text-left ${
              statusBanner.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                : 'bg-red-950/80 border-red-500/50 text-red-300'
            }`}>
              {statusBanner.text}
            </div>
          )}

          {adAccountResult && (
            <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-emerald-950/90 via-slate-900 to-indigo-950 border-2 border-amber-400/80 text-left shadow-xl">
              <div className="text-xs font-black text-amber-300 mb-1">
                📢 萬商自助廣告協播系統・專屬通行證已生效
              </div>
              <div className="text-sm text-white space-y-1 mb-4">
                <p>• 登入帳號：<code className="text-amber-300 font-bold">{adAccountResult.email}</code></p>
                {adAccountResult.passwordCode && (
                  <p>• 專屬密碼：<code className="text-amber-300 font-bold">{adAccountResult.passwordCode}</code></p>
                )}
                <p>• 方案權重與槽位：<strong className="text-emerald-300">{adAccountResult.weight || 3}x 優先輪播 ｜ 可上架 {adAccountResult.maxAdSlots || 2} 件廣告</strong></p>
                {adAccountResult.expiresAt && (
                  <p>• 有效期限至：<strong className="text-cyan-300">{adAccountResult.expiresAt.slice(0, 10)}</strong></p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <a
                  href={adAccountResult.magicLoginUrl || '/ad-studio'}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs sm:text-sm text-center shadow-lg hover:scale-[1.02] transition-all"
                >
                  🚀 一鍵免密進入「萬商廣告後台」上架廣告 ➔
                </a>
                <Link
                  href="/dashboard"
                  className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs sm:text-sm text-center transition-all"
                >
                  📊 前往會員中心
                </Link>
              </div>
            </div>
          )}

          {/* 途徑 1：Web3 錢包連線兌換 */}
          <div className="bg-gray-800/60 border border-gray-700/60 rounded-2xl p-6 mb-6 text-left">
            <h3 className="text-base font-bold text-cyan-400 mb-2 flex items-center gap-2">
              <span>🔗</span> 途徑一：持有 NFT 憑證者 (Web3 錢包)
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              以 MetaMask 或其他錢包付款者，請點擊下方按鈕連結錢包進行鏈上驗證：
            </p>
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          </div>

          <div className="flex items-center gap-3 my-6 text-xs text-gray-500 uppercase tracking-widest">
            <div className="flex-1 h-px bg-gray-800"></div>
            <span>或使用信用卡 Email 兌換</span>
            <div className="flex-1 h-px bg-gray-800"></div>
          </div>

          {/* 途徑 2：信用卡 / ATM 買家 Email 兌換 */}
          <form onSubmit={handleFiatRedeem} className="bg-gray-800/60 border border-gray-700/60 rounded-2xl p-6 text-left">
            <h3 className="text-base font-bold text-emerald-400 mb-2 flex items-center gap-2">
              <span>💳</span> 途徑二：信用卡 / ATM 刷卡買家 (免錢包)
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              請輸入您購買時填寫的電子信箱，系統將自動核對訂單並為您開通：
            </p>
            <input
              type="email"
              value={fiatEmail}
              onChange={(e) => setFiatEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="w-full mb-4 bg-black border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              required
            />
            <button
              type="submit"
              disabled={isFiatVerifying}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 rounded-xl text-base font-bold transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
            >
              {isFiatVerifying ? "驗證開通中..." : "以 Email 驗證並開通 180 天 AI 服務 🚀"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================
  // 已連線狀態：顯示 Web3 鏈上持有量與核銷表單
  // =========================================================
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center pt-24 pb-28 md:pb-16 px-4 text-white relative">
      <div className="absolute top-6 left-4 md:top-8 md:left-8 z-20">
        <Link href="/" className="text-lg md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
          ← 回首頁
        </Link>
      </div>
      <div className="absolute top-6 right-4 md:top-8 md:right-8 z-20">
        <LanguageSwitcher />
      </div>

      <div className="max-w-2xl w-full bg-gray-900 border border-gray-800 p-6 md:p-10 rounded-3xl text-center shadow-2xl">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-3xl font-black mx-auto mb-6 shadow-lg shadow-green-500/30">
          🎟️
        </div>
        <h1 className="text-3xl md:text-4xl font-black mb-3 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
          VIP 權限開通專區
        </h1>
        <p className="text-gray-400 mb-6 text-base">
          已連線錢包：<span className="text-cyan-400 font-mono">{address?.substring(0, 6)}...{address?.substring(38)}</span>
        </p>

        {statusBanner && (
          <div className={`mb-6 p-3.5 rounded-xl border text-xs md:text-sm font-bold text-left ${
            statusBanner.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
              : 'bg-red-950/80 border-red-500/50 text-red-300'
          }`}>
            {statusBanner.text}
          </div>
        )}

        {adAccountResult && (
          <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-emerald-950/90 via-slate-900 to-indigo-950 border-2 border-amber-400/80 text-left shadow-xl">
            <div className="text-xs font-black text-amber-300 mb-1">
              📢 萬商自助廣告協播系統・專屬通行證已生效
            </div>
            <div className="text-sm text-white space-y-1 mb-4">
              <p>• 登入帳號：<code className="text-amber-300 font-bold">{adAccountResult.email}</code></p>
              {adAccountResult.passwordCode && (
                <p>• 專屬密碼：<code className="text-amber-300 font-bold">{adAccountResult.passwordCode}</code></p>
              )}
              <p>• 方案權重與槽位：<strong className="text-emerald-300">{adAccountResult.weight || 3}x 優先輪播 ｜ 可上架 {adAccountResult.maxAdSlots || 2} 件廣告</strong></p>
              {adAccountResult.expiresAt && (
                <p>• 有效期限至：<strong className="text-cyan-300">{adAccountResult.expiresAt.slice(0, 10)}</strong></p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <a
                href={adAccountResult.magicLoginUrl || '/ad-studio'}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs sm:text-sm text-center shadow-lg hover:scale-[1.02] transition-all"
              >
                🚀 一鍵免密進入「萬商廣告後台」上架廣告 ➔
              </a>
              <Link
                href="/dashboard"
                className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs sm:text-sm text-center transition-all"
              >
                📊 前往會員中心
              </Link>
            </div>
          </div>
        )}

        {isReadingBalance ? (
          <div className="text-xl text-yellow-400 animate-pulse py-8">正在掃描區塊鏈上的微享憑證...</div>
        ) : hasNFT ? (
          <div className="space-y-6">
            <div className="p-6 bg-green-900/30 border border-green-500/50 rounded-2xl">
              <span className="text-4xl block mb-2">✅</span>
              <h2 className="text-2xl font-bold text-green-400">驗證成功！</h2>
              <p className="text-green-200 mt-2">
                您的錢包內持有 <strong>{balance?.toString()}</strong> 枚微享 NFT 憑證（可領取延長 <strong>{Number(balance || 1) * 180} 天</strong> 萬商全網廣告協播權限）。
              </p>
            </div>

            <div className="text-left bg-gray-800/60 p-6 rounded-2xl border border-gray-700/60">
              <label className="block text-sm font-medium text-gray-300 mb-2">請輸入您的業務聯絡信箱 (必填，作為萬商廣告系統登入帳號)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                required
              />
              <p className="text-xs text-gray-400 mt-2">領取成功後，系統將 0 秒開通您的「萬商自助廣告系統 (/ad-studio)」並寄發專屬帳密與一鍵免密登入連結至此信箱。</p>
            </div>

            <button 
              onClick={handleRedeem}
              disabled={isVerifying}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 rounded-xl text-lg font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer"
            >
              {isVerifying ? "開通中，請在錢包簽名確認..." : `簽名確認・立即啟動 ${Number(balance || 1) * 180} 天萬商廣告系統 🚀`}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-6 bg-red-900/30 border border-red-500/50 rounded-2xl">
              <span className="text-4xl block mb-2">❌</span>
              <h2 className="text-2xl font-bold text-red-400">鏈上未偵測到 NFT 憑證</h2>
              <p className="text-red-200 mt-2 text-sm leading-relaxed">
                此錢包內暫無未核銷的微享 NFT。若您是透過<strong>信用卡或 ATM 付款</strong>，請先斷開錢包，使用「信用卡 Email 兌換」入口即可秒級開通！
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <button onClick={() => router.push('/#crowdfund')} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-sm font-bold transition-colors">
                前往認購頁面
              </button>
              <button onClick={() => router.push('/')} className="px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-sm transition-colors">
                回首頁
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
