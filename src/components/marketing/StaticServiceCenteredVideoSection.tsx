import { ServiceVideoPlayer } from "@/components/marketing/ServiceVideoPlayer";
import { StaticServiceCenteredHeading } from "@/components/marketing/StaticServiceCenteredHeading";
import { cn, freeSectionShellSpacing } from "@/lib/utils";

interface StaticServiceCenteredVideoSectionProps {
  title: string;
  subtitle: string;
  videoUrl: string;
  playLabel: string;
  sectionId?: string;
}

export function StaticServiceCenteredVideoSection({
  title,
  subtitle,
  videoUrl,
  playLabel,
  sectionId = "static-service-video",
}: StaticServiceCenteredVideoSectionProps) {
  return (
    <section
      aria-labelledby={sectionId}
      className="w-full bg-muted/40 py-12 sm:py-16 lg:py-20"
    >
      <div
        className={cn(
          freeSectionShellSpacing,
          "flex flex-col items-center gap-8 sm:gap-10",
        )}
      >
        <StaticServiceCenteredHeading
          title={title}
          subtitle={subtitle}
          headingId={sectionId}
        />

        <div className="mx-auto w-full max-w-5xl lg:max-w-6xl">
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
