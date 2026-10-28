'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import {
  EBookProject,
  EBookExportLangMode,
  EBookLangPair,
  FranchiseeProfile,
  EBOOK_THEMES,
  GLOBAL_BANNED_BOOK_CATEGORIES,
  generateStandaloneEBookHTML
} from '@/lib/ebookEngine';

export default function FranchiseStudioPage() {
  const { address } = useAccount();

  const [profile, setProfile] = useState<FranchiseeProfile>({
    wallet_address: address || 'demo_author',
    email: 'xyz007tw@gmail.com',
    plan_status: 'ACTIVE_YEAR_1',
    book_quota_total: 3,
    book_created_count: 1,
    fee_credit_balance: 990,
    total_sales_usdt: 0,
    payout_wallet: '0xea693e358f1527f8aa6563c9f6ebd42e37ee14fc',
    payout_bank: '808 玉山銀行 / 戶名：微享智能科技 / 帳號：0123-4567-8901',
    payout_requested_usdt: 0,
    ai_traffic_enabled: true,
    expires_at: '2027-10-27T08:00:00Z'
  });

  const [books, setBooks] = useState<EBookProject[]>([]);
  const [currentBook, setCurrentBook] = useState<EBookProject>({
    id: `ebook-${Date.now()}`,
    author_wallet: address || 'demo_author',
    author_name: '微享特約創作者',
    author_email: 'xyz007tw@gmail.com',
    author_cta_url: 'https://aitutor.vip/waia',
    author_line_id: 'xyz007tw',
    title_zh: 'AI 自動化獲客與知識變現聖經',
    title_en: 'The Bible of AI Automated Traffic & Knowledge Monetization',
    title_ja: 'AI自動化集客と知識マネタイズバイブル',
    subtitle_zh: '打造 24 小時不眠不休的數位資產印鈔機',
    subtitle_en: 'Build Your 24/7 Automated Digital Asset Printing Machine',
    subtitle_ja: '24時間眠らないデジタル資産構築の極意',
    lang_pair: 'ZH_EN',
    theme_id: 'tech_blue',
    bilingual_mode: true,
    price_single_usdt: 39,
    price_monthly_sub_usdt: 15,
    status: 'DRAFT',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    chapters: [
      {
        id: 'ch-1',
        title_zh: '第一章：AI 時代的個人自動化出版社革命',
        title_en: 'Chapter 1: The Personal Automated Publishing Revolution in the AI Era',
        title_ja: '第一章：AI時代の個人自動化出版革命',
        content_zh: '過去出版一本書需要耗費數個月與高昂的外包排版費，現在透過微享自動電子書模版引擎，您只需專注於核心洞見，系統即自動為您生成中英雙語專業排版，並結合 AI 自動來客系統在全球幫您引流獲客。',
        content_en: 'Publishing a book used to take months and expensive outsourcing. Now, with the WeiXiang Automated E-Book Template Engine, you focus on core insights while the system generates bilingual layouts and drives global traffic via our AI Auto-Traffic Matrix.',
        content_ja: 'かつて出版には数ヶ月の歳月と高額な組版費用を要しました。WeiXiang自動電子書籍エンジンにより、コアな洞見に集中するだけで多言語の本格レイアウトが瞬時に完成します。'
      }
    ]
  });

  const [outlinePrompt, setOutlinePrompt] = useState('');
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [fullBookTopic, setFullBookTopic] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [fullBookLoading, setFullBookLoading] = useState(false);
  const [savingLoading, setSavingLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [showBannedRules, setShowBannedRules] = useState(false);
  const [exportLangMode, setExportLangMode] = useState<EBookExportLangMode>('BILINGUAL');
  const [r2Uploading, setR2Uploading] = useState(false);

  // 加盟商收款提現狀態
  const [payoutWallet, setPayoutWallet] = useState(profile.payout_wallet || '');
  const [payoutBank, setPayoutBank] = useState(profile.payout_bank || '');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [payoutStatusMsg, setPayoutStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchStoreData = async () => {
    try {
      const res = await fetch('/api/ebook');
      const data = await res.json();
      if (data.success && data.store) {
        setBooks(data.store.books || []);
        const key = (address || 'demo_author').toLowerCase();
        const pf = data.store.franchisees?.[key] || data.store.franchisees?.['demo_author'];
        if (pf) {
          setProfile(pf);
          if (pf.payout_wallet) setPayoutWallet(pf.payout_wallet);
          if (pf.payout_bank) setPayoutBank(pf.payout_bank);
        }
      }
    } catch (e) {
      console.error('Failed to load studio store', e);
    }
  };

  useEffect(() => {
    fetchStoreData();
  }, [address]);

  // 儲存加盟商提現資訊
  const handleSavePayoutSettings = async () => {
    setPayoutLoading(true);
    setPayoutStatusMsg(null);
    try {
      const res = await fetch('/api/ebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_payout_settings',
          authorKey: address || 'demo_author',
          payoutWallet,
          payoutBank
        })
      });
      const data = await res.json();
      if (data.success) {
        if (data.profile) setProfile(data.profile);
        setPayoutStatusMsg({ type: 'success', text: '✅ 收款與提現設定已成功儲存！' });
      } else {
        setPayoutStatusMsg({ type: 'error', text: data.error || '儲存失敗' });
      }
    } catch (e: any) {
      setPayoutStatusMsg({ type: 'error', text: e.message || '連線錯誤' });
    } finally {
      setPayoutLoading(false);
    }
  };

  // 申請出金提現
  const handleRequestPayout = async () => {
    const amt = Number(withdrawAmount);
    if (!amt || amt <= 0) {
      setPayoutStatusMsg({ type: 'error', text: '請輸入有效的提現金額！' });
      return;
    }
    if (!payoutWallet && !payoutBank) {
      setPayoutStatusMsg({ type: 'error', text: '請先填寫並儲存 Polygon USDT 錢包地址或銀行帳號！' });
      return;
    }

    setPayoutLoading(true);
    setPayoutStatusMsg(null);
    try {
      const res = await fetch('/api/ebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request_payout',
          authorKey: address || 'demo_author',
          amountUsdt: amt
        })
      });
      const data = await res.json();
      if (data.success) {
        if (data.profile) setProfile(data.profile);
        setWithdrawAmount('');
        setPayoutStatusMsg({ type: 'success', text: data.message || '✅ 提現申請已成功送出！' });
      } else {
        setPayoutStatusMsg({ type: 'error', text: data.error || '提現申請失敗' });
      }
    } catch (e: any) {
      setPayoutStatusMsg({ type: 'error', text: e.message || '連線錯誤' });
    } finally {
      setPayoutLoading(false);
    }
  };

  // AI 自動撰寫與多語系翻譯新章節
  const handleAiGenerateChapter = async () => {
    if (!newChapterTitle.trim() && !outlinePrompt.trim()) {
      alert('請先輸入「本章標題」或「大綱要點」，AI 才能為您擴寫與翻譯！');
      return;
    }
    setAiLoading(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/ebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ai_generate_chapter',
          bookTitle: currentBook.title_zh,
          chapterTitle: newChapterTitle || '核心實戰章節',
          outlineNotes: outlinePrompt || newChapterTitle,
          langPair: currentBook.lang_pair || 'ZH_EN'
        })
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.error || 'AI 生成失敗');
      } else if (data.chapter) {
        setCurrentBook(prev => ({
          ...prev,
          chapters: [
            ...prev.chapters,
            {
              id: `ch-${Date.now()}`,
              title_zh: data.chapter.title_zh,
              title_en: data.chapter.title_en,
              title_ja: data.chapter.title_ja,
              content_zh: data.chapter.content_zh,
              content_en: data.chapter.content_en,
              content_ja: data.chapter.content_ja,
              image_url: data.chapter.image_url,
              image_caption: data.chapter.image_caption,
              references: data.chapter.references
            }
          ]
        }));
        setNewChapterTitle('');
        setOutlinePrompt('');
        setStatusMessage('✨ AI 多語系章節擴寫完成！已自動加入下方章節列表。');
      }
    } catch (err: any) {
      alert('連線錯誤：' + err.message);
    } finally {
      setAiLoading(false);
    }
  };

  // AI 一鍵全書自動編撰 (自動產生多語系書名、副標與 8 大核心章節完整圖文)
  const handleAiGenerateFullBook = async () => {
    if (!currentBook.title_zh.trim() && !fullBookTopic.trim()) {
      alert('請先在上方輸入「中文書名」或下方輸入「全書主題描述」，AI 即可一鍵為您自動編撰整本多語系專業電子書！');
      return;
    }
    setFullBookLoading(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/ebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ai_generate_full_book',
          bookTitle: currentBook.title_zh,
          bookSubtitle: currentBook.subtitle_zh,
          topicSummary: fullBookTopic || currentBook.title_zh,
          langPair: currentBook.lang_pair || 'ZH_EN'
        })
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.error || 'AI 全書編撰失敗');
      } else {
        setCurrentBook(prev => ({
          ...prev,
          title_zh: data.bookMeta?.title_zh || prev.title_zh,
          title_en: data.bookMeta?.title_en || prev.title_en,
          title_ja: data.bookMeta?.title_ja || prev.title_ja,
          subtitle_zh: data.bookMeta?.subtitle_zh || prev.subtitle_zh,
          subtitle_en: data.bookMeta?.subtitle_en || prev.subtitle_en,
          subtitle_ja: data.bookMeta?.subtitle_ja || prev.subtitle_ja,
          lang_pair: data.bookMeta?.lang_pair || prev.lang_pair,
          cover_image_url: data.bookMeta?.cover_image_url || prev.cover_image_url,
          chapters: data.chapters || prev.chapters
        }));
        setStatusMessage('🎉 Google 4 旗艦大腦已為您編撰完成 25+ 頁全球權威專書！包含 8 大核心篇章、高質感商業插圖、圖說與權威文獻參照，可立即在右側點擊「自行下載電子書（3版）」或「提交書審」！');
      }
    } catch (e: any) {
      alert('連線錯誤：' + e.message);
    } finally {
      setFullBookLoading(false);
    }
  };

  // 儲存草稿或送交後台「書審 (3~7天)」
  const handleSaveOrSubmit = async (submitForReview: boolean) => {
    if (submitForReview) {
      const ok = window.confirm(
        '⚖️【送交總管理後台「書審 (3~7天)」確認】\n\n1. 送出後您的電子書將進入管理後台進行人工與 AI 雙重書審（預計審核時間：3~7 個工作天）。\n2. 請再次確認本書未違反《全球 10 大不可上架禁書條款》，違規或遭檢舉查證屬實一律下架封號且不退費。\n\n確定現在提交書審嗎？'
      );
      if (!ok) return;
    }

    setSavingLoading(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/ebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_or_submit_book',
          submitForReview,
          book: {
            ...currentBook,
            author_wallet: address || currentBook.author_wallet || 'demo_author'
          }
        })
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.error || '儲存失敗');
      } else {
        setCurrentBook(data.book);
        if (data.profile) setProfile(data.profile);
        setStatusMessage(data.message);
        fetchStoreData();
      }
    } catch (e: any) {
      alert('儲存發生異常：' + e.message);
    } finally {
      setSavingLoading(false);
    }
  };

  // 功能 A：加盟商自行下載電子書母檔 (.html 獨立電子書檔 / 一鍵轉精裝印刷級 PDF，支援 3 版語系：中英雙語版 / 純中文版 / 純英文版)
  const handleDownloadMasterBook = (
    bookToExport: EBookProject,
    triggerPrintPdf: boolean,
    modeOverride?: EBookExportLangMode
  ) => {
    const mode = modeOverride || exportLangMode;
    const htmlContent = generateStandaloneEBookHTML(bookToExport, undefined, mode);

    if (triggerPrintPdf) {
      const win = window.open('', '_blank');
      if (win) {
        win.document.write(htmlContent);
        win.document.close();
        setTimeout(() => {
          win.focus();
          win.print();
        }, 600);
      } else {
        alert('請允許瀏覽器彈出視窗以開啟 PDF 印刷預覽引擎！');
      }
    } else {
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const suffix = mode === 'EN_ONLY' ? 'EN' : mode === 'ZH_ONLY' ? 'ZH' : 'Bilingual';
      a.download = `${bookToExport.title_zh.replace(/\s+/g, '_')}_${suffix}_Master_EBook.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // 功能 A2：上傳電子書圖片或「自行下載並修改後之電子書（含圖及文章等）」至專用 R2 儲存槽 (1.5208.uk / pub-2006e181b8544782b8d026affdaa34ab.r2.dev)，離線修改後重新上傳算 1 次修改額度
  const handleUploadToDedicatedR2 = async (
    file: File,
    targetType: 'COVER_IMAGE' | 'CHAPTER_IMAGE' | 'MODIFIED_BOOK_REUPLOAD',
    chapterIdx?: number
  ) => {
    setR2Uploading(true);
    setStatusMessage(null);
    try {
      const reader = new FileReader();
      const base64Data: string = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      let parsedBookData: EBookProject | undefined;
      if (targetType === 'MODIFIED_BOOK_REUPLOAD') {
        const textContent = await file.text();
        // 嘗試從母檔內嵌的 #wx-ebook-project-data JSON 還原，或若為 .json 檔直接解析
        const match = textContent.match(/<script id="wx-ebook-project-data" type="application\/json">([\s\S]*?)<\/script>/);
        if (match && match[1]) {
          try {
            parsedBookData = JSON.parse(match[1]);
          } catch {
            // fallback
          }
        } else if (file.name.endsWith('.json')) {
          try {
            parsedBookData = JSON.parse(textContent);
          } catch {
            // fallback
          }
        }
      }

      const res = await fetch('/api/ebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'upload_asset_or_book_to_r2',
          bookId: currentBook.id,
          fileName: file.name,
          contentType: file.type || 'application/octet-stream',
          base64Data,
          isModifiedBookUpload: targetType === 'MODIFIED_BOOK_REUPLOAD',
          parsedBookData
        })
      });

      const data = await res.json();
      if (!data.success) {
        alert(data.error || '上傳至專用 R2 失敗');
        return;
      }

      if (targetType === 'COVER_IMAGE') {
        setCurrentBook(prev => ({ ...prev, cover_image_url: data.primaryUrl }));
        setStatusMessage(`☁️ 封面圖片已上傳至專用 R2 儲存槽：${data.primaryUrl}（備援：${data.mirrorUrl}）`);
      } else if (targetType === 'CHAPTER_IMAGE' && typeof chapterIdx === 'number') {
        const updated = [...currentBook.chapters];
        updated[chapterIdx].image_url = data.primaryUrl;
        setCurrentBook(prev => ({ ...prev, chapters: updated }));
        setStatusMessage(`☁️ 第 ${chapterIdx + 1} 章配圖已上傳至專用 R2 儲存槽：${data.primaryUrl}`);
      } else if (targetType === 'MODIFIED_BOOK_REUPLOAD') {
        if (data.book) {
          setCurrentBook(data.book);
          fetchStoreData();
        }
        setStatusMessage(data.message);
      }
    } catch (err: any) {
      alert('上傳發生錯誤：' + err.message);
    } finally {
      setR2Uploading(false);
    }
  };
  // 模擬加購第 4 本起配額 ($360/本)、次年續約 ($450 同享 100% 倒抵) 或 單書加購 1 次修改權限 ($30)
  const handleUpgradeAction = async (upgradeType: 'ADD_1_BOOK_360' | 'RENEW_YEAR2_450' | 'ADD_1_EDIT_30') => {
    const label =
      upgradeType === 'ADD_1_BOOK_360'
        ? '確認支付 $360 USDT 加購「1 本額外電子書開發配額」？'
        : upgradeType === 'RENEW_YEAR2_450'
        ? '確認支付 $450 USDT 續約「次年 AI 自來客廣告與電子書系統服務維護費（可 100% 抵扣交易 1 成服務費）」？'
        : '確認支付修改費 $30 USDT，為本書再增加「+1 次修改權限」？';
    if (!window.confirm(label)) return;

    const res = await fetch('/api/ebook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'upgrade_quota_or_renew',
        authorKey: address || 'demo_author',
        upgradeType,
        bookId: currentBook.id
      })
    });
    const data = await res.json();
    if (data.success) {
      if (data.profile) setProfile(data.profile);
      if (data.book) setCurrentBook(data.book);
      fetchStoreData();
      setStatusMessage(
        upgradeType === 'ADD_1_BOOK_360'
          ? '✅ 已成功擴充 +1 本電子書開發配額！'
          : upgradeType === 'RENEW_YEAR2_450'
          ? '✅ 已完成次年 $450 系統服務維護續約！您的服務費抵用金水庫已自動增加 +$450 USDT（享 100% 倒抵 10% 交易服務費）！'
          : '✅ 已支付修改費 $30 USDT，本書已成功擴充 +1 次修改權限！'
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#08090f] text-white font-sans pb-24">
      {/* 頂部導覽列 */}
      <header className="sticky top-0 z-40 bg-[#08090f]/90 backdrop-blur-lg border-b border-white/10 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-gray-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              ← 回微享首頁
            </Link>
            <h1 className="text-lg sm:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400">
              🛠️ 加盟商線上電子書模版引擎工作台 (/studio)
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowBannedRules(!showBannedRules)}
              className="px-3.5 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-400/50 text-red-300 text-xs font-bold cursor-pointer"
            >
              🚫 10大禁書條款與不退費須知
            </button>
            <Link
              href="/ebook-store"
              className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 text-xs font-bold"
            >
              📖 預覽讀者訂閱書櫃 (/ebook-store)
            </Link>
            <Link
              href="/admin/franchise"
              className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-300 text-xs font-bold"
            >
              👑 總管理員書審後台
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        {/* 頂部：加盟商四大核心配額與倒抵水庫儀表板 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* 1. 電子書開發配額 ($990 含 3 本，之後 $360/本) */}
          <div className="bg-gradient-to-br from-pink-950/50 to-purple-950/40 border border-pink-500/30 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="text-xs text-pink-300 font-bold mb-1">📚 電子書開發配額 ($990 含 3 本)</div>
              <div className="text-3xl font-black text-white">
                {books.length} / {profile.book_quota_total} <span className="text-sm font-normal text-gray-400">本</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">第 4 本起每新增 1 本電子書開發費 $360</p>
            </div>
            <button
              onClick={() => handleUpgradeAction('ADD_1_BOOK_360')}
              className="mt-4 w-full py-2 rounded-xl bg-pink-600/30 hover:bg-pink-600/50 border border-pink-400/50 text-pink-200 text-xs font-bold transition-all cursor-pointer"
            >
              ➕ 加購新書開發配額 ($360 / 本)
            </button>
          </div>

          {/* 2. 10% 系統服務費 100% 倒抵水庫 ($990 首年 / $450 次年) + 25% 推廣聯盟支出說明 */}
          <div className="bg-gradient-to-br from-emerald-950/50 to-teal-950/40 border border-emerald-500/30 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="text-xs text-emerald-300 font-bold mb-1">💎 1成 (10%) 系統服務費倒抵金餘額</div>
              <div className="text-3xl font-black text-emerald-400">
                ${profile.fee_credit_balance.toLocaleString()} <span className="text-sm font-normal text-gray-400">USDT</span>
              </div>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                10% 系統服務費（含提款與推廣服務費）由抵用金 100% 扣抵；每筆另支出 <strong>25% 推廣聯盟服務費</strong> 予推廣體系。
              </p>
            </div>
            <div className="mt-4 text-xs text-emerald-300 font-semibold">
              累積電子書銷售額：${profile.total_sales_usdt.toLocaleString()} USDT
            </div>
          </div>

          {/* 3. AI 自動來客系統廣告協作狀態 & 次年 $450 系統服務維護續約 */}
          <div className="bg-gradient-to-br from-cyan-950/50 to-blue-950/40 border border-cyan-500/30 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="text-xs text-cyan-300 font-bold mb-1">🔥 AI 自動來客系統幫打廣告</div>
              <div className="text-xl font-black text-white flex items-center gap-2 mt-1">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping inline-block" />
                協作曝光運行中
              </div>
              <p className="text-xs text-gray-400 mt-2">
                次年系統服務費 $450/年（一樣先收費後可 100% 抵扣交易 1 成服務費）
              </p>
            </div>
            <button
              onClick={() => handleUpgradeAction('RENEW_YEAR2_450')}
              className="mt-4 w-full py-2 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-400/50 text-cyan-200 text-xs font-bold transition-all cursor-pointer"
            >
              🔄 預繳次年系統服務費 $450 (+獲 $450 倒抵金)
            </button>
          </div>

          {/* 4. 書審制度提醒 (3~7天) */}
          <div className="bg-gradient-to-br from-amber-950/50 to-red-950/40 border border-amber-500/40 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="text-xs text-amber-300 font-bold mb-1">⚖️ 總後台書審與禁書風控狀態</div>
              <div className="text-lg font-black text-amber-200 mt-1">
                書審時間：3 ~ 7 個工作天
              </div>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                電子書設定完成並送審後，將進入管理後台審核（3~7天）。嚴禁上架全球 10 大禁書，違規被檢舉一律封號不退費。
              </p>
            </div>
            <div className="mt-3 text-[11px] text-amber-400 font-bold">
              💡 提示：草稿狀態即可隨時「自行下載電子書母檔」！
            </div>
          </div>
        </div>

        {/* 🧭 加盟商後台「4 步傻瓜式製作說明」＆「24H 全雲端 AI 協作分工表」 */}
        <div className="bg-gradient-to-r from-slate-900/90 via-indigo-950/60 to-slate-900/90 border border-indigo-500/30 rounded-3xl p-6 mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10">
            <div>
              <span className="text-xs font-black text-cyan-400 uppercase tracking-wider">
                ☁️ 100% CLOUD-NATIVE AUTOMATION (24H 雲端獨立運行・免安裝軟體)
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                🧭 加盟商線上電子書製作 4 步 SOP 指引 ＆ 雲端 AI 協作說明
              </h2>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold w-fit">
              ⚡ 全程於雲端伺服器自動執行
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
              <div className="font-black text-pink-400 text-sm mb-1">步驟 ① 設定書名與導流 QR</div>
              <p className="text-gray-300 leading-relaxed mb-2">
                於下方 STEP 1 填入您的書名、署名、售價與您的專屬導流網址（系統會自動轉為高解析 QR Code 印在書末）。
              </p>
              <div className="text-[11px] text-cyan-300 font-bold">🤝 協作方：雲端模版排版引擎</div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
              <div className="font-black text-purple-400 text-sm mb-1">步驟 ② AI 一鍵自動編撰雙語書</div>
              <p className="text-gray-300 leading-relaxed mb-2">
                於 STEP 2 輸入一句主題，點擊「🔥 一鍵由 AI 自動編撰整本雙語電子書」，10 秒內自動寫完中英雙語章節！
              </p>
              <div className="text-[11px] text-cyan-300 font-bold">🤝 協作方：Google Cloud Gemini 2.5 AI 總編</div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
              <div className="font-black text-cyan-400 text-sm mb-1">步驟 ③ 自行下載精裝 PDF 母檔</div>
              <p className="text-gray-300 leading-relaxed mb-2">
                於右側 STEP 3 點擊「🖨️ 一鍵導出印刷級精裝 PDF」或下載網頁母檔，立即保存在您自己的電腦或手機中。
              </p>
              <div className="text-[11px] text-cyan-300 font-bold">🤝 協作方：雲端向量 PDF 渲染核心</div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
              <div className="font-black text-amber-400 text-sm mb-1">步驟 ④ 提交總後台書審 (3~7天)</div>
              <p className="text-gray-300 leading-relaxed mb-2">
                點擊「⚖️ 提交至管理後台書審」，通過 3~7 天書審後即公開上架 `/ebook-store`，並啟動 AI 自動來客幫您打廣告！
              </p>
              <div className="text-[11px] text-cyan-300 font-bold">🤝 協作方：微享總管理後台 ＋ AI 自來客矩陣</div>
            </div>
          </div>
        </div>

        {/* 展開式：全球 10 大禁書與違規不退費提醒 */}
        {showBannedRules && (
          <div className="bg-red-950/40 border-2 border-red-500/50 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-black text-red-300 mb-3">
              🚫 全球電子書不可上架之 10 大禁書條款（違規遭檢舉一律強制下架封號且不退費）
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {GLOBAL_BANNED_BOOK_CATEGORIES.map(c => (
                <div key={c.id} className="p-3 rounded-xl bg-black/40 border border-red-500/20">
                  <div className="font-bold text-white mb-1">{c.icon} {c.title_zh}</div>
                  <div className="text-gray-300">{c.desc_zh}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 狀態回饋通知 */}
        {statusMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-200 font-bold text-sm">
            {statusMessage}
          </div>
        )}

        {/* 💰 加盟商收款方式設定 ＆ 一鍵出金提現中心 (Payout Settings & Withdrawals) */}
        <div className="bg-gradient-to-br from-indigo-950/70 via-slate-900/90 to-purple-950/70 border-2 border-indigo-400/40 rounded-3xl p-6 mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10">
            <div>
              <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
                PAYOUT SETTINGS & AUTOMATED WITHDRAWALS
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-white mt-0.5 flex items-center gap-2">
                <span>💰</span> 加盟商收款方式設定 ＆ 一鍵出金提現中心
              </h2>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold w-fit">
              ⚡ 支援 Polygon USDT 錢包 ＋ 銀行直匯雙軌出金
            </span>
          </div>

          {/* 出金提現數據統計卡 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 text-xs">
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
              <span className="text-gray-400 block mb-1">累積銷售總額</span>
              <span className="text-lg sm:text-xl font-black text-white">${profile.total_sales_usdt.toLocaleString()} <span className="text-[10px] text-gray-400 font-normal">USDT</span></span>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/40 border border-emerald-500/30">
              <span className="text-emerald-300 block mb-1">10% 服務費倒抵金</span>
              <span className="text-lg sm:text-xl font-black text-emerald-400">${profile.fee_credit_balance.toLocaleString()} <span className="text-[10px] text-gray-400 font-normal">USDT</span></span>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/40 border border-cyan-500/30">
              <span className="text-cyan-300 block mb-1">已申請提現累計</span>
              <span className="text-lg sm:text-xl font-black text-cyan-400">${(profile.payout_requested_usdt || 0).toLocaleString()} <span className="text-[10px] text-gray-400 font-normal">USDT</span></span>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/40 border border-amber-500/40">
              <span className="text-amber-300 block mb-1">目前最高可提現</span>
              <span className="text-lg sm:text-xl font-black text-amber-400">
                ${Math.max(0, Number(((profile.total_sales_usdt * 0.65) - (profile.payout_requested_usdt || 0)).toFixed(2))).toLocaleString()} <span className="text-[10px] text-gray-400 font-normal">USDT</span>
              </span>
            </div>
          </div>

          {/* 收款設定與提現表單 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* 收款方式設定 (7 欄) */}
            <div className="lg:col-span-7 space-y-3 bg-black/30 p-4 rounded-2xl border border-white/10">
              <div className="text-xs font-bold text-indigo-300 flex items-center justify-between">
                <span>1️⃣ 設定您的提現收款帳戶 (錢包或銀行)：</span>
                <span className="text-[11px] text-gray-400">系統打款唯一依據</span>
              </div>
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">Polygon (MATIC) USDT 收款錢包地址 (0x...)</label>
                <input
                  type="text"
                  placeholder="例如：0xea693e358f1527f8aa6563c9f6ebd42e37ee14fc"
                  value={payoutWallet}
                  onChange={e => setPayoutWallet(e.target.value)}
                  className="w-full bg-gray-900 border border-indigo-500/40 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-cyan-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">法幣收款：銀行代碼、銀行名稱、戶名與帳號 (或 PayPal)</label>
                <input
                  type="text"
                  placeholder="例如：808 玉山銀行 / 戶名：王小明 / 帳號：0123-4567-8901"
                  value={payoutBank}
                  onChange={e => setPayoutBank(e.target.value)}
                  className="w-full bg-gray-900 border border-indigo-500/40 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <button
                onClick={handleSavePayoutSettings}
                disabled={payoutLoading}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all cursor-pointer"
              >
                💾 儲存收款提現設定
              </button>
            </div>

            {/* 申請出金提現 (5 欄) */}
            <div className="lg:col-span-5 space-y-3 bg-black/30 p-4 rounded-2xl border border-white/10 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-amber-300 mb-2">
                  2️⃣ 申請出金提現 (USDT)：
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="輸入提現金額"
                    value={withdrawAmount}
                    onChange={e => setWithdrawAmount(e.target.value)}
                    className="flex-1 bg-gray-900 border border-amber-500/40 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-amber-300 font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <button
                    onClick={() => {
                      const max = Math.max(0, Number(((profile.total_sales_usdt * 0.65) - (profile.payout_requested_usdt || 0)).toFixed(2)));
                      setWithdrawAmount(String(max));
                    }}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-gray-300 shrink-0 cursor-pointer"
                  >
                    全部
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">
                  💡 每筆訂單撥出 25% 推廣聯盟費與 10% 服務費（倒抵期間享 0% 抽成）；加盟商實收淨額約為 65%~75%，送出申請後 24 小時內核驗打款。
                </p>
              </div>

              <button
                onClick={handleRequestPayout}
                disabled={payoutLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-[0_0_20px_rgba(251,191,36,0.3)] cursor-pointer"
              >
                🚀 立即申請出金提現
              </button>
            </div>
          </div>

          {payoutStatusMsg && (
            <div className={`mt-3 p-3 rounded-xl text-xs font-bold ${payoutStatusMsg.type === 'success' ? 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-200' : 'bg-red-950/70 border border-red-500/50 text-red-200'}`}>
              {payoutStatusMsg.text}
            </div>
          )}
        </div>

        {/* 主工作區：左側編輯與 AI 模版設定 ｜ 右側即時預覽與自行下載 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 左側：設定與 AI 撰稿 (7 欄) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: 基本書籍資訊與模版選擇 */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-black text-white">STEP 1：設定電子書基本資料與美化模版</h2>
                <button
                  onClick={() =>
                    setCurrentBook({
                      ...currentBook,
                      id: `ebook-${Date.now()}`,
                      title_zh: '未命名新電子書',
                      title_en: 'Untitled New E-Book',
                      status: 'DRAFT',
                      chapters: []
                    })
                  }
                  className="px-3 py-1.5 rounded-lg bg-purple-600/30 border border-purple-400/50 text-purple-200 text-xs font-bold cursor-pointer"
                >
                  ➕ 開新電子書專案
                </button>
              </div>

              <div className="mb-4 p-4 rounded-2xl bg-black/40 border border-indigo-500/30">
                <label className="block text-xs font-black text-indigo-300 uppercase tracking-wider mb-2">
                  🌐 選擇電子書自選語系對 (Language Pair) *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentBook({ ...currentBook, lang_pair: 'ZH_EN' })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      (currentBook.lang_pair || 'ZH_EN') === 'ZH_EN'
                        ? 'bg-indigo-600 border-indigo-300 text-white shadow'
                        : 'bg-gray-900 border-gray-700 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    🇹🇼/🇺🇸 繁體中文 ＋ 專業英文
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentBook({ ...currentBook, lang_pair: 'JA_EN' })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      currentBook.lang_pair === 'JA_EN'
                        ? 'bg-indigo-600 border-indigo-300 text-white shadow'
                        : 'bg-gray-900 border-gray-700 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    🇯🇵/🇺🇸 日文敬語 ＋ 專業英文
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentBook({ ...currentBook, lang_pair: 'ZH_JA' })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      currentBook.lang_pair === 'ZH_JA'
                        ? 'bg-indigo-600 border-indigo-300 text-white shadow'
                        : 'bg-gray-900 border-gray-700 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    🇹🇼/🇯🇵 繁體中文 ＋ 日文敬語
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {currentBook.lang_pair === 'JA_EN' ? (
                  <>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">日文書名 (日本語メインタイトル) *</label>
                      <input
                        type="text"
                        value={currentBook.title_ja || currentBook.title_zh}
                        onChange={e => setCurrentBook({ ...currentBook, title_ja: e.target.value, title_zh: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">英文書名 (English Main Title) *</label>
                      <input
                        type="text"
                        value={currentBook.title_en}
                        onChange={e => setCurrentBook({ ...currentBook, title_en: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">日文副標題 (日本語サブタイトル)</label>
                      <input
                        type="text"
                        value={currentBook.subtitle_ja || currentBook.subtitle_zh}
                        onChange={e => setCurrentBook({ ...currentBook, subtitle_ja: e.target.value, subtitle_zh: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">英文副標題 (English Subtitle)</label>
                      <input
                        type="text"
                        value={currentBook.subtitle_en}
                        onChange={e => setCurrentBook({ ...currentBook, subtitle_en: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-white"
                      />
                    </div>
                  </>
                ) : currentBook.lang_pair === 'ZH_JA' ? (
                  <>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">繁體中文書名 *</label>
                      <input
                        type="text"
                        value={currentBook.title_zh}
                        onChange={e => setCurrentBook({ ...currentBook, title_zh: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">日文書名 (日本語メインタイトル)</label>
                      <input
                        type="text"
                        value={currentBook.title_ja || ''}
                        onChange={e => setCurrentBook({ ...currentBook, title_ja: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">繁體中文副標題</label>
                      <input
                        type="text"
                        value={currentBook.subtitle_zh}
                        onChange={e => setCurrentBook({ ...currentBook, subtitle_zh: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">日文副標題 (日本語サブタイトル)</label>
                      <input
                        type="text"
                        value={currentBook.subtitle_ja || ''}
                        onChange={e => setCurrentBook({ ...currentBook, subtitle_ja: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-white"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">中文書名 *</label>
                      <input
                        type="text"
                        value={currentBook.title_zh}
                        onChange={e => setCurrentBook({ ...currentBook, title_zh: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">英文書名 (雙語對照版自動顯示)</label>
                      <input
                        type="text"
                        value={currentBook.title_en}
                        onChange={e => setCurrentBook({ ...currentBook, title_en: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">中文副標題</label>
                      <input
                        type="text"
                        value={currentBook.subtitle_zh}
                        onChange={e => setCurrentBook({ ...currentBook, subtitle_zh: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">英文副標題</label>
                      <input
                        type="text"
                        value={currentBook.subtitle_en}
                        onChange={e => setCurrentBook({ ...currentBook, subtitle_en: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-white"
                      />
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-xs text-gray-400 mb-1">作者 / 加盟商品牌署名</label>
                  <input
                    type="text"
                    value={currentBook.author_name}
                    onChange={e => setCurrentBook({ ...currentBook, author_name: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">電子書頁尾導流網址 (自動生成高解析 QR Code)</label>
                  <input
                    type="text"
                    value={currentBook.author_cta_url}
                    onChange={e => setCurrentBook({ ...currentBook, author_cta_url: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-cyan-300"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">作者聯絡 Email / Line ID</label>
                  <input
                    type="text"
                    value={currentBook.author_email}
                    onChange={e => setCurrentBook({ ...currentBook, author_email: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">單本買斷售價 (USDT)</label>
                  <input
                    type="number"
                    value={currentBook.price_single_usdt}
                    onChange={e => setCurrentBook({ ...currentBook, price_single_usdt: Number(e.target.value) })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-emerald-400 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">讀者專欄月費訂閱價 (USDT / 月)</label>
                  <input
                    type="number"
                    value={currentBook.price_monthly_sub_usdt}
                    onChange={e => setCurrentBook({ ...currentBook, price_monthly_sub_usdt: Number(e.target.value) })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-pink-400 font-bold"
                  />
                </div>
              </div>

              {/* 模版主題與雙語開關 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/10">
                {Object.values(EBOOK_THEMES).map(th => (
                  <button
                    key={th.id}
                    onClick={() => setCurrentBook({ ...currentBook, theme_id: th.id as any })}
                    className={`p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                      currentBook.theme_id === th.id
                        ? 'bg-pink-500/20 border-pink-400 text-white'
                        : 'bg-gray-900 border-gray-700 text-gray-400'
                    }`}
                  >
                    {th.name_zh}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between bg-black/40 p-3.5 rounded-xl border border-white/10">
                <span className="text-xs sm:text-sm font-bold text-gray-200">
                  🌍 啟用「中/英雙語對照版」自動排版模式
                </span>
                <input
                  type="checkbox"
                  checked={currentBook.bilingual_mode}
                  onChange={e => setCurrentBook({ ...currentBook, bilingual_mode: e.target.checked })}
                  className="w-5 h-5 accent-pink-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Step 2: AI 自動編撰全書 & 雙語章節生成器 (Google 4 Argon 圖文專業版) */}
            <div className="bg-gradient-to-br from-indigo-950/50 to-purple-950/40 border border-purple-500/40 rounded-3xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <h2 className="text-xl font-black text-white">
                  STEP 2：🤖 Google 4 旗艦級「圖文專業電子書」自動編撰引擎
                </h2>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                  ✨ 旗艦大腦 (自動聯網檢索 + 配圖 + 權威來源參照)
                </span>
              </div>
              <p className="text-xs text-purple-200 mb-4 leading-relaxed">
                全面搭載 Google 4 旗艦大腦！支援兩種智慧模式：【模式 A】輸入全書主題，調用全球頂尖暢銷作家與戰略顧問代理，一次自動完成<strong>「封面圖 ＋ 8 大核心深度篇章（8,000~10,000字・達標 25+ 頁全球權威專書體量）＋ 高質感商業插圖 ＋ 權威數據來源參照」</strong>之全套中英雙語圖文書；【模式 B】單一章節深度擴寫與圖文生成。
              </p>

              {/* 模式 A：一鍵全書自動編撰 */}
              <div className="p-4 rounded-2xl bg-pink-950/40 border border-pink-500/40 mb-5 space-y-3">
                <div className="text-xs font-black text-pink-300">
                  🚀 【模式 A：Google 4 一鍵全書自動編撰（8 大篇章・25+ 頁全球暢銷圖文專書規格）】
                </div>
                <textarea
                  rows={2}
                  placeholder="輸入您想寫的全書主題、目標受眾或核心概念（例如：教房仲業務如何用 AI 短影音每天自動吸引精準買家）..."
                  value={fullBookTopic}
                  onChange={e => setFullBookTopic(e.target.value)}
                  className="w-full bg-gray-900/90 border border-pink-500/40 rounded-xl px-4 py-2.5 text-sm text-white"
                />
                <button
                  onClick={handleAiGenerateFullBook}
                  disabled={fullBookLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-400 hover:to-amber-400 text-white font-black text-sm shadow-lg cursor-pointer disabled:opacity-50"
                >
                  {fullBookLoading
                    ? '⏳ Google 4 旗艦大腦（暢銷作家代理）正在聯網檢索、撰寫 8 大篇章雙語內文並配置高解析插圖中（約需 12~20 秒）...'
                    : '🔥 一鍵由 Google 4 旗艦大腦編撰 25+ 頁全球權威圖文書（8大篇章 + 配圖 + 來源參照）'}
                </button>
              </div>

              {/* 模式 B：單章擴寫 */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <div className="text-xs font-bold text-purple-300">
                  ➕ 【模式 B：單一章節深度撰寫（含插圖建議與數據參照）】
                </div>
                <input
                  type="text"
                  placeholder="輸入新章節標題（例如：第五章：如何用短影音打造自動被動收入）"
                  value={newChapterTitle}
                  onChange={e => setNewChapterTitle(e.target.value)}
                  className="w-full bg-gray-900/90 border border-purple-500/40 rounded-xl px-4 py-2.5 text-sm text-white"
                />
                <textarea
                  rows={2}
                  placeholder="輸入本章大綱要點、關鍵字或草稿段落..."
                  value={outlinePrompt}
                  onChange={e => setOutlinePrompt(e.target.value)}
                  className="w-full bg-gray-900/90 border border-purple-500/40 rounded-xl px-4 py-2.5 text-sm text-white"
                />
                <button
                  onClick={handleAiGenerateChapter}
                  disabled={aiLoading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg cursor-pointer disabled:opacity-50"
                >
                  {aiLoading ? '⏳ Google 4 旗艦大腦撰寫與翻譯章節中...' : '✨ 新增並由 Google 4 擴寫此圖文章節'}
                </button>
              </div>

              {/* 現有章節列表 */}
              <div className="mt-6 space-y-4">
                <div className="text-xs font-bold text-gray-400 uppercase">
                  目前已建立章節 ({currentBook.chapters.length} 章)
                </div>
                {currentBook.chapters.map((ch, idx) => (
                  <div key={ch.id} className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-pink-400">Chapter 0{idx + 1}</span>
                      <button
                        onClick={() =>
                          setCurrentBook(prev => ({
                            ...prev,
                            chapters: prev.chapters.filter(c => c.id !== ch.id)
                          }))
                        }
                        className="text-xs text-red-400 hover:underline cursor-pointer"
                      >
                        刪除此章
                      </button>
                    </div>
                    <input
                      type="text"
                      value={ch.title_zh}
                      onChange={e => {
                        const updated = [...currentBook.chapters];
                        updated[idx].title_zh = e.target.value;
                        setCurrentBook({ ...currentBook, chapters: updated });
                      }}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-sm font-bold text-white"
                    />
                    <textarea
                      rows={3}
                      value={ch.content_zh}
                      onChange={e => {
                        const updated = [...currentBook.chapters];
                        updated[idx].content_zh = e.target.value;
                        setCurrentBook({ ...currentBook, chapters: updated });
                      }}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-200"
                    />
                    {/* 章節配圖上傳至專用 R2 (1.5208.uk / pub-2006e181b8544782b8d026affdaa34ab.r2.dev) 與圖說/參照預覽 */}
                    <div className="flex flex-col gap-2 pt-1 border-t border-white/5">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <label className="text-[11px] font-bold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/70 border border-cyan-500/40 px-3 py-1.5 rounded-lg cursor-pointer">
                          🖼️ 自訂上傳本章圖片至專用 R2
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => {
                              const f = e.target.files?.[0];
                              if (f) handleUploadToDedicatedR2(f, 'CHAPTER_IMAGE', idx);
                            }}
                          />
                        </label>
                        {ch.image_url && (
                          <a
                            href={ch.image_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-emerald-300 underline truncate max-w-xs"
                          >
                            ✅ 已配置圖片：{ch.image_url}
                          </a>
                        )}
                      </div>
                      {ch.image_caption && (
                        <div className="text-[11px] text-gray-400 italic">
                          📷 圖說：{ch.image_caption}
                        </div>
                      )}
                      {ch.references && ch.references.length > 0 && (
                        <div className="text-[11px] text-cyan-400/90">
                          📚 參照來源：{ch.references.map(r => r.title).join(' ｜ ')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 右側：自行下載電子書母檔 ＋ 送交後台書審 (5 欄) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Step 3: 自行下載電子書母檔 & 提交 3~7 天書審 */}
            <div className="bg-white/5 border border-cyan-500/40 rounded-3xl p-6 sticky top-24">
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                  狀態：{currentBook.status === 'APPROVED_PUBLISHED' ? '✅ 書審通過・已上架' : currentBook.status === 'PENDING_REVIEW' ? '⏳ 總後台書審中 (3~7天)' : currentBook.status === 'REJECTED_BANNED' ? '🚨 違規下架封鎖' : '📝 編輯草稿中'}
                </span>
                <span className="text-xs text-gray-400">ID: {currentBook.id}</span>
              </div>

              <h3 className="text-xl font-black text-white mb-2">
                STEP 3：📥 加盟商自行下載電子書 ＆ 送交書審
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed mb-4">
                您可以隨時將製作好的電子書<strong>直接下載回您的電腦/手機保存或印刷</strong>；若要在微享讀者書櫃上架銷售並啟動 AI 自動來客廣告，請點擊下方「提交總後台書審（審核時間 3~7 天）」。
              </p>

              {/* 單書 30 次修改計數器與 $30 加購 1 次修改權限面板 */}
              <div className="p-3.5 rounded-2xl bg-purple-950/50 border border-purple-500/40 mb-4 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-purple-300">
                    ✏️ 本書修改次數配額（含完稿後再修改）
                  </div>
                  <div className="text-sm font-black text-white mt-0.5">
                    已修改 {currentBook.edit_count ?? 0} / {currentBook.edit_quota_max ?? 30} 次
                    <span className="text-[11px] font-normal text-gray-400 ml-2">
                      (滿30次後需付$30可修改1次)
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleUpgradeAction('ADD_1_EDIT_30')}
                  className="px-3 py-2 rounded-xl bg-purple-600/40 hover:bg-purple-600/60 border border-purple-400 text-purple-200 text-xs font-bold shrink-0 cursor-pointer"
                >
                  ➕ 付 $30 加購 1 次修改
                </button>
              </div>

              {/* 加盟商自行下載雙按鈕（含 3 版語系選擇：雙語對照版 / 第一語系純版 / 第二語系純版） */}
              <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 mb-5 space-y-3">
                <div className="text-xs font-bold text-cyan-300">
                  📥 【功能 A：加盟商自行下載電子書母檔（共 3 版語系，免等書審立即可下）】
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setExportLangMode('BILINGUAL')}
                    className={`py-2 px-1.5 rounded-lg text-[11px] font-black border transition-all cursor-pointer ${
                      exportLangMode === 'BILINGUAL'
                        ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-md'
                        : 'bg-black/40 text-gray-300 border-white/15 hover:border-cyan-400/50'
                    }`}
                  >
                    {currentBook.lang_pair === 'JA_EN' ? '🇯🇵/🇺🇸 日英雙語' : currentBook.lang_pair === 'ZH_JA' ? '🇹🇼/🇯🇵 中日雙語' : '🇹🇼/🇺🇸 中英雙語'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setExportLangMode(currentBook.lang_pair === 'JA_EN' ? 'JA_ONLY' : 'ZH_ONLY')}
                    className={`py-2 px-1.5 rounded-lg text-[11px] font-black border transition-all cursor-pointer ${
                      (currentBook.lang_pair === 'JA_EN' ? exportLangMode === 'JA_ONLY' : exportLangMode === 'ZH_ONLY')
                        ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-md'
                        : 'bg-black/40 text-gray-300 border-white/15 hover:border-cyan-400/50'
                    }`}
                  >
                    {currentBook.lang_pair === 'JA_EN' ? '🇯🇵 純日文版' : '🇹🇼 純繁中文版'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setExportLangMode(currentBook.lang_pair === 'ZH_JA' ? 'JA_ONLY' : 'EN_ONLY')}
                    className={`py-2 px-1.5 rounded-lg text-[11px] font-black border transition-all cursor-pointer ${
                      (currentBook.lang_pair === 'ZH_JA' ? exportLangMode === 'JA_ONLY' : exportLangMode === 'EN_ONLY')
                        ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-md'
                        : 'bg-black/40 text-gray-300 border-white/15 hover:border-cyan-400/50'
                    }`}
                  >
                    {currentBook.lang_pair === 'ZH_JA' ? '🇯🇵 純日文版' : '🇺🇸 純英文版'}
                  </button>
                </div>
                <button
                  onClick={() => handleDownloadMasterBook(currentBook, true, exportLangMode)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-sm shadow-lg cursor-pointer"
                >
                  🖨️ 一鍵導出 / 下載「{exportLangMode === 'BILINGUAL' ? (currentBook.lang_pair === 'JA_EN' ? '日/英雙語對照版' : currentBook.lang_pair === 'ZH_JA' ? '繁中/日雙語對照版' : '中/英雙語對照版') : exportLangMode === 'JA_ONLY' ? '純日文版' : exportLangMode === 'ZH_ONLY' ? '純繁體中文版' : '純英文版'} 精裝 PDF」
                </button>
                <button
                  onClick={() => handleDownloadMasterBook(currentBook, false, exportLangMode)}
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs cursor-pointer"
                >
                  💾 下載「{exportLangMode === 'BILINGUAL' ? (currentBook.lang_pair === 'JA_EN' ? '日/英雙語對照版' : currentBook.lang_pair === 'ZH_JA' ? '繁中/日雙語對照版' : '中/英雙語對照版') : exportLangMode === 'JA_ONLY' ? '純日文版' : exportLangMode === 'ZH_ONLY' ? '純繁體中文版' : '純英文版'} 獨立網頁母檔 (.html)」
                </button>

                {/* 離線修改後重新上傳至專用 R2 儲存槽（算 1 次修改額度） */}
                <div className="pt-3 mt-3 border-t border-cyan-500/30 space-y-2">
                  <div className="text-[11px] font-bold text-emerald-300">
                    ☁️ 【離線修改後重新上傳（含圖及文章 ➔ 算 1 次修改額度）】
                  </div>
                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    您可先下載上方母檔自行修改圖文，完成後點擊下方按鈕重新上傳至專用 R2 儲存槽（<code className="text-cyan-300">1.5208.uk</code> / <code className="text-cyan-300">pub-2006e181b8544782b8d026affdaa34ab.r2.dev</code>）：
                  </p>
                  <label className="w-full py-2.5 px-3 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-400 text-emerald-200 font-black text-xs flex items-center justify-center gap-2 cursor-pointer">
                    <span>{r2Uploading ? '⏳ 正在上傳至專用 R2 儲存槽...' : '📤 上傳修改後之電子書母檔 (.html / .pdf) ➔ 算 1 次修改額'}</span>
                    <input
                      type="file"
                      accept=".html,.htm,.pdf,.json"
                      disabled={r2Uploading}
                      className="hidden"
                      onChange={e => {
                        const f = e.target.files?.[0];
                        if (f) handleUploadToDedicatedR2(f, 'MODIFIED_BOOK_REUPLOAD');
                      }}
                    />
                  </label>
                  {currentBook.r2_published_urls && (
                    <div className="p-2.5 rounded-xl bg-black/50 border border-emerald-500/30 text-[11px] space-y-1">
                      <div className="font-bold text-emerald-300">✅ 專用 R2 儲存槽已同步網址：</div>
                      <div className="truncate">
                        1. <a href={currentBook.r2_published_urls.primary_url} target="_blank" rel="noreferrer" className="text-cyan-300 underline">{currentBook.r2_published_urls.primary_url}</a>
                      </div>
                      <div className="truncate">
                        2. <a href={currentBook.r2_published_urls.mirror_url} target="_blank" rel="noreferrer" className="text-cyan-300 underline">{currentBook.r2_published_urls.mirror_url}</a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 儲存與送交 3~7 天書審按鈕 */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="text-xs font-bold text-amber-300">
                  🚀 【功能 B：雲端儲存與提交總管理後台「書審 (3~7天)」】
                </div>
                <button
                  onClick={() => handleSaveOrSubmit(false)}
                  disabled={savingLoading}
                  className="w-full py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white font-bold text-xs cursor-pointer"
                >
                  💾 僅儲存雲端草稿
                </button>
                <button
                  onClick={() => handleSaveOrSubmit(true)}
                  disabled={savingLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-400 hover:to-amber-400 text-white font-black text-sm shadow-[0_0_25px_rgba(236,72,153,0.4)] cursor-pointer"
                >
                  ⚖️ 提交至管理後台「書審」(書審時間 3~7 天)
                </button>
              </div>

              {/* 已建立之電子書清單與書審狀態追蹤 */}
              <div className="mt-6 pt-5 border-t border-white/10">
                <div className="text-xs font-bold text-gray-400 mb-3">
                  📚 我的電子書庫與書審進度 ({books.length} 本)
                </div>
                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {books.map(b => (
                    <div
                      key={b.id}
                      onClick={() => setCurrentBook(b)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        currentBook.id === b.id
                          ? 'bg-pink-500/15 border-pink-400'
                          : 'bg-black/40 border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="flex justify-between items-center gap-2">
                        <span className="font-bold text-xs text-white truncate">{b.title_zh}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                            b.status === 'APPROVED_PUBLISHED'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : b.status === 'PENDING_REVIEW'
                              ? 'bg-amber-500/20 text-amber-300'
                              : b.status === 'REJECTED_BANNED'
                              ? 'bg-red-500/30 text-red-300'
                              : 'bg-gray-700 text-gray-300'
                          }`}
                        >
                          {b.status === 'APPROVED_PUBLISHED'
                            ? '✅ 已上架'
                            : b.status === 'PENDING_REVIEW'
                            ? '⏳ 書審中(3~7天)'
                            : b.status === 'REJECTED_BANNED'
                            ? '🚨 違規封鎖'
                            : '草稿'}
                        </span>
                      </div>
                      {b.review_note && (
                        <div className="text-[11px] text-gray-400 mt-1">後台備註：{b.review_note}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
