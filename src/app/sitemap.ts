import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo/schemas";
import { services } from "@/lib/services";
import { routing } from "@/i18n/routing";

const STATIC_PATHS = [
  "/",
  "/servicos",
  "/representantes",
  "/blog",
  "/contato",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const { locales } = routing;

  const staticEntries = STATIC_PATHS.flatMap((path) =>
    locales.map((locale) => ({
      url: `${SITE.domain}/${locale}${path === "/" ? "" : path}`,
      lastModified: now,
      changeFrequency: (path === "/" ? "weekly" : path === "/blog" ? "daily" : "monthly") as MetadataRoute.Sitemap[number]["changeFrequency"],
      priority: path === "/" ? 1 : 0.8,
    })),
  );

  const serviceEntries = services.flatMap((service) =>
    locales.map((locale) => ({
      url: `${SITE.domain}/${locale}/servicos/${service.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  );

  return [...staticEntries, ...serviceEntries];
}
