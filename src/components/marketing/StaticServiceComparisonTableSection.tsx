import Image from "next/image";
import { cn, freeSectionShellSpacing } from "@/lib/utils";

export interface StaticServiceComparisonRow {
  id: string;
  label: string;
  special: boolean;
  common: boolean;
}

interface StaticServiceComparisonTableSectionProps {
  title: string;
  subtitle: string;
  benefitsHeading: string;
  specialHeading: string;
  commonHeading: string;
  rows: StaticServiceComparisonRow[];
  checkIconSrc: string;
  timesIconSrc: string;
  yesLabel: string;
  noLabel: string;
  sectionId?: string;
}

function ComparisonMark({
  active,
  checkIconSrc,
  timesIconSrc,
  yesLabel,
  noLabel,
}: {
  active: boolean;
  checkIconSrc: string;
  timesIconSrc: string;
  yesLabel: string;
  noLabel: string;
}) {
  return (
    <Image
      src={active ? checkIconSrc : timesIconSrc}
      alt={active ? yesLabel : noLabel}
      width={active ? 31 : 24}
      height={active ? 21 : 24}
      className="h-3.5 w-auto sm:h-4"
    />
  );
}

export function StaticServiceComparisonTableSection({
  title,
  subtitle,
  benefitsHeading,
  specialHeading,
  commonHeading,
  rows,
  checkIconSrc,
  timesIconSrc,
  yesLabel,
  noLabel,
  sectionId = "static-service-comparison",
}: StaticServiceComparisonTableSectionProps) {
  const columnClasses =
    "grid grid-cols-[minmax(0,1fr)_4rem_4rem] items-center gap-x-2 sm:grid-cols-[minmax(0,1fr)_8rem_8rem] sm:gap-x-4";

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
        <header className="max-w-2xl text-center">
          <h2
            id={sectionId}
            className="text-xl font-bold leading-tight text-foreground sm:text-2xl xl:text-3xl"
          >
            {title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {subtitle}
          </p>
        </header>

        <div className="w-full overflow-hidden rounded-2xl border border-border/60 bg-background shadow-sm lg:mx-auto lg:max-w-4xl xl:max-w-5xl">
          <div
            className={cn(
              columnClasses,
              "bg-foreground px-4 py-4 text-background sm:px-6",
            )}
          >
            <span className="text-sm font-bold uppercase tracking-wide sm:text-base">
              {benefitsHeading}
            </span>
            <span className="text-center text-xs font-semibold leading-tight sm:text-sm">
              {specialHeading}
            </span>
            <span className="text-center text-xs font-semibold leading-tight text-background/80 sm:text-sm">
              {commonHeading}
            </span>
          </div>

          <ul className="m-0 list-none">
            {rows.map((row, index) => (
              <li
                key={row.id}
                className={cn(
                  columnClasses,
                  "px-4 py-3.5 sm:px-6",
                  index % 2 === 1 ? "bg-muted/40" : "bg-background",
                )}
              >
                <span className="min-w-0 text-sm leading-snug text-foreground sm:text-base">
                  {row.label}
                </span>
                <span className="flex justify-center">
                  <ComparisonMark
                    active={row.special}
                    checkIconSrc={checkIconSrc}
                    timesIconSrc={timesIconSrc}
                    yesLabel={yesLabel}
                    noLabel={noLabel}
                  />
                </span>
                <span className="flex justify-center">
                  <ComparisonMark
                    active={row.common}
                    checkIconSrc={checkIconSrc}
                    timesIconSrc={timesIconSrc}
                    yesLabel={yesLabel}
                    noLabel={noLabel}
                  />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
