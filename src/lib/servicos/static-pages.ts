/** Slugs das páginas de serviço fixas no código (não vêm do CMS/API). */
export const STATIC_SERVICE_SLUGS = [
  "estruturas-metalicas-para-telhado",
  "carport",
  "estrutura-de-solo",
  "estrutura-de-aviario",
  "estruturas-para-creches",
  "perfis-especiais",
] as const;

export type StaticServiceSlug = (typeof STATIC_SERVICE_SLUGS)[number];

export function isStaticServiceSlug(
  slug: string,
): slug is StaticServiceSlug {
  return (STATIC_SERVICE_SLUGS as readonly string[]).includes(slug);
}

/** Imagem padrão do card do carrossel até definir por slug em `STATIC_SERVICE_CARD_IMAGES`. */
export const STATIC_SERVICE_PLACEHOLDER_IMAGE = "/services-heading.webp";

/** Imagens do carrossel de cenários (retrato / 4:3). */
export const STATIC_SERVICE_CARD_IMAGES: Partial<
  Record<StaticServiceSlug, string>
> = {
  "estruturas-metalicas-para-telhado":
    "/servicos/estruturas-metalicas/carousel/estrutura-01.png",
  carport: "/operations-gallery/galeria_tessa_01.webp",
  "estrutura-de-solo": "/operations-gallery/galeria_tessa_03.webp",
  "estrutura-de-aviario": "/operations-gallery/galeria_tessa_06.webp",
  "estruturas-para-creches":
    "/servicos/estruturas-para-creches/estruturas-para-creches-feature.webp",
  "perfis-especiais":
    "/servicos/perfis-especiais/perfis-especiais-render.webp",
};

export function getStaticServiceCardImage(slug: StaticServiceSlug): string {
  return STATIC_SERVICE_CARD_IMAGES[slug] ?? STATIC_SERVICE_PLACEHOLDER_IMAGE;
}
