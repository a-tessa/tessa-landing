import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ContactForm } from "@/components/marketing/ContactForm";
import { Footer } from "@/components/marketing/Footer";
import { RouteHeading } from "@/components/marketing/RouteHeading";
import { getServicesPages } from "@/lib/api/content";
import { JsonLd } from "@/lib/seo/jsonld";
import { breadcrumbJsonLd, SITE } from "@/lib/seo/schemas";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { cn, freeSectionShellSpacing } from "@/lib/utils";

interface ContatoPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ContatoPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.contato" });

  return buildPageMetadata({
    locale,
    path: "/contato",
    title: t("title"),
    description: t("description"),
    keywords: [
      "Contato Tessa",
      "Orçamento estruturas metálicas",
      "Fale conosco",
    ],
  });
}

function contactPointJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: SITE.name,
    url: `${SITE.domain}/contato`,
    mainEntity: {
      "@type": "Organization",
      name: SITE.name,
      contactPoint: SITE.phones.map((telephone) => ({
        "@type": "ContactPoint",
        telephone,
        contactType: "customer service",
        areaServed: "BR",
        availableLanguage: ["Portuguese", "English", "Spanish"],
        email: SITE.email,
      })),
    },
  };
}

export default async function ContatoPage({ params }: ContatoPageProps) {
  const { locale } = await params;
  const [t, servicesPages] = await Promise.all([
    getTranslations({ locale, namespace: "pages.contato" }),
    getServicesPages(),
  ]);

  const serviceOptions = (servicesPages ?? []).map((service) => ({
    slug: service.slug,
    title: service.title,
  }));

  return (
    <>
      <JsonLd
        id="jsonld-breadcrumb-contato"
        data={breadcrumbJsonLd(locale, [
          { name: t("title"), path: "/contato" },
        ])}
      />
      <JsonLd id="jsonld-contact" data={contactPointJsonLd()} />

      <main className="flex flex-col items-center pt-10">
        <RouteHeading />

        <section className={cn("w-full pb-20 pt-10", freeSectionShellSpacing)}>
          <ContactForm services={serviceOptions} />
        </section>
      </main>

      <Footer />
    </>
  );
}
