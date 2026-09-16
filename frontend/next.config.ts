import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@wagmi/connectors'],
};

export default nextConfig;
