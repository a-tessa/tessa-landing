import Link from "next/link";
import React from "react";
import { Section } from "@/components/marketing/Section";

const posts = [
  { slug: "como-escolher-o-tijolo-certo", title: "Como escolher o tijolo certo (sem desperdício)", excerpt: "Um guia rápido com o que considerar antes de comprar." },
  { slug: "como-calcular-quantidade-de-tijolos", title: "Como calcular a quantidade de tijolos da sua obra", excerpt: "Um método simples para estimar e reduzir erros." },
];

export const metadata = {
  title: "Blog",
  description: "Conteúdo e dicas para sua obra.",
};

export default function BlogPage() {
  return (
    <main>
      <Section className="bg-white">
        <h1 className="text-3xl font-semibold text-zinc-900">Blog</h1>
        <p className="mt-3 text-zinc-600">Dicas rápidas (placeholder). Depois você conecta no backend/CMS.</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 hover:bg-zinc-100 transition-colors"
            >
              <h2 className="font-semibold text-zinc-900">{p.title}</h2>
              <p className="mt-2 text-sm text-zinc-600">{p.excerpt}</p>
              <p className="mt-4 text-sm font-medium text-zinc-900">Ler →</p>
            </Link>
          ))}
        </div>
      </Section>
    </main>
  );
}
