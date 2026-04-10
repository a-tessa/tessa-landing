export interface BrazilianState {
  uf: string;
  name: string;
}

export interface BrazilianRegion {
  id: string;
  name: string;
  states: BrazilianState[];
}

/**
 * Estados agrupados por macrorregião (IBGE): Norte, Nordeste, Centro-Oeste,
 * Sudeste e Sul. Dentro de cada região, ordem alfabética pelo nome do estado.
 */
export const BRAZILIAN_REGIONS: BrazilianRegion[] = [
  {
    id: "norte",
    name: "Norte",
    states: [
      { uf: "AC", name: "Acre" },
      { uf: "AP", name: "Amapá" },
      { uf: "AM", name: "Amazonas" },
      { uf: "PA", name: "Pará" },
      { uf: "RO", name: "Rondônia" },
      { uf: "RR", name: "Roraima" },
      { uf: "TO", name: "Tocantins" },
    ],
  },
  {
    id: "nordeste",
    name: "Nordeste",
    states: [
      { uf: "AL", name: "Alagoas" },
      { uf: "BA", name: "Bahia" },
      { uf: "CE", name: "Ceará" },
      { uf: "MA", name: "Maranhão" },
      { uf: "PB", name: "Paraíba" },
      { uf: "PE", name: "Pernambuco" },
      { uf: "PI", name: "Piauí" },
      { uf: "RN", name: "Rio Grande do Norte" },
      { uf: "SE", name: "Sergipe" },
    ],
  },
  {
    id: "centro-oeste",
    name: "Centro-Oeste",
    states: [
      { uf: "DF", name: "Distrito Federal" },
      { uf: "GO", name: "Goiás" },
      { uf: "MT", name: "Mato Grosso" },
      { uf: "MS", name: "Mato Grosso do Sul" },
    ],
  },
  {
    id: "sudeste",
    name: "Sudeste",
    states: [
      { uf: "ES", name: "Espírito Santo" },
      { uf: "MG", name: "Minas Gerais" },
      { uf: "RJ", name: "Rio de Janeiro" },
      { uf: "SP", name: "São Paulo" },
    ],
  },
  {
    id: "sul",
    name: "Sul",
    states: [
      { uf: "PR", name: "Paraná" },
      { uf: "RS", name: "Rio Grande do Sul" },
      { uf: "SC", name: "Santa Catarina" },
    ],
  },
];

/** Lista plana de todos os estados (útil para buscas e metadados). */
export const BRAZILIAN_STATES: BrazilianState[] = BRAZILIAN_REGIONS.flatMap(
  (r) => r.states,
);

export interface Representative {
  id: string;
  name: string;
  segment: string;
  phone: string;
  email: string;
  city: string;
  stateUf: string;
}

/** Lista editável: representantes / fornecedores por UF. */
export const REPRESENTATIVES: Representative[] = [
  {
    id: "mg-1",
    name: "Fernando",
    segment: "Cobertura Residencial",
    phone: "(34) 99999-0001",
    email: "fernando.exemplo@fornecedor.com.br",
    city: "Uberlândia",
    stateUf: "MG",
  },
  {
    id: "mg-2",
    name: "Mariana",
    segment: "Estruturas metálicas",
    phone: "(31) 98888-0002",
    email: "mariana.exemplo@fornecedor.com.br",
    city: "Belo Horizonte",
    stateUf: "MG",
  },
  {
    id: "sp-1",
    name: "Ricardo",
    segment: "Cobertura comercial",
    phone: "(11) 97777-0003",
    email: "ricardo.exemplo@fornecedor.com.br",
    city: "São Paulo",
    stateUf: "SP",
  },
  {
    id: "sp-2",
    name: "Paula",
    segment: "Telhas e acessórios",
    phone: "(19) 96666-0004",
    email: "paula.exemplo@fornecedor.com.br",
    city: "Campinas",
    stateUf: "SP",
  },
  {
    id: "pr-1",
    name: "André",
    segment: "Cobertura industrial",
    phone: "(41) 95555-0005",
    email: "andre.exemplo@fornecedor.com.br",
    city: "Curitiba",
    stateUf: "PR",
  },
  {
    id: "rj-1",
    name: "Camila",
    segment: "Cobertura residencial",
    phone: "(21) 94444-0006",
    email: "camila.exemplo@fornecedor.com.br",
    city: "Rio de Janeiro",
    stateUf: "RJ",
  },
];

export function getStateNameByUf(uf: string): string | undefined {
  return BRAZILIAN_STATES.find((s) => s.uf === uf)?.name;
}

export function representativesForState(uf: string): Representative[] {
  return REPRESENTATIVES.filter((r) => r.stateUf === uf);
}
