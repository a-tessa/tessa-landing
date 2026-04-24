import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Footer } from "@/components/marketing/Footer";
import { Results } from "@/components/marketing/Results";
import { RouteHeading } from "@/components/marketing/RouteHeading";
import { ServicosIntro } from "@/components/marketing/ServicosIntro";
import { Testimonials } from "@/components/marketing/Testimonials";
import { JsonLd } from "@/lib/seo/jsonld";
import { breadcrumbJsonLd } from "@/lib/seo/schemas";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getScenerySection } from "@/lib/api/content";
import { getApprovedTestimonials } from "@/lib/api/testimonials";

interface ServicosPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ServicosPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.servicos" });

  return buildPageMetadata({
    locale,
    path: "/servicos",
    title: t("title"),
    description: t("description"),
    keywords: [
      "Serviços Tessa",
      "Estruturas metálicas",
      "Energia solar empresarial",
    ],
  });
}

export default async function ServicosPage({ params }: ServicosPageProps) {
  const { locale } = await params;
  const [t, testimonials, scenerySection] = await Promise.all([
    getTranslations({ locale, namespace: "pages.servicos" }),
    getApprovedTestimonials(),
    getScenerySection(),
  ]);

  return (
    <>
      <JsonLd
        id="jsonld-breadcrumb-servicos"
        data={breadcrumbJsonLd(locale, [{ name: t("title"), path: "/servicos" }])}
      />

      <main className="flex flex-col items-center pt-10">
        <RouteHeading />
        <ServicosIntro locale={locale} scenerySection={scenerySection} />
        <Testimonials items={testimonials} />
        <Results />
      </main>

      <Footer />
    </>
  );
}
