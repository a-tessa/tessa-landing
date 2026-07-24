import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import { BlogFeatureCard } from "@/components/marketing/BlogFeatureCard";
import { InstagramPostCard } from "@/components/marketing/InstagramPostCard";
import type { InstagramPublicationDto } from "@/lib/api/instagram.types";
import type { BlogPost } from "@/lib/blog/posts";
import { SITE } from "@/lib/seo/schemas";
import { cn, freeSectionShellSpacing } from "@/lib/utils";

interface FeaturedBlogPost {
  title: string;
  href: string;
  excerpt: string;
  author: {
    name: string;
    avatar?: string;
    initials?: string;
  };
  publishedAt: string;
  image: string;
  imageAlt: string;
}

const FALLBACK_FEATURED_POST: FeaturedBlogPost = {
  title: "Estrutura metálica para telhado: quando faz sentido",
  href: "/blog/estrutura-metalica-para-telhado",
  excerpt:
    "Estrutura metálica não é 'moda'. É decisão técnica, e ela faz muito sentido quando você precisa de previsibilidade na obra. Neste artigo, você entende em quais cenários a estrutura metálica para telhado compensa...",
  author: {
    name: "Renato Pozatto",
    avatar: "/choose-scenary-section/estruturas-metalicas-para-telhado.webp",
  },
  publishedAt: "2026-02-03",
  image: "/choose-scenary-section/estruturas-metalicas-para-telhado.webp",
  imageAlt:
    "Obra com estrutura metálica para telhado sendo montada pela equipe Tessa",
};

function toFeaturedPost(post: BlogPost): FeaturedBlogPost {
  return {
    title: post.title,
    href: `/blog/${post.slug}`,
    excerpt: post.excerpt,
    author: {
      name: post.author.name,
      avatar: post.author.avatarUrl ?? undefined,
    },
    publishedAt: post.publishedAt,
    image: post.imageSrc,
    imageAlt: post.imageAlt,
  };
}

interface NewsAndSocialProps {
  /** Most recent blog article. Falls back to a hardcoded post when absent. */
  latestPost?: BlogPost | null;
  /** Curated Instagram publications in their named layout slots. */
  instagramPublications?: InstagramPublicationDto[] | null;
}

export function NewsAndSocial({
  latestPost,
  instagramPublications = null,
}: NewsAndSocialProps = {}) {
  const t = useTranslations("newsAndSocial");
  const featured = latestPost ? toFeaturedPost(latestPost) : FALLBACK_FEATURED_POST;
  const publications = instagramPublications ?? [];

  return (
    <section
      aria-labelledby="news-title"
      className="w-full mt-10"
    >
      <div className={freeSectionShellSpacing}>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Blog column */}
          <div className="flex flex-col">
            <h2
              id="news-title"
              className="font-barlow whitespace-pre-line text-3xl font-bold uppercase leading-tight text-foreground sm:text-4xl"
            >
              {t("newsTitle")}
            </h2>

            <article
              className="mt-8 flex min-h-125 flex-1 flex-col"
              itemScope
              itemType="https://schema.org/BlogPosting"
            >
              <meta itemProp="headline" content={featured.title} />
              <meta
                itemProp="datePublished"
                content={featured.publishedAt}
              />
              <meta itemProp="author" content={featured.author.name} />
              <BlogFeatureCard
                href={featured.href}
                title={featured.title}
                excerpt={featured.excerpt}
                author={featured.author}
                publishedAt={featured.publishedAt}
                imageSrc={featured.image}
                imageAlt={featured.imageAlt}
                className="flex-1"
              />
            </article>

            <div className="mt-6 flex justify-end">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                {t("goToBlog")}
                <IconArrowNarrowRight className="size-4" />
              </Link>
            </div>
          </div>

          {/* Social media column */}
          <div className="flex flex-col">
            <h2 className="whitespace-pre-line font-barlow text-3xl font-bold uppercase leading-tight text-foreground sm:text-4xl">
              {t("socialTitle")}
            </h2>

            {publications.length === 3 ? (
              <div className="mt-8 grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 sm:grid-rows-2">
                {publications.map((publication) => (
                  <InstagramPostCard
                    key={publication.slot}
                    href={publication.permalink}
                    caption={publication.caption}
                    imageSrc={publication.imageUrl}
                    imageAlt={
                      publication.altText?.trim() ||
                      t("instagramImageAlt")
                    }
                    mediaType={publication.mediaType}
                    openPostLabel={t("openInstagramPost")}
                    className={cn(
                      publication.slot === "primary" &&
                        "sm:col-start-1 sm:row-span-2 sm:row-start-1",
                      publication.slot === "upperRight" &&
                        "sm:col-start-2 sm:row-start-1",
                      publication.slot === "lowerRight" &&
                        "sm:col-start-2 sm:row-start-2",
                    )}
                    imageSizes={
                      publication.slot === "primary"
                        ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 28vw"
                        : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 18vw"
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="mt-8 flex flex-1 flex-col items-start justify-center rounded-2xl border border-dashed border-border bg-card/60 p-6">
                <p className="font-barlow text-lg font-semibold uppercase text-foreground">
                  {t("instagramEmptyTitle")}
                </p>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  {t("instagramEmptyDescription")}
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-center lg:justify-end">
              <a
                href={SITE.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                {t("goToInstagram")}
                <IconArrowNarrowRight className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
