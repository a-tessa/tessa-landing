import { getTranslations } from "next-intl/server";
import { StaticServiceBenefitsChecklistSection } from "@/components/marketing/StaticServiceBenefitsChecklistSection";
import { StaticServiceVideoSection } from "@/components/marketing/StaticServiceVideoSection";
import { StaticServiceIntroSection } from "@/components/marketing/StaticServiceIntroSection";
import { StaticServiceSideBackgroundSection } from "@/components/marketing/StaticServiceSideBackgroundSection";
import { JsonLd } from "@/lib/seo/jsonld";
import { SITE } from "@/lib/seo/schemas";
import {
  ESTRUTURA_DE_AVIARIO_CHECKLIST_ITEM_IDS,
  ESTRUTURA_DE_AVIARIO_QUALITY_BACKGROUND_SRC,
} from "@/lib/servicos/estrutura-de-aviario-content";
import { getStaticServiceVideoUrl } from "@/lib/servicos/static-content";
import {
  getYouTubeThumbnail,
  getYouTubeVideoId,
  getYouTubeWatchUrl,
} from "@/lib/youtube";

const SLUG = "estrutura-de-aviario" as const;

interface EstruturaDeAviarioSectionsProps {
  locale: string;
}

export async function EstruturaDeAviarioSections({
  locale,
}: EstruturaDeAviarioSectionsProps) {
  const t = await getTranslations({
    locale,
    namespace: "pages.staticServices",
  });

  const videoUrl = getStaticServiceVideoUrl(SLUG, locale);
  const videoId = videoUrl ? getYouTubeVideoId(videoUrl) : null;
  const videoTitle = t(`${SLUG}.videoSection.title`);
  const videoSubtitle = t(`${SLUG}.videoSection.subtitle`);
  const checklistItems = ESTRUTURA_DE_AVIARIO_CHECKLIST_ITEM_IDS.map((id) => ({
    id,
    label: t(`${SLUG}.benefitsSection.checklistItems.${id}`),
  }));

  const videoJsonLd = videoId
    ? {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: videoTitle,
        description: videoSubtitle,
        thumbnailUrl: [getYouTubeThumbnail(videoId)],
        contentUrl: getYouTubeWatchUrl(videoId),
        embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
        publisher: {
          "@type": "Organization",
          name: SITE.name,
          url: SITE.domain,
        },
      }
    : null;

  return (
    <>
      {videoJsonLd ? (
        <JsonLd id="jsonld-video-estrutura-de-aviario" data={videoJsonLd} />
      ) : null}

      <StaticServiceIntroSection
        title={t(`${SLUG}.introSection.title`)}
        subtitle={t(`${SLUG}.introSection.subtitle`)}
        sectionId="estrutura-de-aviario-intro"
      />

      <StaticServiceSideBackgroundSection
        title={t(`${SLUG}.qualitySection.title`)}
        description={t(`${SLUG}.qualitySection.description`)}
        backgroundImageSrc={ESTRUTURA_DE_AVIARIO_QUALITY_BACKGROUND_SRC}
        backgroundImageAlt={t(`${SLUG}.qualitySection.backgroundImageAlt`)}
        sectionId="estrutura-de-aviario-quality"
      />

      {videoUrl ? (
        <StaticServiceVideoSection
          title={videoTitle}
          subtitle={videoSubtitle}
          videoUrl={videoUrl}
          playLabel={t(`${SLUG}.videoSection.playLabel`)}
          sectionId="estrutura-de-aviario-video"
        />
      ) : null}

      <StaticServiceBenefitsChecklistSection
        viabilityTitle={t(`${SLUG}.benefitsSection.viability.title`)}
        viabilityDescription={t(`${SLUG}.benefitsSection.viability.description`)}
        benefitsTitle={t(`${SLUG}.benefitsSection.benefits.title`)}
        benefitsDescription={t(`${SLUG}.benefitsSection.benefits.description`)}
        checklistItems={checklistItems}
        sectionLabel={t(`${SLUG}.benefitsSection.label`)}
        checklistLabel={t(`${SLUG}.benefitsSection.checklistLabel`)}
        sectionId="estrutura-de-aviario-benefits"
      />
    </>
  );
}
