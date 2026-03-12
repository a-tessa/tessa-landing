"use client";

import Link from "next/link";
import { Container } from "./Container";
import { homeSpacing } from "@/lib/utils";
import AppleCardsCarousel from "../apple-cards-carousel";

export function Scenarios() {
  return (
    <section
      aria-labelledby="scenarios-title"
      className="w-full"
    >
      <Container className="px-0! pb-0!">
        <div className={`${homeSpacing}`}>
          <h2
            id="scenarios-title"
            className="text-3xl font-bold uppercase leading-tight text-foreground sm:text-4xl"
          >
            Escolha seu cenário
          </h2>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground sm:text-sm">
            Soluções sob medida para obra, energia e produção.
          </p>
          <div className="mt-4 h-1 w-20 rounded-full bg-chart-5" />
        </div>
        <AppleCardsCarousel />

        <div className={`mt-8 flex justify-end sm:mt-10 ${homeSpacing}`}>
          <Link
            href="/servicos"
            className="inline-flex items-center gap-2 rounded-lg bg-secondary px-6 py-3 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
          >
            Conhecer todos os serviços
          </Link>
        </div>
      </Container>
    </section>
  );
}
