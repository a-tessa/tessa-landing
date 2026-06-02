import Image from "next/image";
import { cn, freeSectionShellSpacing } from "@/lib/utils";

interface StaticServiceImageSplitSectionProps {
  title: string;
  subtitle: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  sectionId?: string;
}

export function StaticServiceImageSplitSection({
  title,
  subtitle,
  description,
  imageSrc,
  imageAlt,
  sectionId = "static-service-image-split",
}: StaticServiceImageSplitSectionProps) {
  return (
    <section
      aria-labelledby={sectionId}
      className="w-full overflow-hidden bg-secondary"
    >
      <div className="flex flex-col lg:flex-row">
        <figure className="relative m-0 aspect-943/450 w-full shrink-0 lg:w-1/2 lg:aspect-auto lg:min-h-88">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </figure>

        <div
          className={cn(
            "flex w-full flex-col justify-center py-10 sm:py-12 lg:w-4/5 lg:py-16 xl:py-10 px-8 lg:px-10 xl:px-12",
          )}
        >
          <h2
            id={sectionId}
            className="text-center text-xl font-bold leading-tight text-white sm:text-xl lg:text-left lg:text-2xl"
          >
            {title}
          </h2>
          <p className="mt-4 text-center text-base font-bold leading-snug text-white sm:text-lg lg:text-left">
            {subtitle}
          </p>
          <p className="mt-5 text-center text-sm leading-relaxed text-white/95 sm:text-sm lg:text-left">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
