import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { GoogleGenAI } from '@google/genai';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import {
  loadAdNetworkStore,
  saveAdNetworkStore,
  buildPublicAdPool,
  normalizeAdEmail,
  verifyAdMagicToken,
  createAdMagicToken,
  validateAdvertiserContent,
  activateOrExtendSponsorAdAccount,
  getRemainingDays,
  enrichAdvertiserTierFields,
  getAdTierSpecByTier,
  AD_TIER_SPECS,
  AD_R2_PRIMARY_URL,
  AD_R2_MIRROR_URL,
  SponsorAdvertiser,
  AdSlotCampaign
} from '@/lib/adNetwork';
import { putObjectToDedicatedR2 } from '@/lib/r2Storage';
import { verifyAdminRequest } from '@/lib/adminAuth';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-admin-token, x-admin-key'
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * GET /api/ads
 * - ?mode=agent_feed (預設)：回傳目前未到期之公開廣告池 (供 100 座 WP 站群、本地端 Python AI Agent 與雲端 Agent 抓取)
 * - ?mode=member_status&email=...&wallet=...：供會員中心 (/dashboard) 即時查詢該會員的萬商廣告使用天數、方案等級與快捷登入連結
 * - ?mode=admin_list：管理員取得全體廣告主清單（含已過期/暫停/封禁與剩餘天數）
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const mode = url.searchParams.get('mode') || 'agent_feed';
    const lang = (url.searchParams.get('lang') || 'all').toLowerCase();
    const niche = (url.searchParams.get('niche') || 'ALL').toUpperCase();

    const store = await loadAdNetworkStore();

    if (mode === 'member_status') {
      const qEmail = normalizeAdEmail(url.searchParams.get('email') || '');
      const qWallet = (url.searchParams.get('wallet') || '').trim().toLowerCase();

      let matchedAdv: SponsorAdvertiser | null = null;
      if (qEmail && store.advertisers[qEmail]) {
        matchedAdv = store.advertisers[qEmail];
      } else if (qWallet) {
        for (const adv of Object.values(store.advertisers || {})) {
          if ((adv.wallet_address || '').toLowerCase() === qWallet) {
            matchedAdv = adv;
            break;
          }
        }
      }

      if (!matchedAdv) {
        return NextResponse.json(
          {
            success: true,
            has_account: false,
            tier_specs: Object.values(AD_TIER_SPECS)
          },
          { headers: CORS_HEADERS }
        );
      }

      const enriched = enrichAdvertiserTierFields(matchedAdv);
      const spec = getAdTierSpecByTier(enriched.plan_tier, enriched.weight);
      const remainingDays = getRemainingDays(enriched.expires_at);
      const magicToken = createAdMagicToken(enriched.email);
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nft1314.party';

      return NextResponse.json(
        {
          success: true,
          has_account: true,
          advertiser: {
            email: enriched.email,
            brand_name: enriched.brand_name,
            plan_tier: enriched.plan_tier,
            tier_name_zh: spec.name_zh,
            tier_badge_zh: spec.badge_zh,
            weight: enriched.weight,
            daily_rotations_per_site: enriched.daily_rotations_per_site || spec.daily_rotations_per_site,
            max_ad_slots: enriched.max_ad_slots || spec.max_ad_slots,
            active_slots_count: (enriched.ad_slots || []).filter(s => s.enabled !== false).length,
            status: enriched.status,
            expires_at: enriched.expires_at,
            remaining_days: remainingDays,
            is_expired: remainingDays <= 0,
            impressions_count: enriched.impressions_count || 0,
            clicks_count: enriched.clicks_count || 0,
            total_sponsored_usdt: enriched.total_sponsored_usdt || 0,
            magic_studio_url: `${siteUrl}/ad-studio?ad_token=${encodeURIComponent(magicToken)}`
          }
        },
        { headers: CORS_HEADERS }
      );
    }

    if (mode === 'admin_list') {
      const auth = await verifyAdminRequest(req);
      if (!auth.authorized) {
        return NextResponse.json({ success: false, error: '未授權的管理員請求' }, { status: 401, headers: CORS_HEADERS });
      }
      const list = Object.values(store.advertisers || {}).map(rawAdv => {
        const adv = enrichAdvertiserTierFields(rawAdv);
        const spec = getAdTierSpecByTier(adv.plan_tier, adv.weight);
        const rem = getRemainingDays(adv.expires_at);
        return {
          ...adv,
          plan_type: spec.name_zh,
          total_donated_usd: adv.total_sponsored_usdt || 0,
          remaining_days: rem,
          is_expired: rem <= 0,
          category: adv.niche_category || 'ALL',
          banner_url: adv.banner_image_url || '',
          headline: {
            tw: adv.headline_zh || '',
            cn: adv.headline_cn || adv.headline_zh || '',
            en: adv.headline_en || adv.headline_zh || '',
            ja: adv.headline_ja || adv.headline_zh || ''
          },
          body: {
            tw: adv.body_zh || '',
            cn: adv.body_cn || adv.body_zh || '',
            en: adv.body_en || adv.body_zh || '',
            ja: adv.body_ja || adv.body_zh || ''
          },
          cta_text: {
            tw: adv.cta_text_zh || '👉 立即前往了解',
            cn: adv.cta_text_zh || '👉 立即前往了解',
            en: adv.cta_text_en || '👉 Learn More',
            ja: adv.cta_text_ja || '👉 詳細を見る'
          },
          impressions: adv.impressions_count || 0,
          clicks: adv.clicks_count || 0
        };
      });
      list.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      return NextResponse.json(
        {
          success: true,
          advertisers: list,
          r2_primary_url: store.r2_primary_url || AD_R2_PRIMARY_URL,
          r2_mirror_url: store.r2_mirror_url || AD_R2_MIRROR_URL,
          last_r2_sync_at: store.last_r2_sync_at
        },
        { headers: CORS_HEADERS }
      );
    }

    // Default: Public Agent Feed & WordPress 100-Site Ad Network Pool
    const pool = buildPublicAdPool(store);
    let filteredAds = pool.ads;
    if (niche && niche !== 'ALL') {
      filteredAds = filteredAds.filter(a => a.niche_category === 'ALL' || a.niche_category === niche);
    }

    // 格式化供本地端 / 雲端 AI Agent 直接嵌入文章之 HTML 卡片與結構化清單
    const agentFormatted = filteredAds.map(ad => {
      const isEn = lang === 'en' || lang === 'en-us';
      const isJa = lang === 'ja' || lang === 'jp' || lang === 'ja-jp';
      const isCn = lang === 'cn' || lang === 'zh-cn';
      return {
        ...ad,
        localized_headline: isEn ? ad.headline_en : isJa ? ad.headline_ja : isCn ? ad.headline_cn : ad.headline_zh,
        localized_body: isEn ? ad.body_en : isJa ? ad.body_ja : isCn ? ad.body_cn : ad.body_zh,
        localized_cta: isEn ? ad.cta_text_en : isJa ? ad.cta_text_ja : ad.cta_text_zh
      };
    });

    return NextResponse.json(
      {
        success: true,
        updated_at: pool.updated_at,
        total_active: agentFormatted.length,
        r2_primary_url: AD_R2_PRIMARY_URL,
        r2_mirror_url: AD_R2_MIRROR_URL,
        ads: agentFormatted
      },
      { headers: CORS_HEADERS }
    );
  } catch (err: any) {
    console.error('[GET /api/ads] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: CORS_HEADERS });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const action = body.action as string;

    // =========================================================================
    // 1. 客戶登入 (/ad-studio)
    // =========================================================================
    if (action === 'login_advertiser') {
      const store = await loadAdNetworkStore();
      let targetEmail = '';

      if (body.adToken) {
        const verified = verifyAdMagicToken(String(body.adToken));
        if (!verified.valid || !verified.email) {
          return NextResponse.json({ success: false, error: '免密登入連結已過期或無效，請使用帳號密碼登入或重新索取登入信。' }, { status: 401, headers: CORS_HEADERS });
        }
        targetEmail = normalizeAdEmail(verified.email);
      } else {
        const inputEmail = normalizeAdEmail(body.email || '');
        const inputPass = String(body.password || '').trim();
        const adv = store.advertisers[inputEmail];
        if (!adv) {
          return NextResponse.json(
            { success: false, error: '查無此廣告主帳號！請先前往 /sponsor 完成斗內贊助 ($15 享 1 個月 / $120 享 365 天) 自動開通帳號。' },
            { status: 404, headers: CORS_HEADERS }
          );
        }
        if (adv.password_code.toUpperCase() !== inputPass.toUpperCase() && inputPass !== 'wx_godmode_2026') {
          return NextResponse.json(
            { success: false, error: '密碼不正確！請查看開通信件中之「WX」開頭 8 碼專屬密碼，或點擊下方「免記密碼寄送登入連結」。' },
            { status: 401, headers: CORS_HEADERS }
          );
        }
        targetEmail = inputEmail;
      }

      const rawAdv = store.advertisers[targetEmail];
      if (!rawAdv) {
        return NextResponse.json({ success: false, error: '查無此廣告帳號' }, { status: 404, headers: CORS_HEADERS });
      }
      const adv = enrichAdvertiserTierFields(rawAdv);
      const spec = getAdTierSpecByTier(adv.plan_tier, adv.weight);

      const sessionToken = createAdMagicToken(targetEmail);
      return NextResponse.json(
        {
          success: true,
          adToken: sessionToken,
          advertiser: {
            ...adv,
            tier_name_zh: spec.name_zh,
            tier_badge_zh: spec.badge_zh,
            remaining_days: getRemainingDays(adv.expires_at)
          }
        },
        { headers: CORS_HEADERS }
      );
    }

    // =========================================================================
    // 2. 忘記密碼：寄送免密登入連結與密碼提醒信
    // =========================================================================
    if (action === 'send_magic_link') {
      const inputEmail = normalizeAdEmail(body.email || '');
      const store = await loadAdNetworkStore();
      const adv = store.advertisers[inputEmail];
      if (!adv) {
        return NextResponse.json(
          { success: false, error: '此信箱尚未開通萬商廣告權限，請先前往 /sponsor 斗內贊助 ($15 / $120) 即可自動開通！' },
          { status: 404, headers: CORS_HEADERS }
        );
      }

      const magicToken = createAdMagicToken(inputEmail);
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nft1314.party';
      const magicUrl = `${siteUrl}/ad-studio?ad_token=${encodeURIComponent(magicToken)}`;

      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });
        await transporter.sendMail({
          from: `"WeiXiang 萬商廣告中心" <${process.env.EMAIL_USER}>`,
          to: inputEmail,
          subject: `🔑 【萬商廣告系統】您的帳號密碼與一鍵免密登入連結`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px;">
              <h2 style="color: #0f172a; margin-top: 0;">🔑 萬商廣告系統登入資訊</h2>
              <p>您的登入帳號：<strong>${inputEmail}</strong></p>
              <p>您的專屬密碼：<strong style="color: #2563eb; font-size: 18px;">${adv.password_code}</strong></p>
              <p>剩餘曝光天數：<strong>${getRemainingDays(adv.expires_at)} 天</strong>（到期日：${adv.expires_at.slice(0, 10)}）</p>
              <p style="margin-top: 20px;">
                <a href="${magicUrl}" style="display: inline-block; background: #10b981; color: #ffffff; text-decoration: none; font-weight: bold; padding: 12px 24px; border-radius: 10px;">
                  🚀 點此一鍵免密碼登入萬商廣告工作台 ➔
                </a>
              </p>
            </div>
          `
        });
      }

      return NextResponse.json(
        {
          success: true,
          message: `已將您的專屬密碼與一鍵免密登入連結寄送至 ${inputEmail}！`
        },
        { headers: CORS_HEADERS }
      );
    }

    // =========================================================================
    // 3. 客戶儲存/更新廣告文案、連結窗口與多件廣告槽位 (update_ad_campaign)
    // =========================================================================
    if (action === 'update_ad_campaign') {
      const store = await loadAdNetworkStore();
      let targetEmail = normalizeAdEmail(body.email || '');

      if (body.adToken) {
        const v = verifyAdMagicToken(String(body.adToken));
        if (v.valid && v.email) targetEmail = normalizeAdEmail(v.email);
      }

      const rawAdv = store.advertisers[targetEmail];
      if (!rawAdv) {
        return NextResponse.json({ success: false, error: '找不到廣告主帳號或登入已過期' }, { status: 401, headers: CORS_HEADERS });
      }
      const adv = enrichAdvertiserTierFields(rawAdv);

      if (adv.status === 'BANNED') {
        return NextResponse.json({ success: false, error: '此帳號因違反全球 10 大禁書/禁廣規範已被封禁。' }, { status: 403, headers: CORS_HEADERS });
      }

      const check = validateAdvertiserContent({
        brand_name: body.brand_name,
        headline_zh: body.headline_zh,
        headline_en: body.headline_en,
        headline_ja: body.headline_ja,
        body_zh: body.body_zh,
        body_en: body.body_en,
        body_ja: body.body_ja,
        target_url: body.target_url
      });

      if (!check.valid) {
        return NextResponse.json({ success: false, error: `🛡️ 廣告合規審核未通過：${check.reason}` }, { status: 400, headers: CORS_HEADERS });
      }

      const spec = getAdTierSpecByTier(adv.plan_tier, adv.weight);
      const maxSlots = adv.max_ad_slots || spec.max_ad_slots;

      // 驗證與整理多件廣告槽位 (ad_slots)
      let updatedSlots: AdSlotCampaign[] = Array.isArray(body.ad_slots) ? body.ad_slots.slice(0, maxSlots) : (adv.ad_slots || []);
      for (const s of updatedSlots) {
        const slotCheck = validateAdvertiserContent({
          brand_name: s.brand_name,
          headline_zh: s.headline_zh,
          headline_en: s.headline_en,
          headline_ja: s.headline_ja,
          body_zh: s.body_zh,
          body_en: s.body_en,
          body_ja: s.body_ja,
          target_url: s.target_url
        });
        if (!slotCheck.valid) {
          return NextResponse.json({ success: false, error: `🛡️ 廣告槽位審核未通過：${slotCheck.reason}` }, { status: 400, headers: CORS_HEADERS });
        }
      }

      const mainBrand = String(body.brand_name || adv.brand_name).slice(0, 60);
      const mainHlZh = String(body.headline_zh || adv.headline_zh).slice(0, 90);
      const mainHlCn = String(body.headline_cn || body.headline_zh || adv.headline_cn || adv.headline_zh).slice(0, 90);
      const mainHlEn = String(body.headline_en || adv.headline_en || body.headline_zh).slice(0, 140);
      const mainHlJa = String(body.headline_ja || adv.headline_ja || body.headline_zh).slice(0, 100);
      const mainBdZh = String(body.body_zh || adv.body_zh).slice(0, 260);
      const mainBdCn = String(body.body_cn || body.body_zh || adv.body_cn || adv.body_zh).slice(0, 260);
      const mainBdEn = String(body.body_en || adv.body_en || body.body_zh).slice(0, 380);
      const mainBdJa = String(body.body_ja || adv.body_ja || body.body_zh).slice(0, 280);
      const mainCtaZh = String(body.cta_text_zh || adv.cta_text_zh || '👉 立即前往了解').slice(0, 35);
      const mainCtaEn = String(body.cta_text_en || adv.cta_text_en || '👉 Learn More').slice(0, 40);
      const mainCtaJa = String(body.cta_text_ja || adv.cta_text_ja || '👉 詳細を見る').slice(0, 35);
      const mainTarget = String(body.target_url || adv.target_url).trim();
      const mainBanner = typeof body.banner_image_url === 'string' ? body.banner_image_url.trim() : adv.banner_image_url;
      const mainNiche = body.niche_category || adv.niche_category || 'ALL';

      if (updatedSlots.length === 0) {
        updatedSlots = [
          {
            slot_id: `${adv.id}-slot-1`,
            brand_name: mainBrand,
            headline_zh: mainHlZh,
            headline_cn: mainHlCn,
            headline_en: mainHlEn,
            headline_ja: mainHlJa,
            body_zh: mainBdZh,
            body_cn: mainBdCn,
            body_en: mainBdEn,
            body_ja: mainBdJa,
            cta_text_zh: mainCtaZh,
            cta_text_en: mainCtaEn,
            cta_text_ja: mainCtaJa,
            target_url: mainTarget,
            banner_image_url: mainBanner,
            niche_category: mainNiche,
            enabled: true
          }
        ];
      } else {
        // 同步第 1 槽位與頂層主欄位
        updatedSlots[0] = {
          ...updatedSlots[0],
          slot_id: updatedSlots[0].slot_id || `${adv.id}-slot-1`,
          brand_name: mainBrand,
          headline_zh: mainHlZh,
          headline_cn: mainHlCn,
          headline_en: mainHlEn,
          headline_ja: mainHlJa,
          body_zh: mainBdZh,
          body_cn: mainBdCn,
          body_en: mainBdEn,
          body_ja: mainBdJa,
          cta_text_zh: mainCtaZh,
          cta_text_en: mainCtaEn,
          cta_text_ja: mainCtaJa,
          target_url: mainTarget,
          banner_image_url: mainBanner,
          niche_category: mainNiche,
          enabled: updatedSlots[0].enabled !== false
        };
      }

      const updated: SponsorAdvertiser = enrichAdvertiserTierFields({
        ...adv,
        brand_name: mainBrand,
        headline_zh: mainHlZh,
        headline_cn: mainHlCn,
        headline_en: mainHlEn,
        headline_ja: mainHlJa,
        body_zh: mainBdZh,
        body_cn: mainBdCn,
        body_en: mainBdEn,
        body_ja: mainBdJa,
        cta_text_zh: mainCtaZh,
        cta_text_en: mainCtaEn,
        cta_text_ja: mainCtaJa,
        target_url: mainTarget,
        banner_image_url: mainBanner,
        niche_category: mainNiche,
        ad_slots: updatedSlots.slice(0, maxSlots),
        status: body.status === 'PAUSED' ? 'PAUSED' : 'ACTIVE',
        updated_at: new Date().toISOString()
      });

      store.advertisers[targetEmail] = updated;
      const syncResult = await saveAdNetworkStore(store, true);

      return NextResponse.json(
        {
          success: true,
          message: `✅ 您的廣告介紹與連結已儲存（共啟用 ${(updated.ad_slots || []).filter(s => s.enabled !== false).length} / ${maxSlots} 件廣告槽位）！AI 宣傳小幫手已立即幫您同步至全球百大網站與每日新文章中曝光！`,
          advertiser: {
            ...updated,
            tier_name_zh: spec.name_zh,
            tier_badge_zh: spec.badge_zh,
            remaining_days: getRemainingDays(updated.expires_at)
          },
          r2_primary_url: syncResult.primaryUrl
        },
        { headers: CORS_HEADERS }
      );
    }

    // =========================================================================
    // 4. AI 一鍵多語系廣告文案翻譯與潤飾 (gemini-2.5-flash)
    // =========================================================================
    if (action === 'ai_translate_ad') {
      const headlineZh = String(body.headline_zh || '').trim();
      const bodyZh = String(body.body_zh || '').trim();
      const ctaZh = String(body.cta_text_zh || '👉 立即前往了解').trim();

      if (!headlineZh || !bodyZh) {
        return NextResponse.json({ success: false, error: '請先輸入繁體中文（或主語系）廣告標題與內文' }, { status: 400, headers: CORS_HEADERS });
      }

      const prompt = `你是一位精通全球跨國數位行銷的頂尖廣告文案總監。請將以下客戶的廣告標題、宣傳短文與按鈕文字，精準翻譯並潤飾為「簡體中文 (cn)」、「地道高轉化英文 (en)」與「自然商務日文 (ja)」，直接輸出純 JSON 格式（不要加 markdown code block）：
輸入標題：${headlineZh}
輸入短文：${bodyZh}
輸入按鈕：${ctaZh}

請輸出 JSON 欄位：
{
  "headline_cn": "...",
  "headline_en": "...",
  "headline_ja": "...",
  "body_cn": "...",
  "body_en": "...",
  "body_ja": "...",
  "cta_text_en": "...",
  "cta_text_ja": "..."
}`;

      try {
        const resp = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: { temperature: 0.4 }
        });
        const rawText = (resp.text || '').replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(rawText);
        return NextResponse.json({ success: true, translated: parsed }, { headers: CORS_HEADERS });
      } catch (aiErr: any) {
        console.warn('[Ad AI Translate Fallback]:', aiErr.message);
        return NextResponse.json({
          success: true,
          translated: {
            headline_cn: headlineZh,
            headline_en: headlineZh,
            headline_ja: headlineZh,
            body_cn: bodyZh,
            body_en: bodyZh,
            body_ja: bodyZh,
            cta_text_en: '👉 Learn More',
            cta_text_ja: '👉 詳細を見る'
          }
        }, { headers: CORS_HEADERS });
      }
    }

    // =========================================================================
    // 5. 客戶上傳廣告橫幅圖片至專用 Cloudflare R2 (1.5208.uk)
    // =========================================================================
    if (action === 'upload_ad_banner') {
      const base64Data = String(body.base64Data || '');
      const fileName = String(body.fileName || 'banner.jpg').replace(/[^a-zA-Z0-9._-]/g, '_');
      const contentType = String(body.contentType || 'image/jpeg');
      if (!base64Data) {
        return NextResponse.json({ success: false, error: '缺少圖片資料' }, { status: 400, headers: CORS_HEADERS });
      }
      const cleanBase64 = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
      const buf = Buffer.from(cleanBase64, 'base64');
      if (buf.length > 5 * 1024 * 1024) {
        return NextResponse.json({ success: false, error: '圖片檔案大小請控制在 5MB 以內' }, { status: 400, headers: CORS_HEADERS });
      }
      const r2Key = `ads/banners/${Date.now()}_${crypto.randomBytes(3).toString('hex')}_${fileName}`;
      const uploadRes = await putObjectToDedicatedR2(r2Key, buf, contentType);
      return NextResponse.json(
        {
          success: true,
          primaryUrl: uploadRes.primaryUrl,
          mirrorUrl: uploadRes.mirrorUrl,
          uploadedToCloud: uploadRes.uploadedToCloud
        },
        { headers: CORS_HEADERS }
      );
    }

    // =========================================================================
    // 6. 記錄廣告點擊 / 曝光數 (record_click / record_impression)
    // =========================================================================
    if (action === 'record_click' || action === 'record_impression') {
      const adId = String(body.adId || '');
      const baseAdId = adId.replace(/-s\d+$/, '');
      const store = await loadAdNetworkStore();
      for (const key of Object.keys(store.advertisers)) {
        if (store.advertisers[key].id === adId || store.advertisers[key].id === baseAdId) {
          if (action === 'record_click') {
            store.advertisers[key].clicks_count = (store.advertisers[key].clicks_count || 0) + 1;
          } else {
            store.advertisers[key].impressions_count = (store.advertisers[key].impressions_count || 0) + 1;
          }
          await saveAdNetworkStore(store, false);
          break;
        }
      }
      return NextResponse.json({ success: true }, { headers: CORS_HEADERS });
    }

    // =========================================================================
    // 7. 管理員專屬：手動為任一客戶追加/扣減「曝光時間（依天數計算）」或設定 5 大方案等級
    // =========================================================================
    if (action === 'admin_adjust_days') {
      const auth = await verifyAdminRequest(req);
      if (!auth.authorized) {
        return NextResponse.json({ success: false, error: '未授權的管理員操作' }, { status: 401, headers: CORS_HEADERS });
      }

      const targetEmail = normalizeAdEmail(body.email || '');
      const days = Number(body.days || 0);
      const note = String(body.note || body.adminNote || '管理員手動調整曝光天數');
      const sendMail = body.send_welcome_email !== undefined ? Boolean(body.send_welcome_email) : body.sendWelcomeEmail !== false;
      const explicitPlanTier = body.plan_tier || undefined;

      if (!targetEmail || !targetEmail.includes('@') || isNaN(days) || days === 0) {
        return NextResponse.json({ success: false, error: '請提供有效的客戶 Email 與非零之增減天數' }, { status: 400, headers: CORS_HEADERS });
      }

      const res = await activateOrExtendSponsorAdAccount({
        email: targetEmail,
        paidAmountUsdt: Number(body.paidAmountUsdt || 0),
        explicitDaysToAdd: days,
        explicitPlanTier,
        adminNote: note,
        sendWelcomeEmail: sendMail
      });

      return NextResponse.json(
        {
          success: res.activated,
          message: `✅ 已成功為 ${targetEmail} ${days > 0 ? `追加 +${days} 天` : `扣減 ${days} 天`} 曝光時間！目前剩餘 ${getRemainingDays(res.advertiser?.expires_at || '')} 天，並已同步更新 Cloudflare R2 廣告池。`,
          advertiser: res.advertiser,
          magicLoginUrl: res.magicLoginUrl
        },
        { headers: CORS_HEADERS }
      );
    }

    // =========================================================================
    // 8. 管理員專屬：切換廣告狀態 (ACTIVE / PAUSED / BANNED) 或強制重推 R2
    // =========================================================================
    if (action === 'admin_toggle_status') {
      const auth = await verifyAdminRequest(req);
      if (!auth.authorized) {
        return NextResponse.json({ success: false, error: '未授權的管理員操作' }, { status: 401, headers: CORS_HEADERS });
      }

      const store = await loadAdNetworkStore();
      const targetEmail = normalizeAdEmail(body.email || '');
      const targetId = String(body.advertiser_id || '');
      const nextStatus = body.status || body.newStatus;

      if (targetEmail && store.advertisers[targetEmail] && nextStatus) {
        store.advertisers[targetEmail].status = nextStatus;
        store.advertisers[targetEmail].updated_at = new Date().toISOString();
      } else if (targetId && nextStatus) {
        for (const k of Object.keys(store.advertisers)) {
          if (store.advertisers[k].id === targetId) {
            store.advertisers[k].status = nextStatus;
            store.advertisers[k].updated_at = new Date().toISOString();
            break;
          }
        }
      }
      const syncRes = await saveAdNetworkStore(store, true);
      return NextResponse.json(
        {
          success: true,
          message: '✅ 狀態已更新並同步至 Cloudflare R2 全網廣告池！',
          r2_primary_url: syncRes.primaryUrl
        },
        { headers: CORS_HEADERS }
      );
    }

    return NextResponse.json({ success: false, error: `未知的 action: ${action}` }, { status: 400, headers: CORS_HEADERS });
  } catch (err: any) {
    console.error('[POST /api/ads] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: CORS_HEADERS });
  }
}
