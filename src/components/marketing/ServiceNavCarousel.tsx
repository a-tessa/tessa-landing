"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { ServiceNavItem } from "@/lib/servicos/nav";
import { cn, freeSectionShellSpacing, serviceCarouselCss } from "@/lib/utils";

interface ServiceNavCarouselProps {
  locale: string;
  items: ServiceNavItem[];
  activeSlug: string;
}

export function ServiceNavCarousel({
  items,
  activeSlug,
}: ServiceNavCarouselProps) {
  const t = useTranslations("pages.servicoDetail");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const activeItem = activeItemRef.current;
    if (!scroller || !activeItem) return;

    const scrollerRect = scroller.getBoundingClientRect();
    const itemRect = activeItem.getBoundingClientRect();
    const itemCenterWithinScroller =
      scroller.scrollLeft +
      (itemRect.left - scrollerRect.left) +
      itemRect.width / 2;
    const target = itemCenterWithinScroller - scroller.clientWidth / 2;
    const maxScroll = scroller.scrollWidth - scroller.clientWidth;

    scroller.scrollLeft = Math.max(0, Math.min(target, maxScroll));
  }, [activeSlug, items]);

  if (items.length === 0) return null;

  const isActive = (candidateSlug: string) => candidateSlug === activeSlug;

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
          <div className="relative flex overflow-hidden rounded-full bg-muted">
            <div
              ref={scrollerRef}
              className="flex w-full items-center gap-4 overflow-x-auto rounded-full px-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {items.map((item) => (
                <div
                  key={item.slug}
                  ref={isActive(item.slug) ? activeItemRef : undefined}
                  className="flex h-20 shrink-0 items-center"
                >
                  <Link
                    href={`/servicos/${item.slug}`}
                    aria-current={isActive(item.slug) ? "page" : undefined}
                    className={cn(
                      "relative whitespace-nowrap text-xs uppercase text-foreground",
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
                </div>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
