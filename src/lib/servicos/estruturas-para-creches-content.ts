export const CRECHES_FEATURE_IMAGE_SRC =
  "/servicos/estruturas-para-creches/estruturas-para-creches-feature.webp";

export const CRECHES_CHECKLIST_ITEM_IDS = [
  "galvanized-steel",
  "safety-compliance",
  "low-maintenance",
  "custom-projects",
] as const;

export type CrechesChecklistItemId =
  (typeof CRECHES_CHECKLIST_ITEM_IDS)[number];
