import { getTranslations } from "next-intl/server";
import { StaticServiceCenteredVideoSection } from "@/components/marketing/StaticServiceCenteredVideoSection";
import { StaticServiceInfoColumnsSection } from "@/components/marketing/StaticServiceInfoColumnsSection";
import { StaticServiceIntroSection } from "@/components/marketing/StaticServiceIntroSection";
import { StaticServiceWhatIsSection } from "@/components/marketing/StaticServiceWhatIsSection";
import { JsonLd } from "@/lib/seo/jsonld";
import { SITE } from "@/lib/seo/schemas";
import { StaticServiceSegmentsSection } from "@/components/marketing/StaticServiceSegmentsSection";
import { StaticServiceSplitFeatureSection } from "@/components/marketing/StaticServiceSplitFeatureSection";
import {
  ESTRUTURA_DE_SOLO_INFO_COLUMN_IDS,
  ESTRUTURA_DE_SOLO_RENDER_SRC,
  ESTRUTURA_DE_SOLO_SEGMENT_ICONS,
  ESTRUTURA_DE_SOLO_SEGMENT_IDS,
  getEstruturaDeSoloClampPatentImage,
} from "@/lib/servicos/estrutura-de-solo-content";
import { getStaticServiceVideoUrl } from "@/lib/servicos/static-content";
import {
  getYouTubeThumbnail,
  getYouTubeVideoId,
  getYouTubeWatchUrl,
} from "@/lib/youtube";

const SLUG = "estrutura-de-solo" as const;

interface EstruturaDeSoloSectionsProps {
  locale: string;
}

export async function EstruturaDeSoloSections({
  locale,
}: EstruturaDeSoloSectionsProps) {
  const t = await getTranslations({
    locale,
    namespace: "pages.staticServices",
  });

  const videoUrl = getStaticServiceVideoUrl(SLUG, locale);
  const videoId = videoUrl ? getYouTubeVideoId(videoUrl) : null;
  const videoTitle = t(`${SLUG}.videoSection.title`);
  const videoSubtitle = t(`${SLUG}.videoSection.subtitle`);
  const infoColumns = ESTRUTURA_DE_SOLO_INFO_COLUMN_IDS.map((id) => ({
    id,
    title: t(`${SLUG}.infoColumnsSection.items.${id}.title`),
    description: t(`${SLUG}.infoColumnsSection.items.${id}.description`),
  }));
  const segments = ESTRUTURA_DE_SOLO_SEGMENT_IDS.map((id) => ({
    id,
    label: t(`${SLUG}.segmentsSection.items.${id}.label`),
    iconSrc: ESTRUTURA_DE_SOLO_SEGMENT_ICONS[id],
    iconAlt: t(`${SLUG}.segmentsSection.items.${id}.iconAlt`),
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
      {videoJsonLd ? (
        <JsonLd id="jsonld-video-estrutura-de-solo" data={videoJsonLd} />
      ) : null}

      <StaticServiceIntroSection
        title={t(`${SLUG}.introSection.title`)}
        subtitle={t(`${SLUG}.introSection.subtitle`)}
        sectionId="estrutura-de-solo-intro"
      />

      <StaticServiceWhatIsSection
        title={t(`${SLUG}.whatIsSection.title`)}
        description={t(`${SLUG}.whatIsSection.description`)}
        imageSrc={ESTRUTURA_DE_SOLO_RENDER_SRC}
        imageAlt={t(`${SLUG}.whatIsSection.imageAlt`)}
        sectionId="estrutura-de-solo-what-is"
      />

      {videoUrl ? (
        <StaticServiceCenteredVideoSection
          title={videoTitle}
          subtitle={videoSubtitle}
          videoUrl={videoUrl}
          playLabel={t(`${SLUG}.videoSection.playLabel`)}
          sectionId="estrutura-de-solo-video"
        />
      ) : null}

      <StaticServiceInfoColumnsSection
        columns={infoColumns}
        sectionLabel={t(`${SLUG}.infoColumnsSection.label`)}
        sectionId="estrutura-de-solo-info-columns"
      />

      <StaticServiceSegmentsSection
        title={t(`${SLUG}.segmentsSection.title`)}
        items={segments}
        sectionId="estrutura-de-solo-segments"
      />

      <StaticServiceSplitFeatureSection
        title={t(`${SLUG}.clampSection.title`)}
        description={t(`${SLUG}.clampSection.description`)}
        imageSrc={getEstruturaDeSoloClampPatentImage(locale)}
        imageAlt={t(`${SLUG}.clampSection.imageAlt`)}
        sectionId="estrutura-de-solo-clamp"
      />
    </>
  );
}
