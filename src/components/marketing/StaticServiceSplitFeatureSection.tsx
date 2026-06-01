import Image from "next/image";
import { cn, freeSectionShellSpacing } from "@/lib/utils";

interface StaticServiceSplitFeatureSectionProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  sectionId?: string;
}

export function StaticServiceSplitFeatureSection({
  title,
  description,
  imageSrc,
  imageAlt,
  sectionId = "static-service-split-feature",
}: StaticServiceSplitFeatureSectionProps) {
  return (
    <section
      aria-labelledby={sectionId}
      className="w-full bg-white py-12 sm:py-16 lg:py-20"
    >
      <div
        className={cn(
          freeSectionShellSpacing,
          "flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:gap-12 xl:gap-16",
        )}
      >
        <figure className="m-0 w-full shrink-0 lg:w-5/12">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={726}
            height={682}
            className="mx-auto h-auto w-full max-w-md object-contain lg:max-w-none"
            sizes="(max-width: 1024px) 100vw, 42vw"
          />
        </figure>

        <div className="w-full lg:w-7/12 lg:max-w-xl">
          <h2
            id={sectionId}
            className="text-2xl font-bold leading-tight text-foreground sm:text-3xl lg:text-4xl"
          >
            {title}
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
