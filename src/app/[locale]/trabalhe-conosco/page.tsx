import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Footer } from "@/components/marketing/Footer";
import { RouteHeading } from "@/components/marketing/RouteHeading";
import { TalentApplicationForm } from "@/components/marketing/TalentApplicationForm";
import { localePath } from "@/i18n/routing";
import { fetchPublicContent } from "@/lib/api/content";
import { JsonLd } from "@/lib/seo/jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { resolveSiteSeoFromContent } from "@/lib/seo/page-seo";
import { breadcrumbJsonLd, SITE } from "@/lib/seo/schemas";
import { cn, freeSectionShellSpacing } from "@/lib/utils";

interface TrabalheConoscoPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: TrabalheConoscoPageProps): Promise<Metadata> {
  const { locale } = await params;
  const [t, publicContent] = await Promise.all([
    getTranslations({ locale, namespace: "pages.trabalheConosco" }),
    fetchPublicContent(locale),
  ]);
  const site = resolveSiteSeoFromContent(
    publicContent?.content,
    publicContent?.availableLocales,
  );

  return buildPageMetadata({
    locale,
    path: "/trabalhe-conosco",
    title: t("title"),
    description: t("description"),
    keywords: ["Trabalhe conosco Tessa", "Banco de talentos", "Vagas Tessa"],
    siteName: site.siteName,
    shortName: site.shortName,
    globalKeywords: site.keywords,
    allowIndexing: site.allowIndexing,
    availableLocales: site.availableLocales,
    ...(site.twitterSite ? { twitterSite: site.twitterSite } : {}),
    ...(site.defaultOgImageUrl ? { image: { url: site.defaultOgImageUrl } } : {}),
  });
}

export default async function TrabalheConoscoPage({
  params,
}: TrabalheConoscoPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.trabalheConosco" });

  return (
    <>
      <JsonLd
        id="jsonld-breadcrumb-trabalhe-conosco"
        data={breadcrumbJsonLd(locale, [
          { name: t("title"), path: "/trabalhe-conosco" },
        ])}
      />
      <JsonLd
        id="jsonld-trabalhe-conosco"
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: t("title"),
          description: t("description"),
          url: `${SITE.domain}${localePath(locale, "/trabalhe-conosco")}`,
        }}
      />

      <main className="flex flex-col items-center pt-10">
        <RouteHeading />

        <section className={cn("w-full pb-20 pt-10", freeSectionShellSpacing)}>
          <p className="mb-8 max-w-3xl font-barlow text-base leading-relaxed text-foreground sm:text-lg">
            {t("description")}
          </p>
          <TalentApplicationForm />
        </section>
      </main>

      <Footer />
    </>
  );
}
