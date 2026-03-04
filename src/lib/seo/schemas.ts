export const SITE = {
  name: "Tessa",
  domain: "https://SEU-DOMINIO.com",
  tagline: "Estruturas metálicas e perfis sob medida",
  description: "Aço galvanizado. Engenharia aplicada. Produção industrial. Entrega para o seu projeto sair do papel com previsibilidade.",
  phone: "+55 11 99999-9999",
  email: "contato@SEU-DOMINIO.com",
  address: {
    streetAddress: "Rua Exemplo, 123",
    addressLocality: "Osasco",
    addressRegion: "SP",
    postalCode: "00000-000",
    addressCountry: "BR",
  },
  socials: [
    // "https://www.instagram.com/suaempresa",
  ],
  keywords: [
    "Estrutra metálica para telhado",
    "Carport",
    "Estruturas de aviário",
    "Aço galvanizado",
    "Engenharia aplicada",
    "Produção industrial",
    "Entrega para o seu projeto sair do papel com previsibilidade.",
  ],
};

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.domain,
    description: SITE.description,
    email: SITE.email,
    telephone: SITE.phone,
    sameAs: SITE.socials,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.domain,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.domain}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
