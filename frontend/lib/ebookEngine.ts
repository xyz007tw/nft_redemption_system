// 全球電子書加盟商 SaaS 與自動模版引擎核心庫 (Zero-Regression Sandbox Module)

export type EBookLangPair = 'ZH_EN' | 'JA_EN' | 'ZH_JA';

export interface EBookChapter {
  id: string;
  title_zh: string;
  title_en: string;
  title_ja?: string;
  content_zh: string;
  content_en: string;
  content_ja?: string;
  image_url?: string;            // 支援章節配圖 (AI自動製圖或上傳)
  image_caption?: string;        // 配圖圖說 (中英雙語/日英/中日)
  references?: Array<{          // 專業來源引用 / 查證參照 (Citations & Sources)
    title: string;
    url?: string;
  }>;
}

export interface EBookProject {
  id: string;
  author_wallet: string;
  author_name: string;
  author_email: string;
  author_cta_url: string;
  author_line_id: string;
  title_zh: string;
  title_en: string;
  title_ja?: string;
  subtitle_zh: string;
  subtitle_en: string;
  subtitle_ja?: string;
  lang_pair?: EBookLangPair;     // 支援自選語系對：'ZH_EN' 繁中/英 ｜ 'JA_EN' 日/英 ｜ 'ZH_JA' 繁中/日
  cover_image_url?: string;      // 支援封面圖片上傳至專用 R2
  r2_published_urls?: {          // 專用 R2 儲存槽 (1.5208.uk / pub-2006e181b8544782b8d026affdaa34ab.r2.dev) 已發布之電子書網址
    primary_url: string;
    mirror_url: string;
    uploaded_at: string;
  };
  theme_id: 'tech_blue' | 'royal_gold' | 'minimal_white';
  bilingual_mode: boolean;
  price_single_usdt: number;
  price_monthly_sub_usdt: number;
  chapters: EBookChapter[];
  status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED_PUBLISHED' | 'REJECTED_BANNED';
  edit_count?: number;           // 本書累計已修改次數 (含完稿後再修改)
  edit_quota_max?: number;       // 本書允許修改上限 (預設 30 次，之後每付 $30 修改費 +1 次)
  submitted_at?: string;
  reviewed_at?: string;
  review_note?: string;
  created_at: string;
  updated_at: string;
}

export interface FranchiseeProfile {
  wallet_address: string;
  email: string;
  plan_status: 'TRIAL' | 'ACTIVE_YEAR_1' | 'ACTIVE_RENEWED' | 'BANNED_NO_REFUND';
  agreed_terms_at?: string;
  book_quota_total: number;      // 首年 $990 預設 3 本，之後每加購 $360 +1 本
  book_created_count: number;
  fee_credit_balance: number;    // 首年 $990 倒抵金，次年續約 +$450 倒抵金 (100% 折抵 10% 平台服務費)
  total_sales_usdt: number;
  payout_wallet?: string;        // 加盟商指定 Polygon USDT 提現收款錢包地址
  payout_bank?: string;          // 加盟商指定銀行或戶名/PayPal 收款資訊
  payout_requested_usdt?: number;// 待出金/結算金額
  ai_traffic_enabled: boolean;
  expires_at: string;
}

