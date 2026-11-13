'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { EBookProject, generateStandaloneEBookHTML, getEBookLocalizedContent } from '@/lib/ebookEngine';
import PayUniButton from '@/components/PayUniButton';
import PayPalButton from '@/components/PayPalButton';

export default function ReaderEBookStorePage() {
  const { lang } = useLanguage();
  const [books, setBooks] = useState<EBookProject[]>([]);
  const [selectedBook, setSelectedBook] = useState<EBookProject | null>(null);
  const [readerEmail, setReaderEmail] = useState('');
  const [unlockedBookIds, setUnlockedBookIds] = useState<string[]>([]);
  const [readerSigs, setReaderSigs] = useState<Record<string, string>>({});
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState<string | null>(null);
  const [readingModeLang, setReadingModeLang] = useState<'AUTO' | 'BILINGUAL' | 'ZH_TW' | 'ZH_CN' | 'EN' | 'JA' | 'VI' | 'ID'>('AUTO');
  const [settlementNotice, setSettlementNotice] = useState<string | null>(null);
  const [storePlanMode, setStorePlanMode] = useState<'SINGLE' | 'MONTHLY'>('SINGLE');
  const [copiedBookLink, setCopiedBookLink] = useState(false);

  // 決定目前閱讀器所採用的語系
  const effectiveLang =
    readingModeLang === 'AUTO'
      ? lang
      : readingModeLang === 'ZH_TW'
      ? 'zh-TW'
      : readingModeLang === 'ZH_CN'
      ? 'zh-CN'
      : readingModeLang === 'EN'
      ? 'en-US'
      : readingModeLang === 'JA'
      ? 'ja-JP'
      : readingModeLang === 'VI'
      ? 'vi-VN'
      : readingModeLang === 'ID'
      ? 'id-ID'
      : lang;

  const isBilingual = readingModeLang === 'BILINGUAL';

  // 多語系介面字典
  const t = {
    backHome: {
      'zh-TW': '← 回微享首頁',
      'zh-CN': '← 回微享首页',
      'en-US': '← Back to Home',
      'ja-JP': '← トップページへ',
      'vi-VN': '← Về Trang Chủ',
      'id-ID': '← Kembali ke Beranda',
      'ko-KR': '← 홈으로'
    }[lang] || '← Back to Home',
    headerTitle: {
      'zh-TW': '📖 微享全球讀者 VIP 訂閱書櫃 (/ebook-store)',
      'zh-CN': '📖 微享全球读者 VIP 订阅书柜 (/ebook-store)',
      'en-US': '📖 WeiXiang Global VIP Reader Bookshelf (/ebook-store)',
      'ja-JP': '📖 WeiXiang 全球VIP読者本棚 (/ebook-store)',
      'vi-VN': '📖 Kệ Sách VIP Độc Giả Toàn Cầu (/ebook-store)',
      'id-ID': '📖 Rak Buku VIP Pembaca Global (/ebook-store)',
      'ko-KR': '📖 WeiXiang 글로벌 VIP 독자 서재 (/ebook-store)'
    }[lang] || '📖 WeiXiang Global VIP Reader Bookshelf (/ebook-store)',
    studioBtn: {
      'zh-TW': '🛠️ 我是加盟商・前往出書工作台',
      'zh-CN': '🛠️ 我是加盟商・前往出书工作台',
      'en-US': '🛠️ Creator Studio (/studio)',
      'ja-JP': '🛠️ 加盟店スタジオへ (/studio)',
      'vi-VN': '🛠️ Bàn làm việc Tác giả (/studio)',
      'id-ID': '🛠️ Studio Mitra (/studio)',
      'ko-KR': '🛠️ 크리에이터 스튜디오 (/studio)'
    }[lang] || '🛠️ Creator Studio (/studio)',
    shelfTitle: (count: number) => {
      if (lang === 'ja-JP') return `✨ 公式審査承認済・AIクラウド教室 (vip.5208.uk) × 公式サイト (nft1314.party) 2サイト共同展示販売 (${count} 冊)`;
      if (lang === 'zh-CN') return `✨ 已通过总后台书审・AI 云教室 (vip.5208.uk) × 微享官网 (nft1314.party) 双站联合展售 (${count} 本)`;
      if (lang === 'vi-VN') return `✨ E-Book Đã Duyệt・Triển lãm Liên hợp 2 Web vip.5208.uk × nft1314.party (${count} Cuốn)`;
      if (lang === 'id-ID') return `✨ E-Book Resmi・Pameran Gabungan 2 Situs vip.5208.uk × nft1314.party (${count} Buku)`;
      if (lang === 'en-US') return `✨ Approved E-Books · AI Cloud Classroom (vip.5208.uk) × Official Site (nft1314.party) Dual-Site Exhibition (${count} Books)`;
      return `✨ 已通過總後台書審・AI 雲教室 (vip.5208.uk) × 微享官網 (nft1314.party) 雙站聯合展售 (${count} 本)`;
    },
    approvedBadge: {
      'zh-TW': '✅ 官方書審通過',
      'zh-CN': '✅ 官方书审通过',
      'en-US': '✅ Review Approved',
      'ja-JP': '✅ 審査承認済',
      'vi-VN': '✅ Đã Duyệt Chính Thức',
      'id-ID': '✅ Lolos Uji Resmi',
      'ko-KR': '✅ 공식 심사 통과'
    }[lang] || '✅ Review Approved',
    buySingle: {
      'zh-TW': '單購',
      'zh-CN': '单购',
      'en-US': 'Buy',
      'ja-JP': '単品',
      'vi-VN': 'Mua lẻ',
      'id-ID': 'Beli',
      'ko-KR': '단권'
    }[lang] || 'Buy',
    subscribe: {
      'zh-TW': '訂閱',
      'zh-CN': '订阅',
      'en-US': 'Sub',
      'ja-JP': '月額',
      'vi-VN': 'Đăng ký',
      'id-ID': 'Langganan',
      'ko-KR': '구독'
    }[lang] || 'Sub',
    month: {
      'zh-TW': '/月',
      'zh-CN': '/月',
      'en-US': '/mo',
      'ja-JP': '/月',
      'vi-VN': '/tháng',
      'id-ID': '/bln',
      'ko-KR': '/월'
    }[lang] || '/mo',
    unlocked: {
      'zh-TW': '🔓 已解鎖閱讀',
      'zh-CN': '🔓 已解锁阅读',
      'en-US': '🔓 Unlocked',
      'ja-JP': '🔓 閲覧可能',
      'vi-VN': '🔓 Đã Mở Khóa Đọc',
      'id-ID': '🔓 Akses Terbuka',
      'ko-KR': '🔓 열람 가능'
    }[lang] || '🔓 Unlocked',
    locked: {
      'zh-TW': '🔒 點擊購買',
      'zh-CN': '🔒 点击购买',
      'en-US': '🔒 Purchase',
      'ja-JP': '🔒 購入する',
      'vi-VN': '🔒 Mua Ngay',
      'id-ID': '🔒 Beli Sekarang',
      'ko-KR': '🔒 구매하기'
    }[lang] || '🔒 Purchase',
    readerAuthEmail: {
      'zh-TW': '讀者授權信箱 (用於動態浮水印與自動發貨)',
      'zh-CN': '读者授权信箱 (用于动态水印与自动发货)',
      'en-US': 'Reader Email (for dynamic watermark & instant delivery)',
      'ja-JP': '読者認証メールアドレス (動的透かし＆自動配信)',
      'vi-VN': 'Email Độc giả (dùng cho hình mờ động & giao hàng)',
      'id-ID': 'Email Pembaca (untuk watermark dinamis & pengiriman)',
      'ko-KR': '독자 인증 이메일 (워터마크 및 자동 발송용)'
    }[lang] || 'Reader Email (for dynamic watermark & instant delivery)',
    testSingleBuy: (price: number) => {
      if (lang === 'ja-JP') return `⚡ ワンクリック体験：単品購入 ($${price}) ＆ 10%手数料100%相殺テスト`;
      if (lang === 'zh-CN') return `⚡ 一键体验：单本买断 ($${price}) 并测试 $990 倒抵 10% 服务费`;
      if (lang === 'vi-VN') return `⚡ Trải nghiệm Ngay: Mua Đứt ($${price}) & Kiểm tra Cấn trừ 10% Phí`;
      if (lang === 'id-ID') return `⚡ Coba Sekarang: Beli Tunggal ($${price}) & Uji Pengurangan 10% Biaya`;
      if (lang === 'en-US') return `⚡ Instant Test: Buy Once ($${price}) & Test 100% Fee Offset`;
      return `⚡ 一鍵體驗：單本買斷 ($${price}) 並測試 $990 倒抵 10% 服務費`;
    },
    testSubBuy: (price: number) => {
      if (lang === 'ja-JP') return `📅 ワンクリック体験：VIP月額購読 ($${price}/月) 全本棚アンロック`;
      if (lang === 'zh-CN') return `📅 一键体验：VIP 月费订阅 ($${price}/月) 解锁全书柜`;
      if (lang === 'vi-VN') return `📅 Trải nghiệm Ngay: VIP Hàng Tháng ($${price}/tháng) Mở khóa Toàn bộ`;
      if (lang === 'id-ID') return `📅 Coba Sekarang: Langganan VIP Bulanan ($${price}/bln) Buka Semua`;
      if (lang === 'en-US') return `📅 Instant Test: VIP Monthly ($${price}/mo) Unlock All Books`;
      return `📅 一鍵體驗：VIP 月費訂閱 ($${price}/月) 解鎖全書櫃`;
    },
    downloadPdf: (email: string) => {
      if (lang === 'ja-JP') return `🖨️ 透かし入り精装PDFをダウンロード (${email})`;
      if (lang === 'zh-CN') return `🖨️ 下载授权水印精装 PDF (${email})`;
      if (lang === 'vi-VN') return `🖨️ Tải Xuống PDF Có Hình Mờ (${email})`;
      if (lang === 'id-ID') return `🖨️ Unduh PDF Resmi Ber-watermark (${email})`;
      if (lang === 'en-US') return `🖨️ Download Watermarked PDF (${email})`;
      return `🖨️ 下載授權浮水印精裝 PDF (${email})`;
    },
    readerShield: {
      'zh-TW': '🛡️ 防盜版加密線上閱讀器',
      'zh-CN': '🛡️ 防盗版加密在线阅读器',
      'en-US': '🛡️ Anti-Piracy Encrypted Online Reader',
      'ja-JP': '🛡️ 海賊版防止 暗号化オンラインリーダー',
      'vi-VN': '🛡️ Trình Đọc Mã Hóa Chống Sao Chép',
      'id-ID': '🛡️ Pembaca Online Terenkripsi Anti-Pembajakan',
      'ko-KR': '🛡️ 불법 복제 방지 암호화 온라인 뷰어'
    }[lang] || '🛡️ Anti-Piracy Encrypted Online Reader',
    authorLeadLink: {
      'zh-TW': '作者導流連結：',
      'zh-CN': '作者导流链接：',
      'en-US': 'Author Funnel Link:',
      'ja-JP': '著者導線リンク：',
      'vi-VN': 'Liên kết Kênh Tác giả:',
      'id-ID': 'Tautan Corong Penulis:',
      'ko-KR': '저자 링크:'
    }[lang] || 'Author Funnel Link:',
    reportBtn: {
      'zh-TW': '🚩 檢舉本書違反全球 10 大禁書條款',
      'zh-CN': '🚩 检举本书违反全球 10 大禁书条款',
      'en-US': '🚩 Report Book Violation (10 Global Banned Rules)',
      'ja-JP': '🚩 世界10大禁止図書違反を通報する',
      'vi-VN': '🚩 Báo cáo Vi phạm 10 Tiêu chí Cấm Toàn cầu',
      'id-ID': '🚩 Laporkan Pelanggaran 10 Aturan Terlarang',
      'ko-KR': '🚩 10대 금지 규정 위반 신고'
    }[lang] || '🚩 Report Book Violation'
  };

  const loadStoreWithAccess = async (
    emailToCheck: string,
    sigToCheck?: string | null,
    targetBookId?: string | null,
    explicitVerify = false
  ) => {
    const cleanEmail = emailToCheck.trim().toLowerCase();
    if (explicitVerify) {
      setVerifyingEmail(true);
      setVerifyMsg(null);
    }
    try {
      const qs = new URLSearchParams();
      if (cleanEmail) qs.set('readerEmail', cleanEmail);
      if (sigToCheck) qs.set('sig', sigToCheck);
      if (targetBookId) qs.set('bookId', targetBookId);

      const url = `/api/ebook${qs.toString() ? `?${qs.toString()}` : ''}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.store?.books) {
        const published = data.store.books.filter(
          (b: EBookProject) => b.status === 'APPROVED_PUBLISHED'
        );
        setBooks(published);
        const unlocked: string[] = Array.isArray(data.unlockedBooks) ? data.unlockedBooks : [];
        const sigs: Record<string, string> =
          data.readerSigs && typeof data.readerSigs === 'object' ? data.readerSigs : {};
        setUnlockedBookIds(unlocked);
        setReaderSigs(sigs);

        if (published.length > 0) {
          setSelectedBook(prev => {
            if (targetBookId) {
              const matched = published.find((b: EBookProject) => b.id === targetBookId);
              if (matched) return matched;
            }
            if (prev) {
              const refreshedPrev = published.find((b: EBookProject) => b.id === prev.id);
              if (refreshedPrev) return refreshedPrev;
            }
            return published[0];
          });
        }

        if (explicitVerify) {
          if (cleanEmail) {
            try {
              localStorage.setItem('weixiang_user_email', cleanEmail);
            } catch {}
          }
          const isMatchedUnlocked =
            unlocked.includes('ALL_VIP') ||
            (targetBookId ? unlocked.includes(targetBookId) : unlocked.length > 0);
          if (isMatchedUnlocked) {
            setVerifyMsg('✅ 購買資格驗證成功！已為您解鎖完整章節與授權浮水印閱讀/下載權限。');
          } else {
            setVerifyMsg(
              '⚠️ 查無此信箱的已付款購買紀錄，請確認輸入與結帳時相同的 Email，或於上方完成付款立即自動開通。'
            );
          }
        }
      }
    } catch (err) {
      console.error(err);
      if (explicitVerify) {
        setVerifyMsg('❌ 驗證連線異常，請稍後再試。');
      }
    } finally {
      if (explicitVerify) setVerifyingEmail(false);
    }
  };

  const isBookUnlocked = (bookId?: string | null) => {
    if (!bookId) return false;
    return unlockedBookIds.includes('ALL_VIP') || unlockedBookIds.includes(bookId);
  };

  const resolveReaderMode = () => {
    if (readingModeLang !== 'AUTO') return readingModeLang;
    if (lang === 'zh-TW') return 'ZH_TW';
    if (lang === 'zh-CN') return 'ZH_CN';
    if (lang === 'ja-JP') return 'JA';
    if (lang === 'vi-VN') return 'VI';
    if (lang === 'id-ID') return 'ID';
    if (lang === 'en-US') return 'EN';
    return 'BILINGUAL';
  };

  const buildReaderUrl = (bookId: string, printMode = false) => {
    const cleanEmail = readerEmail.trim().toLowerCase();
    const sig = readerSigs[bookId] || readerSigs['ALL_VIP'] || '';
    const qs = new URLSearchParams({
      book: bookId,
      mode: resolveReaderMode()
    });
    if (cleanEmail) qs.set('email', cleanEmail);
    if (sig) qs.set('sig', sig);
    if (printMode) qs.set('print', '1');
    return `/api/ebook/reader?${qs.toString()}`;
  };

  useEffect(() => {
    let targetBookParam: string | null = null;
    let initialEmail = '';
    let initialSig: string | null = null;
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search);
      targetBookParam = sp.get('book');
      const refParam = sp.get('ref');
      if (refParam && refParam.trim()) {
        localStorage.setItem('weixiang_referrer', refParam.trim());
      }
      const emailParam = sp.get('email');
      initialSig = sp.get('sig');
      initialEmail = (emailParam || localStorage.getItem('weixiang_user_email') || '').trim();
      if (initialEmail) {
        setReaderEmail(initialEmail);
      }
    }
    loadStoreWithAccess(initialEmail, initialSig, targetBookParam, false);
  }, []);

  // 分潤與 100% 倒抵試算預覽（不跳過付費牆解鎖）
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
      setVerifyMsg(
        '📊 【100% 抵扣與 25% 聯盟分潤公式試算完成】（僅供試算預覽，欲解鎖閱讀與下載請完成上方 PayUni / PayPal 真實付款）'
      );
      const s = data.settlement;
      const bd = s.affiliateBreakdown;
      setSettlementNotice(
        `🎉 讀者結帳成功（$${s.orderAmount} USDT）！系統自動執行雙軌結算：【1】1成 (10%) 系統服務費（含提款與推廣服務費）$${s.originalFee10Pct} 已由加盟商抵用金扣抵 $${s.deductedFromCredit}（實收系統費 $${s.actualPlatformFeeCharged}）；【2】另支出「推廣服務費 25%」$${s.affiliateFee25Pct}（若為非推廣者訪客下單，系統自動綁定最高 10% 級差獎金 $${bd?.differential10Pct ?? (s.orderAmount * 0.1).toFixed(2)} ＋ 10% 對等獎金 $${bd?.matching10Pct ?? (s.orderAmount * 0.1).toFixed(2)} ＋ 永久 5% 均分全球分紅 $${bd?.globalPool5Pct ?? (s.orderAmount * 0.05).toFixed(2)}）➔ 加盟商本筆實拿淨額 $${s.authorNetReceived} USDT（剩餘抵用金 $${s.remainingCreditBalance} USDT）！`
      );
    }
  };

  // 讀者下載含購買者專屬浮水印之精裝 PDF（依原本設計的語系模式下載）
  const handleReaderDownloadPDF = (book: EBookProject) => {
    const downloadMode = isBilingual ? 'BILINGUAL' : 'ZH_ONLY';
    const html = generateStandaloneEBookHTML(book, readerEmail || 'VIP Reader', downloadMode);
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

  const selectedLocalized = selectedBook ? getEBookLocalizedContent(selectedBook, effectiveLang) : null;

  return (
    <div className="min-h-screen bg-[#07080d] text-white font-sans pb-24">
      {/* 頂部導覽 */}
      <header className="sticky top-0 z-40 bg-[#07080d]/90 backdrop-blur-lg border-b border-white/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs sm:text-sm text-gray-300 hover:text-white px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer font-bold shrink-0"
            >
              {t.backHome}
            </Link>
            <h1 className="text-base sm:text-xl md:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 truncate">
              {t.headerTitle}
            </h1>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            {/* 站點全局語系切換器 */}
            <LanguageSwitcher />

            <Link
              href="/studio"
              className="px-3.5 py-1.5 md:py-2 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/50 text-pink-300 text-xs font-bold transition-all cursor-pointer"
            >
              {t.studioBtn}
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
          <h2 className="text-lg sm:text-xl font-black text-white mb-4">
            {t.shelfTitle(books.length)}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {books.map(book => {
              const isUnlocked = isBookUnlocked(book.id);
              const loc = getEBookLocalizedContent(book, effectiveLang);

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
                        {t.approvedBadge}
                      </span>
                      <span className="text-xs text-gray-400">{book.author_name}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-white mb-1 line-clamp-2">
                      {loc.title}
                    </h3>
                    <p className="text-xs text-cyan-300 mb-2 truncate">
                      {book.title_en || book.title_zh}
                    </p>
                    <p className="text-xs text-gray-400 line-clamp-2">
                      {loc.subtitle}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-400">{t.buySingle} </span>
                      <span className="text-lg font-black text-emerald-400">${book.price_single_usdt}</span>
                      <span className="text-xs text-gray-400 ml-2">｜{t.subscribe} </span>
                      <span className="text-sm font-bold text-pink-400">${book.price_monthly_sub_usdt}{t.month}</span>
                    </div>
                    <span className="text-xs font-bold text-cyan-300">
                      {isUnlocked ? t.unlocked : t.locked}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 選中書籍之「VIP 線上防盜版雙語/多語系閱讀器 ＋ 購買訂閱面板」 */}
        {selectedBook && selectedLocalized && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* 左側：購買/訂閱與浮水印下載控制列 (4 欄) */}
            <div className="lg:col-span-4 space-y-5">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  READER SUBSCRIPTION & DOWNLOAD
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1 mb-1 leading-snug">
                  {selectedLocalized.title}
                </h3>
                <p className="text-xs text-gray-400 mb-4">
                  作者：{selectedBook.author_name}
                </p>

                <div className="mb-4">
                  <label className="block text-xs text-gray-400 mb-1">
                    {t.readerAuthEmail}
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      value={readerEmail}
                      onChange={e => setReaderEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                    <button
                      type="button"
                      disabled={verifyingEmail}
                      onClick={() => {
                        if (!readerEmail.trim() || !readerEmail.includes('@')) {
                          setVerifyMsg('⚠️ 請先輸入有效的購買 Email 信箱');
                          return;
                        }
                        loadStoreWithAccess(readerEmail, null, selectedBook?.id || null, true);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs whitespace-nowrap cursor-pointer transition-colors"
                    >
                      {verifyingEmail ? '驗證中...' : '🔍 驗證購買資格解鎖'}
                    </button>
                  </div>
                  {verifyMsg && (
                    <p className="mt-2 text-[11px] leading-relaxed text-amber-300 bg-amber-950/40 border border-amber-500/30 rounded-lg px-2.5 py-1.5">
                      {verifyMsg}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setStorePlanMode('SINGLE')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      storePlanMode === 'SINGLE' ? 'bg-emerald-500/20 border-emerald-400' : 'bg-black/40 border-white/10'
                    }`}
                  >
                    <span className="text-[11px] text-emerald-300 font-bold block">單本永久買斷</span>
                    <span className="text-lg font-black text-white">${selectedBook.price_single_usdt} USDT</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStorePlanMode('MONTHLY')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      storePlanMode === 'MONTHLY' ? 'bg-pink-500/20 border-pink-400' : 'bg-black/40 border-white/10'
                    }`}
                  >
                    <span className="text-[11px] text-pink-300 font-bold block">VIP 專欄月閱</span>
                    <span className="text-lg font-black text-pink-300">${selectedBook.price_monthly_sub_usdt} /月</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <PayUniButton
                    packageId={storePlanMode === 'SINGLE' ? 991 : 992}
                    priceInUSDT={storePlanMode === 'SINGLE' ? selectedBook.price_single_usdt : selectedBook.price_monthly_sub_usdt}
                    productType="EBOOK_PURCHASE"
                    productName={`${storePlanMode === 'SINGLE' ? '電子書單本買斷' : 'VIP電子書專欄月閱'}：${selectedLocalized.title}`}
                    bookId={selectedBook.id}
                  />
                  <PayPalButton
                    packageId={storePlanMode === 'SINGLE' ? 991 : 992}
                    priceInUSDT={storePlanMode === 'SINGLE' ? selectedBook.price_single_usdt : selectedBook.price_monthly_sub_usdt}
                    productType="EBOOK_PURCHASE"
                    productName={`${storePlanMode === 'SINGLE' ? 'EBook Buyout' : 'VIP EBook Monthly'}: ${selectedLocalized.title}`}
                    bookId={selectedBook.id}
                  />

                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window === 'undefined') return;
                      const savedRef = localStorage.getItem('weixiang_referrer') || selectedBook.author_wallet || '0xea693e358f1527f8aa6563c9f6ebd42e37ee14fc';
                      const url = `${window.location.origin}/ebook-store?book=${encodeURIComponent(selectedBook.id)}&ref=${encodeURIComponent(savedRef)}`;
                      navigator.clipboard.writeText(url);
                      setCopiedBookLink(true);
                      setTimeout(() => setCopiedBookLink(false), 3000);
                    }}
                    className="w-full py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-200 font-black text-xs cursor-pointer text-center"
                  >
                    {copiedBookLink ? '✅ 已複製本書專屬推廣連結 (自動綁定 25% 分潤)！' : '📣 複製本書專屬推廣連結 (分享享 25% 推廣分潤)'}
                  </button>

                  <button
                    onClick={() => handleSimulateUnlock(selectedBook, false)}
                    className="w-full py-3 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-400 text-emerald-200 font-bold text-xs cursor-pointer text-center"
                  >
                    {t.testSingleBuy(selectedBook.price_single_usdt)}
                  </button>

                  <button
                    onClick={() => handleSimulateUnlock(selectedBook, true)}
                    className="w-full py-3 rounded-xl bg-pink-600/30 hover:bg-pink-600/50 border border-pink-400 text-pink-200 font-bold text-xs cursor-pointer text-center"
                  >
                    {t.testSubBuy(selectedBook.price_monthly_sub_usdt)}
                  </button>
                </div>

                {isBookUnlocked(selectedBook.id) && (
                  <div className="mt-6 pt-5 border-t border-white/10 space-y-2.5">
                    <div className="text-xs font-bold text-cyan-300">
                      📥 VIP 讀者專屬閱讀與浮水印下載（已授權：{readerEmail || 'VIP 會員'}）
                    </div>
                    <a
                      href={buildReaderUrl(selectedBook.id, false)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs shadow-lg transition-all"
                    >
                      🌐 開啟防盜版獨立閱讀器（全文解鎖）
                    </a>
                    <a
                      href={buildReaderUrl(selectedBook.id, true)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs shadow-lg transition-all"
                    >
                      🖨️ {t.downloadPdf(readerEmail || 'VIP')}
                    </a>
                    <button
                      type="button"
                      onClick={() => handleReaderDownloadPDF(selectedBook)}
                      className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-gray-300 font-bold text-[11px] cursor-pointer transition-colors"
                    >
                      ⚡ 瀏覽器快速預覽列印本頁
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 右側：防盜版線上多語系/雙語閱讀器 (8 欄) */}
            <div className="lg:col-span-8">
              <div
                onContextMenu={e => e.preventDefault()}
                className="bg-[#0f172a] border border-cyan-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl select-none relative overflow-hidden"
              >
                {/* 動態防盜版背景浮水印 */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.04] rotate-[-20deg] text-3xl font-black text-white">
                  AUTHORIZED TO: {readerEmail}
                </div>

                {/* 閱讀器頂部語系切換列：支援直接依首頁語系切換 (繁中/簡中/英文/日文/越南文/印尼文) */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 mb-6 border-b border-white/10">
                  <div>
                    <span className="text-xs font-bold text-emerald-400">{t.readerShield}</span>
                    <h4 className="text-lg sm:text-xl font-bold text-white mt-0.5">{selectedLocalized.title}</h4>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      onClick={() => setReadingModeLang('AUTO')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        readingModeLang === 'AUTO'
                          ? 'bg-cyan-500 text-black shadow'
                          : 'bg-white/10 hover:bg-white/20 text-gray-300'
                      }`}
                      title="依照首頁導覽列語系切換"
                    >
                      🌐 跟隨首頁語系
                    </button>
                    <button
                      onClick={() => setReadingModeLang('BILINGUAL')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        readingModeLang === 'BILINGUAL'
                          ? 'bg-cyan-500 text-black shadow'
                          : 'bg-white/10 hover:bg-white/20 text-gray-300'
                      }`}
                    >
                      🌍 雙語對照
                    </button>
                    <button
                      onClick={() => setReadingModeLang('ZH_TW')}
                      className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        readingModeLang === 'ZH_TW'
                          ? 'bg-cyan-500 text-black shadow'
                          : 'bg-white/10 hover:bg-white/20 text-gray-300'
                      }`}
                    >
                      🇹🇼 繁中
                    </button>
                    <button
                      onClick={() => setReadingModeLang('ZH_CN')}
                      className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        readingModeLang === 'ZH_CN'
                          ? 'bg-cyan-500 text-black shadow'
                          : 'bg-white/10 hover:bg-white/20 text-gray-300'
                      }`}
                    >
                      🇨🇳 简中
                    </button>
                    <button
                      onClick={() => setReadingModeLang('EN')}
                      className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        readingModeLang === 'EN'
                          ? 'bg-cyan-500 text-black shadow'
                          : 'bg-white/10 hover:bg-white/20 text-gray-300'
                      }`}
                    >
                      🇺🇸 EN
                    </button>
                    <button
                      onClick={() => setReadingModeLang('JA')}
                      className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        readingModeLang === 'JA'
                          ? 'bg-cyan-500 text-black shadow'
                          : 'bg-white/10 hover:bg-white/20 text-gray-300'
                      }`}
                    >
                      🇯🇵 日本語
                    </button>
                    <button
                      onClick={() => setReadingModeLang('VI')}
                      className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        readingModeLang === 'VI'
                          ? 'bg-cyan-500 text-black shadow'
                          : 'bg-white/10 hover:bg-white/20 text-gray-300'
                      }`}
                    >
                      🇻🇳 Tiếng Việt
                    </button>
                    <button
                      onClick={() => setReadingModeLang('ID')}
                      className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        readingModeLang === 'ID'
                          ? 'bg-cyan-500 text-black shadow'
                          : 'bg-white/10 hover:bg-white/20 text-gray-300'
                      }`}
                    >
                      🇮🇩 Indonesia
                    </button>
                  </div>
                </div>

                {isBookUnlocked(selectedBook.id) ? (
                  <div className="mb-6 p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-xs text-emerald-200 leading-relaxed">
                      <span className="font-black text-emerald-300 block">
                        🔓 VIP 權限已解鎖（授權讀者：{readerEmail || 'VIP'}）
                      </span>
                      您可於下方完整閱讀全部章節，或點擊右側開啟防盜版獨立閱讀器與匯出專屬浮水印精裝 PDF。
                    </div>
                    <div className="flex flex-wrap gap-2 shrink-0">
                      <a
                        href={buildReaderUrl(selectedBook.id, false)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs"
                      >
                        🌐 獨立閱讀器
                      </a>
                      <a
                        href={buildReaderUrl(selectedBook.id, true)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs"
                      >
                        🖨️ 匯出浮水印 PDF
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 leading-relaxed">
                    <span className="font-black text-amber-300 block mb-1">
                      🔒 免費試閱模式（僅開放第 1 章完整試閱，第 2～{selectedBook.chapters.length} 章受付費防盜版保護）
                    </span>
                    完成左側「PayUni 刷卡」或「PayPal」結帳後系統將自動寄發永久免密解鎖信；若您已付款，請於左側輸入結帳 Email 並點擊「🔍 驗證購買資格解鎖」。
                  </div>
                )}

                {/* 章節內容渲染 (支援繁中/簡中/英文/日文/越南文/印尼文) */}
                <div className="space-y-10">
                  {selectedBook.chapters.map((ch, idx) => {
                    const chLoc = getEBookLocalizedContent(ch, effectiveLang);

                    return (
                      <div key={ch.id || idx} className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-mono text-cyan-400 font-bold">
                            CHAPTER 0{idx + 1}
                          </div>
                          {ch.image_caption && (
                            <span className="text-[11px] text-gray-400">
                              📷 {ch.image_caption}
                            </span>
                          )}
                        </div>

                        {/* 主語系章節標題 */}
                        <h3 className="text-xl sm:text-2xl font-black text-white">
                          {chLoc.title}
                        </h3>

                        {/* 若為雙語對照模式，顯示副標題 (英文或次語系) */}
                        {isBilingual && ch.title_en && chLoc.title !== ch.title_en && (
                          <h4 className="text-sm sm:text-base font-semibold text-cyan-200/80">
                            {ch.title_en}
                          </h4>
                        )}

                        {/* 主語系內容 */}
                        <div className="space-y-3 text-gray-200 leading-relaxed text-sm sm:text-base">
                          {chLoc.content
                            .split('\n')
                            .filter(Boolean)
                            .map((p, i) => (
                              <p key={i}>{p}</p>
                            ))}
                        </div>

                        {/* 雙語對照模式下的次語系內容 */}
                        {isBilingual && ch.content_en && (
                          <div className="p-5 rounded-2xl bg-slate-900/90 border-l-4 border-cyan-400 space-y-3 text-gray-300 text-sm leading-relaxed">
                            <div className="text-[10px] font-bold text-cyan-400 tracking-wider">
                              ENGLISH REFERENCE EDITION
                            </div>
                            {ch.content_en
                              .split('\n')
                              .filter(Boolean)
                              .map((p, i) => (
                                <p key={i}>{p}</p>
                              ))}
                          </div>
                        )}

                        {/* 權威學術引用 */}
                        {ch.references && ch.references.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap items-center gap-2 text-xs text-emerald-300">
                            <span className="font-bold">📚 權威參照：</span>
                            {ch.references.map((r, rIdx) => (
                              <span
                                key={rIdx}
                                className="bg-emerald-950/60 px-2.5 py-0.5 rounded-lg border border-emerald-500/30"
                              >
                                {r.title}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* 書籍底部作者導流與違規檢舉鈕 */}
                <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400">
                  <div>
                    {t.authorLeadLink}
                    <a
                      href={selectedBook.author_cta_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 underline ml-1 hover:text-cyan-300"
                    >
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
                    {t.reportBtn}
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