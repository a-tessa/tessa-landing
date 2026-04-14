import type { Metadata } from "next";
import React from "react";
import { Hero } from "@/components/marketing/Hero";
import { Footer } from "@/components/marketing/Footer";
import { JsonLd } from "@/lib/seo/jsonld";
import { organizationJsonLd, SITE, websiteJsonLd } from "@/lib/seo/schemas";
import { Scenarios } from "@/components/marketing/Scenarios";
import { Operations } from "@/components/marketing/Operations";
import { NewsAndSocial } from "@/components/marketing/NewsAndSocial";
import { Testimonials } from "@/components/marketing/Testimonials";
import { Results } from "@/components/marketing/Results";
import { getLandingContent } from "@/lib/api/content";

export const metadata: Metadata = {
  title: "Estruturas metalicas e energia solar para projetos industriais",
  description:
    "Estruturas metalicas, perfis sob medida e energia solar para empresas que buscam engenharia aplicada, producao industrial e previsibilidade na execucao.",
  alternates: {
    canonical: "/",
  },
  keywords: [...SITE.keywords, "Energia solar para empresas", "Perfis sob medida"],
};

export default async function HomePage() {
  const { heroSection, scenerySection } = await getLandingContent();
  console.log("🚀 ~ HomePage ~ heroSection:", heroSection)
  console.log("🚀 ~ HomePage ~ scenerySection:", scenerySection)

  return (
    <>
      <JsonLd id="jsonld-org" data={organizationJsonLd()} />
      <JsonLd id="jsonld-website" data={websiteJsonLd()} />

      <main className="flex flex-col items-center justify-center gap-10">
        <Hero heroSection={heroSection} />
        <Scenarios scenerySection={scenerySection} />
        <Operations />
        <NewsAndSocial />
        <Testimonials />
        <Results />
      </main>

      <Footer />
    </>
  );
}
