export const SITE = {
  name: "Tessa Tecnologia e Desenvolvimento LTDA",
  shortName: "Tessa",
  domain: "https://www.tessa.com.br",
  tagline: "Estruturas metálicas e perfis sob medida",
  description:
    "Aço galvanizado. Engenharia aplicada. Produção industrial. Entrega para o seu projeto sair do papel com previsibilidade.",
  phones: ["+55 17 3267-1220", "+55 17 3267-1453"],
  email: "contato@tessa.com.br",
  address: {
    streetAddress: "Rodovia Assis Chateaubriand SP 425 KM175.9",
    addressLocality: "Guapiaçu",
    addressRegion: "SP",
    postalCode: "15110-000",
    addressCountry: "BR",
  },
  socials: {
    linkedin: "https://www.linkedin.com/company/tessa",
    youtube: "https://www.youtube.com/@tessa",
    instagram: "https://www.instagram.com/tessa",
  },
  keywords: [
    "Estrutura metálica para telhado",
    "Carport",
    "Estruturas de aviário",
    "Aço galvanizado",
    "Engenharia aplicada",
    "Produção industrial",
    "Entrega para o seu projeto sair do papel com previsibilidade.",
  ],
} as const;

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    alternateName: SITE.shortName,
    url: SITE.domain,
    logo: `${SITE.domain}/tessa-logo.svg`,
    description: SITE.description,
    email: SITE.email,
    telephone: SITE.phones[0],
    address: {
      "@type": "PostalAddress",
      ...SITE.address,
    },
    sameAs: Object.values(SITE.socials),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.domain,
    inLanguage: ["pt-BR", "en", "es"],
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.domain}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export interface BreadcrumbTrailItem {
  name: string;
  path: string;
}

/**
 * Build a `BreadcrumbList` JSON-LD for a page.
 * `trail` excludes the root (home) — we prepend it automatically.
 */
export function breadcrumbJsonLd(
  locale: string,
  trail: BreadcrumbTrailItem[],
  homeName = SITE.shortName,
) {
  const items = [{ name: homeName, path: "/" }, ...trail];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE.domain}/${locale}${item.path === "/" ? "" : item.path}`,
    })),
  };
}
