import { ImageResponse } from "next/og";
import Image from "next/image";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
        color: "white",
        fontSize: 18,
        fontWeight: 800,
        borderRadius: 6,
        fontFamily: "Barlow, system-ui, sans-serif",
      }}
    >
      <Image src="/tessa-logo.svg" alt="Tessa" width={32} height={32} />
    </div>,
    { ...size },
  );
}
