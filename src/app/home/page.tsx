import React from "react";
import { Hero } from "@/components/marketing/Hero";
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
      </main>

      <Footer />
    </>
  );
}
