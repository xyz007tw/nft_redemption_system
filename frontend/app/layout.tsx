import './globals.css';
import { Providers } from './providers';
import { Suspense } from 'react';
import ReferralTracker from '@/components/ReferralTracker';

export const metadata = {
  title: 'Weixiang AI-ATM | 智能行銷收單系統',
  description: 'AI自動來客系統 Web3 業務中心',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body className="bg-gray-900 text-white min-h-screen">
        <Suspense fallback={null}>
          <ReferralTracker />
        </Suspense>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
