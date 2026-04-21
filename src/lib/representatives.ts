import type { PublicRepresentative } from "./api/types";

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
  companyName?: string;
  segment: string;
  phone: string;
  email: string;
  city: string;
  stateUf: string;
}

export function mapApiRepresentatives(
  list: PublicRepresentative[] | null | undefined,
): Representative[] {
  if (!Array.isArray(list)) return [];
  return list.map((item, index) => {
    const stateUf = (item.state ?? "").trim().toUpperCase();
    return {
      id: `${stateUf || "xx"}-${index}-${item.email || item.name}`,
      name: item.name,
      companyName: item.companyName,
      segment: item.segment,
      phone: item.phone,
      email: item.email,
      city: item.city,
      stateUf,
    } satisfies Representative;
  });
}

export function getStateNameByUf(uf: string): string | undefined {
  return BRAZILIAN_STATES.find((s) => s.uf === uf)?.name;
}

export function representativesForState(
  representatives: Representative[],
  uf: string,
): Representative[] {
  return representatives.filter((r) => r.stateUf === uf);
}
