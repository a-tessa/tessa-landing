import { getTranslations } from "next-intl/server";
import { AutoImageCarousel } from "@/components/marketing/AutoImageCarousel";
import { StaticServiceProductGrid } from "@/components/marketing/StaticServiceProductGrid";
import { StaticServiceQualitySection } from "@/components/marketing/StaticServiceQualitySection";
import { StaticServiceVideoSection } from "@/components/marketing/StaticServiceVideoSection";
import { ESTRUTURAS_METALICAS_CAROUSEL_IMAGES } from "@/lib/servicos/estruturas-metalicas-carousel";
import { ESTRUTURAS_METALICAS_QUALITY_FEATURES } from "@/lib/servicos/estruturas-metalicas-quality";
import { ESTRUTURAS_METALICAS_PRODUCTS } from "@/lib/servicos/estruturas-metalicas-products";
import { getStaticServiceVideoUrl } from "@/lib/servicos/static-content";

const SLUG = "estruturas-metalicas-para-telhado" as const;

interface EstruturasMetalicasTelhadoSectionsProps {
  locale: string;
}

export async function EstruturasMetalicasTelhadoSections({
  locale,
}: EstruturasMetalicasTelhadoSectionsProps) {
  const t = await getTranslations({
    locale,
    namespace: "pages.staticServices",
  });
  const videoUrl = getStaticServiceVideoUrl(SLUG);
  const products = ESTRUTURAS_METALICAS_PRODUCTS.map((product) => ({
    id: product.id,
    src: product.src,
    name: t(`${SLUG}.productsSection.items.${product.id}`),
  }));
  const carouselImages = ESTRUTURAS_METALICAS_CAROUSEL_IMAGES.map((image) => ({
    src: image.src,
    alt: t(`${SLUG}.carouselSection.items.${image.id}`),
  }));
  const qualityContent = {
    sealAlt: t(`${SLUG}.qualitySection.sealAlt`),
    stats: [
      {
        id: "installedArea",
        highlight: t(`${SLUG}.qualitySection.stats.installedArea.highlight`),
        label: t(`${SLUG}.qualitySection.stats.installedArea.label`),
      },
      {
        id: "installations",
        highlight: t(`${SLUG}.qualitySection.stats.installations.highlight`),
        label: t(`${SLUG}.qualitySection.stats.installations.label`),
      },
    ],
    features: ESTRUTURAS_METALICAS_QUALITY_FEATURES.map((feature) => ({
      id: feature.id,
      iconSrc: feature.iconSrc,
      title: t(`${SLUG}.qualitySection.features.${feature.id}.title`),
      description: t(`${SLUG}.qualitySection.features.${feature.id}.description`),
    })),
  };

  return (
    <>
      {videoUrl ? (
        <StaticServiceVideoSection
          title={t(`${SLUG}.videoSection.title`)}
          subtitle={t(`${SLUG}.videoSection.subtitle`)}
          videoUrl={videoUrl}
          playLabel={t(`${SLUG}.videoSection.playLabel`)}
          sectionId="estruturas-metalicas-video"
        />
      ) : null}

      <StaticServiceProductGrid
        title={t(`${SLUG}.productsSection.title`)}
        subtitle={t(`${SLUG}.productsSection.subtitle`)}
        products={products}
        sectionId="estruturas-metalicas-produtos"
      />

      <AutoImageCarousel
        images={carouselImages}
        label={t(`${SLUG}.carouselSection.label`)}
      />

      <StaticServiceQualitySection
        title={t(`${SLUG}.qualitySection.title`)}
        subtitle={t(`${SLUG}.qualitySection.subtitle`)}
        content={qualityContent}
        featuresScrollLabel={t(`${SLUG}.qualitySection.featuresScrollLabel`)}
        scrollLeftLabel={t(`${SLUG}.qualitySection.scrollLeft`)}
        scrollRightLabel={t(`${SLUG}.qualitySection.scrollRight`)}
        sectionId="estruturas-metalicas-qualidade"
      />
    </>
  );
}
