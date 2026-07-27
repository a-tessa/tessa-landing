import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AboutHeroVideo } from "@/components/marketing/AboutHeroVideo";
import { AboutNarrative } from "@/components/marketing/AboutNarrative";
import { AboutPillars } from "@/components/marketing/AboutPillars";
import { BlogRepresentativesCta } from "@/components/marketing/BlogRepresentativesCta";
import { Footer } from "@/components/marketing/Footer";
import { RouteHeading } from "@/components/marketing/RouteHeading";
import {
  getAboutSideImageFallback,
  getAboutVideoFallback,
  resolveAboutSection,
} from "@/lib/about-content";
import { getAboutSection } from "@/lib/api/content";
import { JsonLd } from "@/lib/seo/jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/schemas";
import { cn, freeSectionShellSpacing } from "@/lib/utils";

interface QuemSomosPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: QuemSomosPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.quemSomos" });

  return buildPageMetadata({
    locale,
    path: "/quem-somos",
    title: t("title"),
    description: t("description"),
    keywords: [
      "Quem Somos Tessa",
      "Tessa Engenharia",
      "Estruturas metálicas",
      "Missão Visão Valores",
    ],
  });
}

export default async function QuemSomosPage({ params }: QuemSomosPageProps) {
  const { locale } = await params;
  const [t, cmsSection] = await Promise.all([
    getTranslations({ locale, namespace: "pages.quemSomos" }),
    getAboutSection(locale),
  ]);

  const resolved = resolveAboutSection(cmsSection, locale);
  const video = resolved?.video ?? getAboutVideoFallback();
  const heroTitle = resolved?.heroTitle ?? t("heroTitle");
  const body = resolved?.body ?? t("body");
  const sideImageUrl =
    resolved?.sideImage.url ?? getAboutSideImageFallback();
  const sideImageAlt = resolved?.sideImage.alt ?? t("sideImageAlt");
  const mission = resolved?.mission ?? {
    title: t("mission.title"),
    description: t("mission.description"),
  };
  const vision = resolved?.vision ?? {
    title: t("vision.title"),
    description: t("vision.description"),
  };
  const values = resolved?.values ?? {
    title: t("values.title"),
    description: t("values.description"),
  };

  return (
    <>
      <JsonLd
        id="jsonld-breadcrumb-quem-somos"
        data={breadcrumbJsonLd(locale, [
          { name: t("title"), path: "/quem-somos" },
        ])}
      />

      <main className="relative flex flex-col items-center pt-10 sm:pt-10">
        <RouteHeading />

        <section
          className={cn(
            freeSectionShellSpacing,
            "mt-10 flex w-full flex-col gap-12 py-12 sm:mt-0 sm:gap-16 sm:py-10",
          )}
        >
          <AboutHeroVideo
            videoUrl={video.url}
            startSeconds={video.startSeconds}
            heroTitle={heroTitle}
            playLabel={t("videoPlayLabel")}
            caption={t("videoCaption")}
          />

          <AboutNarrative
            imageUrl={sideImageUrl}
            imageAlt={sideImageAlt}
            body={body}
          />

          <AboutPillars
            mission={mission}
            vision={vision}
            values={values}
          />
        </section>

        <BlogRepresentativesCta />
      </main>

      <Footer />
    </>
  );
}
