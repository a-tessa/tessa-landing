import type { MetadataRoute } from "next";
import { fetchPublicContent } from "@/lib/api/content";
import { isSearchIndexingEnabled, SITE } from "@/lib/seo/schemas";
import { resolveSiteSeoFromContent } from "@/lib/seo/page-seo";

export default async function robots(): Promise<MetadataRoute.Robots> {
  if (!isSearchIndexingEnabled()) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  const publicContent = await fetchPublicContent();
  const site = resolveSiteSeoFromContent(publicContent?.content);

  if (!site.allowIndexing) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE.domain}/sitemap.xml`,
  };
}
