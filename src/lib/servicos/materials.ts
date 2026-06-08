import { isStaticServiceSlug, type StaticServiceSlug } from "./static-pages";

export interface ServiceMaterial {
  id: string;
  fileName: string;
  /** When set, the file is shown only for these locales. */
  locales?: readonly string[];
  primary?: boolean;
}

const MATERIALS_BASE = "/servicos/materiais";

export const STATIC_SERVICE_MATERIALS: Record<
  StaticServiceSlug,
  readonly ServiceMaterial[]
> = {
  "estruturas-metalicas-para-telhado": [
    {
      id: "apresentacao-estruturas-para-telhado",
      fileName: "apresentacao-estruturas-para-telhado.pdf",
      primary: true,
    },
  ],
  carport: [
    {
      id: "folder-estruturas-energia-solar",
      fileName: "folder-estruturas-energia-solar.pdf",
      primary: true,
    },
    {
      id: "apresentacao-carport-estrutura-de-solo",
      fileName: "apresentacao-carport-estrutura-de-solo.pdf",
    },
    {
      id: "manual-carport",
      fileName: "manual-carport-pt.pdf",
      locales: ["pt-BR", "en"],
    },
    {
      id: "manual-carport",
      fileName: "manual-carport-es.pdf",
      locales: ["es"],
    },
    {
      id: "termo-garantia",
      fileName: "termo-garantia-pt.pdf",
      locales: ["pt-BR", "en"],
    },
    {
      id: "termo-garantia",
      fileName: "termo-garantia-es.pdf",
      locales: ["es"],
    },
  ],
  "estrutura-de-solo": [
    {
      id: "folder-estruturas-energia-solar",
      fileName: "folder-estruturas-energia-solar.pdf",
      primary: true,
    },
    {
      id: "apresentacao-carport-estrutura-de-solo",
      fileName: "apresentacao-carport-estrutura-de-solo.pdf",
    },
    {
      id: "manual-estrutura-de-solo",
      fileName: "manual-estrutura-de-solo-pt.pdf",
      locales: ["pt-BR", "en"],
    },
    {
      id: "manual-estrutura-de-solo",
      fileName: "manual-estrutura-de-solo-es.pdf",
      locales: ["es"],
    },
    {
      id: "termo-garantia",
      fileName: "termo-garantia-pt.pdf",
      locales: ["pt-BR", "en"],
    },
    {
      id: "termo-garantia",
      fileName: "termo-garantia-es.pdf",
      locales: ["es"],
    },
  ],
  "estrutura-de-aviario": [
    {
      id: "apresentacao-estruturas-de-aviario",
      fileName: "apresentacao-estruturas-de-aviario.pdf",
      primary: true,
    },
  ],
  "estruturas-para-creches": [],
  "perfis-especiais": [
    {
      id: "apresentacao-perfil-especial",
      fileName: "apresentacao-perfil-especial.pdf",
      primary: true,
    },
  ],
};

export interface ResolvedServiceMaterial {
  id: string;
  labelKey: string;
  href: string;
  primary: boolean;
}

function isLocaleMatch(
  locales: readonly string[] | undefined,
  locale: string,
): boolean {
  if (!locales || locales.length === 0) return true;
  return locales.includes(locale);
}

export function getServiceMaterials(
  slug: string,
  locale: string,
): ResolvedServiceMaterial[] {
  if (!isStaticServiceSlug(slug)) return [];

  const entries = STATIC_SERVICE_MATERIALS[slug];
  const seenIds = new Set<string>();

  return entries
    .filter((entry) => isLocaleMatch(entry.locales, locale))
    .filter((entry) => {
      if (seenIds.has(entry.id)) return false;
      seenIds.add(entry.id);
      return true;
    })
    .map((entry) => ({
      id: entry.id,
      labelKey: `materials.${entry.id}`,
      href: `${MATERIALS_BASE}/${slug}/${entry.fileName}`,
      primary: entry.primary ?? false,
    }));
}
