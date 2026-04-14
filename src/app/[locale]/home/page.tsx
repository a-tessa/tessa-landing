import type { Metadata } from "next";
import React from "react";
import { Hero } from "@/components/marketing/Hero";
import { Scenarios } from "@/components/marketing/Scenarios";
import { Footer } from "@/components/marketing/Footer";
import { JsonLd } from "@/lib/seo/jsonld";
import { organizationJsonLd, SITE, websiteJsonLd } from "@/lib/seo/schemas";

export const metadata: Metadata = {
  title: "Estruturas metalicas e energia solar para projetos industriais",
  description:
    "Estruturas metalicas, perfis sob medida e energia solar para empresas que buscam engenharia aplicada, producao industrial e previsibilidade na execucao.",
  alternates: {
    canonical: "/home",
  },
  keywords: [...SITE.keywords, "Energia solar para empresas", "Perfis sob medida"],
};

export default function HomePage() {
  return (
    <>
      <JsonLd id="jsonld-org" data={organizationJsonLd()} />
      <JsonLd id="jsonld-website" data={websiteJsonLd()} />

      <main className="flex flex-col items-center justify-center">
        <Hero />
        <Scenarios />
      </main>

      <Footer />
    </>
  );
}
