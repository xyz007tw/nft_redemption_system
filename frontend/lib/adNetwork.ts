import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import { putObjectToDedicatedR2, R2_PRIMARY_PUBLIC_DOMAIN, R2_DEV_PUBLIC_DOMAIN } from '@/lib/r2Storage';
import { scanBannedContent } from '@/lib/ebookEngine';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_key'
);

// 使用 packages 表中特殊保留 ID (990995) 的 roi_text 欄位作為免 SQL 遷移的高可用萬商廣告 JSON Store
export const AD_STORE_PKG_ID = 990995;
export const AD_STORE_PREFIX = '__WX_AD_NETWORK_STORE__:';
export const AD_R2_POOL_KEY = 'ads/active_ads_pool.json';
export const AD_R2_PRIMARY_URL = `${R2_PRIMARY_PUBLIC_DOMAIN}/${AD_R2_POOL_KEY}`;
export const AD_R2_MIRROR_URL = `${R2_DEV_PUBLIC_DOMAIN}/${AD_R2_POOL_KEY}`;

const AD_TOKEN_SECRET = process.env.ADMIN_SECRET_KEY || 'wx_ad_network_secret_2026_xyz007';

/**
 * 5 大萬商自助廣告等級：
 * - SPARK_15    : ⚡ $15 星火體驗型 (30天 / 1x 頻率 / 每站每日 60 次 / 1 件廣告)
 * - RESIDENT_120: 🔥 $120 百站常駐型 (365天 / 3x 頻率 / 每站每日 180 次 / 2 件廣告)
 * - GOLD_888    : 🥇 $888 黃金聚客型 (365天 / 8x 頻率 / 每站每日 500 次 / 5 件廣告)
 * - ROYAL_2700  : 💎 $2,700 皇家霸屏型 (365天 / 20x 頻率 / 每站每日 1,500 次 / 12 件廣告)
 * - SUPREME_6000: 👑 $6,000 萬商至尊型 (730天 / 50x 頻率 / 全時段無限頂置 / 30 件廣告)
 * (向下相容舊標記 MONTHLY_15 / YEARLY_120 / CUSTOM_ADMIN)
 */
export type AdPlanTier =
  | 'SPARK_15'
  | 'RESIDENT_120'
  | 'GOLD_888'
  | 'ROYAL_2700'
  | 'SUPREME_6000'
  | 'MONTHLY_15'
  | 'YEARLY_120'
  | 'CUSTOM_ADMIN';

export interface AdTierSpec {
  tier: AdPlanTier;
  price_usdt: number;
  name_zh: string;
  name_cn: string;
  name_en: string;
  name_ja: string;
  badge_zh: string;
  badge_en: string;
  days: number;
  weight: number;                // 協播頻率權重 (1x / 3x / 8x / 20x / 50x)
  daily_rotations_per_site: number; // 單站每日輪播次數上限
  max_ad_slots: number;          // 可同時上架輪播之廣告件數上限 (1 / 2 / 5 / 12 / 30)
  perks_zh: string[];
  perks_en: string[];
}

