import { getTranslations } from "next-intl/server";
import { StaticServiceIntroSection } from "@/components/marketing/StaticServiceIntroSection";

const SLUG = "carport" as const;

interface CarportSectionsProps {
  locale: string;
}

export async function CarportSections({ locale }: CarportSectionsProps) {
  const t = await getTranslations({
    locale,
    namespace: "pages.staticServices",
  });

  return (
    <StaticServiceIntroSection
      title={t(`${SLUG}.introSection.title`)}
      subtitle={t(`${SLUG}.introSection.subtitle`)}
      sectionId="carport-intro"
    />
  );
}
