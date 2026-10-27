'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { EBookProject, generateStandaloneEBookHTML } from '@/lib/ebookEngine';
import PayUniButton from '@/components/PayUniButton';

export default function ReaderEBookStorePage() {
  const [books, setBooks] = useState<EBookProject[]>([]);
  const [selectedBook, setSelectedBook] = useState<EBookProject | null>(null);
  const [readerEmail, setReaderEmail] = useState('vip_reader@aitutor.vip');
  const [unlockedBookIds, setUnlockedBookIds] = useState<string[]>(['ebook-demo-001']);
  const [readingModeLang, setReadingModeLang] = useState<'BILINGUAL' | 'ZH_ONLY' | 'EN_ONLY'>('BILINGUAL');
  const [settlementNotice, setSettlementNotice] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/ebook')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.store?.books) {
          const published = data.store.books.filter((b: EBookProject) => b.status === 'APPROVED_PUBLISHED');
          setBooks(published);
          if (published.length > 0) setSelectedBook(published[0]);
        }
      })
      .catch(console.error);
  }, []);

  // 模擬讀者購買或訂閱解鎖 (並自動驗算加盟商 $990 / $450 抵用金 100% 倒抵 10% 平台服務費)
  const handleSimulateUnlock = async (book: EBookProject, isMonthlySub: boolean) => {
    const price = isMonthlySub ? book.price_monthly_sub_usdt : book.price_single_usdt;
    const savedRef = typeof window !== 'undefined' ? localStorage.getItem('weixiang_referrer') : null;
    const res = await fetch('/api/ebook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'simulate_reader_purchase',
        bookId: book.id,
        amountUsdt: price,
        readerEmail,
        refCode: savedRef
      })
    });
    const data = await res.json();
    if (data.success && data.settlement) {
      if (!unlockedBookIds.includes(book.id)) {
        setUnlockedBookIds([...unlockedBookIds, book.id]);
      }
      const s = data.settlement;
      const bd = s.affiliateBreakdown;
      setSettlementNotice(
        `🎉 讀者結帳成功（$${s.orderAmount} USDT）！系統自動執行雙軌結算：【1】1成 (10%) 系統服務費（含提款與推廣服務費）$${s.originalFee10Pct} 已由加盟商抵用金扣抵 $${s.deductedFromCredit}（實收系統費 $${s.actualPlatformFeeCharged}）；【2】另支出「推廣服務費 25%」$${s.affiliateFee25Pct}（若為非推廣者訪客下單，系統自動綁定最高 10% 級差獎金 $${bd?.differential10Pct ?? (s.orderAmount * 0.1).toFixed(2)} ＋ 10% 對等獎金 $${bd?.matching10Pct ?? (s.orderAmount * 0.1).toFixed(2)} ＋ 永久 5% 均分全球分紅 $${bd?.globalPool5Pct ?? (s.orderAmount * 0.05).toFixed(2)}）➔ 加盟商本筆實拿淨額 $${s.authorNetReceived} USDT（剩餘抵用金 $${s.remainingCreditBalance} USDT）！`
      );
    }
  };

  // 讀者下載含購買者專屬浮水印之精裝 PDF（依照讀者目前所選的語系版本：BILINGUAL 中英雙語版 / ZH_ONLY 純繁體中文版 / EN_ONLY 純英文版）
  const handleReaderDownloadPDF = (book: EBookProject) => {
    const html = generateStandaloneEBookHTML(book, readerEmail || 'VIP Reader', readingModeLang);
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
      setTimeout(() => {
        win.focus();
        win.print();
      }, 600);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080d] text-white font-sans pb-24">
      {/* 頂部導覽 */}
      <header className="sticky top-0 z-40 bg-[#07080d]/90 backdrop-blur-lg border-b border-white/10 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-gray-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              ← 回微享首頁
            </Link>
            <h1 className="text-lg sm:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400">
              📖 微享全球讀者 VIP 訂閱書櫃 (/ebook-store)
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/studio"
              className="px-4 py-2 rounded-xl bg-pink-500/20 border border-pink-400/50 text-pink-300 text-xs font-bold"
            >
              🛠️ 我是加盟商・前往出書工作台
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        {settlementNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-950/80 border border-emerald-400 text-emerald-200 text-xs sm:text-sm font-bold leading-relaxed">
            {settlementNotice}
          </div>
        )}

        {/* 書架清單 (僅顯示已通過總管理後台 3~7 天書審之書籍) */}
        <div className="mb-8">
          <h2 className="text-xl font-black text-white mb-4">
            ✨ 已通過總後台書審・全球公開發行電子書 ({books.length} 本)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {books.map(book => {
              const isUnlocked = unlockedBookIds.includes(book.id);
              return (
                <div
                  key={book.id}
                  onClick={() => setSelectedBook(book)}
                  className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                    selectedBook?.id === book.id
                      ? 'bg-gradient-to-br from-blue-950/70 to-indigo-950/60 border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.2)]'
                      : 'bg-white/5 border-white/10 hover:border-white/30'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        ✅ 官方書審通過
                      </span>
                      <span className="text-xs text-gray-400">{book.author_name}</span>
                    </div>
                    <h3 className="text-lg font-black text-white mb-1">{book.title_zh}</h3>
                    <p className="text-xs text-cyan-300 mb-3">{book.title_en}</p>
                    <p className="text-xs text-gray-400 line-clamp-2">{book.subtitle_zh}</p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-400">單購 </span>
                      <span className="text-lg font-black text-emerald-400">${book.price_single_usdt}</span>
                      <span className="text-xs text-gray-400 ml-2">｜訂閱 </span>
                      <span className="text-sm font-bold text-pink-400">${book.price_monthly_sub_usdt}/月</span>
                    </div>
                    <span className="text-xs font-bold text-cyan-300">
                      {isUnlocked ? '🔓 已解鎖閱讀' : '🔒 點擊購買'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 選中書籍之「VIP 線上防盜版雙語閱讀器 ＋ 購買訂閱面板」 */}
        {selectedBook && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* 左側：購買/訂閱與浮水印下載控制列 (4 欄) */}
            <div className="lg:col-span-4 space-y-5">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <span className="text-xs font-bold text-cyan-400">READER SUBSCRIPTION & DOWNLOAD</span>
                <h3 className="text-2xl font-black text-white mt-1 mb-2">{selectedBook.title_zh}</h3>
                <p className="text-xs text-gray-400 mb-4">作者：{selectedBook.author_name}</p>

                <div className="mb-4">
                  <label className="block text-xs text-gray-400 mb-1">讀者授權信箱 (用於動態浮水印與自動發貨)</label>
                  <input
                    type="email"
                    value={readerEmail}
                    onChange={e => setReaderEmail(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>

                <div className="space-y-3">
                  <PayUniButton
                    packageId={991}
                    priceInUSDT={selectedBook.price_single_usdt}
                    productType="DIRECT_COURSE"
                    productName={`電子書單本買斷：${selectedBook.title_zh}`}
                  />

                  <button
                    onClick={() => handleSimulateUnlock(selectedBook, false)}
                    className="w-full py-3 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-400 text-emerald-200 font-bold text-xs cursor-pointer"
                  >
                    ⚡ 一鍵體驗：單本買斷 (${selectedBook.price_single_usdt}) 並測試 $990 倒抵 10% 服務費
                  </button>

                  <button
                    onClick={() => handleSimulateUnlock(selectedBook, true)}
                    className="w-full py-3 rounded-xl bg-pink-600/30 hover:bg-pink-600/50 border border-pink-400 text-pink-200 font-bold text-xs cursor-pointer"
                  >
                    📅 一鍵體驗：VIP 月費訂閱 (${selectedBook.price_monthly_sub_usdt}/月) 解鎖全書櫃
                  </button>
                </div>

                {unlockedBookIds.includes(selectedBook.id) && (
                  <div className="mt-6 pt-5 border-t border-white/10 space-y-3">
                    <div className="text-xs font-bold text-cyan-300">📥 VIP 讀者專屬下載</div>
                    <button
                      onClick={() => handleReaderDownloadPDF(selectedBook)}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs shadow-lg cursor-pointer"
                    >
                      🖨️ 下載授權浮水印精裝 PDF ({readerEmail})
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 右側：防盜版線上雙語閱讀器 (8 欄) */}
            <div className="lg:col-span-8">
              <div
                onContextMenu={e => e.preventDefault()}
                className="bg-[#0f172a] border border-cyan-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl select-none relative overflow-hidden"
              >
                {/* 動態防盜版背景浮水印 */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.04] rotate-[-20deg] text-3xl font-black text-white">
                  AUTHORIZED TO: {readerEmail}
                </div>

                {/* 閱讀器頂部語系切換列 */}
                <div className="flex flex-wrap justify-between items-center gap-3 pb-6 mb-6 border-b border-white/10">
                  <div>
                    <span className="text-xs font-bold text-emerald-400">🛡️ 防盜版加密線上閱讀器</span>
                    <h4 className="text-lg font-bold text-white">{selectedBook.title_zh}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setReadingModeLang('BILINGUAL')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                        readingModeLang === 'BILINGUAL' ? 'bg-cyan-500 text-black' : 'bg-white/10 text-gray-300'
                      }`}
                    >
                      🌍 中英雙語對照
                    </button>
                    <button
                      onClick={() => setReadingModeLang('ZH_ONLY')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                        readingModeLang === 'ZH_ONLY' ? 'bg-cyan-500 text-black' : 'bg-white/10 text-gray-300'
                      }`}
                    >
                      繁體中文
                    </button>
                    <button
                      onClick={() => setReadingModeLang('EN_ONLY')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                        readingModeLang === 'EN_ONLY' ? 'bg-cyan-500 text-black' : 'bg-white/10 text-gray-300'
                      }`}
                    >
                      English
                    </button>
                  </div>
                </div>

                {/* 章節內容渲染 */}
                <div className="space-y-10">
                  {selectedBook.chapters.map((ch, idx) => (
                    <div key={ch.id} className="space-y-4">
                      <div className="text-xs font-mono text-cyan-400">CHAPTER 0{idx + 1}</div>
                      {readingModeLang !== 'EN_ONLY' && (
                        <h3 className="text-2xl font-black text-white">{ch.title_zh}</h3>
                      )}
                      {readingModeLang !== 'ZH_ONLY' && ch.title_en && (
                        <h4 className="text-base font-semibold text-cyan-200/80">{ch.title_en}</h4>
                      )}

                      {readingModeLang !== 'EN_ONLY' && (
                        <div className="space-y-3 text-gray-200 leading-relaxed text-sm sm:text-base">
                          {ch.content_zh
                            .split('\n')
                            .filter(Boolean)
                            .map((p, i) => (
                              <p key={i}>{p}</p>
                            ))}
                        </div>
                      )}

                      {readingModeLang !== 'ZH_ONLY' && ch.content_en && (
                        <div className="p-5 rounded-2xl bg-slate-900/90 border-l-4 border-cyan-400 space-y-3 text-gray-300 text-sm leading-relaxed">
                          <div className="text-[10px] font-bold text-cyan-400 tracking-wider">ENGLISH EDITION</div>
                          {ch.content_en
                            .split('\n')
                            .filter(Boolean)
                            .map((p, i) => (
                              <p key={i}>{p}</p>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* 書籍底部作者導流與違規檢舉鈕 */}
                <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400">
                  <div>
                    作者導流連結：
                    <a href={selectedBook.author_cta_url} target="_blank" className="text-cyan-400 underline ml-1">
                      {selectedBook.author_cta_url}
                    </a>
                  </div>
                  <button
                    onClick={() =>
                      alert(
                        '🚩 感謝您的檢舉回報！系統已將此書送交總管理員風控中心。若查證違反《全球 10 大禁書條款》，將立即強制下架並永久凍結該加盟商帳號（一律不退費）。'
                      )
                    }
                    className="text-red-400 hover:underline cursor-pointer"
                  >
                    🚩 檢舉本書違反全球 10 大禁書條款
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
