export interface EstruturasMetalicasQualityFeatureDefinition {
  id: string;
  iconSrc: string;
}

export const ESTRUTURAS_METALICAS_QUALITY_FEATURES: EstruturasMetalicasQualityFeatureDefinition[] =
  [
    {
      id: "estruturas-ecologicas",
      iconSrc:
        "/servicos/estruturas-metalicas/quality/estruturas-ecologicas.png",
    },
    {
      id: "maior-economia",
      iconSrc: "/servicos/estruturas-metalicas/quality/maior-economia.png",
    },
    {
      id: "forca-leveza-resistencia",
      iconSrc:
        "/servicos/estruturas-metalicas/quality/forca-leveza-resistencia.png",
    },
    {
      id: "maior-produtividade",
      iconSrc:
        "/servicos/estruturas-metalicas/quality/maior-produtividade.png",
    },
    {
      id: "imune-ataque-cupins",
      iconSrc:
        "/servicos/estruturas-metalicas/quality/imune-ataque-cupins.png",
    },
    {
      id: "estruturas-duraveis",
      iconSrc:
        "/servicos/estruturas-metalicas/quality/estruturas-duraveis.png",
    },
  ];

export const ESTRUTURAS_METALICAS_QUALITY_SEAL_SRC =
  "/servicos/estruturas-metalicas/quality/selo-60-anos.webp";

export interface EstruturasMetalicasQualityStat {
  id: string;
  highlight: string;
  label: string;
}

export interface EstruturasMetalicasQualityFeature {
  id: string;
  iconSrc: string;
  title: string;
  description: string;
}

export interface EstruturasMetalicasQualityContent {
  sealAlt: string;
  stats: EstruturasMetalicasQualityStat[];
  features: EstruturasMetalicasQualityFeature[];
}
