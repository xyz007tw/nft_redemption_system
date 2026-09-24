import type { NextConfig } from "next";

const nextConfig = {
  transpilePackages: ['@wagmi/connectors'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
