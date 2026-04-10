import Link from "next/link";
import Image from "next/image";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import { Container } from "./Container";
import { freeSectionShellSpacing, homeSpacing } from "@/lib/utils";

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

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function NewsAndSocial() {
  const formattedDate = formatDate(FEATURED_POST.publishedAt);

  return (
    <section
      aria-labelledby="news-title"
      className="w-full py-16 sm:py-20 lg:py-24"
    >
      <div className={freeSectionShellSpacing}>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Blog column */}
          <div className="flex flex-col">
            <h2
              id="news-title"
              className="font-barlow text-3xl font-bold uppercase leading-tight text-foreground sm:text-4xl"
            >
              No centro das
              <br />
              novidades
            </h2>

            <article
              className="mt-8 flex flex-1 flex-col"
              itemScope
              itemType="https://schema.org/BlogPosting"
            >
              <meta itemProp="headline" content={FEATURED_POST.title} />
              <meta
                itemProp="datePublished"
                content={FEATURED_POST.publishedAt}
              />
              <meta itemProp="author" content={FEATURED_POST.author.name} />

              <Link
                href={FEATURED_POST.slug}
                className="group relative flex flex-1 flex-col justify-end overflow-hidden rounded-2xl p-6 sm:p-8"
              >
                <Image
                  src={FEATURED_POST.image}
                  alt={FEATURED_POST.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/10" />

                {/* Instagram-like badge */}
                <div className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full bg-primary">
                  <BlogIcon />
                </div>

                <div className="relative z-10 flex flex-col gap-4">
                  <h3 className="font-barlow text-xl font-bold uppercase leading-tight text-white sm:text-2xl">
                    {FEATURED_POST.title}
                  </h3>

                  <div className="flex items-center gap-3">
                    <div className="relative size-9 shrink-0 overflow-hidden rounded-full">
                      <Image
                        src={FEATURED_POST.author.avatar}
                        alt={FEATURED_POST.author.name}
                        fill
                        className="object-cover"
                        sizes="36px"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {FEATURED_POST.author.name}
                      </p>
                      <time
                        dateTime={FEATURED_POST.publishedAt}
                        className="text-xs text-secondary"
                      >
                        Publicado em {formattedDate}
                      </time>
                    </div>
                  </div>

                  <p className="line-clamp-3 text-sm leading-relaxed text-white/80">
                    {FEATURED_POST.excerpt}
                  </p>

                  <span className="inline-flex w-fit items-center gap-2 rounded-md border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors group-hover:bg-white/20">
                    Ler matéria completa
                  </span>
                </div>
              </Link>
            </article>

            <div className="mt-6 flex justify-end">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Ir para o blog
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

            <div className="mt-8 grid flex-1 grid-cols-2 grid-rows-2 gap-x-4">
              {INSTAGRAM_POSTS.map((post, index) => (
                <a
                  key={post.url}
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex flex-col rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-lg ${
                    index >= 2
                      ? "col-span-1 row-span-1 col-start-2 row-start-1"
                      : "col-span-1 row-span-2"
                  }`}
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
                Ir para o instagram
                <IconArrowNarrowRight className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BlogIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4 text-white"
      aria-hidden="true"
    >
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
      <path d="M18 14h-8M15 18h-5M10 6h8v4h-8V6Z" />
    </svg>
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
