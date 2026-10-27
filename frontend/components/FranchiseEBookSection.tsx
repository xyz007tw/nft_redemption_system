'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import { GLOBAL_BANNED_BOOK_CATEGORIES } from '@/lib/ebookEngine';
import PayUniButton from '@/components/PayUniButton';

export default function FranchiseEBookSection() {
  const { lang } = useLanguage();
  const isZh = lang.includes('zh');

  const [showBannedModal, setShowBannedModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<'YEAR1_990' | 'ADD_BOOK_330' | 'YEAR2_RENEW_330'>('YEAR1_990');
  const [agreedBannedTerms, setAgreedBannedTerms] = useState(false);
  const [agreedReviewDays, setAgreedReviewDays] = useState(false);

  const openJoinModal = (plan: 'YEAR1_990' | 'ADD_BOOK_330' | 'YEAR2_RENEW_330') => {
    setCheckoutPlan(plan);
    setAgreedBannedTerms(false);
    setAgreedReviewDays(false);
    setShowCheckoutModal(true);
  };

  const planInfo = {
    YEAR1_990: {
      price: 990,
      name_zh: '全球電子書加盟商・首年 $990 啟動方案 (含 3 本電子書 + AI 自來客打廣告 + $990 服務費 100% 倒抵)',
      name_en: 'Global E-Book Franchisee Year-1 $990 Plan (3 Books + AI Traffic Ads + 100% Fee Credit)'
    },
    ADD_BOOK_330: {
      price: 330,
      name_zh: '電子書額外開發配額加購 ($330 / 1 本電子書模版引擎開發權)',
      name_en: 'Additional E-Book Development Quota ($330 / 1 Book)'
    },
    YEAR2_RENEW_330: {
      price: 330,
      name_zh: '次年 AI 自來客廣告與電子書系統維護費 ($330 同享 100% 倒抵 10% 服務費)',
      name_en: 'Year-2 AI Traffic & E-Book Maintenance Renewal ($330 with 100% Fee Credit)'
    }
  }[checkoutPlan];

  return (
    <section id="author-coop" className="w-full max-w-7xl px-4 sm:px-6 py-16 scroll-mt-24">
      <div className="bg-gradient-to-br from-purple-950/70 via-indigo-950/80 to-pink-950/60 border border-pink-500/40 rounded-3xl p-6 sm:p-8 md:p-14 relative overflow-hidden shadow-[0_0_60px_rgba(236,72,153,0.18)]">
        {/* 背景裝飾光暈 */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* 頂部徽章 */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 text-xs sm:text-sm font-bold mb-6">
            <span>📚 {isZh ? '全球作者 / 加盟商 × 自動電子書模版引擎 SaaS 帝國' : 'Global Author & Franchisee Automated E-Book SaaS Platform'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black mb-5 tracking-tight text-white drop-shadow-lg leading-tight">
            {isZh
              ? '首年 $990 打造專屬電子書出版社 ＋ 協作 AI 自動來客幫您打廣告！'
              : 'Launch Your AI E-Book Empire for $990 + Automated Global AI Ad Traffic!'}
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-pink-200/90 mb-10 max-w-4xl mx-auto leading-relaxed">
            {isZh
              ? '內建「Google 4 旗艦級圖文專業電子書模版引擎（8大深度篇章・25+ 頁全球暢銷專書規格・支援加盟商自行下載 PDF/網頁母檔）」、三級管理平台（管理員 / 加盟商 / 讀者訂閱），首年 $990 與次年 $330 維護費皆享【先收費、後 100% 倒抵交易 1 成服務費】零風險保障！'
              : 'Built-in Google 4 Illustrated Authority E-Book Engine (8 Deep Chapters, 25+ Pages Bestselling Masterbook, supports downloading master PDF/HTML files), 3-Tier SaaS Portal (Admin / Franchisee / Reader), with 100% Fee-Credit Rebate on both Year-1 ($990) and Year-2 ($330)!'}
          </p>
        </div>

        {/* 四大核心商業規則卡片 (事先公開透明寫明清楚) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10 text-left">
          {/* 卡片 1: 首年 $990 含 3 本書 + AI 自來客打廣告 */}
          <div className="bg-white/5 border border-pink-500/30 hover:border-pink-400 rounded-2xl p-6 flex flex-col justify-between transition-all hover:-translate-y-1">
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-2xl mb-4 shadow-lg">
                🔥
              </div>
              <h3 className="text-lg font-black text-white mb-2">
                {isZh ? '1. 首年 $990 含 3 本書 ＋ AI 幫打廣告' : '1. Year-1 $990: 3 Books + AI Ad Traffic'}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {isZh
                  ? '首年認購 $990 即可免費開發 3 本雙語電子書（可自行下載電子書母檔 + 上架收費），並直接協作「微享 AI 自動來客系統」每日在社群幫您找人打廣告！之後第 4 本起每本電子書開發費僅 $330。'
                  : 'Includes 3 e-book quotas (download master files & sell online) + WeiXiang AI Auto-Traffic Matrix promoting your books! Additional books from the 4th book are $330/book.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 text-xs font-bold text-pink-400">
              {isZh ? '✔ 含 3 本配額(第4本起$330)｜每本30次修改(加購$30/30次)' : '✔ 3 Books ($330/extra) | 30 Edits/Book ($30/+30 edits)'}
            </div>
          </div>

          {/* 卡片 2: 首年 $990 100% 倒抵 10% 系統服務費 + 25% 推廣聯盟服務費 */}
          <div className="bg-white/5 border border-emerald-500/30 hover:border-emerald-400 rounded-2xl p-6 flex flex-col justify-between transition-all hover:-translate-y-1">
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-2xl mb-4 shadow-lg">
                💎
              </div>
              <h3 className="text-lg font-black text-white mb-2">
                {isZh ? '2. 1成系統費100%倒抵 ＋ 25%推廣聯盟' : '2. 10% System Fee Rebate + 25% Affiliate'}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {isZh
                  ? '每筆成交除了撥出「25% 推廣聯盟服務費支出（讓全球推廣者幫您賣書）」外，原本收取的「1成 (10%) 系統服務費（含提款服務費及推廣服務費）」將 100% 直接從您預繳的 $990 抵用金扣除（抵滿前享 0% 系統服務費）！'
                  : 'Alongside the 25% Affiliate Commission payout to global promoters, our 10% System Service Fee (covering withdrawal & promo fees) is 100% offset by your $990 credit!'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 text-xs font-bold text-emerald-400">
              {isZh ? '✔ 10%系統費全額倒抵｜另撥25%推廣聯盟費' : '✔ 10% System Fee Rebated | 25% Affiliate Payout'}
            </div>
          </div>

          {/* 卡片 3: 次年 $330 維護費同享 100% 倒抵 */}
          <div className="bg-white/5 border border-cyan-500/30 hover:border-cyan-400 rounded-2xl p-6 flex flex-col justify-between transition-all hover:-translate-y-1">
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl mb-4 shadow-lg">
                🔄
              </div>
              <h3 className="text-lg font-black text-white mb-2">
                {isZh ? '3. 次年 $330 維護費（同享 100% 倒抵）' : '3. Year-2 $330 Maintenance (100% Rebate)'}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {isZh
                  ? '次年起每年僅收 $330「AI 自來客廣告協作及電子書雲端維護費」，一樣採取【先收費、後抵扣交易 1 成服務費】！繳交即獲 $330 抵用金，次年賣滿 $3,300 即等同次年維護費全額免費！'
                  : 'From Year 2, annual AI traffic & cloud maintenance is only $330—and it ALSO converts 100% into 10% transaction fee credit!'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 text-xs font-bold text-cyan-400">
              {isZh ? '✔ 先收費後抵扣 10% 交易服務費' : '✔ 100% Offset Against 10% Service Fee'}
            </div>
          </div>

          {/* 卡片 4: 3~7 天書審制度與禁書不退費鐵則 */}
          <div className="bg-white/5 border border-amber-500/40 hover:border-amber-400 rounded-2xl p-6 flex flex-col justify-between transition-all hover:-translate-y-1">
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-2xl mb-4 shadow-lg">
                ⚖️
              </div>
              <h3 className="text-lg font-black text-amber-300 mb-2">
                {isZh ? '4. 嚴格書審 (3~7天) 與禁書零退費' : '4. 3-7 Day Book Audit & Ban Policy'}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {isZh
                  ? '加盟商設定完成電子書後，會自動送入總管理後台進行「書審（審核時間 3~7 個工作天）」。付款前須詳閱全球 10 大禁書條款，付款後若違規或遭檢舉查證屬實，一律強制下架封號且不退費！'
                  : 'Completed books enter Admin Book Review (3-7 days) before going live. Violating the 10 Global Banned Book rules results in immediate termination with NO REFUND.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 text-xs font-bold text-amber-400">
              {isZh ? '⚠️ 書審時間 3~7 天｜違規檢舉一律不退費' : '⚠️ 3-7 Days Audit | Strictly Non-Refundable'}
            </div>
          </div>
        </div>

        {/* 事前公開：付款前必讀【全球 10 大禁書條款與 3~7 天書審須知】醒目警示框 */}
        <div className="bg-red-950/40 border-2 border-red-500/50 rounded-2xl p-5 sm:p-6 mb-10 text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-red-500/20 border border-red-400/50 text-red-300 text-xs font-black mb-2">
                🚨 {isZh ? '加盟商付款前必讀聲明（事前公開透明條款）' : 'MANDATORY PRE-PAYMENT COMPLIANCE NOTICE'}
              </span>
              <h4 className="text-lg sm:text-xl font-black text-white">
                {isZh
                  ? '全球電子書 10 大不可上架禁書規範 ＆ 總後台 3~7 天書審制度'
                  : '10 Global Banned E-Book Categories & 3-7 Day Admin Review Policy'}
              </h4>
            </div>
            <button
              onClick={() => setShowBannedModal(true)}
              className="px-4 py-2.5 rounded-xl bg-red-600/30 hover:bg-red-600/50 border border-red-400 text-red-200 font-bold text-xs sm:text-sm transition-all shrink-0 cursor-pointer"
            >
              📜 {isZh ? '展開閱讀完整《全球 10 大禁書條款細則》' : 'View Full 10 Banned Book Categories'}
            </button>
          </div>

          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed mb-3">
            {isZh
              ? '為維護國際信用卡金流（PayUni / Visa / Mastercard）與全球出版合規，本平台嚴禁上架以下 10 大類禁書：① 色情猥褻與未成年不當內容、② 恐怖暴力與武器毒物製造、③ 毒品與違禁藥品、④ 非法賭博詐騙與洗錢教學、⑤ 非法金融吸金與保證獲利資金盤、⑥ 誇大醫療療效偏方、⑦ 盜版侵權與抄襲洗稿、⑧ 侵犯個人隱私肉搜與惡意誹謗、⑨ 仇恨言論與危害國安、⑩ 惡意木馬釣魚連結或欺詐空殼書。'
              : 'To comply with international payment gateways and publishing laws, 10 categories are strictly prohibited: (1) Pornography/CSAM, (2) Terrorism/Weapons, (3) Illicit Drugs, (4) Gambling/Scams/Money Laundering, (5) Ponzi/Guaranteed Returns, (6) Fake Medical Cures, (7) Piracy/Copyright Infringement, (8) Doxxing/Defamation, (9) Hate Speech, (10) Phishing/Spam.'}
          </p>
          <div className="p-3 rounded-xl bg-black/40 border border-amber-500/30 text-xs sm:text-sm text-amber-300 font-bold">
            📌 {isZh
              ? '【重要須知】：(1) 加盟商在線上模版引擎完成電子書設定後，系統將自動送入管理後台進行「書審（審核時間 3~7 個工作天）」，通過後方可正式公開銷售與投放 AI 廣告；(2) 加盟商於付款前須清楚了解上述禁書條款，付款後若因違反禁書規定或遭檢舉查證屬實，一律永久下架封號且【絕對不予退費】！'
              : '[IMPORTANT]: (1) All e-books undergo a 3-7 day Admin Compliance Review after setup before going live; (2) Please read the banned book rules carefully before payment. Any violation or verified report after payment results in immediate termination with NO REFUND!'}
          </div>
        </div>

        {/* 四大功能快速入口與加盟結帳按鈕 */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
          <button
            onClick={() => openJoinModal('YEAR1_990')}
            className="w-full lg:w-auto px-7 py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white rounded-xl text-base sm:text-lg font-black transition-all shadow-[0_0_30px_rgba(236,72,153,0.5)] hover:scale-105 cursor-pointer"
          >
            🚀 {isZh ? '立即認購 $990 加盟方案 (含3本書+AI廣告+100%倒抵)' : 'Join $990 Franchise Plan (3 Books + AI Ads)'}
          </button>

          <Link
            href="/studio"
            className="w-full lg:w-auto px-6 py-4 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 hover:from-cyan-500/30 hover:to-blue-600/30 border border-cyan-400/50 text-cyan-200 rounded-xl text-base font-bold transition-all hover:scale-105 text-center"
          >
            🛠️ {isZh ? '進入「加盟商電子書模版引擎工作台 (/studio)」' : 'Open Franchisee E-Book Studio (/studio)'}
          </Link>

          <Link
            href="/ebook-store"
            className="w-full lg:w-auto px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-base font-bold transition-all hover:scale-105 text-center"
          >
            📖 {isZh ? '前往「讀者 VIP 訂閱書櫃 (/ebook-store)」' : 'Reader VIP Bookstore (/ebook-store)'}
          </Link>

          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(
                  new CustomEvent('open-ai-chat', {
                    detail: {
                      query: isZh
                        ? '我想了解 $990 電子書加盟方案（含3本書、AI打廣告、3~7天書審與禁書條款）'
                        : 'Tell me about the $990 E-Book Franchise Plan, 3-7 day book review, and banned book rules'
                    }
                  })
                );
              }
            }}
            className="w-full lg:w-auto px-5 py-4 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 rounded-xl text-sm font-bold transition-all cursor-pointer"
          >
            💬 {isZh ? '喚起 AI 客服諮詢' : 'Ask AI Support'}
          </button>
        </div>
      </div>

      {/* 彈窗 1：完整全球 10 大禁書條款明細 */}
      {showBannedModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-gray-900 border border-red-500/50 rounded-3xl max-w-4xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-start gap-4 mb-6 border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">GLOBAL PUBLISHING COMPLIANCE</span>
                <h3 className="text-2xl font-black text-white mt-1">
                  🚫 全球電子書不可上架之「10 大禁書種類」與違規不退費鐵律
                </h3>
              </div>
              <button
                onClick={() => setShowBannedModal(false)}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 text-sm font-bold cursor-pointer"
              >
                ✕ 關閉
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {GLOBAL_BANNED_BOOK_CATEGORIES.map(cat => (
                <div key={cat.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="font-bold text-red-300 text-sm mb-1">
                    {cat.icon} {isZh ? cat.title_zh : cat.title_en}
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {isZh ? cat.desc_zh : cat.desc_en}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-xs sm:text-sm text-red-200 leading-relaxed mb-6">
              <strong>⚖️ 違規處理與零退費切結聲明：</strong><br />
              1. 所有電子書設定完成後，均須進入總管理後台進行 <strong>3~7 個工作天之人工與 AI 雙重書審</strong>。<br />
              2. 嚴禁「掛羊頭賣狗肉（審核後偷換違規內容）」、「植入釣魚木馬 QR Code」或「洗錢刷單」。<br />
              3. 加盟商於付款前須充分知悉上述規範，<strong>一旦付款開通後，若因違反上述禁書條款或遭讀者/第三方檢舉查證屬實，平台將立即強制下架並永久凍結帳號，已支付之 $990 / $330 款項一律不予退費！</strong>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowBannedModal(false);
                  openJoinModal('YEAR1_990');
                }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-sm cursor-pointer"
              >
                我已清楚了解・前往認購加盟方案
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 彈窗 2：付款前強制勾選「禁書條款不退費 ＋ 3~7天書審」結帳視窗 */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-gray-900 border border-pink-500/50 rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-start gap-4 mb-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-bold text-pink-400">STEP 1: PRE-PAYMENT AGREEMENT</span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  📋 加盟商付款前必讀切結書与方案確認
                </h3>
              </div>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* 方案切換器 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-5">
              <button
                onClick={() => setCheckoutPlan('YEAR1_990')}
                className={`p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                  checkoutPlan === 'YEAR1_990'
                    ? 'bg-pink-500/20 border-pink-400 text-white'
                    : 'bg-white/5 border-white/10 text-gray-400'
                }`}
              >
                🔥 首年加盟 $990<br />
                <span className="text-[11px] font-normal opacity-80">含3本書+AI廣告+100%倒抵</span>
              </button>
              <button
                onClick={() => setCheckoutPlan('ADD_BOOK_330')}
                className={`p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                  checkoutPlan === 'ADD_BOOK_330'
                    ? 'bg-purple-500/20 border-purple-400 text-white'
                    : 'bg-white/5 border-white/10 text-gray-400'
                }`}
              >
                ➕ 加購第4本書起 $330<br />
                <span className="text-[11px] font-normal opacity-80">每增 1 本電子書開發費</span>
              </button>
              <button
                onClick={() => setCheckoutPlan('YEAR2_RENEW_330')}
                className={`p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                  checkoutPlan === 'YEAR2_RENEW_330'
                    ? 'bg-cyan-500/20 border-cyan-400 text-white'
                    : 'bg-white/5 border-white/10 text-gray-400'
                }`}
              >
                🔄 次年維護續約 $330<br />
                <span className="text-[11px] font-normal opacity-80">AI廣告+維護(同享100%倒抵)</span>
              </button>
            </div>

            {/* 強制勾選切結框 */}
            <div className="space-y-3 bg-black/50 border border-red-500/30 rounded-2xl p-4 mb-6 text-xs sm:text-sm">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreedBannedTerms}
                  onChange={e => setAgreedBannedTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-pink-500 shrink-0"
                />
                <span className="text-gray-200 leading-relaxed">
                  <strong>【禁書與違規不退費切結】</strong>本人已詳閱《全球 10 大不可上架禁書規範》（嚴禁色情猥褻/未成年不當內容、暴力武器、毒品、賭博詐騙洗錢、非法吸金資金盤、誇大醫療偏方、盜版侵權、侵犯隱私誹謗、仇恨危害國安、釣魚木馬空殼書）。本人清楚了解：<strong>付款後若違反禁書規定或遭檢舉查證屬實，平台將強制下架封號，且已付款項一律不退費！</strong>
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer select-none pt-2 border-t border-white/10">
                <input
                  type="checkbox"
                  checked={agreedReviewDays}
                  onChange={e => setAgreedReviewDays(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-pink-500 shrink-0"
                />
                <span className="text-gray-200 leading-relaxed">
                  <strong>【配額、30次修改上限、雙軌服務費（10%系統費+25%推廣聯盟費）與 3~7 天書審認知】</strong>本人了解 $990 方案含開發 3 本電子書（之後每本開發費 $330），<strong>每本電子書免費修改次數為 30 次（含完稿後再修改，超過後需支付修改費 $30 才可再享 30 次修改權限）</strong>，次年 AI 自來客及電子書維護費為 $330；每筆交易除 <strong>1 成 (10%) 系統服務費（含提款服務費及推廣服務費，可由首年 $990 / 次年 $330 抵用金 100% 倒抵）</strong>外，另需支出 <strong>「推廣聯盟服務費 25%」</strong>；且<strong>電子書設定完成後須進入管理後台進行「書審（時間 3~7 天）」</strong>通過後方可正式上架。
                </span>
              </label>
            </div>

            {/* 結帳按鈕區 (未勾選前鎖定) */}
            {!agreedBannedTerms || !agreedReviewDays ? (
              <div className="p-4 rounded-xl bg-gray-800 border border-gray-700 text-center text-amber-400 text-sm font-bold">
                ☝️ 請先勾選上方兩項「付款前必讀合規切結條款」，即可解鎖信用卡 / USDT 付款按鈕
              </div>
            ) : (
              <div className="space-y-4">
                <PayUniButton
                  packageId={990}
                  priceInUSDT={planInfo.price}
                  productType="NFT_REDEEM"
                  productName={isZh ? planInfo.name_zh : planInfo.name_en}
                />
                <p className="text-center text-xs text-gray-400">
                  付款完成後，即可直接進入 <Link href="/studio" className="text-cyan-400 underline font-bold">/studio 加盟商工作台</Link> 開始創作與下載電子書！
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
