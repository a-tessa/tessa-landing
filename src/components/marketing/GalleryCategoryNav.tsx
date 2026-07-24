"use client";

import { useTranslations } from "next-intl";
import { BlogCategoryNavScroller } from "@/components/marketing/BlogCategoryNavScroller";
import {
  HERO_NAV_COLLAPSE_RANGE_PX,
  HERO_NAV_COLLAPSED_SECONDARY_TOP,
} from "@/components/marketing/nav/hero-collapse";
import { Link } from "@/i18n/navigation";
import type { BlogCategory } from "@/lib/api/types";
import { buildGalleryListHref } from "@/lib/gallery/href";
import { cn, freeSectionShellSpacing } from "@/lib/utils";

const CATEGORY_NAV_CSS = /* css */ `
.gallery-category-nav {
  --nav-top-from: 17.5rem;
  --nav-top-to: ${HERO_NAV_COLLAPSED_SECONDARY_TOP.base};

  position: fixed;
  top: var(--nav-top-from);
  left: 50%;
  transform: translate3d(-50%, 0, 0);
  z-index: 45;
  will-change: top;
}

@media (min-width: 640px) {
  .gallery-category-nav { --nav-top-from: 22.5rem; --nav-top-to: ${HERO_NAV_COLLAPSED_SECONDARY_TOP.sm}; }
}
@media (min-width: 768px) {
  .gallery-category-nav { --nav-top-from: 24.5rem; --nav-top-to: ${HERO_NAV_COLLAPSED_SECONDARY_TOP.md}; }
}
@media (min-width: 1024px) {
  .gallery-category-nav { --nav-top-from: 18.8rem; --nav-top-to: ${HERO_NAV_COLLAPSED_SECONDARY_TOP.lg}; }
}

@keyframes gallery-category-nav-follow {
  to { top: var(--nav-top-to); }
}

@supports (animation-timeline: scroll()) {
  .gallery-category-nav {
    animation: gallery-category-nav-follow linear forwards;
    animation-timeline: scroll(root block);
    animation-range: 0 ${String(HERO_NAV_COLLAPSE_RANGE_PX)}px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .gallery-category-nav { animation-name: none; }
}

.gallery-category-nav .blog-category-scroller {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.gallery-category-nav .blog-category-scroller::-webkit-scrollbar {
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

interface GalleryCategoryNavProps {
  activeCategory: string;
  categories: BlogCategory[];
}

export function GalleryCategoryNav({
  activeCategory,
  categories,
}: GalleryCategoryNavProps) {
  const t = useTranslations("pages.gallery");

  return (
    <>
      <style href="gallery-category-nav" precedence="component">
        {CATEGORY_NAV_CSS}
      </style>
      <div
        className={cn(
          "gallery-category-nav w-full max-w-480",
          freeSectionShellSpacing,
        )}
      >
        <div className="flex items-center rounded-full bg-muted px-4 sm:px-8">
          <BlogCategoryNavScroller label={t("filterLabel")}>
            <CategoryTab
              href={buildGalleryListHref({})}
              label={t("allItems")}
              isActive={!activeCategory}
            />
            {categories.map((category) => (
              <CategoryTab
                key={category.slug}
                href={buildGalleryListHref({ categoria: category.slug })}
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
