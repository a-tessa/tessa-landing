import Image from "next/image";
import { cn, freeSectionShellSpacing } from "@/lib/utils";
import type { EstruturasMetalicasProduct } from "@/lib/servicos/estruturas-metalicas-products";

interface StaticServiceProductGridProps {
  title: string;
  subtitle: string;
  products: EstruturasMetalicasProduct[];
  sectionId?: string;
}

export function StaticServiceProductGrid({
  title,
  subtitle,
  products,
  sectionId = "static-service-products",
}: StaticServiceProductGridProps) {
  return (
    <section
      aria-labelledby={sectionId}
      className="w-full py-12 sm:py-16 lg:py-20 bg-white"
    >
      <div className={cn(freeSectionShellSpacing, "flex flex-col gap-8")}>
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id={sectionId}
            className="text-2xl font-bold leading-tight text-foreground sm:text-3xl lg:text-4xl"
          >
            {title}
          </h2>
          <div
            className="mx-auto mt-4 h-1 w-20 rounded-full bg-chart-5"
            aria-hidden
          />
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {subtitle}
          </p>
        </div>

        <ul className="flex flex-wrap gap-x-4 gap-y-6 lg:gap-x-15 justify-center">
            {products.map((product) => (
              <li key={product.id} className="w-40 max-w-40 shrink-0">
                <article className="flex h-full flex-col">
                  <div className="relative aspect-square w-full max-w-40 overflow-hidden rounded-2xl">
                    <Image
                      src={product.src}
                      alt={product.name}
                      fill
                      className="object-contain"
                      sizes="10rem"
                    />
                  </div>
                  <p className="mt-1 text-center text-sm font-semibold leading-snug text-foreground">
                    {product.name}
                  </p>
                </article>
              </li>
            ))}
          </ul>
      </div>
    </section>
  );
}
