export const BLOG_LIST_PAGE_SIZE = 8;

export const BLOG_CATEGORIES = [
	{ slug: "servicos", label: "Serviços" },
	{ slug: "projetos-e-planejamento", label: "Projetos e Planejamento" },
	{ slug: "materiais-e-solucoes", label: "Materiais e Soluções" },
	{ slug: "manutencao-e-durabilidade", label: "Manutenção e Durabilidade" },
] as const;

export type BlogCategorySlug = (typeof BLOG_CATEGORIES)[number]["slug"];

export interface BlogPost {
	slug: string;
	title: string;
	excerpt: string;
	description: string;
	body: string[];
	contentHtml?: string;
	publishedAt: string;
	author: { name: string; initials: string };
	imageSrc: string;
	imageAlt: string;
	category: BlogCategorySlug;
}

export function buildBlogListHref(parts: {
	q?: string;
	ordem?: "asc" | "desc";
	limite?: number;
	categoria?: string;
}): string {
	const params = new URLSearchParams();
	if (parts.categoria?.trim()) params.set("categoria", parts.categoria.trim());
	if (parts.q?.trim()) params.set("q", parts.q.trim());
	if (parts.ordem === "asc") params.set("ordem", "asc");
	if (parts.limite !== undefined && parts.limite > BLOG_LIST_PAGE_SIZE) {
		params.set("limite", String(parts.limite));
	}
	const s = params.toString();
	return s ? `/blog?${s}` : "/blog";
}
