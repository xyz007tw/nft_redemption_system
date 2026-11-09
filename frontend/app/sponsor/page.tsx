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
    ? '⚡ 入門プラン（$15 スパーク30日 ／ $120 百サイト常駐365日）：専用IDとパスワードがすぐ届き、宣伝文とリンクを貼るだけで最大1〜2枠の広告カードを自動配信！'
    : isCN
    ? '⚡ 入门超值选（$15 星火体验 30天 ／ $120 百站常驻 365天）：专属帐密立刻寄到信箱，像发动态一样贴上介绍跟 LINE/网址，即可上架 1～2 件招牌天天自动曝光！'
    : isChinese
    ? '⚡ 入門超值選（$15 星火體驗 30天 ／ $120 百站常駐 365天）：專屬帳密立刻寄到信箱，像發動態一樣貼上介紹跟 LINE/網址，即可上架 1～2 件招牌天天自動曝光！'
    : '⚡ Starter Tiers ($15 Spark 30-Day / $120 Resident 365-Day): Receive your login instantly—paste your intro and link to rotate 1–2 active ad cards daily!';

  const point2 = isJa
    ? '👑 VIPビジネス独占（$888 ゴールド5枠・8x ／ $2,700 ロイヤル12枠・20x ／ $6,000 至高30枠・50x）：複数商品や全ラインナップを圧倒的な高頻度で世界中のサイトに同時展開！'
    : isCN
    ? '👑 旗舰多件霸屏（$888 黄金聚客 5件·8x ／ $2,700 皇家霸屏 12件·20x ／ $6,000 万商至尊 30件·50x）：多款商品同时轮番上阵，享最高 50 倍速全网优先曝光！'
    : isChinese
    ? '👑 旗艦多件霸屏（$888 黃金聚客 5件·8x ／ $2,700 皇家霸屏 12件·20x ／ $6,000 萬商至尊 30件·50x）：多款商品同時輪番上陣，享最高 50 倍速全網優先曝光！'
    : '👑 VIP Multi-Slot Tiers ($888 Gold 5 Slots / $2,700 Royal 12 Slots / $6,000 Supreme 30 Slots): Promote your entire product line with up to 50x priority rotation!';

  const point3 = isJa
    ? '💝 応援金額は100%あなたの会員ランク実績に加算：すべてのドネーション金額は個人の昇格累計実績に100%カウントされます（期間終了後は自動停止、売上額の保証はございません）。'
    : isCN
    ? '💝 斗内金额 100% 帮您累积会员升等资格：每一笔支持都会 100% 算进您的「个人升等累积业绩」里！使用时间结束后各站自动停止轮播，随时可续加时间（纯心意回馈，不保证业绩额喔）。'
    : isChinese
    ? '💝 斗內金額 100% 幫您累積會員升等資格：每一筆支持都會 100% 算進您的「個人升等累積業績」裡！使用時間結束後各站自動停止輪播，隨時可續加時間（純心意回饋，不保證業績額喔）。'
    : '💝 100% Counted Toward Your VIP Tier Upgrade: Every dollar counts 100% toward your personal tier upgrade volume. Rotation stops automatically upon expiration and can be extended anytime.';

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
    ? '🎁 斗内一下、回您一把！选择您的支持与 5 大等级 AI 广告回馈方案'
    : isChinese
    ? '🎁 斗內一下、回您一把！選擇您的支持與 5 大等級 AI 廣告回饋方案'
    : isKo
    ? '🎁 후원 플랜 선택 & 5단계 AI 홍보 어시스턴트 받기'
    : isVi
    ? '🎁 Chọn Gói Ủng Hộ & Nhận Trợ Lý Quảng Cáo AI 5 Cấp Độ'
    : isId
    ? '🎁 Pilih Paket Dukungan & Dapatkan Asisten Iklan AI 5 Tingkat'
    : '🎁 Tip & Get Boosted: Choose Your Support & 5-Tier AI Ad Perk';

  const selectSponsorDesc = isJa
    ? '純粋な応援（$3）から、入門（$15 / $120）、ビジネス多枠展開（$888 / $2,700 / $6,000）まで自由に選べます！再ドネーションで有効期間をいつでも延長可能！'
    : isCN
    ? '从纯支持喝珍奶 ($3)、入门体验 ($15 星火 / $120 百站常驻)，到多件广告齐发的商务旗舰 ($888 黄金 / $2,700 皇家 / $6,000 至尊) 自由选！重复斗内可直接累加使用天数！'
    : isChinese
    ? '從純支持喝珍奶 ($3)、入門體驗 ($15 星火 / $120 百站常駐)，到多件廣告齊發的商務旗艦 ($888 黃金 / $2,700 皇家 / $6,000 至尊) 自由選！重複斗內可直接累加使用天數！'
    : 'Choose from Pure Boba Support ($3), Starter Tiers ($15 Spark / $120 Resident), or Multi-Slot Business Tiers ($888 Gold / $2,700 Royal / $6,000 Supreme)!';

  // 內建 6 大完整方案 ($3 純支持 + 5 大萬商廣告等級：$15 / $120 / $888 / $2,700 / $6,000)
  const fallbackSponsorPackages = [
    {
      id: 901,
      price: 3,
      name_zh: isCN ? '☕ $3 请喝杯珍奶・纯支持研发' : '☕ $3 請喝杯珍奶・純支持研發',
      name_en: '☕ $3 Buy Us a Boba · Pure Support',
      product_type: 'SPONSOR',
      tierBadge: isCN ? '温暖纯支持' : isChinese ? '溫暖純支持' : 'Pure Support',
      freqLabel: isCN ? '不附带广告席位' : isChinese ? '不附帶廣告席位' : 'No Ad Slot',
      slotsLabel: isCN ? '累积 $3 升等业绩' : isChinese ? '累積 $3 升等業績' : '+$3 Tier Volume',
      daysLabel: isCN ? '纯赞助支持 AI 研发' : isChinese ? '純贊助支持 AI 研發' : 'Pure R&D Support'
    },
    {
      id: 915,
      price: 15,
      name_zh: isCN ? '⚡ $15 星火体验型・AI 帮打广告 30天' : '⚡ $15 星火體驗型・AI 幫打廣告 30天',
      name_en: '⚡ $15 Spark Starter · 30 Days (1 Slot)',
      product_type: 'SPONSOR',
      tierBadge: isCN ? '入门体验 · 30天' : isChinese ? '入門體驗 · 30天' : 'Starter · 30d',
      freqLabel: isCN ? '1x 标准频率 (每站日播 60次)' : isChinese ? '1x 標準頻率 (每站日播 60次)' : '1x Freq (60/site/day)',
      slotsLabel: isCN ? '可上架 1 件广告卡片' : isChinese ? '可上架 1 件廣告卡片' : '1 Active Ad Slot',
      daysLabel: isCN ? '开通 30 天曝光 (+$15 业绩)' : isChinese ? '開通 30 天曝光 (+$15 業績)' : '30 Days Access (+$15 Vol)'
    },
    {
      id: 920,
      price: 120,
      name_zh: isCN ? '🔥 $120 百站常驻型・买8送4共 365天' : '🔥 $120 百站常駐型・買8送4共 365天',
      name_en: '🔥 $120 100-Site Resident · 365 Days (2 Slots)',
      product_type: 'SPONSOR',
      tierBadge: isCN ? '🔥 买8送4 · 365天' : isChinese ? '🔥 買8送4 · 365天' : '🔥 Best Value · 365d',
      freqLabel: isCN ? '3x 优先频率 (每站日播 180次)' : isChinese ? '3x 優先頻率 (每站日播 180次)' : '3x Freq (180/site/day)',
      slotsLabel: isCN ? '可同时上架 2 件广告轮播' : isChinese ? '可同時上架 2 件廣告輪播' : '2 Active Ad Slots',
      daysLabel: isCN ? '整年 365 天曝光 (+$120 业绩)' : isChinese ? '整年 365 天曝光 (+$120 業績)' : '365 Days Access (+$120 Vol)'
    },
    {
      id: 925,
      price: 888,
      name_zh: isCN ? '🥇 $888 黄金聚客型・365天 (5件矩阵)' : '🥇 $888 黃金聚客型・365天 (5件矩陣)',
      name_en: '🥇 $888 Gold Magnet · 365 Days (5 Slots)',
      product_type: 'SPONSOR',
      tierBadge: isCN ? '🥇 黄金8倍 · 5件广告' : isChinese ? '🥇 黃金8倍 · 5件廣告' : '🥇 Gold 8x · 5 Slots',
      freqLabel: isCN ? '8x 高频强播 (每站日播 500次)' : isChinese ? '8x 高頻強播 (每站日播 500次)' : '8x Freq (500/site/day)',
      slotsLabel: isCN ? '可同时上架 5 件不同广告' : isChinese ? '可同時上架 5 件不同廣告' : '5 Active Ad Slots',
      daysLabel: isCN ? '365 天黄金聚客 (+$888 升3%级差)' : isChinese ? '365 天黃金聚客 (+$888 升3%級差)' : '365d + Instant 3% Tier!'
    },
    {
      id: 927,
      price: 2700,
      name_zh: isCN ? '💎 $2,700 皇家霸屏型・365天 (12件霸屏)' : '💎 $2,700 皇家霸屏型・365天 (12件霸屏)',
      product_type: 'SPONSOR',
      name_en: '💎 $2,700 Royal Takeover · 365 Days (12 Slots)',
      tierBadge: isCN ? '💎 皇家20倍 · 12件广告' : isChinese ? '💎 皇家20倍 · 12件廣告' : '💎 Royal 20x · 12 Slots',
      freqLabel: isCN ? '20x 极速霸屏 (每站日播 1,500次)' : isChinese ? '20x 極速霸屏 (每站日播 1,500次)' : '20x Freq (1,500/site/day)',
      slotsLabel: isCN ? '可同时上架 12 件全系列广告' : isChinese ? '可同時上架 12 件全系列廣告' : '12 Active Ad Slots',
      daysLabel: isCN ? '365 天皇家霸屏 (+$2,700 业绩)' : isChinese ? '365 天皇家霸屏 (+$2,700 業績)' : '365d Royal Takeover'
    },
    {
      id: 960,
      price: 6000,
      name_zh: isCN ? '👑 $6,000 万商至尊型・730天双年 (30件旗舰)' : '👑 $6,000 萬商至尊型・730天雙年 (30件旗艦)',
      name_en: '👑 $6,000 Global Supreme · 730 Days (30 Slots)',
      product_type: 'SPONSOR',
      tierBadge: isCN ? '👑 至尊50倍 · 30件 · 2年' : isChinese ? '👑 至尊50倍 · 30件 · 2年' : '👑 Supreme 50x · 30 Slots',
      freqLabel: isCN ? '50x 全站顶置 (全时段不限次霸屏)' : isChinese ? '50x 全站頂置 (全時段不限次霸屏)' : '50x Pinned (Unlimited/day)',
      slotsLabel: isCN ? '可同时上架 30 件跨国品牌矩阵' : isChinese ? '可同時上架 30 件跨國品牌矩陣' : '30 Active Ad Slots',
      daysLabel: isCN ? '整整 730 天双年顶置 (+直达6%级差)' : isChinese ? '整整 730 天雙年頂置 (+直達6%級差)' : '730 Days + Instant 6% Tier!'
    }
  ];

  const [packages, setPackages] = useState<any[]>(fallbackSponsorPackages);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<any>(fallbackSponsorPackages[2]); // 預設選中 $120 百站常駐型
  const [agreedNoGuarantee, setAgreedNoGuarantee] = useState(true);

  useEffect(() => {
    fetch('/api/admin/packages')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.packages)) {
          const activeSponsorPackages = data.packages.filter((pkg: any) => pkg.is_active && pkg.product_type === 'SPONSOR');
          const merged = [...fallbackSponsorPackages];
          for (const dbPkg of activeSponsorPackages) {
            const idx = merged.findIndex(p => Number(p.price) === Number(dbPkg.price));
            if (idx === -1) {
              merged.push(dbPkg);
            }
          }
          merged.sort((a: any, b: any) => Number(a.price) - Number(b.price));
          setPackages(merged);
          const default120 = merged.find((p: any) => Number(p.price) === 120) || merged[1] || merged[0];
          if (default120) setSelectedPackage(default120);
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
          ? 'あなたが私たちの「AI-SKILLS」開発を応援してくださるなら、私たちはその最新AIスキルであなたのビジネスを応援します！入門プラン（$15 / $120）から、複数広告枠＆超高頻度配信のVIPプラン（$888 / $2,700 / $6,000）まで完備。有効期間が終了すると各サイトでの配信は自動停止し、会員マイページからいつでも期間延長が可能です（純粋な応援返礼のため、売上額の保証はございません）。'
          : isCN
          ? '您出点小力支持我们研发更强大的「AI-SKILLS」，我们就把这套超好用的 AI 宣传技能直接回馈给您！依「协播频率、每站轮播次数、广告件数」分为 5 大等级：从入门的 $15 星火体验（30天/1件）、$120 百站常驻（买8送4共365天/2件），到旗舰多件霸屏的 $888 黄金聚客（5件）、$2,700 皇家霸屏（12件）与 $6,000 万商至尊（730天/30件）！可用时间结束后各站自动停播，随时可于会员后台续加时间（纯赞助回馈，不保证业绩额喔）。'
          : isChinese
          ? '您出點小力支持我們研發更強大的「AI-SKILLS」，我們就把這套超好用的 AI 宣傳技能直接回饋給您！依「協播頻率、每站輪播次數、廣告件數」分為 5 大等級：從入門的 $15 星火體驗（30天/1件）、$120 百站常駐（買8送4共365天/2件），到旗艦多件霸屏的 $888 黃金聚客（5件）、$2,700 皇家霸屏（12件）與 $6,000 萬商至尊（730天/30件）！可用時間結束後各站自動停播，隨時可於會員後台續加時間（純贊助回饋，不保證業績額喔）。'
          : 'When you chip in to support our AI-SKILLS R&D, we gift those exact AI promotion skills right back to you! Choose from 5 tiers differentiated by broadcast frequency, daily rotations, and ad slots: Starter ($15 Spark / $120 Resident) up to VIP Multi-Slot ($888 Gold / $2,700 Royal / $6,000 Supreme). Rotation stops automatically when time expires and can be extended anytime!'}
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
                ? '☕ 5つの応援ランクから自由に選択'
                : isCN
                ? '☕ 5 大等级自由选 · 天数随时可累加'
                : isChinese
                ? '☕ 5 大等級自由選 · 天數隨時可累加'
                : '☕ 5 Flexible Tiers · Extend Time Anytime'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {isJa
                ? '応援完了と同時に「万商広告スタジオの専用IDとパスワード」がメールに届きます！さらに応援金額は100%あなたの会員ランク昇格実績に加算されます。'
                : isCN
                ? '完成斗内后，信箱立刻收到您的「专属帐号与通行密码」！重复斗内可自动延长会员后台与广告使用时间，且金额 100% 帮您累积个人 25% 分润升等业绩！'
                : isChinese
                ? '完成斗內後，信箱立刻收到您的「專屬帳號與通行密碼」！重複斗內可自動延長會員後台與廣告使用時間，且金額 100% 幫您累積個人 25% 分潤升等業績！'
                : 'Right after payment, your personal Ad Studio ID & password land in your inbox! Repeat sponsorships automatically extend your active days and count 100% toward your VIP tier upgrade.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 text-xs text-amber-300 font-bold">
            {isJa
              ? '✔ $120プランは「8ヶ月買えば4ヶ月無料」1日あたり約$0.32！'
              : isCN
              ? '✔ $120 百站常驻享「买 8 个月送 4 个月」，平均每天只要 $0.32！'
              : isChinese
              ? '✔ $120 百站常駐享「買 8 個月送 4 個月」，平均每天只要 $0.32！'
              : '✔ $120 Resident Plan = Buy 8 Get 4 Months Free—just $0.32/day!'}
          </div>
        </div>

        {/* Card 2 */}
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
                ? '難しい操作はゼロ！プランに応じて最大1〜30枠の広告を登録可能。さらに「✨AI ワンクリック4ヶ国語翻訳」付きで海外向けも一瞬！'
                : isCN
                ? '完全不用懂排版或写程式！依方案最高可同时上架 1～30 件不同商品广告，按一下「✨ AI 帮我翻译成中/英/日文」，连外国客人都能看懂您的招牌！'
                : isChinese
                ? '完全不用懂排版或寫程式！依方案最高可同時上架 1～30 件不同商品廣告，按一下「✨ AI 幫我翻譯成中/英/日文」，連外國客人都能看懂您的招牌！'
                : 'Zero technical setup! Manage 1 to 30 ad campaigns depending on your tier, and tap "✨ 1-Click AI Translate" to speak Chinese, English, and Japanese!'}
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
                ? '🌍 百大网站天天帮您挂招牌、到期自动停播'
                : isChinese
                ? '🌍 百大網站天天幫您掛招牌、到期自動停播'
                : '🌍 Featured Across 100+ Sites & Auto-Cutoff on Expiry'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {isJa
                ? 'あなたが寝ている間も、私たちのAI広報アシスタントが世界中の多言語サイト群であなたの広告カードを自動で読者に届けます！有効期間終了後は自動で配信停止されます。'
                : isCN
                ? '当您在忙工作或睡觉时，我们的「AI 宣传小帮手」每天在全球多语系网站群发表新文章时，都会依您的等级频率（1x～50x）自动把您的名片放进去！可用时间结束后自动停止轮播。'
                : isChinese
                ? '當您在忙工作或睡覺時，我們的「AI 宣傳小幫手」每天在全球多語系網站群發表新文章時，都會依您的等級頻率（1x～50x）自動把您的名片放進去！可用時間結束後自動停止輪播。'
                : 'While you sleep, our AI assistants showcase your ad cards across our growing network of 100+ global sites according to your tier frequency (1x–50x), automatically stopping once expired!'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 text-xs text-cyan-300 font-bold">
            {isJa
              ? '✔ いつでも画面から「見られた回数・クリック数・残り日数」を確認可能'
              : isCN
              ? '✔ 后台随时看得到「剩余天数、曝光与点击次数」（不保证业绩额）'
              : isChinese
              ? '✔ 後台隨時看得到「剩餘天數、曝光與點擊次數」（不保證業績額）'
              : '✔ Check your remaining days, views & clicks anytime in your dashboard'}
          </div>
        </div>
      </div>

      {/* 選購與結帳區（支援 $3 純支持 + 5 大萬商廣告等級：$15 / $120 / $888 / $2,700 / $6,000） */}
      <div className="w-full max-w-5xl bg-gradient-to-b from-gray-900 to-black border-2 border-amber-400/50 rounded-3xl p-6 sm:p-8 mb-14 relative overflow-hidden shadow-[0_0_50px_rgba(251,191,36,0.16)]">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <h3 className="text-2xl sm:text-3xl font-black text-center mb-2">{selectSponsorTitle}</h3>
        <p className="text-gray-300 text-center mb-6 text-xs sm:text-sm max-w-3xl mx-auto">{selectSponsorDesc}</p>

        {isLoading ? (
          <div className="text-center py-10 text-gray-500">Loading...</div>
        ) : (
          <div className="flex flex-col gap-6 relative z-10">
            {/* 6 張方案卡片網格 (1個純支持 + 5大廣告等級) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {packages.map(pkg => {
                const p = Number(pkg.price);
                const isSelected = selectedPackage?.id === pkg.id && Number(selectedPackage?.price) === p;
                const isVipTier = p >= 888;
                const is120 = p >= 99 && p < 888;
                const is15 = p >= 15 && p < 99;

                return (
                  <button
                    key={`${pkg.id}-${pkg.price}`}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? isVipTier
                          ? 'border-pink-400 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-amber-500/15 shadow-[0_0_25px_rgba(236,72,153,0.35)] scale-[1.02]'
                          : is120
                          ? 'border-amber-400 bg-amber-500/15 shadow-[0_0_25px_rgba(251,191,36,0.3)] scale-[1.02]'
                          : 'border-cyan-400 bg-cyan-500/15 shadow-[0_0_20px_rgba(34,211,238,0.25)] scale-[1.02]'
                        : 'border-white/10 bg-black/50 hover:border-white/30'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span
                          className={`text-2xl font-black ${
                            isVipTier ? 'text-pink-300' : is120 ? 'text-amber-400' : is15 ? 'text-cyan-400' : 'text-gray-300'
                          }`}
                        >
                          ${pkg.price.toLocaleString()} <span className="text-xs font-normal text-gray-400">USD</span>
                        </span>
                        {pkg.tierBadge && (
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              isVipTier
                                ? 'bg-gradient-to-r from-pink-500 to-amber-500 text-white'
                                : is120
                                ? 'bg-amber-500 text-slate-950'
                                : is15
                                ? 'bg-cyan-500 text-slate-950'
                                : 'bg-white/15 text-gray-200'
                            }`}
                          >
                            {pkg.tierBadge}
                          </span>
                        )}
                      </div>

                      <div className="text-sm font-black text-white mt-1">
                        {isChinese ? pkg.name_zh : pkg.name_en}
                      </div>

                      {pkg.freqLabel && (
                        <div className="mt-2.5 space-y-1 text-[11px] text-gray-300 bg-white/5 rounded-xl p-2.5 border border-white/5">
                          <div className="flex items-center gap-1.5 text-amber-200 font-bold">
                            <span>⚡</span>
                            <span>{pkg.freqLabel}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-cyan-200 font-bold">
                            <span>📢</span>
                            <span>{pkg.slotsLabel}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-emerald-300">
                            <span>⏳</span>
                            <span>{pkg.daysLabel}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 5 大等級優勢一目了然對照表 */}
            <div className="rounded-2xl bg-slate-950/90 border border-white/10 p-4 sm:p-5 overflow-x-auto">
              <div className="text-xs sm:text-sm font-black text-amber-300 mb-3 flex items-center justify-between">
                <span>📊 萬商自助廣告 5 大等級「協播頻率 × 輪播次數 × 廣告件數」規格總覽</span>
                <span className="text-[11px] text-gray-400 font-normal">* 可用時間結束後自動停止輪播</span>
              </div>
              <table className="w-full text-left border-collapse text-xs min-w-[600px]">
                <thead>
                  <tr className="border-b border-white/15 text-gray-400">
                    <th className="py-2 px-2">方案等級</th>
                    <th className="py-2 px-2">斗內金額</th>
                    <th className="py-2 px-2">可用時間</th>
                    <th className="py-2 px-2">協播頻率權重</th>
                    <th className="py-2 px-2">每站每日輪播上限</th>
                    <th className="py-2 px-2">可上架廣告件數</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-gray-200">
                  <tr>
                    <td className="py-2 px-2 font-bold text-cyan-300">⚡ 星火體驗型 (入門)</td>
                    <td className="py-2 px-2 font-bold">$15 USD</td>
                    <td className="py-2 px-2">30 天 (1個月)</td>
                    <td className="py-2 px-2">1x 標準頻率</td>
                    <td className="py-2 px-2">約 60 次/站/日</td>
                    <td className="py-2 px-2 font-bold text-white">1 件廣告</td>
                  </tr>
                  <tr className="bg-amber-500/5">
                    <td className="py-2 px-2 font-bold text-amber-300">🔥 百站常駐型 (進階人氣)</td>
                    <td className="py-2 px-2 font-bold text-amber-300">$120 USD</td>
                    <td className="py-2 px-2 font-bold text-amber-200">365 天 (買8送4)</td>
                    <td className="py-2 px-2 font-bold text-amber-300">3x 優先頻率</td>
                    <td className="py-2 px-2">約 180 次/站/日</td>
                    <td className="py-2 px-2 font-bold text-amber-300">2 件廣告 (A/B輪播)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2 font-bold text-yellow-300">🥇 黃金聚客型 (商務多品)</td>
                    <td className="py-2 px-2 font-bold">$888 USD</td>
                    <td className="py-2 px-2">365 天 (整年)</td>
                    <td className="py-2 px-2 font-bold text-yellow-300">8x 高頻強播</td>
                    <td className="py-2 px-2">約 500 次/站/日</td>
                    <td className="py-2 px-2 font-bold text-yellow-300">5 件廣告矩陣</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2 font-bold text-pink-300">💎 皇家霸屏型 (品牌旗艦)</td>
                    <td className="py-2 px-2 font-bold">$2,700 USD</td>
                    <td className="py-2 px-2">365 天 (整年)</td>
                    <td className="py-2 px-2 font-bold text-pink-300">20x 極速霸屏</td>
                    <td className="py-2 px-2">約 1,500 次/站/日</td>
                    <td className="py-2 px-2 font-bold text-pink-300">12 件廣告矩陣</td>
                  </tr>
                  <tr className="bg-pink-500/10">
                    <td className="py-2 px-2 font-bold text-rose-300">👑 萬商至尊型 (全球帝王)</td>
                    <td className="py-2 px-2 font-bold text-rose-300">$6,000 USD</td>
                    <td className="py-2 px-2 font-bold text-rose-200">730 天 (整整2年)</td>
                    <td className="py-2 px-2 font-bold text-rose-300">50x 全站頂置</td>
                    <td className="py-2 px-2 font-bold text-rose-200">全時段不限次頂置</td>
                    <td className="py-2 px-2 font-bold text-rose-300">30 件跨國廣告矩陣</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 事前公開免責聲明確認框（不保證業績額） */}
            {Number(selectedPackage?.price) >= 15 && (
              <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 leading-relaxed max-w-3xl mx-auto">
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
                        <strong>【応援返礼・ご利用規約（売上保証なし・期限終了時自動停止）】</strong>：各プランの有効日数および広告枠数（1〜30枠）に応じて「万商広告スタジオ」をご利用いただけます。有効期間が終了すると各WPサイトでの広告輪播は自動的に停止します。本特典はAI-SKILLS開発応援への感謝ギフトであり、<strong>特定のクリック数や売上成約額を保証するものではありません（違法・詐欺・アダルト等の掲載は即時停止・返金不可）</strong>。
                      </>
                    ) : isCN ? (
                      <>
                        <strong>【斗内一下、回您一把 · 贴心约定（不保证业绩额 ＆ 到期自动停播）】</strong>：我了解斗内后可依方案等级享有对应之「曝光天数（30天～730天）、协播频率（1x～50x）与可上架广告件数（1～30件）」，并可在会员后台累积延长使用时间；当可使用时间结束后，即无法在各 WP 站间轮播广告。这份 AI 技能是感谢我赞助 AI-SKILLS 开发的回礼，<strong>系统会在天数内帮我全网轮播曝光，但不保证一定会有多少人点击或保证成交业绩额，且不能放违法/诈骗/色情内容喔（违规会下架且不退费）</strong>。
                      </>
                    ) : isChinese ? (
                      <>
                        <strong>【斗內一下、回您一把 · 貼心約定（不保證業績額 ＆ 到期自動停播）】</strong>：我了解斗內後可依方案等級享有對應之「曝光天數（30天～730天）、協播頻率（1x～50x）與可上架廣告件數（1～30件）」，並可在會員後台累積延長使用時間；當可使用時間結束後，即無法在各 WP 站間輪播廣告。這份 AI 技能是感謝我贊助 AI-SKILLS 開發的回禮，<strong>系統會在天數內幫我全網輪播曝光，但不保證一定會有多少人點擊或保證成交業績額，且不能放違法/詐騙/色情內容喔（違規會下架且不退費）</strong>。
                      </>
                    ) : (
                      <>
                        <strong>[Sponsor Perk Agreement (No Revenue Guarantee & Auto-Cutoff on Expiry)]</strong>: I understand that sponsoring grants Self-Serve Ad Studio access according to the selected tier’s active days, frequency (1x–50x), and ad slots (1–30). Once active time expires, ad rotation across all WP sites stops automatically. <strong>We do not guarantee specific click counts or sales revenue, and illegal/scam/adult content will be removed without refund.</strong>
                      </>
                    )}
                  </span>
                </label>
              </div>
            )}

            {/* 結帳區 */}
            <div className="max-w-xl mx-auto w-full">
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
            </div>

            <div className="text-center pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
              <span>
                {isJa
                  ? '* 決済完了後、専用IDとパスワードが即座にメールへ届きます（既存会員様は有効日数が自動加算されます）'
                  : isCN
                  ? '* 斗内成功后，系统会立刻寄发专属帐密（已开通会员将直接累加延长广告使用天数）'
                  : isChinese
                  ? '* 斗內成功後，系統會立刻寄發專屬帳密（已開通會員將直接累加延長廣告使用天數）'
                  : '* Login credentials emailed immediately after payment (existing accounts automatically extend active days)'}
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
