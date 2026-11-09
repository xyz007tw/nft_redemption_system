'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { getAdminHeaders } from '@/lib/adminClient';

interface AdvertiserRow {
  id: string;
  email: string;
  password_code: string;
  magic_token: string;
  plan_type: string;
  weight: number;
  total_donated_usd: number;
  expires_at: string;
  remaining_days: number;
  is_expired: boolean;
  status: 'ACTIVE' | 'PAUSED' | 'BANNED';
  brand_name: string;
  category: string;
  target_url: string;
  banner_url: string;
  headline: { tw: string; cn: string; en: string; ja: string };
  body: { tw: string; cn: string; en: string; ja: string };
  cta_text: { tw: string; cn: string; en: string; ja: string };
  impressions: number;
  clicks: number;
  created_at: string;
  updated_at: string;
  admin_notes?: Array<{ date: string; action: string; days_added: number; note: string }>;
}

export default function AdminAdsPage() {
  const [advertisers, setAdvertisers] = useState<AdvertiserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Quick create / add days form
  const [newEmail, setNewEmail] = useState('');
  const [newDays, setNewDays] = useState<number>(30);
  const [newPlanTier, setNewPlanTier] = useState<string>('SPARK_15');
  const [newNote, setNewNote] = useState('管理員後台手動開通 / 追加曝光天數');
  const [sendEmailFlag, setSendEmailFlag] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Per-row custom days input
  const [rowDaysMap, setRowDaysMap] = useState<Record<string, number>>({});

  const fetchAdvertisers = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/ads?mode=admin_list', {
        headers: getAdminHeaders(),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || '無法載入萬商廣告主清單');
      } else {
        setAdvertisers(data.advertisers || []);
      }
    } catch (err: any) {
      setErrorMsg(err.message || '連線錯誤');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdvertisers();
  }, [fetchAdvertisers]);

  const handleAdjustDays = async (email: string, days: number, note: string, sendWelcome = false, planTier?: string) => {
    setSubmitting(true);
    setMessage('');
    setErrorMsg('');
    try {
      const res = await fetch('/api/ads', {
        method: 'POST',
        headers: { ...getAdminHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'admin_adjust_days',
          email,
          days,
          plan_tier: planTier,
          note,
          send_welcome_email: sendWelcome,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || '調整天數失敗');
      } else {
        setMessage(data.message || `已成功為 ${email} 調整 ${days > 0 ? `+${days}` : days} 天曝光期！`);
        await fetchAdvertisers();
      }
    } catch (err: any) {
      setErrorMsg(err.message || '操作失敗');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (advId: string, status: 'ACTIVE' | 'PAUSED' | 'BANNED') => {
    setMessage('');
    setErrorMsg('');
    try {
      const res = await fetch('/api/ads', {
        method: 'POST',
        headers: { ...getAdminHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'admin_toggle_status',
          advertiser_id: advId,
          status,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || '狀態切換失敗');
      } else {
        setMessage(data.message || '狀態已更新並同步至 Cloudflare R2 全球節點');
        await fetchAdvertisers();
      }
    } catch (err: any) {
      setErrorMsg(err.message || '操作失敗');
    }
  };

  const filtered = advertisers.filter((a) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      a.email.toLowerCase().includes(q) ||
      (a.brand_name || '').toLowerCase().includes(q) ||
      (a.headline?.tw || '').toLowerCase().includes(q) ||
      (a.target_url || '').toLowerCase().includes(q)
    );
  });

  const activeCount = advertisers.filter((a) => a.status === 'ACTIVE' && !a.is_expired).length;
  const totalImpressions = advertisers.reduce((acc, a) => acc + (a.impressions || 0), 0);
  const totalClicks = advertisers.reduce((acc, a) => acc + (a.clicks || 0), 0);

  return (
    <div className="space-y-8 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-2">
            📢 萬商自助廣告協播系統 · 管理員總控台 (Supabase + Cloudflare R2 雙核同步)
          </div>
          <h1 className="text-3xl font-black">萬商廣告主管理 ＆ 曝光天數手動追加中心</h1>
          <p className="text-sm text-gray-400 mt-1">
            管理所有透過 <code className="text-amber-300">/sponsor</code> 斗內開通或管理員手動授權的廣告主，一鍵依「天數」精準追加/扣減曝光期，並自動發布至 Cloudflare R2 (<code className="text-cyan-300">1.5208.uk/ads/active_ads_pool.json</code>) 供本地端 AI Agent 與百站 WP 站群聯播。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="/ad-studio"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-bold transition"
          >
            🎨 前往客戶自助廣告後台 (/ad-studio) ↗
          </a>
          <a
            href="/api/ads?mode=agent_feed"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 text-xs font-bold transition"
          >
            📡 檢視 AI Agent 即時廣告池 JSON ↗
          </a>
          <button
            onClick={fetchAdvertisers}
            className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-xs font-bold transition"
          >
            🔄 重新整理
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-gray-800/80 border border-gray-700">
          <div className="text-xs text-gray-400">總註冊廣告主數</div>
          <div className="text-3xl font-black text-white mt-1">{advertisers.length} 家</div>
          <div className="text-[11px] text-gray-500 mt-1">含斗內自動開通與手動建檔</div>
        </div>
        <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30">
          <div className="text-xs text-emerald-300">目前生效聯播中 (ACTIVE)</div>
          <div className="text-3xl font-black text-emerald-400 mt-1">{activeCount} 家</div>
          <div className="text-[11px] text-emerald-300/70 mt-1">已同步至 Cloudflare R2 全球節點</div>
        </div>
        <div className="p-5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30">
          <div className="text-xs text-cyan-300">累計全網曝光次數 (Impressions)</div>
          <div className="text-3xl font-black text-cyan-400 mt-1">{totalImpressions.toLocaleString()}</div>
          <div className="text-[11px] text-cyan-300/70 mt-1">跨百站 WP 矩陣與長文內嵌</div>
        </div>
        <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-500/30">
          <div className="text-xs text-amber-300">累計導流點擊數 (Clicks)</div>
          <div className="text-3xl font-black text-amber-400 mt-1">{totalClicks.toLocaleString()}</div>
          <div className="text-[11px] text-amber-300/70 mt-1">直接導流至客戶設定之成交窗口</div>
        </div>
      </div>

      {/* Feedback Banner */}
      {message && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-sm font-bold flex items-center justify-between">
          <span>✅ {message}</span>
          <button onClick={() => setMessage('')} className="text-xs underline">關閉</button>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-sm font-bold flex items-center justify-between">
          <span>⚠️ {errorMsg}</span>
          <button onClick={() => setErrorMsg('')} className="text-xs underline">關閉</button>
        </div>
      )}

      {/* Manual Create / Add Days Form */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-950/30 via-gray-900 to-gray-900 border border-amber-500/30 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-black text-amber-300">
              ⚡ 免付款直接開通新廣告主 ／ 依 Email 手動追加曝光天數
            </h2>
            <p className="text-xs text-gray-400">
              輸入任一客戶信箱即可直接開通帳號（若已存在則自動疊加天數）。若原已到期會從「今天」起重新計算；若尚未到期則從「原到期日」直接往後順延！
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: '⚡ $15 星火 (+30天/1件/1x)', days: 30, tier: 'SPARK_15' },
              { label: '🔥 $120 常駐 (+365天/2件/3x)', days: 365, tier: 'RESIDENT_120' },
              { label: '🥇 $888 黃金 (+365天/5件/8x)', days: 365, tier: 'GOLD_888' },
              { label: '💎 $2700 皇家 (+365天/12件/20x)', days: 365, tier: 'ROYAL_2700' },
              { label: '👑 $6000 至尊 (+730天/30件/50x)', days: 730, tier: 'SUPREME_6000' },
            ].map((preset) => (
              <button
                key={preset.tier}
                type="button"
                onClick={() => {
                  setNewDays(preset.days);
                  setNewPlanTier(preset.tier);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                  newPlanTier === preset.tier && newDays === preset.days
                    ? 'bg-amber-500 text-black border-amber-400'
                    : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-amber-500/40'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-3">
            <label className="block text-xs text-gray-400 mb-1 font-bold">客戶登入信箱 (Email)</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="client@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-700 text-sm text-white focus:border-amber-400 outline-none"
            />
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs text-gray-400 mb-1 font-bold">指定 5 大廣告等級 (頻率/件數)</label>
            <select
              value={newPlanTier}
              onChange={(e) => setNewPlanTier(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-gray-950 border border-gray-700 text-xs text-amber-300 font-bold focus:border-amber-400 outline-none"
            >
              <option value="SPARK_15">⚡ $15 星火體驗 (1x · 日播60次 · 1件)</option>
              <option value="RESIDENT_120">🔥 $120 百站常駐 (3x · 日播180次 · 2件)</option>
              <option value="GOLD_888">🥇 $888 黃金聚客 (8x · 日播500次 · 5件)</option>
              <option value="ROYAL_2700">💎 $2,700 皇家霸屏 (20x · 日播1500次 · 12件)</option>
              <option value="SUPREME_6000">👑 $6,000 萬商至尊 (50x · 無限頂置 · 30件)</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-gray-400 mb-1 font-bold">追加/扣減天數 (可負數)</label>
            <input
              type="number"
              value={newDays}
              onChange={(e) => setNewDays(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-700 text-sm text-amber-300 font-bold focus:border-amber-400 outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-gray-400 mb-1 font-bold">管理員備註紀錄</label>
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="例：VIP合作夥伴贈送30天曝光"
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-700 text-sm text-white focus:border-amber-400 outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="button"
              disabled={submitting || !newEmail.includes('@') || !newDays}
              onClick={() => handleAdjustDays(newEmail.trim(), newDays, newNote, sendEmailFlag, newPlanTier)}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-sm disabled:opacity-40 transition"
            >
              {submitting ? '處理中...' : `🚀 立即執行 (${newDays > 0 ? `+${newDays}` : newDays}天)`}
            </button>
          </div>
        </div>

        <label className="inline-flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={sendEmailFlag}
            onChange={(e) => setSendEmailFlag(e.target.checked)}
            className="rounded border-gray-600"
          />
          同步寄發「萬商廣告系統帳號密碼 (`WX`通行碼) ＆ 一鍵免密登入連結」通知信給該客戶
        </label>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 搜尋信箱、品牌名稱、廣告標題或導流網址..."
          className="w-full sm:w-96 px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-sm text-white outline-none focus:border-amber-400"
        />
        <div className="text-xs text-gray-400">
          顯示 {filtered.length} / {advertisers.length} 筆廣告主紀錄
        </div>
      </div>

      {/* Advertiser Table */}
      <div className="rounded-2xl bg-gray-800/70 border border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm">載入萬商廣告主資料中...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">
            目前尚無符合條件的廣告主紀錄，可由上方表單直接輸入 Email 開通第一位廣告主！
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-900/90 text-gray-400 border-b border-gray-700">
                  <th className="p-3.5">廣告主帳號 / 通行密碼</th>
                  <th className="p-3.5">方案權重 / 累計贊助</th>
                  <th className="p-3.5">品牌與廣告內容預覽</th>
                  <th className="p-3.5">剩餘天數 / 到期日</th>
                  <th className="p-3.5">曝光 / 點擊</th>
                  <th className="p-3.5">狀態控制</th>
                  <th className="p-3.5">⚡ 一鍵追加曝光天數</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/60">
                {filtered.map((adv) => {
                  const customDays = rowDaysMap[adv.id] ?? 30;
                  const magicUrl = typeof window !== 'undefined'
                    ? `${window.location.origin}/ad-studio?token=${adv.magic_token}`
                    : `https://nft1314.party/ad-studio?token=${adv.magic_token}`;

                  return (
                    <tr key={adv.id} className="hover:bg-gray-800/90 transition">
                      {/* Column 1: Account & Password */}
                      <td className="p-3.5 align-top space-y-1">
                        <div className="font-bold text-white text-sm">{adv.email}</div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-gray-900 border border-gray-700 font-mono text-amber-300">
                            密碼: {adv.password_code}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(magicUrl);
                              setMessage(`已複製 ${adv.email} 的一鍵免密登入連結！`);
                            }}
                            className="px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/25"
                          >
                            📋 複製免密連結
                          </button>
                        </div>
                        <div className="text-[10px] text-gray-500 font-mono">{adv.id}</div>
                      </td>

                      {/* Column 2: Plan & Weight */}
                      <td className="p-3.5 align-top space-y-1">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                          adv.weight >= 3
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                        }`}>
                          {adv.plan_type} ({adv.weight}x 權重)
                        </span>
                        <div className="text-gray-300 font-mono">
                          累計斗內: <strong className="text-emerald-400">${adv.total_donated_usd || 0}</strong> USD
                        </div>
                      </td>

                      {/* Column 3: Ad Content */}
                      <td className="p-3.5 align-top max-w-xs space-y-1">
                        <div className="font-bold text-amber-200">
                          [{adv.category || '未分類'}] {adv.brand_name || '尚未填寫品牌'}
                        </div>
                        <div className="text-white font-semibold line-clamp-1">
                          {adv.headline?.tw || '(尚未設定廣告主標題)'}
                        </div>
                        <div className="text-gray-400 line-clamp-2 text-[11px]">
                          {adv.body?.tw || '(尚未設定廣告內文)'}
                        </div>
                        {adv.target_url && (
                          <a
                            href={adv.target_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-cyan-400 hover:underline block truncate text-[11px]"
                          >
                            🔗 {adv.target_url}
                          </a>
                        )}
                      </td>

                      {/* Column 4: Remaining Days & Expiry */}
                      <td className="p-3.5 align-top space-y-1">
                        <div className={`text-base font-black ${
                          adv.remaining_days > 14
                            ? 'text-emerald-400'
                            : adv.remaining_days > 0
                            ? 'text-amber-400'
                            : 'text-red-400'
                        }`}>
                          {adv.remaining_days > 0 ? `剩餘 ${adv.remaining_days} 天` : '已到期 (0 天)'}
                        </div>
                        <div className="text-[11px] text-gray-400 font-mono">
                          到期: {new Date(adv.expires_at).toLocaleDateString('zh-TW')}
                        </div>
                      </td>

                      {/* Column 5: Stats */}
                      <td className="p-3.5 align-top font-mono space-y-1">
                        <div className="text-cyan-300">👁️ {adv.impressions || 0} 曝光</div>
                        <div className="text-amber-300">👆 {adv.clicks || 0} 點擊</div>
                      </td>

                      {/* Column 6: Status */}
                      <td className="p-3.5 align-top space-y-1.5">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          adv.status === 'ACTIVE' && !adv.is_expired
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : adv.status === 'BANNED'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                            : 'bg-gray-700 text-gray-300'
                        }`}>
                          {adv.status === 'ACTIVE' && adv.is_expired ? 'EXPIRED (已過期)' : adv.status}
                        </span>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {adv.status !== 'ACTIVE' && (
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(adv.id, 'ACTIVE')}
                              className="px-2 py-0.5 rounded bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 text-[10px]"
                            >
                              啟用
                            </button>
                          )}
                          {adv.status !== 'PAUSED' && (
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(adv.id, 'PAUSED')}
                              className="px-2 py-0.5 rounded bg-gray-700 hover:bg-gray-600 text-gray-200 text-[10px]"
                            >
                              暫停
                            </button>
                          )}
                          {adv.status !== 'BANNED' && (
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(adv.id, 'BANNED')}
                              className="px-2 py-0.5 rounded bg-red-600/30 hover:bg-red-600/50 text-red-200 text-[10px]"
                            >
                              封鎖下架
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Column 7: Quick Add Days */}
                      <td className="p-3.5 align-top space-y-2 min-w-[230px]">
                        <div className="flex flex-wrap gap-1">
                          {[
                            { label: '+7天', days: 7 },
                            { label: '+30天', days: 30 },
                            { label: '+120天', days: 120 },
                            { label: '+365天', days: 365 },
                          ].map((btn) => (
                            <button
                              key={btn.days}
                              type="button"
                              disabled={submitting}
                              onClick={() =>
                                handleAdjustDays(
                                  adv.email,
                                  btn.days,
                                  `管理員快捷追加 ${btn.label}`,
                                  false
                                )
                              }
                              className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/40 border border-amber-500/40 text-amber-200 font-bold text-[11px] transition"
                            >
                              {btn.label}
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={customDays}
                            onChange={(e) =>
                              setRowDaysMap((prev) => ({
                                ...prev,
                                [adv.id]: Number(e.target.value),
                              }))
                            }
                            className="w-20 px-2 py-1 rounded bg-gray-900 border border-gray-700 text-white font-mono text-xs"
                          />
                          <button
                            type="button"
                            disabled={submitting || !customDays}
                            onClick={() =>
                              handleAdjustDays(
                                adv.email,
                                customDays,
                                `管理員自訂調整 ${customDays} 天`,
                                false
                              )
                            }
                            className="px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-500/40 text-cyan-200 font-bold text-[11px]"
                          >
                            套用天數
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
