import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BackNavLink } from "@/components/marketing/BackNavLink";
import { Footer } from "@/components/marketing/Footer";
import { Heading } from "@/components/marketing/Heading";
import { JsonLd } from "@/lib/seo/jsonld";
import { getBlogPostBySlug, blogPosts } from "@/lib/blog/posts";
import { SITE } from "@/lib/seo/schemas";
import { cn, freeSectionShellSpacing } from "@/lib/utils";
import { BlogCategoryNav } from "@/components/marketing/BlogCategoryNav";
import { BlogFeatureCard } from "@/components/marketing/BlogFeatureCard";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams(): { slug: string }[] {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `/blog/${slug}`,
      images: [
        {
          url: post.imageSrc.startsWith("http")
            ? post.imageSrc
            : `${SITE.domain}${post.imageSrc}`,
          alt: post.imageAlt,
        },
      ],
    },
  };
}

function formatPublishedDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();
  const relatedPosts = blogPosts
    .filter(
      (candidate) =>
        candidate.category === post.category && candidate.slug !== post.slug,
    )
    .slice(0, 2);

  const t = await getTranslations("pages.blog");
  const bt = await getTranslations("blog");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author.name,
    },
    publisher: { "@type": "Organization", name: SITE.name },
    mainEntityOfPage: `${SITE.domain}/blog/${slug}`,
    image: post.imageSrc.startsWith("http")
      ? post.imageSrc
      : `${SITE.domain}${post.imageSrc}`,
  };

  return (
    <>
      <JsonLd id="jsonld-post" data={jsonLd} />

      <main className="flex flex-col items-center justify-center gap-0">
        <Heading title={t("title")} description={t("description")} />

        <BlogCategoryNav activeCategory={post.category} />

        <section className={cn("w-full pb-16 pt-6", freeSectionShellSpacing)}>
          <BackNavLink
            href="/blog"
            label={bt("backToArticles")}
            navLabel={bt("articleNav")}
            className="mb-8 mt-8"
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
                <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {post.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>

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
                        date: formatPublishedDate(post.publishedAt),
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
                      className="sm:h-96"
                      imageSizes="(max-width: 1024px) 100vw, 50vw"
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
