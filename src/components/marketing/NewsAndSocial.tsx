import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import { BlogFeatureCard } from "@/components/marketing/BlogFeatureCard";
import { cn, freeSectionShellSpacing } from "@/lib/utils";

interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: string;
  image: string;
  imageAlt: string;
}

interface InstagramPost {
  title: string;
  url: string;
}

const FEATURED_POST: BlogPost = {
  title: "Estrutura metálica para telhado: quando faz sentido",
  slug: "/blog/estrutura-metalica-para-telhado",
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

const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    title: "Quando um terreno improdutivo vira um ativo energético",
    url: "https://www.instagram.com/p/example1",
  },
  {
    title: "Estruturas de solo para usinas fotovoltaicas",
    url: "https://www.instagram.com/p/example2",
  },
  {
    title: "Desde o primeiro parafuso",
    url: "https://www.instagram.com/p/example3",
  },
];

export function NewsAndSocial() {
  const t = useTranslations("newsAndSocial");

  return (
    <section
      aria-labelledby="news-title"
      className="w-full"
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
              className="mt-8 flex flex-1 flex-col min-h-[500px]"
              itemScope
              itemType="https://schema.org/BlogPosting"
            >
              <meta itemProp="headline" content={FEATURED_POST.title} />
              <meta
                itemProp="datePublished"
                content={FEATURED_POST.publishedAt}
              />
              <meta itemProp="author" content={FEATURED_POST.author.name} />
              <BlogFeatureCard
                href={FEATURED_POST.slug}
                title={FEATURED_POST.title}
                excerpt={FEATURED_POST.excerpt}
                author={FEATURED_POST.author}
                publishedAt={FEATURED_POST.publishedAt}
                imageSrc={FEATURED_POST.image}
                imageAlt={FEATURED_POST.imageAlt}
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
            <h2 className="font-barlow text-3xl font-bold uppercase leading-tight text-foreground sm:text-4xl">
              Social
              <br />
              media
            </h2>

            <div className="mt-8 grid flex-1 grid-cols-2 gap-x-4 gap-y-4 grid-rows-[auto_auto]">
              {INSTAGRAM_POSTS.map((post, index) => (
                <a
                  key={post.url}
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group flex h-full min-h-0 flex-col rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-lg",
                    index === 0 && "col-start-1 row-span-2 row-start-1",
                    index === 1 && "col-start-2 row-start-2",
                    index === 2 && "col-start-2 row-start-1",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      Instagram
                    </span>
                    <div className="flex size-7 items-center justify-center rounded-full bg-primary">
                      <InstagramIcon />
                    </div>
                  </div>

                  <h3 className="mt-4 font-barlow text-lg font-bold uppercase leading-tight text-foreground sm:text-xl text-start">
                    {post.title}
                  </h3>
                </a>
              ))}
            </div>

            <div className="mt-6 flex justify-center lg:justify-end">
              <a
                href="https://www.instagram.com/"
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

function InstagramIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3.5 text-white"
      aria-hidden="true"
    >
      <rect width={20} height={20} x={2} y={2} rx={5} ry={5} />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1={17.5} x2={17.51} y1={6.5} y2={6.5} />
    </svg>
  );
}
