'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { SponsorAdvertiser } from '@/lib/adNetwork';

export default function AdStudioPage() {
  const { lang } = useLanguage();
  const isChinese = lang.includes('zh');

  // Auth states
  const [adToken, setAdToken] = useState<string>('');
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [magicSentMsg, setMagicSentMsg] = useState<string | null>(null);

  // Advertiser profile & campaign states
  const [advertiser, setAdvertiser] = useState<(SponsorAdvertiser & { remaining_days?: number }) | null>(null);
  const [brandName, setBrandName] = useState('');
  const [headlineZh, setHeadlineZh] = useState('');
  const [headlineCn, setHeadlineCn] = useState('');
  const [headlineEn, setHeadlineEn] = useState('');
  const [headlineJa, setHeadlineJa] = useState('');
  const [bodyZh, setBodyZh] = useState('');
  const [bodyCn, setBodyCn] = useState('');
  const [bodyEn, setBodyEn] = useState('');
  const [bodyJa, setBodyJa] = useState('');
  const [ctaTextZh, setCtaTextZh] = useState('👉 立即前往了解詳情');
  const [ctaTextEn, setCtaTextEn] = useState('👉 Learn More Now');
  const [ctaTextJa, setCtaTextJa] = useState('👉 今すぐ詳細を見る');
  const [targetUrl, setTargetUrl] = useState('');
  const [bannerImageUrl, setBannerImageUrl] = useState('');
  const [nicheCategory, setNicheCategory] = useState<'ALL' | 'PARENTING' | 'MARKETING_SEO' | 'MINDFULNESS' | 'CAREER_BIZ'>('ALL');
  const [campaignStatus, setCampaignStatus] = useState<'ACTIVE' | 'PAUSED' | 'BANNED'>('ACTIVE');

  const [saving, setSaving] = useState(false);
  const [aiTranslating, setAiTranslating] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [statusNotice, setStatusNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [previewLang, setPreviewLang] = useState<'ZH' | 'CN' | 'EN' | 'JA'>('ZH');

  const populateForm = (adv: SponsorAdvertiser & { remaining_days?: number }) => {
    setAdvertiser(adv);
    setBrandName(adv.brand_name || '');
    setHeadlineZh(adv.headline_zh || '');
    setHeadlineCn(adv.headline_cn || adv.headline_zh || '');
    setHeadlineEn(adv.headline_en || '');
    setHeadlineJa(adv.headline_ja || '');
    setBodyZh(adv.body_zh || '');
    setBodyCn(adv.body_cn || adv.body_zh || '');
    setBodyEn(adv.body_en || '');
    setBodyJa(adv.body_ja || '');
    setCtaTextZh(adv.cta_text_zh || '👉 立即前往了解詳情');
    setCtaTextEn(adv.cta_text_en || '👉 Learn More Now');
    setCtaTextJa(adv.cta_text_ja || '👉 今すぐ詳細を見る');
    setTargetUrl(adv.target_url || 'https://');
    setBannerImageUrl(adv.banner_image_url || '');
    setNicheCategory(adv.niche_category || 'ALL');
    setCampaignStatus(adv.status || 'ACTIVE');
  };

  // Auto-login if ?ad_token= is in URL or saved in localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sp = new URLSearchParams(window.location.search);
    const urlToken = sp.get('ad_token');
    const savedToken = localStorage.getItem('wx_ad_studio_token');
    const tokenToUse = urlToken || savedToken;

    if (tokenToUse) {
      setAuthLoading(true);
      fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login_advertiser', adToken: tokenToUse })
      })
        .then(r => r.json())
        .then(data => {
          if (data.success && data.advertiser) {
            setAdToken(data.adToken || tokenToUse);
            localStorage.setItem('wx_ad_studio_token', data.adToken || tokenToUse);
            populateForm(data.advertiser);
          } else if (urlToken) {
            setAuthError(data.error || '登入連結已失效');
          }
        })
        .catch(() => {})
        .finally(() => setAuthLoading(false));
    }
  }, []);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) return;
    setAuthLoading(true);
    setAuthError(null);
    setMagicSentMsg(null);
    try {
      const res = await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login_advertiser',
          email: loginEmail.trim(),
          password: loginPassword.trim()
        })
      });
      const data = await res.json();
      if (!data.success) {
        setAuthError(data.error || '登入失敗');
        return;
      }
      setAdToken(data.adToken);
      localStorage.setItem('wx_ad_studio_token', data.adToken);
      populateForm(data.advertiser);
    } catch (err: any) {
      setAuthError(err.message || '連線異常');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSendMagicLink = async () => {
    if (!loginEmail.trim() || !loginEmail.includes('@')) {
      setAuthError('請先在上方「登入帳號 (Email)」欄位輸入您斗內時的電子信箱！');
      return;
    }
    setAuthLoading(true);
    setAuthError(null);
    setMagicSentMsg(null);
    try {
      const res = await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_magic_link',
          email: loginEmail.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        setMagicSentMsg(data.message);
      } else {
        setAuthError(data.error || '寄送失敗');
      }
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('wx_ad_studio_token');
    setAdToken('');
    setAdvertiser(null);
  };

  // AI 一鍵翻譯繁/簡/英/日 4 語系廣告
  const handleAiTranslate = async () => {
    if (!headlineZh.trim() || !bodyZh.trim()) {
      setStatusNotice({ type: 'error', text: '請先填寫「廣告主標題」與「廣告宣傳短文」，再點擊 AI 翻譯！' });
      return;
    }
    setAiTranslating(true);
    setStatusNotice(null);
    try {
      const res = await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ai_translate_ad',
          headline_zh: headlineZh,
          body_zh: bodyZh,
          cta_text_zh: ctaTextZh
        })
      });
      const data = await res.json();
      if (data.success && data.translated) {
        const tr = data.translated;
        if (tr.headline_cn) setHeadlineCn(tr.headline_cn);
        if (tr.headline_en) setHeadlineEn(tr.headline_en);
        if (tr.headline_ja) setHeadlineJa(tr.headline_ja);
        if (tr.body_cn) setBodyCn(tr.body_cn);
        if (tr.body_en) setBodyEn(tr.body_en);
        if (tr.body_ja) setBodyJa(tr.body_ja);
        if (tr.cta_text_en) setCtaTextEn(tr.cta_text_en);
        if (tr.cta_text_ja) setCtaTextJa(tr.cta_text_ja);
        setStatusNotice({
          type: 'success',
          text: '✨ AI 已自動將您的廣告翻譯並潤飾為「繁中 / 簡中 / 英文 / 日文」4 大語系！請記得點擊底部「儲存並發佈至全網協播池」按鈕。'
        });
      }
    } catch (err: any) {
      setStatusNotice({ type: 'error', text: 'AI 翻譯失敗：' + err.message });
    } finally {
      setAiTranslating(false);
    }
  };

  // 上傳廣告圖片至專用 Cloudflare R2
  const handleUploadBanner = async (file: File) => {
    setUploadingBanner(true);
    setStatusNotice(null);
    try {
      const reader = new FileReader();
      const base64Data: string = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const res = await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'upload_ad_banner',
          fileName: file.name,
          contentType: file.type || 'image/jpeg',
          base64Data
        })
      });
      const data = await res.json();
      if (data.success && data.primaryUrl) {
        setBannerImageUrl(data.primaryUrl);
        setStatusNotice({ type: 'success', text: `☁️ 廣告圖片已上傳至專用 Cloudflare R2：${data.primaryUrl}` });
      } else {
        setStatusNotice({ type: 'error', text: data.error || '圖片上傳失敗' });
      }
    } catch (err: any) {
      setStatusNotice({ type: 'error', text: '圖片上傳錯誤：' + err.message });
    } finally {
      setUploadingBanner(false);
    }
  };

  // 儲存廣告並同步發佈至 Cloudflare R2 與 AI Agent Feed
  const handleSaveCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!advertiser) return;
    setSaving(true);
    setStatusNotice(null);
    try {
      const res = await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_ad_campaign',
          adToken,
          email: advertiser.email,
          brand_name: brandName,
          headline_zh: headlineZh,
          headline_cn: headlineCn || headlineZh,
          headline_en: headlineEn || headlineZh,
          headline_ja: headlineJa || headlineZh,
          body_zh: bodyZh,
          body_cn: bodyCn || bodyZh,
          body_en: bodyEn || bodyZh,
          body_ja: bodyJa || bodyZh,
          cta_text_zh: ctaTextZh,
          cta_text_en: ctaTextEn,
          cta_text_ja: ctaTextJa,
          target_url: targetUrl,
          banner_image_url: bannerImageUrl,
          niche_category: nicheCategory,
          status: campaignStatus
        })
      });
      const data = await res.json();
      if (!data.success) {
        setStatusNotice({ type: 'error', text: data.error || '儲存失敗' });
        return;
      }
      if (data.advertiser) populateForm(data.advertiser);
      setStatusNotice({ type: 'success', text: data.message });
    } catch (err: any) {
      setStatusNotice({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const previewHeadline =
    previewLang === 'EN' ? headlineEn || headlineZh : previewLang === 'JA' ? headlineJa || headlineZh : previewLang === 'CN' ? headlineCn || headlineZh : headlineZh;
  const previewBody =
    previewLang === 'EN' ? bodyEn || bodyZh : previewLang === 'JA' ? bodyJa || bodyZh : previewLang === 'CN' ? bodyCn || bodyZh : bodyZh;
  const previewCta = previewLang === 'EN' ? ctaTextEn || ctaTextZh : previewLang === 'JA' ? ctaTextJa || ctaTextZh : ctaTextZh;

  return (
    <div className="min-h-screen bg-[#07090f] text-white font-sans pb-24">
      {/* 頂部導覽列 */}
      <header className="sticky top-0 z-40 bg-[#07090f]/90 backdrop-blur-lg border-b border-white/10 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <Link href="/sponsor" className="text-xs sm:text-sm text-gray-300 hover:text-white px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 font-bold">
              ← 回斗內開通頁 (/sponsor)
            </Link>
            <h1 className="text-base sm:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-cyan-300 to-purple-400">
              📢 微享「萬商自助廣告協播系統」客戶工作台 (/ad-studio)
            </h1>
          </div>
          <div className="flex items-center gap-2.5">
            <LanguageSwitcher />
            {advertiser && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-400/40 text-red-200 text-xs font-bold cursor-pointer"
              >
                🚪 登出 ({advertiser.email})
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-8">
        {/* 尚未登入：顯示客戶帳號密碼登入框 */}
        {!advertiser ? (
          <div className="max-w-lg mx-auto bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.18)] mt-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl mx-auto mb-3 shadow-lg">
                📢
              </div>
              <h2 className="text-2xl font-black text-white">
                {isChinese ? '登入「萬商廣告系統」自助工作台' : 'Advertiser Studio Login'}
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-2 leading-relaxed">
                請輸入您於 <Link href="/sponsor" className="text-cyan-400 underline">/sponsor 斗內贊助</Link> 時填寫的 Email 帳號與開通信中的專屬密碼（WX 開頭 8 碼）。
              </p>
            </div>

            {authError && (
              <div className="mb-4 p-3.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs font-bold leading-relaxed">
                ⚠️ {authError}
              </div>
            )}

            {magicSentMsg && (
              <div className="mb-4 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs font-bold leading-relaxed">
                ✅ {magicSentMsg}
              </div>
            )}

            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">登入帳號 (購買時之 Email)</label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  placeholder="例如：client@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 focus:border-cyan-400 focus:outline-none text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">專屬密碼 (Password)</label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="請輸入信件中之 WX 開頭密碼"
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 focus:border-cyan-400 focus:outline-none text-sm text-white font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {authLoading ? '驗證登入中...' : '🔑 立即登入架設廣告文案與連結'}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-white/10 flex flex-col gap-2.5 text-center">
              <button
                type="button"
                onClick={handleSendMagicLink}
                disabled={authLoading}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-cyan-300 text-xs font-bold cursor-pointer"
              >
                📧 忘記密碼？點此將「密碼與一鍵免密登入連結」寄至上方信箱
              </button>

              <Link
                href="/sponsor"
                className="w-full py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-300 text-xs font-black"
              >
                ⚡ 尚未開通？前往斗內 $15 (1個月) / $120 (買8送4共365天) 自動拿帳密 ➔
              </Link>
            </div>
          </div>
        ) : (
          /* 已登入：萬商廣告自助設定與即時預覽中心 */
          <div>
            {/* 頂部 4 張數據卡片 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-cyan-950/60 to-blue-950/50 border border-cyan-500/40 rounded-2xl p-5">
                <div className="text-xs text-cyan-300 font-bold mb-1">⏳ 剩餘全網協播曝光天數</div>
                <div className="text-3xl font-black text-white">
                  {advertiser.remaining_days ?? 0} <span className="text-sm font-normal text-gray-300">天</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">到期日：{advertiser.expires_at?.slice(0, 10)}</p>
                <Link
                  href="/sponsor"
                  className="mt-3 inline-block px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-400/50 text-cyan-200 text-xs font-bold hover:bg-cyan-500/30"
                >
                  ➕ 續約加購天數 ($15 / $120)
                </Link>
              </div>

              <div className="bg-gradient-to-br from-amber-950/60 to-purple-950/50 border border-amber-500/40 rounded-2xl p-5">
                <div className="text-xs text-amber-300 font-bold mb-1">👑 當前方案與輪播權重</div>
                <div className="text-xl font-black text-amber-300 mt-1">
                  {advertiser.weight >= 3 ? '🔥 VIP 365天霸屏 (3倍權重)' : '⚡ 標準協播方案 (1倍權重)'}
                </div>
                <p className="text-xs text-gray-300 mt-1.5">
                  登入帳號：<code className="text-cyan-300">{advertiser.email}</code>
                  <br />
                  專屬密碼：<code className="text-amber-300 font-bold">{advertiser.password_code}</code>
                </p>
              </div>

              <div className="bg-gradient-to-br from-emerald-950/60 to-teal-950/50 border border-emerald-500/40 rounded-2xl p-5">
                <div className="text-xs text-emerald-300 font-bold mb-1">📊 累計全網協播與點擊統計</div>
                <div className="flex items-baseline gap-4 mt-1">
                  <div>
                    <span className="text-2xl font-black text-emerald-400">{(advertiser.impressions_count || 0).toLocaleString()}</span>
                    <span className="text-xs text-gray-400 ml-1">次曝光</span>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-cyan-400">{(advertiser.clicks_count || 0).toLocaleString()}</span>
                    <span className="text-xs text-gray-400 ml-1">次點擊</span>
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 mt-2">
                  * 含 WordPress 矩陣全站輪播與本地/雲端 AI Agent 每日發文嵌入（不保證業績額）
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-950/60 to-pink-950/50 border border-purple-500/40 rounded-2xl p-5">
                <div className="text-xs text-purple-300 font-bold mb-1">🤖 本地 / 雲端 AI Agent 連線狀態</div>
                <div className="text-lg font-black text-white flex items-center gap-2 mt-1">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping inline-block" />
                  {advertiser.remaining_days && advertiser.remaining_days > 0 && advertiser.status === 'ACTIVE'
                    ? '全網協播運行中'
                    : '已到期或已暫停'}
                </div>
                <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">
                  同步節點：<code className="text-[11px] text-pink-300">1.5208.uk/ads/active_ads_pool.json</code>
                </p>
              </div>
            </div>

            {statusNotice && (
              <div
                className={`mb-6 p-4 rounded-2xl border font-bold text-sm ${
                  statusNotice.type === 'success'
                    ? 'bg-emerald-950/70 border-emerald-400 text-emerald-200'
                    : 'bg-red-950/70 border-red-400 text-red-200'
                }`}
              >
                {statusNotice.text}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* 左側 7 欄：客戶自助架設廣告文案與連結窗口表單 */}
              <form onSubmit={handleSaveCampaign} className="lg:col-span-7 bg-slate-900/90 border border-white/15 rounded-3xl p-6 sm:p-8 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10">
                  <div>
                    <span className="text-xs font-black text-cyan-400">SELF-SERVE AD CAMPAIGN BUILDER</span>
                    <h2 className="text-xl font-black text-white mt-0.5">🛠️ 自助架設您的廣告文案 ＆ 導流連結窗口</h2>
                  </div>
                  <button
                    type="button"
                    onClick={handleAiTranslate}
                    disabled={aiTranslating}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white text-xs font-black shadow-lg cursor-pointer disabled:opacity-50"
                  >
                    {aiTranslating ? '🤖 AI 正在翻譯 4 語系...' : '✨ AI 一鍵翻譯成繁/簡/英/日 4 語系'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">1. 品牌 / 商家名稱 *</label>
                    <input
                      type="text"
                      required
                      maxLength={60}
                      value={brandName}
                      onChange={e => setBrandName(e.target.value)}
                      placeholder="例如：台灣嚴選滴雞精 / 王顧問 AI 商學院"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">2. 優先投放賽道分類</label>
                    <select
                      value={nicheCategory}
                      onChange={e => setNicheCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-sm text-white"
                    >
                      <option value="ALL">🌐 全站通用 (全網 100 站無差別曝光)</option>
                      <option value="PARENTING">👨‍👩‍👧 親子育兒與家庭健康 (Client A 站群優先)</option>
                      <option value="MARKETING_SEO">📈 AI 行銷、SEO 與跨境電商 (Client B 站群優先)</option>
                      <option value="MINDFULNESS">🧘‍♀️ 身心靈成長與財富思維 (Client C 站群優先)</option>
                      <option value="CAREER_BIZ">💼 職場效率、斜槓創業與商務 (Client D 站群優先)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-cyan-300 mb-1">
                    3. 廣告主標題 (繁體中文，限 90 字內) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={90}
                    value={headlineZh}
                    onChange={e => setHeadlineZh(e.target.value)}
                    placeholder="例如：🔥 限時免費領取！每天 10 分鐘用 AI 打造你的下班被動收入管道"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-cyan-500/40 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-cyan-300 mb-1">
                    4. 廣告宣傳短文 (繁體中文，限 260 字內) *
                  </label>
                  <textarea
                    rows={3}
                    required
                    maxLength={260}
                    value={bodyZh}
                    onChange={e => setBodyZh(e.target.value)}
                    placeholder="請簡述您的產品亮點、服務優勢或限時優惠內容，吸引讀者點擊下方連結窗口..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-cyan-500/40 text-sm text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-emerald-300 mb-1">
                      5. 導流連結窗口 (您的 LINE / 官網 / 賣場網址) *
                    </label>
                    <input
                      type="url"
                      required
                      value={targetUrl}
                      onChange={e => setTargetUrl(e.target.value)}
                      placeholder="https://line.me/ti/p/~您的ID 或 https://您的網站"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-emerald-500/50 text-sm text-emerald-200 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-emerald-300 mb-1">6. 行動呼籲按鈕文字 (CTA)</label>
                    <input
                      type="text"
                      maxLength={35}
                      value={ctaTextZh}
                      onChange={e => setCtaTextZh(e.target.value)}
                      placeholder="👉 立即加 LINE 免費領取"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-sm text-white"
                    />
                  </div>
                </div>

                {/* 廣告橫幅圖片上傳 (Cloudflare R2) */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    7. 廣告橫幅圖片網址（選填，可直接貼上圖片網址或上傳至專用 R2）
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      type="text"
                      value={bannerImageUrl}
                      onChange={e => setBannerImageUrl(e.target.value)}
                      placeholder="https://1.5208.uk/ads/banners/..."
                      className="flex-1 px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-gray-200 font-mono"
                    />
                    <label className="px-4 py-2 rounded-xl bg-indigo-600/40 hover:bg-indigo-600/60 border border-indigo-400/50 text-indigo-200 text-xs font-bold cursor-pointer text-center shrink-0">
                      {uploadingBanner ? '☁️ 上傳 R2 中...' : '📤 上傳圖片至 R2'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          const f = e.target.files?.[0];
                          if (f) handleUploadBanner(f);
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* 多語系折疊微調區 (英文 / 日文) */}
                <details className="p-4 rounded-2xl bg-black/30 border border-white/10 text-xs">
                  <summary className="cursor-pointer font-bold text-purple-300">
                    🌍 展開查看 / 手動微調「英文版 (EN) ＆ 日文版 (JA)」多語系協播文案（點擊上方 AI 翻譯可自動填滿）
                  </summary>
                  <div className="mt-4 space-y-3">
                    <div>
                      <label className="block text-gray-400 mb-1">🇺🇸 英文標題 (English Headline)</label>
                      <input
                        type="text"
                        value={headlineEn}
                        onChange={e => setHeadlineEn(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1">🇺🇸 英文短文 (English Body)</label>
                      <textarea
                        rows={2}
                        value={bodyEn}
                        onChange={e => setBodyEn(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1">🇯🇵 日文標題 (Japanese Headline)</label>
                      <input
                        type="text"
                        value={headlineJa}
                        onChange={e => setHeadlineJa(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1">🇯🇵 日文短文 (Japanese Body)</label>
                      <textarea
                        rows={2}
                        value={bodyJa}
                        onChange={e => setBodyJa(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-white"
                      />
                    </div>
                  </div>
                </details>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-400">投放狀態：</span>
                    <button
                      type="button"
                      onClick={() => setCampaignStatus(campaignStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE')}
                      className={`px-3 py-1 rounded-lg font-bold cursor-pointer ${
                        campaignStatus === 'ACTIVE'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                          : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      {campaignStatus === 'ACTIVE' ? '🟢 啟動全網協播中' : '⏸️ 暫停投放'}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm shadow-[0_0_25px_rgba(16,185,129,0.4)] cursor-pointer disabled:opacity-50"
                  >
                    {saving ? '☁️ 正在審核並同步 Cloudflare R2...' : '🚀 儲存並發佈至全網 100 站協播池'}
                  </button>
                </div>
              </form>

              {/* 右側 5 欄：全網 WordPress 文章內嵌廣告卡即時預覽 */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-slate-900/90 border border-cyan-500/30 rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black text-cyan-400">👁️ LIVE AD CARD PREVIEW</span>
                    <div className="flex gap-1 bg-black/50 p-1 rounded-xl border border-white/10 text-[11px] font-bold">
                      {(['ZH', 'CN', 'EN', 'JA'] as const).map(l => (
                        <button
                          key={l}
                          type="button"
                          onClick={() => setPreviewLang(l)}
                          className={`px-2 py-1 rounded-lg cursor-pointer ${
                            previewLang === l ? 'bg-cyan-500 text-slate-950' : 'text-gray-400'
                          }`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 mb-4">
                    以下為您的廣告在微享全球 WordPress 矩陣站群（現有 12 站 ➔ 邁向 100 站）與 AI Agent 每日發文內展示的真實視覺效果：
                  </p>

                  {/* 模擬廣告卡片 */}
                  <div className="rounded-2xl bg-gradient-to-br from-slate-950 via-indigo-950/90 to-slate-900 border-2 border-amber-400/50 p-5 shadow-2xl">
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40">
                        📢 萬商精選推薦 · {brandName || '合作夥伴'}
                      </span>
                      <span className="text-[10px] text-gray-400">Sponsored · WeiXiang AdNetwork</span>
                    </div>

                    {bannerImageUrl && (
                      <div className="mb-3 rounded-xl overflow-hidden border border-white/10 max-h-40">
                        <img src={bannerImageUrl} alt="Ad Banner" className="w-full h-36 object-cover" />
                      </div>
                    )}

                    <h3 className="text-base sm:text-lg font-black text-white mb-2 leading-snug">
                      {previewHeadline || '請於左側輸入您的廣告主標題'}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-4">
                      {previewBody || '請於左側輸入您的廣告宣傳短文...'}
                    </p>

                    <a
                      href={targetUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block w-full text-center py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs sm:text-sm shadow-md hover:scale-[1.01] transition-transform"
                    >
                      {previewCta}
                    </a>
                  </div>
                </div>

                {/* 系統說明與免責條款提醒卡 */}
                <div className="bg-slate-900/70 border border-white/10 rounded-3xl p-6 text-xs text-gray-300 space-y-2.5 leading-relaxed">
                  <div className="font-black text-amber-300 text-sm">📌 萬商廣告協播運作機制與規範說明</div>
                  <p>
                    1. <strong>雙軌全自動協播</strong>：當您點擊「儲存並發佈」後，系統會同時更新 Cloudflare R2 邊緣廣告池（供全網 WordPress 站群文章頁即時動態輪播），並供微享「本地端與雲端 AI Agent」每日自動發文時抓取嵌入文末。
                  </p>
                  <p>
                    2. <strong>曝光時間依天數精準計算</strong>：斗內 $15 享 30 天（1個月）、斗內 $120（買 8 個月送 4 個月）享 365 天 + VIP 3 倍輪播權重。到期後系統將自動停止輪播，隨時再次斗內即可無縫累加天數。
                  </p>
                  <p>
                    3. <strong>合規與免責聲明</strong>：本服務為斗內贊助之回饋贈禮，<strong>不保證具體點擊數或實際成交業績額</strong>。嚴禁投放色情、賭博、詐騙、非法吸金或誇大醫療偏方，違規將強制下架封號且不退費。
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
