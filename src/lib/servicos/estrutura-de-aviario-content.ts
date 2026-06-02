export const ESTRUTURA_DE_AVIARIO_QUALITY_BACKGROUND_SRC =
  "/servicos/estrutura-de-aviario/quality-background.webp";

export const ESTRUTURA_DE_AVIARIO_CHECKLIST_ITEM_IDS = [
  "galvanized-steel",
  "cost-benefit",
  "quality-control",
  "by-specialists",
] as const;

export type EstruturaDeAviarioChecklistItemId =
  (typeof ESTRUTURA_DE_AVIARIO_CHECKLIST_ITEM_IDS)[number];
