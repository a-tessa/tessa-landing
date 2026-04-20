import { getTranslations } from "next-intl/server";
import AppleCardsCarousel from "@/components/apple-cards-carousel";
import { Link } from "@/i18n/navigation";
import { freeSectionShellSpacing, homeSpacing } from "@/lib/utils";

interface ServicosIntroProps {
  locale: string;
}

export async function ServicosIntro({ locale }: ServicosIntroProps) {
  const t = await getTranslations({ locale, namespace: "pages.servicos" });

  return (
    <section aria-labelledby="scenarios-title" className="w-full">
      <div
        className={`${freeSectionShellSpacing} flex flex-col md:flex-row gap-10`}
      >
        <div className="w-full md:w-5/12 flex-1">
          <h2
            id="scenarios-title"
            className="text-3xl font-semibold uppercase leading-tight text-foreground sm:text-6xl text-left md:text-right"
          >
            {t("chooseScenario")}
          </h2>
          <p className="mt-2 text-2xl font-semibold uppercase text-foreground text-left md:text-right">
            {t("customSolutions")}
          </p>
        </div>
        <p className="w-full md:w-5/12 flex-1 text-left md:text-left">
          {t("description")}
        </p>
      </div>
      <AppleCardsCarousel />

      <div className={`mt-8 flex justify-end sm:mt-10`}>
        <Link
          href="/servicos"
          className="inline-flex items-center gap-2 rounded-lg bg-secondary px-6 py-3 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
        >
          {t("viewAllServices")}
        </Link>
      </div>
    </section>
  );
}
