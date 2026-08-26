import type { Metadata } from "next";
import { localePath, routing } from "@/i18n/routing";
import { isSearchIndexingEnabled, SITE } from "./schemas";

const DEFAULT_OG_IMAGE = {
  path: "/opengraph-image",
  width: 1200,
  height: 630,
} as const;

export type OpenGraphType = "website" | "article" | "profile" | "book";

const LOCALE_PREFIXES = new Set(["en", "es", "pt-br"]);

export interface BuildPageMetadataInput {
  /** Current locale (used for canonical + OG). */
  locale: string;
  /** Route path with no locale prefix (e.g. `/servicos`, `/blog/meu-post`). Use `/` for home. */
  path: string;
  /** Page title (without the site suffix — the layout template adds it). */
  title: string;
  /** Meta description. */
  description: string;
  /** Optional extra keywords merged with the global `SITE.keywords`. */
  keywords?: readonly string[];
  /** Open Graph type — defaults to `"website"`. */
  type?: OpenGraphType;
  /** Optional OG/Twitter image. Defaults to `/opengraph-image` (1200×630). */
  image?: {
    url: string;
    alt?: string;
    width?: number;
    height?: number;
  };
  /** ISO date for `article:published_time`. */
  publishedAt?: string;
  /** ISO date for `article:modified_time`. */
  modifiedAt?: string;
  /** Forces search-engine opt-out when `true`. */
  noIndex?: boolean;
  /** Independent of `noIndex`: when true, links on the page should not pass authority. */
  noFollow?: boolean;
  /** Optional override for `hreflang` alternates when not every locale has this path. */
  alternateLanguages?: Record<string, string>;
  /**
   * Appends the site short name to the document `<title>` via `title.absolute`.
   *
   * Needed for routes that live in the same segment as the layout defining the
   * title template (e.g. the locale home), where the `%s | Tessa` template is
   * not applied automatically. Open Graph / Twitter titles stay unbranded to
   * match the rest of the site.
   */
  appendSiteName?: boolean;
  /** Overrides `SITE.name` in Open Graph `siteName`. */
  siteName?: string;
  /** Overrides `SITE.shortName` when appending the brand to the document title. */
  shortName?: string;
  /** Replaces the global keyword set merged into the page keywords. */
  globalKeywords?: readonly string[];
  /** When false, the page is opted out of indexing even if `noIndex` is unset. */
  allowIndexing?: boolean;
  /** Open Graph / Twitter title. Empty inherits the page `title`, without the title template. */
  socialTitle?: string;
  /** Open Graph / Twitter description. Empty inherits the page `description`. */
  socialDescription?: string;
  /** Relative path or absolute URL that replaces the route-generated canonical. */
  canonicalOverride?: string;
  /** Handle used as `twitter:site`, e.g. `@tessaeng`. */
  twitterSite?: string;
  /** Locales advertised in hreflang. Empty inherits every routed locale. */
  availableLocales?: readonly string[];
}

