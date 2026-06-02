export const ESTRUTURA_DE_SOLO_RENDER_SRC =
  "/servicos/estrutura-de-solo/estrutura-de-solo-render.webp";

export const ESTRUTURA_DE_SOLO_INFO_COLUMN_IDS = [
  "durability",
  "benefits",
  "beyond-benefits",
] as const;

export type EstruturaDeSoloInfoColumnId =
  (typeof ESTRUTURA_DE_SOLO_INFO_COLUMN_IDS)[number];

export const ESTRUTURA_DE_SOLO_SEGMENT_IDS = [
  "avicultura",
  "produtor-rural",
  "empresas",
  "integradores",
] as const;

export type EstruturaDeSoloSegmentId =
  (typeof ESTRUTURA_DE_SOLO_SEGMENT_IDS)[number];

export const ESTRUTURA_DE_SOLO_SEGMENT_ICONS: Record<
  EstruturaDeSoloSegmentId,
  string
> = {
  avicultura: "/servicos/estrutura-de-solo/segments/avicultura.svg",
  "produtor-rural": "/servicos/estrutura-de-solo/segments/produtor-rural.svg",
  empresas: "/servicos/estrutura-de-solo/segments/empresas.svg",
  integradores: "/servicos/estrutura-de-solo/segments/integradores.svg",
};

export { getCarportClampPatentImage as getEstruturaDeSoloClampPatentImage } from "@/lib/servicos/carport-content";
