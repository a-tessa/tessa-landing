import { ServiceVideoPlayer } from "@/components/marketing/ServiceVideoPlayer";
import { cn } from "@/lib/utils";

interface AboutHeroVideoProps {
  videoUrl: string;
  startSeconds?: number;
  heroTitle: string;
  playLabel: string;
  caption: string;
  className?: string;
}

/**
 * Full-bleed cover video with the institutional title overlaid at the bottom-left,
 * matching the Quem Somos layout.
 */
export function AboutHeroVideo({
  videoUrl,
  startSeconds,
  heroTitle,
  playLabel,
  caption,
  className,
}: AboutHeroVideoProps) {
  return (
    <div className={cn("relative w-full overflow-hidden rounded-3xl", className)}>
      <ServiceVideoPlayer
        videoUrl={videoUrl}
        startSeconds={startSeconds}
        playLabel={playLabel}
        caption={caption}
        className="aspect-video w-full rounded-3xl bg-black shadow-lg"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-linear-to-t from-black/70 via-black/35 to-transparent px-5 pb-5 pt-16 sm:px-8 sm:pb-8">
        <p className="inline-block max-w-xl rounded-md bg-black/55 px-4 py-3 font-barlow text-lg font-bold uppercase tracking-wide text-white sm:text-2xl md:text-3xl">
          {heroTitle}
        </p>
      </div>
    </div>
  );
}
