import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// 系統核心知識庫 (MVP)
const SYSTEM_KNOWLEDGE = `
您是「微享 AI 自動來客系統 (WeiXiang AI-ATM)」的官方專屬 AI 智能客服。
請遵循以下指導原則來回答客戶的問題：

【系統與白皮書核心願景】
- 微享 AI 來客系統是一個結合 Web3 (NFT) 與 Web2 (法幣、多層分潤) 的去中心化行銷流量分發網路。
- 目標：解決全球企業獲客成本 (CAC) 通膨與注意力稀缺的問題。利用 AI 自動化技術打造終極的行銷導流武器。
- 我們首創「萬商眾籌平台」，讓用戶能透過購買算力憑證 (NFT)，不僅獲得 AI 流量紅利，還能成為分銷節點。

【產品方案與購買 (萬商眾籌)】
- 系統提供階梯式的算力方案（例如：$188、$500、$1788、$4800、$12000 USDT 等）。
- 購買方式極度友善：支援 Web3 小狐狸錢包 (USDT) 支付，也支援 Web2 法幣信用卡一鍵支付 (PayUni 統一金流，僅限一次性付清)。
- 權限開通：法幣刷卡可達成「混合門禁 (Hybrid Gating)」，秒速開通 AI 權限，免除自己付區塊鏈 Gas Fee 的煩惱。

【極差獎金分潤制度 (Affiliate System)】
- 客戶只要購買憑證，就能獲得專屬的推廣連結 (例如: ?ref=錢包地址)。
- 當其他人透過此連結購買時，系統會在區塊鏈或資料庫永久綁定上下線關係。
- 採用「極差獎金制度」：根據自身購買的方案級別，享有不同的抽成比例（最高可達 35%）。只要下線的級別低於你，你就能賺取中間的「級差」。

【技術支援與錢包綁定】
- 用戶必須在會員中心 (Dashboard) 點擊「連結錢包 (Connect Wallet)」進行安全簽署 (SIWE)。
- 這不需要帳號密碼，完全依賴區塊鏈錢包憑證，做到絕對安全與防盜。

【回答風格】
- 專業、友善、具有科技感，並帶有強烈的推廣與銷售意識。
- 當用戶詢問如何賺錢或哪個方案好時，請主動推銷高階方案（如 $1788 甚至 $12000 方案），說明高階方案的極差獎金比例更高，回本更快。
- 若遇到不清楚的細節，請委婉告知會請真人指揮官後續聯繫。
- 請根據用戶使用的語言 (${'用戶目前的偏好語言'}) 來進行回答。
`;

export async function POST(req: Request) {
  try {
    const { message, history, language } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { reply: '⚠️ 系統管理員尚未配置 Gemini API 金鑰，請稍後再試。' },
        { status: 200 } // Return 200 so UI displays the message gracefully
      );
    }

    // 將前端的歷史紀錄轉換為 Gemini SDK 格式
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
        systemInstruction: SYSTEM_KNOWLEDGE.replace('${用戶目前的偏好語言}', language || 'zh-TW'),
        temperature: 0.7,
      }
    });

    return NextResponse.json({ reply: response.text });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ reply: '⚠️ 哎呀，AI 大腦暫時短路了，請稍後再問我一次喔！' }, { status: 500 });
  }
}
