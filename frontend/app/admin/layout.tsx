'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    async function checkAdmin() {
      if (!isConnected || !address) {
        setIsAdmin(false);
        return;
      }

      const { data, error } = await supabase
        .from('admin_users')
        .select('role')
        .eq('wallet_address', address)
        .single();

      if (data && !error) {
        setIsAdmin(true);
        setRole(data.role);
      } else {
        setIsAdmin(false);
      }
    }
    
    checkAdmin();
  }, [address, isConnected]);

  if (isAdmin === null) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">驗證權限中...</div>;
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
        <h1 className="text-3xl font-bold text-red-500 mb-4">存取被拒</h1>
        <p className="text-gray-400 mb-8">您的錢包地址不在管理員白名單內。</p>
        <button onClick={() => router.push('/')} className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700">
          回首頁
        </button>
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
          <div className="mt-4 px-3 py-1 bg-gray-700 rounded text-xs inline-block">
            身分: {role}
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
        </nav>
        <div className="p-4 border-t border-gray-700 text-xs text-gray-500 text-center">
          Wallet: {address?.substring(0, 6)}...{address?.substring(38)}
        </div>
      </aside>

      {/* 主內容區 */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
