"use client";

import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconStarFilled,
  IconUserCircle,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { WriteTestimonialDialog } from "@/components/marketing/WriteTestimonialDialog";
import type { PublicTestimonial } from "@/lib/api/types";
import { cn, freeSectionShellSpacing } from "@/lib/utils";

interface Testimonial {
  id: string;
  name: string;
  company: string;
  profileImage: string | null;
  reviewImage: string | null;
  rating: number;
  text: string;
}

function mapPublicTestimonial(item: PublicTestimonial): Testimonial {
  return {
    id: item.id,
    name: item.authorName,
    company: item.companyName ?? item.authorRole ?? "",
    profileImage: item.profileImageUrl,
    reviewImage: item.reviewImageUrl,
    rating: item.rating,
    text: item.comment,
  };
}

function getIndex(current: number, offset: number, length: number): number {
  return (current + offset + length) % length;
}

function Stars({ rating }: { rating: number }) {
  const t = useTranslations("testimonials");
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={t("starsLabel", { rating })}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <IconStarFilled
          key={`star-${i}`}
          className={cn(
            "size-3.5",
            i < rating ? "text-primary" : "text-muted-foreground/30",
          )}
        />
      ))}
    </div>
  );
}

function AvatarImage({
  src,
  alt,
  sizes,
  className,
  priority,
}: {
  src: string | null;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  if (!src) {
    return (
      <div
        className={cn(
          "flex size-full items-center justify-center bg-muted text-muted-foreground",
          className,
        )}
        aria-hidden
      >
        <IconUserCircle className="size-1/2" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={cn("object-cover", className)}
      sizes={sizes}
      priority={priority}
    />
  );
}

interface TestimonialsProps {
  items?: PublicTestimonial[] | null;
  className?: string;
}

export function Testimonials({ items, className }: TestimonialsProps = {}) {
  const t = useTranslations("testimonials");

  const resolvedTestimonials = useMemo<Testimonial[]>(() => {
    if (items && items.length > 0) {
      return items.map(mapPublicTestimonial);
    }
    return [];
  }, [items]);

  const length = resolvedTestimonials.length;
  const initialIndex = length > 1 ? 1 : 0;
  const [current, setCurrent] = useState(initialIndex);
  const [direction, setDirection] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current],
  );

  const prev = useCallback(() => {
    if (length === 0) return;
    setDirection(-1);
    setCurrent((c) => getIndex(c, -1, length));
  }, [length]);

  const next = useCallback(() => {
    if (length === 0) return;
    setDirection(1);
    setCurrent((c) => getIndex(c, 1, length));
  }, [length]);

  if (length === 0) {
    return (
      <section
        aria-labelledby="testimonials-title"
        className={cn("w-full pb-10", freeSectionShellSpacing, className)}
      >
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 rounded-3xl bg-card px-6 py-12 text-center shadow-sm sm:px-10 sm:py-16">
          <h2
            id="testimonials-title"
            className="whitespace-pre-line font-barlow text-2xl font-semibold uppercase text-primary sm:text-4xl leading-none"
          >
            {t("title")}
          </h2>
          <div className="flex flex-col gap-2">
            <p className="text-xl font-semibold text-foreground sm:text-2xl">
              {t("emptyTitle")}
            </p>
            <p className="text-sm text-muted-foreground sm:text-base">
              {t("emptyDescription")}
            </p>
          </div>
          <WriteTestimonialDialog>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-secondary px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              {t("writeTestimonial")}
              <IconArrowNarrowRight className="size-4" aria-hidden />
            </button>
          </WriteTestimonialDialog>
        </div>
      </section>
    );
  }

  const safeCurrent = current >= length ? 0 : current;
  const prevIdx = getIndex(safeCurrent, -1, length);
  const nextIdx = getIndex(safeCurrent, 1, length);
  const active = resolvedTestimonials[safeCurrent];
  const prevT = resolvedTestimonials[prevIdx];
  const nextT = resolvedTestimonials[nextIdx];
  const activeVisualImage = active.reviewImage ?? active.profileImage;
  const nextVisualImage = nextT.reviewImage ?? nextT.profileImage;

  return (
    <section
      aria-labelledby="testimonials-title"
      className={cn("w-full pb-10", freeSectionShellSpacing)}
      itemScope
      itemType="https://schema.org/Product"
    >
      <meta itemProp="name" content="Serviços Tessa" />

      {/* Structured data for aggregate rating */}
      <div
        itemProp="aggregateRating"
        itemScope
        itemType="https://schema.org/AggregateRating"
        className="sr-only"
      >
        <meta itemProp="ratingValue" content="5" />
        <meta itemProp="reviewCount" content={String(length)} />
        <meta itemProp="bestRating" content="5" />
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[240px_1fr_200px] lg:gap-6">
        {/* Left — title + CTA + prev card */}
        <div className="flex flex-col gap-6">
          <div>
            <h2
              id="testimonials-title"
              className="whitespace-pre-line font-barlow text-2xl font-semibold uppercase text-primary sm:text-4xl leading-none"
            >
              {t("title")}
            </h2>
            <WriteTestimonialDialog>
              <button
                type="button"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-secondary px-5 py-2.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
              >
                {t("writeTestimonial")}
                <IconArrowNarrowRight className="size-4" aria-hidden />
              </button>
            </WriteTestimonialDialog>
          </div>

          {/* Prev arrow */}
          {length > 1 ? (
            <button
              type="button"
              onClick={prev}
              className="flex size-10 cursor-pointer items-center justify-center self-end rounded-full border border-foreground/15 bg-card text-foreground transition-colors hover:bg-muted"
              aria-label={t("prevTestimonial")}
            >
              <IconArrowNarrowLeft className="size-5" />
            </button>
          ) : null}

          {/* Prev card (small) */}
          {length > 1 ? (
            <button
              type="button"
              onClick={() => goTo(prevIdx)}
              className="flex cursor-pointer items-center gap-3 rounded-2xl bg-card p-4 text-left shadow-sm transition-shadow hover:shadow-md"
              aria-label={t("viewTestimonial", { name: prevT.name })}
            >
              <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
                <AvatarImage
                  src={prevT.profileImage ?? prevT.reviewImage}
                  alt={prevT.name}
                  sizes="40px"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {prevT.name}
                </p>
                {prevT.company ? (
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {prevT.company}
                  </p>
                ) : null}
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-sm font-bold text-foreground">
                    {prevT.rating.toFixed(1)}
                  </span>
                  <Stars rating={prevT.rating} />
                </div>
              </div>
            </button>
          ) : null}
        </div>

        {/* Center — active testimonial */}
        <div className="flex flex-col items-center gap-6">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={active.id}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 80 : -80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -80 : 80 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="flex w-full flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8"
            >
              {/* Visual — prefer review photo, fallback to profile */}
              <div className="relative aspect-3/4 w-48 shrink-0 overflow-hidden rounded-2xl sm:w-56 lg:w-64">
                <AvatarImage
                  src={activeVisualImage}
                  alt={active.name}
                  sizes="(max-width: 640px) 192px, (max-width: 1024px) 224px, 256px"
                  priority
                />
              </div>

              {/* Text + info */}
              <div
                className="flex flex-1 flex-col justify-center"
                itemProp="review"
                itemScope
                itemType="https://schema.org/Review"
              >
                <blockquote
                  className="text-sm leading-relaxed text-muted-foreground sm:text-base"
                  itemProp="reviewBody"
                >
                  {active.text}
                </blockquote>

                <div
                  className="mt-6 flex items-center gap-3"
                  itemProp="author"
                  itemScope
                  itemType="https://schema.org/Person"
                >
                  {active.profileImage ? (
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-full">
                      <AvatarImage
                        src={active.profileImage}
                        alt={active.name}
                        sizes="48px"
                      />
                    </div>
                  ) : null}
                  <div>
                    <p
                      className="text-xl font-semibold text-foreground sm:text-2xl"
                      itemProp="name"
                    >
                      {active.name}
                    </p>
                    {active.company ? (
                      <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        {active.company}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div
                  className="mt-3 flex items-center gap-2"
                  itemProp="reviewRating"
                  itemScope
                  itemType="https://schema.org/Rating"
                >
                  <meta
                    itemProp="ratingValue"
                    content={String(active.rating)}
                  />
                  <meta itemProp="bestRating" content="5" />
                  <span className="text-lg font-bold text-foreground">
                    {active.rating.toFixed(1)}
                  </span>
                  <Stars rating={active.rating} />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right — next card + arrow */}
        <div className="flex flex-col items-end gap-6">
          {/* Next card (small with photo) */}
          {length > 1 ? (
            <button
              type="button"
              onClick={() => goTo(nextIdx)}
              className="group relative h-44 w-full cursor-pointer overflow-hidden rounded-2xl text-left lg:h-48"
              aria-label={t("viewTestimonial", { name: nextT.name })}
            >
              <AvatarImage
                src={nextVisualImage}
                alt={nextT.name}
                sizes="200px"
                className="transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 z-10 p-4">
                <p className="text-sm font-bold text-white">{nextT.name}</p>
                {nextT.company ? (
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                    {nextT.company}
                  </p>
                ) : null}
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white">
                    {nextT.rating.toFixed(1)}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <IconStarFilled
                        key={`next-star-${i}`}
                        className={cn(
                          "size-3",
                          i < nextT.rating ? "text-primary" : "text-white/30",
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </button>
          ) : null}

          {/* Next arrow */}
          {length > 1 ? (
            <button
              type="button"
              onClick={next}
              className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-primary text-white transition-transform hover:scale-105"
              aria-label={t("nextTestimonial")}
            >
              <IconArrowNarrowRight className="size-5" />
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
