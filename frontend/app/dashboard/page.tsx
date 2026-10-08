'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { createClient } from '@supabase/supabase-js';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Link from 'next/link';

// 初始化 Supabase 客戶端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key'
);

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const { t } = useLanguage();

  // 雙軌登入身分管理 (支援 Web3 錢包與 Email 信用卡用戶)
  const [activeAddress, setActiveAddress] = useState<string | null>(null);
  const [activeEmail, setActiveEmail] = useState<string | null>(null);
  
  // Email 登入表單狀態
  const [inputEmail, setInputEmail] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  // 業務數據
  const [referralLink, setReferralLink] = useState('');
  const [stats, setStats] = useState({ totalSales: 0, pendingCommission: 0 });
  const [payoutWallet, setPayoutWallet] = useState('');
  const [isSavingPayout, setIsSavingPayout] = useState(false);
  const [payoutSaveMsg, setPayoutSaveMsg] = useState('');

  // 監聽 Web3 錢包連線狀態，或讀取本地 Email 登入紀錄
  useEffect(() => {
    if (isConnected && address) {
      setActiveAddress(address);
      setActiveEmail(null);
    } else {
      const savedEmail = localStorage.getItem('weixiang_user_email');
      const savedAddress = localStorage.getItem('weixiang_user_address');
      if (savedEmail && savedAddress) {
        setActiveEmail(savedEmail);
        setActiveAddress(savedAddress);
      } else {
        setActiveAddress(null);
        setActiveEmail(null);
      }
    }
  }, [isConnected, address]);

  // 載入會員數據
  useEffect(() => {
    if (activeAddress) {
      // 1. 產生該用戶專屬推廣連結 (取錢包前綴作 6 碼推廣碼)
      const code = activeAddress.substring(2, 8).toUpperCase();
      setTimeout(() => setReferralLink(`${window.location.origin}/?ref=${code}`), 0);

      // 2. 即時連線至 Supabase 撈取業績與獎金資料
      const fetchStats = async () => {
        try {
          const { data: user } = await supabase
            .from('users')
            .select('total_sales, payout_wallet')
            .eq('wallet_address', activeAddress)
            .maybeSingle();
          
          if (user?.payout_wallet) {
            setPayoutWallet(user.payout_wallet);
          }

          const { data: commissions } = await supabase
            .from('commissions')
            .select('amount')
            .eq('wallet_address', activeAddress)
            .eq('status', 'PENDING');
            
          const pending = commissions?.reduce((sum, c) => sum + Number(c.amount), 0) || 0;

          setStats({
            totalSales: Number(user?.total_sales) || 0,
            pendingCommission: pending
          });
        } catch (err) {
          console.error('Fetch stats error:', err);
        }
      };
      fetchStats();
    }
  }, [activeAddress]);

  // 處理 Email 免密碼快速登入
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputEmail || !inputEmail.includes('@')) {
      setLoginError('請輸入有效的電子郵件地址');
      return;
    }

    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await fetch('/api/auth/email-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inputEmail.trim() })
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || '登入失敗');
      }

      localStorage.setItem('weixiang_user_email', data.email);
      localStorage.setItem('weixiang_user_address', data.userAddress);
      setActiveEmail(data.email);
      setActiveAddress(data.userAddress);
    } catch (err: any) {
      setLoginError(err.message || '登入失敗，請稍後再試');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // 登出 Email 會員
  const handleLogout = () => {
    localStorage.removeItem('weixiang_user_email');
    localStorage.removeItem('weixiang_user_address');
    setActiveEmail(null);
    setActiveAddress(null);
  };

  // 儲存提領錢包地址
  const handleSavePayoutWallet = async () => {
    if (!activeAddress || !payoutWallet) return;
    setIsSavingPayout(true);
    setPayoutSaveMsg('');
    try {
      await supabase.from('users').update({
        payout_wallet: payoutWallet.trim()
      }).eq('wallet_address', activeAddress);
      setPayoutSaveMsg('✓ 提領錢包地址已成功綁定！');
    } catch (e: any) {
      setPayoutSaveMsg('綁定失敗: ' + e.message);
    } finally {
      setIsSavingPayout(false);
    }
  };

  // ========================================================
  // 未登入狀態：顯示 Web3 錢包 / Email 雙軌登入入口
  // ========================================================
  if (!activeAddress) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0f] text-white p-6 relative">
        <div className="absolute top-8 right-8">
          <LanguageSwitcher />
        </div>
        <div className="absolute top-8 left-8">
          <Link href="/" className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            ← 回首頁
          </Link>
        </div>

        <div className="max-w-md w-full bg-gray-900/90 border border-gray-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl font-black mx-auto mb-6 shadow-lg shadow-purple-500/30">
            📊
          </div>
          <h1 className="text-2xl md:text-3xl font-black mb-3 text-white">會員數據中心</h1>
          <p className="text-sm text-gray-400 mb-8">
            登入以查看您的團隊業績、專屬推廣碼與 25% 業務分潤
          </p>

          {/* 途徑 1：Web3 錢包登入 */}
          <div className="bg-gray-800/60 border border-gray-700/60 rounded-2xl p-5 mb-6 text-left">
            <h3 className="text-sm font-bold text-cyan-400 mb-2 flex items-center gap-2">
              <span>🔗</span> 選項一：Web3 錢包登入
            </h3>
            <p className="text-xs text-gray-400 mb-4">適用於以 MetaMask / 虛擬幣錢包付款之投資人</p>
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          </div>

          <div className="flex items-center gap-3 my-6 text-xs text-gray-500 uppercase tracking-widest">
            <div className="flex-1 h-px bg-gray-800"></div>
            <span>或使用 Email 登入</span>
            <div className="flex-1 h-px bg-gray-800"></div>
          </div>

          {/* 途徑 2：Email 免密碼登入 (信用卡/法幣/小白用戶) */}
          <form onSubmit={handleEmailLogin} className="bg-gray-800/60 border border-gray-700/60 rounded-2xl p-5 text-left">
            <h3 className="text-sm font-bold text-emerald-400 mb-2 flex items-center gap-2">
              <span>✉️</span> 選項二：信用卡 / 訪客 Email 登入
            </h3>
            <p className="text-xs text-gray-400 mb-4">輸入您當初刷卡填寫的 Email 即可免密碼直接登入</p>
            
            <input
              type="email"
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full mb-3 bg-black border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              required
            />

            {loginError && (
              <p className="text-xs text-red-400 mb-3">{loginError}</p>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
            >
              {isLoggingIn ? '正在登入中...' : '登入查看數據與推廣碼 🚀'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ========================================================
  // 已登入狀態：顯示會員中心儀表板
  // ========================================================
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-12 relative">
      <div className="absolute top-4 right-4 md:top-8 md:right-8 flex items-center gap-4">
        {activeEmail && (
          <button
            onClick={handleLogout}
            className="text-xs px-3 py-1.5 border border-gray-700 rounded-lg hover:bg-gray-800 text-gray-400 transition-colors"
          >
            登出 Email
          </button>
        )}
        <LanguageSwitcher />
      </div>

      <div className="max-w-5xl mx-auto pt-16 md:pt-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-gray-800 gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-wide">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                {t.dashHeader}
              </span>
            </h1>
            <p className="text-sm text-gray-400 mt-2 flex items-center gap-2">
              {activeEmail ? (
                <>
                  <span className="text-emerald-400 font-semibold">📧 {activeEmail}</span>
                  <span className="text-gray-600">|</span>
                  <span>虛擬帳號: {activeAddress.substring(0, 6)}...{activeAddress.substring(38)}</span>
                </>
              ) : (
                <>
                  <span>錢包地址: {activeAddress.substring(0, 6)}...{activeAddress.substring(38)}</span>
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              href="/redeem" 
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl text-sm font-bold transition-all shadow-md"
            >
              🎟️ 前往 VIP 兌換專區
            </Link>
            <Link 
              href="/" 
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-sm text-gray-300 transition-all"
            >
              回首頁
            </Link>
          </div>
        </div>
        
        {/* 財務數據區塊 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-lg">
            <h3 className="text-gray-400 mb-2 font-medium">{t.dashPendingBonus}</h3>
            <p className="text-5xl font-black text-green-400">${stats.pendingCommission.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-2">{t.dashPayoutDate}</p>
          </div>
          
          <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-lg">
            <h3 className="text-gray-400 mb-2 font-medium">{t.dashTeamSales}</h3>
            <p className="text-5xl font-black text-blue-400">${stats.totalSales.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-2">{t.dashIncludesTeam}</p>
          </div>
          
          <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-lg">
            <h3 className="text-gray-400 mb-2 font-medium">{t.dashCurrentLevel}</h3>
            <p className="text-5xl font-black text-purple-400">
              {stats.totalSales >= 15000 ? '10%' : stats.totalSales >= 6000 ? '6%' : stats.totalSales >= 600 ? '3%' : '0%'}
            </p>
            <p className="text-sm text-gray-500 mt-2">{t.dashNextLevel}</p>
          </div>
        </div>

        {/* 專屬推廣工具區塊 */}
        <div className="bg-gray-800 p-6 md:p-10 rounded-2xl border border-purple-900/50 shadow-[0_0_30px_rgba(147,51,234,0.15)] mb-12">
          <h2 className="text-xl md:text-3xl font-bold mb-4">{t.dashLinkTitle}</h2>
          <p className="text-gray-400 mb-6 text-sm md:text-lg">
            {t.dashLinkDesc}
          </p>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <input 
              type="text" 
              readOnly 
              value={referralLink} 
              className="flex-1 bg-gray-900 border border-gray-600 rounded-xl px-4 md:px-6 py-4 text-white text-base md:text-lg focus:outline-none focus:border-purple-500 transition-colors"
            />
            <button 
              onClick={() => {
                navigator.clipboard.writeText(referralLink);
                alert(t.dashCopied);
              }}
              className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-xl text-lg md:text-xl font-bold transition-all shadow-[0_0_20px_rgba(147,51,234,0.4)] cursor-pointer"
            >
              {t.dashCopyBtn}
            </button>
          </div>
          <p className="text-pink-400 mt-6 text-sm font-medium">
            ※ 推薦服務的三項回饋制度 - 含每個推薦團隊僅計算業績1萬美元/年
          </p>
        </div>

        {/* 獎金提領帳號設定 (給純 Email 用戶綁定錢包收款) */}
        <div className="bg-gray-800 p-6 md:p-8 rounded-2xl border border-emerald-900/40 shadow-lg mb-12">
          <h3 className="text-lg md:text-xl font-bold text-emerald-400 mb-2 flex items-center gap-2">
            <span>💰</span> 獎金提領帳號設定 (Payout Account)
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            您累積的 25% 業務分潤將於每月結算。請填寫您的 Polygon (USDT) 錢包地址，結算後系統將自動撥款至此地址。
          </p>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={payoutWallet}
              onChange={(e) => setPayoutWallet(e.target.value)}
              placeholder="0x... (請輸入您的 Polygon USDT 收款地址)"
              className="flex-1 bg-black border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <button
              onClick={handleSavePayoutWallet}
              disabled={isSavingPayout || !payoutWallet}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-sm font-bold transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSavingPayout ? '儲存中...' : '綁定收款錢包'}
            </button>
          </div>
          {payoutSaveMsg && (
            <p className="text-xs text-emerald-400 mt-2">{payoutSaveMsg}</p>
          )}
        </div>

        {/* 萬商眾籌 NFT 合作規則 */}
        <div id="crowdfund-rules" className="bg-gray-800 p-6 md:p-10 rounded-2xl border border-pink-900/50 shadow-[0_0_30px_rgba(236,72,153,0.15)]">
          <h2 className="text-xl md:text-3xl font-bold mb-6 text-pink-500">萬商眾籌 NFT 合作規則與全球戰略</h2>
          <div className="text-gray-300 space-y-4 text-base md:text-lg leading-relaxed bg-gray-900/50 p-6 rounded-xl border border-gray-700">
            <p>
              凡眾籌方案 <span className="text-white font-bold">$1788 / $5400 / $12000</span> 的金額下，可無需再繳建置眾籌系統費用。
            </p>
            <p>
              但相關串接服務費依起初的眾籌金額當基礎，超過系統設計費需另行計算，且<strong className="text-pink-400">每月眾籌的系統服務費依銷售額 10% 來計費</strong>。
            </p>
          </div>
          <div className="mt-8 flex justify-center">
            <a 
              href="mailto:xyz007tw@gmail.com" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white rounded-xl text-lg font-bold transition-all shadow-[0_0_30px_rgba(236,72,153,0.5)] transform hover:scale-105"
            >
              ✉️ 請洽總工程師 / CALL CTO : xyz007tw@gmail.com
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
