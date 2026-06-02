import { ServiceVideoPlayer } from "@/components/marketing/ServiceVideoPlayer";
import { cn, freeSectionShellSpacing } from "@/lib/utils";

interface StaticServiceVideoSectionProps {
  title: string;
  subtitle: string;
  videoUrl: string;
  playLabel: string;
  sectionId?: string;
}

export function StaticServiceVideoSection({
  title,
  subtitle,
  videoUrl,
  playLabel,
  sectionId = "static-service-video",
}: StaticServiceVideoSectionProps) {
  return (
    <section
      aria-labelledby={sectionId}
      className="w-full bg-muted/40 py-12 sm:py-16 lg:py-20"
    >
      <div
        className={cn(
          freeSectionShellSpacing,
          "flex flex-col gap-10 md:flex-row md:items-center md:gap-12 lg:gap-20",
        )}
      >
        <div className="w-full md:w-5/12 lg:max-w-xl">
          <h2
            id={sectionId}
            className="text-xl font-bold leading-tight text-foreground md:text-2xl lg:text-3xl xl:text-4xl"
          >
            {title}
          </h2>
          <div
            className="mt-4 h-1 w-20 rounded-full bg-chart-5"
            aria-hidden
          />
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
            {subtitle}
          </p>
        </div>

        <div className="w-full md:w-7/12 md:flex-1">
          <ServiceVideoPlayer
            videoUrl={videoUrl}
            playLabel={playLabel}
            caption={subtitle}
          />
        </div>
      </div>
    </section>
  );
}
