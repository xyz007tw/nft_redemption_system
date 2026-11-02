import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { loadAllBlogPosts } from '@/lib/blogStore';
import { BlogPostDetailClient } from '@/components/BlogPostDetailClient';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const posts = await loadAllBlogPosts();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: '文章未找到 | 微享 WeiXiang AI 斜槓創客部落格',
    };
  }

  const canonicalUrl = `https://nft1314.party/blog/${post.slug}`;

  return {
    title: `${post.title_zh} | 微享 WeiXiang AI 創客專欄`,
    description: post.excerpt_zh,
    keywords: post.seo_keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title_zh,
      description: post.excerpt_zh,
      url: canonicalUrl,
      siteName: 'WeiXiang AI 微享自動來客系統',
      type: 'article',
      publishedTime: post.published_at,
      authors: [post.author_name],
      images: [
        {
          url: post.cover_image,
          width: 1200,
          height: 630,
          alt: post.title_zh,
        },
      ],
    },
  };
}

export default async function BlogPostDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const allPosts = await loadAllBlogPosts();
  const post = allPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = allPosts.filter((p) => p.slug !== post.slug);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title_zh,
    alternativeHeadline: post.subtitle_zh,
    description: post.excerpt_zh,
    image: post.cover_image,
    datePublished: post.published_at,
    dateModified: post.published_at,
    author: {
      '@type': 'Person',
      name: post.author_name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'WeiXiang AI 微享自動來客系統',
      url: 'https://nft1314.party',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://nft1314.party/blog/${post.slug}`,
    },
    keywords: post.seo_keywords.join(', '),
  };

  const faqJsonLd =
    post.faqs && post.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: post.faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.a,
            },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <BlogPostDetailClient post={post} relatedPosts={relatedPosts} />
    </>
  );
}