export const AD_TIER_SPECS: Record<string, AdTierSpec> = {
  SPARK_15: {
    tier: 'SPARK_15',
    price_usdt: 15,
    name_zh: '⚡ $15 星火體驗型（入門 30 天）',
    name_cn: '⚡ $15 星火体验型（入门 30 天）',
    name_en: '⚡ $15 Spark Starter (30 Days)',
    name_ja: '⚡ $15 スパーク体験プラン（30日間）',
    badge_zh: '⚡ 星火體驗 · 1x 頻率 · 1 件廣告',
    badge_en: '⚡ Spark 1x · 1 Ad Slot',
    days: 30,
    weight: 1,
    daily_rotations_per_site: 60,
    max_ad_slots: 1,
    perks_zh: ['開通 30 天全網曝光', '1x 標準協播頻率（每站每日約 60 次）', '可上架 1 件精選廣告卡片'],
    perks_en: ['30 Days Global Exposure', '1x Standard Frequency (~60 rotations/site/day)', '1 Active Ad Slot']
  },
  RESIDENT_120: {
    tier: 'RESIDENT_120',
    price_usdt: 120,
    name_zh: '🔥 $120 百站常駐型（買8送4 · 365天）',
    name_cn: '🔥 $120 百站常驻型（买8送4 · 365天）',
    name_en: '🔥 $120 100-Site Resident (365 Days)',
    name_ja: '🔥 $120 百サイト常駐プラン（365日間）',
    badge_zh: '🔥 百站常駐 · 3x 優先 · 2 件廣告',
    badge_en: '🔥 Resident 3x · 2 Ad Slots',
    days: 365,
    weight: 3,
    daily_rotations_per_site: 180,
    max_ad_slots: 2,
    perks_zh: ['買 8 個月送 4 個月（共 365 天）', '3x 優先協播頻率（每站每日約 180 次）', '可同時上架 2 件不同主打廣告輪播'],
    perks_en: ['Full 365 Days (Buy 8 Get 4 Free)', '3x Priority Frequency (~180 rotations/site/day)', '2 Active Ad Slots (A/B Rotation)']
  },
  GOLD_888: {
    tier: 'GOLD_888',
    price_usdt: 888,
    name_zh: '🥇 $888 黃金聚客型（365天 · 5件矩陣）',
    name_cn: '🥇 $888 黄金聚客型（365天 · 5件矩阵）',
    name_en: '🥇 $888 Gold Magnet (365 Days · 5 Slots)',
    name_ja: '🥇 $888 ゴールド集客プラン（365日・5枠）',
    badge_zh: '🥇 黃金聚客 · 8x 高頻 · 5 件廣告',
    badge_en: '🥇 Gold 8x · 5 Ad Slots',
    days: 365,
    weight: 8,
    daily_rotations_per_site: 500,
    max_ad_slots: 5,
    perks_zh: ['365 天黃金高亮邊框認證', '8x 高頻強勢協播（每站每日約 500 次）', '可同時上架 5 件產品/服務廣告輪番轟炸'],
    perks_en: ['365 Days Gold Highlight Badge', '8x High-Frequency Rotation (~500/site/day)', 'Up to 5 Active Ad Campaigns']
  },
  ROYAL_2700: {
    tier: 'ROYAL_2700',
    price_usdt: 2700,
    name_zh: '💎 $2,700 皇家霸屏型（365天 · 12件霸屏）',
    name_cn: '💎 $2,700 皇家霸屏型（365天 · 12件霸屏）',
    name_en: '💎 $2,700 Royal Takeover (365 Days · 12 Slots)',
    name_ja: '💎 $2,700 ロイヤル独占プラン（365日・12枠）',
    badge_zh: '💎 皇家霸屏 · 20x 極速 · 12 件廣告',
    badge_en: '💎 Royal 20x · 12 Ad Slots',
    days: 365,
    weight: 20,
    daily_rotations_per_site: 1500,
    max_ad_slots: 12,
    perks_zh: ['365 天雙卡連播與首屏優先權', '20x 皇家極速頻率（每站每日約 1,500 次）', '可同時上架 12 件全產品線廣告矩陣'],
    perks_en: ['365 Days Dual-Card Priority Placement', '20x Royal Velocity (~1,500/site/day)', 'Up to 12 Active Ad Campaigns']
  },
  SUPREME_6000: {
    tier: 'SUPREME_6000',
    price_usdt: 6000,
    name_zh: '👑 $6,000 萬商至尊型（730天雙年 · 30件旗艦）',
    name_cn: '👑 $6,000 万商至尊型（730天双年 · 30件旗舰）',
    name_en: '👑 $6,000 Global Supreme (730 Days · 30 Slots)',
    name_ja: '👑 $6,000 万商至高プラン（730日・30枠）',
    badge_zh: '👑 萬商至尊 · 50x 頂置 · 30 件廣告',
    badge_en: '👑 Supreme 50x · 30 Ad Slots',
    days: 730,
    weight: 50,
    daily_rotations_per_site: 9999,
    max_ad_slots: 30,
    perks_zh: ['整整 2 年（730 天）全站頂置帝王位', '50x 至尊頂置權重（全時段不限次霸屏）', '可同時上架 30 件跨國品牌廣告矩陣'],
    perks_en: ['Full 2 Years (730 Days) Top Pinned Placement', '50x Supreme Pinned Weight (Unlimited Daily)', 'Up to 30 Active Ad Campaigns']
  }
};

export function getAdTierSpecByTier(tier?: string, weight?: number): AdTierSpec {
  if (tier && AD_TIER_SPECS[tier]) return AD_TIER_SPECS[tier];
  if (tier === 'YEARLY_120') return AD_TIER_SPECS.RESIDENT_120;
  if (tier === 'MONTHLY_15') return AD_TIER_SPECS.SPARK_15;
  const w = Number(weight || 1);
  if (w >= 50) return AD_TIER_SPECS.SUPREME_6000;
  if (w >= 20) return AD_TIER_SPECS.ROYAL_2700;
  if (w >= 8) return AD_TIER_SPECS.GOLD_888;
  if (w >= 3) return AD_TIER_SPECS.RESIDENT_120;
  return AD_TIER_SPECS.SPARK_15;
}

export function resolveAdTierFromAmount(paidAmountUsdt: number): {
  spec: AdTierSpec;
  daysToAdd: number;
} {
  const amt = Number(paidAmountUsdt || 0);
  if (amt >= 5500) {
    return { spec: AD_TIER_SPECS.SUPREME_6000, daysToAdd: 730 };
  }
  if (amt >= 2500) {
    return { spec: AD_TIER_SPECS.ROYAL_2700, daysToAdd: 365 };
  }
  if (amt >= 800) {
    return { spec: AD_TIER_SPECS.GOLD_888, daysToAdd: 365 };
  }
  if (amt >= 115) {
    return { spec: AD_TIER_SPECS.RESIDENT_120, daysToAdd: 365 };
  }
  if (amt >= 95) {
    return { spec: AD_TIER_SPECS.RESIDENT_120, daysToAdd: 240 };
  }
  const months = Math.max(1, Math.floor(amt / 15));
  return { spec: AD_TIER_SPECS.SPARK_15, daysToAdd: months * 30 };
}

