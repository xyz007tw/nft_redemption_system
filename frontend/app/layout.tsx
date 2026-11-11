import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Suspense } from 'react';
import ReferralTracker from '@/components/ReferralTracker';
import ChatWidget from '@/components/ChatWidget';
import PWARegister from '@/components/PWARegister';

export const metadata: Metadata = {
  metadataBase: new URL('https://nft1314.party'),
  title: 'Weixiang AI-ATM | 智能行銷收單系統 · AI自動來客系統',
  description: '微享 AI-ATM 智能自動商業變現總部：結合短影音矩陣、WP 多語系 SEO 站群與 25% 聯盟分潤體系，打造 24H 無人知識販賣機與全球副業被動收入引擎。',
  keywords: [
    'Weixiang AI-ATM',
    '微享 AI',
    'AI自動來客系統',
    '知識自動販賣機',
    'AI多語系SEO',
    '萬商自助廣告系統',
    'VIP全球電子書',
    '25%聯盟分潤',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Weixiang AI-ATM | 智能行銷收單系統 · AI自動來客系統',
    description: '結合短影音矩陣、WP多語系SEO站群與25%聯盟分潤，打造24H全球自動化來客與知識變現系統。',
    url: 'https://nft1314.party',
    siteName: 'WeiXiang AI 微享自動來客系統',
    locale: 'zh_TW',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
        },
      }
    : {}),
  appleWebApp: {
    capable: true,
    title: 'WeiXiang',
    statusBarStyle: 'black-translucent',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body className="bg-[#0a0a0f] text-white min-h-screen overflow-x-hidden">
        <PWARegister />
        <Suspense fallback={null}>
          <ReferralTracker />
        </Suspense>
        <Providers>
          {children}
          <ChatWidget />
        </Providers>
      </body>
    </html>
  );
}
