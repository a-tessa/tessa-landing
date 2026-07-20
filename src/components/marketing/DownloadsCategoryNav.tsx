"use client";

import { useTranslations } from "next-intl";
import { BlogCategoryNavScroller } from "@/components/marketing/BlogCategoryNavScroller";
import { Link } from "@/i18n/navigation";
import type { BlogCategory } from "@/lib/api/types";
import { buildDownloadsListHref } from "@/lib/downloads/href";
import { cn, freeSectionShellSpacing } from "@/lib/utils";

/**
 * Same scroll-follow positioning as `BlogCategoryNav`, kept in sync with
 * `HeroNavbar` (`animation-range: 0 220px`).
 */
const CATEGORY_NAV_CSS = /* css */ `
.downloads-category-nav {
  --nav-top-from: 17.5rem;
  --nav-top-to: 9rem;

  position: fixed;
  top: var(--nav-top-from);
  left: 50%;
  transform: translate3d(-50%, 0, 0);
  z-index: 45;
  will-change: top;
}

@media (min-width: 640px) {
  .downloads-category-nav { --nav-top-from: 22.5rem; --nav-top-to: 9.5rem; }
}
@media (min-width: 768px) {
  .downloads-category-nav { --nav-top-from: 24.5rem; --nav-top-to: 10rem; }
}
@media (min-width: 1024px) {
  .downloads-category-nav { --nav-top-from: 18.8rem; --nav-top-to: 9.5rem; }
}

@keyframes downloads-category-nav-follow {
  to { top: var(--nav-top-to); }
}

@supports (animation-timeline: scroll()) {
  .downloads-category-nav {
    animation: downloads-category-nav-follow linear forwards;
    animation-timeline: scroll(root block);
    animation-range: 0 220px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .downloads-category-nav { animation-name: none; }
}

.downloads-category-nav .blog-category-scroller {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.downloads-category-nav .blog-category-scroller::-webkit-scrollbar {
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

interface DownloadsCategoryNavProps {
  activeCategory: string;
  categories: BlogCategory[];
}

export function DownloadsCategoryNav({
  activeCategory,
  categories,
}: DownloadsCategoryNavProps) {
  const t = useTranslations("pages.downloads");

  return (
    <>
      <style href="downloads-category-nav" precedence="component">
        {CATEGORY_NAV_CSS}
      </style>
      <div
        className={cn(
          "downloads-category-nav w-full max-w-[1920px]",
          freeSectionShellSpacing,
        )}
      >
        <div className="flex items-center rounded-full bg-muted px-4 sm:px-8">
          <BlogCategoryNavScroller label={t("filterLabel")}>
            <CategoryTab
              href={buildDownloadsListHref({})}
              label={t("allDocuments")}
              isActive={!activeCategory}
            />
            {categories.map((category) => (
              <CategoryTab
                key={category.slug}
                href={buildDownloadsListHref({ categoria: category.slug })}
                label={category.name}
                isActive={activeCategory === category.slug}
              />
            ))}
          </BlogCategoryNavScroller>
        </div>
      </div>
    </>
  );
}
