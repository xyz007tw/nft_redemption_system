import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/blog', '/blog/*', '/ebook-store', '/sponsor'],
      disallow: ['/admin', '/api/admin'],
    },
    sitemap: 'https://nft1314.party/sitemap.xml',
  };
}
