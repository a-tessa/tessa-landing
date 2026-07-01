import { getTranslations } from "next-intl/server";
import { StaticServiceBenefitsChecklistSection } from "@/components/marketing/StaticServiceBenefitsChecklistSection";
import { StaticServiceImageSplitSection } from "@/components/marketing/StaticServiceImageSplitSection";
import { StaticServiceIntroSection } from "@/components/marketing/StaticServiceIntroSection";
import { StaticServiceVideoSection } from "@/components/marketing/StaticServiceVideoSection";
import { JsonLd } from "@/lib/seo/jsonld";
import { SITE } from "@/lib/seo/schemas";
import {
  CRECHES_CHECKLIST_ITEM_IDS,
  CRECHES_FEATURE_IMAGE_SRC,
} from "@/lib/servicos/estruturas-para-creches-content";
import { getStaticServiceVideoUrl } from "@/lib/servicos/static-content";
import {
  getYouTubeThumbnail,
  getYouTubeVideoId,
  getYouTubeWatchUrl,
} from "@/lib/youtube";

const SLUG = "estruturas-para-creches" as const;

interface EstruturasParaCrechesSectionsProps {
  locale: string;
}

export async function EstruturasParaCrechesSections({
  locale,
}: EstruturasParaCrechesSectionsProps) {
  const t = await getTranslations({
    locale,
    namespace: "pages.staticServices",
  });

  const videoUrl = getStaticServiceVideoUrl(SLUG, locale);
  const videoId = videoUrl ? getYouTubeVideoId(videoUrl) : null;
  const videoTitle = t(`${SLUG}.videoSection.title`);
  const videoSubtitle = t(`${SLUG}.videoSection.subtitle`);
  const checklistItems = CRECHES_CHECKLIST_ITEM_IDS.map((id) => ({
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
        <JsonLd id="jsonld-video-estruturas-para-creches" data={videoJsonLd} />
      ) : null}

      <StaticServiceIntroSection
        title={t(`${SLUG}.introSection.title`)}
        subtitle={t(`${SLUG}.introSection.subtitle`)}
        sectionId="estruturas-para-creches-intro"
      />

      <StaticServiceImageSplitSection
        title={t(`${SLUG}.featureSection.title`)}
        subtitle={t(`${SLUG}.featureSection.subtitle`)}
        description={t(`${SLUG}.featureSection.description`)}
        imageSrc={CRECHES_FEATURE_IMAGE_SRC}
        imageAlt={t(`${SLUG}.featureSection.imageAlt`)}
        sectionId="estruturas-para-creches-feature"
      />

      {videoUrl ? (
        <StaticServiceVideoSection
          title={videoTitle}
          subtitle={videoSubtitle}
          videoUrl={videoUrl}
          playLabel={t(`${SLUG}.videoSection.playLabel`)}
          sectionId="estruturas-para-creches-video"
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
        sectionId="estruturas-para-creches-benefits"
        stackViability
      />
    </>
  );
}
