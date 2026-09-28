import { withNextVideo } from "next-video/process";
import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";
import { MAX_TESTIMONIAL_REQUEST_BYTES } from "./src/lib/testimonials/image-limit";

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
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
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
    // Default action body is 1 MB and the proxy clone stops at 10 MB.
    // Each testimonial photo is capped at 4 MB; the request must fit both.
    serverActions: {
      bodySizeLimit: MAX_TESTIMONIAL_REQUEST_BYTES,
    },
    proxyClientMaxBodySize: MAX_TESTIMONIAL_REQUEST_BYTES,
  },
};

export default withNextVideo(withNextIntl(nextConfig));