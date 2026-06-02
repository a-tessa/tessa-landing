import Image from "next/image";
import { cn, freeSectionShellSpacing } from "@/lib/utils";

export interface StaticServiceInfoCardItem {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

interface StaticServiceInfoCardsSectionProps {
  items: StaticServiceInfoCardItem[];
  sectionLabel: string;
  sectionId?: string;
}

export function StaticServiceInfoCardsSection({
  items,
  sectionLabel,
  sectionId = "static-service-info-cards",
}: StaticServiceInfoCardsSectionProps) {
  return (
    <section
      aria-labelledby={sectionId}
      aria-label={sectionLabel}
      className="w-full bg-white py-12 sm:py-16 lg:py-20"
    >
      <div className={cn(freeSectionShellSpacing)}>
        <h2 id={sectionId} className="sr-only">
          {sectionLabel}
        </h2>

        <ul className="m-0 grid list-none grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:gap-10">
          {items.map((item) => (
            <li key={item.id} className="min-w-0">
              <article className="flex w-full min-w-0 flex-col">
                <figure className="m-0 w-full overflow-hidden rounded-lg">
                  <Image
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    width={341}
                    height={341}
                    className="aspect-square h-auto w-full object-cover"
                    sizes="(max-width: 768px) 85vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </figure>

                <div className="mt-6 flex w-full min-w-0 flex-col">
                  <h3 className="text-lg font-semibold leading-snug text-foreground sm:text-xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {item.description}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
