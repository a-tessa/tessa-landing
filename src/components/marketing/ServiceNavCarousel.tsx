import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { ServiceNavItem } from "@/lib/servicos/nav";
import { cn, freeSectionShellSpacing, serviceCarouselCss } from "@/lib/utils";

interface ServiceNavCarouselProps {
  locale: string;
  items: ServiceNavItem[];
  activeSlug: string;
}

export async function ServiceNavCarousel({
  locale,
  items,
  activeSlug,
}: ServiceNavCarouselProps) {
  const t = await getTranslations({
    locale,
    namespace: "pages.servicoDetail",
  });

  if (items.length === 0) return null;

  const isActive = (candidateSlug: string) => candidateSlug === activeSlug;

  const activeIndex = items.findIndex((item) => item.slug === activeSlug);

  return (
    <>
      <style href="service-heading-carousel" precedence="component">
        {serviceCarouselCss}
      </style>
      <div className="relative h-auto w-fit">
        <nav
          aria-label={t("serviceNav")}
          className={cn("service-heading-carousel z-50", freeSectionShellSpacing)}
        >
          <Carousel
            className="flex overflow-hidden rounded-full bg-muted"
            opts={{
              align: "center",
              startIndex: activeIndex >= 0 ? activeIndex : 0,
            }}
          >
            <CarouselContent className="flex w-full gap-4 rounded-full px-8">
              {items.map((item) => (
                <CarouselItem
                  key={item.slug}
                  className="flex h-20 basis-auto items-center"
                >
                  <Link
                    href={`/servicos/${item.slug}`}
                    aria-current={isActive(item.slug) ? "page" : undefined}
                    className={cn(
                      "relative text-xs uppercase text-foreground",
                      isActive(item.slug)
                        ? "font-bold text-primary underline-offset-8"
                        : "",
                    )}
                  >
                    {item.title}
                    <span
                      className={cn(
                        "absolute -bottom-8 left-0 h-[3px] rounded-full bg-primary transition-all duration-300",
                        isActive(item.slug)
                          ? "w-full opacity-100"
                          : "w-0 opacity-0",
                      )}
                    />
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </nav>
      </div>
    </>
  );
}
