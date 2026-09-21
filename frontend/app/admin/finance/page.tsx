export default function FinancePage() {
  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">財務撥款 (Finance)</h1>
      <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
        <h2 className="text-xl font-bold mb-4">待撥款清單</h2>
        <p className="text-gray-400 mb-6">目前系統處於測試階段，獎金結算與撥款記錄功能正在與區塊鏈同步中...</p>
        
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-gray-900 border-b border-gray-700">
            <tr>
              <th className="p-4">申請日期</th>
              <th className="p-4">投資人地址</th>
              <th className="p-4">獎金金額 (USDT)</th>
              <th className="p-4">狀態</th>
              <th className="p-4">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="p-8 text-center text-gray-500">
                暫無待處理的撥款記錄
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
