import Image from "next/image";
import { cn, freeSectionShellSpacing } from "@/lib/utils";

interface StaticServiceWhatIsSectionProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  sectionId?: string;
}

export function StaticServiceWhatIsSection({
  title,
  description,
  imageSrc,
  imageAlt,
  sectionId = "static-service-what-is",
}: StaticServiceWhatIsSectionProps) {
  return (
    <section aria-labelledby={sectionId} className="w-full overflow-visible mb-10 sm:mb-12 lg:mb-14 xl:mb-16 bg-black">
      <div className="overflow-visible bg-secondary">
        <div
          className={cn(
            freeSectionShellSpacing,
            "flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12 xl:gap-16",
          )}
        >
          <div className="w-full lg:w-5/12 lg:max-w-xl my-5">
            <h2
              id={sectionId}
              className="text-base font-bold leading-tight text-secondary-foreground sm:text-lg lg:text-xl"
            >
              {title}
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-secondary-foreground/95 sm:text-sm">
              {description}
            </p>
          </div>

          <div className="relative mx-auto aspect-6/3 -mt-6 w-full max-w-lg sm:max-w-xl lg:max-w-none lg:aspect-5/4 lg:scale-110 xl:-my-42 xl:scale-[1.15]">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-contain object-center"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
