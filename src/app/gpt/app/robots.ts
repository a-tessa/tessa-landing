import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo/schemas";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE.domain}/sitemap.xml`,
  };
}
