'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface CustomServiceOrder {
  id: string;
  clientWallet: string;
  clientEmail: string;
  referrerCode: string;
  referrerWallet: string;
  serviceTitle: string;
  contractNote: string;
  amountUSDT: number;
  createdAt: string;
  status: string;
}

export default function UsersPage() {
  const [timeFilter, setTimeFilter] = useState('ALL'); // 'ALL', 'MONTHLY', 'YEARLY'
  const [users, setUsers] = useState<any[]>([]);
  const [customOrders, setCustomOrders] = useState<CustomServiceOrder[]>([]);

  // 客製化服務業績登錄表單狀態（諮詢 ➔ 簽訂協議與議價 ➔ 成品完成並收到尾款後指定客戶計入推廣業績）
  const [clientIdentifier, setClientIdentifier] = useState('');
  const [referrerCode, setReferrerCode] = useState('');
  const [serviceTitle, setServiceTitle] = useState('AI 影片導購 / 自動化系統客製化專案');
  const [contractNote, setContractNote] = useState('已完成需求諮詢、簽訂協議與議價，成品驗收完成並收齊尾款');
  const [amountUSDT, setAmountUSDT] = useState('');
  const [submittingCustom, setSubmittingCustom] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const calcTier = (sales: number) => {
    if (sales > 15000) return '10%';
    if (sales > 6000) return '6%';
    if (sales >= 600) return '3%';
    return '0%';
  };

  const loadUsersAndCustomOrders = async () => {
    try {
      const apiRes = await fetch('/api/admin/custom-service');
      const apiData = await apiRes.json();
      if (apiData.customServiceOrders) {
        setCustomOrders(apiData.customServiceOrders);
      }

      if (apiData.users && apiData.users.length > 0) {
        setUsers(apiData.users);
        return;
      }

      const { data } = await supabase
        .from('users')
        .select('*')
        .order('total_sales', { ascending: false });

      if (data && data.length > 0) {
        const mapped = data.map((u: any) => {
          const total = Number(u.total_sales || 0);
          const courseSales = Number(u.course_sales || 0);
          const customSales = Number(u.custom_service_sales || 0);
          const crowdfundSales =
            u.crowdfund_sales !== undefined
              ? Number(u.crowdfund_sales)
              : Math.max(0, total - courseSales - customSales);
          const sponsorSales = Number(u.sponsor_sales || 0);
          const effectiveSales = crowdfundSales + courseSales + customSales + sponsorSales;
          return {
            wallet_address: u.wallet_address,
            wallet: u.wallet_address
              ? `${u.wallet_address.substring(0, 6)}...${u.wallet_address.substring(u.wallet_address.length - 4)}`
              : '-',
            email: u.email || '-',
            tier: calcTier(effectiveSales),
            directs: u.direct_count || 0,
            crowdfund_sales: crowdfundSales,
            course_sales: courseSales,
            custom_service_sales: customSales,
            sponsor_sales: sponsorSales
          };
        });
        setUsers(mapped);
        return;
      }
    } catch (e) {
      console.error('Failed to fetch users, using default rows', e);
    }

    // 預設展示數據 (支援 ALL / YEARLY / MONTHLY 篩選檢視)
    const multiplier = timeFilter === 'MONTHLY' ? 0.25 : timeFilter === 'YEARLY' ? 0.8 : 1;
    setUsers([
      {
        wallet_address: '0xea693e358f1527f8aa6563c9f6ebd42e37ee14fc',
        wallet: '0xea69...14fc',
        email: 'admin@wei.xiang',
        tier: '10%',
        directs: 12,
        crowdfund_sales: Math.round(15600 * multiplier),
        course_sales: Math.round(3960 * multiplier),
        custom_service_sales: Math.round(3600 * multiplier),
        sponsor_sales: Math.round(2400 * multiplier)
      },
      {
        wallet_address: '0x1234567890abcdef1234567890abcdef1234abcd',
        wallet: '0x1234...abcd',
        email: 'user1@test.com',
        tier: '6%',
        directs: 5,
        crowdfund_sales: Math.round(8500 * multiplier),
        course_sales: Math.round(1485 * multiplier),
        custom_service_sales: Math.round(1200 * multiplier),
        sponsor_sales: Math.round(1200 * multiplier)
      },
      {
        wallet_address: '0x567890abcdef1234567890abcdef12345678ef01',
        wallet: '0x5678...ef01',
        email: 'user2@test.com',
        tier: '3%',
        directs: 2,
        crowdfund_sales: Math.round(1200 * multiplier),
        course_sales: Math.round(495 * multiplier),
        custom_service_sales: Math.round(600 * multiplier),
        sponsor_sales: 0
      }
    ]);
  };

  useEffect(() => {
    loadUsersAndCustomOrders();
  }, [timeFilter]);

  const handleAssignCustomServiceSales = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMsg(null);

    const numAmt = Number(amountUSDT);
    if (!clientIdentifier.trim()) {
      setSubmitMsg({ type: 'err', text: '⚠️ 請輸入或選擇要指定計入業績的「客戶 Email 或 0x 錢包地址」！' });
      return;
    }
    if (isNaN(numAmt) || numAmt <= 0) {
      setSubmitMsg({ type: 'err', text: '⚠️ 請輸入有效的客製化服務結案金額 (USDT > 0)！' });
      return;
    }

    setSubmittingCustom(true);
    try {
      const res = await fetch('/api/admin/custom-service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientIdentifier: clientIdentifier.trim(),
          referrerCode: referrerCode.trim(),
          serviceTitle: serviceTitle.trim(),
          contractNote: contractNote.trim(),
          amountUSDT: numAmt
        })
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || '登錄失敗');
      }

      if (data.customServiceOrders) {
        setCustomOrders(data.customServiceOrders);
      }

      // 同步更新前端表格展示
      const targetKey = clientIdentifier.trim().toLowerCase();
      setUsers((prev) => {
        const idx = prev.findIndex(
          (u) =>
            String(u.email || '').toLowerCase() === targetKey ||
            String(u.wallet_address || '').toLowerCase() === targetKey ||
            String(u.wallet || '').toLowerCase() === targetKey
        );
        if (idx >= 0) {
          const updated = [...prev];
          const item = { ...updated[idx] };
          item.custom_service_sales = Number(item.custom_service_sales || 0) + numAmt;
          const totalQualifying =
            Number(item.crowdfund_sales || 0) +
            Number(item.course_sales || 0) +
            Number(item.custom_service_sales || 0) +
            Number(item.sponsor_sales || 0);
          item.tier = calcTier(totalQualifying);
          updated[idx] = item;
          return updated;
        } else {
          const newTotal = numAmt;
          const shortW = data.record?.clientWallet
            ? `${data.record.clientWallet.substring(0, 6)}...${data.record.clientWallet.substring(data.record.clientWallet.length - 4)}`
            : targetKey;
          return [
            {
              wallet_address: data.record?.clientWallet || targetKey,
              wallet: shortW,
              email: targetKey.includes('@') ? targetKey : '-',
              tier: calcTier(newTotal),
              directs: 0,
              crowdfund_sales: 0,
              course_sales: 0,
              custom_service_sales: numAmt,
              sponsor_sales: 0
            },
            ...prev
          ];
        }
      });

      setSubmitMsg({
        type: 'ok',
        text: data.message
      });
      setAmountUSDT('');
    } catch (err: any) {
      setSubmitMsg({
        type: 'err',
        text: `❌ 登錄失敗：${err.message || '請稍後再試'}`
      });
    } finally {
      setSubmittingCustom(false);
    }
  };

  const totalCrowdfund = users.reduce((acc, u) => acc + Number(u.crowdfund_sales || 0), 0);
  const totalCourse = users.reduce((acc, u) => acc + Number(u.course_sales || 0), 0);
  const totalCustomService = users.reduce((acc, u) => acc + Number(u.custom_service_sales || 0), 0);
  const totalSponsor = users.reduce((acc, u) => acc + Number(u.sponsor_sales || 0), 0);

  return (
    <div className="text-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">會員與組織推廣業績 (Network & Sales)</h1>
          <p className="text-xs md:text-sm text-gray-400 mt-1">
            級差分潤等級區間：<span className="text-cyan-300 font-bold">&gt;$600 ~ $6,000 ➔ 3%</span> ｜{' '}
            <span className="text-blue-300 font-bold">&gt;$6,000 ~ $15,000 ➔ 6%</span> ｜{' '}
            <span className="text-purple-300 font-bold">&gt;$15,000 ➔ 10%</span>
          </p>
        </div>
      </div>

      {/* 四大業績總覽卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-gray-800/90 border border-blue-500/30 rounded-2xl p-5 shadow-lg">
          <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
            🚀 眾籌推廣業績 (納入 25% 分潤)
          </div>
          <div className="text-2xl md:text-3xl font-black font-mono text-white">
            ${totalCrowdfund.toLocaleString()} <span className="text-xs font-normal text-gray-400">USDT</span>
          </div>
        </div>

        <div className="bg-gray-800/90 border border-emerald-500/40 rounded-2xl p-5 shadow-[0_0_25px_rgba(16,185,129,0.12)]">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            🎓 AI教材推廣業績 (納入 25% 分潤)
          </div>
          <div className="text-2xl md:text-3xl font-black font-mono text-emerald-300">
            ${totalCourse.toLocaleString()} <span className="text-xs font-normal text-gray-400">USDT</span>
          </div>
        </div>

        <div className="bg-gray-800/90 border border-purple-500/40 rounded-2xl p-5 shadow-[0_0_25px_rgba(168,85,247,0.15)]">
          <div className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-1">
            🛠️ 客製化服務業績 (尾款結案納入 25% 分潤)
          </div>
          <div className="text-2xl md:text-3xl font-black font-mono text-purple-300">
            ${totalCustomService.toLocaleString()} <span className="text-xs font-normal text-gray-400">USDT</span>
          </div>
        </div>

        <div className="bg-gray-800/90 border border-pink-500/30 rounded-2xl p-5 shadow-lg">
          <div className="text-xs font-bold text-pink-400 uppercase tracking-wider mb-1">
            💖 斗內贊助業績 (僅計升等資格・不發佣金)
          </div>
          <div className="text-2xl md:text-3xl font-black font-mono text-pink-300">
            ${totalSponsor.toLocaleString()} <span className="text-xs font-normal text-gray-400">USDT</span>
          </div>
        </div>
      </div>

      {/* 🛠️ 新增區塊：客製化服務業績指定「客戶」算入「推廣業績」管理工作台 */}
      <div className="bg-gradient-to-br from-gray-800 via-gray-800/95 to-purple-950/30 border border-purple-500/40 rounded-2xl p-6 mb-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4 pb-4 border-b border-gray-700">
          <div>
            <h2 className="text-xl font-black text-purple-300 flex items-center gap-2">
              <span>🛠️</span> 「客製化服務」尾款結案 ➔ 指定「客戶」算入「推廣業績」工作台
            </h2>
            <p className="text-xs md:text-sm text-gray-300 mt-1 leading-relaxed">
              ※ 因客製化服務需先<strong className="text-amber-300">① 諮詢需求</strong> ➔{' '}
              <strong className="text-amber-300">② 簽定協議與議價</strong> ➔{' '}
              <strong className="text-emerald-300">③ 執行服務內容、成品完成並收到尾款後</strong>，由管理員於下方指定「客戶（Email 或錢包）」一鍵登錄計入「推廣業績」與 25% 聯盟分潤結算！
            </p>
          </div>
          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-purple-500/20 border border-purple-400/40 text-purple-200 whitespace-nowrap">
            成品驗收＆尾款入帳專用
          </span>
        </div>

        <form onSubmit={handleAssignCustomServiceSales} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-4">
            <label className="block text-xs font-bold text-gray-300 mb-1.5">
              1. 指定「客戶」帳號 (Email 或 0x 錢包地址) *
            </label>
            <input
              type="text"
              list="existing-client-list"
              value={clientIdentifier}
              onChange={(e) => setClientIdentifier(e.target.value)}
              placeholder="輸入客戶 Email 或 0x 錢包 (可下拉快選)"
              className="w-full bg-gray-900 border border-gray-600 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-purple-400 focus:outline-none"
              required
            />
            <datalist id="existing-client-list">
              {users.map((u, i) => (
                <option
                  key={i}
                  value={u.email && u.email !== '-' ? u.email : u.wallet_address || u.wallet}
                >
                  {u.email} ({u.wallet}) - 目前級差 {u.tier}
                </option>
              ))}
            </datalist>
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-gray-300 mb-1.5">
              2. 客製化服務專案名稱 *
            </label>
            <input
              type="text"
              value={serviceTitle}
              onChange={(e) => setServiceTitle(e.target.value)}
              placeholder="例：AI 影片導購系統企業客製版"
              className="w-full bg-gray-900 border border-gray-600 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-purple-400 focus:outline-none"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-300 mb-1.5">
              3. 收到尾款結算業績 (USDT) *
            </label>
            <input
              type="number"
              min="1"
              step="any"
              value={amountUSDT}
              onChange={(e) => setAmountUSDT(e.target.value)}
              placeholder="例: 1800"
              className="w-full bg-gray-900 border border-purple-500/60 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-amber-300 focus:border-purple-400 focus:outline-none"
              required
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-gray-400 mb-1.5">
              4. 推薦人代碼 (選填，未填自動溯源/頂階10%領袖)
            </label>
            <input
              type="text"
              value={referrerCode}
              onChange={(e) => setReferrerCode(e.target.value)}
              placeholder="留空則依既有綁定或頂階10%領袖"
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-gray-200 focus:border-purple-400 focus:outline-none"
            />
          </div>

          <div className="md:col-span-9">
            <label className="block text-xs font-bold text-gray-400 mb-1.5">
              5. 協議簽署、成品交付與尾款收訖備註
            </label>
            <input
              type="text"
              value={contractNote}
              onChange={(e) => setContractNote(e.target.value)}
              placeholder="例：協議編號 #2026-CS01，成品驗收完畢並收齊尾款"
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3.5 py-2.5 text-xs text-gray-300 focus:border-purple-400 focus:outline-none"
            />
          </div>

          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={submittingCustom}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-sm rounded-xl shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              {submittingCustom ? '正在入帳結算...' : '✅ 確認尾款收訖・計入推廣業績'}
            </button>
          </div>
        </form>

        {submitMsg && (
          <div
            className={`mt-4 p-3.5 rounded-xl text-xs md:text-sm font-bold border ${
              submitMsg.type === 'ok'
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                : 'bg-red-950/60 border-red-500/40 text-red-300'
            }`}
          >
            {submitMsg.text}
          </div>
        )}

        {/* 最近登錄之客製化服務結案紀錄 */}
        {customOrders.length > 0 && (
          <div className="mt-5 pt-4 border-t border-gray-700/70">
            <div className="text-xs font-bold text-purple-300 mb-2">
              📋 已核銷入帳之「客製化服務」推廣業績紀錄（共 {customOrders.length} 筆）
            </div>
            <div className="overflow-x-auto max-h-48 overflow-y-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-gray-900/90 text-gray-400">
                  <tr>
                    <th className="p-2.5">結案單號 / 時間</th>
                    <th className="p-2.5">指定客戶</th>
                    <th className="p-2.5">客製化專案名稱</th>
                    <th className="p-2.5">協議與尾款備註</th>
                    <th className="p-2.5 text-purple-300 font-bold">計入推廣業績 (USDT)</th>
                  </tr>
                </thead>
                <tbody>
                  {customOrders.map((ord) => (
                    <tr key={ord.id} className="border-b border-gray-700/40">
                      <td className="p-2.5 font-mono text-gray-400">
                        {ord.id}
                        <div className="text-[10px] text-gray-500">
                          {new Date(ord.createdAt).toLocaleString('zh-TW')}
                        </div>
                      </td>
                      <td className="p-2.5">
                        <div className="font-bold text-white">{ord.clientEmail}</div>
                        <div className="font-mono text-[11px] text-gray-400">{ord.clientWallet}</div>
                      </td>
                      <td className="p-2.5 font-bold text-purple-200">{ord.serviceTitle}</td>
                      <td className="p-2.5 text-gray-400">{ord.contractNote}</td>
                      <td className="p-2.5 font-mono font-black text-amber-300">
                        +${Number(ord.amountUSDT).toLocaleString()} USDT
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 會員業績報表 */}
      <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-emerald-400">推廣會員業績報表（四大獨立業績欄位）</h2>
            <p className="text-gray-400 text-xs md:text-sm mt-1">
              ※ 「眾籌推廣業績」、「🎓 AI教材推廣業績」與「🛠️ 客製化服務業績（尾款收訖）」皆全額計入 25% 聯盟推廣分潤（10%級差 + 10%對等 + 5%全球分紅）；「斗內贊助業績」僅併入買家本人級差升等資格，不發放推廣佣金。
            </p>
          </div>

          <select
            className="bg-gray-900 border border-gray-600 text-white rounded-lg px-4 py-2 font-semibold"
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
                <th className="p-4">級差級別</th>
                <th className="p-4">直推人數</th>
                <th className="p-4 text-blue-400 font-bold">眾籌推廣業績</th>
                <th className="p-4 text-emerald-400 font-bold">🎓 AI教材業績</th>
                <th className="p-4 text-purple-300 font-bold">🛠️ 客製化服務業績</th>
                <th className="p-4 text-pink-400 font-bold">斗內贊助業績</th>
                <th className="p-4 text-amber-400 font-bold">分潤有效推廣總業績</th>
                <th className="p-4 text-center">快速指定客製業績</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => {
                const customSales = Number(u.custom_service_sales || 0);
                const effectiveTotal =
                  Number(u.crowdfund_sales || 0) +
                  Number(u.course_sales || 0) +
                  customSales;
                return (
                  <tr key={idx} className="border-b border-gray-700/50 hover:bg-gray-750">
                    <td className="p-4 font-mono text-gray-200">{u.wallet}</td>
                    <td className="p-4 text-gray-300">{u.email}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded text-xs font-bold ${
                          u.tier === '10%'
                            ? 'bg-purple-900 text-purple-300 border border-purple-500/40'
                            : u.tier === '6%'
                            ? 'bg-blue-900/60 text-blue-300'
                            : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        {u.tier}
                      </span>
                    </td>
                    <td className="p-4">{u.directs}</td>
                    <td className="p-4 text-blue-300 font-mono font-bold">
                      ${Number(u.crowdfund_sales || 0).toLocaleString()}
                    </td>
                    <td className="p-4 text-emerald-300 font-mono font-bold">
                      ${Number(u.course_sales || 0).toLocaleString()}
                    </td>
                    <td className="p-4 text-purple-300 font-mono font-bold">
                      ${customSales.toLocaleString()}
                    </td>
                    <td className="p-4 text-pink-300 font-mono">
                      ${Number(u.sponsor_sales || 0).toLocaleString()}
                    </td>
                    <td className="p-4 text-amber-300 font-mono font-black">
                      ${effectiveTotal.toLocaleString()}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          const target = u.email && u.email !== '-' ? u.email : u.wallet_address || u.wallet;
                          setClientIdentifier(target);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600 border border-purple-500/50 text-xs text-purple-200 hover:text-white font-bold transition-all cursor-pointer"
                      >
                        🛠️ 指定此客戶
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
