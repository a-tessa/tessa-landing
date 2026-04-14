"use client";

import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import Image from "next/image";
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconStarFilled,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { WriteTestimonialDialog } from "@/components/marketing/WriteTestimonialDialog";
import { cn, freeSectionShellSpacing } from "@/lib/utils";

interface Testimonial {
  name: string;
  company: string;
  avatar: string;
  rating: number;
  text: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Óliver Bennet",
    company: "DOKA",
    avatar: "/choose-scenary-section/estruturas-metalicas-para-telhado.webp",
    rating: 5,
    text: "Excelente trabalho da equipe Tessa. Desde o projeto até a entrega, tudo foi conduzido com profissionalismo e dentro do prazo. A qualidade do aço galvanizado e a precisão dos perfis superaram nossas expectativas.",
  },
  {
    name: "Emília Tornatto",
    company: "SKF",
    avatar: "/choose-scenary-section/estrutura-de-solo.webp",
    rating: 5,
    text: "A Tessa entregou exatamente o que precisávamos... desde qualidade até pontualidade com suporte muito eficiente. Tanto a cobertura dos seis galpões com estrutura metálica quanto a instalação das placas fotovoltaicas foram executadas com alto padrão e excelente organização. Parceria segura e profissional, recomendo!",
  },
  {
    name: "Bárbara Souza",
    company: "SEDA SDS",
    avatar: "/choose-scenary-section/estruturas-de-aviario.webp",
    rating: 5,
    text: "Contratamos a Tessa para a estrutura metálica do nosso novo galpão e ficamos impressionados com a agilidade e a qualidade do serviço. A equipe técnica é muito competente e a comunicação durante todo o projeto foi transparente.",
  },
  {
    name: "Ricardo Almeida",
    company: "Agro Plus",
    avatar: "/choose-scenary-section/estruturas-metalicas-para-telhado.webp",
    rating: 5,
    text: "Precisávamos de uma solução confiável para os aviários e a Tessa entregou com excelência. Estrutura robusta, dentro do prazo e com custo competitivo. Já estamos planejando a próxima etapa com eles.",
  },
];

function getIndex(current: number, offset: number): number {
  return (current + offset + TESTIMONIALS.length) % TESTIMONIALS.length;
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

export function Testimonials() {
  const t = useTranslations("testimonials");
  const [current, setCurrent] = useState(1);
  const [direction, setDirection] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current],
  );

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((c) => getIndex(c, -1));
  }, []);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((c) => getIndex(c, 1));
  }, []);

  const prevIdx = getIndex(current, -1);
  const nextIdx = getIndex(current, 1);
  const active = TESTIMONIALS[current];
  const prevT = TESTIMONIALS[prevIdx];
  const nextT = TESTIMONIALS[nextIdx];

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
        <meta itemProp="reviewCount" content={String(TESTIMONIALS.length)} />
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
          <button
            type="button"
            onClick={prev}
            className="flex size-10 cursor-pointer items-center justify-center self-end rounded-full border border-foreground/15 bg-card text-foreground transition-colors hover:bg-muted"
            aria-label={t("prevTestimonial")}
          >
            <IconArrowNarrowLeft className="size-5" />
          </button>

          {/* Prev card (small) */}
          <button
            type="button"
            onClick={() => goTo(prevIdx)}
            className="flex cursor-pointer items-center gap-3 rounded-2xl bg-card p-4 text-left shadow-sm transition-shadow hover:shadow-md"
            aria-label={t("viewTestimonial", { name: prevT.name })}
          >
            <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
              <Image
                src={prevT.avatar}
                alt={prevT.name}
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {prevT.name}
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {prevT.company}
              </p>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="text-sm font-bold text-foreground">
                  {prevT.rating.toFixed(1)}
                </span>
                <Stars rating={prevT.rating} />
              </div>
            </div>
          </button>
        </div>

        {/* Center — active testimonial */}
        <div className="flex flex-col items-center gap-6">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 80 : -80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -80 : 80 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="flex w-full flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8"
            >
              {/* Photo */}
              <div className="relative aspect-3/4 w-48 shrink-0 overflow-hidden rounded-2xl sm:w-56 lg:w-64">
                <Image
                  src={active.avatar}
                  alt={active.name}
                  fill
                  className="object-cover"
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
                  className="mt-6"
                  itemProp="author"
                  itemScope
                  itemType="https://schema.org/Person"
                >
                  <p
                    className="text-xl font-semibold text-foreground sm:text-2xl"
                    itemProp="name"
                  >
                    {active.name}
                  </p>
                  <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    {active.company}
                  </p>
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
          <button
            type="button"
            onClick={() => goTo(nextIdx)}
            className="group relative h-44 w-full cursor-pointer overflow-hidden rounded-2xl text-left lg:h-48"
            aria-label={t("viewTestimonial", { name: nextT.name })}
          >
            <Image
              src={nextT.avatar}
              alt={nextT.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="200px"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 z-10 p-4">
              <p className="text-sm font-bold text-white">{nextT.name}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                {nextT.company}
              </p>
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

          {/* Next arrow */}
          <button
            type="button"
            onClick={next}
            className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-primary text-white transition-transform hover:scale-105"
            aria-label={t("nextTestimonial")}
          >
            <IconArrowNarrowRight className="size-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
