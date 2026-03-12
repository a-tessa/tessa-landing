import { Container } from "./Container";
import { BentoCarousel } from "./BentoCarousel";

const OPERATIONS_SLIDES = [
  {
    images: [
      {
        src: "/choose-scenary-section/estruturas-metalicas-para-telhado.webp",
        alt: "Operário manuseando bobina de aço galvanizado na fábrica Tessa",
      },
      {
        src: "/choose-scenary-section/estrutura-de-solo.webp",
        alt: "Fachada de galpão com logomarca Tessa em estrutura metálica",
      },
      {
        src: "/choose-scenary-section/estruturas-de-aviario.webp",
        alt: "Colaborador instalando perfil metálico com equipamento de proteção",
      },
      {
        src: "/choose-scenary-section/estruturas-metalicas-para-telhado.webp",
        alt: "Ponte rolante PF-15 movimentando estrutura no galpão",
      },
      {
        src: "/choose-scenary-section/estrutura-de-solo.webp",
        alt: "Visão geral do estoque de perfis metálicos no pátio da Tessa",
      },
      {
        src: "/choose-scenary-section/estruturas-de-aviario.webp",
        alt: "Caixas de madeira com componentes prontos para expedição",
      },
    ],
  },
  {
    images: [
      {
        src: "/choose-scenary-section/estruturas-de-aviario.webp",
        alt: "Linha de produção com vigas e tubos galvanizados empilhados",
      },
      {
        src: "/choose-scenary-section/estruturas-metalicas-para-telhado.webp",
        alt: "Processo de corte de chapas metálicas na fábrica",
      },
      {
        src: "/choose-scenary-section/estrutura-de-solo.webp",
        alt: "Área de montagem de estruturas metálicas",
      },
      {
        src: "/choose-scenary-section/estruturas-de-aviario.webp",
        alt: "Operação de soldagem de perfis sob medida",
      },
      {
        src: "/choose-scenary-section/estruturas-metalicas-para-telhado.webp",
        alt: "Estoque de tubos galvanizados organizados por perfil",
      },
      {
        src: "/choose-scenary-section/estrutura-de-solo.webp",
        alt: "Expedição de estruturas embaladas para transporte",
      },
    ],
  },
  {
    images: [
      {
        src: "/choose-scenary-section/estrutura-de-solo.webp",
        alt: "Corte automatizado de chapas de aço na unidade fabril",
      },
      {
        src: "/choose-scenary-section/estruturas-de-aviario.webp",
        alt: "Montagem de treliças metálicas no galpão principal",
      },
      {
        src: "/choose-scenary-section/estruturas-metalicas-para-telhado.webp",
        alt: "Inspeção de qualidade em perfis galvanizados",
      },
      {
        src: "/choose-scenary-section/estrutura-de-solo.webp",
        alt: "Operador controlando máquina de dobra de perfis",
      },
      {
        src: "/choose-scenary-section/estruturas-de-aviario.webp",
        alt: "Carregamento de estruturas metálicas em caminhão",
      },
      {
        src: "/choose-scenary-section/estruturas-metalicas-para-telhado.webp",
        alt: "Vista geral do pátio de produção da Tessa",
      },
    ],
  },
];

export function Operations() {
  return (
    <section
      aria-labelledby="operations-title"
      className="mt-14 w-full px-6"
    >
      <Container className="h-full px-0! sm:px-0! lg:px-0!">
        <BentoCarousel slides={OPERATIONS_SLIDES} />
      </Container>
    </section>
  );
}