// 全球 10 大禁書與 4 大違規方式常數定義 (供前端新區塊、結帳強制切結視窗、工作台與管理後台共用)
export const GLOBAL_BANNED_BOOK_CATEGORIES = [
  {
    id: 1,
    icon: '🔞',
    title_zh: '1. 色情、猥褻與未成年不當內容（零容忍紅線）',
    title_en: '1. Pornography, Obscenity & CSAM (Zero Tolerance)',
    desc_zh: '嚴禁任何涉及兒童或未成年人之性暗示與剝削內容、露骨色情寫真、成人 AV 劇本、性暴力、偷拍或非自願性行為描寫。',
    desc_en: 'Strictly no child sexual exploitation/abuse (CSAM), explicit pornography, non-consensual sexual content, or sexual violence.'
  },
  {
    id: 2,
    icon: '💣',
    title_zh: '2. 恐怖主義、暴力犯罪與危險武器製造',
    title_en: '2. Terrorism, Violent Crime & Weapon Manufacturing',
    desc_zh: '嚴禁宣揚恐怖組織、極端邪教，或指導製造炸彈、槍枝改造、3D 列印武器、毒藥合成、迷姦藥水與駭客勒索病毒教學。',
    desc_en: 'No promotion of terrorism, cults, bomb/weapon making, poison synthesis, or ransomware hacking tutorials.'
  },
  {
    id: 3,
    icon: '💊',
    title_zh: '3. 毒品、違禁藥品與非法走私指南',
    title_en: '3. Illicit Drugs, Contraband & Smuggling Guides',
    desc_zh: '嚴禁教導種植或提煉各級毒品（如大麻、冰毒、依托咪酯喪屍煙彈等）、管制處方藥非法買賣及暗網交易教學。',
    desc_en: 'No guides on cultivating/manufacturing illegal drugs, trading controlled substances, or darknet trafficking.'
  },
  {
    id: 4,
    icon: '🎰',
    title_zh: '4. 非法賭博、電信詐騙話術與洗錢教學',
    title_en: '4. Illegal Gambling, Telecom Fraud & Money Laundering',
    desc_zh: '嚴禁上架殺豬盤詐騙劇本、電信詐欺 SOP、地下博弈網站導流、地下匯兌、人頭帳戶買賣或洗錢逃稅實操手冊。',
    desc_en: 'No pig-butchering scam scripts, telecom fraud SOPs, illegal gambling promotion, or money laundering manuals.'
  },
  {
    id: 5,
    icon: '📈',
    title_zh: '5. 非法金融吸金、保證獲利與傳銷資金盤',
    title_en: '5. Illegal Fundraising, Guaranteed Returns & Ponzi Schemes',
    desc_zh: '嚴禁未持牌卻宣稱「100% 穩賺不賠、保證翻倍、代客操盤」之非法集資、龐氏騙局或空氣幣資金盤招募手冊。',
    desc_en: 'No unlicensed investment solicitation claiming guaranteed profits, Ponzi schemes, or fraudulent money games.'
  },
  {
    id: 6,
    icon: '🏥',
    title_zh: '6. 誇大醫療療效、偽科學與危害生命之偏方',
    title_en: '6. Fraudulent Medical Claims & Harmful Pseudoscience',
    desc_zh: '嚴禁宣稱食品或偏方能「免就醫治癒癌症/重症」、鼓吹停用正規醫療藥物，或指導自殘、自殺之內容。',
    desc_en: 'No false claims of curing terminal illnesses without medicine, anti-medical advice, or self-harm/suicide guides.'
  },
  {
    id: 7,
    icon: '🏴‍☠️',
    title_zh: '7. 盜版侵權、抄襲洗稿與軟體破解外掛',
    title_en: '7. Piracy, Copyright Infringement & Cracked Software',
    desc_zh: '嚴禁直接盜用他人已出版之書籍、漫畫、小說，或未經授權冒用名人肖像/商標出書，以及散播盜版軟體序號與遊戲外掛。',
    desc_en: 'No plagiarized/pirated books, unauthorized celebrity impersonation, or cracked software/game cheats.'
  },
  {
    id: 8,
    icon: '🕵️‍♂️',
    title_zh: '8. 侵犯個人隱私、肉搜（Doxxing）與惡意誹謗',
    title_en: '8. Privacy Violation, Doxxing & Malicious Defamation',
    desc_zh: '嚴禁未經同意公開他人身分證號、住址、電話、私密照片、病歷，或針對特定個人與企業進行無根據之惡意抹黑敲詐。',
    desc_en: 'No doxxing of personal identifiable information, private photos, medical records, or malicious defamation/extortion.'
  },
  {
    id: 9,
    icon: '⚔️',
    title_zh: '9. 仇恨言論、種族歧視與煽動顛覆國家安全',
    title_en: '9. Hate Speech, Discrimination & National Security Threats',
    desc_zh: '嚴禁針對特定種族、宗教、性別或弱勢群體煽動仇恨暴力，或涉及跨國敏感政治顛覆與軍事機密洩露。',
    desc_en: 'No incitement of hatred/violence against protected groups, political subversion, or leaking classified secrets.'
  },
  {
    id: 10,
    icon: '🤖',
    title_zh: '10. 惡意木馬釣魚連結與詐欺性空殼垃圾書',
    title_en: '10. Phishing/Malware Links & Fraudulent Empty Spam Books',
    desc_zh: '嚴禁掛羊頭賣狗肉（審核後偷換違規內容）、在 QR Code 植入釣魚木馬網站，或以亂碼/空白頁湊數欺騙讀者付款。',
    desc_en: 'No post-review content cloaking, malware/phishing QR codes, or deceptive empty/gibberish spam books.'
  }
];

