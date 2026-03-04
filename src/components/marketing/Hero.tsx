import Link from "next/link";
import React from "react";
import { BackgroundBeams } from "@/components/aceternity/BackgroundBeams.client";
import { Container } from "./Container";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 text-white">
      <BackgroundBeams />
      <Container className="relative py-20 sm:py-28">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Entrega, qualidade e suporte para sua obra
          </p>

          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Tijolos com qualidade e entrega sem dor de cabeça
          </h1>

          <p className="mt-5 text-pretty text-base text-white/80 sm:text-lg">
            Cotação rápida, estoque e logística alinhados ao seu cronograma.
            Ideal para obras residenciais e profissionais.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="#contato"
              className={cn(
                "inline-flex items-center justify-center rounded-xl bg-emerald-400 px-5 py-3 font-medium text-zinc-950",
                "hover:bg-emerald-300 transition-colors"
              )}
            >
              Pedir cotação
            </Link>
            <Link
              href="#produtos"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 px-5 py-3 font-medium text-white/90 hover:bg-white/5 transition-colors"
            >
              Ver produtos
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:flex sm:gap-6 text-sm text-white/70">
            <div>
              <p className="text-white font-semibold">+ de 10 anos</p>
              <p>atendendo obras</p>
            </div>
            <div>
              <p className="text-white font-semibold">Entrega programada</p>
              <p>conforme cronograma</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
