import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo/schemas";
import { services } from "@/lib/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: `${SITE.domain}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE.domain}/servicos`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    ...services.map((service) => ({
      url: `${SITE.domain}/servicos/${service.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    {
      url: `${SITE.domain}/representantes`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE.domain}/blog`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.7,
    },
  ];
}
