import { NextResponse } from 'next/server';
import { loadAllBlogPosts } from '@/lib/blogStore';

export const dynamic = 'force-dynamic';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const baseUrl = 'https://nft1314.party';
  const posts = await loadAllBlogPosts();
  const latestPostDate =
    posts.length > 0 && posts[0].published_at
      ? new Date(posts[0].published_at).toISOString()
      : new Date().toISOString();

  const urls: Array<{ loc: string; lastmod: string; changefreq: string; priority: string }> = [
    { loc: `${baseUrl}/`, lastmod: latestPostDate, changefreq: 'daily', priority: '1.0' },
    { loc: `${baseUrl}/blog`, lastmod: latestPostDate, changefreq: 'daily', priority: '0.95' },
    { loc: `${baseUrl}/ebook-store`, lastmod: latestPostDate, changefreq: 'daily', priority: '0.9' },
    { loc: `${baseUrl}/sponsor`, lastmod: latestPostDate, changefreq: 'weekly', priority: '0.85' },
    { loc: `${baseUrl}/studio`, lastmod: latestPostDate, changefreq: 'weekly', priority: '0.85' },
    ...posts.map((post) => {
      let lastmod = latestPostDate;
      try {
        if (post.published_at) {
          const parsed = new Date(post.published_at);
          if (!Number.isNaN(parsed.getTime())) lastmod = parsed.toISOString();
        }
      } catch {
        // Use latestPostDate fallback
      }
      return {
        loc: `${baseUrl}/blog/${post.slug}`,
        lastmod,
        changefreq: 'weekly',
        priority: '0.88',
      };
    }),
  ];

  const xmlItems = urls
    .map(
      (u) =>
        `<url>\n<loc>${escapeXml(u.loc)}</loc>\n<lastmod>${u.lastmod}</lastmod>\n<changefreq>${u.changefreq}</changefreq>\n<priority>${u.priority}</priority>\n</url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${xmlItems}\n</urlset>\n`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=600, stale-while-revalidate=86400',
      'CDN-Cache-Control': 'public, max-age=600',
      'X-Robots-Tag': 'noindex',
    },
  });
}
