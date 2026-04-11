import type { Metadata } from "next";
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

const BLOG_DESCRIPTION =
  "Descubra conteúdos valiosos e conselhos de especialistas da nossa equipe experiente para elevar seu conhecimento e ajudar você a tomar uma decisão mais segura na hora de contratar a Tessa.";

export const metadata: Metadata = {
  title: "Blog — artigos e conteúdos Tessa",
  description: BLOG_DESCRIPTION,
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

type PageProps = {
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

  return (
    <>
      <JsonLd id="jsonld-org-blog" data={organizationJsonLd()} />
      <JsonLd id="jsonld-website-blog" data={websiteJsonLd()} />

      <main className="flex flex-col items-center justify-center gap-0">
        <Heading title="Blog" description={BLOG_DESCRIPTION} />
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
