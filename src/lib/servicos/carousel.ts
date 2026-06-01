import { getTranslations } from "next-intl/server";
import type { SceneryItem } from "@/lib/api/types";
import {
  getStaticServiceCardImage,
  isStaticServiceSlug,
  STATIC_SERVICE_SLUGS,
} from "./static-pages";

export async function getStaticServiceCarouselItems(
  locale: string,
): Promise<SceneryItem[]> {
  const t = await getTranslations({
    locale,
    namespace: "pages.staticServices",
  });

  return STATIC_SERVICE_SLUGS.map((slug) => ({
    slug,
    title: t(`${slug}.title`),
    category: "",
    image: getStaticServiceCardImage(slug),
  }));
}

/** Cenários do carrossel (home e /servicos): estáticos primeiro, depois API sem slug duplicado. */
export async function getScenariosCarouselItems(
  locale: string,
  scenerySection?: SceneryItem[] | null,
): Promise<SceneryItem[]> {
  const staticItems = await getStaticServiceCarouselItems(locale);
  const staticSlugSet = new Set<string>(STATIC_SERVICE_SLUGS);

  const apiItems = (scenerySection ?? []).filter(
    (item) => !staticSlugSet.has(item.slug) && !isStaticServiceSlug(item.slug),
  );

  return [...staticItems, ...apiItems];
}
