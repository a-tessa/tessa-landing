import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Hero } from "@/components/marketing/Hero";
import { Footer } from "@/components/marketing/Footer";
import { Scenarios } from "@/components/marketing/Scenarios";
import { Operations } from "@/components/marketing/Operations";
import { NewsAndSocial } from "@/components/marketing/NewsAndSocial";
import { Testimonials } from "@/components/marketing/Testimonials";
import { Results } from "@/components/marketing/Results";
import { JsonLd } from "@/lib/seo/jsonld";
import { breadcrumbJsonLd } from "@/lib/seo/schemas";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getLandingContent } from "@/lib/api/content";
import { getApprovedTestimonials } from "@/lib/api/testimonials";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return buildPageMetadata({
    locale,
    path: "/",
    title: t("homeTitle"),
    description: t("homeDescription"),
    keywords: ["Energia solar para empresas", "Perfis sob medida"],
  });
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const [{ heroSection, scenerySection, clients }, testimonials] = await Promise.all([
    getLandingContent(),
    getApprovedTestimonials(),
  ]);

  return (
    <>
      <JsonLd
        id="jsonld-breadcrumb-home"
        data={breadcrumbJsonLd(locale, [])}
      />

      <main className="flex flex-col items-center justify-center gap-10 mx-auto">
        <Hero heroSection={heroSection} clients={clients} />
        <Scenarios scenerySection={scenerySection} />
        <Operations />
        <NewsAndSocial />
        <Testimonials items={testimonials} />
        <Results />
      </main>

      <Footer />
    </>
  );
}
