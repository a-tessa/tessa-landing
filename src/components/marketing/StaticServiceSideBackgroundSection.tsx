import Image from "next/image";
import { cn, freeSectionShellSpacing } from "@/lib/utils";

interface StaticServiceSideBackgroundSectionProps {
  title: string;
  description: string;
  backgroundImageSrc: string;
  backgroundImageAlt: string;
  sectionId?: string;
}

export function StaticServiceSideBackgroundSection({
  title,
  description,
  backgroundImageSrc,
  backgroundImageAlt,
  sectionId = "static-service-side-background",
}: StaticServiceSideBackgroundSectionProps) {
  return (
    <section
      aria-labelledby={sectionId}
      className="relative w-full overflow-hidden bg-secondary"
    >
      <figure
        className="pointer-events-none absolute inset-0 lg:inset-y-0 lg:left-[45%] lg:right-0"
        aria-hidden
      >
        <Image
          src={backgroundImageSrc}
          alt={backgroundImageAlt}
          fill
          className="object-cover object-center"
          sizes="(max-width: 1024px) 100vw, 55vw"
          priority={false}
        />
      </figure>

      <div
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-[45%] bg-secondary lg:block"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-0 bg-secondary/15 lg:left-[45%] lg:bg-transparent"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-2/3 bg-linear-to-b from-secondary/70 via-secondary/35 to-transparent lg:hidden"
        aria-hidden
      />

      <div
        className={cn(
          freeSectionShellSpacing,
          "relative py-12 sm:py-16 lg:py-20",
        )}
      >
        <div className="mx-auto max-w-xl text-center lg:mx-0 lg:w-[45%] lg:max-w-lg lg:pr-10 lg:text-left xl:max-w-xl">
          <h2
            id={sectionId}
            className="text-xl font-bold leading-tight text-white sm:text-2xl lg:text-3xl xl:text-4xl"
          >
            {title}
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-white/95 sm:text-base">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
