import React from "react";
import { Hero } from "@/components/marketing/Hero";
import { Proof } from "@/components/marketing/Proof";
import { Features } from "@/components/marketing/Features";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { CTA } from "@/components/marketing/CTA";
import { Footer } from "@/components/marketing/Footer";
import { JsonLd } from "@/lib/seo/jsonld";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/schemas";

export default function HomePage() {
  return (
    <>
      <JsonLd id="jsonld-org" data={organizationJsonLd()} />
      <JsonLd id="jsonld-website" data={websiteJsonLd()} />

      <main>
        <Hero />
        <Proof />
        <Features />
        <HowItWorks />
        <CTA />
      </main>

      <Footer />
    </>
  );
}
