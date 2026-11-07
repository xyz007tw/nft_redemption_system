import nodemailer from 'nodemailer';

export const COURSE_NAMES: Record<number, string> = {
  100: '🏆 全套 10 門課 VIP 終身旗艦合輯（贈 2 枚微享 NFT 憑證）',
  101: '20年首席架構師 · AI-ATM 自動商業變現大師班',
  102: 'SaaS-AVME 3.0 雙引擎 · AI 短影音自動化大師手冊',
  103: 'WordPress 多語系 · 自動化 SEO 站群變現術',
  104: '24H 零人工看守 · AI Agent 智慧客服與 RAG 實戰',
  105: '25% 聯盟裂變與全球金流自動交付系統解密',
  106: '全球電子書自動交付與 100% 倒抵 SaaS 系統架構',
  107: 'LINE 貼圖 AI 批量生圖與全自動裁切上架實戰',
  108: 'LiveGood 智能協辦與 AI 協播自動化全案解密',
  109: '零成本獲客：AI 尋客 365 天全自動拓客實操指南',
  110: 'Web3 NFT 數位憑證與智能合約商務賦能大師手冊',
  9: '20年首席架構師 · AI-ATM 自動商業變現大師班',
  25: 'SaaS-AVME 3.0 雙引擎 · AI 短影音自動化大師手冊',
  30: 'WordPress 多語系 · 自動化 SEO 站群變現術',
  35: '24H 零人工看守 · AI Agent 智慧客服與 RAG 實戰',
  40: '25% 聯盟裂變與全球金流自動交付系統解密',
  45: '全球電子書自動交付與 100% 倒抵 SaaS 系統架構',
  50: 'LINE 貼圖 AI 批量生圖與全自動裁切上架實戰',
  55: 'LiveGood 智能協辦與 AI 協播自動化全案解密',
  60: '零成本獲客：AI 尋客 365 天全自動拓客實操指南',
  65: 'Web3 NFT 數位憑證與智能合約商務賦能大師手冊',
};

export const COURSE_ID_TO_PKG_ID: Record<number, number> = {
  9: 101,
  25: 102,
  30: 103,
  35: 104,
  40: 105,
  45: 106,
  50: 107,
  55: 108,
  60: 109,
  65: 110,
};

export function normalizeCoursePkgId(id: number): number {
  return COURSE_ID_TO_PKG_ID[id] || id;
}

export interface EnrollResult {
  success: boolean;
  magic_login_url: string;
  course_url: string;
  course_id: number;
  user_id?: number;
}

function escapeHtml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Call VIP Academy REST API to auto enroll student and obtain 1-click magic login URL
 */
export async function autoEnrollVipStudent(email: string, pkgId: number, txnId: string): Promise<EnrollResult> {
  try {
    const params = new URLSearchParams({
      email: email.toLowerCase().trim(),
      pkg_id: String(pkgId),
      txn_id: String(txnId)
    });

    const vipSecret = process.env.VIP_API_SECRET || 'vip_sec_2026_xyz007';
    const resp = await fetch('https://vip.5208.uk/wp-json/vip/v1/auto-enroll', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-vip-secret': vipSecret
      },
      body: params.toString(),
      signal: AbortSignal.timeout(15000)
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error(`[VIP Auto-Enroll] API returned status ${resp.status}:`, errText);
      return {
        success: false,
        magic_login_url: 'https://vip.5208.uk/dashboard/',
        course_url: 'https://vip.5208.uk',
        course_id: 0
      };
    }

    const data = await resp.json();
    return {
      success: true,
      magic_login_url: data.magic_login_url || 'https://vip.5208.uk/dashboard/',
      course_url: data.course_url || 'https://vip.5208.uk',
      course_id: data.course_id || 0,
      user_id: data.user_id
    };
  } catch (error) {
    console.error('[VIP Auto-Enroll] Network error calling VIP Academy API:', error);
    return {
      success: false,
      magic_login_url: 'https://vip.5208.uk/dashboard/',
      course_url: 'https://vip.5208.uk',
      course_id: 0
    };
  }
}

