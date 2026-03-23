export const SITE = {
	name: "Tessa Tecnologia e Desenvolvimento LTDA",
	shortName: "Tessa",
	domain: "https://SEU-DOMINIO.com",
	tagline: "Estruturas metálicas e perfis sob medida",
	description:
		"Aço galvanizado. Engenharia aplicada. Produção industrial. Entrega para o seu projeto sair do papel com previsibilidade.",
	phones: ["+55 17 3267-1220", "+55 17 3267-1453"],
	email: "contato@SEU-DOMINIO.com",
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
};

export function organizationJsonLd() {
	return {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: SITE.name,
		url: SITE.domain,
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
		potentialAction: {
			"@type": "SearchAction",
			target: `${SITE.domain}/blog?q={search_term_string}`,
			"query-input": "required name=search_term_string",
		},
	};
}
