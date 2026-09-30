"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconX,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { VisuallyHidden } from "radix-ui";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const t = useTranslations("pages.servicoDetail");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className={cn("relative w-full", className)}>
      <MobileCarousel
        images={images}
        expandLabel={t("expandImage")}
        onExpand={setExpandedIndex}
      />
      <DesktopBento
        images={images}
        className={className}
        expandLabel={t("expandImage")}
        onExpand={setExpandedIndex}
      />
      <ServiceImageLightbox
        images={images}
        index={expandedIndex}
        onIndexChange={setExpandedIndex}
        onClose={() => setExpandedIndex(null)}
      />
    </div>
  );
}

function MobileCarousel({
  images,
  expandLabel,
  onExpand,
}: {
  images: BentoImage[];
  expandLabel: string;
  onExpand: (index: number) => void;
}) {
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
            <motion.button
              key={`mobile-svc-${i}`}
              type="button"
              onClick={() => onExpand(i)}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.05 * Math.min(i, 3) }}
              className="relative aspect-4/3 w-full shrink-0 cursor-pointer snap-center overflow-hidden rounded-2xl border-0 bg-transparent p-0 text-left"
              aria-label={expandLabel}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="90vw"
                className="object-cover"
              />
            </motion.button>
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
  expandLabel,
  onExpand,
}: {
  images: BentoImage[];
  className?: string;
  expandLabel: string;
  onExpand: (index: number) => void;
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
                  <motion.button
                    key={`img-${globalIndex}`}
                    type="button"
                    onClick={() => onExpand(globalIndex)}
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
                      "group relative cursor-pointer overflow-hidden rounded-2xl border-0 bg-transparent p-0 text-left",
                      getGroupSpan(imgIndex),
                    )}
                    aria-label={expandLabel}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </motion.button>
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

function ServiceImageLightbox({
  images,
  index,
  onIndexChange,
  onClose,
}: {
  images: BentoImage[];
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}) {
  const t = useTranslations("pages.servicoDetail");
  const image = index === null ? null : images[index] ?? null;
  const hasPrevious = index !== null && index > 0;
  const hasNext = index !== null && index < images.length - 1;

  useEffect(() => {
    if (index === null) return;

    const handleKey = (event: KeyboardEvent): void => {
      if (event.key === "ArrowLeft" && index > 0) {
        event.preventDefault();
        onIndexChange(index - 1);
      }
      if (event.key === "ArrowRight" && index < images.length - 1) {
        event.preventDefault();
        onIndexChange(index + 1);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [images.length, index, onIndexChange]);

  return (
    <Dialog
      open={image !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="grid max-w-[calc(100%-1.5rem)] gap-0 overflow-hidden border-0 bg-black p-0 sm:max-w-5xl"
      >
        <VisuallyHidden.Root>
          <DialogTitle>{image?.alt ?? t("expandImage")}</DialogTitle>
        </VisuallyHidden.Root>

        {image ? (
          <div className="relative h-[min(80vh,760px)] w-full bg-black">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 100vw, 64rem"
              className="object-contain"
              priority
            />
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 z-10 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
              aria-label={t("closeImage")}
            >
              <IconX className="size-5" />
            </button>
            {images.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    if (index !== null && hasPrevious) onIndexChange(index - 1);
                  }}
                  disabled={!hasPrevious}
                  className="absolute top-1/2 left-3 z-10 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80 disabled:pointer-events-none disabled:opacity-0"
                  aria-label={t("prevImage")}
                >
                  <IconArrowNarrowLeft className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (index !== null && hasNext) onIndexChange(index + 1);
                  }}
                  disabled={!hasNext}
                  className="absolute top-1/2 right-3 z-10 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80 disabled:pointer-events-none disabled:opacity-0"
                  aria-label={t("nextImage")}
                >
                  <IconArrowNarrowRight className="size-5" />
                </button>
              </>
            ) : null}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
