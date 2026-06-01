export interface EstruturasMetalicasProductDefinition {
  id: string;
  src: string;
}

export const ESTRUTURAS_METALICAS_PRODUCTS: EstruturasMetalicasProductDefinition[] =
  [
    { id: "caibro-aberto", src: "/servicos/estruturas-metalicas/caibro-aberto.png" },
    { id: "caibro-fechado", src: "/servicos/estruturas-metalicas/caibro-fechado.png" },
    { id: "cantoneira", src: "/servicos/estruturas-metalicas/cantoneira.png" },
    { id: "conexao-mftb-a", src: "/servicos/estruturas-metalicas/conexao-mftb-a.png" },
    { id: "conexao-base-sp-ar", src: "/servicos/estruturas-metalicas/conexao-sp-ar.png" },
    { id: "conexao-base-sp-h", src: "/servicos/estruturas-metalicas/conexao-sp-h.png" },
    { id: "conexao-sp-r", src: "/servicos/estruturas-metalicas/conexao-sp-r.png" },
    { id: "mao-francesa", src: "/servicos/estruturas-metalicas/mao-francesa.png" },
    { id: "ripa-30x20", src: "/servicos/estruturas-metalicas/ripa-30x20.png" },
    { id: "ripa-30x30", src: "/servicos/estruturas-metalicas/ripa-30x30.png" },
    {
      id: "suporte-viga-fechada-sp-sv-40",
      src: "/servicos/estruturas-metalicas/suporte-viga-fechada-sp-sv-40.png",
    },
    { id: "tabeira-frontal", src: "/servicos/estruturas-metalicas/tabeira-frontal.png" },
    { id: "tabeira-lateral", src: "/servicos/estruturas-metalicas/tabeira-lateral.png" },
    { id: "conexao-sp-e", src: "/servicos/estruturas-metalicas/conexao-sp-e.png" },
    { id: "viga-fechada", src: "/servicos/estruturas-metalicas/viga-fechada.png" },
    { id: "conexao-sp-ch", src: "/servicos/estruturas-metalicas/conexao-sp-ch.png" },
    {
      id: "tampa-viga-fechada-sp-tv-40",
      src: "/servicos/estruturas-metalicas/tampa-viga-fechada-sp-tv-40.png",
    },
  ];

export interface EstruturasMetalicasProduct {
  id: string;
  name: string;
  src: string;
}
