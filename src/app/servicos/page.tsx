import type { Metadata } from "next";
import { Footer } from "@/components/marketing/Footer";
import { Heading } from "@/components/marketing/Heading";
import { Testimonials } from "@/components/marketing/Testimonials";
import { JsonLd } from "@/lib/seo/jsonld";
import { organizationJsonLd, SITE, websiteJsonLd } from "@/lib/seo/schemas";
import { freeSectionShellSpacing, homeSpacing } from "@/lib/utils";
import AppleCardsCarousel from "@/components/apple-cards-carousel";
import Link from "next/link";
import { Results } from "@/components/marketing/Results";

export const metadata: Metadata = {
  title:
    "Serviços — estruturas metálicas, energia solar e soluções industriais",
  description:
    "Conheça os cenários e soluções Tessa: estruturas metálicas, energia solar e engenharia aplicada para obra e produção.",
  alternates: {
    canonical: "/servicos",
  },
  keywords: [
    ...SITE.keywords,
    "Serviços Tessa",
    "Estruturas metálicas",
    "Energia solar empresarial",
  ],
};

export default function ServicosPage() {
  return (
    <>
      <JsonLd id="jsonld-org" data={organizationJsonLd()} />
      <JsonLd id="jsonld-website" data={websiteJsonLd()} />

      <main className="flex flex-col items-center justify-center gap-20">
        <Heading
          title="Serviços"
          description="Conheça os cenários e soluções Tessa: estruturas metálicas, energia solar e engenharia aplicada para obra e produção."
        />
        <Scenarios />
        <Testimonials />
        <Results />
      </main>

      <Footer />
    </>
  );
}

export function Scenarios() {
  return (
    <section aria-labelledby="scenarios-title" className="w-full">
      <div className={`${freeSectionShellSpacing} flex flex-col md:flex-row gap-10`}>
        <div className="w-full md:w-5/12 flex-1">
          <h2
            id="scenarios-title"
            className="text-3xl font-semibold uppercase leading-tight text-foreground sm:text-6xl text-left md:text-right"
          >
            Escolha seu cenário
          </h2>
          <p className="mt-2 text-2xl font-semibold uppercase text-foreground text-left md:text-right">
            Soluções sob medida para obra, energia e produção.
          </p>
        </div>
        <p className="w-full md:w-5/12 flex-1 text-left md:text-left">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non
          risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec,
          ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula
          massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci
          nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl
          sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae,
          consequat in, pretium a, enim. Pellentesque congue. Ut in risus
          volutpat libero pharetra tempor. Cras vestibulum bibendum augue.
          Praesent egestas leo in pede. Praesent blandit odio eu enim.
          Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum
          primis in faucibus orci luctus et ultrices posuere cubilia Curae;
          Aliquam nibh. Mauris a
        </p>
      </div>
      <AppleCardsCarousel />

      <div className={`mt-8 flex justify-end sm:mt-10 ${homeSpacing}`}>
        <Link
          href="/servicos"
          className="inline-flex items-center gap-2 rounded-lg bg-secondary px-6 py-3 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
        >
          Conhecer todos os serviços
        </Link>
      </div>
    </section>
  );
}
