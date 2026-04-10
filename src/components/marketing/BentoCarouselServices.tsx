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
    <div className={cn("relative w-full", className)}>
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
