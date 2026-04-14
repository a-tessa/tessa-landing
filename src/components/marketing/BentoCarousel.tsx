"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn, insideCardSpacing } from "@/lib/utils";

interface BentoImage {
  src: string;
  alt: string;
  span?: string;
}

interface BentoSlide {
  images: BentoImage[];
}

interface BentoCarouselProps {
  slides: BentoSlide[];
  className?: string;
}

export function BentoCarousel({ slides, className }: BentoCarouselProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <MobileCarousel slides={slides} />
      <DesktopBento slides={slides} />
    </div>
  );
}

function MobileCarousel({ slides }: { slides: BentoSlide[] }) {
  const t = useTranslations("operations");
  const allImages = slides.flatMap((s) => s.images);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const index = Math.round(scrollLeft / clientWidth);
    setActiveIndex(Math.min(index, allImages.length - 1));
  }, [allImages.length]);

  const scrollTo = (index: number): void => {
    if (!scrollRef.current) return;
    const { clientWidth } = scrollRef.current;
    scrollRef.current.scrollTo({ left: clientWidth * index, behavior: "smooth" });
  };

  const handlePrev = (): void => {
    scrollTo(Math.max(0, activeIndex - 1));
  };

  const handleNext = (): void => {
    scrollTo(Math.min(allImages.length - 1, activeIndex + 1));
  };

  return (
    <div className="relative md:hidden overflow-hidden rounded-3xl bg-primary bg-[url('/operations-section-bg.webp')] bg-cover bg-center bg-no-repeat">
      <div className={cn("flex flex-col", insideCardSpacing)}>
        <div className="pb-6 pt-10">
          <h3 className="whitespace-pre-line font-barlow text-3xl font-bold uppercase leading-tight text-white">
            {t("title")}
          </h3>
          <p className="mt-4 max-w-[220px] text-xs font-medium uppercase tracking-[0.14em] text-white/70">
            {t("subtitle")}
          </p>
        </div>
      </div>

      <div className="relative px-4 pb-4">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none]"
        >
          {allImages.map((img, i) => (
            <motion.div
              key={`mobile-${i}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.05 * Math.min(i, 3) }}
              className="relative aspect-4/3 w-full shrink-0 snap-center overflow-hidden rounded-2xl"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="90vw"
                className="object-cover"
              />
            </motion.div>
          ))}
        </div>

        <button
          type="button"
          onClick={handlePrev}
          disabled={activeIndex === 0}
          className="absolute left-6 top-1/2 z-10 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-secondary text-white shadow-lg transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-0"
          aria-label={t("prevImage")}
        >
          <IconArrowNarrowLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={activeIndex === allImages.length - 1}
          className="absolute right-6 top-1/2 z-10 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-secondary text-white shadow-lg transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-0"
          aria-label={t("nextImage")}
        >
          <IconArrowNarrowRight className="size-5" />
        </button>
      </div>

      <div className="flex justify-center gap-1.5 pb-6">
        {allImages.map((_, i) => (
          <button
            key={`dot-${i}`}
            type="button"
            onClick={() => scrollTo(i)}
            className={cn(
              "size-2 rounded-full transition-all duration-300",
              i === activeIndex ? "w-6 bg-white" : "bg-white/40",
            )}
            aria-label={t("goToImage", { number: i + 1 })}
          />
        ))}
      </div>
    </div>
  );
}

function DesktopBento({ slides }: { slides: BentoSlide[] }) {
  const t = useTranslations("operations");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 1);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, []);

  const handleScrollLeft = (): void => {
    scrollRef.current?.scrollBy({ left: -600, behavior: "smooth" });
  };

  const handleScrollRight = (): void => {
    scrollRef.current?.scrollBy({ left: 600, behavior: "smooth" });
  };

  useEffect(() => {
    checkScrollability();
    window.addEventListener("resize", checkScrollability);
    return () => window.removeEventListener("resize", checkScrollability);
  }, [checkScrollability]);

  return (
    <div className="relative hidden md:block">
      <div
        ref={scrollRef}
        onScroll={checkScrollability}
        className={cn(
          "flex w-full items-stretch overflow-x-scroll overscroll-x-auto scroll-smooth rounded-3xl bg-primary [scrollbar-width:none] h-250 bg-[url('/operations-section-bg.webp')] bg-cover bg-center bg-no-repeat py-12",
          insideCardSpacing,
        )}
      >
        <div className="relative flex shrink-0 flex-col justify-center pb-12 pt-10 lg:w-[300px] lg:pb-14">
          <div className="relative z-10">
            <h3 className="whitespace-pre-line font-barlow text-3xl font-bold uppercase leading-tight text-white lg:text-4xl">
              {t("title")}
            </h3>
            <p className="mt-4 max-w-[220px] text-xs font-medium uppercase tracking-[0.14em] text-white/70">
              {t("subtitle")}
            </p>
          </div>
        </div>

        {slides.map((slide, slideIndex) => (
          <motion.div
            key={`bento-${slideIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.5,
                delay: 0.12 * (slideIndex + 1),
                ease: "easeOut",
              },
            }}
            className="grid shrink-0 grid-cols-6 grid-rows-3 gap-8 h-full w-[560px] lg:w-[780px] p-4"
          >
            {slide.images.map((img, imgIndex) => (
              <div
                key={`${slideIndex}-${imgIndex}`}
                className={cn(
                  "relative overflow-hidden rounded-xl lg:rounded-2xl",
                  img.span ?? getDefaultSpan(imgIndex),
                )}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 45vw, 22vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleScrollLeft}
        disabled={!canScrollLeft}
        className="absolute left-4 top-1/2 z-30 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-secondary text-white shadow-lg transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-0 lg:size-12"
        aria-label={t("prevImages")}
      >
        <IconArrowNarrowLeft className="size-5 lg:size-6" />
      </button>
      <button
        type="button"
        onClick={handleScrollRight}
        disabled={!canScrollRight}
        className="absolute right-4 top-1/2 z-30 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-secondary text-white shadow-lg transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-0 lg:size-12"
        aria-label={t("nextImages")}
      >
        <IconArrowNarrowRight className="size-5 lg:size-6" />
      </button>
    </div>
  );
}

/**
 * Default bento layout for a 3-row × 6-col grid with 6 images.
 *
 * ┌──────────┬───────────────┬──────────┐
 * │  img[0]  │    img[1]     │  img[2]  │
 * │  2×2     │    2×2        │  2×1     │
 * │          │               ├──────────┤
 * │          │               │  img[3]  │
 * ├──────────┴───────────────┤  2×1     │
 * │       img[4]             ├──────────┤
 * │       4×1                │  img[5]  │
 * │                          │  2×1     │
 * └──────────────────────────┴──────────┘
 */
function getDefaultSpan(index: number): string {
  const spans: Record<number, string> = {
    0: "col-span-4 row-span-1",
    1: "col-span-2 row-span-2",
    2: "col-span-2 row-span-1",
    3: "col-span-2 row-span-1",
    4: "col-span-4 row-span-1",
    5: "col-span-2 row-span-1",
  };
  return spans[index] ?? "col-span-1 row-span-1";
}
