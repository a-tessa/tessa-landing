import type { Metadata } from "next";
import { Footer } from "@/components/marketing/Footer";
import { Heading } from "@/components/marketing/Heading";
import { RepresentativesDirectory } from "@/components/marketing/RepresentativesDirectory";
import { Testimonials } from "@/components/marketing/Testimonials";
import { JsonLd } from "@/lib/seo/jsonld";
import { organizationJsonLd, SITE, websiteJsonLd } from "@/lib/seo/schemas";
import Image from "next/image";
import { cn, freeSectionShellSpacing } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Representantes — nossos representantes e distribuidores",
  description:
    "Conheça os nossos representantes e distribuidores, que estão à sua disposição para atender às suas necessidades.",
  alternates: {
    canonical: "/representantes",
  },
  keywords: [...SITE.keywords, "Representantes Tessa", "Distribuidores Tessa"],
};

const mapCss = /* css */ `
@keyframes map-follow-heading {
  from { top: calc(1.5rem + 7rem + 0.75rem); right: 0; }
  to   { top: calc(1.5rem + 3rem + 0.75rem); right: -200px; }
}

.map {
  right: 0;
  position: fixed;
  top: calc(0rem + 22rem + 0.75rem);
  transform: translateX(-50%);
  z-index: 30;
}

@supports (animation-timeline: scroll()) {
  .map {
    animation: map-follow-heading linear forwards;
    animation-timeline: scroll(root block);
    animation-range: 0 28vh;
  }
}

@media (prefers-reduced-motion: reduce) {
  .map {
    animation-name: none;
  }
}
`;

export default function RepresentantesPage() {
  return (
    <>
      <style href="map" precedence="component">
        {mapCss}
      </style>
      <JsonLd id="jsonld-org" data={organizationJsonLd()} />
      <JsonLd id="jsonld-website" data={websiteJsonLd()} />

      <main className="flex flex-col items-center justify-center gap-20">
        <Heading
          title="Representantes"
          description="Atendimento próximo, suporte técnico e agilidade para o seu projeto."
        />
        <div className="relative h-auto w-fit">
          <div
            aria-label="Mapa do Brasil"
            className={cn("map z-50 hidden sm:block")}
          >
            <Image
              src="/mapa-laranja.webp"
              alt="Representantes"
              width={1000}
              height={1000}
              className="w-32 sm:w-64 md:w-80 lg:w-96 xl:w-120 h-auto"
            />
          </div>
        </div>

        <section className={freeSectionShellSpacing}>
          <RepresentativesDirectory />
        </section>

        <Testimonials />
      </main>

      <Footer />
    </>
  );
}