export interface AdSlotCampaign {
  slot_id: string;
  brand_name: string;
  headline_zh: string;
  headline_cn?: string;
  headline_en?: string;
  headline_ja?: string;
  body_zh: string;
  body_cn?: string;
  body_en?: string;
  body_ja?: string;
  cta_text_zh: string;
  cta_text_en?: string;
  cta_text_ja?: string;
  target_url: string;
  banner_image_url?: string;
  niche_category: 'ALL' | 'PARENTING' | 'MARKETING_SEO' | 'MINDFULNESS' | 'CAREER_BIZ';
  enabled: boolean;
}

export interface SponsorAdvertiser {
  id: string;
  email: string;
  password_code: string; // 客戶專屬登入密碼 (預設自動生成 8 碼易讀通行碼，亦可免密魔術連結登入)
  wallet_address?: string;
  brand_name: string;
  // 主廣告欄位 (Slot #1 預設主廣告，同時保留完整向下相容)
  headline_zh: string;
  headline_cn?: string;
  headline_en?: string;
  headline_ja?: string;
  body_zh: string;
  body_cn?: string;
  body_en?: string;
  body_ja?: string;
  cta_text_zh: string;
  cta_text_en?: string;
  cta_text_ja?: string;
  target_url: string;
  banner_image_url?: string;
  niche_category: 'ALL' | 'PARENTING' | 'MARKETING_SEO' | 'MINDFULNESS' | 'CAREER_BIZ';
  plan_tier: AdPlanTier;
  weight: number;                   // 協播頻率權重: 1 / 3 / 8 / 20 / 50
  daily_rotations_per_site?: number; // 單站每日輪播上限: 60 / 180 / 500 / 1500 / 9999
  max_ad_slots?: number;             // 可上架廣告件數上限: 1 / 2 / 5 / 12 / 30
  ad_slots?: AdSlotCampaign[];       // 多件廣告槽位清單 (依等級最高支援 30 件同時輪播)
  status: 'ACTIVE' | 'PAUSED' | 'BANNED';
  total_sponsored_usdt: number;
  impressions_count: number;
  clicks_count: number;
  agreed_no_guarantee_at: string;
  created_at: string;
  updated_at: string;
  expires_at: string; // ISO 時間戳，依天數精準計算，到期 0 秒自動斷電下架
  admin_notes?: string;
}

export interface PublicAdItem {
  id: string;
  advertiser_id: string;
  slot_index: number;
  plan_tier: AdPlanTier;
  tier_badge_zh: string;
  tier_badge_en: string;
  brand_name: string;
  headline_zh: string;
  headline_cn: string;
  headline_en: string;
  headline_ja: string;
  body_zh: string;
  body_cn: string;
  body_en: string;
  body_ja: string;
  cta_text_zh: string;
  cta_text_en: string;
  cta_text_ja: string;
  target_url: string;
  banner_image_url?: string;
  niche_category: string;
  weight: number;
  daily_rotations_per_site: number;
  max_ad_slots: number;
  expires_at: string;
  // 相容別名欄位 (供 100 站 WordPress 02-wx-floating-suite.php 與本地端 v2_axis_b_article.py 無縫讀取)
  headline: { tw: string; cn: string; en: string; ja: string };
  body: { tw: string; cn: string; en: string; ja: string };
  cta_text: { tw: string; cn: string; en: string; ja: string };
  banner_url: string;
}

export interface AdNetworkCloudStore {
  advertisers: Record<string, SponsorAdvertiser>; // key = normalized lowercase email
  last_r2_sync_at?: string;
  r2_primary_url?: string;
  r2_mirror_url?: string;
}

