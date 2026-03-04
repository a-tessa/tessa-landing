import { ImageResponse } from "next/og";
import { SITE } from "@/lib/seo/schemas";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 64,
          background: "linear-gradient(135deg, #09090b 0%, #0f172a 60%, #064e3b 120%)",
          color: "white",
          alignItems: "flex-end",
          justifyContent: "space-between",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 860 }}>
          <div style={{ fontSize: 20, opacity: 0.8 }}>{SITE.name}</div>
          <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.05 }}>{SITE.tagline}</div>
          <div style={{ fontSize: 28, opacity: 0.8 }}>{SITE.description}</div>
        </div>
        <div style={{ fontSize: 18, opacity: 0.7 }}>{SITE.domain.replace("https://", "")}</div>
      </div>
    ),
    { ...size }
  );
}
