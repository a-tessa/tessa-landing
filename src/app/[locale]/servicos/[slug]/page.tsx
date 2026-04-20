import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Video from "next-video";
import { IconArrowDown, IconArrowRight } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import { BackNavLink } from "@/components/marketing/BackNavLink";
import { BentoCarouselServices } from "@/components/marketing/BentoCarouselServices";
import { Footer } from "@/components/marketing/Footer";
import { Heading } from "@/components/marketing/Heading";
import { NewsAndSocial } from "@/components/marketing/NewsAndSocial";
import { Testimonials } from "@/components/marketing/Testimonials";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { JsonLd } from "@/lib/seo/jsonld";
import { breadcrumbJsonLd, SITE } from "@/lib/seo/schemas";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getApprovedTestimonials } from "@/lib/api/testimonials";
import { getServiceBySlug, services } from "@/lib/services";
import {
  cn,
  freeSectionShellSpacing,
  OPERATIONS_IMAGES,
  serviceCarouselCss,
} from "@/lib/utils";

interface ServiceDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

function absoluteImageUrl(src: string): string {
  return src.startsWith("http") ? src : `${SITE.domain}${src}`;
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = getServiceBySlug(slug);

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
    description: service.description,
    keywords: [service.title],
    image: {
      url: absoluteImageUrl(service.image),
      alt: service.title,
    },
  });
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { locale, slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const [t, ts, testimonials] = await Promise.all([
    getTranslations({ locale, namespace: "pages.servicoDetail" }),
    getTranslations({ locale, namespace: "pages.servicos" }),
    getApprovedTestimonials(),
  ]);

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    image: absoluteImageUrl(service.image),
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

  const isActive = (candidateSlug: string) => candidateSlug === service.slug;

  return (
    <>
      <style href="service-heading-carousel" precedence="component">
        {serviceCarouselCss}
      </style>

      <JsonLd
        id="jsonld-breadcrumb-servico"
        data={breadcrumbJsonLd(locale, [
          { name: ts("title"), path: "/servicos" },
          { name: service.title, path: `/servicos/${service.slug}` },
        ])}
      />
      <JsonLd id={`jsonld-service-${service.slug}`} data={serviceJsonLd} />

      <main className="flex flex-col items-center justify-center gap-16">
        <Heading title={service.title} description={service.description} />

        <div className="relative h-auto w-fit">
          <nav
            aria-label={t("serviceNav")}
            className={cn(
              "service-heading-carousel z-50",
              freeSectionShellSpacing,
            )}
          >
            <Carousel className="bg-muted rounded-full flex overflow-hidden">
              <CarouselContent className="flex gap-4 w-full rounded-full px-8">
                {services.map((item) => (
                  <CarouselItem
                    key={item.slug}
                    className="basis-auto h-20 flex items-center"
                  >
                    <Link
                      href={`/servicos/${item.slug}`}
                      aria-current={isActive(item.slug) ? "page" : undefined}
                      className={cn(
                        "text-xs uppercase text-foreground relative",
                        isActive(item.slug)
                          ? "text-primary underline-offset-8 font-bold"
                          : "",
                      )}
                    >
                      {item.title}
                      <span
                        className={cn(
                          "absolute left-0 -bottom-8 h-[3px] rounded-full bg-primary transition-all duration-300",
                          isActive(item.slug)
                            ? "w-full opacity-100"
                            : "w-0 opacity-0",
                        )}
                      />
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </nav>
        </div>

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
              {service.description}
            </h2>
            <div className="relative flex flex-col md:flex-row h-auto gap-8">
              <div className="w-full md:w-1/2 gap-8 flex flex-col">
                <p className="whitespace-pre-line text-xl md:text-3xl uppercase font-semibold">
                  {t("whatHappens")}
                </p>
                <Video className="rounded-3xl overflow-hidden h-4/5 w-auto aspect-video" />
                <Button variant="secondary" className="w-fit ml-auto">
                  {t("goToChannel")}
                  <IconArrowRight className="size-4" />
                </Button>
              </div>
              <div className="w-full md:w-1/2 md:flex-1">
                <BentoCarouselServices
                  images={OPERATIONS_IMAGES}
                  className="h-full"
                />
              </div>
            </div>
          </div>
        </section>

        <NewsAndSocial />
        <Testimonials items={testimonials} />

        <section
          className={cn("mb-10", freeSectionShellSpacing)}
          aria-labelledby="servico-materiais-heading"
        >
          <div className="relative isolate flex min-h-36 flex-col justify-center gap-6 overflow-hidden rounded-3xl bg-secondary px-6 py-8 sm:min-h-32 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-14">
            <Image
              src="/find-representant.webp"
              alt=""
              fill
              className="z-0 object-cover object-center opacity-35 saturate-50"
              sizes="(max-width: 768px) 100vw, 85vw"
              aria-hidden
            />

            <p
              id="servico-materiais-heading"
              className="relative z-10 max-w-2xl text-left text-lg font-semibold uppercase text-secondary-foreground sm:text-2xl"
            >
              <strong className="font-bold">{t("downloadTitle")}</strong>
              <br />
              <span className="font-semibold">{t("downloadSub")}</span>
            </p>
            <Button
              variant="default"
              className="relative z-10 w-full shrink-0 sm:ml-auto sm:w-fit"
            >
              {t("downloadCta")}
              <IconArrowDown className="size-4" />
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
