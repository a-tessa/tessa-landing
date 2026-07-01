import { ImageResponse } from "next/og";
import { loadShortLogoSrc } from "@/lib/brand/load-short-logo";
import { OgImageLayout } from "@/lib/brand/og-image-layout";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logoSrc = await loadShortLogoSrc();
  return new ImageResponse(<OgImageLayout logoSrc={logoSrc} />, { ...size });
}
