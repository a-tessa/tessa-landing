import React from "react";
import { Section } from "./Section";

export function Proof() {
  return (
    <Section className="bg-zinc-50">
      <div className="grid gap-6 rounded-3xl border border-zinc-200 bg-white p-8 sm:grid-cols-3">
        <div>
          <p className="text-3xl font-semibold text-zinc-900">1.000+</p>
          <p className="mt-1 text-sm text-zinc-600">entregas realizadas</p>
        </div>
        <div>
          <p className="text-3xl font-semibold text-zinc-900">98%</p>
          <p className="mt-1 text-sm text-zinc-600">clientes recorrentes</p>
        </div>
        <div>
          <p className="text-3xl font-semibold text-zinc-900">SLA rápido</p>
          <p className="mt-1 text-sm text-zinc-600">resposta no mesmo dia útil</p>
        </div>
      </div>
    </Section>
  );
}
