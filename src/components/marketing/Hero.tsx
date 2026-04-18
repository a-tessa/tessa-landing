"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { AnimatePresence, domAnimation, LazyMotion, m } from "motion/react";
import { ArrowRight, ChevronDown, ChevronLeft } from "lucide-react";
import {
  cn,
  insideCardSpacing,
  sectionCardShellSpacing,
} from "@/lib/utils";
import type { ClientLogo, HeroTopic } from "@/lib/api/types";
import { Button } from "../ui/button";

interface Slide {
  heading: string;
  cardLabel: string;
  description: string;
  bgImage: string;
  bgAlt: string;
}

interface HeroProps {
  heroSection?: HeroTopic[] | null;
  clients?: ClientLogo[] | null;
}

const PARTNER_NAMES = [
  "Outros Montes",
  "ZS",
  "Sunshine",
  "Classic",
  "Showtime",
  "Brandit",
  "Vintage",
] as const;

const LOGO_MARQUEE_MIN_ITEMS = 6;

function ScrollIndicator() {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex h-9 w-[22px] items-start justify-center rounded-full border border-white/35 pt-1.5">
        <m.div
          className="h-1.5 w-1.5 rounded-full bg-white/80"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="flex flex-col items-center -space-y-2.5">
        {[0, 1, 2].map((i) => (
          <m.div
            key={i}
            animate={{ opacity: [0.15, 0.8, 0.15], y: [0, 3, 0] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          >
            <ChevronDown className="size-3.5 text-white" strokeWidth={2.5} />
          </m.div>
        ))}
      </div>
    </div>
  );
}

interface LogoStripProps {
  clients?: ClientLogo[] | null;
}

function fillLogosToMin<T>(items: T[], min: number): T[] {
  if (items.length === 0) return items;

  const filled: T[] = [...items];
  let cursor = 0;
  while (filled.length < min) {
    filled.push(items[cursor % items.length]!);
    cursor += 1;
  }
  return filled;
}

function LogoStrip({ clients }: LogoStripProps) {
  const hasClients = Array.isArray(clients) && clients.length > 0;

  if (hasClients) {
    const baseLogos = fillLogosToMin(clients, LOGO_MARQUEE_MIN_ITEMS);
    const marqueeLogos = [...baseLogos, ...baseLogos].map((client, index) => ({
      key: `${client.id ?? client.logoUrl}-${Math.floor(index / baseLogos.length)}`,
      client,
    }));

    return (
      <div>
        <ul className="sr-only">
          {clients.map((client) => (
            <li key={client.id ?? client.logoUrl}>{client.name}</li>
          ))}
        </ul>

        <div aria-hidden="true" className="overflow-hidden">
          <m.div
            className="flex w-max items-center gap-12 sm:gap-16"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
          >
            {marqueeLogos.map(({ key, client }) => {
              const logo = (
                <Image
                  src={client.logoUrl}
                  alt={client.alt}
                  width={140}
                  height={56}
                  sizes="(max-width: 640px) 96px, 90pxpx"
                  className="h-10 w-auto object-contain sm:h-12"
                />
              );

              const wrapperClassName =
                "inline-flex shrink-0 items-center justify-center grayscale opacity-60 transition duration-300 hover:grayscale-0 hover:opacity-100";

              return client.website ? (
                <a
                  key={key}
                  href={client.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Site de ${client.name}`}
                  className={wrapperClassName}
                >
                  {logo}
                </a>
              ) : (
                <span key={key} className={wrapperClassName}>
                  {logo}
                </span>
              );
            })}
          </m.div>
        </div>
      </div>
    );
  }

  const marqueeItems = [...PARTNER_NAMES, ...PARTNER_NAMES].map(
    (partner, index) => ({
      key: `${partner}-${Math.floor(index / PARTNER_NAMES.length)}`,
      label: partner,
    }),
  );

  return (
    <div>
      <ul className="sr-only">
        {PARTNER_NAMES.map((partner) => (
          <li key={partner}>{partner}</li>
        ))}
      </ul>

      <div aria-hidden="true" className="overflow-hidden">
        <m.div
          className="flex w-max items-center gap-12 sm:gap-16"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
        >
          {marqueeItems.map((item) => (
            <span
              key={item.key}
              className="whitespace-nowrap text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground/70 sm:text-base"
            >
              {item.label}
            </span>
          ))}
        </m.div>
      </div>
    </div>
  );
}

function buildFallbackSlides(t: ReturnType<typeof useTranslations>): Slide[] {
  return [
    {
      heading: t("slides.0.heading"),
      cardLabel: t("slides.0.cardLabel"),
      description: t("slides.0.description"),
      bgImage: "/hero-image.png",
      bgAlt: t("slides.0.bgAlt"),
    },
    {
      heading: t("slides.1.heading"),
      cardLabel: t("slides.1.cardLabel"),
      description: t("slides.1.description"),
      bgImage: "/hero-image.png",
      bgAlt: t("slides.1.bgAlt"),
    },
  ];
}

function mapApiSlidesToSlides(topics: HeroTopic[]): Slide[] {
  return topics.map((topic) => ({
    heading: topic.title,
    cardLabel: topic.title.toUpperCase(),
    description: topic.description,
    bgImage: topic.image,
    bgAlt: topic.title,
  }));
}

export function Hero({ heroSection, clients }: HeroProps) {
  const t = useTranslations("hero");

  const SLIDES = useMemo<Slide[]>(() => {
    if (heroSection && heroSection.length > 0) {
      return mapApiSlidesToSlides(heroSection);
    }
    return buildFallbackSlides(t);
  }, [heroSection, t]);

  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, [SLIDES.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, [SLIDES.length]);

  const activeSlide = SLIDES[current];

  return (
    <LazyMotion features={domAnimation}>
      <section
        aria-labelledby="hero-title"
        className={cn(
          "relative overflow-hidden pt-24 sm:pt-6 flex flex-col",
          sectionCardShellSpacing,
          "w-full",
        )}
      >
        <div className="relative rounded-3xl shadow-2xl shadow-primary/20 aspect-video w-full xl:max-h-screen">
          {SLIDES.map((slide, index) => (
            <m.div
              key={slide.bgAlt}
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: index === current ? 1 : 0 }}
              transition={{ duration: 0.7 }}
              aria-hidden={index !== current}
            >
              <Image
                src={slide.bgImage}
                alt={slide.bgAlt}
                fill
                priority={index === 0}
                className="object-cover w-full h-full rounded-3xl"
                sizes="(max-width: 768px) 100vw, 97vw"
              />
            </m.div>
          ))}

          <div className="absolute rounded-3xl inset-0 z-1 bg-linear-to-r from-black/65 via-black/35 to-black/10" />
          <div className="absolute rounded-3xl inset-0 z-1 bg-linear-to-t from-black/60 via-transparent to-transparent" />

          <div className="relative z-10 flex h-full flex-col">
            <div
              className={cn(
                "flex flex-1 sm:items-end pt-10 sm:pt-24",
                insideCardSpacing,
              )}
            >
              <div className="w-full gap-10 flex flex-col lg:flex-row justify-between">
                <div className="pb-16 lg:pb-20 my-auto">
                  <h1
                    id="hero-title"
                    className="max-w-2xl text-4xl font-bold uppercase text-white sm:text-5xl lg:text-6xl"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <m.span
                        key={activeSlide.heading}
                        className="block whitespace-pre-line"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.35 }}
                      >
                        {activeSlide.heading}
                      </m.span>
                    </AnimatePresence>
                  </h1>

                  <AnimatePresence mode="wait" initial={false}>
                    <m.p
                      key={activeSlide.description}
                      className="mt-5 max-w-xl whitespace-pre-line text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/70 sm:text-xs"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.35, delay: 0.05 }}
                    >
                      {activeSlide.description}
                    </m.p>
                  </AnimatePresence>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    {heroSection?.[current]?.button ? (
                      <Link
                        href={heroSection[current].button.url}
                        className="group inline-flex items-center gap-2 rounded-md bg-chart-5 px-5 py-3 text-sm font-medium text-white transition-transform hover:-translate-y-0.5 sm:px-6"
                      >
                        {heroSection[current].button.text}
                        <ArrowRight
                          size={16}
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      </Link>
                    ) : (
                      <>
                        <Link
                          href="/contato"
                          className="rounded-md border border-white/20 bg-white/8 px-5 py-3 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/14 sm:px-6"
                        >
                          {t("requestQuote")}
                        </Link>
                        <Link
                          href="/servicos"
                          className="group inline-flex items-center gap-2 rounded-md bg-chart-5 px-5 py-3 text-sm font-medium text-white transition-transform hover:-translate-y-0.5 sm:px-6"
                        >
                          {t("exploreSolutions")}
                          <ArrowRight
                            size={16}
                            className="transition-transform group-hover:translate-x-0.5"
                          />
                        </Link>
                      </>
                    )}
                  </div>
                </div>

                <div className="hidden items-end justify-end pb-16 lg:flex lg:pb-20">
                  <div className="flex w-full max-w-76 flex-col gap-4">
                    {SLIDES.map((slide, index) => (
                      <button
                        key={slide.cardLabel}
                        type="button"
                        onClick={() => setCurrent(index)}
                        aria-pressed={index === current}
                        className={cn(
                          "min-h-64 w-76 rounded-3xl border p-6 text-left transition-all duration-300 flex flex-col justify-end",
                          index === current
                            ? "border-chart-5/60 bg-primary text-white shadow-xl shadow-chart-5/20"
                            : "border-white/20 bg-transparent text-white backdrop-blur-md hover:bg-white/12",
                        )}
                      >
                        <p className="whitespace-pre-line text-2xl font-semibold uppercase">
                          {slide.cardLabel}
                        </p>
                      </button>
                    ))}

                    <div className="flex items-center justify-end gap-3">
                      <div className="h-1 flex-1 rounded-full bg-chart-5/70" />
                      <Button
                        onClick={next}
                        aria-label={t("nextHeroBanner")}
                        className="cursor-pointer size-11 rounded-full transition-transform hover:scale-105"
                      >
                        <ArrowRight size={18} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-5 pb-4 sm:px-8 lg:px-14">
              <div className="flex items-center gap-3 text-white/70">
                <ScrollIndicator />
              </div>

              <div className="flex items-center gap-3 lg:hidden">
                <Button
                  onClick={prev}
                  aria-label={t("prevHeroBanner")}
                  className="cursor-pointer size-10 rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/16"
                >
                  <ChevronLeft size={18} />
                </Button>
                <Button
                  onClick={next}
                  aria-label={t("nextHeroBanner")}
                  className="cursor-pointer size-10 rounded-full bg-chart-5 text-white transition-colors hover:brightness-110"
                >
                  <ArrowRight size={18} />
                </Button>
              </div>
            </div>

            <div className="pb-14 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-white sm:text-sm">
                {t("trustedCompanies")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={prev}
            className="absolute left-5 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/16 lg:flex"
            aria-label={t("prevHeroBanner")}
          >
            <ChevronLeft size={20} />
          </button>
        </div>
        <div className="relative z-10 h-fit -mt-10">
          <div className="rounded-full bg-card py-6 shadow-2xl shadow-primary/10 sm:py-10 overflow-hidden">
            <LogoStrip clients={clients} />
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}