const DEFAULT_AD_STORE: AdNetworkCloudStore = {
  advertisers: {
    'xyz007tw@gmail.com': {
      id: 'ad-official-001',
      email: 'xyz007tw@gmail.com',
      password_code: 'WX888999',
      wallet_address: '0xea693e358f1527f8aa6563c9f6ebd42e37ee14fc',
      brand_name: '微享 AI-ATM 全球自動來客系統',
      headline_zh: '🔥 零技術打造你的 24H「知識自動販賣機 AI-ATM」！',
      headline_cn: '🔥 零技术打造您的 24H“知识自动贩卖机 AI-ATM”！',
      headline_en: '🔥 Launch Your 24/7 "Knowledge Vending Machine AI-ATM" with Zero Tech Skills!',
      headline_ja: '🔥 専門知識ゼロで24時間稼働「知識の自販機 AI-ATM」を構築！',
      body_zh: '結合短影音矩陣 ＋ 100座 WordPress 自動化 SEO 站群 ＋ 25% 聯盟裂變分潤，睡覺時也有全球被動收入！支援 $15 萬商廣告協播與 $990 電子書連鎖加盟（100% 倒抵手續費）。',
      body_cn: '结合短影音矩阵 ＋ 100座 WordPress 自动化 SEO 站群 ＋ 25% 联盟裂变分润，睡觉时也有全球被动收入！支持 $15 万商广告协播与 $990 电子书连锁加盟（100% 倒抵手续费）。',
      body_en: 'Combine AI Short Videos + 100 Automated WordPress SEO Sites + 25% Viral Affiliate Network. Earn passive global income while you sleep!',
      body_ja: 'AIショート動画＋100サイトの自動SEOブログ群＋25%アフィリエイト連鎖で、寝ている間も世界中から自動集客＆収益化！',
      cta_text_zh: '👉 立即免費試讀 & 探索 AI-ATM',
      cta_text_en: '👉 Explore AI-ATM Now',
      cta_text_ja: '👉 AI-ATMを今すぐ体験',
      target_url: 'https://nft1314.party/',
      banner_image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
      niche_category: 'ALL',
      plan_tier: 'SUPREME_6000',
      weight: 50,
      daily_rotations_per_site: 9999,
      max_ad_slots: 30,
      status: 'ACTIVE',
      total_sponsored_usdt: 6000,
      impressions_count: 1280,
      clicks_count: 196,
      agreed_no_guarantee_at: '2026-11-01T00:00:00Z',
      created_at: '2026-11-01T00:00:00Z',
      updated_at: '2026-11-08T00:00:00Z',
      expires_at: '2028-12-31T23:59:59Z',
      admin_notes: '官方預設示範萬商全網協播廣告'
    }
  },
  last_r2_sync_at: new Date().toISOString(),
  r2_primary_url: AD_R2_PRIMARY_URL,
  r2_mirror_url: AD_R2_MIRROR_URL
};

export function normalizeAdEmail(email: string): string {
  return (email || '').trim().toLowerCase();
}

export function generateAdPasswordCode(email: string): string {
  const hash = crypto.createHmac('sha256', AD_TOKEN_SECRET).update(normalizeAdEmail(email)).digest('hex').toUpperCase();
  return 'WX' + hash.slice(0, 6);
}

export function createAdMagicToken(email: string, expiresInMs = 30 * 24 * 60 * 60 * 1000): string {
  const payload = {
    email: normalizeAdEmail(email),
    exp: Date.now() + expiresInMs
  };
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', AD_TOKEN_SECRET).update(data).digest('base64url');
  return `${data}.${sig}`;
}

export function verifyAdMagicToken(token: string): { valid: boolean; email?: string } {
  if (!token || !token.includes('.')) return { valid: false };
  const [data, sig] = token.split('.');
  const expectedSig = crypto.createHmac('sha256', AD_TOKEN_SECRET).update(data).digest('base64url');
  if (sig !== expectedSig) return { valid: false };
  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
    if (Date.now() > Number(payload.exp || 0)) return { valid: false };
    return { valid: true, email: payload.email };
  } catch {
    return { valid: false };
  }
}

export function isAdvertiserCurrentlyActive(adv: SponsorAdvertiser): boolean {
  if (!adv || adv.status !== 'ACTIVE') return false;
  const expMs = new Date(adv.expires_at).getTime();
  if (isNaN(expMs) || expMs <= Date.now()) return false;
  if (!adv.headline_zh && !adv.headline_en) return false;
  if (!adv.target_url || !adv.target_url.startsWith('http')) return false;
  return true;
}

export function getRemainingDays(expiresAt: string): number {
  const diffMs = new Date(expiresAt).getTime() - Date.now();
  if (isNaN(diffMs) || diffMs <= 0) return 0;
  return Math.ceil(diffMs / (24 * 60 * 60 * 1000));
}

export function enrichAdvertiserTierFields(adv: SponsorAdvertiser): SponsorAdvertiser {
  const spec = getAdTierSpecByTier(adv.plan_tier, adv.weight);
  const maxSlots = adv.max_ad_slots || spec.max_ad_slots;
  const dailyRot = adv.daily_rotations_per_site || spec.daily_rotations_per_site;
  const weight = adv.weight || spec.weight;

  // 確保至少有第 1 個主槽位
  let slots = Array.isArray(adv.ad_slots) && adv.ad_slots.length > 0 ? [...adv.ad_slots] : [];
  if (slots.length === 0) {
    slots = [
      {
        slot_id: `${adv.id}-slot-1`,
        brand_name: adv.brand_name || '微享萬商推薦夥伴',
        headline_zh: adv.headline_zh || '',
        headline_cn: adv.headline_cn || adv.headline_zh || '',
        headline_en: adv.headline_en || adv.headline_zh || '',
        headline_ja: adv.headline_ja || adv.headline_en || adv.headline_zh || '',
        body_zh: adv.body_zh || '',
        body_cn: adv.body_cn || adv.body_zh || '',
        body_en: adv.body_en || adv.body_zh || '',
        body_ja: adv.body_ja || adv.body_en || adv.body_zh || '',
        cta_text_zh: adv.cta_text_zh || '👉 立即前往了解詳情',
        cta_text_en: adv.cta_text_en || '👉 Learn More Now',
        cta_text_ja: adv.cta_text_ja || '👉 今すぐ詳細を見る',
        target_url: adv.target_url || 'https://nft1314.party',
        banner_image_url: adv.banner_image_url || '',
        niche_category: adv.niche_category || 'ALL',
        enabled: true
      }
    ];
  }

  return {
    ...adv,
    plan_tier: spec.tier,
    weight,
    daily_rotations_per_site: dailyRot,
    max_ad_slots: maxSlots,
    ad_slots: slots.slice(0, maxSlots)
  };
}

