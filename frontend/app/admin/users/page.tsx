'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function UsersPage() {
  const [timeFilter, setTimeFilter] = useState('ALL'); // 'ALL', 'MONTHLY', 'YEARLY'
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    // 這裡實作抓取會員資料與業績的邏輯
    // 目前使用模擬資料，實務上需透過 API Join sales_records 或依賴 Database View 計算每月/每年的業績
    setUsers([
      { wallet: '0xea69...4380', email: 'admin@wei.xiang', tier: '10%', directs: 12, crowdfund_sales: 15600, sponsor_sales: 2400 },
      { wallet: '0x1234...abcd', email: 'user1@test.com', tier: '6%', directs: 5, crowdfund_sales: 8500, sponsor_sales: 1200 },
      { wallet: '0x5678...ef01', email: 'user2@test.com', tier: '3%', directs: 2, crowdfund_sales: 1200, sponsor_sales: 0 },
    ]);
  }, [timeFilter]);

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">會員與組織推廣業績 (Network & Sales)</h1>
      <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-emerald-400">推廣會員業績報表</h2>
            <p className="text-gray-400 text-sm mt-1">※ 斗內贊助雖不計入 25% 推廣分潤機制，但業績仍列入此處供管理員查核。</p>
          </div>
          
          <select 
            className="bg-gray-900 border border-gray-600 text-white rounded-lg px-4 py-2"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <option value="ALL">歷史累計總業績</option>
            <option value="YEARLY">本年度推廣業績</option>
            <option value="MONTHLY">本月份推廣業績</option>
          </select>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-gray-900 border-b border-gray-700">
              <tr>
                <th className="p-4">錢包地址</th>
                <th className="p-4">信箱</th>
                <th className="p-4">級別</th>
                <th className="p-4">直推人數</th>
                <th className="p-4 text-blue-400 font-bold">眾籌推廣業績 (USDT)</th>
                <th className="p-4 text-pink-400 font-bold">斗內贊助業績 (USDT)</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr key={idx} className="border-b border-gray-700/50 hover:bg-gray-750">
                  <td className="p-4 font-mono">{u.wallet}</td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${u.tier === '10%' ? 'bg-purple-900 text-purple-300' : 'bg-gray-700'}`}>{u.tier}</span>
                  </td>
                  <td className="p-4">{u.directs}</td>
                  <td className="p-4 text-blue-300 font-mono">${u.crowdfund_sales}</td>
                  <td className="p-4 text-pink-300 font-mono">${u.sponsor_sales}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
