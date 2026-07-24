import { getTranslations } from "next-intl/server";
import { BentoCarousel } from "./BentoCarousel";
import type { OperationSection } from "@/lib/api/types";
import {
  groupOperationSlides,
  resolveOperationSection,
} from "@/lib/operations-content";
import { cn, OPERATIONS_SLIDES, sectionCardShellSpacing } from "@/lib/utils";

interface OperationsProps {
  operationSection?: OperationSection | null;
}

export async function Operations({ operationSection }: OperationsProps = {}) {
  const t = await getTranslations("operations");
  const cmsImages = resolveOperationSection(operationSection);
  const slides = cmsImages
    ? groupOperationSlides(cmsImages)
    : OPERATIONS_SLIDES;

  return (
    <section
      aria-labelledby="operations-title"
      className={cn("mt-14", sectionCardShellSpacing)}
    >
      <h2 id="operations-title" className="sr-only">
        {t("title")}
      </h2>
      <BentoCarousel slides={slides} />
    </section>
  );
}
