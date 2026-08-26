import type { MetadataRoute } from "next";

export interface BuildRobotsDocumentInput {
  searchIndexingEnabled: boolean;
  allowIndexing: boolean;
  sitemapUrl: string;
}

/**
 * Preview/dev must not be crawled. Production always allows crawling so
 * HTML `noindex` can be seen; `allowIndexing` only controls the sitemap link.
 */
export function buildRobotsDocument(
  input: BuildRobotsDocumentInput,
): MetadataRoute.Robots {
  if (!input.searchIndexingEnabled) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  if (!input.allowIndexing) {
    return { rules: { userAgent: "*", allow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: input.sitemapUrl,
  };
}
