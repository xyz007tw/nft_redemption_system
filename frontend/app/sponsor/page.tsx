'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import BuyNFTButton from '@/components/BuyNFTButton';
import PayUniButton from '@/components/PayUniButton';
import PayPalButton from '@/components/PayPalButton';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Link from 'next/link';

export default function SponsorPage() {
  const { t, lang } = useLanguage();
  const isChinese = lang.includes('zh');
  const isJa = lang === 'ja-JP';
  const introVideoUrl = isChinese ? 'https://www.youtube.com/embed/nm2lVetbkaw' : 'https://www.youtube.com/embed/yMWApJ4uvcU';

  const pitchTitle = isJa
    ? '微享 AI インフラ＆「万商広告ネットワーク SaaS」について'
    : isChinese
    ? '關於微享 AI 基礎設施 ×「萬商自助廣告協播系統」'
    : 'About WeiXiang AI Infrastructure & Global Ad Network SaaS';

  const pitchDesc = isJa
    ? 'ご賛助（ドネーション）いただいた資金は以下の用途に活用され、さらに特典として「万商広告システム」アカウントが付与されます：'
    : isChinese
    ? '您的溫暖斗內贊助將被運用於擴建全球 AI 節點，並額外獲贈超值「萬商廣告系統」自助協播權限：'
    : 'Your sponsorship fuels our AI infrastructure and unlocks self-service access to our Global Ad Network SaaS:';

  const point1 = isJa
    ? '⚡ $15 USD 以上の賛助：万商広告システム「1ヶ月（30日間）」協播権を進呈！専用アカウント＆パスワードを即時発行。'
    : isChinese
    ? '⚡ 斗內滿 $15 USD：贈送「1 個月（30 天）萬商廣告系統」協播權！即時發送專屬帳號與密碼，自行上架廣告文案與導流連結。'
    : '⚡ Sponsor $15+ USD: Unlock 1 Month (30 Days) of Global Ad Network access! Receive instant login credentials to post your ad copy & funnel link.';

  const point2 = isJa
    ? '🔥 $120 USD 以上の賛助（8ヶ月分に4ヶ月無料進呈＝計365日間）：丸1年間（365日）＋「VIP 3倍露出ウェイト」で全ワードプレスサイト＆AIエージェント記事に協播！'
    : isChinese
    ? '🔥 斗內滿 $120 USD（買 8 個月送 4 個月＝共 365 天整年霸屏）：享一整年 365 天萬商廣告協播權 ＋「VIP 3 倍輪播權重」，同步由本地/雲端 AI Agent 嵌入每日新發文章！'
    : '🔥 Sponsor $120+ USD (Buy 8 Months, Get 4 Months Free = 365 Days): Full-year 365-day ad syndication + VIP 3x rotation weight across our WordPress matrix & AI Agent articles!';

  const point3 = isJa
    ? '📈 自己消費100%ランク昇格対象：賛助金額はすべて個人の「アフィリエイト昇格累計実績（total_sales）」に100%加算されます（純粋な賛助のため、業績・売上保証はありません）。'
    : isChinese
    ? '📈 100% 計入個人級差升等業績：所有斗內金額皆 100% 併入您個人的「級差分潤升等累積業績」（純贊助回饋性質，不保證具體點擊或成交業績額）。'
    : '📈 100% Counted Toward Tier Upgrade Volume: All sponsorship amounts count 100% toward your personal affiliate tier qualification (sponsorship perk; no specific revenue guarantee).';

  const pitchFooter = isJa
    ? '（決済完了後、登録メールアドレスへ「万商広告システム（/ad-studio）」のログインID・パスワードが自動送信されます）'
    : isChinese
    ? '（付款成功後，系統將 0 秒自動寄發「📢 萬商廣告系統 (/ad-studio)」專屬帳號密碼至您的信箱！）'
    : '(Upon payment, your login ID & password for the Ad Studio (/ad-studio) will be emailed to you automatically!)';

  const selectSponsorTitle = isJa
    ? '⚡ 賛助（ドネーション）＆万商広告プランを選択'
    : isChinese
    ? '⚡ 選擇您的斗內贊助 ＆ 萬商廣告協播方案'
    : '⚡ Choose Your Sponsorship & Ad Network Tier';

  const selectSponsorDesc = isJa
    ? '$15（30日間広告協播）または $120（8ヶ月+4ヶ月無料＝365日間 VIP 3倍協播）をお選びいただけます。'
    : isChinese
    ? '自由選擇 $3 純贊助、$15（含 1 個月萬商廣告協播）或最划算的 $120（買 8 個月送 4 個月＝365 天整年霸屏協播）！'
    : 'Choose $3 pure support, $15 (1-Month Ad Network), or best-value $120 (8+4 Months = 365 Days Full-Year VIP Ad Network)!';

  // 內建保底的 3 大黃金斗內與萬商廣告方案 ($3 純斗內 / $15 用1個月 / $120 買8送4共365天)
  const fallbackSponsorPackages = [
    {
      id: 901,
      price: 3,
      name_zh: '💖 $3 溫暖純斗內 (計入升等業績)',
      name_en: '💖 $3 Warm Support (Tier Volume)',
      product_type: 'SPONSOR',
      badge: isChinese ? '純贊助支持' : 'Pure Support',
      daysLabel: isChinese ? '累積 $3 升等業績' : '+$3 Tier Volume'
    },
    {
      id: 915,
      price: 15,
      name_zh: '⚡ $15 萬商廣告協播 1 個月 (30天)',
      name_en: '⚡ $15 Ad Network 1-Month (30 Days)',
      product_type: 'SPONSOR',
      badge: isChinese ? '🌟 熱門體驗・送30天廣告台' : '🌟 Popular · 30-Day Ad Studio',
      daysLabel: isChinese ? '贈 30 天萬商自助廣告權 (1x權重)' : '30 Days Self-Serve Ads (1x Weight)'
    },
    {
      id: 920,
      price: 120,
      name_zh: '🔥 $120 萬商廣告買8送4 (共365天霸屏)',
      name_en: '🔥 $120 Ad Network 365-Day VIP (8+4 Mo)',
      product_type: 'SPONSOR',
      badge: isChinese ? '👑 最超值・買8送4共365天+3倍曝光' : '👑 Best Value · 365 Days + 3x VIP',
      daysLabel: isChinese ? '贈 365 天整年廣告權 (VIP 3倍權重)' : '365 Days Full-Year Ads (VIP 3x Weight)'
    }
  ];

  const [packages, setPackages] = useState<any[]>(fallbackSponsorPackages);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<any>(fallbackSponsorPackages[1]); // 預設選中 $15 方案
  const [agreedNoGuarantee, setAgreedNoGuarantee] = useState(true);

  useEffect(() => {
    fetch('/api/admin/packages')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.packages)) {
          const activeSponsorPackages = data.packages.filter((pkg: any) => pkg.is_active && pkg.product_type === 'SPONSOR');
          // 合併資料庫中的 SPONSOR 方案與保底之 $15 / $120 萬商廣告方案
          const merged = [...activeSponsorPackages];
          for (const fb of fallbackSponsorPackages) {
            if (!merged.some(p => Number(p.price) === fb.price)) {
              merged.push(fb);
            }
          }
          merged.sort((a: any, b: any) => Number(a.price) - Number(b.price));
          setPackages(merged);
          const default15 = merged.find((p: any) => Number(p.price) === 15) || merged[0];
          if (default15) setSelectedPackage(default15);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-[#0a0a0f] text-white flex flex-col items-center pt-28 pb-28 md:pb-20 px-4 relative">
      {/* 頂部導覽列 */}
      <div className="w-full max-w-7xl flex flex-wrap justify-between items-center p-4 md:p-6 absolute top-0 left-0 right-0 mx-auto z-30 gap-3">
        <Link
          href="/"
          className="text-lg md:text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 cursor-pointer hover:scale-105 transition-transform"
        >
          ← WeiXiang AI
        </Link>
        <div className="flex items-center gap-2.5 md:gap-4">
          <Link
            href="/ad-studio"
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-pink-500/20 border border-amber-400/50 text-amber-300 hover:bg-amber-500/30 text-xs sm:text-sm font-black transition-all shadow-lg"
          >
            📢 {isJa ? '万商広告スタジオへログイン (/ad-studio)' : isChinese ? '已斗內客戶・登入「萬商廣告後台 (/ad-studio)」➔' : 'Advertiser Login (/ad-studio) ➔'}
          </Link>
          <LanguageSwitcher />
        </div>
      </div>

      {/* 標題區 */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-black mb-4">
        <span>📢</span>
        <span>
          {isJa
            ? 'ドネーション特典：100サイト規模のWPマトリクス＆AIエージェント広告協播システム'
            : isChinese
            ? '斗內贊助超值回饋：自動開通「萬商自助廣告協播 SaaS 系統」帳號密碼！'
            : 'Sponsorship Perk: Instant Access to Our Self-Serve Global Ad Network SaaS!'}
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-500 mb-4 text-center max-w-4xl leading-tight">
        {isJa
          ? '💎 AI算力ノード賛助 × 万商セルフ広告協播システム'
          : isChinese
          ? '💎 溫暖斗內贊助 ×「萬商自助廣告協播系統」開通專區'
          : '💎 Sponsor AI Compute × Unlock Global Self-Serve Ad Network'}
      </h1>
      <p className="text-gray-300 max-w-3xl text-center mb-10 text-sm sm:text-base leading-relaxed">
        {isJa
          ? '$15以上の賛助で1ヶ月（30日間）、$120以上の賛助（8ヶ月＋4ヶ月無料＝計365日間）で丸1年間、ご自身の広告文章と誘導リンクを全ワードプレス群およびAIエージェント日刊記事に自動協播できます（業績・売上額の保証はございません）。'
          : isChinese
          ? '凡於本頁斗內滿 $15 USD 可使用 1 個月（30 天）萬商廣告協播；斗內 $120 USD（買 8 個月送 4 個月）可使用整整 365 天 VIP 3 倍權重協播！系統將自動提供專屬帳號密碼，讓您在系統內自行架設廣告文案與導流連結窗口（純贊助回饋，不保證業績額）。'
          : 'Sponsor $15+ for 1 Month (30 Days) or $120+ (8+4 Months Free = 365 Days) to receive your own Ad Studio account & password. Set up your ad copy and funnel link to broadcast across our WordPress matrix and AI Agent daily posts (no revenue guarantee).'}
      </p>

      {/* 萬商廣告 3 大方案亮點比較橫幅 */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <div className="bg-slate-900/90 border border-blue-500/40 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <span className="text-xs font-black px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
              STEP 1 · 斗內即開通帳密
            </span>
            <h3 className="text-lg font-black text-white mt-3 mb-1">
              {isChinese ? '⚡ $15 體驗 30 天 / $120 霸屏 365 天' : '⚡ $15 (30 Days) / $120 (365 Days)'}
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              {isChinese
                ? '付款成功後 0 秒自動寄發「萬商廣告系統帳號與專屬密碼」至您的信箱，同時金額 100% 計入您個人的 25% 級差升等累積業績！'
                : 'Receive your Ad Studio account & password immediately after payment, plus 100% credit toward your affiliate tier volume!'}
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-white/10 text-[11px] text-cyan-300 font-bold">
            ✔ $120 方案享「買 8 個月送 4 個月」平均每天僅 $0.32 USD！
          </div>
        </div>

        <div className="bg-slate-900/90 border border-purple-500/40 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <span className="text-xs font-black px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30">
              STEP 2 · 客戶自助上架廣告
            </span>
            <h3 className="text-lg font-black text-white mt-3 mb-1">
              {isChinese ? '🛠️ 自行設定廣告文案 ＆ 導流連結窗口' : '🛠️ Self-Serve Ad Copy & Funnel Link'}
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              {isChinese
                ? '隨時登入 /ad-studio 自助修改品牌名稱、廣告標題、宣傳短文、圖片與 LINE/官網/賣場導流連結，內建「✨ AI 一鍵翻譯繁/簡/英/日 4 語系」！'
                : 'Log into /ad-studio anytime to edit your headline, description, banner, and target URL with 1-click AI 4-language translation!'}
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-white/10 text-[11px] text-purple-300 font-bold">
            ✔ 儲存後 1 秒同步至 Cloudflare R2 全網廣告池！
          </div>
        </div>

        <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              STEP 3 · 全網矩陣 ＋ AI Agent 協播
            </span>
            <h3 className="text-lg font-black text-white mt-3 mb-1">
              {isChinese ? '🌐 邁向 100 站 WP 矩陣 × AI Agent 自動抓取' : '🌐 100-Site WP Matrix & AI Agent Feed'}
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              {isChinese
                ? '除了在全網 WordPress 矩陣文章內動態輪播您的廣告卡片外，微享「本地端與雲端 AI Agent」每日自動發文時亦會主動抓取您的廣告資訊嵌入文末！'
                : 'Your ad rotates dynamically across all WordPress matrix articles AND is automatically pulled by our local/cloud AI Agents into daily SEO posts!'}
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-white/10 text-[11px] text-emerald-300 font-bold">
            ✔ 後台即時查看曝光與點擊次數統計（不保證業績額）
          </div>
        </div>
      </div>

      {/* 選購與結帳區（移至上方醒目位置，方便客戶立即操作） */}
      <div className="w-full max-w-2xl bg-gradient-to-b from-gray-900 to-black border-2 border-cyan-500/40 rounded-3xl p-6 sm:p-8 mb-14 relative overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.18)]">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <h3 className="text-2xl font-black text-center mb-2">{selectSponsorTitle}</h3>
        <p className="text-gray-400 text-center mb-6 text-xs sm:text-sm">{selectSponsorDesc}</p>

        {isLoading ? (
          <div className="text-center py-10 text-gray-500">讀取贊助方案...</div>
        ) : (
          <div className="flex flex-col gap-5 relative z-10">
            {/* 方案按鈕 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {packages.map(pkg => {
                const p = Number(pkg.price);
                const is120 = p >= 99;
                const is15 = p >= 15 && p < 99;
                const isSelected = selectedPackage?.id === pkg.id && Number(selectedPackage?.price) === p;

                return (
                  <button
                    key={`${pkg.id}-${pkg.price}`}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? is120
                          ? 'border-amber-400 bg-amber-500/15 shadow-[0_0_25px_rgba(251,191,36,0.3)] scale-[1.02]'
                          : 'border-cyan-400 bg-cyan-500/15 shadow-[0_0_20px_rgba(34,211,238,0.25)] scale-[1.02]'
                        : 'border-white/10 bg-black/40 hover:border-white/30'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className={`text-2xl font-black ${is120 ? 'text-amber-400' : is15 ? 'text-cyan-400' : 'text-blue-400'}`}>
                          ${pkg.price} <span className="text-xs font-normal text-gray-400">USD</span>
                        </span>
                        {is120 && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                            買8送4·365天
                          </span>
                        )}
                        {is15 && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950">
                            送30天廣告
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-white mt-1">
                        {lang === 'zh-TW' || lang === 'zh-CN' ? pkg.name_zh : pkg.name_en}
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/10 text-[11px] text-gray-300">
                      {is120
                        ? isChinese
                          ? '🔥 贈 365 天萬商廣告台 (VIP 3倍曝光)'
                          : '🔥 365-Day Ad Studio (VIP 3x Weight)'
                        : is15
                        ? isChinese
                          ? '⚡ 贈 30 天萬商廣告台 (標準協播)'
                          : '⚡ 30-Day Ad Studio Access'
                        : isChinese
                        ? '💖 純斗內支持 (+計入升等業績)'
                        : '💖 Pure Support (+Tier Volume)'}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 事前公開免責聲明確認框（不保證業績額） */}
            {Number(selectedPackage?.price) >= 15 && (
              <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 leading-relaxed">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedNoGuarantee}
                    onChange={e => setAgreedNoGuarantee(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-amber-400 shrink-0"
                  />
                  <span>
                    <strong>【萬商廣告協播使用須知（不保證業績額）】</strong>：本人了解斗內滿 $15 可使用 1 個月（30天）、滿 $120（買 8 個月送 4 個月）可使用 365 天萬商廣告系統自助上架廣告文案與連結。本權益為贊助 AI 算力之附加回饋贈禮，<strong>系統保證於效期內全網協播曝光，惟不保證具體點擊數或實際成交業績額，且嚴禁投放違法/詐騙/色情內容（違規強制下架不退費）</strong>。
                  </span>
                </label>
              </div>
            )}

            {/* 結帳區 */}
            {selectedPackage && (Number(selectedPackage.price) < 15 || agreedNoGuarantee) ? (
              <div className="mt-2 flex flex-col gap-3.5">
                <PayUniButton
                  packageId={selectedPackage.id}
                  priceInUSDT={selectedPackage.price}
                  productType="SPONSOR"
                  productName={lang.includes('zh') ? selectedPackage.name_zh : selectedPackage.name_en}
                />

                <PayPalButton
                  packageId={selectedPackage.id}
                  priceInUSDT={selectedPackage.price}
                  productType="SPONSOR"
                  productName={lang.includes('zh') ? selectedPackage.name_zh : selectedPackage.name_en}
                />

                <div className="relative flex items-center py-1">
                  <div className="flex-grow border-t border-white/10"></div>
                  <span className="flex-shrink-0 mx-4 text-white/40 text-xs">或使用 Web3 USDT 錢包贊助</span>
                  <div className="flex-grow border-t border-white/10"></div>
                </div>

                <BuyNFTButton packageId={selectedPackage.id} priceInUSDT={selectedPackage.price} />
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-gray-800 text-amber-300 text-center text-xs font-bold">
                ☝️ 請先勾選上方「萬商廣告協播使用須知（不保證業績額）」以解鎖付款按鈕
              </div>
            )}

            <div className="text-center pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
              <span>* 付款成功後系統將自動寄發萬商廣告帳密至您的信箱</span>
              <Link href="/ad-studio" className="text-cyan-400 hover:underline font-bold">
                🔑 已有帳號？點此直接登入萬商廣告台 (/ad-studio) ➔
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* 內容/影音播放區 */}
      <div className="w-full max-w-5xl bg-gradient-to-b from-gray-900/80 to-black/90 border border-purple-500/30 rounded-3xl p-6 md:p-10 mb-12 shadow-[0_0_50px_rgba(168,85,247,0.15)] flex flex-col items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <h2 className="text-2xl md:text-4xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 text-center tracking-wide z-10">
          {isChinese ? '💎 共創 AI 流量革命：贊助微享 AI-ATM 研發 × 萬商廣告全網協播' : '💎 CO-CREATE THE AI TRAFFIC REVOLUTION & AD NETWORK'}
        </h2>

        {/* Infographic Image */}
        <div className="w-full mb-10 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/10 z-10 group">
          <img
            src={isChinese ? '/sponsor-zh.jpg' : '/sponsor-en.jpg'}
            alt="Sponsorship Infographic"
            className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-700"
          />
        </div>

        {/* YouTube Short Video & Features */}
        <div className="w-full flex flex-col md:flex-row items-center md:items-stretch gap-8 z-10">
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <div className="w-full max-w-[315px] aspect-[9/16] bg-black rounded-3xl overflow-hidden relative shadow-[0_0_40px_rgba(147,51,234,0.3)] border border-purple-500/40 hover:border-purple-400 transition-colors duration-300">
              <iframe
                width="100%"
                height="100%"
                src={introVideoUrl}
                title="WeiXiang AI Introduction"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0"
              ></iframe>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 hover:bg-white/10 transition-colors duration-300 shadow-xl h-full flex flex-col justify-center">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white flex items-center gap-3">
                <span className="text-3xl">🚀</span> {pitchTitle}
              </h3>
              <p className="text-gray-300 mb-6 text-sm sm:text-base">{pitchDesc}</p>

              <ul className="space-y-5">
                <li className="flex items-start gap-3.5">
                  <div className="mt-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full p-1.5 shadow-[0_0_15px_rgba(59,130,246,0.5)] shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-gray-200 text-sm sm:text-base font-medium leading-relaxed">{point1}</span>
                </li>
                <li className="flex items-start gap-3.5">
                  <div className="mt-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-1.5 shadow-[0_0_15px_rgba(168,85,247,0.5)] shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-gray-200 text-sm sm:text-base font-medium leading-relaxed">{point2}</span>
                </li>
                <li className="flex items-start gap-3.5">
                  <div className="mt-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full p-1.5 shadow-[0_0_15px_rgba(16,185,129,0.5)] shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-gray-200 text-sm sm:text-base font-medium leading-relaxed">{point3}</span>
                </li>
              </ul>

              <div className="mt-auto pt-6 border-t border-white/10">
                <p className="text-xs sm:text-sm text-cyan-400 font-bold flex items-center gap-2">✨ {pitchFooter}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
