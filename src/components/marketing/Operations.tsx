import { getTranslations } from "next-intl/server";
import { BentoCarousel } from "./BentoCarousel";
import { cn, OPERATIONS_SLIDES, sectionCardShellSpacing } from "@/lib/utils";

export async function Operations() {
  const t = await getTranslations("operations");

  return (
    <section
      aria-labelledby="operations-title"
      className={cn("mt-14", sectionCardShellSpacing)}
    >
      <h2 id="operations-title" className="sr-only">
        {t("title")}
      </h2>
      <BentoCarousel slides={OPERATIONS_SLIDES} />
    </section>
  );
}
