import { cn, freeSectionShellSpacing } from "@/lib/utils";

export interface StaticServiceInfoColumn {
  id: string;
  title: string;
  description: string;
}

interface StaticServiceInfoColumnsSectionProps {
  columns: StaticServiceInfoColumn[];
  sectionId?: string;
  sectionLabel: string;
}

export function StaticServiceInfoColumnsSection({
  columns,
  sectionId = "static-service-info-columns",
  sectionLabel,
}: StaticServiceInfoColumnsSectionProps) {
  return (
    <section
      aria-labelledby={sectionId}
      className="w-full bg-white py-12 sm:py-16 lg:py-20"
    >
      <h2 id={sectionId} className="sr-only">
        {sectionLabel}
      </h2>

      <ul
        className={cn(
          freeSectionShellSpacing,
          "grid list-none grid-cols-1 gap-10 md:grid-cols-3 md:gap-8 lg:gap-12",
        )}
      >
        {columns.map((column) => (
          <li key={column.id}>
            <article className="text-neutral-700">
              <h3 className="text-lg font-bold leading-snug sm:text-base">
                {column.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed sm:text-xs">
                {column.description}
              </p>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
