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

/**
 * Imagens do carrossel de cenários (retrato / 4:3).
 * Os headings (1920×445) são banners de hero — crop em cards verticais ficam borrados no desktop.
 */
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

/** Banner do hero Elementor (143333f) — estruturas metálicas para telhado. */
export const ESTRUTURAS_METALICAS_PARA_TELHADO_HEADING_SRC =
  "/servicos/estruturas-metalicas/estruturas-metalicas-para-telhado-heading.webp";

/** Banner do hero Elementor (f20fc12) — carport. */
export const CARPORT_HEADING_SRC =
  "/servicos/carport/carport-heading.webp";

/** Banner do hero Elementor (0b201b3) — estrutura de solo. */
export const ESTRUTURA_DE_SOLO_HEADING_SRC =
  "/servicos/estrutura-de-solo/estrutura-de-solo-heading.jpg";

/** Banner do hero Elementor (724555e) — estrutura de aviário. */
export const ESTRUTURA_DE_AVIARIO_HEADING_SRC =
  "/servicos/estrutura-de-aviario/estrutura-de-aviario-heading.jpg";

/** Banner do hero Elementor (4a773d7) — estruturas para creches. */
export const ESTRUTURAS_PARA_CRECHES_HEADING_SRC =
  "/servicos/estruturas-para-creches/estruturas-para-creches-heading.jpg";

/** Banner do hero Elementor (8dea230) — perfis especiais. */
export const PERFIS_ESPECIAIS_HEADING_SRC =
  "/servicos/perfis-especiais/perfis-especiais-heading.jpg";

/** Imagens de hero (banner wide) por serviço estático. */
export const STATIC_SERVICE_IMAGES: Partial<
  Record<StaticServiceSlug, string>
> = {
  "estruturas-metalicas-para-telhado":
    ESTRUTURAS_METALICAS_PARA_TELHADO_HEADING_SRC,
  carport: CARPORT_HEADING_SRC,
  "estrutura-de-solo": ESTRUTURA_DE_SOLO_HEADING_SRC,
  "estrutura-de-aviario": ESTRUTURA_DE_AVIARIO_HEADING_SRC,
  "estruturas-para-creches": ESTRUTURAS_PARA_CRECHES_HEADING_SRC,
  "perfis-especiais": PERFIS_ESPECIAIS_HEADING_SRC,
};

export function getStaticServiceHeadingImage(slug: StaticServiceSlug): string {
  return STATIC_SERVICE_IMAGES[slug] ?? STATIC_SERVICE_PLACEHOLDER_IMAGE;
}

export function getStaticServiceCardImage(slug: StaticServiceSlug): string {
  return STATIC_SERVICE_CARD_IMAGES[slug] ?? STATIC_SERVICE_PLACEHOLDER_IMAGE;
}
