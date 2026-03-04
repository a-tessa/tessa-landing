import React from "react";
import { Section } from "./Section";

const steps = [
  { n: "01", title: "Envie sua demanda", desc: "Medidas, tipo de obra e prazo." },
  { n: "02", title: "Receba a cotação", desc: "Preço, prazo e melhor recomendação." },
  { n: "03", title: "Agende a entrega", desc: "Entrega conforme seu cronograma." },
];

export function HowItWorks() {
  return (
    <Section className="bg-white">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">Como funciona</h2>
        <p className="mt-4 text-zinc-600">Um processo simples para você focar no que importa: a obra andando.</p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n} className="rounded-2xl border border-zinc-200 p-6">
            <p className="text-xs font-semibold text-zinc-500">{s.n}</p>
            <h3 className="mt-2 font-semibold text-zinc-900">{s.title}</h3>
            <p className="mt-2 text-sm text-zinc-600">{s.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
