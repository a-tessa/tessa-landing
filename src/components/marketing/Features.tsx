import React from "react";
import { Section } from "./Section";

const features = [
  { title: "Qualidade consistente", desc: "Padronização e controle para evitar retrabalho e desperdício." },
  { title: "Logística inteligente", desc: "Entregas organizadas para não travar a obra (nem o seu time)." },
  { title: "Atendimento rápido", desc: "Cotação e suporte no WhatsApp/telefone com agilidade." },
];

export function Features() {
  return (
    <Section id="produtos" className="bg-white">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">
          Tudo o que você precisa para comprar tijolo com confiança
        </h2>
        <p className="mt-4 text-zinc-600">
          Um fluxo simples: você envia as medidas, a gente recomenda o melhor tipo e programa a entrega.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
            <h3 className="font-semibold text-zinc-900">{f.title}</h3>
            <p className="mt-2 text-sm text-zinc-600">{f.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
