'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { createClient } from '@supabase/supabase-js';
import { useLanguage } from '@/lib/LanguageContext';
import { toDownloadLinkItems } from '@/lib/vipLinks';
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
  const [copiedLink, setCopiedLink] = useState(false);
  const [stats, setStats] = useState({ totalSales: 0, pendingCommission: 0 });
  const [payoutWallet, setPayoutWallet] = useState('');
  const [isSavingPayout, setIsSavingPayout] = useState(false);
  const [payoutSaveMsg, setPayoutSaveMsg] = useState('');

  // 萬商自助廣告協播會員狀態
  const [adMemberInfo, setAdMemberInfo] = useState<any | null>(null);

  // 已購 AI 頂配教材與 VIP 電子書解鎖狀態
  const [purchasedPackageId, setPurchasedPackageId] = useState<number | null>(null);
  const [courseDownloadLinks, setCourseDownloadLinks] = useState<{ label: string; url: string }[]>([]);
  const [forwardingCourse, setForwardingCourse] = useState(false);
  const [courseForwardMsg, setCourseForwardMsg] = useState<string | null>(null);
  const [unlockedEBooks, setUnlockedEBooks] = useState<any[]>([]);
  const [ebookSigs, setEbookSigs] = useState<Record<string, string>>({});
  const [effectiveUserEmail, setEffectiveUserEmail] = useState('');

  // 監聽 Web3 錢包連線狀態，或讀取本地 Email 登入紀錄 / 結帳跳轉參數 (?email=)
  useEffect(() => {
    if (isConnected && address) {
      setActiveAddress(address);
      setActiveEmail(null);
      return;
    }

    const sp = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const queryEmail = sp?.get('email')?.trim().toLowerCase() || '';
    const pkgParam = sp?.get('pkg')?.trim() || '';
    const savedEmail = localStorage.getItem('weixiang_user_email')?.trim().toLowerCase() || '';
    const savedAddress = localStorage.getItem('weixiang_user_address') || '';

    if (queryEmail) {
      setInputEmail(queryEmail);
      if (pkgParam && /^\d+$/.test(pkgParam)) {
        setCourseForwardMsg(`🎉 已偵測到教材方案 #${pkgParam} 結帳完成，正在載入您的專屬課程與下載中心...`);
      }
      if (savedEmail === queryEmail && savedAddress) {
        setActiveEmail(queryEmail);
        setActiveAddress(savedAddress);
        return;
      }
      (async () => {
        try {
          const { data: matchedUser } = await supabase
            .from('users')
            .select('wallet_address, email')
            .ilike('email', queryEmail)
            .maybeSingle();
          if (matchedUser?.wallet_address) {
            const resolved = (matchedUser.email || queryEmail).toLowerCase();
            localStorage.setItem('weixiang_user_email', resolved);
            localStorage.setItem('weixiang_user_address', matchedUser.wallet_address);
            setActiveEmail(resolved);
            setActiveAddress(matchedUser.wallet_address);
          } else {
            setActiveAddress(null);
            setActiveEmail(null);
          }
        } catch {
          setActiveAddress(null);
          setActiveEmail(null);
        }
      })();
      return;
    }

    if (savedEmail && savedAddress) {
      setActiveEmail(savedEmail);
      setActiveAddress(savedAddress);
    } else {
      setActiveAddress(null);
      setActiveEmail(null);
    }
  }, [isConnected, address]);

  // 載入會員數據 + 萬商廣告剩餘天數 + 已購教材/電子書權限
  useEffect(() => {
    if (activeAddress) {
      // 1. 產生該用戶專屬推廣連結 (取錢包前綴作 6 碼推廣碼)
      const code = activeAddress.substring(2, 8).toUpperCase();
      setTimeout(() => setReferralLink(`${window.location.origin}/?ref=${code}`), 0);

      // 2. 即時連線至 Supabase 撈取業績、獎金與教材開通資料
      const fetchStats = async () => {
        try {
          const { data: user } = await supabase
            .from('users')
            .select('total_sales, payout_wallet, email, has_purchased, last_purchased_package')
            .eq('wallet_address', activeAddress)
            .maybeSingle();
          
          if (user?.payout_wallet) {
            setPayoutWallet(user.payout_wallet);
          }

          setPurchasedPackageId(
            user?.has_purchased ? Number(user?.last_purchased_package || 100) : null
          );

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

          // 3. 查詢萬商自助廣告協播帳號與剩餘使用時間
          const queryEmail = (activeEmail || user?.email || '').trim().toLowerCase();
          setEffectiveUserEmail(queryEmail);

          const adRes = await fetch(
            `/api/ads?mode=member_status&email=${encodeURIComponent(queryEmail)}&wallet=${encodeURIComponent(activeAddress)}`
          );
          const adData = await adRes.json();
          if (adData.success && adData.has_account && adData.advertiser) {
            setAdMemberInfo(adData.advertiser);
          } else {
            setAdMemberInfo(null);
          }

          // 4. 查詢該信箱已購買解鎖的 VIP 電子書清單與 HMAC 簽章
          if (queryEmail) {
            const ebRes = await fetch(`/api/ebook?readerEmail=${encodeURIComponent(queryEmail)}`);
            const ebData = await ebRes.json();
            if (ebData?.success) {
              const unlockedIds: string[] = Array.isArray(ebData.unlockedBooks) ? ebData.unlockedBooks : [];
              const sigs: Record<string, string> =
                ebData.readerSigs && typeof ebData.readerSigs === 'object' ? ebData.readerSigs : {};
              const allBooks: any[] = Array.isArray(ebData.store?.books) ? ebData.store.books : [];
              setUnlockedEBooks(
                allBooks.filter(
                  b =>
                    b.status === 'APPROVED_PUBLISHED' &&
                    (unlockedIds.includes('ALL_VIP') || unlockedIds.includes(b.id))
                )
              );
              setEbookSigs(sigs);
            }
          } else {
            setUnlockedEBooks([]);
            setEbookSigs({});
          }
        } catch (err) {
          console.error('Fetch stats error:', err);
        }
      };
      fetchStats();
    }
  }, [activeAddress, activeEmail]);

  // 一鍵領取 4 語系已購教材簽章下載包並重發免密登入教學信
  const handleClaimCourseMaterials = async () => {
    const targetEmail = (effectiveUserEmail || inputEmail || '').trim().toLowerCase();
    if (!targetEmail || !targetEmail.includes('@')) {
      setCourseForwardMsg('⚠️ 請先輸入有效的接收信箱 Email。');
      return;
    }
    setForwardingCourse(true);
    setCourseForwardMsg(null);
    try {
      const res = await fetch('/api/course/forward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerEmail: effectiveUserEmail || undefined,
          walletAddress: activeAddress || undefined,
          targetEmail,
          packageId: purchasedPackageId || 100
        })
      });
      const data = await res.json();
      if (res.ok && data?.success) {
        const normalizedLinks = Array.isArray(data.downloadLinks)
          ? data.downloadLinks
          : toDownloadLinkItems(data.downloadLinks);
        setCourseDownloadLinks(normalizedLinks);
        setCourseForwardMsg(
          `✅ 已寄出教學開通通知至 ${targetEmail}，下方已為您產生簽章專屬教材下載連結！`
        );
      } else {
        setCourseForwardMsg(`⚠️ ${data?.error || '領取教材失敗，請確認購買紀錄或聯繫 CTO SEN (xyz007tw)'}`);
      }
    } catch {
      setCourseForwardMsg('❌ 領取連線異常，請稍後再試。');
    } finally {
      setForwardingCourse(false);
    }
  };

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
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0f] text-white px-4 pt-24 pb-28 md:p-6 relative">
        <div className="absolute top-6 right-4 md:top-8 md:right-8 z-20">
          <LanguageSwitcher />
        </div>
        <div className="absolute top-6 left-4 md:top-8 md:left-8 z-20">
          <Link href="/" className="text-lg md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            ← 回首頁
          </Link>
        </div>

        <div className="max-w-md w-full bg-gray-900/90 border border-gray-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl font-black mx-auto mb-6 shadow-lg shadow-purple-500/30">
            📊
          </div>
          <h1 className="text-2xl md:text-3xl font-black mb-3 text-white">會員數據中心</h1>
          <p className="text-sm text-gray-400 mb-8">
            登入以查看您的團隊業績、專屬推廣碼、25% 業務分潤與萬商廣告可用時間
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
            <p className="text-xs text-gray-400 mb-4">輸入您當初刷卡或斗內填寫的 Email 即可免密碼直接登入</p>
            
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
    <div className="min-h-screen bg-gray-900 text-white px-4 pt-6 pb-28 md:p-12 relative">
      <div className="absolute top-4 right-4 md:top-8 md:right-8 flex items-center gap-3 z-20">
        {activeEmail && (
          <button
            type="button"
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

          <div className="flex flex-wrap items-center gap-2.5">
            <Link 
              href="/ad-studio" 
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 rounded-xl text-sm font-black transition-all shadow-md"
            >
              📢 我的廣告小幫手 (/ad-studio)
            </Link>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
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
              {stats.totalSales > 15000 ? '10%' : stats.totalSales > 6000 ? '6%' : stats.totalSales >= 600 ? '3%' : '0%'}
            </p>
            <p className="text-sm text-gray-500 mt-2">{t.dashNextLevel}</p>
          </div>
        </div>

        {/* 🎓 我的已購 AI頂配教材 & VIP 電子書下載中心 */}
        <div className="bg-gradient-to-br from-emerald-950/40 via-gray-800 to-gray-900 p-6 md:p-8 rounded-2xl border-2 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.12)] mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black mb-2 border border-emerald-400/40">
                ⚡ 付費即下載 · 雙重授權學習中心
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white">
                🎓 我的已購 AI 頂配教材 ＆ VIP 電子書下載中心
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 mt-1">
                結帳成功後，您可在此直接領取 4 語系 AI 教材簽章下載連結、登入 AI 雲教室，或開啟已購 VIP 電子書防盜版閱讀與 PDF 匯出。
              </p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <a
                href="https://vip.5208.uk/dashboard/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-xs shadow-lg transition-all"
              >
                🏛️ 前往 AI 雲教室 (vip.5208.uk)
              </a>
              <Link
                href="/ebook-store"
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs transition-all"
              >
                📚 前往 VIP 書櫃
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 左欄：AI 頂配實戰教材 (100~110) */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-bold text-emerald-300">📘 AI 頂配實戰教材權益</h3>
                {purchasedPackageId !== null ? (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-500/40">
                    {purchasedPackageId === 100
                      ? '👑 #100 全套 10 冊旗艦權限'
                      : `✅ 已開通方案 #${purchasedPackageId}`}
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-gray-700/60 text-gray-300 text-xs font-bold">
                    尚未開通教材
                  </span>
                )}
              </div>

              {purchasedPackageId !== null ? (
                <>
                  {!effectiveUserEmail && (
                    <input
                      type="email"
                      value={inputEmail}
                      onChange={e => setInputEmail(e.target.value)}
                      placeholder="輸入接收教材下載包的 Email (name@example.com)"
                      className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  )}
                  <button
                    type="button"
                    onClick={handleClaimCourseMaterials}
                    disabled={forwardingCourse}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-white font-black text-xs shadow-lg cursor-pointer transition-all"
                  >
                    {forwardingCourse
                      ? '⏳ 正在產生簽章下載連結並寄信...'
                      : '📥 領取 4 語系電子書下載包 & 免密登入信'}
                  </button>

                  {courseForwardMsg && (
                    <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-xs text-emerald-200 leading-relaxed">
                      {courseForwardMsg}
                    </div>
                  )}

                  {courseDownloadLinks.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-white/10">
                      <div className="text-xs font-bold text-cyan-300">
                        ⬇️ 已授權專用即時下載連結（含簽章保護）：
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {courseDownloadLinks.map((item, idx) => (
                          <a
                            key={idx}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-200 font-bold text-xs flex items-center justify-between gap-2 transition-colors"
                          >
                            <span className="truncate">📄 {item.label}</span>
                            <span className="shrink-0">↗</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-xs text-gray-400 space-y-3">
                  <p>您目前帳號尚未查得 AI 頂配教材 (#100～#110) 購買紀錄；結帳完成後將自動在此顯示一鍵下載區。</p>
                  <Link
                    href="/#tutor-courses"
                    className="inline-block px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
                  >
                    前往選購 AI 頂配教材 →
                  </Link>
                </div>
              )}
            </div>

            {/* 右欄：已解鎖 VIP 電子書 (E-Book SaaS) */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-bold text-cyan-300">📖 已解鎖 VIP 電子書專櫃</h3>
                <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-black border border-cyan-500/40">
                  {unlockedEBooks.length} 本可讀
                </span>
              </div>

              {unlockedEBooks.length > 0 ? (
                <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                  {unlockedEBooks.map((book: any) => {
                    const sig = ebookSigs[book.id] || ebookSigs['ALL_VIP'] || '';
                    const emailQS = effectiveUserEmail ? `&email=${encodeURIComponent(effectiveUserEmail)}` : '';
                    const sigQS = sig ? `&sig=${encodeURIComponent(sig)}` : '';
                    const readerUrl = `/api/ebook/reader?book=${encodeURIComponent(book.id)}${emailQS}${sigQS}`;
                    return (
                      <div
                        key={book.id}
                        className="p-3.5 rounded-xl bg-gray-900/80 border border-cyan-500/30 space-y-2.5"
                      >
                        <div className="font-bold text-sm text-white">
                          {book.title_zh || book.title_en || book.id}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <a
                            href={readerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-colors"
                          >
                            📖 開啟閱讀器
                          </a>
                          <a
                            href={`${readerUrl}&print=1`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-colors"
                          >
                            🖨️ 匯出浮水印 PDF
                          </a>
                          <Link
                            href={`/ebook-store?book=${encodeURIComponent(book.id)}${emailQS}${sigQS}`}
                            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
                          >
                            📚 書櫃閱讀
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-xs text-gray-400 space-y-3">
                  <p>目前尚未查得此信箱 ({effectiveUserEmail || '未綁定 Email'}) 的 VIP 電子書購買紀錄。</p>
                  <Link
                    href="/ebook-store"
                    className="inline-block px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors"
                  >
                    前往微享全球 VIP 電子書櫃 →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 📢 萬商自助廣告協播系統 · 會員使用時間與續加專區 */}
        <div className="bg-gradient-to-br from-amber-950/40 via-gray-800 to-gray-900 p-6 md:p-8 rounded-2xl border-2 border-amber-500/40 shadow-[0_0_30px_rgba(251,191,36,0.12)] mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black mb-2 border border-amber-400/40">
                🤝 斗內一下、回您一把 · 萬商自助廣告協播中心
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white">
                📢 您的「萬商廣告小幫手」可用時間 ＆ 方案等級狀態
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 mt-1">
                凡於 <Link href="/sponsor" className="text-amber-300 underline font-bold">/sponsor 斗內專區</Link> 贊助，即可自動開通或直接累加延長您的全網廣告使用時間！當可用時間結束後，各 WP 站將自動停止輪播。
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 shrink-0">
              <Link
                href="/sponsor"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg"
              >
                ➕ 斗內加長可用時間 / 升級方案 ➔
              </Link>
              <Link
                href={adMemberInfo?.magic_studio_url || '/ad-studio'}
                className="px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-200 font-black text-xs sm:text-sm"
              >
                🛠️ 進入廣告設定工作台 (/ad-studio) ➔
              </Link>
            </div>
          </div>

          {adMemberInfo ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/10">
              <div className="bg-black/40 border border-white/10 rounded-xl p-4">
                <div className="text-xs text-gray-400">目前剩餘可用時間</div>
                <div className={`text-2xl font-black mt-1 ${adMemberInfo.remaining_days > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {adMemberInfo.remaining_days} 天
                </div>
                <div className="text-[11px] text-gray-400 mt-1">
                  到期日：{adMemberInfo.expires_at?.slice(0, 10)} {adMemberInfo.is_expired ? '（已到期停播）' : '（正常輪播中）'}
                </div>
              </div>

              <div className="bg-black/40 border border-white/10 rounded-xl p-4">
                <div className="text-xs text-gray-400">當前廣告等級 ＆ 頻率</div>
                <div className="text-sm font-black text-amber-300 mt-1">{adMemberInfo.tier_name_zh}</div>
                <div className="text-[11px] text-gray-300 mt-1">
                  {adMemberInfo.weight}x 優先權重 · 每站日播約 {adMemberInfo.daily_rotations_per_site} 次
                </div>
              </div>

              <div className="bg-black/40 border border-white/10 rounded-xl p-4">
                <div className="text-xs text-gray-400">可上架廣告件數額度</div>
                <div className="text-2xl font-black text-cyan-300 mt-1">
                  {adMemberInfo.active_slots_count} / {adMemberInfo.max_ad_slots} <span className="text-xs font-normal text-gray-400">件</span>
                </div>
                <div className="text-[11px] text-gray-400 mt-1">品牌：{adMemberInfo.brand_name}</div>
              </div>

              <div className="bg-black/40 border border-white/10 rounded-xl p-4">
                <div className="text-xs text-gray-400">累計全網曝光 ＆ 點擊</div>
                <div className="text-lg font-black text-white mt-1">
                  {adMemberInfo.impressions_count.toLocaleString()} 曝光 / {adMemberInfo.clicks_count.toLocaleString()} 點擊
                </div>
                <div className="text-[11px] text-emerald-300 mt-1">
                  累計斗內：${adMemberInfo.total_sponsored_usdt} USD (100%計入升等業績)
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm text-gray-300">
              <span>
                💡 您目前尚未開通萬商自助廣告席位（或使用不同信箱開通）。斗內滿 <strong>$15 USD 享 30 天</strong>、滿 <strong>$120 USD（買8送4）享整整 365 天</strong> 全網百站 AI 自動幫您打廣告！
              </span>
              <Link
                href="/sponsor"
                className="px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-400/50 text-amber-300 font-black whitespace-nowrap"
              >
                ⚡ 前往 $15 / $120 開通 ➔
              </Link>
            </div>
          )}
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
              type="button"
              onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
                  navigator.clipboard.writeText(referralLink).catch(() => {});
                }
                setCopiedLink(true);
                setTimeout(() => setCopiedLink(false), 3000);
              }}
              className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-xl text-lg md:text-xl font-bold transition-all shadow-[0_0_20px_rgba(147,51,234,0.4)] cursor-pointer"
            >
              {copiedLink ? `✓ ${t.dashCopied}` : t.dashCopyBtn}
            </button>
          </div>
          {copiedLink && (
            <p className="text-emerald-400 mt-3 text-sm font-bold">
              ✅ {t.dashCopied}
            </p>
          )}
          <p className="text-pink-400 mt-6 text-sm font-medium">
            ※ 推薦服務的三項回饋制度 - 含每個推薦團隊僅計算業績1萬美元/年
          </p>

          {/* 25% 聯盟推廣服務費三大機制與「非推廣者訪客下單自動綁定」說明 */}
          <div className="mt-6 p-5 rounded-xl bg-gray-900/80 border border-purple-500/30 space-y-2.5 text-xs md:text-sm text-gray-300 leading-relaxed">
            <div className="font-black text-purple-300 text-sm md:text-base flex items-center gap-2">
              <span>💎</span> 推廣服務費 25% 三大獎金分配與「非推廣者訪客」自動綁定機制
            </div>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              <li>
                <strong className="text-cyan-300">1. 無限代級差獎金（最高 10%）</strong>：依個人累積業績劃分等級區間：<strong className="text-white">&gt;$600 ~ $6,000 ➔ 3% 推廣級差</strong>、{' '}
                <strong className="text-white">&gt;$6,000 ~ $15,000 ➔ 6% 推廣級差</strong>、{' '}
                <strong className="text-white">&gt;$15,000 ➔ 10% 推廣級差</strong>，由下而上發放直推與差額獎金。
              </li>
              <li>
                <strong className="text-emerald-300">2. 對等獎金 100% 匹配（最高 10%）</strong>：被推薦人（下線）領取多少級差獎金，其直接推薦人（上線）即 100% 領取同等金額之對等獎金。
              </li>
              <li>
                <strong className="text-amber-300">3. 全球領袖永久均分（5%）</strong>：凡業績達最高階 10% (&gt;$15,000 USDT) 之全球領袖，每筆新訂單皆提撥 5% 永久均分全球分紅（純斗內贊助方案不計入分潤）。
              </li>
              <li>
                <strong className="text-pink-300">🔥 非推廣者的訪客（自然流量）下訂單分潤方式</strong>：當非透過推廣連結的自然流量訪客下訂單時，系統仍固定提撥 <strong className="text-white">25% 推廣服務費</strong>，並<strong className="text-yellow-300">由系統自動去綁定推廣最高的 10% 級差獎金、10% 對等獎金及永久 5% 均分全球分紅</strong>！
              </li>
              <li>
                <strong className="text-emerald-400">📈 自消費併入「級差分潤資格認定累積業績」＆ 客製化服務結案認列規則</strong>：所有微享 NFT 的數位產品、斗內贊助、眾籌、電子書加盟（$990/$450）、AI頂配教材與客製化服務等<strong className="text-white">「自消費」業績，皆可併入計算您的「級差分潤累積業績」來認定晉升等級（3% / 6% / 10%）</strong>；但自消費僅作為「升級資格認定」，不會對自己的消費發放 25% 推廣佣金（只有真正推廣他人成交才依認定等級計算佣金）。<br/>
                <span className="text-gray-400 text-xs">👉 實例：若您斗內 $3 ＋ 成為電子書加盟商 $990 ＝ 自消費累積 $993（落在 &gt;$600~$6,000 區間），即直接認定享有 <strong className="text-cyan-300">3% 推廣級差資格</strong>！另「客製化服務」於諮詢需求、簽定協議與議價、成品完成並收到尾款後，由管理員後台指定客戶正式計入推廣業績。</span>
              </li>
            </ul>
          </div>
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
