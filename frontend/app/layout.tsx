import './globals.css';
import { Providers } from './providers';
import { Suspense } from 'react';
import ReferralTracker from '@/components/ReferralTracker';
import ChatWidget from '@/components/ChatWidget';
import PWARegister from '@/components/PWARegister';

export const metadata = {
  title: 'Weixiang AI-ATM | 智能行銷收單系統',
  description: 'AI自動來客系統 Web3 業務中心',
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
