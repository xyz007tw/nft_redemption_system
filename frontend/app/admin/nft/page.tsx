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
          discount_text: newDiscount
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
        alert("資料庫更新成功！");
        fetchPackages();
        if (isNew) {
          setNewPkgId(''); setNewNameZh(''); setNewNameEn(''); setNewPrice(''); setNewDiscount('');
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
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">NFT 產品項目管理 (萬商眾籌)</h1>
      <p className="text-gray-400 mb-8">
        此區塊可讓您無限制地「新增」或修改任何眾籌方案。請記得：先儲存至資料庫 (前台顯示)，再寫入區塊鏈 (智能合約結算)。
      </p>

      {/* 新增方案表單 */}
      <div className="bg-gray-800 p-6 rounded-xl mb-8 border border-green-500/30">
        <h2 className="text-xl font-bold mb-4 text-green-400">➕ 新增眾籌項目 (B2B/B2C)</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <input type="number" placeholder="方案 ID (例如: 6)" value={newPkgId} onChange={e => setNewPkgId(e.target.value)} className="bg-black border border-gray-700 rounded px-3 py-2 text-white" />
          <input type="text" placeholder="中文名稱 (B2B 產品名)" value={newNameZh} onChange={e => setNewNameZh(e.target.value)} className="bg-black border border-gray-700 rounded px-3 py-2 text-white" />
          <input type="text" placeholder="英文名稱" value={newNameEn} onChange={e => setNewNameEn(e.target.value)} className="bg-black border border-gray-700 rounded px-3 py-2 text-white" />
          <input type="number" placeholder="發行數量 (枚)" value={newAmount} onChange={e => setNewAmount(e.target.value)} className="bg-black border border-gray-700 rounded px-3 py-2 text-white" />
          <input type="number" placeholder="售價 (USDT)" value={newPrice} onChange={e => setNewPrice(e.target.value)} className="bg-black border border-gray-700 rounded px-3 py-2 text-white" />
          <input type="text" placeholder="折扣文字 (可留空)" value={newDiscount} onChange={e => setNewDiscount(e.target.value)} className="bg-black border border-gray-700 rounded px-3 py-2 text-white" />
        </div>
        <button onClick={() => handleSaveFrontend(0, true)} className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-bold w-full md:w-auto">
          新增至前台資料庫
        </button>
      </div>

      {/* 現有方案列表 */}
      <div className="bg-gray-800 p-6 rounded-xl border border-purple-500/30 overflow-x-auto">
        <h2 className="text-xl font-bold mb-6 text-purple-400">📋 現有眾籌項目列表</h2>
        {isLoading ? (
          <p>載入中...</p>
        ) : (
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-900 border-b border-gray-700">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">名稱</th>
                <th className="p-3">數量</th>
                <th className="p-3">售價(USDT)</th>
                <th className="p-3">折扣文字</th>
                <th className="p-3">資料庫 (UI)</th>
                <th className="p-3">區塊鏈 (Web3)</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg, idx) => (
                <tr key={pkg.id} className="border-b border-gray-800 hover:bg-gray-700/50">
                  <td className="p-3 font-bold">{pkg.id}</td>
                  <td className="p-3">
                    <input type="text" value={pkg.name_zh} onChange={e => {
                      const newPkgs = [...packages];
                      newPkgs[idx].name_zh = e.target.value;
                      setPackages(newPkgs);
                    }} className="bg-black border border-gray-700 rounded px-2 py-1 w-32" />
                  </td>
                  <td className="p-3">
                    <input type="number" value={pkg.amount} onChange={e => {
                      const newPkgs = [...packages];
                      newPkgs[idx].amount = e.target.value;
                      setPackages(newPkgs);
                    }} className="bg-black border border-gray-700 rounded px-2 py-1 w-16" />
                  </td>
                  <td className="p-3">
                    <input type="number" value={pkg.price} onChange={e => {
                      const newPkgs = [...packages];
                      newPkgs[idx].price = e.target.value;
                      setPackages(newPkgs);
                    }} className="bg-black border border-gray-700 rounded px-2 py-1 w-24 text-green-400 font-bold" />
                  </td>
                  <td className="p-3">
                    <input type="text" value={pkg.discount_text} onChange={e => {
                      const newPkgs = [...packages];
                      newPkgs[idx].discount_text = e.target.value;
                      setPackages(newPkgs);
                    }} className="bg-black border border-gray-700 rounded px-2 py-1 w-24" />
                  </td>
                  <td className="p-3">
                    <button onClick={() => handleSaveFrontend(pkg.id)} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs whitespace-nowrap">
                      儲存更新
                    </button>
                  </td>
                  <td className="p-3">
                    <button 
                      onClick={() => handleUpdateSmartContract(pkg)}
                      disabled={isPending || !isConnected}
                      className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-xs disabled:opacity-50 whitespace-nowrap"
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
