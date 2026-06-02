import Image from "next/image";
import { cn, freeSectionShellSpacing } from "@/lib/utils";

export interface StaticServiceSegmentItem {
  id: string;
  label: string;
  iconSrc: string;
  iconAlt: string;
}

interface StaticServiceSegmentsSectionProps {
  title: string;
  items: StaticServiceSegmentItem[];
  sectionId?: string;
}

export function StaticServiceSegmentsSection({
  title,
  items,
  sectionId = "static-service-segments",
}: StaticServiceSegmentsSectionProps) {
  return (
    <section
      aria-labelledby={sectionId}
      className="w-full bg-muted/40 py-12 sm:py-16 lg:py-20"
    >
      <div
        className={cn(
          freeSectionShellSpacing,
          "flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-12 xl:gap-16",
        )}
      >
        <h2
          id={sectionId}
          className="text-xl font-bold leading-tight text-foreground sm:text-2xl lg:w-4/12 lg:max-w-sm lg:shrink-0 xl:text-3xl"
        >
          {title}
        </h2>

        <ul className="flex w-full list-none flex-wrap items-start justify-between gap-y-8 lg:flex-1">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex min-w-24 flex-1 basis-0 flex-col items-center sm:min-w-28"
            >
              <figure className="m-0 flex w-full flex-col items-center gap-3 text-center">
                <Image
                  src={item.iconSrc}
                  alt={item.iconAlt}
                  width={165}
                  height={165}
                  className="size-20 rounded-2xl sm:size-24"
                />
                <figcaption className="text-xs font-semibold leading-snug text-foreground sm:text-sm">
                  {item.label}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
