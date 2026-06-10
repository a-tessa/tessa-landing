import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { IconArrowRight } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import { BackNavLink } from "@/components/marketing/BackNavLink";
import { BentoCarouselServices } from "@/components/marketing/BentoCarouselServices";
import { Footer } from "@/components/marketing/Footer";
import { Heading } from "@/components/marketing/Heading";
import { NewsAndSocial } from "@/components/marketing/NewsAndSocial";
import { ServiceMaterialsSection } from "@/components/marketing/ServiceMaterialsSection";
import { ServiceNavCarousel } from "@/components/marketing/ServiceNavCarousel";
import { ServiceVideoPlayer } from "@/components/marketing/ServiceVideoPlayer";
import { StaticServicePage } from "@/components/marketing/StaticServicePage";
import { Testimonials } from "@/components/marketing/Testimonials";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/lib/seo/jsonld";
import { breadcrumbJsonLd, SITE } from "@/lib/seo/schemas";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { fetchBlogArticles } from "@/lib/api/blog";
import { getApprovedTestimonials } from "@/lib/api/testimonials";
import {
  getServicePageBySlug,
  getServicesPages,
} from "@/lib/api/content";
import { toBlogPostFromListItem } from "@/lib/blog/mappers";
import { getMergedServiceNavItems } from "@/lib/servicos/nav";
import {
  isStaticServiceSlug,
  STATIC_SERVICE_SLUGS,
} from "@/lib/servicos/static-pages";
import { cn, freeSectionShellSpacing, OPERATIONS_IMAGES } from "@/lib/utils";
import {
  getYouTubeThumbnail,
  getYouTubeVideoId,
  getYouTubeWatchUrl,
} from "@/lib/youtube";

interface ServiceDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const servicesPages = await getServicesPages();
  const apiSlugs = (servicesPages ?? [])
    .map((service) => service.slug)
    .filter((slug) => !isStaticServiceSlug(slug));

  return [
    ...STATIC_SERVICE_SLUGS.map((slug) => ({ slug })),
    ...apiSlugs.map((slug) => ({ slug })),
  ];
}

