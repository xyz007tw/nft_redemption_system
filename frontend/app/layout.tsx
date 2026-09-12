import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Weixiang AI-ATM | 智能行銷兌換系統',
  description: 'AI自動來客系統 Web3 會員中心',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body className="bg-gray-900 text-white min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
