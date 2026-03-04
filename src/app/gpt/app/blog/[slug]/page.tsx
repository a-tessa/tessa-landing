import React from "react";
import { notFound } from "next/navigation";
import { Section } from "@/components/marketing/Section";
import { JsonLd } from "@/lib/seo/jsonld";
import { SITE } from "@/lib/seo/schemas";

type Props = { params: { slug: string } };

const posts: Record<string, { title: string; description: string; body: string[] }> = {
  "como-escolher-o-tijolo-certo": {
    title: "Como escolher o tijolo certo (sem desperdício)",
    description: "Um guia rápido com o que considerar antes de comprar tijolos.",
    body: [
      "Considere a função da parede (vedação vs estrutural).",
      "Avalie a logística (entrega e armazenamento).",
      "Padronize o lote para evitar variações na obra.",
    ],
  },
  "como-calcular-quantidade-de-tijolos": {
    title: "Como calcular a quantidade de tijolos da sua obra",
    description: "Método simples para estimar quantidade e reduzir erros.",
    body: [
      "Meça a área total (m²) de paredes.",
      "Desconte aberturas (portas e janelas).",
      "Use o consumo por m² do seu tipo de tijolo e some perdas (5–10%).",
    ],
  },
};

export function generateMetadata({ params }: Props) {
  const post = posts[params.slug];
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${params.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `/blog/${params.slug}`,
    },
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = posts[params.slug];
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    author: { "@type": "Organization", name: SITE.name },
    publisher: { "@type": "Organization", name: SITE.name },
    mainEntityOfPage: `${SITE.domain}/blog/${params.slug}`,
  };

  return (
    <main>
      <JsonLd id="jsonld-post" data={jsonLd} />
      <Section className="bg-white">
        <article className="prose prose-zinc max-w-none">
          <h1>{post.title}</h1>
          <p className="lead">{post.description}</p>
          <ul>
            {post.body.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </article>
      </Section>
    </main>
  );
}
