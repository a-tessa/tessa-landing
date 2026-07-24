import { withNextVideo } from "next-video/process";
import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    // Explicit allow-list for next/image `quality` (Next 16+).
    // Used by apple-cards-carousel (90) and StaticServiceQualitySection (100).
    qualities: [70, 75, 90, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "assets.aceternity.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.cdninstagram.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.fbcdn.net",
        pathname: "/**",
      },
    ],
  },
  bundlePagesRouterDependencies: true,
  serverExternalPackages: ["package-name"],

  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
};

export default withNextVideo(withNextIntl(nextConfig));