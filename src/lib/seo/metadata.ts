import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { SITE } from "./schemas";

export type OpenGraphType = "website" | "article" | "profile" | "book";

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
  /** Optional OG/Twitter image. Defaults to the static `/og-image.png` (1200×630). */
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
  /**
   * Appends the site short name to the document `<title>` via `title.absolute`.
   *
   * Needed for routes that live in the same segment as the layout defining the
   * title template (e.g. the locale home), where the `%s | Tessa` template is
   * not applied automatically. Open Graph / Twitter titles stay unbranded to
   * match the rest of the site.
   */
  appendSiteName?: boolean;
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
    appendSiteName = false,
  } = input;

  const documentTitle = appendSiteName
    ? { absolute: `${title} | ${SITE.shortName}` }
    : title;

  const normalizedPath = path === "/" ? "" : path;
  const canonical = `/${locale}${normalizedPath}`;
  const absoluteUrl = `${SITE.domain}${canonical}`;

  const languages = Object.fromEntries([
    ...routing.locales.map((l) => [l, `/${l}${normalizedPath}`] as const),
    ["x-default", `/${routing.defaultLocale}${normalizedPath}`] as const,
  ]);

  const mergedKeywords = keywords
    ? Array.from(new Set<string>([...SITE.keywords, ...keywords]))
    : [...SITE.keywords];

  const images = image
    ? [
        {
          url: image.url,
          alt: image.alt ?? title,
          ...(image.width ? { width: image.width } : {}),
          ...(image.height ? { height: image.height } : {}),
        },
      ]
    : [
        {
          url: `${SITE.domain}/og-image.png`,
          alt: SITE.name,
          width: 1200,
          height: 630,
        },
      ];

  return {
    title: documentTitle,
    description,
    keywords: mergedKeywords,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type,
      locale,
      url: absoluteUrl,
      title,
      description,
      siteName: SITE.name,
      images,
      ...(publishedAt ? { publishedTime: publishedAt } : {}),
      ...(modifiedAt ? { modifiedTime: modifiedAt } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}
