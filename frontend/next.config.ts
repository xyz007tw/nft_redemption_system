import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@wagmi/connectors'],
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
