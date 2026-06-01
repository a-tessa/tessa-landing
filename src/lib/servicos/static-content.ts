import type { Locale } from "@/i18n/routing";
import type { StaticServiceSlug } from "./static-pages";

/** URLs de vídeo YouTube por página de serviço estática (mesmo vídeo em todos os idiomas). */
export const STATIC_SERVICE_VIDEO_URLS: Partial<
  Record<StaticServiceSlug, string>
> = {
  "estruturas-metalicas-para-telhado":
    "https://www.youtube.com/watch?v=B7ffJg1XHcM",
};

/** URLs de vídeo por idioma quando o conteúdo varia entre locales. */
export const STATIC_SERVICE_VIDEO_URLS_BY_LOCALE: Partial<
  Record<StaticServiceSlug, Partial<Record<Locale, string>>>
> = {
  carport: {
    "pt-BR": "https://www.youtube.com/watch?v=Xxs_fOB5kI0",
    es: "https://www.youtube.com/watch?v=ihdrl3pG4qg",
  },
};

export function getStaticServiceVideoUrl(
  slug: StaticServiceSlug,
  locale?: string,
): string | undefined {
  const localeUrls = STATIC_SERVICE_VIDEO_URLS_BY_LOCALE[slug];
  if (locale && localeUrls) {
    const localeKey = locale as Locale;
    return localeUrls[localeKey] ?? localeUrls["pt-BR"];
  }

  return STATIC_SERVICE_VIDEO_URLS[slug];
}
