import { getTranslations } from "next-intl/server";
import { BackNavLink } from "@/components/marketing/BackNavLink";
import { Footer } from "@/components/marketing/Footer";
import { Heading } from "@/components/marketing/Heading";
import { ServiceNavCarousel } from "@/components/marketing/ServiceNavCarousel";
import { Testimonials } from "@/components/marketing/Testimonials";
import { JsonLd } from "@/lib/seo/jsonld";
import { breadcrumbJsonLd, SITE } from "@/lib/seo/schemas";
import { getServicesPages } from "@/lib/api/content";
import { getApprovedTestimonials } from "@/lib/api/testimonials";
import { CarportSections } from "@/components/marketing/static-services/CarportSections";
import { EstruturaDeAviarioSections } from "@/components/marketing/static-services/EstruturaDeAviarioSections";
import { EstruturaDeSoloSections } from "@/components/marketing/static-services/EstruturaDeSoloSections";
import { EstruturasMetalicasTelhadoSections } from "@/components/marketing/static-services/EstruturasMetalicasTelhadoSections";
import { EstruturasParaCrechesSections } from "@/components/marketing/static-services/EstruturasParaCrechesSections";
import { PerfisEspeciaisSections } from "@/components/marketing/static-services/PerfisEspeciaisSections";
import { getMergedServiceNavItems } from "@/lib/servicos/nav";
import type { StaticServiceSlug } from "@/lib/servicos/static-pages";
import { cn, freeSectionShellSpacing } from "@/lib/utils";

function StaticServicePageSections({
  locale,
  slug,
}: {
  locale: string;
  slug: StaticServiceSlug;
}) {
  switch (slug) {
    case "estruturas-metalicas-para-telhado":
      return <EstruturasMetalicasTelhadoSections locale={locale} />;
    case "carport":
      return <CarportSections locale={locale} />;
    case "estrutura-de-solo":
      return <EstruturaDeSoloSections locale={locale} />;
    case "estrutura-de-aviario":
      return <EstruturaDeAviarioSections locale={locale} />;
    case "estruturas-para-creches":
      return <EstruturasParaCrechesSections locale={locale} />;
    case "perfis-especiais":
      return <PerfisEspeciaisSections locale={locale} />;
    default:
      return null;
  }
}

interface StaticServicePageProps {
  locale: string;
  slug: StaticServiceSlug;
}

export async function StaticServicePage({ locale, slug }: StaticServicePageProps) {
  const [t, ts, tPage, testimonials, servicesPages] = await Promise.all([
    getTranslations({ locale, namespace: "pages.servicoDetail" }),
    getTranslations({ locale, namespace: "pages.servicos" }),
    getTranslations({ locale, namespace: "pages.staticServices" }),
    getApprovedTestimonials(),
    getServicesPages(),
  ]);

  const title = tPage(`${slug}.title`);
  const description = tPage(`${slug}.description`);
  const navItems = await getMergedServiceNavItems(locale, servicesPages);

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: title,
    description: description || undefined,
    provider: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.domain,
    },
    areaServed: {
      "@type": "Country",
      name: "Brasil",
    },
    url: `${SITE.domain}/${locale}/servicos/${slug}`,
  };

  return (
    <>
      <JsonLd
        id="jsonld-breadcrumb-servico-estatico"
        data={breadcrumbJsonLd(locale, [
          { name: ts("title"), path: "/servicos" },
          { name: title, path: `/servicos/${slug}` },
        ])}
      />
      <JsonLd id={`jsonld-service-${slug}`} data={serviceJsonLd} />

      <main className="mt-36 flex flex-col items-center sm:mt-20">
        <Heading title={title} description={description} />

        <section className="w-full">
          <div className={cn("mb-4", freeSectionShellSpacing)}>
            <BackNavLink
              href="/servicos"
              label={t("backToServices")}
              navLabel={t("serviceNavLabel")}
            />
          </div>
        </section>
        <ServiceNavCarousel
          locale={locale}
          items={navItems}
          activeSlug={slug}
        />

        <StaticServicePageSections locale={locale} slug={slug} />


        <Testimonials items={testimonials} />
      </main>

      <Footer />
    </>
  );
}
