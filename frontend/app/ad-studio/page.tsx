'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { SponsorAdvertiser, AdSlotCampaign } from '@/lib/adNetwork';

type EnrichedAdvertiser = SponsorAdvertiser & {
  remaining_days?: number;
  tier_name_zh?: string;
  tier_badge_zh?: string;
};

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

  // Advertiser profile & multi-slot campaign states
  const [advertiser, setAdvertiser] = useState<EnrichedAdvertiser | null>(null);
  const [adSlots, setAdSlots] = useState<AdSlotCampaign[]>([]);
  const [activeSlotIdx, setActiveSlotIdx] = useState<number>(0);

  // Current slot form fields
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
  const [slotEnabled, setSlotEnabled] = useState<boolean>(true);
  const [campaignStatus, setCampaignStatus] = useState<'ACTIVE' | 'PAUSED' | 'BANNED'>('ACTIVE');

  const [saving, setSaving] = useState(false);
  const [aiTranslating, setAiTranslating] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [statusNotice, setStatusNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [previewLang, setPreviewLang] = useState<'ZH' | 'CN' | 'EN' | 'JA'>('ZH');

  const loadSlotIntoForm = (slot: AdSlotCampaign) => {
    setBrandName(slot.brand_name || '');
    setHeadlineZh(slot.headline_zh || '');
    setHeadlineCn(slot.headline_cn || slot.headline_zh || '');
    setHeadlineEn(slot.headline_en || '');
    setHeadlineJa(slot.headline_ja || '');
    setBodyZh(slot.body_zh || '');
    setBodyCn(slot.body_cn || slot.body_zh || '');
    setBodyEn(slot.body_en || '');
    setBodyJa(slot.body_ja || '');
    setCtaTextZh(slot.cta_text_zh || '👉 立即前往了解詳情');
    setCtaTextEn(slot.cta_text_en || '👉 Learn More Now');
    setCtaTextJa(slot.cta_text_ja || '👉 今すぐ詳細を見る');
    setTargetUrl(slot.target_url || 'https://');
    setBannerImageUrl(slot.banner_image_url || '');
    setNicheCategory(slot.niche_category || 'ALL');
    setSlotEnabled(slot.enabled !== false);
  };

  const populateForm = (adv: EnrichedAdvertiser, keepSlotIdx = 0) => {
    setAdvertiser(adv);
    setCampaignStatus(adv.status || 'ACTIVE');
    const slots: AdSlotCampaign[] =
      Array.isArray(adv.ad_slots) && adv.ad_slots.length > 0
        ? adv.ad_slots
        : [
            {
              slot_id: `${adv.id}-slot-1`,
              brand_name: adv.brand_name || '',
              headline_zh: adv.headline_zh || '',
              headline_cn: adv.headline_cn || adv.headline_zh || '',
              headline_en: adv.headline_en || '',
              headline_ja: adv.headline_ja || '',
              body_zh: adv.body_zh || '',
              body_cn: adv.body_cn || adv.body_zh || '',
              body_en: adv.body_en || '',
              body_ja: adv.body_ja || '',
              cta_text_zh: adv.cta_text_zh || '👉 立即前往了解詳情',
              cta_text_en: adv.cta_text_en || '👉 Learn More Now',
              cta_text_ja: adv.cta_text_ja || '👉 今すぐ詳細を見る',
              target_url: adv.target_url || 'https://',
              banner_image_url: adv.banner_image_url || '',
              niche_category: adv.niche_category || 'ALL',
              enabled: true
            }
          ];
    setAdSlots(slots);
    const safeIdx = Math.min(keepSlotIdx, slots.length - 1);
    setActiveSlotIdx(safeIdx);
    loadSlotIntoForm(slots[safeIdx]);
  };

  const buildCurrentEditedSlots = (): AdSlotCampaign[] => {
    const next = [...adSlots];
    const currentSlot: AdSlotCampaign = {
      slot_id: next[activeSlotIdx]?.slot_id || `slot-${activeSlotIdx + 1}`,
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
      enabled: slotEnabled
    };
    next[activeSlotIdx] = currentSlot;
    return next;
  };

  const handleSwitchSlot = (targetIdx: number) => {
    if (!advertiser) return;
    const maxAllowed = advertiser.max_ad_slots || 1;
    if (targetIdx >= maxAllowed) return;

    const synced = buildCurrentEditedSlots();
    while (synced.length <= targetIdx) {
      synced.push({
        slot_id: `${advertiser.id}-slot-${synced.length + 1}`,
        brand_name: brandName || advertiser.brand_name || '',
        headline_zh: `🔥 【主打推薦 #${synced.length + 1}】歡迎造訪我們的精選服務與最新優惠！`,
        headline_cn: `🔥 【主打推荐 #${synced.length + 1}】欢迎造访我们的精选服务与最新优惠！`,
        headline_en: `🔥 [Featured #${synced.length + 1}] Discover Our Exclusive Services & Offers!`,
        headline_ja: `🔥 【注目おすすめ #${synced.length + 1}】厳選サービスと最新特典はこちら！`,
        body_zh: bodyZh || advertiser.body_zh || '',
        body_cn: bodyCn || advertiser.body_cn || '',
        body_en: bodyEn || advertiser.body_en || '',
        body_ja: bodyJa || advertiser.body_ja || '',
        cta_text_zh: ctaTextZh || '👉 立即前往了解詳情',
        cta_text_en: ctaTextEn || '👉 Learn More Now',
        cta_text_ja: ctaTextJa || '👉 今すぐ詳細を見る',
        target_url: targetUrl || advertiser.target_url || 'https://',
        banner_image_url: bannerImageUrl || '',
        niche_category: nicheCategory || 'ALL',
        enabled: true
      });
    }
    setAdSlots(synced);
    setActiveSlotIdx(targetIdx);
    loadSlotIntoForm(synced[targetIdx]);
    setStatusNotice(null);
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
            populateForm(data.advertiser, 0);
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
      populateForm(data.advertiser, 0);
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
          text: '✨ AI 已自動將您的廣告翻譯並潤飾為「繁中 / 簡中 / 英文 / 日文」4 大語系！請記得點擊底部「儲存並立即讓 AI 幫我全網打廣告」按鈕。'
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
        setStatusNotice({ type: 'success', text: `✨ 您的宣傳圖片已上傳成功！` });
      } else {
        setStatusNotice({ type: 'error', text: data.error || '圖片上傳失敗' });
      }
    } catch (err: any) {
      setStatusNotice({ type: 'error', text: '圖片上傳錯誤：' + err.message });
    } finally {
      setUploadingBanner(false);
    }
  };

  // 儲存廣告並同步發佈
  const handleSaveCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!advertiser) return;
    setSaving(true);
    setStatusNotice(null);
    try {
      const finalSlots = buildCurrentEditedSlots();
      const mainSlot = finalSlots[0] || {
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
        niche_category: nicheCategory
      };

      const res = await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_ad_campaign',
          adToken,
          email: advertiser.email,
          brand_name: mainSlot.brand_name,
          headline_zh: mainSlot.headline_zh,
          headline_cn: mainSlot.headline_cn || mainSlot.headline_zh,
          headline_en: mainSlot.headline_en || mainSlot.headline_zh,
          headline_ja: mainSlot.headline_ja || mainSlot.headline_zh,
          body_zh: mainSlot.body_zh,
          body_cn: mainSlot.body_cn || mainSlot.body_zh,
          body_en: mainSlot.body_en || mainSlot.body_zh,
          body_ja: mainSlot.body_ja || mainSlot.body_zh,
          cta_text_zh: mainSlot.cta_text_zh,
          cta_text_en: mainSlot.cta_text_en,
          cta_text_ja: mainSlot.cta_text_ja,
          target_url: mainSlot.target_url,
          banner_image_url: mainSlot.banner_image_url,
          niche_category: mainSlot.niche_category,
          ad_slots: finalSlots,
          status: campaignStatus
        })
      });
      const data = await res.json();
      if (!data.success) {
        setStatusNotice({ type: 'error', text: data.error || '儲存失敗' });
        return;
      }
      if (data.advertiser) populateForm(data.advertiser, activeSlotIdx);
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

  const maxSlotsAllowed = advertiser?.max_ad_slots || 1;
  const dailyRotations = advertiser?.daily_rotations_per_site || (advertiser?.weight && advertiser.weight >= 3 ? 180 : 60);

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
              📢 微享「萬商廣告小幫手」自助工作台 (/ad-studio)
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
                {isChinese ? '登入「萬商廣告小幫手」工作台' : 'Advertiser Studio Login'}
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
                <p className="text-xs text-gray-400 mt-1">
                  到期日：{advertiser.expires_at?.slice(0, 10)}（到期自動停播）
                </p>
                <Link
                  href="/sponsor"
                  className="mt-3 inline-block px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-400/50 text-cyan-200 text-xs font-bold hover:bg-cyan-500/30"
                >
                  ➕ 續加曝光天數 / 升級廣告件數
                </Link>
              </div>

              <div className="bg-gradient-to-br from-amber-950/60 to-purple-950/50 border border-amber-500/40 rounded-2xl p-5">
                <div className="text-xs text-amber-300 font-bold mb-1">👑 當前等級 · 頻率 · 廣告件數</div>
                <div className="text-base sm:text-lg font-black text-amber-300 mt-1">
                  {advertiser.tier_name_zh || (advertiser.weight >= 3 ? '🔥 $120 百站常駐型' : '⚡ $15 星火體驗型')}
                </div>
                <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">
                  • 協播頻率：<strong className="text-amber-200">{advertiser.weight}x 權重</strong>（每站每日約 {dailyRotations} 次）<br />
                  • 廣告件數上限：<strong className="text-pink-300">可上架 {maxSlotsAllowed} 件不同廣告</strong>
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
                  * 含全球百站矩陣輪播與每日新文章自動帶上您（不保證業績額）
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-950/60 to-pink-950/50 border border-purple-500/40 rounded-2xl p-5">
                <div className="text-xs text-purple-300 font-bold mb-1">🤖 AI 宣傳小幫手狀態</div>
                <div className="text-lg font-black text-white flex items-center gap-2 mt-1">
                  <span className={`w-3 h-3 rounded-full inline-block ${advertiser.remaining_days && advertiser.remaining_days > 0 && advertiser.status === 'ACTIVE' ? 'bg-emerald-400 animate-ping' : 'bg-red-500'}`} />
                  {advertiser.remaining_days && advertiser.remaining_days > 0 && advertiser.status === 'ACTIVE'
                    ? '24H 自動幫您曝光中'
                    : '已到期停播或已暫停'}
                </div>
                <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">
                  帳號：<code className="text-cyan-300">{advertiser.email}</code> | 密碼：<code className="text-amber-300 font-bold">{advertiser.password_code}</code>
                </p>
              </div>
            </div>

            {/* 5 大等級「廣告件數槽位切換器 (Multi-Slot Switcher)」 */}
            <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-amber-400/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <span className="text-xs font-black text-amber-300">
                    🎯 您的方案可同時上架 【{maxSlotsAllowed} 件】不同廣告輪番曝光（目前正在編輯：第 {activeSlotIdx + 1} 件）
                  </span>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    升級更高方案可解鎖更多廣告件數與更高頻率：$15 星火(1件/1x) ➔ $120 常駐(2件/3x) ➔ $888 黃金(5件/8x) ➔ $2,700 皇家(12件/20x) ➔ $6,000 至尊(30件/50x)
                  </p>
                </div>
                <Link
                  href="/sponsor"
                  className="text-xs font-black text-amber-300 bg-amber-500/20 border border-amber-400/50 px-3 py-1.5 rounded-xl hover:bg-amber-500/30 whitespace-nowrap self-start sm:self-auto"
                >
                  🚀 升級方案解鎖更多廣告件數 ➔
                </Link>
              </div>

              <div className="flex flex-wrap gap-2">
                {Array.from({ length: Math.max(maxSlotsAllowed, 5) }).map((_, idx) => {
                  const isUnlocked = idx < maxSlotsAllowed;
                  const isCurrent = idx === activeSlotIdx;
                  const existingSlot = adSlots[idx];
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        if (isUnlocked) {
                          handleSwitchSlot(idx);
                        } else {
                          setStatusNotice({
                            type: 'error',
                            text: `🔒 第 ${idx + 1} 件廣告槽位需升級更高方案解鎖！（$120 享 2 件、$888 享 5 件、$2,700 享 12 件、$6,000 享 30 件）`
                          });
                        }
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer border ${
                        isCurrent
                          ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 border-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.4)] scale-105'
                          : isUnlocked
                          ? 'bg-slate-800 hover:bg-slate-700 text-white border-white/15'
                          : 'bg-slate-950/60 text-gray-500 border-white/5 opacity-70'
                      }`}
                    >
                      <span>{isUnlocked ? '📢' : '🔒'}</span>
                      <span>廣告 #{idx + 1}</span>
                      {isUnlocked && existingSlot?.headline_zh && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" title="已設定內容" />
                      )}
                    </button>
                  );
                })}
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
                    <span className="text-xs font-black text-cyan-400">
                      AD SLOT #{activeSlotIdx + 1} OF {maxSlotsAllowed}
                    </span>
                    <h2 className="text-xl font-black text-white mt-0.5">
                      🛠️ 設定您的「第 {activeSlotIdx + 1} 件」廣告文案 ＆ 導流連結窗口
                    </h2>
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

                {/* 廣告橫幅圖片上傳 */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    7. 廣告宣傳圖片（選填，可直接從手機/電腦上傳圖片，或貼上圖片網址）
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      type="text"
                      value={bannerImageUrl}
                      onChange={e => setBannerImageUrl(e.target.value)}
                      placeholder="請點擊右側按鈕上傳圖片，或貼上圖片網址..."
                      className="flex-1 px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-gray-200 font-mono"
                    />
                    <label className="px-4 py-2 rounded-xl bg-indigo-600/40 hover:bg-indigo-600/60 border border-indigo-400/50 text-indigo-200 text-xs font-bold cursor-pointer text-center shrink-0">
                      {uploadingBanner ? '⏳ 正在上傳圖片...' : '📤 點此上傳宣傳圖片'}
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
                    <span className="text-gray-400">全帳號投放狀態：</span>
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
                    {saving ? '⏳ 正在儲存並派發給 AI 小幫手...' : '🚀 儲存並立即讓 AI 幫我全網打廣告'}
                  </button>
                </div>
              </form>

              {/* 右側 5 欄：全網文章內嵌廣告卡即時預覽 */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-slate-900/90 border border-cyan-500/30 rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black text-cyan-400">
                      👁️ 第 {activeSlotIdx + 1} 件廣告招牌即時預覽
                    </span>
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
                    以下就是您的廣告招牌在我們全球多語系主題網站群（邁向 100 站）與每日新文章裡讓讀者看到的真實模樣：
                  </p>

                  {/* 模擬廣告卡片 */}
                  <div className="rounded-2xl bg-gradient-to-br from-slate-950 via-indigo-950/90 to-slate-900 border-2 border-amber-400/50 p-5 shadow-2xl">
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40">
                        {advertiser.tier_badge_zh || '📢 萬商精選推薦'} · {brandName || '合作夥伴'}
                      </span>
                      <span className="text-[10px] text-gray-400">Slot #{activeSlotIdx + 1}</span>
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
                  <div className="font-black text-amber-300 text-sm">🤝 斗內一下、回您一把 · 貼心小叮嚀</div>
                  <p>
                    1. <strong>1 秒即時生效、隨時都能改</strong>：當您按下「儲存」後，我們的 AI 宣傳小幫手就會在每天發表全球多國語言新文章時，自動幫您掛上這張漂亮的名片招牌！想換活動或改台詞隨時都能上來改。
                  </p>
                  <p>
                    2. <strong>曝光天數與到期自動停播規則</strong>：您的廣告會在可用天數內全網輪播；當可用時間結束後，各 WordPress 網站將自動停止輪播您的廣告。您隨時可至 <Link href="/sponsor" className="text-amber-300 underline">/sponsor</Link> 或 <Link href="/dashboard" className="text-cyan-300 underline">/dashboard 會員後台</Link> 續加時間！
                  </p>
                  <p>
                    3. <strong>安心合規與免責約定</strong>：這套 AI 宣傳技能是感謝您贊助我們 AI-SKILLS 開發的回禮，<strong>保證在天數內幫您全網輪播曝光，但不保證具體點擊數或實際成交業績額喔</strong>。嚴禁放色情、賭博、詐騙或誇大醫療偏方（違規將下架且不退費）。
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