/**
 * Send branded welcome email containing 1-click magic classroom link and 4-language ebook links
 */
export async function sendVipCourseWelcomeEmail(options: {
  email: string;
  pkgId: number;
  txnId: string;
  magicLoginUrl: string;
  courseName?: string;
  priceUsdt?: number;
}): Promise<boolean> {
  const { email, pkgId, txnId, magicLoginUrl, priceUsdt = 39 } = options;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !email || !email.includes('@')) {
    console.warn('[VIP Email] Missing email configuration or invalid recipient:', email);
    return false;
  }

  const normalizedPkgId = normalizeCoursePkgId(pkgId);
  const rawTitle = options.courseName || COURSE_NAMES[normalizedPkgId] || COURSE_NAMES[pkgId] || `實戰專題 #${normalizedPkgId}`;
  const courseTitle = escapeHtml(rawTitle);
  const safeEmail = escapeHtml(email);
  const safeTxnId = escapeHtml(txnId);

  const downloadLinks = {
    zh_tw: `https://vip.5208.uk/wp-content/uploads/ebooks/material_${normalizedPkgId}_zh_tw.pdf`,
    zh_cn: `https://vip.5208.uk/wp-content/uploads/ebooks/material_${normalizedPkgId}_zh_cn.pdf`,
    en: `https://vip.5208.uk/wp-content/uploads/ebooks/material_${normalizedPkgId}_en.pdf`,
    ja: `https://vip.5208.uk/wp-content/uploads/ebooks/material_${normalizedPkgId}_ja.pdf`,
    code_zip: `https://vip.5208.uk/wp-content/uploads/ebooks/material_${normalizedPkgId}_source_code.zip`,
    interactive_html: `https://vip.5208.uk/wp-content/uploads/ebooks/material_${normalizedPkgId}/master_bilingual.html`
  };

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 680px; margin: 0 auto; padding: 32px 24px; border: 1px solid #e2e8f0; border-radius: 20px; background: #ffffff; color: #1e293b;">
      
      <!-- Header Banner -->
      <div style="text-align: center; margin-bottom: 28px; padding-bottom: 24px; border-bottom: 2px solid #f1f5f9;">
        <div style="display: inline-block; background: #ecfdf5; color: #059669; font-size: 13px; font-weight: 800; padding: 6px 14px; border-radius: 9999px; margin-bottom: 12px; letter-spacing: 0.5px;">
          ✦ VIP 創客實戰學院 · 正式學員權限開通 ✦
        </div>
        <h1 style="color: #0f172a; font-size: 24px; font-weight: 900; margin: 0 0 8px; line-height: 1.4;">
          🎉 恭喜您成功解鎖「${courseTitle}」！
        </h1>
        <p style="color: #64748b; font-size: 14px; margin: 0;">
          款項已確認完訖（$${priceUsdt} USDT/USD）· 您的專屬教室與 4 語系教材已全數備妥。
        </p>
      </div>

      <!-- 1-Click Classroom Entry Highlight Card -->
      <div style="background: linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%); border: 2px solid #3b82f6; border-radius: 16px; padding: 24px; margin-bottom: 28px; text-align: center;">
        <div style="font-size: 18px; font-weight: 800; color: #1e3a8a; margin-bottom: 8px;">
          🚀 免密碼一鍵進入學員專屬教室
        </div>
        <p style="font-size: 13px; color: #475569; margin: 0 0 18px; line-height: 1.6;">
          點擊下方專屬按鈕，系統將自動完成身分驗證並直接導向本門課程完整章節（含高清實戰解說與隨堂作業）：
        </p>
        <a href="${magicLoginUrl}" style="display: inline-block; padding: 16px 36px; background: linear-gradient(90deg, #2563eb, #0284c7); color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 900; font-size: 16px; box-shadow: 0 6px 20px rgba(37,99,235,0.35);">
          👉 點擊立即進入「${courseTitle}」教室開始學習
        </a>
        <div style="font-size: 11px; color: #94a3b8; margin-top: 10px;">
          （此專屬安全登入連結有效期限為 30 天，請妥善保存）
        </div>
      </div>

      <!-- 4-Language Ebooks Download Grid -->
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 22px; margin-bottom: 28px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
          <h3 style="margin: 0; font-size: 16px; font-weight: 800; color: #0f172a;">
            📥 隨堂 4 國語言電子書與實戰資產包：
          </h3>
          <span style="font-size: 11px; background: #e0f2fe; color: #0369a1; padding: 3px 8px; border-radius: 6px; font-weight: bold;">
            永久無損下載
          </span>
        </div>
        <ul style="list-style: none; padding: 0; margin: 0; line-height: 2.2; font-size: 14px;">
          <li>🇹🇼 <a href="${downloadLinks.zh_tw}" style="color: #0284c7; text-decoration: none; font-weight: 700;">繁體中文版實戰手冊 (PDF) 下載 ➔</a></li>
          <li>🇨🇳 <a href="${downloadLinks.zh_cn}" style="color: #0284c7; text-decoration: none; font-weight: 700;">简体中文版实战手册 (PDF) 下载 ➔</a></li>
          <li>🇺🇸 <a href="${downloadLinks.en}" style="color: #0284c7; text-decoration: none; font-weight: 700;">English Master Edition (PDF) Download ➔</a></li>
          <li>🇯🇵 <a href="${downloadLinks.ja}" style="color: #0284c7; text-decoration: none; font-weight: 700;">日本語版マスターハンドブック (PDF) ダウンロード ➔</a></li>
          <li>💻 <a href="${downloadLinks.code_zip}" style="color: #7c3aed; text-decoration: none; font-weight: 700;">實戰源碼與 Prompt 完整資產包 (.zip) ➔</a></li>
          <li>🌐 <a href="${downloadLinks.interactive_html}" style="color: #059669; text-decoration: none; font-weight: 700;">在線雙語互動閱讀器 (R2 高速快取) ➔</a></li>
        </ul>
      </div>

      <!-- Platform Info & Account Credentials -->
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px; margin-bottom: 24px; font-size: 13px; color: #475569; line-height: 1.8;">
        <h4 style="margin: 0 0 10px; font-size: 14px; color: #1e293b; font-weight: 800;">
          🏫 VIP 家教商學院平台服務指引：
        </h4>
        <div>• <strong>學員信箱</strong>：${safeEmail}</div>
        <div>• <strong>學院官方網址</strong>：<a href="https://vip.5208.uk" style="color: #2563eb;">https://vip.5208.uk</a></div>
        <div>• <strong>學員後台 (Dashboard)</strong>：<a href="https://vip.5208.uk/dashboard/" style="color: #2563eb;">https://vip.5208.uk/dashboard/</a></div>
        <div>• <strong>25% 聯盟分潤後台</strong>：<a href="https://nft1314.party/dashboard" style="color: #2563eb;">https://nft1314.party/dashboard</a></div>
        <div>• <strong>交易序號 (Txn ID)</strong>：${safeTxnId}</div>
      </div>

      <!-- 20-Year Chief Architect Footer -->
      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; line-height: 1.7;">
        <div>20 年首席架構師親授 · VIP 創客實戰學院 · AI-ATM 自動商業變現系統</div>
        <div>24H AI 客服全天候待命 · 技術諮詢總窗口：CTO SEN (Email: xyz007tw@gmail.com / LINE: xyz007tw)</div>
      </div>

    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"VIP 創客實戰學院" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🎓【VIP 創客實戰學院】課程開通通知：您已成功解鎖「${courseTitle}」！`,
      html: mailHtml
    });
    console.log(`[VIP Email] Welcome email successfully sent to ${email} for pkg ${pkgId}`);
    return true;
  } catch (err) {
    console.error(`[VIP Email] Error sending welcome email to ${email}:`, err);
    return false;
  }
}