export function parseCanonicalOverride(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (trimmed.length === 0) return undefined;
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const url = new URL(trimmed);
      if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
      return trimmed;
    } catch {
      return undefined;
    }
  }
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return undefined;
  if (/[?#]/.test(trimmed)) return undefined;
  return trimmed;
}

function stripLocalePrefix(pathname: string): string {
  let path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  const match = path.match(/^\/(en|es|pt-br)(?=\/|$)/i);
  if (match) {
    const rest = path.slice(match[0].length);
    path = rest.length === 0 ? "/" : rest;
  }
  return path.length === 0 ? "/" : path;
}

function toInternalCanonicalPath(path: string): string {
  let normalized = path;
  if (normalized.length > 1) {
    normalized = normalized.replace(/\/+$/, "");
  }
  const firstSegment = normalized.split("/").filter(Boolean)[0]?.toLowerCase();
  if (firstSegment && LOCALE_PREFIXES.has(firstSegment)) {
    return stripLocalePrefix(normalized);
  }
  return normalized.length === 0 ? "/" : normalized;
}

export function isSamePublicHost(url: URL, siteOrigin: string): boolean {
  try {
    return url.hostname.toLowerCase() === new URL(siteOrigin).hostname.toLowerCase();
  } catch {
    return false;
  }
}

export function languagesForPath(
  path: string,
  availableLocales: readonly string[] = routing.locales,
): Record<string, string> {
  const locales = availableLocales.length > 0 ? availableLocales : routing.locales;
  const languages = Object.fromEntries(
    locales.map((locale) => [locale, localePath(locale, path)] as const),
  );
  const xDefaultLocale = locales.includes(routing.defaultLocale)
    ? routing.defaultLocale
    : locales[0];
  if (xDefaultLocale) {
    languages["x-default"] = localePath(xDefaultLocale, path);
  }
  return languages;
}

export function resolveCanonicalAndLanguages(input: {
  locale: string;
  path: string;
  canonicalOverride?: string;
  siteOrigin: string;
  alternateLanguages?: Record<string, string>;
  availableLocales?: readonly string[];
}): {
  canonical: string;
  languages: Record<string, string> | undefined;
  isExternalCanonical: boolean;
} {
  const override = parseCanonicalOverride(input.canonicalOverride);
  const languagesOf = (path: string): Record<string, string> =>
    input.alternateLanguages ??
    languagesForPath(path, input.availableLocales ?? routing.locales);

  if (!override) {
    return {
      canonical: localePath(input.locale, input.path),
      languages: languagesOf(input.path),
      isExternalCanonical: false,
    };
  }

  let internalPath: string | undefined;

  if (/^https?:\/\//i.test(override)) {
    try {
      const url = new URL(override);
      if (isSamePublicHost(url, input.siteOrigin)) {
        internalPath = toInternalCanonicalPath(url.pathname);
      }
    } catch {
      // Fall through to the external-literal behaviour.
    }

    if (internalPath === undefined) {
      return {
        canonical: override,
        languages: undefined,
        isExternalCanonical: true,
      };
    }
  } else {
    internalPath = toInternalCanonicalPath(override);
  }

  return {
    canonical: localePath(input.locale, internalPath),
    languages: languagesOf(internalPath),
    isExternalCanonical: false,
  };
}

export function resolveRobots(input: {
  noIndex: boolean;
  noFollow: boolean;
  allowIndexing: boolean;
  searchIndexingEnabled: boolean;
}): Metadata["robots"] {
  const index = !input.noIndex && input.allowIndexing && input.searchIndexingEnabled;
  const follow = !input.noFollow;

  if (!index) {
    return {
      index: false,
      follow,
      googleBot: {
        index: false,
        follow,
      },
    };
  }

  return {
    index: true,
    follow,
    googleBot: {
      index: true,
      follow,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  };
}

/**
 * Centralised page metadata builder.
 *
 * - Keeps canonical + `hreflang` alternates consistent across locales.
 * - Enables per-page Open Graph overrides while inheriting the layout defaults.
 * - Ensures every page ships a Twitter card and robot directives.
 */
export function buildPageMetadata(input: BuildPageMetadataInput): Metadata {
  const {
    locale,
    path,
    title,
    description,
    keywords,
    type = "website",
    image,
    publishedAt,
    modifiedAt,
    noIndex = false,
    noFollow = false,
    alternateLanguages,
    appendSiteName = false,
    siteName,
    shortName,
    globalKeywords,
    allowIndexing = true,
    socialTitle,
    socialDescription,
    canonicalOverride,
    twitterSite,
    availableLocales,
  } = input;

  const resolvedShortName = shortName ?? SITE.shortName;
  const resolvedSiteName = siteName ?? SITE.name;
  const resolvedKeywords = globalKeywords ?? SITE.keywords;
  const shareTitle = socialTitle?.trim() || title;
  const shareDescription = socialDescription?.trim() || description;

  const documentTitle = appendSiteName
    ? { absolute: `${title} | ${resolvedShortName}` }
    : title;

  const { canonical, languages, isExternalCanonical } = resolveCanonicalAndLanguages({
    locale,
    path,
    canonicalOverride,
    siteOrigin: SITE.domain,
    alternateLanguages,
    availableLocales,
  });
  const absoluteUrl = /^https?:\/\//i.test(canonical)
    ? canonical
    : `${SITE.domain}${canonical}`;
  const shouldIndex =
    !noIndex && allowIndexing && isSearchIndexingEnabled();

  const mergedKeywords = keywords
    ? Array.from(new Set<string>([...resolvedKeywords, ...keywords]))
    : [...resolvedKeywords];

  const images = image
    ? [
        {
          url: image.url,
          alt: image.alt ?? shareTitle,
          ...(image.width ? { width: image.width } : {}),
          ...(image.height ? { height: image.height } : {}),
        },
      ]
    : [
        {
          url: `${SITE.domain}${DEFAULT_OG_IMAGE.path}`,
          alt: resolvedSiteName,
          width: DEFAULT_OG_IMAGE.width,
          height: DEFAULT_OG_IMAGE.height,
        },
      ];

  return {
    title: documentTitle,
    description,
    keywords: mergedKeywords,
    alternates: {
      canonical,
      ...(shouldIndex && !isExternalCanonical && languages ? { languages } : {}),
    },
    openGraph: {
      type,
      locale,
      url: absoluteUrl,
      title: shareTitle,
      description: shareDescription,
      siteName: resolvedSiteName,
      images,
      ...(publishedAt ? { publishedTime: publishedAt } : {}),
      ...(modifiedAt ? { modifiedTime: modifiedAt } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description: shareDescription,
      images,
      ...(twitterSite ? { site: twitterSite } : {}),
    },
    robots: resolveRobots({
      noIndex,
      noFollow,
      allowIndexing,
      searchIndexingEnabled: isSearchIndexingEnabled(),
    }),
  };
}
