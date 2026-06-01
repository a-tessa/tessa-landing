export interface EstruturasMetalicasCarouselImageDefinition {
  id: string;
  src: string;
}

export const ESTRUTURAS_METALICAS_CAROUSEL_IMAGES: EstruturasMetalicasCarouselImageDefinition[] =
  [
    {
      id: "estrutura-01",
      src: "/servicos/estruturas-metalicas/carousel/estrutura-01.png",
    },
    {
      id: "estrutura-02",
      src: "/servicos/estruturas-metalicas/carousel/estrutura-02.png",
    },
    {
      id: "estrutura-03",
      src: "/servicos/estruturas-metalicas/carousel/estrutura-03.png",
    },
  ];

export interface EstruturasMetalicasCarouselImage {
  id: string;
  src: string;
  alt: string;
}
