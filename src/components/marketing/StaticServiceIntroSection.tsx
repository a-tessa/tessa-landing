import { StaticServiceCenteredHeading } from "@/components/marketing/StaticServiceCenteredHeading";
import { cn, freeSectionShellSpacing } from "@/lib/utils";

interface StaticServiceIntroSectionProps {
  title: string;
  subtitle: string;
  sectionId?: string;
}

export function StaticServiceIntroSection({
  title,
  subtitle,
  sectionId = "static-service-intro",
}: StaticServiceIntroSectionProps) {
  return (
    <section
      aria-labelledby={sectionId}
      className="w-full bg-white py-12 sm:py-16 lg:py-20"
    >
      <div className={cn(freeSectionShellSpacing)}>
        <StaticServiceCenteredHeading
          title={title}
          subtitle={subtitle}
          headingId={sectionId}
        />
      </div>
    </section>
  );
}