export async function loadAdNetworkStore(): Promise<AdNetworkCloudStore> {
  try {
    const { data, error } = await supabase
      .from('packages')
      .select('roi_text')
      .eq('id', AD_STORE_PKG_ID)
      .single();

    if (!error && data && typeof data.roi_text === 'string' && data.roi_text.startsWith(AD_STORE_PREFIX)) {
      const parsed: AdNetworkCloudStore = JSON.parse(data.roi_text.slice(AD_STORE_PREFIX.length));
      if (parsed && parsed.advertisers) {
        if (!parsed.advertisers['xyz007tw@gmail.com']) {
          parsed.advertisers['xyz007tw@gmail.com'] = DEFAULT_AD_STORE.advertisers['xyz007tw@gmail.com'];
        }
        for (const k of Object.keys(parsed.advertisers)) {
          parsed.advertisers[k] = enrichAdvertiserTierFields(parsed.advertisers[k]);
        }
        return parsed;
      }
    }
  } catch (e) {
    console.warn('[AdNetwork] Load fallback to default:', e);
  }
  const clone: AdNetworkCloudStore = JSON.parse(JSON.stringify(DEFAULT_AD_STORE));
  for (const k of Object.keys(clone.advertisers)) {
    clone.advertisers[k] = enrichAdvertiserTierFields(clone.advertisers[k]);
  }
  return clone;
}

/**
 * 建構公開活躍廣告池：
 * 1. 嚴格過濾已到期 (`expires_at <= now`) 或非 ACTIVE 之廣告主（到期 0 秒自動斷電停播）
 * 2. 展開該廣告主在 `max_ad_slots` 額度內啟用的所有廣告槽位 (1 / 2 / 5 / 12 / 30 件)
 */
export function buildPublicAdPool(store: AdNetworkCloudStore): {
  updated_at: string;
  total_active: number;
  ads: PublicAdItem[];
} {
  const activeAds: PublicAdItem[] = [];
  for (const rawAdv of Object.values(store.advertisers || {})) {
    const adv = enrichAdvertiserTierFields(rawAdv);
    if (!isAdvertiserCurrentlyActive(adv)) continue;

    const spec = getAdTierSpecByTier(adv.plan_tier, adv.weight);
    const maxSlots = adv.max_ad_slots || spec.max_ad_slots;
    const slots = (adv.ad_slots || []).slice(0, maxSlots);

    slots.forEach((slot, idx) => {
      if (slot.enabled === false) return;
      const hlZh = slot.headline_zh || adv.headline_zh;
      const bdZh = slot.body_zh || adv.body_zh;
      const tUrl = slot.target_url || adv.target_url;
      if (!hlZh || !tUrl || !tUrl.startsWith('http')) return;

      const hlCn = slot.headline_cn || hlZh;
      const hlEn = slot.headline_en || hlZh;
      const hlJa = slot.headline_ja || hlEn || hlZh;
      const bdCn = slot.body_cn || bdZh;
      const bdEn = slot.body_en || bdZh;
      const bdJa = slot.body_ja || bdEn || bdZh;
      const ctaZh = slot.cta_text_zh || adv.cta_text_zh || '👉 立即前往了解';
      const ctaEn = slot.cta_text_en || adv.cta_text_en || '👉 Learn More';
      const ctaJa = slot.cta_text_ja || adv.cta_text_ja || '👉 詳細を見る';
      const bannerUrl = slot.banner_image_url !== undefined ? slot.banner_image_url : (adv.banner_image_url || '');

      activeAds.push({
        id: idx === 0 ? adv.id : `${adv.id}-s${idx + 1}`,
        advertiser_id: adv.id,
        slot_index: idx + 1,
        plan_tier: spec.tier,
        tier_badge_zh: spec.badge_zh,
        tier_badge_en: spec.badge_en,
        brand_name: slot.brand_name || adv.brand_name || '微享萬商推薦夥伴',
        headline_zh: hlZh,
        headline_cn: hlCn,
        headline_en: hlEn,
        headline_ja: hlJa,
        body_zh: bdZh,
        body_cn: bdCn,
        body_en: bdEn,
        body_ja: bdJa,
        cta_text_zh: ctaZh,
        cta_text_en: ctaEn,
        cta_text_ja: ctaJa,
        target_url: tUrl,
        banner_image_url: bannerUrl,
        niche_category: slot.niche_category || adv.niche_category || 'ALL',
        weight: adv.weight || spec.weight,
        daily_rotations_per_site: adv.daily_rotations_per_site || spec.daily_rotations_per_site,
        max_ad_slots: maxSlots,
        expires_at: adv.expires_at,
        headline: { tw: hlZh, cn: hlCn, en: hlEn, ja: hlJa },
        body: { tw: bdZh, cn: bdCn, en: bdEn, ja: bdJa },
        cta_text: { tw: ctaZh, cn: ctaZh, en: ctaEn, ja: ctaJa },
        banner_url: bannerUrl || ''
      });
    });
  }
  return {
    updated_at: new Date().toISOString(),
    total_active: activeAds.length,
    ads: activeAds
  };
}

