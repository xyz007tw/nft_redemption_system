import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@wagmi/connectors'],
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
