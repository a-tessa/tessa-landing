import Image from "next/image";
import { HorizontalScrollWithHints } from "@/components/marketing/HorizontalScrollWithHints";
import { cn, freeSectionShellSpacing } from "@/lib/utils";
import type { EstruturasMetalicasProduct } from "@/lib/servicos/estruturas-metalicas-products";

interface StaticServiceProductGridProps {
  title: string;
  subtitle: string;
  products: EstruturasMetalicasProduct[];
  productsScrollLabel: string;
  scrollLeftLabel: string;
  scrollRightLabel: string;
  sectionId?: string;
}

export function StaticServiceProductGrid({
  title,
  subtitle,
  products,
  productsScrollLabel,
  scrollLeftLabel,
  scrollRightLabel,
  sectionId = "static-service-products",
}: StaticServiceProductGridProps) {
  return (
    <section
      aria-labelledby={sectionId}
      className="w-full bg-white py-12 sm:py-16 lg:py-20"
    >
      <div className={cn(freeSectionShellSpacing, "flex flex-col gap-8")}>
        <div className="max-w-3xl text-left">
          <h2
            id={sectionId}
            className="text-2xl font-bold leading-tight text-foreground sm:text-3xl lg:text-4xl"
          >
            {title}
          </h2>
          <div
            className="mt-4 h-1 w-20 rounded-full bg-chart-5"
            aria-hidden
          />
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {subtitle}
          </p>
        </div>

        <HorizontalScrollWithHints
          ariaLabel={productsScrollLabel}
          scrollLeftLabel={scrollLeftLabel}
          scrollRightLabel={scrollRightLabel}
          stackFrom="md"
          className="-mx-3.5 sm:-mx-24 md:mx-0"
        >
          <ul className="flex w-max min-w-full snap-x snap-mandatory gap-4 px-3.5 pb-1 sm:px-24 md:grid md:w-full md:grid-cols-4 md:gap-x-8 md:gap-y-6 md:px-0 md:pb-0">
            {products.map((product) => (
              <li
                key={product.id}
                className="w-40 shrink-0 snap-start justify-self-start md:w-full md:max-w-40 md:shrink"
              >
                <article className="flex h-full flex-col items-start">
                  <div className="relative aspect-square w-full max-w-40 overflow-hidden rounded-2xl">
                    <Image
                      src={product.src}
                      alt={product.name}
                      fill
                      className="object-contain"
                      sizes="10rem"
                    />
                  </div>
                  <p className="mt-1 text-left text-sm font-semibold leading-snug text-foreground">
                    {product.name}
                  </p>
                </article>
              </li>
            ))}
          </ul>
        </HorizontalScrollWithHints>
      </div>
    </section>
  );
}
