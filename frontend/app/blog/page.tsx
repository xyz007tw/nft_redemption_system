import React from 'react';
import type { Metadata } from 'next';
import { loadAllBlogPosts } from '@/lib/blogStore';
import { BlogHubClient } from '@/components/BlogHubClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '📝 斜槓創客實戰部落格｜知識自動販賣機 AI-ATM・25%分潤・AI頂配教材開箱 | 微享 WeiXiang AI',
  description:
    '專為網路小白、下班創客素人與斜槓族打造的 AI-ATM 自動賺錢系統實戰專欄！深入開箱「知識自動販賣機 AI-ATM ($990 享100%倒抵)」、「總工程師20年三軌流量複利」、「AI頂配教材」與「25%人推人脈複利分潤」。',
  keywords: [
    '知識自動販賣機 AI-ATM',
    '微享AI部落格',
    '下班斜槓被動收入',
    'AI電子書自動賺錢',
    '總工程師SEN',
    '25%聯盟分潤',
    'AI頂配教材',
    'AI尋客365天免錢',
  ],
  alternates: {
    canonical: 'https://nft1314.party/blog',
  },
  openGraph: {
    title: '📝 斜槓創客實戰部落格｜知識自動販賣機 AI-ATM 睡後收入筆記 | 微享 WeiXiang AI',
    description:
      '不用懂程式、不用自己架站！看創客素人如何運用微享 AI-ATM 知識自動販賣機與三軌流量引擎打造 24 小時全球睡後收入。',
    url: 'https://nft1314.party/blog',
    siteName: 'WeiXiang AI 微享自動來客系統',
    type: 'website',
  },
};

export default async function BlogIndexPage() {
  const posts = await loadAllBlogPosts();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: '微享 WeiXiang AI 斜槓創客實戰部落格',
    url: 'https://nft1314.party/blog',
    description:
      '針對微享官網所有核心項目（知識自動販賣機 AI-ATM、總工程師20年客製系統、AI頂配教材、VIP電子書櫃、25%聯盟分潤）之每日自動化類部落客實戰文章專欄。',
    publisher: {
      '@type': 'Organization',
      name: 'WeiXiang AI',
      url: 'https://nft1314.party',
    },
    blogPost: posts.slice(0, 15).map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title_zh,
      description: p.excerpt_zh,
      datePublished: p.published_at,
      url: `https://nft1314.party/blog/${p.slug}`,
      author: {
        '@type': 'Person',
        name: p.author_name,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogHubClient initialPosts={posts} />
    </>
  );
}
