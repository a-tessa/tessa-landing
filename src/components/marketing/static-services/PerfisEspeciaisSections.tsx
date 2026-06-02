import { getTranslations } from "next-intl/server";
import { StaticServiceCenteredVideoSection } from "@/components/marketing/StaticServiceCenteredVideoSection";
import { StaticServiceInfoCardsSection } from "@/components/marketing/StaticServiceInfoCardsSection";
import { StaticServiceIntroSection } from "@/components/marketing/StaticServiceIntroSection";
import { StaticServiceClientsMarqueeSection } from "@/components/marketing/StaticServiceClientsMarqueeSection";
import { StaticServiceComparisonTableSection } from "@/components/marketing/StaticServiceComparisonTableSection";
import { StaticServiceProcessStepsSection } from "@/components/marketing/StaticServiceProcessStepsSection";
import { StaticServiceSegmentsSection } from "@/components/marketing/StaticServiceSegmentsSection";
import { StaticServiceWhatIsSection } from "@/components/marketing/StaticServiceWhatIsSection";
import { JsonLd } from "@/lib/seo/jsonld";
import { SITE } from "@/lib/seo/schemas";
import {
  PERFIS_ESPECIAIS_INFO_CARD_IDS,
  PERFIS_ESPECIAIS_CLIENT_LOGOS,
  PERFIS_ESPECIAIS_COMPARISON_CHECK_ICON,
  PERFIS_ESPECIAIS_COMPARISON_MATRIX,
  PERFIS_ESPECIAIS_COMPARISON_ROW_IDS,
  PERFIS_ESPECIAIS_COMPARISON_TIMES_ICON,
  PERFIS_ESPECIAIS_INFO_CARD_IMAGES,
  PERFIS_ESPECIAIS_PROCESS_ARROW_ICON,
  PERFIS_ESPECIAIS_PROCESS_STEP_ICONS,
  PERFIS_ESPECIAIS_PROCESS_STEP_IDS,
  PERFIS_ESPECIAIS_PROCESS_STEP_NUMBERS,
  PERFIS_ESPECIAIS_RENDER_SRC,
  PERFIS_ESPECIAIS_SEGMENT_ICONS,
  PERFIS_ESPECIAIS_SEGMENT_IDS,
} from "@/lib/servicos/perfis-especiais-content";
import { getStaticServiceVideoUrl } from "@/lib/servicos/static-content";
import {
  getYouTubeThumbnail,
  getYouTubeVideoId,
  getYouTubeWatchUrl,
} from "@/lib/youtube";

const SLUG = "perfis-especiais" as const;

interface PerfisEspeciaisSectionsProps {
  locale: string;
}

