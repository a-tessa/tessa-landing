"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion } from "motion/react";
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconX,
} from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "radix-ui";
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
  const [openImage, setOpenImage] = useState<BentoImage | null>(null);

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
            <motion.button
              key={`mobile-${i}`}
              type="button"
              onClick={() => setOpenImage(img)}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.05 * Math.min(i, 3) }}
              className="relative aspect-4/3 w-full shrink-0 cursor-pointer snap-center overflow-hidden rounded-2xl"
              aria-label={t("expandImage")}
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

      <Dialog
        open={openImage !== null}
        onOpenChange={(open) => !open && setOpenImage(null)}
      >
        <DialogContent
          showCloseButton={false}
          className="grid max-w-[calc(100%-1.5rem)] gap-0 overflow-hidden border-0 bg-primary p-0 sm:max-w-2xl"
        >
          <VisuallyHidden.Root>
            <DialogTitle>{openImage?.alt ?? ""}</DialogTitle>
          </VisuallyHidden.Root>
          {openImage && (
            <>
              <div className="relative aspect-4/3 w-full">
                <Image
                  src={openImage.src}
                  alt={openImage.alt}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority
                />
                <button
                  type="button"
                  onClick={() => setOpenImage(null)}
                  className="absolute right-3 top-3 flex size-9 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
                  aria-label={t("closeImage")}
                >
                  <IconX className="size-5" />
                </button>
              </div>
              <div className="max-h-[40vh] overflow-y-auto bg-primary px-5 py-4">
                <p className="wrap-break-word text-sm leading-relaxed text-white/90">
                  {t("imageDescription")}
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DesktopBento({ slides }: { slides: BentoSlide[] }) {
  const t = useTranslations("operations");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [expanded, setExpanded] = useState<{
    slideIndex: number;
    colIndex: number;
    image: BentoImage;
  } | null>(null);

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

  useEffect(() => {
    if (!expanded) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [expanded]);

  return (
    <div className="relative hidden md:block">
      <div
        ref={scrollRef}
        onScroll={checkScrollability}
        className={cn(
          "relative flex w-full items-stretch overflow-x-scroll overscroll-x-auto scroll-smooth rounded-3xl bg-primary [scrollbar-width:none] h-176 bg-[url('/operations-section-bg.webp')] bg-cover bg-center bg-no-repeat py-12",
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

        {slides.map((slide, slideIndex) => {
          const columns = chunkPairs(slide.images);
          const isExpandedSlide = expanded?.slideIndex === slideIndex;

          return (
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
              layout
              transition={{ layout: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
              className={cn(
                "relative shrink-0 h-full p-4",
                isExpandedSlide
                  ? "w-[820px] lg:w-[1100px]"
                  : "w-[560px] lg:w-[780px]",
              )}
            >
              <motion.div
                layout
                className="flex h-full gap-6"
              >
                {columns.map((col, colIndex) => {
                  const isExpandedCol =
                    isExpandedSlide && expanded?.colIndex === colIndex;

                  return (
                    <motion.div
                      key={`col-${slideIndex}-${colIndex}`}
                      layout
                      transition={{
                        layout: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                      }}
                      className={cn(
                        "relative flex h-full min-w-0 flex-col gap-6",
                        isExpandedCol
                          ? "flex-3"
                          : isExpandedSlide
                            ? "flex-1 opacity-70"
                            : "flex-1",
                      )}
                    >
                      {isExpandedCol && expanded ? (
                        <motion.div
                          key={`expanded-${slideIndex}-${colIndex}`}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.25, delay: 0.15 }}
                          className="flex h-full flex-col overflow-hidden rounded-xl lg:rounded-2xl"
                        >
                          <div className="relative w-full flex-1 min-h-0">
                            <Image
                              src={expanded.image.src}
                              alt={expanded.image.alt}
                              fill
                              sizes="(max-width: 1024px) 60vw, 720px"
                              className="object-cover"
                              priority
                            />
                            <button
                              type="button"
                              onClick={() => setExpanded(null)}
                              className="absolute right-3 top-3 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
                              aria-label={t("collapseImage")}
                            >
                              <IconX className="size-5" />
                            </button>
                          </div>
                          <div className="max-h-[35%] shrink-0 overflow-y-auto bg-neutral-400 px-5 py-4">
                            <p className="wrap-break-word text-sm leading-relaxed text-white/90 lg:text-base">
                              {t("imageDescription")}
                            </p>
                          </div>
                        </motion.div>
                      ) : (
                        col.map((img, imgIndex) => (
                          <motion.button
                            key={`${slideIndex}-${colIndex}-${imgIndex}`}
                            type="button"
                            onClick={() =>
                              setExpanded({
                                slideIndex,
                                colIndex,
                                image: img,
                              })
                            }
                            layout
                            className="group relative h-full min-h-0 flex-1 cursor-pointer overflow-hidden rounded-xl lg:rounded-2xl"
                            aria-label={t("expandImage")}
                          >
                            <Image
                              src={img.src}
                              alt={img.alt}
                              fill
                              sizes="(max-width: 1024px) 30vw, 260px"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </motion.button>
                        ))
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          );
        })}
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
 * Splits a flat image list into vertical column pairs (2 stacked images per column).
 *
 * Layout: each slide renders as N columns; each column shows 2 images stacked vertically.
 *
 * ┌────────┬────────┬────────┐
 * │ img[0] │ img[2] │ img[4] │
 * ├────────┼────────┼────────┤
 * │ img[1] │ img[3] │ img[5] │
 * └────────┴────────┴────────┘
 */
function chunkPairs<T>(items: T[]): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    result.push(items.slice(i, i + 2));
  }
  return result;
}
