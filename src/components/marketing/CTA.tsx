import React from "react";
import { Section } from "./Section";

export function CTA() {
  return (
    <Section id="contato" className="bg-zinc-950 text-white">
      <div className="grid gap-10 rounded-3xl border border-white/10 bg-white/5 p-8 sm:grid-cols-2 sm:items-center">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Quer uma cotação rápida?</h2>
          <p className="mt-3 text-white/75">
            Envie as medidas e o prazo. A gente te responde com recomendação e valores.
          </p>
        </div>

        <form className="grid gap-3">
          <input
            className="h-12 rounded-xl bg-white/10 px-4 text-white placeholder:text-white/40 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-emerald-400"
            placeholder="Seu nome"
            name="name"
          />
          <input
            className="h-12 rounded-xl bg-white/10 px-4 text-white placeholder:text-white/40 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-emerald-400"
            placeholder="WhatsApp"
            name="whatsapp"
          />
          <textarea
            className="min-h-[110px] rounded-xl bg-white/10 px-4 py-3 text-white placeholder:text-white/40 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-emerald-400"
            placeholder="Descreva sua obra (medidas, prazo, local)"
            name="message"
          />
          <button
            type="button"
            className="h-12 rounded-xl bg-emerald-400 font-medium text-zinc-950 hover:bg-emerald-300 transition-colors"
          >
            Enviar (wire depois)
          </button>

          <p className="text-xs text-white/50">
            * Placeholder. Depois você integra com backend (form endpoint / CRM / WhatsApp).
          </p>
        </form>
      </div>
    </Section>
  );
}
