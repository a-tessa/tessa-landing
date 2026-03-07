"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { AnimatePresence, domAnimation, LazyMotion, m } from "motion/react";
import { Container } from "./Container";
import { cn } from "@/lib/utils";
import { ArrowRight, ChevronLeft } from "lucide-react";

interface Slide {
  title: string;
  subtitle: string;
  cardLabel: string;
}

const slides: Slide[] = [
  {
    title: "ESTRUTURAS METÁLICAS\nE PERFIS SOB MEDIDA.",
    subtitle:
      "AÇO GALVANIZADO. ENGENHARIA APLICADA. PRODUÇÃO INDUSTRIAL.\nENTREGA PARA O SEU PROJETO SAIR DO PAPEL COM PREVISIBILIDADE.",
    cardLabel: "ESTRUTURAS\nMETÁLICAS\nE PERFIS SOB MEDIDA",
  },
  {
    title: "ENERGIA LIMPA\nQUE REDUZ SEUS CUSTOS.",
    subtitle:
      "SOLUÇÕES EM ENERGIA SOLAR PARA SUA EMPRESA.\nREDUÇÃO DE CUSTOS COM ENERGIA DE FORMA SUSTENTÁVEL.",
    cardLabel: "ENERGIA LIMPA\nQUE REDUZ\nSEUS CUSTOS",
  },
];

const AUTOPLAY_MS = 6000;

const heroBg = [
  "linear-gradient(135deg, #2c3e50 0%, #3d566e 50%, #4a6072 100%)",
  "linear-gradient(135deg, #1a3a5c 0%, #2d5a7b 50%, #3a6b8c 100%)",
];

function ScrollIndicator() {
  return (
    <div className="flex h-9 w-[22px] items-start justify-center rounded-full border-2 border-white/40 pt-1.5">
      <m.div
        className="h-1.5 w-1.5 rounded-full bg-white/70"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function LogoMarquee() {
  const logos = ["OutrosMitos", "Classic"];
  const oneSet = Array.from({ length: 8 }, () => logos).flat();
  const doubled = [...oneSet, ...oneSet];

  return (
    <div className="overflow-hidden">
      <m.div
        className="flex items-center gap-20"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{ width: "max-content" }}
      >
        {doubled.map((name, i) => (
          <span
            key={i}
            className="whitespace-nowrap text-lg font-bold uppercase tracking-[0.12em] text-zinc-300 sm:text-xl"
          >
            {name}
          </span>
        ))}
      </m.div>
    </div>
  );
}

export function Hero() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <LazyMotion features={domAnimation}>
      <section className="relative flex min-h-screen flex-col">
        {/* Background carousel */}
        <div className="absolute inset-0 overflow-hidden">
          <AnimatePresence initial={false}>
            <m.div
              key={current}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{ background: heroBg[current] }}
            />
          </AnimatePresence>
          <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-black/60 via-black/25 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-black/20" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 flex flex-1 items-center pt-20 pb-12">
          <Container>
            <div className="flex w-full items-center justify-between gap-8">
              {/* Left: text + CTAs */}
              <div className="max-w-2xl">
                <AnimatePresence mode="wait">
                  <m.div
                    key={current}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6 }}
                  >
                    <h1 className="whitespace-pre-line text-3xl font-bold leading-[1.1] text-white sm:text-4xl md:text-5xl lg:text-[3.25rem]">
                      {slide.title}
                    </h1>
                    <p className="mt-5 whitespace-pre-line text-[0.65rem] font-medium uppercase leading-relaxed tracking-[0.15em] text-white/60 sm:text-xs">
                      {slide.subtitle}
                    </p>
                  </m.div>
                </AnimatePresence>

                <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
                  <Link
                    href="#contato"
                    className="rounded-md border border-white/25 bg-white/5 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/15 sm:px-6 sm:py-3"
                  >
                    Solicitar orçamento
                  </Link>
                  <Link
                    href="#servicos"
                    className="group inline-flex items-center gap-2 rounded-md border border-[#FF6F00] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#FF6F00]/20 sm:px-6 sm:py-3"
                  >
                    Conhecer soluções
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                </div>
              </div>

              {/* Right: desktop-only slide cards */}
              <div className="hidden flex-col items-end gap-3 lg:flex">
                {slides.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={cn(
                      "w-52 cursor-pointer rounded-xl p-5 text-left transition-all duration-500",
                      i === current
                        ? "bg-[#FF6F00] text-white shadow-lg shadow-orange-500/25"
                        : "bg-white/90 text-zinc-700 hover:bg-white",
                    )}
                  >
                    <p className="whitespace-pre-line text-xs font-bold uppercase leading-snug tracking-wide">
                      {s.cardLabel}
                    </p>
                  </button>
                ))}
                <button
                  onClick={next}
                  className="mt-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#FF6F00] text-white shadow-lg shadow-orange-500/25 transition-transform hover:scale-110"
                  aria-label="Próximo slide"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </Container>
        </div>

        {/* Left arrow */}
        <button
          onClick={prev}
          className="absolute left-4 top-[42%] z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:left-6"
          aria-label="Slide anterior"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Right arrow (mobile only — desktop uses the card-area button) */}
        <button
          onClick={next}
          className="absolute right-4 top-[42%] z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[#FF6F00] text-white transition-colors hover:bg-[#E65100] sm:right-6 lg:hidden"
          aria-label="Próximo slide"
        >
          <ArrowRight size={18} />
        </button>

        {/* Scroll indicator */}
        <div className="relative z-10 flex justify-center pb-6">
          <ScrollIndicator />
        </div>

        {/* Companies section */}
        <div className="relative z-10">
          <div className="rounded-t-[2rem] bg-white px-4 pb-6 pt-8 sm:rounded-t-[2.5rem] sm:pb-8 sm:pt-10">
            <p className="mb-4 text-center text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-zinc-400 sm:mb-6 sm:text-xs">
              Empresas que confiam
            </p>
            <Container>
              <LogoMarquee />
            </Container>
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}
