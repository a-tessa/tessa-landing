/**
 * Resolves the canonical base URL for the site.
 *
 * Order of precedence:
 * 1. `NEXT_PUBLIC_SITE_URL` — explicit override (set once the custom domain is live).
 * 2. `VERCEL_PROJECT_PRODUCTION_URL` — stable production host (the custom domain once
 *    assigned on Vercel, otherwise the project's `*.vercel.app` host).
 * 3. `VERCEL_URL` — per-deployment host (preview builds).
 * 4. localhost — local development.
 *
 * Keeping this dynamic ensures `canonical`/`hreflang` always match the host actually
 * serving the page, instead of pointing at a domain that isn't live yet.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) {
    return explicit.replace(/\/+$/, "");
  }

  const productionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (productionUrl) {
    return `https://${productionUrl}`;
  }

  const deploymentUrl = process.env.VERCEL_URL;
  if (deploymentUrl) {
    return `https://${deploymentUrl}`;
  }

  return "http://localhost:3000";
}

export const SITE = {
  name: "Tessa Tecnologia e Desenvolvimento LTDA",
  shortName: "Tessa",
  domain: resolveSiteUrl(),
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
