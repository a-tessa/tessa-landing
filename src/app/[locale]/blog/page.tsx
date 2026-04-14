import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BlogIndex } from "@/components/marketing/BlogIndex";
import { BlogRepresentativesCta } from "@/components/marketing/BlogRepresentativesCta";
import { Footer } from "@/components/marketing/Footer";
import { Heading } from "@/components/marketing/Heading";
import { JsonLd } from "@/lib/seo/jsonld";
import {
  BLOG_LIST_PAGE_SIZE,
  blogPosts,
  filterPostsByCategory,
  filterPostsByTitleQuery,
  sortPostsByDate,
} from "@/lib/blog/posts";
import { organizationJsonLd, SITE, websiteJsonLd } from "@/lib/seo/schemas";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.blog" });
  return {
    title: "Blog — artigos e conteúdos Tessa",
    description: t("description"),
    alternates: {
      canonical: "/blog",
    },
    keywords: [
      ...SITE.keywords,
      "Blog Tessa",
      "Artigos técnicos",
      "Estruturas metálicas",
      "Energia solar",
    ],
  };
}

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    q?: string;
    ordem?: string;
    limite?: string;
    categoria?: string;
  }>;
};

function parseLimite(raw: string | undefined): number {
  const n = Number.parseInt(raw ?? "", 10);
  if (Number.isNaN(n) || n < BLOG_LIST_PAGE_SIZE) return BLOG_LIST_PAGE_SIZE;
  return Math.min(n, 200);
}

export default async function BlogPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const query = (sp.q ?? "").trim();
  const ordem = sp.ordem === "asc" ? "asc" : "desc";
  const limite = parseLimite(sp.limite);
  const categoria = (sp.categoria ?? "").trim();

  const byCategory = filterPostsByCategory(blogPosts, categoria);
  const filtered = filterPostsByTitleQuery(byCategory, query);
  const sorted = sortPostsByDate(filtered, ordem);
  const visiblePosts = sorted.slice(0, limite);
  const hasMore = sorted.length > limite;

  const t = await getTranslations("pages.blog");
  const blogDescription = t("description");

  return (
    <>
      <JsonLd id="jsonld-org-blog" data={organizationJsonLd()} />
      <JsonLd id="jsonld-website-blog" data={websiteJsonLd()} />

      <main className="flex flex-col items-center justify-center gap-0">
        <Heading title={t("title")} description={blogDescription} />
        <BlogIndex
          query={query}
          ordem={ordem}
          limite={limite}
          categoria={categoria}
          visiblePosts={visiblePosts}
          totalFiltered={sorted.length}
          hasMore={hasMore}
        />
        <BlogRepresentativesCta />
      </main>

      <Footer />
    </>
  );
}
