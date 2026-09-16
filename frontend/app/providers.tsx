'use client';

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, http, createConfig } from 'wagmi';
import { polygon } from 'wagmi/chains';
import { 
  RainbowKitProvider, 
  connectorsForWallets,
} from '@rainbow-me/rainbowkit';
import { 
  metaMaskWallet, 
  walletConnectWallet, 
  okxWallet,
  trustWallet,
  rainbowWallet
} from '@rainbow-me/rainbowkit/wallets';
import '@rainbow-me/rainbowkit/styles.css';
import { LanguageProvider } from '@/lib/LanguageContext';

const projectId = '9b9a9131bdc65b6077ebd9f9ed4ab314';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended (推薦錢包)',
      wallets: [
        metaMaskWallet({ projectId }),
        okxWallet({ projectId }),
        walletConnectWallet({ projectId }),
        trustWallet({ projectId }),
        rainbowWallet({ projectId })
      ],
    },
  ],
  {
    appName: 'Weixiang AI-ATM',
    projectId: projectId,
  }
);

const config = createConfig({
  connectors,
  chains: [polygon],
  transports: {
    [polygon.id]: http(),
  },
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