export async function saveAdNetworkStore(store: AdNetworkCloudStore, syncR2 = true): Promise<{
  savedToDb: boolean;
  r2Synced: boolean;
  primaryUrl: string;
  mirrorUrl: string;
}> {
  let r2Synced = false;
  if (syncR2) {
    try {
      const publicPool = buildPublicAdPool(store);
      const buf = Buffer.from(JSON.stringify(publicPool, null, 2), 'utf-8');
      const r2Res = await putObjectToDedicatedR2(AD_R2_POOL_KEY, buf, 'application/json; charset=utf-8');
      r2Synced = r2Res.uploadedToCloud;
      store.last_r2_sync_at = new Date().toISOString();
      store.r2_primary_url = r2Res.primaryUrl;
      store.r2_mirror_url = r2Res.mirrorUrl;
    } catch (r2Err) {
      console.warn('[AdNetwork] R2 sync warning:', r2Err);
    }
  }

  const serialized = AD_STORE_PREFIX + JSON.stringify(store);
  const { error } = await supabase.from('packages').upsert(
    {
      id: AD_STORE_PKG_ID,
      name_zh: 'SYSTEM_AD_NETWORK_STORE_DO_NOT_DELETE',
      name_en: 'SYSTEM_AD_NETWORK_STORE_DO_NOT_DELETE',
      price: 15,
      roi_text: serialized,
      is_active: false,
      product_type: 'SPONSOR'
    },
    { onConflict: 'id' }
  );

  if (error) {
    console.error('[AdNetwork] Save store error:', error.message);
  }
  return {
    savedToDb: !error,
    r2Synced,
    primaryUrl: AD_R2_PRIMARY_URL,
    mirrorUrl: AD_R2_MIRROR_URL
  };
}

/**
 * 審查客戶提交之廣告文案與目標網址是否違反全球 10 大違禁規範或釣魚連結
 */
export function validateAdvertiserContent(input: {
  brand_name?: string;
  headline_zh?: string;
  headline_en?: string;
  headline_ja?: string;
  body_zh?: string;
  body_en?: string;
  body_ja?: string;
  target_url?: string;
}): { valid: boolean; reason?: string } {
  const combinedText = [
    input.brand_name,
    input.headline_zh,
    input.headline_en,
    input.headline_ja,
    input.body_zh,
    input.body_en,
    input.body_ja,
    input.target_url
  ]
    .filter(Boolean)
    .join(' ');

  const scan = scanBannedContent(combinedText);
  if (!scan.passed) {
    return {
      valid: false,
      reason: `偵測到違禁關鍵字「${scan.matchedKeyword || '不當詞彙'}」，依據平台 10 大合規條款無法上架。`
    };
  }

  if (input.target_url) {
    const urlStr = input.target_url.trim();
    if (!/^https?:\/\/.+/i.test(urlStr)) {
      return {
        valid: false,
        reason: '導流連結窗口必須以 https:// 或 http:// 開頭之完整有效網址。'
      };
    }
  }

  return { valid: true };
}

/**
 * 金流回呼或管理員手動開通/追加萬商廣告曝光天數與 5 大等級權限
 */
