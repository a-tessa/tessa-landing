"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn, freeSectionShellSpacing, homeSpacing } from "@/lib/utils";
import type { SceneryItem } from "@/lib/api/types";
import AppleCardsCarousel from "../apple-cards-carousel";

interface ScenariosProps {
  scenerySection?: SceneryItem[] | null;
}

export function Scenarios({ scenerySection }: ScenariosProps) {
  const t = useTranslations("scenarios");

  return (
    <section aria-labelledby="scenarios-title" className="w-full">
      <div className={cn(freeSectionShellSpacing)}>
        <h2
          id="scenarios-title"
          className="text-3xl font-bold uppercase leading-tight text-foreground sm:text-4xl"
        >
          {t("title")}
        </h2>
        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground sm:text-sm">
          {t("subtitle")}
        </p>
        <div className="mt-4 h-1 w-20 rounded-full bg-chart-5" />
      </div>
      <AppleCardsCarousel scenerySection={scenerySection} />

      <div className={`mt-8 flex justify-end sm:mt-10 ${homeSpacing}`}>
        <Link
          href="/servicos"
          className="inline-flex items-center gap-2 rounded-lg bg-secondary px-6 py-3 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
        >
          {t("viewAll")}
        </Link>
      </div>
    </section>
  );
}