function absoluteImageUrl(src: string): string {
  if (!src) return SITE.domain;
  return src.startsWith("http") ? src : `${SITE.domain}${src}`;
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  if (isStaticServiceSlug(slug)) {
    const t = await getTranslations({
      locale,
      namespace: "pages.staticServices",
    });
    const title = t(`${slug}.title`);
    const description = t(`${slug}.description`);
    const metaKeywords = t.has(`${slug}.metaKeywords`)
      ? t(`${slug}.metaKeywords`)
          .split(",")
          .map((keyword) => keyword.trim())
          .filter(Boolean)
      : [];

    return buildPageMetadata({
      locale,
      path: `/servicos/${slug}`,
      title,
      description: description || SITE.description,
      keywords: [title, ...metaKeywords],
    });
  }

  const service = await getServicePageBySlug(slug, locale);

  if (!service) {
    return buildPageMetadata({
      locale,
      path: `/servicos/${slug}`,
      title: "404",
      description: SITE.description,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    locale,
    path: `/servicos/${service.slug}`,
    title: service.title,
    description: service.subtitle,
    keywords: [service.title],
    image: {
      url: absoluteImageUrl(service.backgroundImageUrl),
      alt: service.title,
    },
  });
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { locale, slug } = await params;

  if (isStaticServiceSlug(slug)) {
    return <StaticServicePage locale={locale} slug={slug} />;
  }

  const [service, servicesPages, t, ts, testimonials] = await Promise.all([
    getServicePageBySlug(slug, locale),
    getServicesPages(locale),
    getTranslations({ locale, namespace: "pages.servicoDetail" }),
    getTranslations({ locale, namespace: "pages.servicos" }),
    getApprovedTestimonials(),
  ]);

  if (!service) notFound();

  const navServices = await getMergedServiceNavItems(locale, servicesPages);

  const categorySlug = service.category?.trim() || undefined;
  const [categoryLatestResp, fallbackLatestResp] = await Promise.all([
    categorySlug
      ? fetchBlogArticles({
          page: 1,
          perPage: 1,
          order: "desc",
          categorySlug,
          locale,
        })
      : Promise.resolve(null),
    fetchBlogArticles({ page: 1, perPage: 1, order: "desc", locale }),
  ]);

  const latestArticleDto =
    categoryLatestResp?.articles[0] ?? fallbackLatestResp?.articles[0] ?? null;
  const latestPost = latestArticleDto
    ? toBlogPostFromListItem(latestArticleDto)
    : null;

  const bentoImages =
    service.images.length > 0
      ? service.images.map((image) => ({
          src: image.imgUrl,
          alt: service.title,
        }))
      : OPERATIONS_IMAGES;

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.subtitle,
    image: absoluteImageUrl(service.backgroundImageUrl),
    provider: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.domain,
    },
    areaServed: {
      "@type": "Country",
      name: "Brasil",
    },
    url: `${SITE.domain}/${locale}/servicos/${service.slug}`,
  };

  const videoId = getYouTubeVideoId(service.exampleVideoUrl);
  const videoJsonLd = videoId
    ? {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: `${service.title} — ${t("whatHappens").replace(/\n/g, " ")}`,
        description: service.subtitle,
        thumbnailUrl: [getYouTubeThumbnail(videoId)],
        contentUrl: getYouTubeWatchUrl(videoId),
        embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
        uploadDate: new Date().toISOString(),
        publisher: {
          "@type": "Organization",
          name: SITE.name,
          url: SITE.domain,
        },
      }
    : null;

  return (
    <>
      <JsonLd
        id="jsonld-breadcrumb-servico"
        data={breadcrumbJsonLd(locale, [
          { name: ts("title"), path: "/servicos" },
          { name: service.title, path: `/servicos/${service.slug}` },
        ])}
      />
      <JsonLd id={`jsonld-service-${service.slug}`} data={serviceJsonLd} />
      {videoJsonLd ? (
        <JsonLd id={`jsonld-video-${service.slug}`} data={videoJsonLd} />
      ) : null}

      <main className="flex flex-col items-center mt-36 sm:mt-20">
        <Heading
          title={service.title}
          description={service.subtitle}
          backgroundSrc={service.backgroundImageUrl}
        />

        <ServiceNavCarousel
          locale={locale}
          items={navServices}
          activeSlug={service.slug}
        />

        <section className="w-full">
          <div className={cn("mb-4", freeSectionShellSpacing)}>
            <BackNavLink
              href="/servicos"
              label={t("backToServices")}
              navLabel={t("serviceNavLabel")}
            />
          </div>
          <div className={cn("flex flex-col gap-8", freeSectionShellSpacing)}>
            <h2 className="font-normal leading-tight text-muted-foreground">
              {service.subtitle}
            </h2>
            <div className="relative flex flex-col md:flex-row h-auto gap-8">
              <div className="w-full md:w-1/2 gap-8 flex flex-col">
                <p className="whitespace-pre-line text-xl md:text-3xl uppercase font-semibold">
                  {t("whatHappens")}
                </p>
                {videoId ? (
                  <ServiceVideoPlayer
                    videoUrl={service.exampleVideoUrl}
                    playLabel={t("whatHappens").replace(/\n/g, " ")}
                    caption={service.subtitle}
                  />
                ) : null}
                <Button variant="secondary" className="w-fit ml-auto" asChild>
                  <a
                    href={SITE.socials.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("goToChannel")}
                    <IconArrowRight className="size-4" />
                  </a>
                </Button>
              </div>
              <div className="w-full md:w-1/2 md:flex-1">
                <BentoCarouselServices
                  images={bentoImages}
                  className="h-full"
                />
              </div>
            </div>
          </div>
        </section>

        <NewsAndSocial latestPost={latestPost} />
        <Testimonials items={testimonials} />

        <ServiceMaterialsSection locale={locale} slug={slug} />
      </main>

      <Footer />
    </>
  );
}
