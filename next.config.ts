import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  bundlePagesRouterDependencies: true,
  serverExternalPackages: ['package-name'],

  // Router cache configuration
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
};

export default nextConfig;
