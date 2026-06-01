import Image from "next/image";
import { HorizontalScrollWithHints } from "@/components/marketing/HorizontalScrollWithHints";
import { cn, freeSectionShellSpacing } from "@/lib/utils";
import {
  ESTRUTURAS_METALICAS_QUALITY_SEAL_SRC,
  type EstruturasMetalicasQualityContent,
  type EstruturasMetalicasQualityFeature,
  type EstruturasMetalicasQualityStat,
} from "@/lib/servicos/estruturas-metalicas-quality";

interface StaticServiceQualitySectionProps {
  title: string;
  subtitle: string;
  content: EstruturasMetalicasQualityContent;
  featuresScrollLabel: string;
  scrollLeftLabel: string;
  scrollRightLabel: string;
  sectionId?: string;
}

function QualityStatBlock({ stat }: { stat: EstruturasMetalicasQualityStat }) {
  return (
    <div className="flex max-w-xs flex-col items-center text-center lg:max-w-none lg:items-start lg:text-left">
      <p className="text-xl font-bold uppercase leading-tight text-primary sm:text-2xl lg:text-3xl">
        {stat.highlight}
      </p>
      <p className="mt-1 whitespace-pre-line text-sm font-bold uppercase leading-snug text-foreground sm:text-base">
        {stat.label}
      </p>
    </div>
  );
}

function QualityFeatureCard({
  feature,
  className,
}: {
  feature: EstruturasMetalicasQualityFeature;
  className?: string;
}) {
  return (
    <li className={cn("flex flex-col items-center text-center", className)}>
      <div className="relative size-16 sm:size-20">
        <Image
          src={feature.iconSrc}
          alt=""
          fill
          className="object-contain"
          sizes="5rem"
          aria-hidden
        />
      </div>
      <h3 className="mt-4 text-sm font-semibold leading-snug text-neutral-700 sm:text-base">
        {feature.title}
      </h3>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
        {feature.description}
      </p>
    </li>
  );
}

export function StaticServiceQualitySection({
  title,
  subtitle,
  content,
  featuresScrollLabel,
  scrollLeftLabel,
  scrollRightLabel,
  sectionId = "static-service-quality",
}: StaticServiceQualitySectionProps) {
  return (
    <section
      aria-labelledby={sectionId}
      className="w-full bg-muted/40 py-12 sm:py-16 lg:py-20"
    >
      <div className={cn(freeSectionShellSpacing, "flex flex-col gap-10 lg:gap-14")}>
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id={sectionId}
            className="text-2xl font-bold leading-tight text-foreground sm:text-3xl lg:text-4xl"
          >
            {title}
          </h2>
          <div
            className="mx-auto mt-4 h-1 w-20 rounded-full bg-chart-5"
            aria-hidden
          />
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-col items-center gap-8 border-b border-border pb-10 lg:flex-row lg:items-center lg:justify-center lg:gap-16 lg:pb-14 xl:gap-24">
          <Image
            src={ESTRUTURAS_METALICAS_QUALITY_SEAL_SRC}
            alt={content.sealAlt}
            width={787}
            height={787}
            quality={100}
            sizes="(max-width: 640px) 208px, (max-width: 768px) 224px, (max-width: 1024px) 350px, 320px"
            className="h-auto w-52 max-w-full shrink-0 sm:w-56 md:w-60 lg:w-64"
          />

          <div className="flex flex-col items-center gap-8 sm:flex-row sm:gap-12 lg:gap-16 xl:gap-24">
            {content.stats.map((stat) => (
              <QualityStatBlock key={stat.id} stat={stat} />
            ))}
          </div>
        </div>

        <HorizontalScrollWithHints
          ariaLabel={featuresScrollLabel}
          scrollLeftLabel={scrollLeftLabel}
          scrollRightLabel={scrollRightLabel}
          className="-mx-3.5 sm:-mx-24 lg:mx-0"
        >
          <ul className="flex w-max min-w-full snap-x snap-mandatory gap-6 px-3.5 pb-1 sm:px-24 lg:grid lg:w-full lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12 lg:px-0 lg:pb-0">
            {content.features.map((feature) => (
              <QualityFeatureCard
                key={feature.id}
                feature={feature}
                className="w-[min(72vw,18rem)] shrink-0 snap-start lg:w-auto lg:shrink"
              />
            ))}
          </ul>
        </HorizontalScrollWithHints>
      </div>
    </section>
  );
}