// 違禁詞快速安檢過濾器 (AI 雙重書審第一關)
const BANNED_KEYWORDS = [
  '迷姦', '冰毒', '海洛因', '大麻種植', '喪屍煙彈', '殺豬盤', '洗錢教學', '炸彈製作',
  '改造槍枝', '兒童色情', '蘿莉塔色情', '破解序號', '外掛下載', '穩賺不賠保證翻倍'
];

export function scanBannedContent(text: string): { passed: boolean; matchedKeyword?: string } {
  const normalized = (text || '').toLowerCase();
  for (const kw of BANNED_KEYWORDS) {
    if (normalized.includes(kw.toLowerCase())) {
      return { passed: false, matchedKeyword: kw };
    }
  }
  return { passed: true };
}

// 3 套商用級高顏值電子書美化模版定義
export const EBOOK_THEMES = {
  tech_blue: {
    id: 'tech_blue',
    name_zh: '🌌 現代科技藍（AI / 商業實戰首選）',
    name_en: '🌌 Modern Tech Blue (AI & Business)',
    primaryColor: '#0284c7',
    accentColor: '#38bdf8',
    bgGradient: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
    pageBg: '#ffffff',
    textColor: '#0f172a',
    calloutBg: '#f0f9ff',
    calloutBorder: '#0284c7'
  },
  royal_gold: {
    id: 'royal_gold',
    name_zh: '👑 典雅大師金（財商 / 心靈 / 傳記首選）',
    name_en: '👑 Royal Master Gold (Wealth & Mindset)',
    primaryColor: '#b45309',
    accentColor: '#f59e0b',
    bgGradient: 'linear-gradient(135deg, #1c1917 0%, #78350f 100%)',
    pageBg: '#fffbeb',
    textColor: '#1c1917',
    calloutBg: '#fef3c7',
    calloutBorder: '#d97706'
  },
  minimal_white: {
    id: 'minimal_white',
    name_zh: '🌿 極簡商務白（養生 / 教育 / 指南首選）',
    name_en: '🌿 Minimalist Emerald (Health & Education)',
    primaryColor: '#047857',
    accentColor: '#10b981',
    bgGradient: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
    pageBg: '#ffffff',
    textColor: '#111827',
    calloutBg: '#ecfdf5',
    calloutBorder: '#059669'
  }
};

export type EBookExportLangMode = 'BILINGUAL' | 'ZH_ONLY' | 'EN_ONLY' | 'JA_ONLY';

