import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { BLOG_CATEGORIES, buildBlogListHref } from "@/lib/blog/posts";
import { cn, freeSectionShellSpacing } from "@/lib/utils";
import { BlogCategoryNavScroller } from "@/components/marketing/BlogCategoryNavScroller";

/**
 * Breakpoint-aware scroll-driven positioning.
 *
 * `--nav-top-from` / `--nav-top-to` = vertical position for the
 * expanded / shrunk states of the `<HeroNavbar />` above.
 *
 * Formula: hero-top (1.5rem) + hero-height + gap (1rem)
 *   - expanded hero heights: 18 / 20 / 22 / 24 rem
 *   - shrunk hero heights:    6.5 / 7 / 7.5 / 8 rem
 *
 * Keep `animation-range` in sync with `HeroNavbar` (`0 220px`).
 */
const CATEGORY_NAV_CSS = /* css */ `
.blog-category-nav {
  --nav-top-from: 17.5rem;
  --nav-top-to: 9rem;

  position: fixed;
  top: var(--nav-top-from);
  left: 50%;
  transform: translate3d(-50%, 0, 0);
  z-index: 30;
  will-change: top;
}

@media (min-width: 640px) {
  .blog-category-nav { --nav-top-from: 22.5rem; --nav-top-to: 9.5rem; }
}
@media (min-width: 768px) {
  .blog-category-nav { --nav-top-from: 24.5rem; --nav-top-to: 10rem; }
}
@media (min-width: 1024px) {
  .blog-category-nav { --nav-top-from: 18.8rem; --nav-top-to: 9.5rem; }
}

@keyframes blog-category-nav-follow {
  to { top: var(--nav-top-to); }
}

@supports (animation-timeline: scroll()) {
  .blog-category-nav {
    animation: blog-category-nav-follow linear forwards;
    animation-timeline: scroll(root block);
    animation-range: 0 220px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .blog-category-nav { animation-name: none; }
}

.blog-category-scroller {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.blog-category-scroller::-webkit-scrollbar {
  display: none;
}
`;

const CATEGORY_TAB_BASE_CLASSES =
  "relative flex h-14 shrink-0 items-center text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground sm:text-xs";

interface CategoryTabProps {
  href: string;
  label: string;
  isActive: boolean;
}

function CategoryTab({ href, label, isActive }: CategoryTabProps) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        CATEGORY_TAB_BASE_CLASSES,
        isActive && "font-bold text-primary",
      )}
    >
      {label}
      <span
        aria-hidden
        className={cn(
          "absolute bottom-0 left-0 h-1 rounded-full bg-primary transition-all",
          isActive ? "w-full opacity-100" : "w-0 opacity-0",
        )}
      />
    </Link>
  );
}

interface SearchFormProps {
  query: string;
  ordem: "asc" | "desc";
  activeCategory: string;
  className?: string;
}

function SearchForm({
  query,
  ordem,
  activeCategory,
  className,
}: SearchFormProps) {
  const t = useTranslations("blog");

  return (
    <form
      method="get"
      action="/blog"
      role="search"
      className={cn("flex shrink-0 items-center", className)}
    >
      {ordem === "asc" ? (
        <input type="hidden" name="ordem" value="asc" />
      ) : null}
      {activeCategory ? (
        <input type="hidden" name="categoria" value={activeCategory} />
      ) : null}
      <label htmlFor="blog-search-q" className="sr-only">
        {t("searchLabel")}
      </label>
      <input
        id="blog-search-q"
        name="q"
        type="search"
        defaultValue={query}
        placeholder={t("searchPlaceholder")}
        autoComplete="off"
        className="h-10 w-full min-w-0 flex-1 rounded-l-full border-0 bg-card px-4 text-sm text-foreground shadow-none placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      />
      <button
        type="submit"
        aria-label={t("searchButton")}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-r-full bg-card text-primary transition-colors hover:bg-accent"
      >
        <Search className="h-4 w-4" strokeWidth={2} aria-hidden />
      </button>
    </form>
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
  const t = useTranslations("blog");

  return (
    <>
      <style href="blog-category-nav" precedence="component">
        {CATEGORY_NAV_CSS}
      </style>
      <div
        className={cn(
          "blog-category-nav w-full max-w-[1920px]",
          freeSectionShellSpacing,
        )}
      >
        <div className="flex items-center rounded-full bg-muted px-4 sm:px-8">
          <BlogCategoryNavScroller label={t("filterLabel")}>
            <CategoryTab
              href={buildBlogListHref({ q: query, ordem })}
              label={t("latestArticles")}
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
          </BlogCategoryNavScroller>

          {showSearch ? (
            <SearchForm
              query={query}
              ordem={ordem}
              activeCategory={activeCategory}
              className="ml-4 hidden sm:flex"
            />
          ) : null}
        </div>
        {showSearch ? (
          <div className={cn("mt-2 sm:hidden", freeSectionShellSpacing)}>
            <SearchForm
              query={query}
              ordem={ordem}
              activeCategory={activeCategory}
            />
          </div>
        ) : null}
      </div>
    </>
  );
}
