import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["pt-BR", "en", "es"],
  defaultLocale: "pt-BR",
  // Serve the default locale (pt-BR) without a prefix (`/`, `/servicos`) while
  // other locales keep theirs (`/en`, `/es/...`). Requests to the prefixed
  // default locale (`/pt-BR`) are redirected to the unprefixed URL by next-intl.
  localePrefix: "as-needed",
  // Keep `/` deterministic (always pt-BR) instead of redirecting based on
  // Accept-Language. This is friendlier to crawlers/link-preview bots and
  // avoids duplicate-content churn on the canonical home.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

/**
 * Builds a locale-aware, root-relative path honouring the `as-needed` prefix
 * strategy.
 *
 * - Default locale (pt-BR): unprefixed — `/`, `/servicos`, `/blog/post`.
 * - Other locales: prefixed — `/en`, `/es/servicos`.
 *
 * @param locale Target locale.
 * @param path Route path without locale prefix. Use `/` for the home page.
 */
export function localePath(locale: string, path: string = "/"): string {
  const normalized = path === "/" ? "" : path;
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${prefix}${normalized}` || "/";
}
