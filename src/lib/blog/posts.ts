export const BLOG_LIST_PAGE_SIZE = 10;

export interface BlogPost {
	slug: string;
	title: string;
	excerpt: string;
	description: string;
	body: string[];
	contentHtml?: string;
	publishedAt: string;
	author: { name: string; initials: string; avatarUrl?: string | null };
	imageSrc: string;
	imageAlt: string;
	category: string;
}

export function buildBlogListHref(parts: {
	q?: string;
	ordem?: "asc" | "desc";
	pagina?: number;
	categoria?: string;
}): string {
	const params = new URLSearchParams();
	if (parts.categoria?.trim()) params.set("categoria", parts.categoria.trim());
	if (parts.q?.trim()) params.set("q", parts.q.trim());
	if (parts.ordem === "asc") params.set("ordem", "asc");
	if (parts.pagina !== undefined && parts.pagina > 1) {
		params.set("pagina", String(parts.pagina));
	}
	const s = params.toString();
	return s ? `/blog?${s}` : "/blog";
}
