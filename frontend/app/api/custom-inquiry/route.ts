import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

interface CustomInquiryPayload {
  name: string;
  contactChannel: 'email' | 'line' | 'wechat' | 'other';
  contactValue: string;
  projectType: string;
  budgetRange: string;
  requirement: string;
  language?: string;
}

const LOCAL_INQUIRIES_PATH = path.join(process.cwd(), 'data', 'custom_inquiries.json');

function saveInquiryLocally(record: any) {
  try {
    const dir = path.dirname(LOCAL_INQUIRIES_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    let records: any[] = [];
    if (fs.existsSync(LOCAL_INQUIRIES_PATH)) {
      records = JSON.parse(fs.readFileSync(LOCAL_INQUIRIES_PATH, 'utf8'));
    }
    records.unshift(record);
    fs.writeFileSync(LOCAL_INQUIRIES_PATH, JSON.stringify(records, null, 2), 'utf8');
  } catch (err) {
    console.warn('[Custom Inquiry] Local file save skipped:', err);
  }
}

export async function POST(req: Request) {
  try {
    const body: CustomInquiryPayload = await req.json();
    const { name, contactChannel, contactValue, projectType, budgetRange, requirement, language } = body;

    if (!name || !contactValue || !requirement) {
      return NextResponse.json(
        { success: false, error: '請完整填寫姓名稱呼、聯絡帳號及需求描述 (Missing required fields)' },
        { status: 400 }
      );
    }

    const newRecord = {
      id: `INQ-${Date.now()}`,
      name: name.trim(),
      contactChannel: contactChannel || 'email',
      contactValue: contactValue.trim(),
      projectType: projectType || 'AI-ATM 自動化商業變現系統',
      budgetRange: budgetRange || '面議 / 諮詢規劃',
      requirement: requirement.trim(),
      language: language || 'zh-TW',
      createdAt: new Date().toISOString(),
      status: 'NEW_SUBMISSION'
    };

    saveInquiryLocally(newRecord);

    // 發送即時電郵通知總工程師 SEN (xyz007tw@gmail.com) 並副本 qqww0614@gmail.com
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const adminToList = Array.from(
          new Set(['xyz007tw@gmail.com', process.env.ADMIN_EMAIL, process.env.EMAIL_USER].filter(Boolean))
        ).join(', ');

        await transporter.sendMail({
          from: `"WeiXiang AI 客製接案中心" <${process.env.EMAIL_USER}>`,
          to: adminToList,
          cc: 'qqww0614@gmail.com',
          subject: `🔥【AI客製接案需求】來自 ${newRecord.name} 的專案委託需求單 (${newRecord.projectType})`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 650px; margin: 0 auto; padding: 24px; border: 2px solid #0284c7; border-radius: 16px; background: #ffffff;">
              <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 18px 24px; border-radius: 12px; margin-bottom: 20px; color: #ffffff;">
                <span style="font-size: 11px; font-weight: bold; color: #38bdf8; text-transform: uppercase; letter-spacing: 1px;">20年首席架構師 · AI-ATM 客製化專案中心</span>
                <h2 style="margin: 6px 0 0 0; font-size: 20px; color: #ffffff;">⚡ 收到訪客線上提交「AI 架構系統客製接案」需求單！</h2>
              </div>

              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b; width: 140px; font-weight: bold;">客戶稱呼 / 單位</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #0f172a;">${newRecord.name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-weight: bold;">聯絡管道</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #0284c7;">
                    ${newRecord.contactChannel.toUpperCase()}：${newRecord.contactValue}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-weight: bold;">欲委託專案類型</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #8b5cf6;">${newRecord.projectType}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-weight: bold;">預估預算區間</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #059669;">${newRecord.budgetRange}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-weight: bold;">提交時間 / 語系</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #475569;">
                    ${new Date(newRecord.createdAt).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })} (${newRecord.language})
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px; color: #64748b; font-weight: bold; vertical-align: top;">系統需求與痛點描述</td>
                  <td style="padding: 10px; color: #1e293b; background: #f8fafc; border-radius: 8px; white-space: pre-wrap; font-family: monospace; font-size: 13px; line-height: 1.6;">${newRecord.requirement}</td>
                </tr>
              </table>

              <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 12px; padding: 14px; text-align: center; color: #166534; font-size: 13px; font-weight: bold;">
                請總工程師 SEN 於 24 小時內透過上方留下的聯絡方式（${newRecord.contactChannel}: ${newRecord.contactValue}）直接回覆客戶並啟動技術評估。
              </div>
            </div>
          `,
        });
        console.log(`[Custom Inquiry] Email successfully dispatched for ${newRecord.name}`);
      } catch (emailErr) {
        console.error('[Custom Inquiry Email Dispatch Error]:', emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      inquiryId: newRecord.id,
      message: '✅ 您的客製化需求單已成功提交至總工程師 SEN！我們將認真評估並在 24 小時內與您聯繫，您亦可直接加 LINE 或微信 (ID: xyz007tw) 加速對接！'
    });
  } catch (err: any) {
    console.error('[Custom Inquiry API Error]:', err);
    return NextResponse.json(
      { success: false, error: err.message || '需求單提交失敗，請稍後再試或直接聯繫信箱 xyz007tw@gmail.com' },
      { status: 500 }
    );
  }
}
