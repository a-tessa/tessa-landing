"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
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
}

interface BentoCarouselServicesProps {
  images: BentoImage[];
  className?: string;
}

const GROUP_SIZE = 4;

/**
 * Repeating bento pattern (3 columns × 4 rows per group):
 *
 * ┌──────┬──────┬──────┐
 * │      │  #2  │      │
 * │  #1  │ 1×2  │  #4  │
 * │ 1×4  ├──────┤ 1×4  │
 * │      │  #3  │      │
 * │      │ 1×2  │      │
 * └──────┴──────┴──────┘
 */
function getGroupSpan(indexInGroup: number): string {
  const spans: Record<number, string> = {
    0: "col-start-1 row-start-1 row-span-4",
    1: "col-start-2 row-start-1 row-span-2",
    2: "col-start-2 row-start-3 row-span-2",
    3: "col-start-3 row-start-1 row-span-4",
  };
  return spans[indexInGroup] ?? "col-span-1 row-span-1";
}

function chunkImages(images: BentoImage[]): BentoImage[][] {
  const chunks: BentoImage[][] = [];
  for (let i = 0; i < images.length; i += GROUP_SIZE) {
    chunks.push(images.slice(i, i + GROUP_SIZE));
  }
  return chunks;
}

export function BentoCarouselServices({
  images,
  className,
}: BentoCarouselServicesProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <MobileCarousel images={images} />
      <DesktopBento images={images} className={className} />
    </div>
  );
}

function MobileCarousel({ images }: { images: BentoImage[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const index = Math.round(scrollLeft / clientWidth);
    setActiveIndex(Math.min(index, images.length - 1));
  }, [images.length]);

  const scrollTo = (index: number): void => {
    if (!scrollRef.current) return;
    const { clientWidth } = scrollRef.current;
    scrollRef.current.scrollTo({
      left: clientWidth * index,
      behavior: "smooth",
    });
  };

  const handlePrev = (): void => {
    scrollTo(Math.max(0, activeIndex - 1));
  };

  const handleNext = (): void => {
    scrollTo(Math.min(images.length - 1, activeIndex + 1));
  };

  return (
    <div className="relative md:hidden overflow-hidden rounded-3xl bg-[url('/operations-section-bg.webp')] bg-cover bg-primary bg-center bg-no-repeat">
      <div className="relative px-4 py-4">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none]"
        >
          {images.map((img, i) => (
            <motion.div
              key={`mobile-svc-${i}`}
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
          aria-label="Imagem anterior"
        >
          <IconArrowNarrowLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={activeIndex === images.length - 1}
          className="absolute right-6 top-1/2 z-10 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-secondary text-white shadow-lg transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-0"
          aria-label="Próxima imagem"
        >
          <IconArrowNarrowRight className="size-5" />
        </button>
      </div>

      <div className="flex justify-center gap-1.5 pb-4">
        {images.map((_, i) => (
          <button
            key={`dot-svc-${i}`}
            type="button"
            onClick={() => scrollTo(i)}
            className={cn(
              "size-2 rounded-full transition-all duration-300",
              i === activeIndex ? "w-6 bg-white" : "bg-white/40",
            )}
            aria-label={`Ir para imagem ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function DesktopBento({
  images,
  className,
}: {
  images: BentoImage[];
  className?: string;
}) {
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

  const groups = chunkImages(images);

  return (
    <div className={cn("relative hidden md:block", className)}>
      <div
        ref={scrollRef}
        onScroll={checkScrollability}
        className="flex w-full items-stretch overflow-x-scroll overscroll-x-auto scroll-smooth rounded-3xl bg-primary [scrollbar-width:none] h-full bg-[url('/operations-section-bg.webp')] bg-cover bg-center bg-no-repeat py-26 px-20"
      >
        <div className="flex gap-6">
          {groups.map((group, groupIndex) => (
            <div
              key={`group-${groupIndex}`}
              className="grid h-full w-[500px] shrink-0 grid-cols-3 grid-rows-4 gap-6 lg:w-[640px]"
            >
              {group.map((img, imgIndex) => {
                const globalIndex = groupIndex * GROUP_SIZE + imgIndex;
                return (
                  <motion.div
                    key={`img-${globalIndex}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.5,
                        delay: 0.08 * globalIndex,
                        ease: "easeOut",
                      },
                    }}
                    className={cn(
                      "group relative overflow-hidden rounded-2xl",
                      getGroupSpan(imgIndex),
                    )}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

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
