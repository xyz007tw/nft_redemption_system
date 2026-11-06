'use client';

import { useEffect, useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { saveAdminToken, saveAdminKey, clearAdminAuth } from '@/lib/adminClient';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key'
);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const { signMessageAsync } = useSignMessage();

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [isCheckingSession, setIsCheckingSession] = useState<boolean>(true);
  const [isAuthorizing, setIsAuthorizing] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [inputKey, setInputKey] = useState<string>('');

  useEffect(() => {
    async function checkAdmin() {
      if (!isConnected || !address) {
        setIsAdmin(null);
        setIsSessionActive(false);
        setIsCheckingSession(false);
        return;
      }

      // God Mode for Deployer Wallet
      if (address.toLowerCase() === '0xea693e358f1527f8aa6563c9f6ebd42e37ee14fc') {
        setIsAdmin(true);
        setRole('superadmin');
      } else {
        const { data, error } = await supabase
          .from('admin_users')
          .select('role')
          .eq('wallet_address', address.toLowerCase())
          .maybeSingle();

        if (data && !error) {
          setIsAdmin(true);
          setRole(data.role);
        } else {
          setIsAdmin(false);
          setIsCheckingSession(false);
          return;
        }
      }

      // 檢查現行管理員 API Session 狀態
      try {
        const res = await fetch('/api/admin/auth');
        if (res.ok) {
          const resData = await res.json();
          if (resData.authenticated) {
            setIsSessionActive(true);
          }
        }
      } catch (err) {
        console.warn('Session check failed:', err);
      } finally {
        setIsCheckingSession(false);
      }
    }

    checkAdmin();
  }, [address, isConnected]);

  // 1. Web3 錢包一鍵簽章授權
  const handleSignAuth = async () => {
    if (!address) return;
    setIsAuthorizing(true);
    setAuthError(null);
    try {
      const timestamp = Date.now().toString();
      const message = `Weixiang Admin Auth: ${address.toLowerCase()} at ${timestamp}`;
      const signature = await signMessageAsync({ message });

      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          signature,
          timestamp
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || '簽名驗證授權失敗');
      }

      if (data.token) {
        saveAdminToken(data.token);
      }
      setIsSessionActive(true);
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || '授權簽名失敗，請重試');
    } finally {
      setIsAuthorizing(false);
    }
  };

  // 2. 密鑰驗證途徑
  const handleKeyAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) return;
    setIsAuthorizing(true);
    setAuthError(null);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminKey: inputKey.trim() })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || '管理員密鑰錯誤');
      }
      if (data.token) {
        saveAdminToken(data.token);
      }
      saveAdminKey(inputKey.trim());
      setIsSessionActive(true);
    } catch (err: any) {
      setAuthError(err.message || '金鑰驗證失敗');
    } finally {
      setIsAuthorizing(false);
    }
  };

  // 3. 登出
  const handleLogout = async () => {
    clearAdminAuth();
    await fetch('/api/admin/auth', { method: 'DELETE' }).catch(() => {});
    setIsSessionActive(false);
  };

  if (isAdmin === null) {
    if (!isConnected) {
      return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white px-4">
          <div className="max-w-md w-full bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-2xl text-center">
            <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
              🛡️
            </div>
            <h1 className="text-2xl font-black mb-2">微享 AI 自動來客系統</h1>
            <p className="text-sm text-gray-400 mb-6">請先連接授權錢包以驗證管理員身分</p>
            <div className="flex justify-center mb-6">
              <ConnectButton />
            </div>
            <button
              onClick={() => router.push('/')}
              className="text-xs text-gray-500 hover:text-gray-300 underline"
            >
              ← 返回前台首頁
            </button>
          </div>
        </div>
      );
    }
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white font-medium">驗證權限中...</div>;
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white px-4">
        <div className="max-w-md w-full bg-red-950/30 border border-red-500/40 p-8 rounded-2xl shadow-2xl text-center">
          <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
            🚫
          </div>
          <h1 className="text-2xl font-bold text-red-400 mb-2">存取被拒 (403 Access Denied)</h1>
          <p className="text-sm text-gray-300 mb-6">
            您的錢包地址 <code className="text-xs bg-black/40 px-2 py-1 rounded text-red-300">{address}</code> 不在管理員白名單內。
          </p>
          <div className="flex justify-center mb-6">
            <ConnectButton />
          </div>
          <button
            onClick={() => router.push('/')}
            className="w-full py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-medium transition"
          >
            回首頁
          </button>
        </div>
      </div>
    );
  }

  // 錢包已列白名單，但尚未啟動 Session 授權憑證
  if (!isSessionActive && !isCheckingSession) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white px-4">
        <div className="max-w-lg w-full bg-gray-800 border border-blue-500/30 rounded-2xl shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🔐</span>
            <div>
              <h2 className="text-xl font-bold text-white">管理員安全鑑權授權</h2>
              <p className="text-xs text-blue-400">已識別身分：{role === 'superadmin' ? '👑 最高架構師 (Deployer)' : `管理員 (${role})`}</p>
            </div>
          </div>

          <p className="text-sm text-gray-300 mb-6 leading-relaxed">
            系統已全面啟用「後端 API 鑑權與防重複入帳鎖」，防止未授權調用。請點擊下方按鈕以錢包快速簽署（無需 Gas 費用），建立 7 天安全操作階段。
          </p>

          {authError && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
              ⚠️ {authError}
            </div>
          )}

          <button
            onClick={handleSignAuth}
            disabled={isAuthorizing}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isAuthorizing ? '正在簽署驗證中...' : '✍️ 點擊簽署以啟用管理員權限 (1-Click Sign)'}
          </button>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-700" /></div>
            <span className="relative bg-gray-800 px-3 text-xs text-gray-500">或輸入管理密鑰驗證</span>
          </div>

          <form onSubmit={handleKeyAuth} className="space-y-3">
            <input
              type="password"
              placeholder="輸入 Admin Passkey / 密鑰"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-white placeholder-gray-500"
            />
            <button
              type="submit"
              disabled={isAuthorizing || !inputKey.trim()}
              className="w-full py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs font-semibold rounded-xl transition disabled:opacity-40"
            >
              以金鑰進入
            </button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => router.push('/')} className="text-xs text-gray-500 hover:text-gray-300 underline">
              ← 返回前台
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      {/* 側邊導覽列 */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            全自動來客系統
          </h2>
          <p className="text-xs text-gray-500 mt-2">Web3 管理後台</p>
          <div className="mt-4 flex items-center justify-between">
            <div className="px-3 py-1 bg-gray-700/80 rounded text-xs inline-flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {role}
            </div>
            <button
              onClick={handleLogout}
              title="登出安全工作階段"
              className="text-[11px] text-gray-400 hover:text-red-400 transition"
            >
              🚪 登出
            </button>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="block px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors">
            📊 營運總覽
          </Link>
          <Link href="/admin/users" className="block px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors">
            👥 會員與組織樹
          </Link>
          {role !== 'support' && (
            <Link href="/admin/finance" className="block px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors">
              💰 財務撥款
            </Link>
          )}
          {role === 'superadmin' && (
            <Link href="/admin/nft" className="block px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors">
              📦 NFT 智能合約
            </Link>
          )}
          <Link href="/admin/franchise" className="block px-4 py-3 rounded-lg bg-pink-500/10 border border-pink-500/30 text-pink-300 hover:bg-pink-500/20 transition-colors font-bold">
            📚 電子書書審與加盟商
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-700 text-xs text-gray-500 text-center font-mono">
          Wallet: {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
        </div>
      </aside>

      {/* 主內容區 */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
