export const PERFIS_ESPECIAIS_RENDER_SRC =
  "/servicos/perfis-especiais/perfis-especiais-render.webp";

export const PERFIS_ESPECIAIS_INFO_CARD_IDS = [
  "design",
  "outsource",
  "benefits",
] as const;

export type PerfisEspeciaisInfoCardId =
  (typeof PERFIS_ESPECIAIS_INFO_CARD_IDS)[number];

export const PERFIS_ESPECIAIS_INFO_CARD_IMAGES: Record<
  PerfisEspeciaisInfoCardId,
  string
> = {
  design: "/servicos/perfis-especiais/projeto-perfis-especiais.webp",
  outsource: "/servicos/perfis-especiais/fabricacao-perfis-especiais.webp",
  benefits: "/servicos/perfis-especiais/beneficios-perfis-especiais.webp",
};

export const PERFIS_ESPECIAIS_SEGMENT_IDS = [
  "energia-solar",
  "setor-moveleiro",
  "agronegocio",
] as const;

export type PerfisEspeciaisSegmentId =
  (typeof PERFIS_ESPECIAIS_SEGMENT_IDS)[number];

export const PERFIS_ESPECIAIS_SEGMENT_ICONS: Record<
  PerfisEspeciaisSegmentId,
  string
> = {
  "energia-solar": "/servicos/perfis-especiais/segments/energia-solar.svg",
  "setor-moveleiro": "/servicos/perfis-especiais/segments/setor-moveleiro.svg",
  agronegocio: "/servicos/perfis-especiais/segments/agronegocio.svg",
};

export const PERFIS_ESPECIAIS_PROCESS_STEP_IDS = [
  "identify",
  "study",
  "production",
] as const;

export type PerfisEspeciaisProcessStepId =
  (typeof PERFIS_ESPECIAIS_PROCESS_STEP_IDS)[number];

export const PERFIS_ESPECIAIS_PROCESS_STEP_ICONS: Record<
  PerfisEspeciaisProcessStepId,
  string
> = {
  identify: "/servicos/perfis-especiais/process/identificar.svg",
  study: "/servicos/perfis-especiais/process/estudo.svg",
  production: "/servicos/perfis-especiais/process/producao.svg",
};

export const PERFIS_ESPECIAIS_PROCESS_STEP_NUMBERS: Record<
  PerfisEspeciaisProcessStepId,
  string
> = {
  identify: "/servicos/perfis-especiais/process/num-1.svg",
  study: "/servicos/perfis-especiais/process/num-2.svg",
  production: "/servicos/perfis-especiais/process/num-3.svg",
};

export const PERFIS_ESPECIAIS_PROCESS_ARROW_ICON =
  "/servicos/perfis-especiais/process/arrow.svg";

export const PERFIS_ESPECIAIS_COMPARISON_CHECK_ICON =
  "/servicos/perfis-especiais/comparison/check.svg";

export const PERFIS_ESPECIAIS_COMPARISON_TIMES_ICON =
  "/servicos/perfis-especiais/comparison/times.svg";

export const PERFIS_ESPECIAIS_COMPARISON_ROW_IDS = [
  "made-roll-former",
  "versatility",
  "precision",
  "raw-material-waste",
  "fewer-setups",
  "batch-waiting",
  "cost-reduction",
  "interrupted-flow",
  "continuous-process",
  "intermediate-stock",
  "higher-capacity",
  "lower-investment",
] as const;

export type PerfisEspeciaisComparisonRowId =
  (typeof PERFIS_ESPECIAIS_COMPARISON_ROW_IDS)[number];

/**
 * For each comparison row, whether the "special profile" (roll former) process
 * and the "common" process satisfy the benefit. Mirrors the original site's
 * check/times matrix.
 */
export const PERFIS_ESPECIAIS_COMPARISON_MATRIX: Record<
  PerfisEspeciaisComparisonRowId,
  { special: boolean; common: boolean }
> = {
  "made-roll-former": { special: true, common: false },
  versatility: { special: true, common: false },
  precision: { special: true, common: false },
  "raw-material-waste": { special: false, common: true },
  "fewer-setups": { special: true, common: false },
  "batch-waiting": { special: false, common: true },
  "cost-reduction": { special: true, common: false },
  "interrupted-flow": { special: false, common: true },
  "continuous-process": { special: true, common: false },
  "intermediate-stock": { special: false, common: true },
  "higher-capacity": { special: true, common: false },
  "lower-investment": { special: true, common: false },
};

export interface PerfisEspeciaisClientLogo {
  id: string;
  name: string;
  src: string;
}

export const PERFIS_ESPECIAIS_CLIENT_LOGOS: PerfisEspeciaisClientLogo[] = [
  {
    id: "bigdutchman",
    name: "Big Dutchman",
    src: "/servicos/perfis-especiais/clients/bigdutchman.png",
  },
  {
    id: "convert",
    name: "Convert",
    src: "/servicos/perfis-especiais/clients/convert.png",
  },
  {
    id: "plasson",
    name: "Plasson",
    src: "/servicos/perfis-especiais/clients/plasson.png",
  },
  {
    id: "provincia",
    name: "Província",
    src: "/servicos/perfis-especiais/clients/provincia.png",
  },
  {
    id: "soltec",
    name: "Soltec",
    src: "/servicos/perfis-especiais/clients/soltec.png",
  },
  {
    id: "usiminas",
    name: "Usiminas",
    src: "/servicos/perfis-especiais/clients/usiminas.png",
  },
];
