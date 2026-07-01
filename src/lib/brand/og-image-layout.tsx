import { SITE } from "@/lib/seo/schemas";

/** Static short logo in `/public`. */
export const TESSA_SHORT_LOGO = {
  path: "/tessa-short-logo.png",
  width: 117,
  height: 130,
} as const;

export function OgImageLayout({ logoSrc }: { logoSrc: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000000",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoSrc}
        alt={SITE.shortName}
        width={TESSA_SHORT_LOGO.width * 3}
        height={TESSA_SHORT_LOGO.height * 3}
      />
    </div>
  );
}
