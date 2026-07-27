import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BlogRepresentativesCta } from "@/components/marketing/BlogRepresentativesCta";
import { DownloadsCategoryNav } from "@/components/marketing/DownloadsCategoryNav";
import { DownloadsDirectory } from "@/components/marketing/DownloadsDirectory";
import { Footer } from "@/components/marketing/Footer";
import { RouteHeading } from "@/components/marketing/RouteHeading";
import { getBlogCategories, getHeadingImageUrl } from "@/lib/api/content";
import { getDocuments } from "@/lib/api/documents";
import { JsonLd } from "@/lib/seo/jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/schemas";
import { cn, freeSectionShellSpacing } from "@/lib/utils";

interface DownloadsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ categoria?: string }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: DownloadsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const sp = await searchParams;
  const t = await getTranslations({ locale, namespace: "pages.downloads" });

  return buildPageMetadata({
    locale,
    path: "/downloads",
    title: t("title"),
    description: t("description"),
    keywords: [
      "Downloads Tessa",
      "Manuais Tessa",
      "Folders Tessa",
      "Apresentações Tessa",
    ],
    noIndex: Boolean(sp.categoria?.trim()),
  });
}

export default async function DownloadsPage({
  params,
  searchParams,
}: DownloadsPageProps) {
  const { locale } = await params;
  const sp = await searchParams;
  const categoria = (sp.categoria ?? "").trim();

  const [t, documents, categories, headingImageUrl] = await Promise.all([
    getTranslations({ locale, namespace: "pages.downloads" }),
    getDocuments(locale),
    getBlogCategories(locale),
    getHeadingImageUrl("downloads", locale),
  ]);

  const categorySlugsWithDocuments = new Set(
    documents.map((document) => document.categorySlug),
  );
  const navCategories = categories.filter((category) =>
    categorySlugsWithDocuments.has(category.slug),
  );
  const visibleDocuments = categoria
    ? documents.filter((document) => document.categorySlug === categoria)
    : documents;

  return (
    <>
      <JsonLd
        id="jsonld-breadcrumb-downloads"
        data={breadcrumbJsonLd(locale, [
          { name: t("title"), path: "/downloads" },
        ])}
      />

      <main className="relative flex flex-col items-center pt-10 sm:pt-10">
        <RouteHeading imageSrc={headingImageUrl} />
        <DownloadsCategoryNav
          activeCategory={categoria}
          categories={navCategories}
        />

        <section
          className={cn(
            freeSectionShellSpacing,
            "mt-10 py-12 sm:mt-0 sm:py-10",
          )}
        >
          <DownloadsDirectory
            locale={locale}
            documents={visibleDocuments}
            categories={navCategories}
            activeCategory={categoria}
          />
        </section>

        <BlogRepresentativesCta />
      </main>

      <Footer />
    </>
  );
}
