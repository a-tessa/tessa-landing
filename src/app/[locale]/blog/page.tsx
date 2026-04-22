import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BlogIndex } from "@/components/marketing/BlogIndex";
import { BlogRepresentativesCta } from "@/components/marketing/BlogRepresentativesCta";
import { Footer } from "@/components/marketing/Footer";
import { RouteHeading } from "@/components/marketing/RouteHeading";
import { JsonLd } from "@/lib/seo/jsonld";
import { fetchBlogArticles } from "@/lib/api/blog";
import { toBlogPostFromListItem } from "@/lib/blog/mappers";
import { BLOG_LIST_PAGE_SIZE } from "@/lib/blog/posts";
import { breadcrumbJsonLd, SITE } from "@/lib/seo/schemas";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;

interface BlogPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    q?: string;
    ordem?: string;
    limite?: string;
    categoria?: string;
  }>;
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.blog" });

  return buildPageMetadata({
    locale,
    path: "/blog",
    title: t("title"),
    description: t("description"),
    keywords: [
      "Blog Tessa",
      "Artigos técnicos",
      "Estruturas metálicas",
      "Energia solar",
    ],
  });
}

function parseLimite(raw: string | undefined): number {
  const n = Number.parseInt(raw ?? "", 10);
  if (Number.isNaN(n) || n < BLOG_LIST_PAGE_SIZE) return BLOG_LIST_PAGE_SIZE;
  return Math.min(n, 200);
}

function blogJsonLd(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${SITE.shortName} — Blog`,
    url: `${SITE.domain}/${locale}/blog`,
    inLanguage: locale,
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.domain,
    },
  };
}

export default async function BlogPage({
  params,
  searchParams,
}: BlogPageProps) {
  const { locale } = await params;
  const sp = await searchParams;
  const query = (sp.q ?? "").trim();
  const ordem = sp.ordem === "asc" ? "asc" : "desc";
  const limite = parseLimite(sp.limite);
  const categoria = (sp.categoria ?? "").trim();

  const resp = await fetchBlogArticles({
    page: 1,
    perPage: limite,
    categorySlug: categoria || undefined,
    q: query || undefined,
    order: ordem,
  });

  const visiblePosts = (resp?.articles ?? []).map(toBlogPostFromListItem);
  const totalFiltered = resp?.pagination.total ?? visiblePosts.length;
  const hasMore = totalFiltered > visiblePosts.length;

  const t = await getTranslations({ locale, namespace: "pages.blog" });

  return (
    <>
      <JsonLd
        id="jsonld-breadcrumb-blog"
        data={breadcrumbJsonLd(locale, [{ name: t("title"), path: "/blog" }])}
      />
      <JsonLd id="jsonld-blog" data={blogJsonLd(locale)} />

      <main className="flex flex-col items-center pt-10 sm:pt-10">
        <RouteHeading />
        <BlogIndex
          query={query}
          ordem={ordem}
          limite={limite}
          categoria={categoria}
          visiblePosts={visiblePosts}
          totalFiltered={totalFiltered}
          hasMore={hasMore}
        />
        <BlogRepresentativesCta />
      </main>

      <Footer />
    </>
  );
}
