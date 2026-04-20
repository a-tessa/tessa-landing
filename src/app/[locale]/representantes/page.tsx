import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Footer } from "@/components/marketing/Footer";
import { RepresentativesDirectory } from "@/components/marketing/RepresentativesDirectory";
import { RouteHeading } from "@/components/marketing/RouteHeading";
import { Testimonials } from "@/components/marketing/Testimonials";
import { JsonLd } from "@/lib/seo/jsonld";
import { breadcrumbJsonLd } from "@/lib/seo/schemas";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getApprovedTestimonials } from "@/lib/api/testimonials";
import { cn, freeSectionShellSpacing } from "@/lib/utils";

interface RepresentantesPageProps {
  params: Promise<{ locale: string }>;
}

const mapCss = /* css */ `
@keyframes map-follow-heading {
  to {
    top: calc(1.5rem + 2rem);
    transform: scale(0.35);
  }
}

.map {
  right: 1.25rem;
  position: fixed;
  top: calc(1.5rem + 14rem);
  z-index: 22;
  pointer-events: none;
  transform-origin: top right;
  will-change: top, transform;
}

@supports (animation-timeline: scroll()) {
  .map {
    animation: map-follow-heading linear forwards;
    animation-timeline: scroll(root block);
    animation-range: 0 220px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .map {
    animation-name: none;
  }
}
`;

export async function generateMetadata({
  params,
}: RepresentantesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "pages.representantes",
  });

  return buildPageMetadata({
    locale,
    path: "/representantes",
    title: t("title"),
    description: t("description"),
    keywords: ["Representantes Tessa", "Distribuidores Tessa"],
  });
}

export default async function RepresentantesPage({
  params,
}: RepresentantesPageProps) {
  const { locale } = await params;
  const [t, testimonials] = await Promise.all([
    getTranslations({
      locale,
      namespace: "pages.representantes",
    }),
    getApprovedTestimonials(),
  ]);

  return (
    <>
      <style href="map" precedence="component">
        {mapCss}
      </style>

      <JsonLd
        id="jsonld-breadcrumb-representantes"
        data={breadcrumbJsonLd(locale, [
          { name: t("title"), path: "/representantes" },
        ])}
      />

      <main className="relative flex flex-col items-center pt-10">
        <RouteHeading />

        <div className="relative h-auto w-fit z-50">
          <div
            aria-label={t("mapLabel")}
            className={cn(
              "map hidden sm:block w-32 sm:w-64 md:w-80 lg:w-80 xl:w-120 h-auto",
            )}
          >
            <Image
              src="/mapa-laranja.webp"
              alt={t("mapLabel")}
              width={1000}
              height={1000}
            />
          </div>
        </div>

        <section className={freeSectionShellSpacing}>
          <RepresentativesDirectory />
        </section>

        <Testimonials items={testimonials} />
      </main>

      <Footer />
    </>
  );
}
