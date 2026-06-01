import type { StaticServiceSlug } from "./static-pages";

/** URLs de vídeo YouTube por página de serviço estática. */
export const STATIC_SERVICE_VIDEO_URLS: Partial<
  Record<StaticServiceSlug, string>
> = {
  "estruturas-metalicas-para-telhado":
    "https://www.youtube.com/watch?v=B7ffJg1XHcM",
};

export function getStaticServiceVideoUrl(
  slug: StaticServiceSlug,
): string | undefined {
  return STATIC_SERVICE_VIDEO_URLS[slug];
}
