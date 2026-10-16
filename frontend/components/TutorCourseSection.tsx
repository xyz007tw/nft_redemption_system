'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useLanguage } from '@/lib/LanguageContext';
import BuyNFTButton from './BuyNFTButton';
import PayUniButton from './PayUniButton';

interface TutorCourseSectionProps {
  courses: any[];
}

export default function TutorCourseSection({ courses }: TutorCourseSectionProps) {
  const { lang } = useLanguage();
  const { address } = useAccount();
  const isChinese = lang.includes('zh');

  const fallbackCourse = {
    id: 6,
    name_zh: 'AI 自動來客系統・頂配實戰家教全套教材',
    name_en: 'WeiXiang AI-ATM · Master Practical Tutor Course & Materials',
    amount: 1,
    price: 99,
    discount_text: isChinese ? '🔥 享 25% 推廣分潤' : '🔥 25% Affiliate Eligible',
    product_type: 'DIRECT_COURSE',
    course_link: ''
  };

  const displayCourses = courses && courses.length > 0 ? courses : [fallbackCourse];
  const [selectedCourseId, setSelectedCourseId] = useState<number>(displayCourses[0].id);
  const selectedCourse = displayCourses.find(c => c.id === selectedCourseId) || displayCourses[0];

  // Email forwarding & download state
  const [buyerEmail, setBuyerEmail] = useState('');
  const [targetEmail, setTargetEmail] = useState('');
  const [isForwarding, setIsForwarding] = useState(false);
  const [unlockedLink, setUnlockedLink] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleForwardAndUnlock = async () => {
    setStatusMsg(null);
    if (!targetEmail || !targetEmail.includes('@')) {
      setStatusMsg({
        type: 'error',
        text: isChinese ? '請輸入欲接收或轉發的有效電子信箱 (Email)' : 'Please enter a valid recipient email address.'
      });
      return;
    }

    setIsForwarding(true);
    try {
      const res = await fetch('/api/course/forward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerEmail: buyerEmail.trim() || targetEmail.trim(),
          walletAddress: address || '',
          targetEmail: targetEmail.trim(),
          packageId: selectedCourse.id
        })
      });
      const data = await res.json();
      if (data.success) {
        setUnlockedLink(data.courseLink);
        setStatusMsg({
          type: 'success',
          text: isChinese
            ? `✅ 驗證成功！教材連結已轉發至 ${targetEmail}，您也可以直接點擊下方按鈕下載！`
            : `✅ Verified! Course link forwarded to ${targetEmail}, and unlocked below!`
        });
      } else {
        setStatusMsg({
          type: 'error',
          text: data.error || (isChinese ? '查無購課紀錄或轉發失敗' : 'Verification failed or no purchase record found.')
        });
      }
    } catch (e: any) {
      setStatusMsg({
        type: 'error',
        text: e.message || (isChinese ? '系統連線異常' : 'Network error')
      });
    } finally {
      setIsForwarding(false);
    }
  };

  return (
    <section id="tutor-courses" className="w-full max-w-7xl px-6 py-20 scroll-mt-20">
      <div className="bg-gradient-to-br from-emerald-950/50 via-slate-900/80 to-cyan-950/50 border border-emerald-500/30 rounded-3xl p-8 md:p-14 relative overflow-hidden shadow-[0_0_60px_rgba(16,185,129,0.15)]">
        {/* 背景光暈 */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* 頂部標題區 */}
        <div className="text-center mb-12 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-bold mb-5">
            <span>🎓</span>
            {isChinese ? 'AI 頂配實戰家教課程・付費下載與電郵轉發專區' : 'AI Master Tutor Courses · Instant Download & Email Forwarding'}
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-5 tracking-tight text-white drop-shadow-lg">
            {isChinese ? '🔥 AI 頂配家教課程・手把手實戰教材' : '🔥 AI Master Tutor Courses & Practical Materials'}
          </h2>
          <p className="text-lg md:text-xl text-emerald-100/80 max-w-3xl mx-auto leading-relaxed">
            {isChinese
              ? '專為渴望掌握 AI 自動化獲客的學員打造！購買後系統秒級解鎖教材下載，並自動寄送至您的信箱，更支援「一鍵轉發電郵」分享給團隊夥伴，且全額納入 25% 聯盟推廣分潤！'
              : 'Master AI automated client acquisition! Unlock instant course downloads upon checkout with automatic email delivery, 1-click email forwarding to your team, and full 25% affiliate commission rewards!'}
          </p>
        </div>

        {/* 三大課程權益徽章 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative z-10">
          <div className="bg-black/40 border border-white/10 rounded-2xl p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl shrink-0">
              📥
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">
                {isChinese ? '付費秒級下載教材' : 'Instant Course Download'}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {isChinese
                  ? '支援台灣信用卡 / ATM 與 USDT 雙軌付款，完成結帳立即取得完整實戰家教教材與教學連結。'
                  : 'Pay via Credit Card/ATM or USDT to immediately access the complete practical training materials.'}
              </p>
            </div>
          </div>

          <div className="bg-black/40 border border-white/10 rounded-2xl p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-2xl shrink-0">
              📧
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">
                {isChinese ? '自動寄信 ＋ 一鍵轉發電郵' : 'Auto Email & 1-Click Forward'}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {isChinese
                  ? '系統自動將教材發送至購課信箱，並提供學員專屬「轉發電郵」功能，隨時轉寄給團隊或備用信箱。'
                  : 'Automatically delivered to your inbox with built-in email forwarding to share with your backup email or team.'}
              </p>
            </div>
          </div>

          <div className="bg-black/40 border border-white/10 rounded-2xl p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shrink-0">
              💰
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">
                {isChinese ? '納入 25% 聯盟推廣分潤' : '25% Affiliate Commission'}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {isChinese
                  ? '推廣家教課程同樣享有最高 10% 級差 + 10% 對等 + 5% 全球領袖分紅，邊學邊賺取被動收益！'
                  : 'Course sales count toward the 25% affiliate plan (10% Differential + 10% Matching + 5% Global Pool)!'}
              </p>
            </div>
          </div>
        </div>

        {/* 左右雙欄：左側選課結帳 / 右側學員下載與轉發電郵 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
          {/* 左側：課程選購區 */}
          <div className="bg-gray-900/90 border border-emerald-500/30 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {isChinese ? 'STEP 1 · 選購家教課程' : 'STEP 1 · Select & Checkout'}
                </span>
                <span className="text-emerald-400 font-mono font-black text-2xl">
                  ${selectedCourse.price} USDT
                </span>
              </div>

              <label className="block text-sm font-medium text-gray-300 mb-2">
                {isChinese ? '請選擇家教課程教材方案：' : 'Choose AI Tutor Course Package:'}
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(Number(e.target.value))}
                className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3.5 text-white font-bold mb-6 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {displayCourses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {isChinese ? course.name_zh : (course.name_en || course.name_zh)} — ${course.price} USDT
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-3">
              <PayUniButton
                packageId={selectedCourse.id}
                priceInUSDT={selectedCourse.price}
              />
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-800"></div>
                <span className="flex-shrink-0 mx-4 text-gray-500 text-xs font-medium">OR WEB3 USDT</span>
                <div className="flex-grow border-t border-gray-800"></div>
              </div>
              <BuyNFTButton
                packageId={selectedCourse.id}
                priceInUSDT={selectedCourse.price}
              />
            </div>
          </div>

          {/* 右側：學員下載 & 一鍵轉發電郵區 */}
          <div className="bg-gray-900/90 border border-cyan-500/30 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {isChinese ? 'STEP 2 · 教材下載 & 轉發電郵' : 'STEP 2 · Download & Forward Email'}
                </span>
                <span className="text-xs text-gray-400">
                  {address
                    ? (isChinese ? `已連結錢包: ${address.substring(0, 6)}...` : `Wallet: ${address.substring(0, 6)}...`)
                    : (isChinese ? '支援購課信箱驗證' : 'Email Verification')}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                {isChinese ? '📤 付費學員專屬：線上領取與轉發電郵' : '📤 Student Portal: Download & Forward via Email'}
              </h3>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                {isChinese
                  ? '已完成購課之學員，請輸入您的「購課驗證信箱」（若已連接購課錢包可免填）以及「欲接收/轉發的目標信箱」，即可立即解鎖下載並將教材轉寄至指定信箱！'
                  : 'Purchased students: Enter your purchase email (optional if wallet connected) and the target recipient email to immediately unlock the download link and forward the course via email!'}
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    {isChinese ? '1. 購課驗證信箱 (若使用信用卡購買請填寫)：' : '1. Your Purchase Email (for verification):'}
                  </label>
                  <input
                    type="email"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder={isChinese ? '輸入您購課時填寫的 Email' : 'Your purchase email address'}
                    className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-cyan-300 font-semibold mb-1">
                    {isChinese ? '2. 欲接收 / 轉發教材的目標電子信箱 (必填)：' : '2. Target Email to Receive / Forward Course (Required):'}
                  </label>
                  <input
                    type="email"
                    value={targetEmail}
                    onChange={(e) => setTargetEmail(e.target.value)}
                    placeholder={isChinese ? '輸入欲接收教材的親友或個人 Email' : 'Recipient email to receive course link'}
                    className="w-full bg-black border border-cyan-500/50 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={handleForwardAndUnlock}
                disabled={isForwarding}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>📧</span>
                {isForwarding
                  ? (isChinese ? '驗證與發送信件中...' : 'Verifying & Sending Email...')
                  : (isChinese ? '一鍵轉發教材至信箱 & 解鎖下載' : 'Forward Course to Email & Unlock Download')}
              </button>

              {statusMsg && (
                <div className={`mt-4 p-3 rounded-xl text-xs font-medium ${
                  statusMsg.type === 'success'
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                    : 'bg-red-500/20 border border-red-500/40 text-red-300'
                }`}>
                  {statusMsg.text}
                </div>
              )}

              {unlockedLink && (
                <a
                  href={unlockedLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full py-3.5 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-black font-black rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  <span>📥</span>
                  {isChinese ? '立即點擊下載 / 觀看家教課程教材' : 'Click Here to Download / Access Course Now'}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
