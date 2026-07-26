import { getLocale, getTranslations } from "next-intl/server";
import { ServiceVideoPlayer } from "@/components/marketing/ServiceVideoPlayer";
import {
  getIndustryVideoConfig,
  resolveIndustrySection,
} from "@/lib/industry-content";
import { cn, freeSectionShellSpacing } from "@/lib/utils";

interface IndustrySectionProps {
  industrySection?: unknown;
}

export async function IndustrySection({
  industrySection,
}: IndustrySectionProps) {
  const [t, locale] = await Promise.all([
    getTranslations("industry"),
    getLocale(),
  ]);
  const cmsContent = resolveIndustrySection(industrySection, locale);
  const video = cmsContent?.video ?? getIndustryVideoConfig(locale);
  const titlePrefix = cmsContent?.titlePrefix ?? t("titlePrefix");
  const title = cmsContent?.title ?? t("title");
  const subtitle = cmsContent?.subtitle ?? t("description");

  return (
    <section
      aria-labelledby="industry-title"
      className={cn("w-full mb-20 pt-4 sm:pt-6", freeSectionShellSpacing)}
    >
      <div className="mx-auto flex w-full flex-col gap-10 xl:grid xl:max-w-none xl:grid-cols-[minmax(0,1fr)_minmax(280px,550px)] xl:items-start lg:gap-10 xl:gap-12">
        <div className="text-left">
          <h2
            id="industry-title"
            className="whitespace-pre-line font-barlow text-3xl font-bold uppercase leading-tight text-foreground sm:text-4xl lg:text-[2.75rem]"
          >
            <span className="text-primary">{titlePrefix}</span>
            {"\n"}
            {title}
          </h2>
          <p className="mt-2 max-w-3xl text-xs font-normal tracking-wide text-muted-foreground sm:text-sm">
            {subtitle}
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
          className="cinema-frame mx-auto flex h-56 w-full max-w-137.5 items-center justify-center bg-black shadow-lg sm:h-72 lg:mx-0 lg:max-w-none"
        />
      </div>
    </section>
  );
}
