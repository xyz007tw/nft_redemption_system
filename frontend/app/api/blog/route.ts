import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { GoogleGenAI } from '@google/genai';
import { BLOG_CATEGORIES, BlogCategoryId, BlogPost } from '@/lib/blogEngine';
import { loadAllBlogPosts, saveDailyBlogPost } from '@/lib/blogStore';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// 嚴格遵守 GEMINI.md 規範：唯一指定最高 CP 值模型序列，嚴禁使用 3.X 推理模型
const BLOG_CP_MODEL_CHAIN = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash',
];

async function generateBlogWithModelPatrol(prompt: string) {
  let lastErr: any;
  for (const model of BLOG_CP_MODEL_CHAIN) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          temperature: 0.75,
          responseMimeType: 'application/json',
        },
      });
      return { text: response.text || '{}', usedModel: model };
    } catch (err: any) {
      lastErr = err;
      console.warn(`[Blog AI Patrol] Model ${model} failed, switching to next:`, err?.message);
    }
  }
  throw lastErr;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const slug = searchParams.get('slug');

    const allPosts = await loadAllBlogPosts();

    if (slug) {
      const found = allPosts.find((p) => p.slug === slug);
      return NextResponse.json({
        success: Boolean(found),
        post: found || null,
      });
    }

    const filtered =
      category && category !== 'all'
        ? allPosts.filter((p) => p.category_id === category)
        : allPosts;

    return NextResponse.json({
      success: true,
      total: filtered.length,
      categories: BLOG_CATEGORIES,
      posts: filtered,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to load blog posts' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    // 1. 直接由每日自動化指令 (publish_official_blog_seo.py) 推送新生成的類部落客 SEO 文章
    if (action === 'publish_post') {
      const post: BlogPost = body.post;
      if (!post || !post.slug || !post.title_zh || !Array.isArray(post.sections)) {
        return NextResponse.json(
          { success: false, error: 'Missing required blog post fields (slug, title_zh, sections)' },
          { status: 400 }
        );
      }

      const updatedPosts = await saveDailyBlogPost(post);
      return NextResponse.json({
        success: true,
        message: `Published SEO blogger post: ${post.slug}`,
        post,
        total_posts: updatedPosts.length,
      });
    }

    // 2. 雲端一鍵自動輪替生成今日「類部落客 SEO 文章」
    if (action === 'auto_generate_daily') {
      const existingPosts = await loadAllBlogPosts();
      const validCategories = BLOG_CATEGORIES.filter((c) => c.id !== 'all');
      const requestedCategory = body.category_id as BlogCategoryId | undefined;
      const chosenCategory =
        validCategories.find((c) => c.id === requestedCategory) ||
        validCategories[existingPosts.length % validCategories.length];

      const todayStr = new Date().toISOString().slice(0, 10);
      const existingTitles = existingPosts.slice(0, 20).map((p) => p.title_zh).join('；');

      const prompt = `你是一位國際頂尖 SEO 行銷專家與極具親和力的「斜槓創客部落客」。
請針對微享 AI 官網 (https://nft1314.party/) 的核心項目：【${chosenCategory.name_zh}】，撰寫一篇全新的「類部落客實戰心得/開箱教學文章」。

【受眾與語氣規範】：
- 目標讀者：網路小白、下班後的創客素人、想在睡覺時也有持續被動收入的斜槓族。
- 嚴禁用生硬冰冷的「SaaS」等工程術語，一律改用「知識自動販賣機 AI-ATM」、「24小時不休息的 AI 員工」、「數位高鐵」等生動比喻。
- 必須避免與以下歷史文章標題重複：${existingTitles}

【微享官網 7 大核心項目精準知識（請依主題自然融入）】：
1. 🏪 知識自動販賣機 AI-ATM (/#author-coop)：首年 $990 含 3 本雙語精裝書開發額度 + Google 4 旗艦 25+頁圖文引擎 + 30次免費修改 + AI自動來客打廣告；首年 $990 與次年 $450 皆享「先收費、後 100% 倒抵交易 10% 平台服務費」零風險保障。
2. 👑 總工程師 20 年資歷 · AI-ATM 客製接案 (/#video-shoppable-service?tab=architecture)：三軌流量引擎（軌道一 AI 短影音衝刺 + 軌道二 WP-SEO 長跑 + 軌道三 25% 人推人脈複利），將尋客、24H AI 客服接洽、自動收款發貨全閉環封裝。聯絡總窗口 CTO SEN (LINE/微信: xyz007tw, Email: xyz007tw@gmail.com)。
3. 🎓 AI 頂配家教實戰教材 (/#tutor-courses)：支援信用卡/USDT 結帳後秒級解鎖下載、自動發信與「一鍵轉發親友 Email」，成交納入 25% 聯盟分潤。
4. 📚 VIP 全球多語系電子書櫃 (/#featured-ebooks)：支援 6 語系無縫切換、R2 高速防盜版閱讀器、免費試閱第一章，單本買斷 $39 或 VIP 月閱 $15。
5. 🛒 AI 影片導購 ($300起) & LiveGood 協播 ($139.95/$180) & AI 尋客 365 天免錢 ($660 USD) (/#video-shoppable-service)。
6. 💰 25% 聯盟分潤體系 (/dashboard)：10% 級差（>$600~$6,000 為 3%、>$6,000~$15,000 為 6%、>$15,000 為 10%）+ 10% 對等 100% 匹配 + 5% 全球領袖分紅。自消費（含斗內 $3 + 加盟 $990 = $993 即升 3% 級差）100% 併入級差升等資格累積業績！自然流量無推薦碼訪客下單亦自動綁定最高 10% 領袖撥足 25%。
7. 💎 斗內贊助解鎖 25% 流水 (/sponsor) 與 Web3 萬人算力眾籌 ($150~$12,000)。

請輸出嚴格符合以下結構的 JSON 物件（不要加上 markdown code block）：
{
  "slug": "英文小寫連字號SEO網址含日期例如-${chosenCategory.id}-${todayStr}",
  "category_id": "${chosenCategory.id}",
  "badge_zh": "${chosenCategory.icon} 斜槓實戰專欄",
  "badge_en": "${chosenCategory.icon} Side-Hustle Blogger Review",
  "title_zh": "極具吸引力的部落客開箱標題（30~48字，含核心SEO關鍵字）",
  "title_en": "Engaging English SEO Title",
  "subtitle_zh": "點出痛點與具體數字亮點的副標題（40~65字）",
  "subtitle_en": "Compelling English subtitle",
  "excerpt_zh": "100~140字的摘要，適合顯示於列表與 Google Meta Description",
  "excerpt_en": "Concise English meta description",
  "author_name": "斜槓創客阿凱 × 總工程師 SEN 筆記",
  "author_role_zh": "下班創客實戰家 · AI-ATM 觀察專欄",
  "author_avatar": "${chosenCategory.icon}",
  "published_at": "${todayStr}",
  "read_minutes": 6,
  "cover_image": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  "seo_keywords": ["關鍵字1", "關鍵字2", "關鍵字3", "關鍵字4", "關鍵字5"],
  "target_section_href": "${chosenCategory.target_href}",
  "target_cta_text_zh": "${chosenCategory.icon} 立即前往官網體驗【${chosenCategory.name_zh}】",
  "target_cta_text_en": "${chosenCategory.icon} Explore ${chosenCategory.name_en} Now",
  "sections": [
    {
      "heading": "一、段落小標題（帶入上班族/小白真實痛點）",
      "body": "250~350字深入淺出的第一人稱部落客敘事，分段請用 \\n\\n",
      "highlight_tip": "💡 小白秒懂金句：一句話點破核心價值"
    },
    {
      "heading": "二、段落小標題（實測開箱與核心機制拆解）",
      "body": "250~350字具體優勢與流程說明"
    },
    {
      "heading": "三、段落小標題（算盤打一下：零風險倒抵與 25% 分潤複利）",
      "body": "250~350字投資回報與睡後收入分析",
      "highlight_tip": "🔥 實戰秘訣：具體操作建議"
    }
  ],
  "faqs": [
    { "q": "常見問題1？", "a": "清楚詳盡的解答1" },
    { "q": "常見問題2？", "a": "清楚詳盡的解答2" }
  ]
}`;

      const { text, usedModel } = await generateBlogWithModelPatrol(prompt);
      const generatedPost: BlogPost = JSON.parse(text);
      const updatedPosts = await saveDailyBlogPost(generatedPost);

      return NextResponse.json({
        success: true,
        usedModel,
        post: generatedPost,
        total_posts: updatedPosts.length,
      });
    }

    return NextResponse.json({ success: false, error: 'Unsupported action' }, { status: 400 });
  } catch (err: any) {
    console.error('[/api/blog POST Error]:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