export async function PerfisEspeciaisSections({
  locale,
}: PerfisEspeciaisSectionsProps) {
  const t = await getTranslations({
    locale,
    namespace: "pages.staticServices",
  });

  const videoUrl = getStaticServiceVideoUrl(SLUG, locale);
  const videoId = videoUrl ? getYouTubeVideoId(videoUrl) : null;
  const videoTitle = t(`${SLUG}.videoSection.title`);
  const videoSubtitle = t(`${SLUG}.videoSection.subtitle`);
  const infoCards = PERFIS_ESPECIAIS_INFO_CARD_IDS.map((id) => ({
    id,
    title: t(`${SLUG}.infoCardsSection.items.${id}.title`),
    description: t(`${SLUG}.infoCardsSection.items.${id}.description`),
    imageSrc: PERFIS_ESPECIAIS_INFO_CARD_IMAGES[id],
    imageAlt: t(`${SLUG}.infoCardsSection.items.${id}.imageAlt`),
  }));
  const segments = PERFIS_ESPECIAIS_SEGMENT_IDS.map((id) => ({
    id,
    label: t(`${SLUG}.segmentsSection.items.${id}.label`),
    iconSrc: PERFIS_ESPECIAIS_SEGMENT_ICONS[id],
    iconAlt: t(`${SLUG}.segmentsSection.items.${id}.iconAlt`),
  }));
  const processSteps = PERFIS_ESPECIAIS_PROCESS_STEP_IDS.map((id) => ({
    id,
    title: t(`${SLUG}.processSection.items.${id}.title`),
    description: t(`${SLUG}.processSection.items.${id}.description`),
    iconSrc: PERFIS_ESPECIAIS_PROCESS_STEP_ICONS[id],
    iconAlt: t(`${SLUG}.processSection.items.${id}.iconAlt`),
    numberSrc: PERFIS_ESPECIAIS_PROCESS_STEP_NUMBERS[id],
  }));
  const comparisonRows = PERFIS_ESPECIAIS_COMPARISON_ROW_IDS.map((id) => ({
    id,
    label: t(`${SLUG}.comparisonSection.rows.${id}`),
    special: PERFIS_ESPECIAIS_COMPARISON_MATRIX[id].special,
    common: PERFIS_ESPECIAIS_COMPARISON_MATRIX[id].common,
  }));
  const clientLogos = PERFIS_ESPECIAIS_CLIENT_LOGOS.map((logo) => ({
    ...logo,
    alt: t(`${SLUG}.clientsSection.logoAlt`, { name: logo.name }),
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
        <JsonLd id="jsonld-video-perfis-especiais" data={videoJsonLd} />
      ) : null}

      <StaticServiceIntroSection
        title={t(`${SLUG}.introSection.title`)}
        subtitle={t(`${SLUG}.introSection.subtitle`)}
        sectionId="perfis-especiais-intro"
      />

      <StaticServiceWhatIsSection
        title={t(`${SLUG}.whatIsSection.title`)}
        description={t(`${SLUG}.whatIsSection.description`)}
        imageSrc={PERFIS_ESPECIAIS_RENDER_SRC}
        imageAlt={t(`${SLUG}.whatIsSection.imageAlt`)}
        sectionId="perfis-especiais-what-is"
        imageOverflow="moderate"
      />

      {videoUrl ? (
        <StaticServiceCenteredVideoSection
          title={videoTitle}
          subtitle={videoSubtitle}
          videoUrl={videoUrl}
          playLabel={t(`${SLUG}.videoSection.playLabel`)}
          sectionId="perfis-especiais-video"
        />
      ) : null}

      <StaticServiceInfoCardsSection
        items={infoCards}
        sectionLabel={t(`${SLUG}.infoCardsSection.label`)}
        sectionId="perfis-especiais-info-cards"
      />

      <StaticServiceSegmentsSection
        title={t(`${SLUG}.segmentsSection.title`)}
        items={segments}
        sectionId="perfis-especiais-segments"
      />

      <StaticServiceProcessStepsSection
        title={t(`${SLUG}.processSection.title`)}
        description={t(`${SLUG}.processSection.description`)}
        steps={processSteps}
        arrowIconSrc={PERFIS_ESPECIAIS_PROCESS_ARROW_ICON}
        sectionId="perfis-especiais-process"
      />

      <StaticServiceComparisonTableSection
        title={t(`${SLUG}.comparisonSection.title`)}
        subtitle={t(`${SLUG}.comparisonSection.subtitle`)}
        benefitsHeading={t(`${SLUG}.comparisonSection.benefitsHeading`)}
        specialHeading={t(`${SLUG}.comparisonSection.specialHeading`)}
        commonHeading={t(`${SLUG}.comparisonSection.commonHeading`)}
        rows={comparisonRows}
        checkIconSrc={PERFIS_ESPECIAIS_COMPARISON_CHECK_ICON}
        timesIconSrc={PERFIS_ESPECIAIS_COMPARISON_TIMES_ICON}
        yesLabel={t(`${SLUG}.comparisonSection.yesLabel`)}
        noLabel={t(`${SLUG}.comparisonSection.noLabel`)}
        sectionId="perfis-especiais-comparison"
      />

      <StaticServiceClientsMarqueeSection
        title={t(`${SLUG}.clientsSection.title`)}
        logos={clientLogos}
        sectionId="perfis-especiais-clients"
      />
    </>
  );
}
