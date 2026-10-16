'use client';

import { useState, useEffect } from 'react';
import { useWriteContract, useAccount } from 'wagmi';
import { WEIXIANG_NFT_ABI, WEIXIANG_NFT_ADDRESS } from '@/lib/contractAbi';
import { parseUnits } from 'viem';

export default function AdminNFTPage() {
  const { isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();
  
  const [packages, setPackages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New package form state
  const [newPkgId, setNewPkgId] = useState('');
  const [newNameZh, setNewNameZh] = useState('');
  const [newNameEn, setNewNameEn] = useState('');
  const [newAmount, setNewAmount] = useState('1');
  const [newPrice, setNewPrice] = useState('');
  const [newDiscount, setNewDiscount] = useState('');
  const [newProductType, setNewProductType] = useState('NFT_REDEEM');
  const [newCourseLink, setNewCourseLink] = useState('');

  const fetchPackages = async () => {
    try {
      const res = await fetch('/api/admin/packages');
      const data = await res.json();
      if (data.success) {
        setPackages(data.packages);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleSaveFrontend = async (pkgId: number | string, isNew = false) => {
    try {
      let payload;
      if (isNew) {
        payload = {
          id: newPkgId,
          name_zh: newNameZh,
          name_en: newNameEn || newNameZh,
          amount: newAmount,
          price: newPrice,
          discount_text: newDiscount,
          product_type: newProductType,
          course_link: newCourseLink || null
        };
      } else {
        const pkg = packages.find(p => p.id === pkgId);
        payload = pkg;
      }

      const res = await fetch('/api/admin/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (data.success) {
        alert("資料庫更新成功！前台與自動發信連結已同步生效！");
        fetchPackages();
        if (isNew) {
          setNewPkgId('');
          setNewNameZh('');
          setNewNameEn('');
          setNewPrice('');
          setNewDiscount('');
          setNewCourseLink('');
        }
      } else {
        alert("更新失敗: " + data.error);
      }
    } catch (e: any) {
      alert("系統異常: " + e.message);
    }
  };

  const handleUpdateSmartContract = async (pkg: any) => {
    if (!pkg.price) return alert("沒有價格");
    const priceInWei = parseUnits(pkg.price.toString(), 6);
    
    writeContract({
      address: WEIXIANG_NFT_ADDRESS as `0x${string}`,
      abi: WEIXIANG_NFT_ABI,
      functionName: 'setPackage',
      args: [BigInt(pkg.id), BigInt(1), BigInt(pkg.amount), priceInWei, true],
    }, {
      onSuccess: () => alert("已送出至區塊鏈！"),
      onError: (err) => alert("失敗: " + (err.message || "未知錯誤"))
    });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">NFT 與 AI 頂配家教課程管理中心</h1>
      <p className="text-gray-400 mb-8">
        此區塊可讓您隨時新增或修改「一般節點眾籌」、「🎓 AI 頂配家教課程 (含自動下載與電郵轉發連結)」或「創作者斗內贊助」。<br />
        <span className="text-emerald-400 font-semibold">💡 提示：一般眾籌與「直購家教課程 (DIRECT_COURSE)」皆會自動納入 25% 聯盟推廣分潤；僅「斗內贊助 (SPONSOR)」不計入分潤。</span>
      </p>

      {/* 新增方案表單 */}
      <div className="bg-gray-800 p-6 rounded-xl mb-8 border border-green-500/30">
        <h2 className="text-xl font-bold mb-4 text-green-400">➕ 新增眾籌項目 / AI 頂配家教課程</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input type="number" placeholder="方案 ID (例如: 6)" value={newPkgId} onChange={e => setNewPkgId(e.target.value)} className="bg-black border border-gray-700 rounded px-3 py-2 text-white" />
          <input type="text" placeholder="中文名稱 (課程或方案名)" value={newNameZh} onChange={e => setNewNameZh(e.target.value)} className="bg-black border border-gray-700 rounded px-3 py-2 text-white" />
          <input type="text" placeholder="英文名稱 (English Name)" value={newNameEn} onChange={e => setNewNameEn(e.target.value)} className="bg-black border border-gray-700 rounded px-3 py-2 text-white" />
          <input type="number" placeholder="發行數量 / 份數 (預設 1)" value={newAmount} onChange={e => setNewAmount(e.target.value)} className="bg-black border border-gray-700 rounded px-3 py-2 text-white" />
          <input type="number" placeholder="售價 (USDT)" value={newPrice} onChange={e => setNewPrice(e.target.value)} className="bg-black border border-gray-700 rounded px-3 py-2 text-white" />
          <input type="text" placeholder="折扣/亮點文字 (例如: 限時特惠)" value={newDiscount} onChange={e => setNewDiscount(e.target.value)} className="bg-black border border-gray-700 rounded px-3 py-2 text-white" />
          <select value={newProductType} onChange={e => setNewProductType(e.target.value)} className="bg-black border border-gray-700 rounded px-3 py-2 text-white font-semibold">
            <option value="NFT_REDEEM">一般節點眾籌 (享25%分潤)</option>
            <option value="DIRECT_COURSE">🎓 AI頂配家教課程 (享25%分潤+教材發貨)</option>
            <option value="SPONSOR">創作者贊助 (純斗內・無分潤)</option>
          </select>
          <input
            type="text"
            placeholder="📥 課程下載/觀看連結 (course_link，選填)"
            value={newCourseLink}
            onChange={e => setNewCourseLink(e.target.value)}
            className="bg-black border border-cyan-500/50 rounded px-3 py-2 text-cyan-200 placeholder-gray-500"
          />
        </div>
        <button onClick={() => handleSaveFrontend(0, true)} className="px-6 py-2.5 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-bold w-full md:w-auto cursor-pointer">
          ➕ 新增至前台資料庫
        </button>
      </div>

      {/* 現有方案列表 */}
      <div className="bg-gray-800 p-6 rounded-xl border border-purple-500/30 overflow-x-auto">
        <h2 className="text-xl font-bold mb-6 text-purple-400">📋 現有眾籌與家教課程列表（可隨時修改價格與教材連結）</h2>
        {isLoading ? (
          <p>載入中...</p>
        ) : (
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-900 border-b border-gray-700">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">中文名稱</th>
                <th className="p-3">英文名稱</th>
                <th className="p-3">數量</th>
                <th className="p-3">售價(USDT)</th>
                <th className="p-3">折扣/標籤</th>
                <th className="p-3">項目類型</th>
                <th className="p-3">📥 課程下載連結 (course_link)</th>
                <th className="p-3">資料庫 (UI)</th>
                <th className="p-3">區塊鏈 (Web3)</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg, idx) => (
                <tr key={pkg.id} className="border-b border-gray-800 hover:bg-gray-700/50">
                  <td className="p-3 font-bold">{pkg.id}</td>
                  <td className="p-3">
                    <input type="text" value={pkg.name_zh || ''} onChange={e => {
                      const newPkgs = [...packages];
                      newPkgs[idx].name_zh = e.target.value;
                      setPackages(newPkgs);
                    }} className="bg-black border border-gray-700 rounded px-2 py-1 w-32 text-white" />
                  </td>
                  <td className="p-3">
                    <input type="text" value={pkg.name_en || ''} onChange={e => {
                      const newPkgs = [...packages];
                      newPkgs[idx].name_en = e.target.value;
                      setPackages(newPkgs);
                    }} className="bg-black border border-gray-700 rounded px-2 py-1 w-32 text-gray-300" />
                  </td>
                  <td className="p-3">
                    <input type="number" value={pkg.amount} onChange={e => {
                      const newPkgs = [...packages];
                      newPkgs[idx].amount = e.target.value;
                      setPackages(newPkgs);
                    }} className="bg-black border border-gray-700 rounded px-2 py-1 w-16 text-white" />
                  </td>
                  <td className="p-3">
                    <input type="number" value={pkg.price} onChange={e => {
                      const newPkgs = [...packages];
                      newPkgs[idx].price = e.target.value;
                      setPackages(newPkgs);
                    }} className="bg-black border border-gray-700 rounded px-2 py-1 w-24 text-green-400 font-bold" />
                  </td>
                  <td className="p-3">
                    <input type="text" value={pkg.discount_text || ''} onChange={e => {
                      const newPkgs = [...packages];
                      newPkgs[idx].discount_text = e.target.value;
                      setPackages(newPkgs);
                    }} className="bg-black border border-gray-700 rounded px-2 py-1 w-24 text-white" />
                  </td>
                  <td className="p-3">
                    <select value={pkg.product_type || 'NFT_REDEEM'} onChange={e => {
                      const newPkgs = [...packages];
                      newPkgs[idx].product_type = e.target.value;
                      setPackages(newPkgs);
                    }} className="bg-black border border-gray-700 rounded px-2 py-1 text-xs text-white">
                      <option value="NFT_REDEEM">節點眾籌 (25%)</option>
                      <option value="DIRECT_COURSE">🎓 家教課程 (25%)</option>
                      <option value="SPONSOR">純斗內 (無分潤)</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <input
                      type="text"
                      placeholder="https://..."
                      value={pkg.course_link || ''}
                      onChange={e => {
                        const newPkgs = [...packages];
                        newPkgs[idx].course_link = e.target.value;
                        setPackages(newPkgs);
                      }}
                      className="bg-black border border-cyan-500/40 rounded px-2 py-1 w-44 text-cyan-300 text-xs"
                    />
                  </td>
                  <td className="p-3">
                    <button onClick={() => handleSaveFrontend(pkg.id)} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs whitespace-nowrap cursor-pointer">
                      儲存更新
                    </button>
                  </td>
                  <td className="p-3">
                    <button 
                      onClick={() => handleUpdateSmartContract(pkg)}
                      disabled={isPending || !isConnected}
                      className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-xs disabled:opacity-50 whitespace-nowrap cursor-pointer"
                    >
                      {isPending ? '交易中...' : '寫入合約'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
