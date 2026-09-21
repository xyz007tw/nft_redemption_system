export default function UsersPage() {
  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">會員與組織樹 (Users & Network)</h1>
      <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
        <h2 className="text-xl font-bold mb-4">節點投資人清單</h2>
        <p className="text-gray-400 mb-6">目前系統處於測試階段，推薦關係鏈與會員資料庫正在初始化中...</p>
        
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-gray-900 border-b border-gray-700">
            <tr>
              <th className="p-4">錢包地址</th>
              <th className="p-4">信箱</th>
              <th className="p-4">級別</th>
              <th className="p-4">直推人數</th>
              <th className="p-4">總業績 (USDT)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="p-8 text-center text-gray-500">
                暫無會員資料
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