export async function activateOrExtendSponsorAdAccount(params: {
  email: string;
  paidAmountUsdt: number;
  walletAddress?: string;
  explicitDaysToAdd?: number;
  explicitPlanTier?: AdPlanTier;
  adminNote?: string;
  sendWelcomeEmail?: boolean;
}): Promise<{
  activated: boolean;
  daysAdded: number;
  advertiser?: SponsorAdvertiser;
  magicLoginUrl?: string;
}> {
  const cleanEmail = normalizeAdEmail(params.email);
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { activated: false, daysAdded: 0 };
  }

  let daysToAdd = 0;
  let chosenSpec: AdTierSpec = AD_TIER_SPECS.SPARK_15;

  if (typeof params.explicitDaysToAdd === 'number') {
    daysToAdd = Math.round(params.explicitDaysToAdd);
    if (params.explicitPlanTier && AD_TIER_SPECS[params.explicitPlanTier]) {
      chosenSpec = AD_TIER_SPECS[params.explicitPlanTier];
    } else if (Number(params.paidAmountUsdt || 0) >= 15) {
      chosenSpec = resolveAdTierFromAmount(Number(params.paidAmountUsdt)).spec;
    } else if (daysToAdd >= 700) {
      chosenSpec = AD_TIER_SPECS.SUPREME_6000;
    } else if (daysToAdd >= 240) {
      chosenSpec = AD_TIER_SPECS.RESIDENT_120;
    } else {
      chosenSpec = AD_TIER_SPECS.SPARK_15;
    }
  } else {
    const amt = Number(params.paidAmountUsdt || 0);
    if (amt < 14) {
      // 小於 $15 之純小額斗內（如 $3），不開通萬商廣告系統
      return { activated: false, daysAdded: 0 };
    }
    const resolved = resolveAdTierFromAmount(amt);
    chosenSpec = resolved.spec;
    daysToAdd = resolved.daysToAdd;
  }

  const store = await loadAdNetworkStore();
  const existing = store.advertisers[cleanEmail] ? enrichAdvertiserTierFields(store.advertisers[cleanEmail]) : undefined;
  const now = new Date();
  const currentExpMs = existing ? new Date(existing.expires_at).getTime() : 0;
  const baseMs = !isNaN(currentExpMs) && currentExpMs > now.getTime() ? currentExpMs : now.getTime();
  const newExpDate = new Date(baseMs + daysToAdd * 24 * 60 * 60 * 1000);

  // 若累積斗內金額達到更高階門檻，自動晉升為對應高階方案 (例如累積滿 $888 / $2700 / $6000)
  const newTotalSponsored = Number((existing?.total_sponsored_usdt || 0) + (params.paidAmountUsdt || 0));
  const cumulativeSpec = resolveAdTierFromAmount(newTotalSponsored).spec;
  const finalSpec =
    cumulativeSpec.weight > chosenSpec.weight && cumulativeSpec.weight > (existing?.weight || 1)
      ? cumulativeSpec
      : chosenSpec.weight >= (existing?.weight || 1)
      ? chosenSpec
      : getAdTierSpecByTier(existing?.plan_tier, existing?.weight);

  const passwordCode = existing?.password_code || generateAdPasswordCode(cleanEmail);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nft1314.party';

  const updatedAdv: SponsorAdvertiser = existing
    ? enrichAdvertiserTierFields({
        ...existing,
        wallet_address: params.walletAddress || existing.wallet_address,
        plan_tier: finalSpec.tier,
        weight: finalSpec.weight,
        daily_rotations_per_site: finalSpec.daily_rotations_per_site,
        max_ad_slots: finalSpec.max_ad_slots,
        status: existing.status === 'BANNED' ? 'BANNED' : 'ACTIVE',
        total_sponsored_usdt: newTotalSponsored,
        updated_at: now.toISOString(),
        expires_at: newExpDate.toISOString(),
        admin_notes: params.adminNote
          ? `${existing.admin_notes ? existing.admin_notes + ' | ' : ''}[${now.toISOString().slice(0, 10)}] ${params.adminNote} (${daysToAdd >= 0 ? '+' : ''}${daysToAdd}天, 等級:${finalSpec.tier})`
          : existing.admin_notes
      })
    : enrichAdvertiserTierFields({
        id: 'ad-' + Date.now().toString(36) + '-' + crypto.randomBytes(2).toString('hex'),
        email: cleanEmail,
        password_code: passwordCode,
        wallet_address: params.walletAddress || '',
        brand_name: cleanEmail.split('@')[0] + ' 嚴選品牌',
        headline_zh: '🔥 歡迎造訪我們的官方精選服務與最新優惠！',
        headline_cn: '🔥 欢迎造访我们的官方精选服务与最新优惠！',
        headline_en: '🔥 Discover Our Featured Services & Exclusive Offers!',
        headline_ja: '🔥 公式厳選サービスと最新キャンペーンをご覧ください！',
        body_zh: '感謝微享 AI 自動來客系統全網協播推薦！點擊下方連結立即聯繫我們或查看專屬優惠方案。',
        body_cn: '感谢微享 AI 自动来客系统全网协播推荐！点击下方链接立即联系我们或查看专属优惠方案。',
        body_en: 'Recommended by WeiXiang AI-ATM Global Network! Click below to connect with us and claim your special offer.',
        body_ja: 'WeiXiang AI-ATM グローバルネットワーク推薦！下のボタンから詳細・限定特典をご確認ください。',
        cta_text_zh: '👉 立即前往了解詳情',
        cta_text_en: '👉 Learn More Now',
        cta_text_ja: '👉 今すぐ詳細を見る',
        target_url: siteUrl,
        banner_image_url: '',
        niche_category: 'ALL',
        plan_tier: finalSpec.tier,
        weight: finalSpec.weight,
        daily_rotations_per_site: finalSpec.daily_rotations_per_site,
        max_ad_slots: finalSpec.max_ad_slots,
        status: 'ACTIVE',
        total_sponsored_usdt: newTotalSponsored,
        impressions_count: 0,
        clicks_count: 0,
        agreed_no_guarantee_at: now.toISOString(),
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        expires_at: newExpDate.toISOString(),
        admin_notes: params.adminNote || `首次開通 ${finalSpec.name_zh} (+${daysToAdd}天)`
      });

  store.advertisers[cleanEmail] = updatedAdv;
  await saveAdNetworkStore(store, true);

  const magicToken = createAdMagicToken(cleanEmail);
  const magicLoginUrl = `${siteUrl}/ad-studio?ad_token=${encodeURIComponent(magicToken)}`;

  if (params.sendWelcomeEmail !== false && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const remainingTotalDays = getRemainingDays(updatedAdv.expires_at);
      await transporter.sendMail({
        from: `"WeiXiang 萬商廣告中心" <${process.env.EMAIL_USER}>`,
        to: cleanEmail,
        cc: 'qqww0614@gmail.com',
        subject: `📢 【WeiXiang 萬商廣告系統】您的「${finalSpec.name_zh}」已開通！（有效曝光：${remainingTotalDays} 天 · 可上架 ${finalSpec.max_ad_slots} 件廣告）`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 640px; margin: 0 auto; padding: 28px; border: 1px solid #e2e8f0; border-radius: 18px; background: #ffffff; color: #0f172a;">
            <div style="display: inline-block; background: #eff6ff; color: #2563eb; font-weight: 800; font-size: 12px; padding: 5px 12px; border-radius: 999px; margin-bottom: 12px;">
              📢 WEIXIANG GLOBAL AD NETWORK · 斗內一下、回您一把！
            </div>
            <h2 style="margin: 0 0 12px; color: #0f172a; font-size: 22px;">🎉 感謝您的支持！您的「${finalSpec.name_zh}」已正式開通！</h2>
            <p style="font-size: 14.5px; line-height: 1.7; color: #334155;">
              親愛的夥伴您好，系統已為您的信箱增加 <strong>+${daysToAdd} 天</strong> 萬商全網廣告協播權限（目前累計有效剩餘：<strong>${remainingTotalDays} 天</strong>，到期日：<strong>${updatedAdv.expires_at.slice(0, 10)}</strong>）。
            </p>

            <div style="background: #f0fdf4; border: 1px solid #86efac; padding: 14px 18px; border-radius: 12px; margin: 16px 0; font-size: 13.5px; color: #166534;">
              <strong>🌟 您的專屬廣告方案等級權益：</strong><br/>
              • 方案等級：<strong>${finalSpec.name_zh}</strong><br/>
              • 協播頻率權重：<strong>${finalSpec.weight}x 倍速優先曝光</strong>（單站每日最高輪播約 ${finalSpec.daily_rotations_per_site} 次）<br/>
              • 可同時上架廣告件數：<strong>最多 ${finalSpec.max_ad_slots} 件不同廣告卡片輪番放送</strong>
            </div>

            <div style="background: linear-gradient(135deg, #0f172a, #1e1b4b); color: #ffffff; padding: 22px; border-radius: 14px; margin: 20px 0;">
              <h3 style="margin: 0 0 12px; color: #38bdf8; font-size: 16px;">🔑 您的「萬商廣告小幫手」專屬登入憑證：</h3>
              <p style="margin: 6px 0; font-size: 14px;">• <strong>自助廣告後台網址</strong>：<a href="${siteUrl}/ad-studio" style="color: #6ee7b7; font-weight: bold;">${siteUrl}/ad-studio</a></p>
              <p style="margin: 6px 0; font-size: 14px;">• <strong>登入帳號 (Email)</strong>：<code style="background: rgba(255,255,255,0.15); padding: 3px 8px; border-radius: 6px; color: #fde047;">${cleanEmail}</code></p>
              <p style="margin: 6px 0; font-size: 14px;">• <strong>專屬密碼 (Password)</strong>：<code style="background: rgba(255,255,255,0.15); padding: 3px 8px; border-radius: 6px; color: #fde047; font-weight: bold;">${updatedAdv.password_code}</code></p>
              <div style="margin-top: 18px;">
                <a href="${magicLoginUrl}" style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: #ffffff; text-decoration: none; font-weight: 800; font-size: 14px; padding: 12px 24px; border-radius: 10px;">
                  🚀 點此免輸入密碼「一鍵進入我的廣告小幫手」設定廣告 ➔
                </a>
              </div>
            </div>

            <p style="font-size: 12px; color: #64748b; margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 12px;">
              📌 備註：您的斗內贊助金額已 100% 併入您個人的「級差分潤升等累積業績」。當可用天數到期後，各站將自動停止輪播；您隨時可至會員後台 (/dashboard) 或斗內專區 (/sponsor) 續加天數（純贊助回饋，不保證具體業績額）。
            </p>
          </div>
        `
      });
    } catch (mailErr) {
      console.error('[AdNetwork] Welcome email error:', mailErr);
    }
  }

  return {
    activated: true,
    daysAdded: daysToAdd,
    advertiser: updatedAdv,
    magicLoginUrl
  };
}