// 生成可獨立下載與列印為精美 PDF 的完整獨立電子書 HTML (支援多種語系版面模式：BILINGUAL 雙語對照版 / ZH_ONLY 純繁中 / EN_ONLY 純英文 / JA_ONLY 純日文)
export function generateStandaloneEBookHTML(
  book: EBookProject,
  buyerWatermark?: string,
  langMode?: EBookExportLangMode
): string {
  const effectiveMode: EBookExportLangMode =
    langMode || (book.bilingual_mode ? 'BILINGUAL' : 'ZH_ONLY');
  const langPair: EBookLangPair = book.lang_pair || 'ZH_EN';

  // 判斷主語系與次語系
  const isJaEn = langPair === 'JA_EN';
  const isZhJa = langPair === 'ZH_JA';

  const showPrimary =
    effectiveMode === 'BILINGUAL' ||
    (isJaEn ? effectiveMode === 'JA_ONLY' : effectiveMode === 'ZH_ONLY');
  const showSecondary =
    effectiveMode === 'BILINGUAL' ||
    (isZhJa ? effectiveMode === 'JA_ONLY' : effectiveMode === 'EN_ONLY');

  const theme = EBOOK_THEMES[book.theme_id] || EBOOK_THEMES.tech_blue;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(book.author_cta_url || 'https://aitutor.vip/waia')}`;

  const getPrimaryTitle = (ch: EBookChapter) =>
    isJaEn ? (ch.title_ja || ch.title_zh) : ch.title_zh;
  const getSecondaryTitle = (ch: EBookChapter) =>
    isZhJa ? (ch.title_ja || ch.title_en) : ch.title_en;

  const getPrimaryContent = (ch: EBookChapter) =>
    isJaEn ? (ch.content_ja || ch.content_zh) : ch.content_zh;
  const getSecondaryContent = (ch: EBookChapter) =>
    isZhJa ? (ch.content_ja || ch.content_en) : ch.content_en;

  const secondaryLabel = isZhJa
    ? 'JAPANESE EDITION (日本語版)'
    : 'ENGLISH EDITION';

  const tocHtml = book.chapters
    .map((ch, idx) => {
      const pTitle = getPrimaryTitle(ch);
      const sTitle = getSecondaryTitle(ch);
      const tocLabel =
        effectiveMode === 'EN_ONLY'
          ? sTitle || pTitle
          : effectiveMode === 'JA_ONLY'
          ? (ch.title_ja || pTitle)
          : effectiveMode === 'ZH_ONLY'
          ? ch.title_zh
          : `${pTitle}${sTitle ? ` / ${sTitle}` : ''}`;
      return `
      <li class="toc-item">
        <a href="#chapter-${idx + 1}">
          <span class="toc-num">Chapter 0${idx + 1}</span>
          <span class="toc-title">${tocLabel}</span>
        </a>
      </li>`;
    })
    .join('');

  const chaptersHtml = book.chapters
    .map(
      (ch, idx) => {
        const pTitle = getPrimaryTitle(ch);
        const sTitle = getSecondaryTitle(ch);
        const pContent = getPrimaryContent(ch);
        const sContent = getSecondaryContent(ch);

        return `
      <section class="chapter-page" id="chapter-${idx + 1}">
        <div class="chapter-header">
          <div class="chapter-badge">CHAPTER 0${idx + 1}</div>
          ${
            effectiveMode === 'EN_ONLY'
              ? `<h2 class="chapter-title-zh">${sTitle || pTitle}</h2>`
              : effectiveMode === 'JA_ONLY'
              ? `<h2 class="chapter-title-zh">${ch.title_ja || pTitle}</h2>`
              : `<h2 class="chapter-title-zh">${pTitle}</h2>
                 ${showSecondary && sTitle ? `<h3 class="chapter-title-en">${sTitle}</h3>` : ''}`
          }
        </div>
        <div class="chapter-body">
          ${
            ch.image_url
              ? `<div style="margin: 18px 0 24px 0; text-align: center;">
                   <img src="${ch.image_url}" alt="${pTitle}" style="max-width: 100%; max-height: 420px; border-radius: 12px; object-fit: cover; box-shadow: 0 8px 24px rgba(0,0,0,0.12); border: 1px solid rgba(0,0,0,0.08);" />
                   ${ch.image_caption ? `<div style="font-size: 12px; color: #64748b; margin-top: 8px; font-style: italic;">📷 ${ch.image_caption}</div>` : ''}
                 </div>`
              : ''
          }
          ${
            showPrimary
              ? `<div class="lang-block-zh">
                  ${(pContent || '')
                    .split('\n')
                    .filter(p => p.trim())
                    .map(p => `<p>${p}</p>`)
                    .join('')}
                </div>`
              : ''
          }
          ${
            showSecondary && (sContent || pContent)
              ? `<div class="${effectiveMode === 'EN_ONLY' || effectiveMode === 'JA_ONLY' ? 'lang-block-zh' : 'lang-block-en'}">
                  ${effectiveMode === 'BILINGUAL' ? `<div class="en-label">${secondaryLabel}</div>` : ''}
                  ${(sContent || pContent)
                    .split('\n')
                    .filter(p => p.trim())
                    .map(p => `<p>${p}</p>`)
                    .join('')}
                </div>`
              : ''
          }
          ${
            ch.references && ch.references.length > 0
              ? `<div style="margin-top: 24px; padding: 14px 18px; background: rgba(0,0,0,0.03); border-radius: 8px; border-left: 3px solid ${theme.primaryColor}; font-size: 12px; color: #64748b;">
                  <strong style="color: ${theme.primaryColor};">📚 資料來源與權威參照 (References & Citations)：</strong>
                  <ol style="margin: 6px 0 0 18px; padding: 0; line-height: 1.6;">
                    ${ch.references
                      .map(
                        r => `<li>${r.title}${r.url ? ` — <a href="${r.url}" target="_blank" rel="noopener noreferrer" style="color:${theme.primaryColor};text-decoration:underline;">[來源連結]</a>` : ''}</li>`
                      )
                      .join('')}
                  </ol>
                </div>`
              : ''
          }
        </div>
        <div class="page-footer">
          <span>${effectiveMode === 'EN_ONLY' ? `"${book.title_en || book.title_zh}" — by ${book.author_name}` : `《${isJaEn ? (book.title_ja || book.title_zh) : book.title_zh}》 — ${book.author_name} 著`}</span>
          <span>${effectiveMode === 'EN_ONLY' ? `Chapter ${idx + 1}` : `第 ${idx + 1} 章`} ${buyerWatermark ? `｜授權讀者：${buyerWatermark}` : ''}</span>
        </div>
      </section>`;
      }
    )
    .join('');

  const modeBadgeLabel =
    effectiveMode === 'BILINGUAL'
      ? isJaEn
        ? '🇯🇵/🇺🇸 日/英雙語對照版 (Japanese & English Edition)'
        : isZhJa
        ? '🇹🇼/🇯🇵 繁中/日雙語對照版 (Chinese & Japanese Edition)'
        : '🇹🇼/🇺🇸 中/英雙語對照版 (Bilingual Edition)'
      : effectiveMode === 'ZH_ONLY'
      ? '🇹🇼 純繁體中文版 (Traditional Chinese Edition)'
      : effectiveMode === 'JA_ONLY'
      ? '🇯🇵 純日文版 (Japanese Edition)'
      : '🇺🇸 純英文版 (English Edition)';

  return `<!DOCTYPE html>
