import { ImageResponse } from "next/og";
import { SITE } from "@/lib/seo/schemas";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 64,
          background: "linear-gradient(90deg, #0b1220 0%, #0a0a0a 70%)",
          color: "white",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 64, fontWeight: 800 }}>{SITE.name}</div>
          <div style={{ fontSize: 34, opacity: 0.85 }}>{SITE.tagline}</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
