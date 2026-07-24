import Image from "next/image";
import { cn } from "@/lib/utils";
import type { InstagramMediaType } from "@/lib/api/instagram.types";

interface InstagramPostCardProps {
  href: string;
  caption: string | null;
  imageSrc: string;
  imageAlt: string;
  mediaType: InstagramMediaType;
  className?: string;
  imageSizes?: string;
  openPostLabel: string;
}

function mediaTypeBadge(mediaType: InstagramMediaType): string | null {
  if (mediaType === "VIDEO") return "Reel";
  if (mediaType === "CAROUSEL_ALBUM") return "Carrossel";
  return null;
}

export function InstagramPostCard({
  href,
  caption,
  imageSrc,
  imageAlt,
  mediaType,
  className,
  imageSizes = "(max-width: 1024px) 100vw, 22vw",
  openPostLabel,
}: InstagramPostCardProps) {
  const badge = mediaTypeBadge(mediaType);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={openPostLabel}
      className={cn(
        "group relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg",
        className,
      )}
    >
      <div className="relative min-h-40 flex-1 overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes={imageSizes}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-black/10" />

        <div className="absolute left-3 top-3 z-10 flex items-center gap-2">
          <span className="rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
            Instagram
          </span>
          {badge ? (
            <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
              {badge}
            </span>
          ) : null}
        </div>

        <div className="absolute right-3 top-3 z-10 flex size-7 items-center justify-center rounded-full bg-primary">
          <InstagramGlyph />
        </div>

        {caption ? (
          <p className="absolute inset-x-0 bottom-0 z-10 p-4 font-barlow text-sm font-semibold leading-snug text-white line-clamp-3 sm:text-base">
            {caption}
          </p>
        ) : null}
      </div>
    </a>
  );
}

function InstagramGlyph() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3.5 text-white"
      aria-hidden="true"
    >
      <rect width={20} height={20} x={2} y={2} rx={5} ry={5} />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1={17.5} x2={17.51} y1={6.5} y2={6.5} />
    </svg>
  );
}
