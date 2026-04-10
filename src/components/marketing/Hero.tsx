"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, domAnimation, LazyMotion, m } from "motion/react";
import { ArrowRight, ChevronDown, ChevronLeft } from "lucide-react";
import { Container } from "./Container";
import { cn, homeSpacing, sectionCardShellSpacing } from "@/lib/utils";

interface Slide {
  heading: string;
  cardLabel: string;
  description: string;
  bgImage: string;
  bgAlt: string;
}

const SLIDES: Slide[] = [
  {
    heading: "Estruturas metálicas\ne perfis sob medida.",
    cardLabel: "ESTRUTURAS\nMETÁLICAS\nE PERFIS SOB MEDIDA",
    description:
      "Aço galvanizado. Engenharia aplicada. Produção industrial.\nEntrega para o seu projeto sair do papel com previsibilidade.",
    bgImage: "/hero-estruturas.webp",
    bgAlt:
      "Vista aérea da fábrica Tessa com estruturas metálicas e galpões industriais",
  },
  {
    heading: "Energia limpa\nque reduz seus custos.",
    cardLabel: "ENERGIA LIMPA\nQUE REDUZ\nSEUS CUSTOS",
    description:
      "Soluções em energia solar para empresas e indústrias.\nEconomia recorrente e operação mais sustentável.",
    bgImage: "/hero-energia.webp",
    bgAlt: "Painéis solares instalados pela Tessa em planta industrial",
  },
];

const PARTNER_NAMES = [
  "Outros Montes",
  "ZS",
  "Sunshine",
  "Classic",
  "Showtime",
  "Brandit",
  "Vintage",
] as const;

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

function LogoStrip() {
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

export function Hero() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  const activeSlide = SLIDES[current];

  return (
    <LazyMotion features={domAnimation}>
      <section
        aria-labelledby="hero-title"
        className={cn("relative overflow-hidden pb-8 pt-24 sm:pb-10 sm:pt-6", sectionCardShellSpacing)}
      >
          <div className="relative overflow-hidden rounded-3xl bg-primary shadow-2xl shadow-primary/20">
            {SLIDES.map((slide, index) => (
              <m.div
                key={slide.bgImage}
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
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 97vw"
                />
              </m.div>
            ))}

            <div className="absolute inset-0 z-1 bg-linear-to-r from-black/65 via-black/35 to-black/10" />
            <div className="absolute inset-0 z-1 bg-linear-to-t from-black/60 via-transparent to-transparent" />

            <div className="relative z-10 flex h-[calc(100vh-5rem)] sm:h-screen flex-col">
              <div className={cn("flex flex-1 sm:items-end pt-10 sm:pt-24", homeSpacing)}>
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
                      <Link
                        href="/contato"
                        className="rounded-md border border-white/20 bg-white/8 px-5 py-3 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/14 sm:px-6"
                      >
                        Solicitar orçamento
                      </Link>
                      <Link
                        href="/servicos"
                        className="group inline-flex items-center gap-2 rounded-md bg-chart-5 px-5 py-3 text-sm font-medium text-white transition-transform hover:-translate-y-0.5 sm:px-6"
                      >
                        Conhecer soluções
                        <ArrowRight
                          size={16}
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      </Link>
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
                        <button
                          type="button"
                          onClick={next}
                          className="flex h-11 w-11 items-center justify-center rounded-full bg-chart-5 text-white transition-transform hover:scale-105"
                          aria-label="Mostrar a próxima solução"
                        >
                          <ArrowRight size={18} />
                        </button>
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
                  <button
                    type="button"
                    onClick={prev}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/16"
                    aria-label="Mostrar a solução anterior"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-chart-5 text-white transition-colors hover:brightness-110"
                    aria-label="Mostrar a próxima solução"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>

              <div className="pb-14 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-white sm:text-sm">
                  Empresas que confiam
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={prev}
              className="absolute left-5 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/16 lg:flex"
              aria-label="Mostrar a solução anterior"
            >
              <ChevronLeft size={20} />
            </button>
          </div>

          <div className={cn("relative z-10 -mt-8", homeSpacing)}>
            <div className="rounded-full bg-card px-6 py-6 shadow-2xl shadow-primary/10 lg:px-10 sm:py-10">
              <LogoStrip />
            </div>
          </div>
      </section>
    </LazyMotion>
  );
}
