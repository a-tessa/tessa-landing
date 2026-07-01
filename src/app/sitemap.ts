import type { MetadataRoute } from "next";
import { fetchBlogArticles } from "@/lib/api/blog";
import type { BlogArticleListItemDto } from "@/lib/api/blog.types";
import { getServicesPagesWithMeta } from "@/lib/api/content";
import { STATIC_SERVICE_SLUGS } from "@/lib/servicos/static-pages";
import { isSearchIndexingEnabled, SITE } from "@/lib/seo/schemas";
import { routing } from "@/i18n/routing";

const STATIC_PATHS = [
  "/",
  "/servicos",
  "/representantes",
  "/blog",
  "/contato",
];

const BLOG_FETCH_CONCURRENCY = 4;

async function mapWithConcurrency<T, R>(
  items: readonly T[],
  limit: number,
  worker: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;

  async function run(): Promise<void> {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index], index);
    }
  }

  const runners = Array.from({ length: Math.min(limit, items.length) }, () =>
    run(),
  );
  await Promise.all(runners);

  return results;
}

function localizedPath(locale: string, path: string): string {
  return `/${locale}${path === "/" ? "" : path}`;
}

function absoluteUrl(locale: string, path: string): string {
  return `${SITE.domain}${localizedPath(locale, path)}`;
}

function buildLanguages(
  path: string,
  availableLocales: readonly string[] = routing.locales,
): Record<string, string> {
  const languages = Object.fromEntries(
    availableLocales.map((locale) => [locale, absoluteUrl(locale, path)]),
  );

  const xDefaultLocale = availableLocales.includes(routing.defaultLocale)
    ? routing.defaultLocale
    : availableLocales[0];

  if (xDefaultLocale) {
    languages["x-default"] = absoluteUrl(xDefaultLocale, path);
  }

  return languages;
}

function buildSlugLanguages(
  slugLocales: Map<string, Set<string>>,
  slug: string,
  getPath: (slug: string) => string,
): Record<string, string> {
  return buildLanguages(getPath(slug), [...(slugLocales.get(slug) ?? [])]);
}

async function fetchAllBlogArticles(
  locale: string,
): Promise<BlogArticleListItemDto[]> {
  const perPage = 100;
  const firstPage = await fetchBlogArticles({
    page: 1,
    perPage,
    order: "desc",
    locale,
  });

  if (!firstPage) {
    console.error(
      `[sitemap] failed to fetch blog articles (locale=${locale}, page=1); skipping locale`,
    );
    return [];
  }

  const totalPages = firstPage.pagination.totalPages;
  if (totalPages <= 1) return firstPage.articles;

  const remainingPageNumbers = Array.from(
    { length: totalPages - 1 },
    (_, index) => index + 2,
  );

  const remainingPages = await mapWithConcurrency(
    remainingPageNumbers,
    BLOG_FETCH_CONCURRENCY,
    (page) => fetchBlogArticles({ page, perPage, order: "desc", locale }),
  );

  const articles = [...firstPage.articles];
  remainingPages.forEach((page, index) => {
    if (page) {
      articles.push(...page.articles);
      return;
    }

    console.error(
      `[sitemap] failed to fetch blog articles (locale=${locale}, page=${remainingPageNumbers[index]}); sitemap may be incomplete`,
    );
  });

  return articles;
}

function mapSlugLocales(
  entries: Array<{ locale: string; slugs: string[] }>,
): Map<string, Set<string>> {
  const slugLocales = new Map<string, Set<string>>();

  for (const { locale, slugs } of entries) {
    for (const slug of slugs) {
      const locales = slugLocales.get(slug) ?? new Set<string>();
      locales.add(locale);
      slugLocales.set(slug, locales);
    }
  }

  return slugLocales;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isSearchIndexingEnabled()) {
    return [];
  }

  const { locales } = routing;

  const staticEntries = STATIC_PATHS.flatMap((path) =>
    locales.map((locale) => ({
      url: absoluteUrl(locale, path),
      changeFrequency: (path === "/"
        ? "weekly"
        : path === "/blog"
          ? "daily"
          : "monthly") as MetadataRoute.Sitemap[number]["changeFrequency"],
      priority: path === "/" ? 1 : 0.8,
      alternates: {
        languages: buildLanguages(path),
      },
    })),
  );

  const staticSlugSet = new Set<string>(STATIC_SERVICE_SLUGS);
  const servicesByLocale = await Promise.all(
    locales.map(async (locale) => {
      const { pages, updatedAt } = await getServicesPagesWithMeta(locale);
      return {
        locale,
        updatedAt,
        slugs: [
          ...STATIC_SERVICE_SLUGS,
          ...pages
            .map((service) => service.slug)
            .filter((slug) => !staticSlugSet.has(slug)),
        ],
      };
    }),
  );
  const serviceSlugLocales = mapSlugLocales(servicesByLocale);

  const serviceEntries = servicesByLocale.flatMap(({ locale, slugs, updatedAt }) =>
    slugs.map((slug) => ({
      url: absoluteUrl(locale, `/servicos/${slug}`),
      ...(updatedAt ? { lastModified: new Date(updatedAt) } : {}),
      changeFrequency: "monthly" as const,
      priority: 0.75,
      alternates: {
        languages: buildSlugLanguages(
          serviceSlugLocales,
          slug,
          (s) => `/servicos/${s}`,
        ),
      },
    })),
  );

  const blogByLocale = await Promise.all(
    locales.map(async (locale) => ({
      locale,
      articles: await fetchAllBlogArticles(locale),
    })),
  );
  const blogSlugLocales = mapSlugLocales(
    blogByLocale.map(({ locale, articles }) => ({
      locale,
      slugs: articles.map((article) => article.slug),
    })),
  );

  const blogEntries = blogByLocale.flatMap(({ locale, articles }) =>
    articles.map((article) => ({
      url: absoluteUrl(locale, `/blog/${article.slug}`),
      lastModified: new Date(
        article.updatedAt ?? article.publishedAt ?? article.createdAt,
      ),
      changeFrequency: "weekly" as const,
      priority: 0.7,
      alternates: {
        languages: buildSlugLanguages(
          blogSlugLocales,
          article.slug,
          (slug) => `/blog/${slug}`,
        ),
      },
    })),
  );

  return [...staticEntries, ...serviceEntries, ...blogEntries];
}