<html lang="${effectiveMode === 'EN_ONLY' ? 'en' : 'zh-TW'}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${effectiveMode === 'EN_ONLY' ? book.title_en || book.title_zh : book.title_zh} - ${book.author_name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&display=swap');
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 0;
      font-family: 'Noto Sans TC', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #e2e8f0;
      color: ${theme.textColor};
      line-height: 1.8;
    }
    .toolbar-no-print {
      position: sticky;
      top: 0;
      z-index: 999;
      background: #0f172a;
      color: #fff;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    }
    .toolbar-btn {
      background: linear-gradient(90deg, #ec4899, #8b5cf6);
      color: #fff;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 700;
      cursor: pointer;
      font-size: 14px;
    }
    .book-container {
      max-width: 820px;
      margin: 24px auto;
    }
    .cover-page {
      background: ${theme.bgGradient};
      color: #ffffff;
      min-height: 1050px;
      padding: 80px 60px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border-radius: 12px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.25);
      margin-bottom: 32px;
      page-break-after: always;
      position: relative;
      overflow: hidden;
    }
    .cover-badge {
      display: inline-block;
      padding: 8px 18px;
      border: 1px solid rgba(255,255,255,0.35);
      border-radius: 999px;
      font-size: 13px;
      letter-spacing: 2px;
      text-transform: uppercase;
      background: rgba(255,255,255,0.1);
      width: fit-content;
    }
    .cover-title-zh {
      font-size: 46px;
      font-weight: 900;
      line-height: 1.25;
      margin: 30px 0 16px 0;
    }
    .cover-title-en {
      font-size: 24px;
      font-weight: 500;
      color: rgba(255,255,255,0.85);
      margin: 0 0 24px 0;
    }
    .cover-sub {
      font-size: 18px;
      color: rgba(255,255,255,0.75);
      border-left: 4px solid ${theme.accentColor};
      padding-left: 16px;
    }
    .cover-author-box {
      border-top: 1px solid rgba(255,255,255,0.2);
      padding-top: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .toc-page, .chapter-page, .cta-page {
      background: ${theme.pageBg};
      min-height: 1050px;
      padding: 70px 60px;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      margin-bottom: 32px;
      page-break-after: always;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .toc-list {
      list-style: none;
      padding: 0;
      margin: 32px 0;
    }
    .toc-item {
      border-bottom: 1px dashed #cbd5e1;
      padding: 16px 0;
    }
    .toc-item a {
      text-decoration: none;
      color: ${theme.textColor};
      display: flex;
      justify-content: space-between;
      font-weight: 700;
      font-size: 17px;
    }
    .toc-num {
      color: ${theme.primaryColor};
      font-family: monospace;
      margin-right: 16px;
    }
    .chapter-badge {
      color: ${theme.primaryColor};
      font-weight: 900;
      letter-spacing: 2px;
      font-size: 13px;
    }
    .chapter-title-zh {
      font-size: 30px;
      margin: 8px 0;
      color: ${theme.textColor};
    }
    .chapter-title-en {
      font-size: 18px;
      margin: 0 0 24px 0;
      color: #64748b;
      font-weight: 500;
    }
    .lang-block-zh p {
      font-size: 16.5px;
      margin-bottom: 18px;
      text-align: justify;
    }
    .lang-block-en {
      margin-top: 28px;
      padding: 24px;
      background: ${theme.calloutBg};
      border-left: 4px solid ${theme.calloutBorder};
      border-radius: 8px;
    }
    .en-label {
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 1.5px;
      color: ${theme.primaryColor};
      margin-bottom: 8px;
    }
    .lang-block-en p {
      font-size: 15px;
      color: #334155;
      margin-bottom: 14px;
    }
    .page-footer {
      margin-top: 40px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
      font-size: 12px;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
    }
    .cta-card {
      border: 2px solid ${theme.primaryColor};
      background: ${theme.calloutBg};
      border-radius: 16px;
      padding: 40px;
      text-align: center;
      margin: auto 0;
    }
    @media print {
      body { background: #fff; }
      .toolbar-no-print { display: none !important; }
      .book-container { max-width: 100%; margin: 0; }
      .cover-page, .toc-page, .chapter-page, .cta-page {
        box-shadow: none;
        border-radius: 0;
        margin: 0;
        min-height: 100vh;
      }
    }
  </style>
</head>
<body>
  <div class="toolbar-no-print">
    <div>
      <strong>📘 微享自動電子書模版引擎（${modeBadgeLabel}）</strong>
      <span style="margin-left:12px;font-size:13px;color:#94a3b8;">提示：點擊右側按鈕即可直接另存為印刷級高解析 PDF 檔案</span>
    </div>
    <button class="toolbar-btn" onclick="window.print()">🖨️ 一鍵匯出 / 列印為精裝 PDF</button>
  </div>

  <div class="book-container">
    <!-- 封面頁 -->
    <section class="cover-page">
      <div>
        <div class="cover-badge">WEIXIANG GLOBAL E-BOOK PUBLISHING · ${effectiveMode}</div>
        ${
          effectiveMode === 'EN_ONLY'
            ? `<h1 class="cover-title-zh">${book.title_en || book.title_zh}</h1>
               <p class="cover-sub">${book.subtitle_en || book.subtitle_zh}</p>`
            : effectiveMode === 'JA_ONLY'
            ? `<h1 class="cover-title-zh">${book.title_ja || book.title_zh}</h1>
               <p class="cover-sub">${book.subtitle_ja || book.subtitle_zh}</p>`
            : `<h1 class="cover-title-zh">${isJaEn ? (book.title_ja || book.title_zh) : book.title_zh}</h1>
               ${showSecondary && (isZhJa ? book.title_ja : book.title_en) ? `<h2 class="cover-title-en">${isZhJa ? book.title_ja : book.title_en}</h2>` : ''}
               <p class="cover-sub">${isJaEn ? (book.subtitle_ja || book.subtitle_zh) : book.subtitle_zh}${showSecondary && (isZhJa ? book.subtitle_ja : book.subtitle_en) ? `<br/>${isZhJa ? book.subtitle_ja : book.subtitle_en}` : ''}</p>`
        }
        ${
          book.cover_image_url
            ? `<div style="margin-top: 28px;">
                 <img src="${book.cover_image_url}" alt="Cover" style="max-width: 100%; max-height: 360px; border-radius: 12px; border: 2px solid rgba(255,255,255,0.25); object-fit: cover;" />
               </div>`
            : ''
        }
      </div>
      <div class="cover-author-box">
        <div>
          <div style="font-size:13px;opacity:0.7;">AUTHOR / 創作者</div>
          <div style="font-size:24px;font-weight:900;margin-top:4px;">${book.author_name}</div>
          <div style="font-size:13px;opacity:0.8;margin-top:4px;">Contact: ${book.author_email}</div>
        </div>
        <div style="text-align:right;font-size:12px;opacity:0.75;">
          <div>Powered by WeiXiang AI-ATM</div>
          <div>${new Date(book.created_at).toLocaleDateString()}</div>
        </div>
      </div>
    </section>

    <!-- 目錄頁 -->
    <section class="toc-page">
      <div>
        <div class="chapter-badge">TABLE OF CONTENTS</div>
        <h2 class="chapter-title-zh">全書章節目錄</h2>
        <ul class="toc-list">
          ${tocHtml}
        </ul>
      </div>
      <div class="page-footer">
        <span>《${book.title_zh}》 版權所有・翻印必究</span>
        <span>目錄頁</span>
      </div>
    </section>

    <!-- 各章節內容 -->
    ${chaptersHtml}

    <!-- 頁尾品牌導流與 CTO 諮詢專頁 -->
    <section class="cta-page">
      <div class="cta-card">
        <div class="chapter-badge">AUTHOR & SYSTEM CONNECTION</div>
        <h2 style="font-size:28px;margin:12px 0;">掃描專屬二維碼・與作者深度連結</h2>
        <p style="color:#475569;margin-bottom:24px;">感謝您閱讀《${book.title_zh}》，立即掃描下方 QR Code 獲取更多實戰資源與專屬諮詢：</p>
        <img src="${qrUrl}" alt="Author QR Code" style="width:200px;height:200px;border-radius:12px;border:4px solid #fff;box-shadow:0 10px 25px rgba(0,0,0,0.1);" />
        <div style="margin-top:20px;font-weight:700;font-size:16px;color:${theme.primaryColor};">
          👉 專屬導流網址：<a href="${book.author_cta_url}" target="_blank" style="color:${theme.primaryColor};">${book.author_cta_url}</a>
        </div>
        <div style="margin-top:8px;font-size:14px;color:#334155;">
          作者聯絡信箱：${book.author_email} ${book.author_line_id ? `｜ Line / 微信 ID：${book.author_line_id}` : ''}
        </div>
        <hr style="margin:28px 0;border:none;border-top:1px dashed #cbd5e1;" />
        <div style="font-size:13px;color:#475569;line-height:1.7;">
          <strong>🛠️ CTO-客服諮詢 (中文/英文雙語) : xyz007tw@gmail.com (Line/微信: xyz007tw)</strong><br/>
          <strong>** 请「總工程師」喝杯珍奶吧 ** 👉 <a href="https://aitutor.vip/waia" target="_blank">https://aitutor.vip/waia</a></strong>
        </div>
      </div>
      <!-- 內嵌母檔結構化 JSON，支援加盟商離線下載修改後一鍵重新上傳還原所有章節、圖片與雙語內容 (算 1 次修改額度) -->
      <script id="wx-ebook-project-data" type="application/json">${JSON.stringify(book).replace(/</g, '\\u003c')}</script>
      <div class="page-footer">
        <span>微享全球電子書自動交付 SaaS 系統編譯</span>
        <span>End of Book</span>
      </div>
    </section>
  </div>
</body>
</html>`;
}
