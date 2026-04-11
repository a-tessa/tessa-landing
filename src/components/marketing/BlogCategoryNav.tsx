import Link from "next/link";
import { BLOG_CATEGORIES, buildBlogListHref } from "@/lib/blog/posts";
import { cn, freeSectionShellSpacing, serviceCarouselCss } from "@/lib/utils";
import { Search } from "lucide-react";

function CategoryTab({
	href,
	label,
	isActive,
}: {
	href: string;
	label: string;
	isActive: boolean;
}) {
	return (
		<Link
			href={href}
			className={cn(
				"relative flex h-20 shrink-0 items-center text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground sm:text-xs",
				isActive && "text-primary font-bold",
			)}
		>
			{label}
			<span
				className={cn(
					"absolute bottom-0 left-0 h-1 rounded-full bg-primary transition-all",
					isActive ? "w-full opacity-100" : "w-0 opacity-0",
				)}
				aria-hidden
			/>
		</Link>
	);
}

interface BlogCategoryNavProps {
	activeCategory: string;
	query?: string;
	ordem?: "asc" | "desc";
	showSearch?: boolean;
}

export function BlogCategoryNav({
	activeCategory,
	query = "",
	ordem = "desc",
	showSearch = false,
}: BlogCategoryNavProps) {
	return (
		<>
			<style href="service-heading-carousel" precedence="component">
				{serviceCarouselCss}
			</style>
			<div
				className={cn(
					"relative z-50 service-heading-carousel w-full",
					freeSectionShellSpacing,
				)}
			>
				<div className="flex items-center gap-0 rounded-full bg-muted px-4 sm:px-8">
					<nav
						className="flex items-center gap-x-6 overflow-x-auto scrollbar-none"
						aria-label="Filtrar artigos por categoria"
					>
						<CategoryTab
							href={buildBlogListHref({ q: query, ordem })}
							label="Últimos artigos"
							isActive={!activeCategory}
						/>
						{BLOG_CATEGORIES.map((cat) => (
							<CategoryTab
								key={cat.slug}
								href={buildBlogListHref({
									q: query,
									ordem,
									categoria: cat.slug,
								})}
								label={cat.label}
								isActive={activeCategory === cat.slug}
							/>
						))}
					</nav>

					{showSearch ? (
						<form
							method="get"
							action="/blog"
							role="search"
							className="ml-auto flex shrink-0 items-center"
						>
							{ordem === "asc" ? (
								<input type="hidden" name="ordem" value="asc" />
							) : null}
							{activeCategory ? (
								<input
									type="hidden"
									name="categoria"
									value={activeCategory}
								/>
							) : null}
							<label htmlFor="blog-search-q" className="sr-only">
								Buscar artigo pelo título
							</label>
							<input
								id="blog-search-q"
								name="q"
								type="search"
								defaultValue={query}
								placeholder="Buscar por título..."
								autoComplete="off"
								className="h-11 w-full min-w-0 flex-1 rounded-l-full bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary border-0 shadow-none"
							/>
							<button
								type="submit"
								className="flex h-11 w-11 shrink-0 items-center justify-center rounded-r-full bg-card text-primary transition-colors hover:bg-accent"
								aria-label="Buscar"
							>
								<Search
									className="h-5 w-5"
									strokeWidth={2}
									aria-hidden
								/>
							</button>
						</form>
					) : null}
				</div>
			</div>
		</>
	);
}
