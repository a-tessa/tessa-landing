import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Footer } from "@/components/marketing/Footer";
import { buildManagedPageMetadata } from "@/lib/seo/page-seo";
import { routing, type Locale } from "@/i18n/routing";
import { NotFoundScreen, type NotFoundCopy } from "./not-found-screen";

async function loadNotFoundCopy(locale: Locale): Promise<NotFoundCopy> {
  const t = await getTranslations({ locale, namespace: "notFound" });
  return {
    locale,
    title: t("title"),
    description: t("description"),
    cta: t("cta"),
  };
}

export async function generateMetadata(): Promise<Metadata> {
  // Unknown slugs stay on a static route. getLocale() reads headers() and
  // Next.js turns that into a 500 instead of this page.
  const t = await getTranslations({
    locale: routing.defaultLocale,
    namespace: "notFound",
  });

  return buildManagedPageMetadata({
    locale: routing.defaultLocale,
    pageKey: "nao-encontrada",
    path: "/404",
    fallbackTitle: t("metaTitle"),
    fallbackDescription: t("metaDescription"),
    noIndex: true,
  });
}

export default async function NotFound() {
  const copies = await Promise.all(routing.locales.map(loadNotFoundCopy));

  return (
    <NotFoundScreen
      copies={copies}
      footers={{
        "pt-BR": <Footer locale="pt-BR" />,
        en: <Footer locale="en" />,
        es: <Footer locale="es" />,
      }}
    />
  );
}
