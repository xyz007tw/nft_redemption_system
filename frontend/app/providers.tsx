'use client';

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { polygon } from 'wagmi/chains';
import { RainbowKitProvider, getDefaultConfig, Locale } from '@rainbow-me/rainbowkit';
import { 
  metaMaskWallet, 
  walletConnectWallet, 
  okxWallet,
  trustWallet,
  rainbowWallet
} from '@rainbow-me/rainbowkit/wallets';
import '@rainbow-me/rainbowkit/styles.css';
import { LanguageProvider, useLanguage } from '@/lib/LanguageContext';

const config = getDefaultConfig({
  appName: 'Weixiang AI-ATM',
  projectId: '9b9a9131bdc65b6077ebd9f9ed4ab314', // 用戶真實 ID
  chains: [polygon],
  ssr: true,
});

const queryClient = new QueryClient();

function RainbowKitWithLocale({ children }: { children: React.ReactNode }) {
  const { lang } = useLanguage();
  return (
    <RainbowKitProvider locale={lang as Locale}>
      {children}
    </RainbowKitProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <RainbowKitWithLocale>
            {children}
          </RainbowKitWithLocale>
        </LanguageProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
