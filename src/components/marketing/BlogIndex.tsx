import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
	BLOG_CATEGORIES,
	BLOG_LIST_PAGE_SIZE,
	buildBlogListHref,
	type BlogPost,
} from "@/lib/blog/posts";
import { BlogCategoryNav } from "@/components/marketing/BlogCategoryNav";
import { cn, freeSectionShellSpacing } from "@/lib/utils";

function formatPublishedDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

interface BlogIndexProps {
  query: string;
  ordem: "asc" | "desc";
  limite: number;
  categoria: string;
  visiblePosts: BlogPost[];
  totalFiltered: number;
  hasMore: boolean;
  className?: string;
}

function getCategoryLabel(slug: string): string | undefined {
	return BLOG_CATEGORIES.find((c) => c.slug === slug)?.label;
}

export function BlogIndex({
  query,
  ordem,
  limite,
  categoria,
  visiblePosts,
  totalFiltered,
  hasMore,
  className,
}: BlogIndexProps) {
  const t = useTranslations("blog");
  const nextLimite = limite + BLOG_LIST_PAGE_SIZE;

  return (
    <>
      <BlogCategoryNav
        activeCategory={categoria}
        query={query}
        ordem={ordem}
        showSearch
      />
      <section
        className={cn("w-full", freeSectionShellSpacing, className)}
        aria-labelledby="blog-list-heading"
      >
        <div className="mt-32 sm:mt-12">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:text-xs">
            {t("youAreReading")}
          </p>
          <h2
            id="blog-list-heading"
            className="mt-2 text-2xl font-bold uppercase tracking-tight text-foreground sm:text-3xl"
          >
            {query.trim()
              ? t("results", { count: totalFiltered })
              : getCategoryLabel(categoria) ?? t("latestArticles")}
          </h2>
        </div>

        {visiblePosts.length === 0 ? (
          <p className="mt-10 text-muted-foreground">
            {query.trim() ? (
              <>
                {t("noResults", { query: query.trim() })}{" "}
                <Link
                  href="/blog"
                  className="ml-1 font-semibold text-primary underline-offset-2 hover:underline"
                >
                  {t("clearSearch")}
                </Link>
                .
              </>
            ) : categoria.trim() ? (
              <>
                {t("noResultsInCategory")}{" "}
                <Link
                  href="/blog"
                  className="ml-1 font-semibold text-primary underline-offset-2 hover:underline"
                >
                  {t("viewAllArticles")}
                </Link>
                .
              </>
            ) : (
              t("emptyList")
            )}
          </p>
        ) : (
          <ul className="mt-10 grid list-none gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visiblePosts.map((post) => (
              <li key={post.slug}>
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block overflow-hidden"
                  >
                    <div className="relative aspect-16/10 w-full bg-muted">
                      <Image
                        src={post.imageSrc}
                        alt={post.imageAlt}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </div>
                  </Link>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-2">
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary"
                        aria-hidden
                      >
                        {post.author.initials}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
                          {post.author.name}
                        </p>
                        <time
                          dateTime={post.publishedAt}
                          className="text-[0.6rem] uppercase tracking-wide text-muted-foreground/90"
                        >
                          {formatPublishedDate(post.publishedAt)}
                        </time>
                      </div>
                    </div>
                    <h3 className="mt-4 font-bold uppercase leading-snug tracking-tight text-card-foreground">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {post.excerpt}
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}

        {hasMore ? (
          <div className="mt-12 flex justify-center">
            <Link
              href={buildBlogListHref({
                q: query,
                ordem,
                limite: nextLimite,
                categoria,
              })}
              className="text-sm font-bold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("loadMore")}
            </Link>
          </div>
        ) : null}
      </section>
    </>
  );
}
