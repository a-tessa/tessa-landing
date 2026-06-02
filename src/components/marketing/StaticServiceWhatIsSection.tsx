import Image from "next/image";
import { cn, freeSectionShellSpacing } from "@/lib/utils";

interface StaticServiceWhatIsSectionProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  sectionId?: string;
  /** `prominent` for large overflow; `moderate` for a balanced pop-out; `contained` stays inside. */
  imageOverflow?: "prominent" | "moderate" | "contained";
}

export function StaticServiceWhatIsSection({
  title,
  description,
  imageSrc,
  imageAlt,
  sectionId = "static-service-what-is",
  imageOverflow = "prominent",
}: StaticServiceWhatIsSectionProps) {
  const isContained = imageOverflow === "contained";
  const isModerate = imageOverflow === "moderate";

  return (
    <section
      aria-labelledby={sectionId}
      className={cn(
        "w-full bg-black",
        isContained
          ? "mb-10 sm:mb-12 lg:mb-14"
          : isModerate
            ? "mb-12 overflow-visible sm:mb-16 lg:mb-20 xl:mb-24"
            : "mb-10 overflow-visible sm:mb-12 lg:mb-14 xl:mb-16",
      )}
    >
      <div
        className={cn(
          isContained ? "overflow-hidden" : "overflow-visible",
          "bg-secondary",
        )}
      >
        <div
          className={cn(
            freeSectionShellSpacing,
            "flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12 xl:gap-16",
          )}
        >
          <div className="relative z-10 w-full lg:w-5/12 lg:max-w-xl my-5">
            <h2
              id={sectionId}
              className="text-lg font-bold leading-tight text-white sm:text-xl lg:text-2xl"
            >
              {title}
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-white/95 sm:text-sm">
              {description}
            </p>
          </div>

          <div
            className={cn(
              "relative mx-auto w-full",
              isContained &&
                "aspect-890/683 max-w-xs sm:max-w-sm lg:max-w-md xl:max-w-lg",
              isModerate &&
                "aspect-890/683 max-w-sm sm:max-w-md lg:max-w-xl xl:max-w-2xl -my-4 sm:-my-6 lg:-my-10 xl:-my-14 lg:scale-[1.04]",
              !isContained &&
                !isModerate &&
                "aspect-6/3 -mt-6 max-w-lg sm:max-w-xl lg:max-w-none lg:aspect-5/4 lg:scale-110 xl:-my-42 xl:scale-[1.15]",
            )}
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-contain object-center"
              sizes={
                isContained
                  ? "(max-width: 1024px) 80vw, 28rem"
                  : isModerate
                    ? "(max-width: 1024px) 90vw, 42rem"
                    : "(max-width: 1024px) 100vw, 55vw"
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
