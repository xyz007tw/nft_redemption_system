'use client';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">📊 營運總覽</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-gray-400 text-sm mb-2">總營收 (USDT)</h3>
          <p className="text-4xl font-black text-green-400">$0.00</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-gray-400 text-sm mb-2">待撥款獎金 (USDT)</h3>
          <p className="text-4xl font-black text-yellow-400">$0.00</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-gray-400 text-sm mb-2">售出 NFT 憑證數</h3>
          <p className="text-4xl font-black text-blue-400">0 枚</p>
        </div>
      </div>
      
      <div className="mt-12 bg-gray-800 p-8 rounded-xl border border-gray-700">
        <h2 className="text-xl font-bold mb-4">系統公告</h2>
        <p className="text-gray-400">
          歡迎來到 Web3 全自動來客系統管理後台。目前系統處於測試階段，各項數據正在與區塊鏈節點同步中...
        </p>
      </div>
    </div>
  );
}
