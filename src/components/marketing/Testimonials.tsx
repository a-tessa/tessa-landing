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

function TestimonialQuoteBubble({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <div className={cn("relative w-full max-w-3xl", className)}>
      <blockquote
        className="relative rounded-3xl bg-card px-8 py-10 text-center shadow-sm ring-1 ring-foreground/10 sm:px-12 sm:py-14"
        itemProp="reviewBody"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute left-6 top-4 font-serif text-6xl leading-none text-primary/15 sm:left-8 sm:text-7xl"
        >
          &ldquo;
        </span>
        <p className="relative text-xl font-medium leading-relaxed text-foreground sm:text-2xl lg:text-3xl">
          {text}
        </p>
      </blockquote>
      <div
        aria-hidden
        className="absolute -bottom-3 left-1/2 size-6 -translate-x-1/2 rotate-45 bg-card ring-1 ring-foreground/10"
      />
    </div>
  );
}

function TestimonialNextPreviewCard({
  testimonial,
  onSelect,
  ariaLabel,
}: {
  testimonial: Testimonial;
  onSelect: () => void;
  ariaLabel: string;
}) {
  if (testimonial.reviewImage) {
    return (
      <button
        type="button"
        onClick={onSelect}
        className="group relative h-44 w-full cursor-pointer overflow-hidden rounded-2xl text-left lg:h-48"
        aria-label={ariaLabel}
      >
        <AvatarImage
          src={testimonial.reviewImage}
          alt={testimonial.name}
          sizes="200px"
          className="transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 z-10 p-4">
          <p className="text-sm font-bold text-white">{testimonial.name}</p>
          {testimonial.company ? (
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">
              {testimonial.company}
            </p>
          ) : null}
          <div className="mt-1 flex items-center gap-1.5">
            <span className="text-sm font-bold text-white">
              {testimonial.rating.toFixed(1)}
            </span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <IconStarFilled
                  key={`next-star-${i}`}
                  className={cn(
                    "size-3",
                    i < testimonial.rating ? "text-primary" : "text-white/30",
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex h-44 w-full cursor-pointer flex-col justify-between rounded-2xl bg-card p-4 text-left shadow-sm transition-shadow hover:shadow-md lg:h-48"
      aria-label={ariaLabel}
    >
      <p className="line-clamp-4 text-sm leading-relaxed text-muted-foreground">
        &ldquo;{testimonial.text}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
          <AvatarImage
            src={testimonial.profileImage}
            alt={testimonial.name}
            sizes="40px"
          />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {testimonial.name}
          </p>
          {testimonial.company ? (
            <p className="truncate text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {testimonial.company}
            </p>
          ) : null}
        </div>
      </div>
    </button>
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
        className={cn(
          "mt-10 w-full pb-10",
          freeSectionShellSpacing,
          className,
        )}
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
  const activeHasReviewImage = Boolean(active.reviewImage);

  return (
    <section
      aria-labelledby="testimonials-title"
      className={cn("mt-10 w-full pb-10", freeSectionShellSpacing, className)}
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
                  src={prevT.profileImage}
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
              className={cn(
                "flex w-full flex-col gap-6",
                activeHasReviewImage
                  ? "items-center sm:flex-row sm:items-start sm:gap-8"
                  : "items-center",
              )}
            >
              {activeHasReviewImage ? (
                <div className="relative aspect-3/4 w-48 shrink-0 overflow-hidden rounded-2xl sm:w-56 lg:w-64">
                  <AvatarImage
                    src={active.reviewImage}
                    alt={active.name}
                    sizes="(max-width: 640px) 192px, (max-width: 1024px) 224px, 256px"
                    priority
                  />
                </div>
              ) : null}

              {/* Text + info */}
              <div
                className={cn(
                  "flex flex-1 flex-col justify-center",
                  !activeHasReviewImage && "w-full max-w-3xl items-center text-center",
                )}
                itemProp="review"
                itemScope
                itemType="https://schema.org/Review"
              >
                {activeHasReviewImage ? (
                  <blockquote
                    className="text-sm leading-relaxed text-muted-foreground sm:text-base"
                    itemProp="reviewBody"
                  >
                    {active.text}
                  </blockquote>
                ) : (
                  <TestimonialQuoteBubble
                    text={active.text}
                    className="mb-2"
                  />
                )}

                <div
                  className={cn(
                    "mt-6 flex items-center gap-3",
                    !activeHasReviewImage && "justify-center",
                  )}
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
                  className={cn(
                    "mt-3 flex items-center gap-2",
                    !activeHasReviewImage && "justify-center",
                  )}
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
            <TestimonialNextPreviewCard
              testimonial={nextT}
              onSelect={() => goTo(nextIdx)}
              ariaLabel={t("viewTestimonial", { name: nextT.name })}
            />
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
