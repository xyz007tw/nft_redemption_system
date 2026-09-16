'use client';

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, http } from 'wagmi';
import { polygon } from 'wagmi/chains';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

const config = getDefaultConfig({
  appName: 'Weixiang AI-ATM',
  projectId: '9b9a9131bdc65b6077ebd9f9ed4ab314', // 真實合法的 WalletConnect Project ID
  chains: [polygon],
  transports: {
    [polygon.id]: http(),
  },
});

const queryClient = new QueryClient();

import { LanguageProvider } from '@/lib/LanguageContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
