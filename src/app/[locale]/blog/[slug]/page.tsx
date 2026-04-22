import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import DOMPurify from "isomorphic-dompurify";
import { BackNavLink } from "@/components/marketing/BackNavLink";
import { BlogCategoryNav } from "@/components/marketing/BlogCategoryNav";
import { BlogFeatureCard } from "@/components/marketing/BlogFeatureCard";
import { Footer } from "@/components/marketing/Footer";
import { Heading } from "@/components/marketing/Heading";
import { JsonLd } from "@/lib/seo/jsonld";
import {
  fetchBlogArticleBySlug,
  fetchBlogArticles,
  fetchRelatedBlogArticles,
} from "@/lib/api/blog";
import {
  toBlogPostFromArticle,
  toBlogPostFromListItem,
} from "@/lib/blog/mappers";
import { breadcrumbJsonLd, SITE } from "@/lib/seo/schemas";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { cn, freeSectionShellSpacing } from "@/lib/utils";

export const revalidate = 60;

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const ALLOWED_TAGS = [
  "h1",
  "h2",
  "h3",
  "p",
  "ul",
  "ol",
  "li",
  "strong",
  "em",
  "b",
  "i",
  "a",
  "blockquote",
  "br",
  "img",
] as const;

const ALLOWED_ATTR = [
  "href",
  "target",
  "rel",
  "src",
  "alt",
  "title",
] as const;

function sanitizeArticleHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [...ALLOWED_TAGS],
    ALLOWED_ATTR: [...ALLOWED_ATTR],
  });
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const resp = await fetchBlogArticles({ page: 1, perPage: 100, order: "desc" });
  if (!resp) return [];
  return resp.articles.map((article) => ({ slug: article.slug }));
}

function absoluteImageUrl(src: string): string {
  return src.startsWith("http") ? src : `${SITE.domain}${src}`;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await fetchBlogArticleBySlug(slug);

  if (!article) {
    return buildPageMetadata({
      locale,
      path: `/blog/${slug}`,
      title: "404",
      description: SITE.description,
      noIndex: true,
    });
  }

  const post = toBlogPostFromArticle(article);

  return buildPageMetadata({
    locale,
    path: `/blog/${slug}`,
    title: post.title,
    description: post.description,
    type: "article",
    publishedAt: post.publishedAt,
    image: {
      url: absoluteImageUrl(post.imageSrc),
      alt: post.imageAlt,
    },
    keywords: [post.category, post.title],
  });
}

function formatPublishedDate(iso: string, locale: string): string {
  const intlLocale =
    locale === "pt-BR" ? "pt-BR" : locale === "es" ? "es-ES" : "en-US";
  return new Intl.DateTimeFormat(intlLocale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  const article = await fetchBlogArticleBySlug(slug);
  if (!article) notFound();

  const post = toBlogPostFromArticle(article);
  const sanitizedContent = sanitizeArticleHtml(post.contentHtml ?? "");

  const relatedDtos = await fetchRelatedBlogArticles(post.category, post.slug, 2);
  const relatedPosts = relatedDtos.map(toBlogPostFromListItem);

  const t = await getTranslations({ locale, namespace: "pages.blog" });
  const bt = await getTranslations({ locale, namespace: "blog" });

  const postJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    inLanguage: locale,
    author: {
      "@type": "Person",
      name: post.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.domain,
      logo: {
        "@type": "ImageObject",
        url: `${SITE.domain}/tessa-logo.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE.domain}/${locale}/blog/${slug}`,
    },
    image: absoluteImageUrl(post.imageSrc),
  };

  return (
    <>
      <JsonLd
        id="jsonld-breadcrumb-blog-post"
        data={breadcrumbJsonLd(locale, [
          { name: t("title"), path: "/blog" },
          { name: post.title, path: `/blog/${slug}` },
        ])}
      />
      <JsonLd id={`jsonld-blog-post-${slug}`} data={postJsonLd} />

      <main className="flex flex-col items-center justify-center gap-0">
        <Heading
          title={t("title")}
          description={t("description")}
          backgroundSrc="/blog-heading.jpg"
        />

        <BlogCategoryNav activeCategory={post.category} />

        <section className={cn("w-full pb-16 pt-12", freeSectionShellSpacing)}>
          <BackNavLink
            href="/blog"
            label={bt("backToArticles")}
            navLabel={bt("articleNav")}
            className="mt-10 mb-5"
          />

          <article className="mx-auto">
            <div className="overflow-hidden rounded-4xl border border-border bg-card shadow-sm py-6 md:py-8 px-6 md:px-14">
              <h1 className="text-2xl mb-8 font-bold uppercase leading-tight tracking-tight text-card-foreground sm:text-3xl">
                {post.title}
              </h1>
              <div className="relative aspect-video mx-auto">
                <Image
                  src={post.imageSrc}
                  alt={post.imageAlt}
                  fill
                  priority
                  className="object-cover rounded-2xl"
                  sizes="(max-width: 768px) 100vw, 896px"
                />
              </div>

              <div>
                <div
                  className="blog-article-content mt-8 text-sm leading-relaxed text-muted-foreground sm:text-base"
                  dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                />

                <div className="mt-10 flex items-center gap-4 border-t border-border pt-8">
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary"
                    aria-hidden
                  >
                    {post.author.initials}
                  </span>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-card-foreground">
                      {post.author.name}
                    </p>
                    <time
                      dateTime={post.publishedAt}
                      className="text-xs font-semibold text-primary"
                    >
                      {bt("publishedAt", {
                        date: formatPublishedDate(post.publishedAt, locale),
                      })}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {relatedPosts.length > 0 ? (
            <section
              className="mt-16"
              aria-labelledby="related-articles-heading"
            >
              <h2
                id="related-articles-heading"
                className="font-barlow whitespace-pre-line text-3xl font-bold uppercase leading-tight text-foreground sm:text-4xl"
              >
                {bt("relatedArticles")}
              </h2>

              <ul className="mt-8 grid list-none gap-6 lg:grid-cols-2">
                {relatedPosts.map((relatedPost) => (
                  <li key={relatedPost.slug}>
                  <BlogFeatureCard
                    href={`/blog/${relatedPost.slug}`}
                    title={relatedPost.title}
                    excerpt={relatedPost.excerpt}
                    author={{
                      name: relatedPost.author.name,
                      avatar: relatedPost.imageSrc,
                    }}
                    publishedAt={relatedPost.publishedAt}
                    imageSrc={relatedPost.imageSrc}
                    imageAlt={relatedPost.imageAlt}
                    className="sm:h-84 "
                    imageSizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </li>
                ))}
              </ul>
            </section>
          ) : null}

          <BackNavLink
            href="/blog"
            label={bt("backToArticles")}
            navLabel={bt("articleNav")}
            className="mt-10"
          />
        </section>
      </main>

      <Footer />
    </>
  );
}
