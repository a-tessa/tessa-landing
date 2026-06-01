import { getTranslations } from "next-intl/server";
import type { ServicesPageItem } from "@/lib/api/types";
import { STATIC_SERVICE_SLUGS, isStaticServiceSlug } from "./static-pages";

export interface ServiceNavItem {
  slug: string;
  title: string;
}

export async function getMergedServiceNavItems(
  locale: string,
  apiServices: ServicesPageItem[] | null,
): Promise<ServiceNavItem[]> {
  const t = await getTranslations({
    locale,
    namespace: "pages.staticServices",
  });

  const staticItems: ServiceNavItem[] = STATIC_SERVICE_SLUGS.map((slug) => ({
    slug,
    title: t(`${slug}.title`),
  }));

  const apiItems: ServiceNavItem[] = (apiServices ?? [])
    .filter((service) => !isStaticServiceSlug(service.slug))
    .map((service) => ({
      slug: service.slug,
      title: service.title,
    }));

  return [...staticItems, ...apiItems];
}
