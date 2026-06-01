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

/** Imagem padrão do card do carrossel até definir por slug em `STATIC_SERVICE_IMAGES`. */
export const STATIC_SERVICE_PLACEHOLDER_IMAGE = "/services-heading.webp";

/** Imagens do carrossel por serviço estático — preencher quando disponível. */
export const STATIC_SERVICE_IMAGES: Partial<
  Record<StaticServiceSlug, string>
> = {};

export function getStaticServiceCardImage(slug: StaticServiceSlug): string {
  return STATIC_SERVICE_IMAGES[slug] ?? STATIC_SERVICE_PLACEHOLDER_IMAGE;
}
