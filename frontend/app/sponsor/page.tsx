'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import BuyNFTButton from '@/components/BuyNFTButton';
import PayUniButton from '@/components/PayUniButton';
import PayPalButton from '@/components/PayPalButton';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Link from 'next/link';

export default function SponsorPage() {
  const { lang } = useLanguage();
  const isChinese = lang.includes('zh');
  const isCN = lang === 'zh-CN';
  const isJa = lang === 'ja-JP';
  const isKo = lang === 'ko-KR';
  const isVi = lang === 'vi-VN';
  const isId = lang === 'id-ID';
  const introVideoUrl = isChinese ? 'https://www.youtube.com/embed/nm2lVetbkaw' : 'https://www.youtube.com/embed/yMWApJ4uvcU';

  const pitchTitle = isJa
    ? '☕ ドネーションで応援 × 私たちの「AIスキル」であなたに恩返し！'
    : isCN
    ? '☕ 斗内一下、回您一把！赞助我们的 AI-SKILLS 开发，也把这套 AI 技能回馈给您'
    : isChinese
    ? '☕ 斗內一下、回您一把！贊助我們的 AI-SKILLS 開發，也把這套 AI 技能回饋給您'
    : isKo
    ? '☕ 가볍게 후원하고 AI 스킬로 보답받으세요! AI-SKILLS 개발 후원 & 글로벌 AI 홍보 혜택'
    : isVi
    ? '☕ Ủng Hộ Nhỏ, Đáp Lễ Lớn! Tài Trợ Phát Triển AI-SKILLS & Nhận Ngay Kỹ Năng AI Quảng Bá'
    : isId
    ? '☕ Traktir Kopi, Kami Bantu Promosi! Dukung Riset AI-SKILLS Kami & Gunakan untuk Brand Anda'
    : '☕ Tip Us a Coffee, We Boost You Back! Sponsor Our AI-SKILLS & Use Them for Your Brand';

  const pitchDesc = isJa
    ? '難しい専門知識は一切不要です！私たちのAI開発を応援していただくと、感謝の気持ちとして「全自動AI広報アシスタント（万商広告システム）」をすぐにご利用いただけます：'
    : isCN
    ? '完全不用懂任何复杂技术！您随手支持我们开发更聪明的 AI 工具，我们就派这群「24 小时不休息的 AI 宣传小帮手」帮您的品牌、好物或名片在全世界曝光：'
    : isChinese
    ? '完全不用懂任何複雜技術！您隨手支持我們開發更聰明的 AI 工具，我們就派這群「24 小時不休息的 AI 宣傳小幫手」幫您的品牌、好物或名片在全世界曝光：'
    : 'Zero tech skills needed! When you support our AI R&D, we thank you by putting our 24/7 AI Marketing Assistants to work promoting your brand, store, or business card worldwide:';

  const point1 = isJa
    ? '⚡ $15 USD 以上の応援：「1ヶ月（30日間）」万商広告アシスタントをプレゼント！専用IDとパスワードがすぐ届き、宣伝文とリンクを貼るだけで完了。'
    : isCN
    ? '⚡ 斗内满 $15 USD（体验回礼 30 天）：马上送您「1 个月万商广告小帮手」！专属帐密立刻寄到信箱，像发动态一样贴上您的介绍跟 LINE/网址，AI 就开始天天帮您打广告。'
    : isChinese
    ? '⚡ 斗內滿 $15 USD（體驗回禮 30 天）：馬上送您「1 個月萬商廣告小幫手」！專屬帳密立刻寄到信箱，像發動態一樣貼上您的介紹跟 LINE/網址，AI 就開始天天幫您打廣告。'
    : '⚡ Sponsor $15+ USD (30-Day Gift): Get 1 Month of our Self-Serve Ad Studio! Receive your login instantly—just paste your intro and link, and let our AI spread the word.';

  const point2 = isJa
    ? '🔥 $120 USD 以上の応援（8ヶ月分に4ヶ月無料進呈＝丸1年365日）：たっぷり365日間＋「VIP 3倍優先露出」で、世界中の多言語サイトと毎日の新着記事にあなたの看板を掲載！'
    : isCN
    ? '🔥 斗内满 $120 USD（买 8 个月送 4 个月＝365 天全年力挺）：整整一年 365 天免操心！再送「VIP 3 倍优先曝光」，我们每天新写的全球多国语言文章都会主动帮您挂上宣传招牌！'
    : isChinese
    ? '🔥 斗內滿 $120 USD（買 8 個月送 4 個月＝365 天全年力挺）：整整一年 365 天免操心！再送「VIP 3 倍優先曝光」，我們每天新寫的全球多國語言文章都會主動幫您掛上宣傳招牌！'
    : '🔥 Sponsor $120+ USD (Buy 8 Months, Get 4 Free = 365 Days): A full year of non-stop exposure + VIP 3x Priority Rotation across our global multilingual sites and daily articles!';

  const point3 = isJa
    ? '💝 応援金額は100%あなたの会員ランク実績に加算：すべてのドネーション金額は個人の昇格累計実績に100%カウントされます（純粋な応援返礼ギフトのため、売上額の保証はございません）。'
    : isCN
    ? '💝 斗内金额 100% 帮您累积会员升等资格：每一笔支持都会 100% 算进您的「个人升等累积业绩」里！（这是我们感谢您赞助研发的纯心意回馈，不保证具体业绩成交额喔）。'
    : isChinese
    ? '💝 斗內金額 100% 幫您累積會員升等資格：每一筆支持都會 100% 算進您的「個人升等累積業績」裡！（這是我們感謝您贊助研發的純心意回饋，不保證具體業績成交額喔）。'
    : '💝 100% Counted Toward Your VIP Tier Upgrade: Every dollar you sponsor counts 100% toward your personal tier upgrade volume (a heartfelt thank-you perk; no specific sales guarantee).';

  const pitchFooter = isJa
    ? '（決済完了後、すぐに登録メールへ「万商広告スタジオ（/ad-studio）」の専用ID・パスワードをお送りします！）'
    : isCN
    ? '（完成斗内后，系统 0 秒自动把「📢 万商广告小帮手 (/ad-studio)」专属帐号密码寄到您的信箱，打开就能用！）'
    : isChinese
    ? '（完成斗內後，系統 0 秒自動把「📢 萬商廣告小幫手 (/ad-studio)」專屬帳號密碼寄到您的信箱，打開就能用！）'
    : '(Right after tipping, we instantly email your Ad Studio (/ad-studio) login ID & password—ready to use in seconds!)';

  const selectSponsorTitle = isJa
    ? '🎁 応援プランを選んで、AI宣伝アシスタントを受け取る'
    : isCN
    ? '🎁 斗内一下、回您一把！选择您的支持与 AI 技能回馈方案'
    : isChinese
    ? '🎁 斗內一下、回您一把！選擇您的支持與 AI 技能回饋方案'
    : isKo
    ? '🎁 후원 플랜 선택 & AI 홍보 어시스턴트 받기'
    : isVi
    ? '🎁 Chọn Gói Ủng Hộ & Nhận Trợ Lý Quảng Cáo AI'
    : isId
    ? '🎁 Pilih Paket Dukungan & Dapatkan Asisten Iklan AI'
    : '🎁 Tip & Get Boosted: Choose Your Support & AI Skill Perk';

  const selectSponsorDesc = isJa
    ? '純粋な応援（$3）、1ヶ月お試し（$15・30日間）、または一番人気の丸1年VIP応援（$120・8ヶ月＋4ヶ月無料＝365日間）から自由に選べます！'
    : isCN
    ? '请总工程师喝杯珍奶 ($3)、小额体验 1 个月 ($15)，或最划算的「买 8 个月送 4 个月＝365 天全年 VIP 力挺 ($120)」自由选！'
    : isChinese
    ? '請總工程師喝杯珍奶 ($3)、小額體驗 1 個月 ($15)，或最划算的「買 8 個月送 4 個月＝365 天全年 VIP 力挺 ($120)」自由選！'
    : 'Buy our Chief Engineer a boba ($3), try 1 Month ($15), or grab the best-value 365-Day Full-Year VIP Pack ($120 = Buy 8 Get 4 Months Free)!';

  // 內建保底的 3 大黃金斗內與萬商廣告方案 ($3 純斗內 / $15 用1個月 / $120 買8送4共365天)
  const fallbackSponsorPackages = [
    {
      id: 901,
      price: 3,
      name_zh: isCN ? '☕ $3 请喝杯珍奶・纯支持研发' : '☕ $3 請喝杯珍奶・純支持研發',
      name_en: '☕ $3 Buy Us a Boba · Pure Support',
      product_type: 'SPONSOR',
      badge: isCN ? '温暖纯支持' : isChinese ? '溫暖純支持' : 'Pure Support',
      daysLabel: isCN ? '累积 $3 个人升等业绩' : isChinese ? '累積 $3 個人升等業績' : '+$3 Tier Volume'
    },
    {
      id: 915,
      price: 15,
      name_zh: isCN ? '⚡ $15 斗内回礼・AI 帮您打广告 30 天' : '⚡ $15 斗內回禮・AI 幫您打廣告 30 天',
      name_en: '⚡ $15 AI Ad Assistant · 30 Days',
      product_type: 'SPONSOR',
      badge: isCN ? '🌟 新手最爱・送30天AI广告台' : isChinese ? '🌟 新手最愛・送30天AI廣告台' : '🌟 Starter · 30-Day AI Ad Studio',
      daysLabel: isCN ? '赠 30 天万商自助广告权' : isChinese ? '贈 30 天萬商自助廣告權' : '30 Days Self-Serve AI Ads'
    },
    {
      id: 920,
      price: 120,
      name_zh: isCN ? '👑 $120 买8送4・AI 全年帮您打广告 365天' : '👑 $120 買8送4・AI 全年幫您打廣告 365天',
      name_en: '👑 $120 Full-Year VIP AI Ads (365 Days)',
      product_type: 'SPONSOR',
      badge: isCN ? '👑 最超值・买8送4共365天+3倍曝光' : isChinese ? '👑 最超值・買8送4共365天+3倍曝光' : '👑 Best Value · 365 Days + 3x VIP',
      daysLabel: isCN ? '赠 365 天全年广告权 (VIP 3倍曝光)' : isChinese ? '贈 365 天全年廣告權 (VIP 3倍曝光)' : '365 Days Full-Year Ads (VIP 3x Boost)'
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
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-[#080911] text-white flex flex-col items-center pt-28 pb-28 md:pb-20 px-4 relative">
      {/* 柔和網感背景光暈 */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[680px] h-[320px] bg-gradient-to-r from-amber-500/15 via-pink-500/15 to-cyan-500/15 blur-[130px] pointer-events-none" />

      {/* 頂部導覽列 */}
      <div className="w-full max-w-7xl flex flex-wrap justify-between items-center p-4 md:p-6 absolute top-0 left-0 right-0 mx-auto z-30 gap-3">
        <Link
          href="/"
          className="text-lg md:text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 cursor-pointer hover:scale-105 transition-transform shrink-0 whitespace-nowrap"
        >
          ← WeiXiang AI
        </Link>
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <Link
            href="/ad-studio"
            className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/25 to-pink-500/25 border border-amber-400/60 text-amber-200 hover:bg-amber-500/35 text-xs sm:text-sm font-black transition-all shadow-lg whitespace-nowrap shrink-0"
          >
            📢{' '}
            {isJa
              ? '万商広告スタジオ (/ad-studio) ➔'
              : isCN
              ? '已斗内好友・进入「我的广告小帮手」➔'
              : isChinese
              ? '已斗內好友・進入「我的廣告小幫手」➔'
              : isKo
              ? '광고 스튜디오 로그인 (/ad-studio) ➔'
              : isVi
              ? 'Đăng nhập Ad Studio (/ad-studio) ➔'
              : isId
              ? 'Login Ad Studio (/ad-studio) ➔'
              : 'Advertiser Login (/ad-studio) ➔'}
          </Link>
          <div className="shrink-0">
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* 頂部親民溫暖膠囊標籤 */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-cyan-500/20 border border-amber-400/50 text-amber-200 text-xs sm:text-sm font-black mb-4 shadow-md text-center">
        <span>🤝</span>
        <span>
          {isJa
            ? 'ちょっと応援、しっかり恩返し（AI-SKILLS開発へのご賛助に、私たちのAI宣伝スキルでお応えします！）'
            : isCN
            ? '斗内一下、回您一把！（赞助我们的 AI-SKILLS 开发，也回馈这套 AI 技能给您）'
            : isChinese
            ? '斗內一下、回您一把！（贊助我們的 AI-SKILLS 開發，也回饋這套 AI 技能給您）'
            : isKo
            ? '가볍게 후원하고 확실하게 보답받기! (AI-SKILLS 개발을 후원해 주시면 AI 홍보 스킬로 보답합니다)'
            : isVi
            ? 'Ủng hộ một chút, đáp lễ hết mình! (Tài trợ phát triển AI-SKILLS, nhận lại kỹ năng quảng bá AI)'
            : isId
            ? 'Dukung Sedikit, Kami Bantu Promosi! (Sponsori riset AI-SKILLS kami & gunakan untuk bisnis Anda)'
            : 'Tip Us a Little, We Boost You Back! (Sponsor our AI-SKILLS R&D, and let our AI skills work for you)'}
        </span>
      </div>

      {/* 主視覺大標題 */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-pink-300 to-cyan-300 mb-4 text-center max-w-4xl leading-tight">
        {isJa
          ? '💖 ちょっと応援、しっかり恩返し ×「万商セルフ広告」開通エリア'
          : isCN
          ? '💖 斗内一下、回您一把 ×「万商自助广告系统」轻松开通专区'
          : isChinese
          ? '💖 斗內一下、回您一把 ×「萬商自助廣告系統」輕鬆開通專區'
          : isKo
          ? '💖 가벼운 후원, 확실한 보답 × 「만상 셀프 광고 스튜디오」 개통 구역'
          : isVi
          ? '💖 Ủng Hộ Nhỏ, Đáp Lễ Lớn × Khu Vực Kích Hoạt 「Hệ Thống Quảng Cáo Tự Phục Vụ」'
          : isId
          ? '💖 Dukung & Dapatkan Promosi AI × Studio Iklan Mandiri Global'
          : '💖 Tip a Little, Get Boosted Back × Self-Serve Global Ad Studio'}
      </h1>

      <p className="text-gray-200 max-w-3xl text-center mb-10 text-sm sm:text-base leading-relaxed">
        {isJa
          ? 'あなたが私たちの「AI-SKILLS」開発を応援してくださるなら、私たちはその最新AIスキルであなたのビジネスを応援します！$15以上の応援で1ヶ月（30日間）、$120以上の応援（8ヶ月＋4ヶ月無料＝丸1年365日間）でVIP 3倍優先露出！専用IDとパスワードで、初心者でも簡単に広告文とリンクを設置できます（純粋な応援返礼のため、売上額の保証はございません）。'
          : isCN
          ? '您出点小力支持我们研发更强大的「AI-SKILLS」，我们就把这套超好用的 AI 宣传技能直接回馈给您！凡斗内满 $15 USD 就送您 1 个月（30 天）万商广告曝光；斗内 $120 USD（买 8 个月送 4 个月）直接帮您宣传整整 365 天＋VIP 3 倍优先曝光！不懂电脑也能 3 分钟轻松贴上您的文案与联络窗口（纯赞助心意回馈，不保证业绩额喔）。'
          : isChinese
          ? '您出點小力支持我們研發更強大的「AI-SKILLS」，我們就把這套超好用的 AI 宣傳技能直接回饋給您！凡斗內滿 $15 USD 就送您 1 個月（30 天）萬商廣告曝光；斗內 $120 USD（買 8 個月送 4 個月）直接幫您宣傳整整 365 天＋VIP 3 倍優先曝光！不懂電腦也能 3 分鐘輕鬆貼上您的文案與聯絡窗口（純贊助心意回饋，不保證業績額喔）。'
          : 'When you chip in to support our AI-SKILLS development, we gift those exact AI promotion skills right back to you! Sponsor $15+ for 1 Month (30 Days) or $120+ (Buy 8 Months, Get 4 Free = 365 Days Full-Year VIP 3x Boost). Anyone can set up their ad text and contact link in 3 minutes (a heartfelt thank-you perk; no revenue guarantee).'}
      </p>

      {/* 網小白一看秒懂的 3 步輕鬆上手卡片（完全零技術術語） */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-5 mb-12 relative z-10">
        {/* Card 1 */}
        <div className="bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-amber-400/40 rounded-2xl p-6 flex flex-col justify-between shadow-[0_10px_30px_rgba(251,191,36,0.08)] hover:border-amber-400/70 transition-all">
          <div>
            <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40">
              {isJa
                ? 'STEP 1 · 応援して専用パスを受取'
                : isCN
                ? '第 1 步 · 斗内力挺，秒拿专属通行证'
                : isChinese
                ? '第 1 步 · 斗內力挺，秒拿專屬通行證'
                : 'STEP 1 · Tip & Get Instant Pass'}
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white mt-3.5 mb-2">
              {isJa
                ? '☕ $15 お試し30日 ／ $120 丸1年365日'
                : isCN
                ? '☕ $15 轻松体验 30 天 ／ $120 全年力挺 365 天'
                : isChinese
                ? '☕ $15 輕鬆體驗 30 天 ／ $120 全年力挺 365 天'
                : '☕ $15 (30 Days) / $120 (365 Days Full Year)'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {isJa
                ? '応援完了と同時に「万商広告スタジオの専用IDとパスワード」がメールに届きます！さらに応援金額は100%あなたの会員ランク昇格実績に加算されます。'
                : isCN
                ? '完成斗内后，信箱立刻收到您的「专属帐号与通行密码」！支持我们的 AI-SKILLS 开发，这笔金额还会 100% 帮您累积个人升等业绩，一举两得！'
                : isChinese
                ? '完成斗內後，信箱立刻收到您的「專屬帳號與通行密碼」！支持我們的 AI-SKILLS 開發，這筆金額還會 100% 幫您累積個人升等業績，一舉兩得！'
                : 'Right after payment, your personal Ad Studio ID & password land in your inbox! Plus, 100% of your tip counts toward your personal VIP tier upgrade volume.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 text-xs text-amber-300 font-bold">
            {isJa
              ? '✔ $120プランは「8ヶ月買えば4ヶ月無料」1日あたり約$0.32！'
              : isCN
              ? '✔ $120 方案享「买 8 个月送 4 个月」，平均每天只要一杯水钱 ($0.32)！'
              : isChinese
              ? '✔ $120 方案享「買 8 個月送 4 個月」，平均每天只要一杯水錢 ($0.32)！'
              : '✔ $120 Plan = Buy 8 Get 4 Months Free—just $0.32/day!'}
          </div>
        </div>

        {/* Card 2 (原黃框位置：全面改為網小白超有感的貼心大白話) */}
        <div className="bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-pink-400/40 rounded-2xl p-6 flex flex-col justify-between shadow-[0_10px_30px_rgba(236,72,153,0.08)] hover:border-pink-400/70 transition-all">
          <div>
            <span className="text-xs font-black px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/40">
              {isJa
                ? 'STEP 2 · 3分でかんたん看板設置'
                : isCN
                ? '第 2 步 · 像发贴文一样，3 分钟放上好物'
                : isChinese
                ? '第 2 步 · 像發貼文一樣，3 分鐘放上好物'
                : 'STEP 2 · Post Like Social Media in 3 Mins'}
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white mt-3.5 mb-2">
              {isJa
                ? '🪄 宣伝文とLINE・ショップURLを貼るだけ'
                : isCN
                ? '🪄 贴上您的介绍词 ＆ LINE / 卖场连结就搞定'
                : isChinese
                ? '🪄 貼上您的介紹詞 ＆ LINE / 賣場連結就搞定'
                : '🪄 Just Paste Your Intro & LINE / Store Link'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {isJa
                ? '難しい操作はゼロ！いつでも管理画面から店名・キャッチコピー・写真・連絡先リンクを自由に変更可能。さらに「✨AI ワンクリック4ヶ国語翻訳」付きで海外向けも一瞬！'
                : isCN
                ? '完全不用懂排版或写程式！登入后只要打几句您想宣传的话、放上您的 LINE 或网址，按一下「✨ AI 帮我翻译成中/英/日文」，连外国客人都能看懂您的招牌！'
                : isChinese
                ? '完全不用懂排版或寫程式！登入後只要打幾句您想宣傳的話、放上您的 LINE 或網址，按一下「✨ AI 幫我翻譯成中/英/日文」，連外國客人都能看懂您的招牌！'
                : 'Zero technical setup! Type a few lines about what you offer, drop your LINE or website link, and tap "✨ 1-Click AI Translate" to speak Chinese, English, and Japanese!'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 text-xs text-pink-300 font-bold">
            {isJa
              ? '✔ 保存ボタンを押すだけで、1秒後に世界中のサイトへ自動反映！'
              : isCN
              ? '✔ 按下储存 1 秒立即生效，想换活动或改台词随时都能自己改！'
              : isChinese
              ? '✔ 按下儲存 1 秒立即生效，想換活動或改台詞隨時都能自己改！'
              : '✔ Goes live in 1 second after saving—change your promo anytime you like!'}
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-cyan-400/40 rounded-2xl p-6 flex flex-col justify-between shadow-[0_10px_30px_rgba(34,211,238,0.08)] hover:border-cyan-400/70 transition-all">
          <div>
            <span className="text-xs font-black px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
              {isJa
                ? 'STEP 3 · AIが24時間あなたの代わりに宣伝'
                : isCN
                ? '第 3 步 · 回馈 AI 技能，24H 帮您到处放送'
                : isChinese
                ? '第 3 步 · 回饋 AI 技能，24H 幫您到處放送'
                : 'STEP 3 · Our AI Broadcasts for You 24/7'}
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white mt-3.5 mb-2">
              {isJa
                ? '🌍 100サイトのメディア群で毎日自動紹介'
                : isCN
                ? '🌍 百大网站天天帮您挂招牌、新文章主动带上您'
                : isChinese
                ? '🌍 百大網站天天幫您掛招牌、新文章主動帶上您'
                : '🌍 Featured Across 100+ Sites & Daily New Articles'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {isJa
                ? 'あなたが寝ている間も、私たちのAI広報アシスタントが世界中の多言語サイト（100サイトへ拡大中）で毎日新しい記事を書きながら、あなたの広告カードを自動で読者に届けます！'
                : isCN
                ? '当您在忙工作或睡觉时，我们的「AI 宣传小帮手」每天在全球多语系网站群（正迈向 100 个主题网站）发表新文章时，都会自动把您的精美名片一起放进去给读者看！'
                : isChinese
                ? '當您在忙工作或睡覺時，我們的「AI 宣傳小幫手」每天在全球多語系網站群（正邁向 100 個主題網站）發表新文章時，都會自動把您的精美名片一起放進去給讀者看！'
                : 'While you sleep or relax, our AI assistants publish fresh articles daily across our growing network of 100+ global sites—automatically showcasing your ad card to readers!'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 text-xs text-cyan-300 font-bold">
            {isJa
              ? '✔ いつでも画面から「見られた回数・クリック数」を確認可能（売上保証なし）'
              : isCN
              ? '✔ 后台随时看得到「有几个人看过、几个人点过」（纯赞助回馈，不保证业绩额）'
              : isChinese
              ? '✔ 後台隨時看得到「有幾個人看過、幾個人點過」（純贊助回饋，不保證業績額）'
              : '✔ Check your live views & clicks anytime in your dashboard (no sales guarantee)'}
          </div>
        </div>
      </div>

      {/* 選購與結帳區（移至上方醒目位置，方便客戶立即操作） */}
      <div className="w-full max-w-2xl bg-gradient-to-b from-gray-900 to-black border-2 border-amber-400/50 rounded-3xl p-6 sm:p-8 mb-14 relative overflow-hidden shadow-[0_0_50px_rgba(251,191,36,0.16)]">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <h3 className="text-2xl font-black text-center mb-2">{selectSponsorTitle}</h3>
        <p className="text-gray-300 text-center mb-6 text-xs sm:text-sm">{selectSponsorDesc}</p>

        {isLoading ? (
          <div className="text-center py-10 text-gray-500">Loading...</div>
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
                        <span className={`text-2xl font-black ${is120 ? 'text-amber-400' : is15 ? 'text-cyan-400' : 'text-pink-400'}`}>
                          ${pkg.price} <span className="text-xs font-normal text-gray-400">USD</span>
                        </span>
                        {is120 && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                            {isChinese ? (isCN ? '买8送4·365天' : '買8送4·365天') : '365 Days'}
                          </span>
                        )}
                        {is15 && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950">
                            {isChinese ? (isCN ? '回礼30天广告' : '回禮30天廣告') : '30 Days'}
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-white mt-1">
                        {isChinese ? pkg.name_zh : pkg.name_en}
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/10 text-[11px] text-gray-300">
                      {is120
                        ? isCN
                          ? '👑 回馈 365 天 AI 广告小帮手 (VIP 3倍曝光)'
                          : isChinese
                          ? '👑 回饋 365 天 AI 廣告小幫手 (VIP 3倍曝光)'
                          : '👑 365-Day AI Ad Assistant (VIP 3x Boost)'
                        : is15
                        ? isCN
                          ? '⚡ 回馈 30 天 AI 广告小帮手 (轻松曝光)'
                          : isChinese
                          ? '⚡ 回饋 30 天 AI 廣告小幫手 (輕鬆曝光)'
                          : '⚡ 30-Day AI Ad Assistant Access'
                        : isCN
                        ? '☕ 纯支持我们研发 (+计入升等业绩)'
                        : isChinese
                        ? '☕ 純支持我們研發 (+計入升等業績)'
                        : '☕ Pure Support (+Tier Volume)'}
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
                    {isJa ? (
                      <>
                        <strong>【応援返礼・ご利用規約（売上保証なし）】</strong>：$15以上で30日間、$120以上で365日間「万商広告スタジオ」をご利用いただけます。本特典はAI-SKILLS開発応援への感謝ギフトであり、<strong>期間中のサイト群での表示を提供しますが、特定のクリック数や売上成約額を保証するものではありません（違法・詐欺・アダルト等の掲載は即時停止・返金不可）</strong>。
                      </>
                    ) : isCN ? (
                      <>
                        <strong>【斗内一下、回您一把 · 贴心约定（不保证业绩额）】</strong>：我了解斗内满 $15 可使用 1 个月（30天）、满 $120（买 8 个月送 4 个月）可使用 365 天「万商广告小帮手」自由张贴介绍文案与联络连结。这份 AI 技能是感谢我赞助 AI-SKILLS 开发的回礼，<strong>系统会在天数内帮我全网轮播曝光，但不保证一定会有多少人点击或保证成交业绩额，且不能放违法/诈骗/色情内容喔（违规会下架且不退费）</strong>。
                      </>
                    ) : isChinese ? (
                      <>
                        <strong>【斗內一下、回您一把 · 貼心約定（不保證業績額）】</strong>：我了解斗內滿 $15 可使用 1 個月（30天）、滿 $120（買 8 個月送 4 個月）可使用 365 天「萬商廣告小幫手」自由張貼介紹文案與聯絡連結。這份 AI 技能是感謝我贊助 AI-SKILLS 開發的回禮，<strong>系統會在天數內幫我全網輪播曝光，但不保證一定會有多少人點擊或保證成交業績額，且不能放違法/詐騙/色情內容喔（違規會下架且不退費）</strong>。
                      </>
                    ) : (
                      <>
                        <strong>[Sponsor Perk Agreement (No Revenue Guarantee)]</strong>: I understand that sponsoring $15+ grants 30 days and $120+ grants 365 days of Self-Serve Ad Studio access as a thank-you gift for supporting AI-SKILLS R&D. <strong>While our network rotates your ad during the active period, we do not guarantee specific click counts or sales revenue, and illegal/scam/adult content will be removed without refund.</strong>
                      </>
                    )}
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
                  productName={isChinese ? selectedPackage.name_zh : selectedPackage.name_en}
                />

                <PayPalButton
                  packageId={selectedPackage.id}
                  priceInUSDT={selectedPackage.price}
                  productType="SPONSOR"
                  productName={isChinese ? selectedPackage.name_zh : selectedPackage.name_en}
                />

                <div className="relative flex items-center py-1">
                  <div className="flex-grow border-t border-white/10"></div>
                  <span className="flex-shrink-0 mx-4 text-white/40 text-xs">
                    {isChinese ? (isCN ? '或使用数字钱包 USDT 斗内支持' : '或使用數位錢包 USDT 斗內支持') : 'Or sponsor with Web3 USDT Wallet'}
                  </span>
                  <div className="flex-grow border-t border-white/10"></div>
                </div>

                <BuyNFTButton packageId={selectedPackage.id} priceInUSDT={selectedPackage.price} />
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-gray-800 text-amber-300 text-center text-xs font-bold">
                {isChinese
                  ? '☝️ 請先勾選上方「斗內一下、回您一把 · 貼心約定（不保證業績額）」即可按下付款按鈕喔！'
                  : '☝️ Please check the Sponsor Perk Agreement box above to proceed with payment.'}
              </div>
            )}

            <div className="text-center pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
              <span>
                {isJa
                  ? '* 決済完了後、専用IDとパスワードが即座にメールへ届きます'
                  : isCN
                  ? '* 斗内成功后，系统会立刻把专属帐号密码寄到您的信箱'
                  : isChinese
                  ? '* 斗內成功後，系統會立刻把專屬帳號密碼寄到您的信箱'
                  : '* Login credentials will be emailed to you immediately after payment'}
              </span>
              <Link href="/ad-studio" className="text-amber-300 hover:underline font-bold">
                {isJa
                  ? '🔑 すでにIDをお持ちの方はこちら (/ad-studio) ➔'
                  : isCN
                  ? '🔑 已经拿过帐密？点这里直接进「我的广告小帮手 (/ad-studio)」➔'
                  : isChinese
                  ? '🔑 已經拿過帳密？點這裡直接進「我的廣告小幫手 (/ad-studio)」➔'
                  : '🔑 Already have credentials? Enter Ad Studio (/ad-studio) ➔'}
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* 內容/影音播放區 */}
      <div className="w-full max-w-5xl bg-gradient-to-b from-gray-900/80 to-black/90 border border-purple-500/30 rounded-3xl p-6 md:p-10 mb-12 shadow-[0_0_50px_rgba(168,85,247,0.15)] flex flex-col items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <h2 className="text-2xl md:text-4xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-300 to-cyan-400 text-center tracking-wide z-10">
          {isJa
            ? '🤝 あなたの応援がAI進化の力に、私たちのAIがあなたの宣伝隊長に！'
            : isCN
            ? '🤝 您挺我们开发 AI-SKILLS，我们用 AI 技能帮您打响名号！'
            : isChinese
            ? '🤝 您挺我們開發 AI-SKILLS，我們用 AI 技能幫您打響名號！'
            : '🤝 YOU BACK OUR AI-SKILLS R&D, OUR AI SKILLS BOOST YOUR BRAND!'}
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
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white flex items-center gap-3 leading-snug">
                <span className="text-3xl">🎁</span> {pitchTitle}
              </h3>
              <p className="text-gray-300 mb-6 text-sm sm:text-base leading-relaxed">{pitchDesc}</p>

              <ul className="space-y-5">
                <li className="flex items-start gap-3.5">
                  <div className="mt-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full p-1.5 shadow-[0_0_15px_rgba(245,158,11,0.5)] shrink-0">
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
                <p className="text-xs sm:text-sm text-amber-300 font-bold flex items-center gap-2">✨ {pitchFooter}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
