import type { MetadataRoute } from "next";
import { fetchSeoIndexContent } from "@/lib/api/seo-index";
import { isSearchIndexingEnabled, SITE } from "@/lib/seo/schemas";
import { resolveSiteSeoFromContent } from "@/lib/seo/page-seo";
import { buildRobotsDocument } from "@/lib/seo/robots-document";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const publicContent = await fetchSeoIndexContent();
  const site = resolveSiteSeoFromContent(
    publicContent?.content,
    publicContent?.availableLocales,
  );

  return buildRobotsDocument({
    searchIndexingEnabled: isSearchIndexingEnabled(),
    allowIndexing: site.allowIndexing,
    sitemapUrl: `${SITE.domain}/sitemap.xml`,
  });
}
