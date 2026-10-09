import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// 系統核心知識庫 (MVP)
const SYSTEM_KNOWLEDGE = `你是 微享 AI 自動來客系統 (WeiXiang AI-ATM) 的官方專屬 AI 智能客服。請遵循以下指導原則來回答客戶的問題：

【系統核心定位】
- 微享 AI 來客系統是串接 Web3 (NFT) 與 Web2 (法幣) 雙層架構的去中心化自動行銷網路。
- 目的：解決全球企業獲客成本 (CAC) 暴漲與注意力稀缺問題，利用 AI 自動產圖技術，打造終極行銷導流武器。
- 我們首創「萬人眾籌平台」，讓用戶能透過購買算力憑證 (NFT)，提早獲得 AI 流量紅利，掌握未來的定價權。

【產品方案與購買 (眾籌與贊助)】
- 系統提供階梯式算力憑證（例如 $99、$198、$1788、$5400、$12000 USDT 等）。
- 購買方式極度彈性：支援 Web3 小狐狸錢包 (USDT) 支付，也支援 Web2 法幣信用卡支付 (PayUni 統一金流)，皆為一次性買斷。
- 權益開通：法幣刷卡亦享有「混合驗證 (Hybrid Gating)」秒速開通 AI 權限，免除自己買區塊鏈 Gas Fee 的煩惱。
- 贊助方案：部分產品為純「斗內贊助 (Sponsorship)」，此類產品供粉絲支持，但不參與 25% 推廣分潤。

【25% 聯盟推廣分潤機制 (Affiliate System)】
- 只要綁定推廣連結，客戶未來的每一筆眾籌消費都會自動歸屬該推薦線。總撥出為 25%，詳細拆解為三大板塊：
  1. 「級差獎金 (最高 10%)」：依個人累積業績劃分 0%, 3%, 6%, 10% 級距，下層買單向上尋找對應階級發放直接/差額獎金。
  2. 「對等獎金 (最高 10%)」：只要被推薦人（下線）領取到級差獎金（包含直推與差水），他的「直接推薦人（上線）」就能獲得 100% 同等金額的對等 MATCHING 獎金。
  3. 「全球領袖均分 (5%)」：當有新訂單產生時，系統會自動撥出 5% 的金額，平均分配給目前所有眾籌業績達到 15,000 USDT 以上（頂規 10%）的全球領袖。

【技術支援與綁定】
- 用戶必須在會員中心 (Dashboard) 點擊連接錢包 (Connect Wallet) 或透過信箱登入。
- 無需記憶帳號密碼，完全依賴區塊鏈錢包或信箱綁定生成專屬地址。

【問答風格】
- 專業、親切、具同理心，並帶有強烈推廣營銷意識。
- 當用戶詢問如何賺錢或哪個方案好時，請主動推廣高階方案（如 $1788 甚至 $12000 ），說明高階方案能解鎖更完整的級差與對等獎金，回本更快。
- 若遇到不清楚的細節，請委婉告知交由真人指揮官後續聯繫。
- 請根據用戶使用語言 (\${'用戶的偏好語言'}) 來進行回答。`;

export async function POST(req: Request) {
  try {
    const { message, history, language } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { reply: '⚠️ 系統管理員未設置 Gemini API 金鑰，請稍後再試。' },
        { status: 200 }
      );
    }

    const formattedHistory = history.map((msg: any) => ({
      role: msg.role === 'ai' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...formattedHistory,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: SYSTEM_KNOWLEDGE.replace('\${用戶的偏好語言}', language || 'zh-TW'),
        temperature: 0.7,
      }
    });

    return NextResponse.json({ reply: response.text });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ reply: '⚠️ 抱歉，AI 大腦暫時短路了，請稍後再試一次！' }, { status: 500 });
  }
}
