'use client';

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { polygon } from 'wagmi/chains';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { 
  metaMaskWallet, 
  walletConnectWallet, 
  okxWallet,
  trustWallet,
  rainbowWallet
} from '@rainbow-me/rainbowkit/wallets';
import '@rainbow-me/rainbowkit/styles.css';
import { LanguageProvider } from '@/lib/LanguageContext';

const config = getDefaultConfig({
  appName: 'Weixiang AI-ATM',
  projectId: '9b9a9131bdc65b6077ebd9f9ed4ab314', // 用戶真實 ID
  chains: [polygon],
  ssr: true,
  wallets: [
    {
      groupName: 'Recommended (推薦錢包)',
      wallets: [metaMaskWallet, okxWallet, walletConnectWallet, trustWallet, rainbowWallet],
    },
  ],
});

const queryClient = new QueryClient();

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
