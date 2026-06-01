import type { MetadataRoute } from "next";
import { fetchBlogArticles } from "@/lib/api/blog";
import { getServicesPages } from "@/lib/api/content";
import { STATIC_SERVICE_SLUGS } from "@/lib/servicos/static-pages";
import { SITE } from "@/lib/seo/schemas";
import { routing } from "@/i18n/routing";

const STATIC_PATHS = [
  "/",
  "/servicos",
  "/representantes",
  "/blog",
  "/contato",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const { locales } = routing;

  const staticEntries = STATIC_PATHS.flatMap((path) =>
    locales.map((locale) => ({
      url: `${SITE.domain}/${locale}${path === "/" ? "" : path}`,
      lastModified: now,
      changeFrequency: (path === "/"
        ? "weekly"
        : path === "/blog"
          ? "daily"
          : "monthly") as MetadataRoute.Sitemap[number]["changeFrequency"],
      priority: path === "/" ? 1 : 0.8,
    })),
  );

  const servicesPages = (await getServicesPages()) ?? [];
  const staticSlugSet = new Set<string>(STATIC_SERVICE_SLUGS);
  const allServiceSlugs = [
    ...STATIC_SERVICE_SLUGS,
    ...servicesPages
      .map((service) => service.slug)
      .filter((slug) => !staticSlugSet.has(slug)),
  ];

  const serviceEntries = allServiceSlugs.flatMap((slug) =>
    locales.map((locale) => ({
      url: `${SITE.domain}/${locale}/servicos/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  );

  const blogResp = await fetchBlogArticles({
    page: 1,
    perPage: 100,
    order: "desc",
  });
  const blogEntries = (blogResp?.articles ?? []).flatMap((article) =>
    locales.map((locale) => ({
      url: `${SITE.domain}/${locale}/blog/${article.slug}`,
      lastModified: new Date(
        article.updatedAt ?? article.publishedAt ?? article.createdAt,
      ),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  );

  return [...staticEntries, ...serviceEntries, ...blogEntries];
}
