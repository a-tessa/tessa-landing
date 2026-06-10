import { getLocale, getTranslations } from "next-intl/server";
import { ServiceVideoPlayer } from "@/components/marketing/ServiceVideoPlayer";
import { getIndustryVideoConfig } from "@/lib/industry-content";
import { cn, freeSectionShellSpacing } from "@/lib/utils";

export async function IndustrySection() {
  const [t, locale] = await Promise.all([
    getTranslations("industry"),
    getLocale(),
  ]);
  const video = getIndustryVideoConfig(locale);

  return (
    <section
      aria-labelledby="industry-title"
      className={cn("w-full mb-20 pt-4 sm:pt-6", freeSectionShellSpacing)}
    >
      <div className="mx-auto flex w-full flex-col gap-10 xl:grid xl:max-w-none xl:grid-cols-[minmax(0,1fr)_minmax(280px,550px)] xl:items-center lg:gap-10 xl:gap-12">
        <div className="text-left">
          <h2
            id="industry-title"
            className="whitespace-pre-line font-barlow text-3xl font-bold uppercase leading-tight text-foreground sm:text-4xl lg:text-[2.75rem]"
          >
            <span className="text-primary">{t("titlePrefix")}</span>
            {"\n"}
            {t("title")}
          </h2>
          <p className="mt-2 max-w-3xl text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground sm:text-sm">
            {t("description")}
          </p>
          <div
            aria-hidden
            className="mt-4 h-1 w-20 rounded-full bg-chart-5"
          />
        </div>

        <ServiceVideoPlayer
          videoUrl={video.url}
          startSeconds={video.startSeconds}
          playLabel={t("videoPlayLabel")}
          caption={t("videoCaption")}
          className="mx-auto aspect-video w-full max-w-[550px] shadow-lg lg:mx-0 lg:max-w-none"
        />
      </div>
    </section>
  );
}
