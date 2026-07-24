import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BlogRepresentativesCta } from "@/components/marketing/BlogRepresentativesCta";
import { Footer } from "@/components/marketing/Footer";
import { GalleryCategoryNav } from "@/components/marketing/GalleryCategoryNav";
import { GalleryMediaBrowser } from "@/components/marketing/GalleryMediaBrowser";
import { RouteHeading } from "@/components/marketing/RouteHeading";
import { getBlogCategories } from "@/lib/api/content";
import { getGalleryItems } from "@/lib/api/gallery";
import {
  filterGalleryItemsByCategory,
  splitGalleryItemsByKind,
} from "@/lib/gallery/filter";
import { JsonLd } from "@/lib/seo/jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/schemas";
import { cn, freeSectionShellSpacing } from "@/lib/utils";

interface GalleryPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ categoria?: string }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: GalleryPageProps): Promise<Metadata> {
  const { locale } = await params;
  const sp = await searchParams;
  const t = await getTranslations({ locale, namespace: "pages.gallery" });

  return buildPageMetadata({
    locale,
    path: "/galeria",
    title: t("title"),
    description: t("description"),
    keywords: [
      "Galeria Tessa",
      "Fotos Tessa",
      "Vídeos Tessa",
      "Estruturas metálicas",
    ],
    noIndex: Boolean(sp.categoria?.trim()),
  });
}

export default async function GalleryPage({
  params,
  searchParams,
}: GalleryPageProps) {
  const { locale } = await params;
  const sp = await searchParams;
  const categoria = (sp.categoria ?? "").trim();

  const [t, items, categories] = await Promise.all([
    getTranslations({ locale, namespace: "pages.gallery" }),
    getGalleryItems(locale),
    getBlogCategories(locale),
  ]);

  const visibleItems = filterGalleryItemsByCategory(items, categoria);
  const { photos, videos } = splitGalleryItemsByKind(visibleItems);

  const categorySlugsWithItems = new Set(
    items
      .map((item) => item.categorySlug)
      .filter((slug): slug is string => Boolean(slug)),
  );
  const navCategories = categories.filter((category) =>
    categorySlugsWithItems.has(category.slug),
  );

  const emptyMessage = categoria ? t("emptyInCategory") : t("empty");

  return (
    <>
      <JsonLd
        id="jsonld-breadcrumb-gallery"
        data={breadcrumbJsonLd(locale, [
          { name: t("title"), path: "/galeria" },
        ])}
      />

      <main className="relative flex flex-col items-center pt-10 sm:pt-10">
        <RouteHeading />
        {navCategories.length > 0 ? (
          <GalleryCategoryNav
            activeCategory={categoria}
            categories={navCategories}
          />
        ) : null}

        <section
          className={cn(
            freeSectionShellSpacing,
            "mt-10 w-full max-w-7xl px-4 py-12 sm:mt-0 sm:px-6 sm:py-10",
          )}
        >
          {photos.length === 0 && videos.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </p>
          ) : (
            <GalleryMediaBrowser photos={photos} videos={videos} />
          )}
        </section>

        <BlogRepresentativesCta />
      </main>

      <Footer />
    </>
  );
}
