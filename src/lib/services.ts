export type Service = {
  slug: string;
  title: string;
  description: string;
  image: string;
  highlights: string[];
  sections: {
    title: string;
    body: string;
  }[];
};

export const services: Service[] = [
  {
    slug: "estruturas-metalicas-para-telhado",
    title: "Estruturas metálicas \ne perfis sob medida",
    description:
      "Estruturas em aço galvanizado para coberturas industriais, comerciais e rurais, com engenharia aplicada e fabricação sob medida.",
    image: "/choose-scenary-section/estruturas-metalicas-para-telhado.webp",
    highlights: ["Aço galvanizado", "Perfis sob medida", "Planejamento de obra"],
    sections: [
      {
        title: "Projeto técnico",
        body: "Dimensionamento da estrutura conforme o uso, o vão, a cobertura e as condições de instalação do seu projeto.",
      },
      {
        title: "Fabricação industrial",
        body: "Peças produzidas com padronização, rastreabilidade e preparo para uma montagem mais previsível em campo.",
      },
      {
        title: "Entrega para montagem",
        body: "Organização do fornecimento para reduzir improvisos e dar mais clareza ao cronograma da obra.",
      },
    ],
  },
  {
    slug: "carport",
    title: "Carport",
    description:
      "Coberturas metálicas para estacionamentos, com solução estrutural preparada para proteção, durabilidade e uso eficiente da área.",
    image:
      "https://images.unsplash.com/photo-1599202860130-f600f4948364?q=80&w=2515&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    highlights: ["Cobertura funcional", "Aproveitamento da área", "Estrutura resistente"],
    sections: [
      {
        title: "Uso do espaço",
        body: "Planejamento da cobertura para proteger veículos e manter circulação, manutenção e operação mais simples.",
      },
      {
        title: "Estrutura metálica",
        body: "Solução em aço para ganhar resistência, repetibilidade e agilidade na execução.",
      },
      {
        title: "Preparação do projeto",
        body: "Levantamento das necessidades do local para conectar a estrutura ao objetivo técnico e operacional da área.",
      },
    ],
  },
  {
    slug: "estruturas-de-solo",
    title: "Estruturas de solo",
    description:
      "Estruturas metálicas para instalações sobre solo, pensadas para projetos de energia, operação industrial e áreas externas.",
    image: "/choose-scenary-section/estrutura-de-solo.webp",
    highlights: ["Instalação em campo", "Base estruturada", "Aplicação energética"],
    sections: [
      {
        title: "Aplicação no terreno",
        body: "Análise da área para definir uma solução estrutural compatível com o tipo de uso e com as exigências do projeto.",
      },
      {
        title: "Módulo e repetição",
        body: "Componentes pensados para facilitar a repetição da montagem e manter padrão entre as frentes de instalação.",
      },
      {
        title: "Previsibilidade",
        body: "Fornecimento orientado por engenharia para diminuir retrabalho e organizar melhor as etapas de execução.",
      },
    ],
  },
  {
    slug: "estruturas-de-aviario",
    title: "Estruturas de aviário",
    description:
      "Soluções metálicas para aviários, com foco em resistência, montagem organizada e adequação ao uso produtivo.",
    image: "/choose-scenary-section/estruturas-de-aviario.webp",
    highlights: ["Uso rural", "Montagem organizada", "Durabilidade"],
    sections: [
      {
        title: "Estrutura para produção",
        body: "Projeto direcionado para ambientes produtivos que precisam de resistência, repetibilidade e manutenção facilitada.",
      },
      {
        title: "Componentes sob medida",
        body: "Peças dimensionadas para atender o vão, a cobertura e as características de implantação do aviário.",
      },
      {
        title: "Execução com clareza",
        body: "Entrega estruturada para apoiar a montagem e reduzir incertezas durante a obra.",
      },
    ],
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}
