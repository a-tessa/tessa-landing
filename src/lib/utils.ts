import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const homeSpacing = "px-12 sm:px-64 md:px-54 lg:px-54 xl:px-54"

export const sectionCardShellSpacing = "w-full px-4 sm:px-5 lg:px-7"

export const freeSectionShellSpacing = "w-full px-3.5 sm:px-24 md:px-25 lg:px-37 xl:px-60 mx-auto"

export const insideCardSpacing = "px-8 sm:px-16 md:px-20 lg:px-32 xl:px-54"

const OPERATIONS_GALLERY_IMAGES = [
  {
    src: "/operations-gallery/galeria_tessa_01.webp",
    alt: "Estrutura Carport - Tessa",
    captionKey: "galeria_tessa_01",
  },
  {
    src: "/operations-gallery/galeria_tessa_02.webp",
    alt: "Tessa Estruturas Metálicas de Qualidade",
    captionKey: "galeria_tessa_02",
  },
  {
    src: "/operations-gallery/galeria_tessa_03.webp",
    alt: "Estruturas para Energia Fotovoltaica - Tessa",
    captionKey: "galeria_tessa_03",
  },
  {
    src: "/operations-gallery/galeria_tessa_04.webp",
    alt: "Estruturas Metálicas para Telhado - Tessa",
    captionKey: "galeria_tessa_04",
  },
  {
    src: "/operations-gallery/galeria_tessa_05.webp",
    alt: "Estruturas Metálicas para Telhado - Tessa",
    captionKey: "galeria_tessa_05",
  },
  {
    src: "/operations-gallery/galeria_tessa_06.webp",
    alt: "Estrutura Metálica para Aviários - Tessa",
    captionKey: "galeria_tessa_06",
  },
  {
    src: "/operations-gallery/galeria_tessa_07.webp",
    alt: "Clamp de Fixação - Tessa",
    captionKey: "galeria_tessa_07",
  },
  {
    src: "/operations-gallery/galeria_tessa_08.webp",
    alt: "Tessa Estruturas Metálicas de Qualidade",
    captionKey: "galeria_tessa_08",
  },
] as const;

export const OPERATIONS_SLIDES = [
  { images: OPERATIONS_GALLERY_IMAGES.slice(0, 4) },
  { images: OPERATIONS_GALLERY_IMAGES.slice(4, 8) },
];

export const OPERATIONS_IMAGES = [...OPERATIONS_GALLERY_IMAGES];

export const serviceCarouselCss = /* css */ `
@keyframes service-carousel-follow-heading {
  from { top: calc(1.5rem + 16rem + 1.5rem); }
  to   { top: 9.8rem; }
}

.service-heading-carousel {
  left: 50%;
  position: fixed;
  top: calc(1.5rem + 20rem + 1.5rem);
  transform: translateX(-50%);
  z-index: 50;
}

@supports (animation-timeline: scroll()) {
  .service-heading-carousel {
    animation: service-carousel-follow-heading linear forwards;
    animation-timeline: scroll(root block);
    animation-range: 0 28vh;
  }
}

@media (prefers-reduced-motion: reduce) {
  .service-heading-carousel {
    animation-name: none;
  }
}
`;