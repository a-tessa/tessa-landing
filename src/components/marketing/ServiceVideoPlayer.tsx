import { YouTubeEmbed } from "@next/third-parties/google";
import { cn } from "@/lib/utils";
import { getYouTubeVideoId } from "@/lib/youtube";

interface ServiceVideoPlayerProps {
  /** Raw YouTube URL (watch/embed/youtu.be/shorts) or 11-char video ID. */
  videoUrl: string | null | undefined;
  /** Accessible label announced when the placeholder play button is focused. */
  playLabel: string;
  /** Visible caption rendered for sighted users (figcaption). Hidden if omitted. */
  caption?: string;
  className?: string;
}

/**
 * Server Component wrapper around `@next/third-parties/google`'s `YouTubeEmbed`.
 *
 * Performance:
 *   - Uses the lite-youtube-embed facade (SSR-rendered thumbnail + deferred iframe).
 *   - No YouTube JS is loaded until the user clicks play.
 *   - `youtube-nocookie.com` is used internally for embeds (privacy-enhanced).
 *
 * SEO / a11y:
 *   - Semantic `<figure>` + `<figcaption>` gives the video a textual anchor.
 *   - Localized `playlabel` is read by assistive tech.
 */
export function ServiceVideoPlayer({
  videoUrl,
  playLabel,
  caption,
  className,
}: ServiceVideoPlayerProps) {
  const videoId = getYouTubeVideoId(videoUrl);
  if (!videoId) return null;

  return (
    <figure
      className={cn(
        "relative w-full overflow-hidden rounded-3xl bg-muted aspect-video [&>lite-youtube]:h-full [&>lite-youtube]:w-full [&>lite-youtube]:max-w-none [&>lite-youtube]:rounded-3xl",
        className,
      )}
    >
      <YouTubeEmbed
        videoid={videoId}
        playlabel={playLabel}
        params="rel=0&modestbranding=1"
      />
      {caption ? (
        <figcaption className="sr-only">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
