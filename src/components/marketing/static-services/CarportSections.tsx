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
  CARPORT_INFO_COLUMN_IDS,
  CARPORT_RENDER_SRC,
  CARPORT_SEGMENT_ICONS,
  CARPORT_SEGMENT_IDS,
  getCarportClampPatentImage,
} from "@/lib/servicos/carport-content";
import { getStaticServiceVideoUrl } from "@/lib/servicos/static-content";
import {
  getYouTubeThumbnail,
  getYouTubeVideoId,
  getYouTubeWatchUrl,
} from "@/lib/youtube";

const SLUG = "carport" as const;

interface CarportSectionsProps {
  locale: string;
}

export async function CarportSections({ locale }: CarportSectionsProps) {
  const t = await getTranslations({
    locale,
    namespace: "pages.staticServices",
  });

  const videoUrl = getStaticServiceVideoUrl(SLUG, locale);
  const videoId = videoUrl ? getYouTubeVideoId(videoUrl) : null;
  const videoTitle = t(`${SLUG}.videoSection.title`);
  const videoSubtitle = t(`${SLUG}.videoSection.subtitle`);
  const infoColumns = CARPORT_INFO_COLUMN_IDS.map((id) => ({
    id,
    title: t(`${SLUG}.infoColumnsSection.items.${id}.title`),
    description: t(`${SLUG}.infoColumnsSection.items.${id}.description`),
  }));
  const segments = CARPORT_SEGMENT_IDS.map((id) => ({
    id,
    label: t(`${SLUG}.segmentsSection.items.${id}.label`),
    iconSrc: CARPORT_SEGMENT_ICONS[id],
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
        <JsonLd id="jsonld-video-carport" data={videoJsonLd} />
      ) : null}

      <StaticServiceIntroSection
        title={t(`${SLUG}.introSection.title`)}
        subtitle={t(`${SLUG}.introSection.subtitle`)}
        sectionId="carport-intro"
      />

      <StaticServiceWhatIsSection
        title={t(`${SLUG}.whatIsSection.title`)}
        description={t(`${SLUG}.whatIsSection.description`)}
        imageSrc={CARPORT_RENDER_SRC}
        imageAlt={t(`${SLUG}.whatIsSection.imageAlt`)}
        sectionId="carport-what-is"
      />

      {videoUrl ? (
        <StaticServiceCenteredVideoSection
          title={videoTitle}
          subtitle={videoSubtitle}
          videoUrl={videoUrl}
          playLabel={t(`${SLUG}.videoSection.playLabel`)}
          sectionId="carport-video"
        />
      ) : null}

      <StaticServiceInfoColumnsSection
        columns={infoColumns}
        sectionLabel={t(`${SLUG}.infoColumnsSection.label`)}
        sectionId="carport-info-columns"
      />

      <StaticServiceSegmentsSection
        title={t(`${SLUG}.segmentsSection.title`)}
        items={segments}
        sectionId="carport-segments"
      />

      <StaticServiceSplitFeatureSection
        title={t(`${SLUG}.clampSection.title`)}
        description={t(`${SLUG}.clampSection.description`)}
        imageSrc={getCarportClampPatentImage(locale)}
        imageAlt={t(`${SLUG}.clampSection.imageAlt`)}
        sectionId="carport-clamp"
      />
    </>
  );
}
