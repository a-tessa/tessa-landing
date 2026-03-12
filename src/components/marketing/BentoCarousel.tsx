"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

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

  const handleScrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -600, behavior: "smooth" });
  };

  const handleScrollRight = () => {
    scrollRef.current?.scrollBy({ left: 600, behavior: "smooth" });
  };

  useEffect(() => {
    checkScrollability();
    window.addEventListener("resize", checkScrollability);
    return () => window.removeEventListener("resize", checkScrollability);
  }, [checkScrollability]);

  return (
    <div className={cn("relative w-full", className)}>
      {/* Scrollable area — full width, includes left panel + bentos */}
      <div
        ref={scrollRef}
        onScroll={checkScrollability}
        className="flex w-full items-stretch overflow-x-scroll overscroll-x-auto scroll-smooth rounded-3xl bg-primary [scrollbar-width:none] h-250 bg-[url('/operations-section-bg.webp')] bg-cover bg-center bg-no-repeat pl-76 py-12"
      >
        {/* Title card — first item in the carousel */}
        <div className="relative flex shrink-0 flex-col justify-center px-8 pb-12 pt-10 lg:w-[300px] lg:px-10 lg:pb-14">
          <div className="relative z-10">
            <h3 className="font-barlow text-3xl font-bold uppercase leading-tight text-white lg:text-4xl">
              Nossas
              <br />
              operações,
              <br />
              na prática
            </h3>
            <p className="mt-4 max-w-[220px] text-xs font-medium uppercase tracking-[0.14em] text-white/70">
              Acompanhe imagens que mostram como a engenharia ganha forma.
            </p>
          </div>
        </div>

        {/* Bento grids — continuous scroll */}
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

      {/* Navigation arrows — outside the scroll, absolutely positioned */}
      <button
        type="button"
        onClick={handleScrollLeft}
        disabled={!canScrollLeft}
        className="absolute left-4 top-1/2 z-30 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-secondary text-white shadow-lg transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-0 lg:size-12"
        aria-label="Imagens anteriores"
      >
        <IconArrowNarrowLeft className="size-5 lg:size-6" />
      </button>
      <button
        type="button"
        onClick={handleScrollRight}
        disabled={!canScrollRight}
        className="absolute right-4 top-1/2 z-30 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-secondary text-white shadow-lg transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-0 lg:size-12"
        aria-label="Próximas imagens"
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
