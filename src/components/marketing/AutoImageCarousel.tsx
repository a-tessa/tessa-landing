"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface AutoImageCarouselImage {
  src: string;
  alt: string;
}

interface AutoImageCarouselProps {
  images: AutoImageCarouselImage[];
  label: string;
  intervalMs?: number;
  className?: string;
}

const DESKTOP_SLIDES_PER_VIEW = 3;

function createLoopSlides(
  images: AutoImageCarouselImage[],
  visibleCount: number,
): AutoImageCarouselImage[] {
  if (images.length === 0) return [];

  const minSlides = Math.max(visibleCount + 1, visibleCount * 2);
  if (images.length >= minSlides) return images;

  const loopSlides: AutoImageCarouselImage[] = [];
  while (loopSlides.length < minSlides) {
    loopSlides.push(...images);
  }

  return loopSlides;
}

export function AutoImageCarousel({
  images,
  label,
  intervalMs = 4000,
  className,
}: AutoImageCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const isHoveredRef = useRef(false);
  const autoplayTimeoutRef = useRef<number | null>(null);
  const loopSlides = useMemo(
    () => createLoopSlides(images, DESKTOP_SLIDES_PER_VIEW),
    [images],
  );

  const clearAutoplay = useCallback(() => {
    if (autoplayTimeoutRef.current !== null) {
      window.clearTimeout(autoplayTimeoutRef.current);
      autoplayTimeoutRef.current = null;
    }
  }, []);

  const scheduleAutoplay = useCallback(() => {
    if (!api) return;

    clearAutoplay();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (isHoveredRef.current) return;

    autoplayTimeoutRef.current = window.setTimeout(() => {
      api.scrollNext();
    }, intervalMs);
  }, [api, clearAutoplay, intervalMs]);

  const handleMouseEnter = useCallback(() => {
    isHoveredRef.current = true;
    clearAutoplay();
  }, [clearAutoplay]);

  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
    scheduleAutoplay();
  }, [scheduleAutoplay]);

  useEffect(() => {
    if (!api) return;

    const handleResize = (): void => {
      api.reInit();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [api]);

  useEffect(() => {
    if (!api) return;

    const handlePointerDown = (): void => {
      clearAutoplay();
    };

    const handleSettle = (): void => {
      if (!isHoveredRef.current) {
        scheduleAutoplay();
      }
    };

    api.on("pointerDown", handlePointerDown);
    api.on("settle", handleSettle);

    return () => {
      api.off("pointerDown", handlePointerDown);
      api.off("settle", handleSettle);
    };
  }, [api, clearAutoplay, scheduleAutoplay]);

  useEffect(() => {
    scheduleAutoplay();
    return clearAutoplay;
  }, [scheduleAutoplay, clearAutoplay]);

  if (loopSlides.length === 0) return null;

  return (
    <section
      aria-label={label}
      aria-roledescription="carousel"
      className={cn("w-full overflow-hidden", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Carousel
        setApi={setApi}
        opts={{ loop: true, align: "start", duration: 50 }}
        className="w-full"
      >
        <CarouselContent className="ml-0">
          {loopSlides.map((image, index) => (
            <CarouselItem
              key={`${image.src}-${index}`}
              className="basis-full pl-0 lg:basis-1/3"
            >
              <div className="relative h-[300px] w-full lg:h-[min(25vw,400px)]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover object-center"
                  sizes="100vw lg:33vw"
                  priority={index < DESKTOP_SLIDES_PER_VIEW}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          className="left-2"
          onPointerDown={clearAutoplay}
        />
        <CarouselNext
          className="right-2"
          onPointerDown={clearAutoplay}
        />
      </Carousel>
    </section>
  );
}
