import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { GoogleGenAI } from '@google/genai';
import { loadAllBlogPosts, saveDailyBlogPost } from '@/lib/blogStore';
import { BlogTranslationPackage } from '@/lib/blogEngine';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const BLOG_TRANSLATE_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash',
];

const LANG_NAMES: Record<string, string> = {
  'en-US': 'English',
  'ja-JP': 'Japanese (日本語)',
  'zh-CN': 'Simplified Chinese (简体中文)',
  'ko-KR': 'Korean (한국어)',
  'vi-VN': 'Vietnamese (Tiếng Việt)',
  'id-ID': 'Bahasa Indonesia',
  'zh-TW': 'Traditional Chinese (繁體中文)',
};

export async function POST(req: Request) {
  try {
    const { slug, target_lang } = await req.json();

    if (!slug || !target_lang) {
      return NextResponse.json({ success: false, error: 'Missing slug or target_lang' }, { status: 400 });
    }

    const allPosts = await loadAllBlogPosts();
    const post = allPosts.find((p) => p.slug === slug);

    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    // 1. If translation already exists in post, return immediately
    if (post.translations && post.translations[target_lang]) {
      return NextResponse.json({
        success: true,
        cached: true,
        translation: post.translations[target_lang],
      });
    }

    const isSourceChinese = /[\u4e00-\u9fa5]/.test(post.sections?.[0]?.heading || post.title_zh || '');

    // 2. If target matches source language, return original
    if (target_lang === 'zh-TW' && isSourceChinese) {
      const origPkg: BlogTranslationPackage = {
        title: post.title_zh,
        subtitle: post.subtitle_zh,
        excerpt: post.excerpt_zh,
        badge: post.badge_zh,
        author_role: post.author_role_zh,
        target_cta_text: post.target_cta_text_zh,
        sections: post.sections,
        faqs: post.faqs,
      };
      return NextResponse.json({ success: true, translation: origPkg });
    }

    if (target_lang === 'en-US' && !isSourceChinese) {
      const origPkg: BlogTranslationPackage = {
        title: post.title_en,
        subtitle: post.subtitle_en,
        excerpt: post.excerpt_en,
        badge: post.badge_en,
        author_role: post.author_role_zh,
        target_cta_text: post.target_cta_text_en,
        sections: post.sections,
        faqs: post.faqs,
      };
      return NextResponse.json({ success: true, translation: origPkg });
    }

    const langName = LANG_NAMES[target_lang] || target_lang;
    const srcDesc = isSourceChinese ? 'Traditional Chinese' : 'Native English';
    const srcTitle = isSourceChinese ? post.title_zh : post.title_en;
    const srcSubtitle = isSourceChinese ? post.subtitle_zh : post.subtitle_en;
    const srcExcerpt = isSourceChinese ? post.excerpt_zh : post.excerpt_en;
    const srcBadge = isSourceChinese ? post.badge_zh : post.badge_en;
    const srcCTA = isSourceChinese ? post.target_cta_text_zh : post.target_cta_text_en;

    const prompt = `You are a professional native-level SEO marketing translator and localization master.
Please translate the following blog post article into ${langName} (${target_lang}).

Keep the friendly, conversational, enthusiastic 'side-hustle blogger' tone for beginners/creators.
Do NOT use robotic or dry translation. Make it sound like a top native blogger wrote it.
Keep system names like 'AI-ATM', 'WeiXiang AI', 'SEN', 'LINE', 'WordPress', 'SEO', 'USDT' intact.

ARTICLE TO TRANSLATE (Source: ${srcDesc}):
Title: ${srcTitle}
Subtitle: ${srcSubtitle}
Excerpt: ${srcExcerpt}
Badge: ${srcBadge}
Author Role: ${post.author_role_zh}
CTA Text: ${srcCTA}

Sections to translate:
${JSON.stringify(post.sections, null, 2)}

FAQs to translate:
${JSON.stringify(post.faqs || [], null, 2)}

Output strictly valid JSON with this schema (no markdown code fence):
{
  "title": "Translated Title",
  "subtitle": "Translated Subtitle",
  "excerpt": "Translated Excerpt",
  "badge": "Translated Badge",
  "author_role": "Translated Author Role",
  "target_cta_text": "Translated Target CTA Text",
  "sections": [
    {
      "heading": "Translated Heading",
      "body": "Translated Body (keep \\n\\n paragraph breaks)",
      "highlight_tip": "Translated Tip"
    }
  ],
  "faqs": [
    {
      "q": "Translated Question",
      "a": "Translated Answer"
    }
  ]
}`;

    let translatedPackage: BlogTranslationPackage | null = null;
    let usedModel = '';

    for (const model of BLOG_TRANSLATE_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            temperature: 0.35,
            responseMimeType: 'application/json',
          },
        });
        const text = response.text || '{}';
        translatedPackage = JSON.parse(text);
        usedModel = model;
        break;
      } catch (err: any) {
        console.warn(`[Translate AI] Model ${model} failed:`, err?.message);
      }
    }

    if (!translatedPackage) {
      return NextResponse.json({ success: false, error: 'Translation failed across all models' }, { status: 500 });
    }

    // 3. Save into post.translations and update cloud store
    post.translations = {
      ...(post.translations || {}),
      [target_lang]: translatedPackage,
    };
    await saveDailyBlogPost(post);

    return NextResponse.json({
      success: true,
      usedModel,
      translation: translatedPackage,
    });
  } catch (err: any) {
    console.error('[/api/blog/translate Error]:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
