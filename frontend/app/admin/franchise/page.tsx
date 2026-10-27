'use client';

import React, { useEffect, useState } from 'react';
import {
  EBookProject,
  FranchiseeProfile,
  GLOBAL_BANNED_BOOK_CATEGORIES,
  generateStandaloneEBookHTML
} from '@/lib/ebookEngine';

export default function AdminFranchiseReviewPage() {
  const [books, setBooks] = useState<EBookProject[]>([]);
  const [franchisees, setFranchisees] = useState<Record<string, FranchiseeProfile>>({});
  const [loading, setLoading] = useState(true);
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ebook');
      const data = await res.json();
      if (data.success && data.store) {
        setBooks(data.store.books || []);
        setFranchisees(data.store.franchisees || {});
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReviewDecision = async (
    bookId: string,
    decision: 'APPROVE' | 'RETURN_DRAFT' | 'REJECT_BANNED'
  ) => {
    if (decision === 'REJECT_BANNED') {
      const ok = window.confirm(
        '🚨【強制下架封號且不退費確認】\n確定判定此書違反《全球 10 大禁書條款》？\n執行後將立即下架該書、將該加盟商帳號設為 BANNED_NO_REFUND（歸零所有抵用金且一律不退費）！'
      );
      if (!ok) return;
    }

    const res = await fetch('/api/ebook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'admin_review_book',
        bookId,
        decision,
        reviewNote: reviewNotes[bookId] || ''
      })
    });
    const data = await res.json();
    if (data.success && data.store) {
      setBooks(data.store.books || []);
      setFranchisees(data.store.franchisees || {});
      alert(
        decision === 'APPROVE'
          ? '✅ 已核准上架！該電子書已公開於 /ebook-store 並納入 AI 自動來客廣告排程。'
          : decision === 'RETURN_DRAFT'
          ? '↩️ 已退回草稿請加盟商修正。'
          : '🚨 已執行禁書封號處分（不予退費）！'
      );
    }
  };

  const handleInspectBook = (book: EBookProject) => {
    const html = generateStandaloneEBookHTML(book, 'SUPER_ADMIN_AUDIT');
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  };

  // 管理員刪除單本電子書、處理「次年未續約 ($330)」下架、或徹底刪除整個加盟商與所有書籍
  const handleAdminDeleteOrExpire = async (
    targetType: 'DELETE_SINGLE_BOOK' | 'EXPIRE_UNRENEWED_FRANCHISEE' | 'PURGE_FRANCHISEE_ALL',
    bookId?: string,
    authorKey?: string
  ) => {
    const confirmMsg =
      targetType === 'DELETE_SINGLE_BOOK'
        ? '🗑️ 確定要從雲端資料庫「永久刪除這本電子書」嗎？刪除後不可復原！'
        : targetType === 'EXPIRE_UNRENEWED_FRANCHISEE'
        ? `⚠️ 確定將加盟商 [${authorKey}] 標記為「次年 ($330) 逾期未續約」？\n系統將自動停止其 AI 自動來客廣告、歸零抵用金，並將其名下所有電子書從書店下架！`
        : `🚨【徹底刪除確認】確定要將未續約加盟商 [${authorKey}] 及其名下「所有電子書」從雲端資料庫永久清除嗎？`;

    if (!window.confirm(confirmMsg)) return;

    const res = await fetch('/api/ebook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'admin_delete_or_expire',
        targetType,
        bookId,
        authorKey
      })
    });
    const data = await res.json();
    if (data.success && data.store) {
      setBooks(data.store.books || []);
      setFranchisees(data.store.franchisees || {});
      alert('✅ 管理員刪除 / 未續約下架操作已執行完畢！');
    }
  };

  const pendingBooks = books.filter(b => b.status === 'PENDING_REVIEW');

  return (
    <div className="space-y-8 text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black">📚 加盟商電子書「書審中心 (3~7天)」與配額總控台</h1>
          <p className="text-gray-400 text-sm mt-1">
            管理首年 $990（含3本書+AI廣告+100%倒抵）、第4本起 $330/本、次年 $330 維護續約，以及 3~7 天書審與 10 大禁書違規封號不退費處分。
          </p>
        </div>
        <button
          onClick={loadData}
          className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-600 text-sm font-bold cursor-pointer"
        >
          🔄 重新整理書審佇列
        </button>
      </div>

      {/* 頂部統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-amber-950/40 border border-amber-500/40 p-5 rounded-2xl">
          <div className="text-xs text-amber-300 font-bold">⏳ 待書審電子書 (承諾 3~7 天)</div>
          <div className="text-3xl font-black text-amber-400 mt-1">{pendingBooks.length} 本</div>
        </div>
        <div className="bg-emerald-950/40 border border-emerald-500/40 p-5 rounded-2xl">
          <div className="text-xs text-emerald-300 font-bold">✅ 已通過書審上架</div>
          <div className="text-3xl font-black text-emerald-400 mt-1">
            {books.filter(b => b.status === 'APPROVED_PUBLISHED').length} 本
          </div>
        </div>
        <div className="bg-red-950/40 border border-red-500/40 p-5 rounded-2xl">
          <div className="text-xs text-red-300 font-bold">🚨 違規禁書封鎖 (不退費)</div>
          <div className="text-3xl font-black text-red-400 mt-1">
            {books.filter(b => b.status === 'REJECTED_BANNED').length} 本
          </div>
        </div>
        <div className="bg-blue-950/40 border border-blue-500/40 p-5 rounded-2xl">
          <div className="text-xs text-blue-300 font-bold">👥 已開通加盟商數</div>
          <div className="text-3xl font-black text-blue-400 mt-1">{Object.keys(franchisees).length} 家</div>
        </div>
      </div>

      {/* 電子書書審佇列列表 */}
      <div className="bg-gray-800/80 border border-gray-700 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">⚖️ 全站加盟商電子書審核佇列 ({books.length} 本)</h2>
        {loading ? (
          <div className="text-gray-400 py-8 text-center">載入書審資料中...</div>
        ) : (
          <div className="space-y-4">
            {books.map(book => (
              <div
                key={book.id}
                className="p-5 rounded-2xl bg-gray-900 border border-gray-700 flex flex-col lg:flex-row justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black ${
                        book.status === 'PENDING_REVIEW'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50'
                          : book.status === 'APPROVED_PUBLISHED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50'
                          : book.status === 'REJECTED_BANNED'
                          ? 'bg-red-500/30 text-red-300 border border-red-400/50'
                          : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      {book.status === 'PENDING_REVIEW'
                        ? '⏳ 待總管理員書審 (3~7天)'
                        : book.status === 'APPROVED_PUBLISHED'
                        ? '✅ 書審通過・已公開上架'
                        : book.status === 'REJECTED_BANNED'
                        ? '🚨 違反禁書・已強制封號不退費'
                        : '📝 草稿未送審'}
                    </span>
                    <span className="text-xs text-gray-400">
                      作者：{book.author_name} ({book.author_email})
                    </span>
                    <span className="text-xs text-cyan-400">
                      單購：${book.price_single_usdt} ｜ 月訂：${book.price_monthly_sub_usdt}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white">
                    《{book.title_zh}》 <span className="text-sm font-normal text-gray-400">/ {book.title_en}</span>
                  </h3>
                  <p className="text-xs text-gray-300">
                    共 {book.chapters.length} 章 ｜ 導流網址：{book.author_cta_url}
                  </p>

                  <input
                    type="text"
                    placeholder="輸入書審評語或違規原因（加盟商將在 /studio 看到此備註）..."
                    value={reviewNotes[book.id] ?? (book.review_note || '')}
                    onChange={e => setReviewNotes({ ...reviewNotes, [book.id]: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-600 rounded-xl px-3.5 py-2 text-xs text-white mt-2"
                  />
                </div>

                {/* 管理員書審操作按鈕組 */}
                <div className="flex flex-col justify-center gap-2 shrink-0 min-w-[230px]">
                  <button
                    onClick={() => handleInspectBook(book)}
                    className="px-4 py-2 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-400 text-cyan-200 text-xs font-bold cursor-pointer"
                  >
                    👁️ 預覽全書內容與檢查 QR Code
                  </button>
                  <button
                    onClick={() => handleReviewDecision(book.id, 'APPROVE')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black cursor-pointer"
                  >
                    ✅ 核准通過書審 (立即上架+排入AI廣告)
                  </button>
                  <button
                    onClick={() => handleReviewDecision(book.id, 'RETURN_DRAFT')}
                    className="px-4 py-2 rounded-xl bg-amber-600/40 hover:bg-amber-600/60 border border-amber-400 text-amber-200 text-xs font-bold cursor-pointer"
                  >
                    ↩️ 退回草稿請作者修改
                  </button>
                  <button
                    onClick={() => handleReviewDecision(book.id, 'REJECT_BANNED')}
                    className="px-4 py-2 rounded-xl bg-red-600/40 hover:bg-red-600/70 border border-red-400 text-red-200 text-xs font-black cursor-pointer"
                  >
                    🚨 判定禁書違規 (強制封號・一律不退費)
                  </button>
                  <button
                    onClick={() => handleAdminDeleteOrExpire('DELETE_SINGLE_BOOK', book.id)}
                    className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-red-900/60 border border-gray-600 hover:border-red-500 text-gray-300 hover:text-red-200 text-xs font-bold cursor-pointer"
                  >
                    🗑️ 永久刪除此本電子書 (未續約/清理)
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 加盟商配額與 $990/$330 服務費倒抵水庫總覽 (含未續約一鍵下架與徹底刪除按鈕) */}
      <div className="bg-gray-800/80 border border-gray-700 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">💎 加盟商配額、$990/$330 倒抵金水庫 ＆ 次年未續約刪除管理</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400">
                <th className="p-3">加盟商識別 / 信箱</th>
                <th className="p-3">合約狀態 / 到期日</th>
                <th className="p-3">開發配額 (首年3本/加購$330)</th>
                <th className="p-3">10% 服務費倒抵金餘額</th>
                <th className="p-3">累積銷售額</th>
                <th className="p-3">AI 自來客廣告</th>
                <th className="p-3">次年未續約 / 刪除操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {Object.entries(franchisees).map(([key, pf]) => (
                <tr key={key}>
                  <td className="p-3 font-mono text-white">{pf.email || key}</td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold ${
                        pf.plan_status === 'BANNED_NO_REFUND'
                          ? 'bg-red-500/30 text-red-300'
                          : pf.plan_status === 'TRIAL'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {pf.plan_status === 'TRIAL' ? '⚠️ 未續約已下架' : pf.plan_status}
                    </span>
                    <div className="text-[11px] text-gray-400 mt-1">
                      到期：{pf.expires_at ? new Date(pf.expires_at).toLocaleDateString() : '-'}
                    </div>
                  </td>
                  <td className="p-3 font-bold">
                    {pf.book_created_count} / {pf.book_quota_total} 本
                  </td>
                  <td className="p-3 text-emerald-400 font-black">${pf.fee_credit_balance} USDT</td>
                  <td className="p-3 text-cyan-300 font-bold">${pf.total_sales_usdt} USDT</td>
                  <td className="p-3">{pf.ai_traffic_enabled ? '🔥 曝光中' : '🛑 已停止'}</td>
                  <td className="p-3 space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => handleAdminDeleteOrExpire('EXPIRE_UNRENEWED_FRANCHISEE', undefined, key)}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 border border-amber-400 text-amber-200 font-bold cursor-pointer"
                    >
                      ⚠️ 未續約：一鍵下架全書+停廣告
                    </button>
                    <button
                      onClick={() => handleAdminDeleteOrExpire('PURGE_FRANCHISEE_ALL', undefined, key)}
                      className="px-2.5 py-1.5 rounded-lg bg-red-600/30 hover:bg-red-600/60 border border-red-400 text-red-200 font-bold cursor-pointer"
                    >
                      🗑️ 徹底刪除加盟商與所有書
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 底部：全球 10 大禁書審核對照表 */}
      <div className="bg-red-950/30 border border-red-500/30 rounded-2xl p-6">
        <h3 className="text-base font-bold text-red-300 mb-3">
          📜 管理員書審標準對照：全球 10 大不可上架禁書種類（查獲即刻封號不退費）
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-300">
          {GLOBAL_BANNED_BOOK_CATEGORIES.map(c => (
            <div key={c.id}>
              <strong>{c.icon} {c.title_zh}：</strong> {c.desc_zh}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
