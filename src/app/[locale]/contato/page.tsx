import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ContactForm } from "@/components/marketing/ContactForm";
import { Footer } from "@/components/marketing/Footer";
import { RouteHeading } from "@/components/marketing/RouteHeading";
import {
  getCompanyInformation,
  getHeadingImageUrl,
  getServicesPages,
} from "@/lib/api/content";
import {
  resolveCompanyInformation,
  toPublicCompanyContact,
} from "@/lib/company-information";
import { getMergedServiceNavItems } from "@/lib/servicos/nav";
import { JsonLd } from "@/lib/seo/jsonld";
import { breadcrumbJsonLd, SITE } from "@/lib/seo/schemas";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { localePath } from "@/i18n/routing";
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

function contactPointJsonLd(
  locale: string,
  contact: {
    name: string;
    email: string;
    phones: readonly string[];
  },
) {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: contact.name,
    url: `${SITE.domain}${localePath(locale, "/contato")}`,
    mainEntity: {
      "@type": "Organization",
      name: contact.name,
      contactPoint: contact.phones.map((telephone) => ({
        "@type": "ContactPoint",
        telephone,
        contactType: "customer service",
        areaServed: "BR",
        availableLanguage: ["Portuguese", "English", "Spanish"],
        email: contact.email,
      })),
    },
  };
}

export default async function ContatoPage({ params }: ContatoPageProps) {
  const { locale } = await params;
  const [t, servicesPages, headingImageUrl, companyContact] = await Promise.all([
    getTranslations({ locale, namespace: "pages.contato" }),
    getServicesPages(locale),
    getHeadingImageUrl("contato", locale),
    getCompanyInformation(locale).then((section) =>
      toPublicCompanyContact(resolveCompanyInformation(section)),
    ),
  ]);

  const serviceOptions = await getMergedServiceNavItems(locale, servicesPages);

  return (
    <>
      <JsonLd
        id="jsonld-breadcrumb-contato"
        data={breadcrumbJsonLd(locale, [
          { name: t("title"), path: "/contato" },
        ])}
      />
      <JsonLd id="jsonld-contact" data={contactPointJsonLd(locale, companyContact)} />

      <main className="flex flex-col items-center pt-10">
        <RouteHeading imageSrc={headingImageUrl} />

        <section className={cn("w-full pb-20 pt-10", freeSectionShellSpacing)}>
          <ContactForm
            services={serviceOptions}
            companyContact={companyContact}
          />
        </section>
      </main>

      <Footer />
    </>
  );
}
