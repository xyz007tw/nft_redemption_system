import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@wagmi/connectors', '@walletconnect/ethereum-provider', '@walletconnect/modal', '@x402/core', '@x402/evm', '@x402/svm'],
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
