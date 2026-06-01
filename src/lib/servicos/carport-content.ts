export const CARPORT_RENDER_SRC = "/servicos/carport/carport-render.webp";

export const CARPORT_INFO_COLUMN_IDS = [
  "project-types",
  "benefits",
  "beyond-benefits",
] as const;

export type CarportInfoColumnId = (typeof CARPORT_INFO_COLUMN_IDS)[number];

export const CARPORT_SEGMENT_IDS = [
  "empresas",
  "supermercados",
  "shoppings",
  "condominios",
  "integradores",
] as const;

export type CarportSegmentId = (typeof CARPORT_SEGMENT_IDS)[number];

export const CARPORT_SEGMENT_ICONS: Record<CarportSegmentId, string> = {
  empresas: "/servicos/carport/segments/empresas.svg",
  supermercados: "/servicos/carport/segments/supermercados.svg",
  shoppings: "/servicos/carport/segments/shoppings.svg",
  condominios: "/servicos/carport/segments/condominios.svg",
  integradores: "/servicos/carport/segments/integradores.svg",
};

export const CARPORT_CLAMP_PATENT_IMAGES = {
  "pt-BR": "/servicos/carport/clamp-patent-pt.png",
  es: "/servicos/carport/clamp-patent-es.png",
  en: "/servicos/carport/clamp-patent-pt.png",
} as const;

export function getCarportClampPatentImage(locale: string): string {
  const localeKey = locale as keyof typeof CARPORT_CLAMP_PATENT_IMAGES;
  return CARPORT_CLAMP_PATENT_IMAGES[localeKey] ?? CARPORT_CLAMP_PATENT_IMAGES["pt-BR"];
}
