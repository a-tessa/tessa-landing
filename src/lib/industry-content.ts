import { getYouTubeVideoId } from "./youtube";

const INDUSTRY_VIDEO_PT = "https://www.youtube.com/watch?v=EeLYcZsdYrw";
const INDUSTRY_VIDEO_ES = "https://www.youtube.com/watch?v=eGdFPCZYNYQ";
const MAX_TITLE_PREFIX_LENGTH = 60;
const MAX_TITLE_LENGTH = 100;
/** Keep in sync with tessa-api `MAX_INDUSTRY_SUBTITLE_LENGTH`. */
const MAX_SUBTITLE_LENGTH = 700;

export interface IndustryVideo {
  url: string;
  startSeconds?: number;
}

export interface IndustrySectionContent {
  titlePrefix: string;
  title: string;
  subtitle: string;
  video: IndustryVideo;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidText(
  value: unknown,
  maximumLength: number,
): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.trim().length <= maximumLength
  );
}

function parseIndustryVideo(value: unknown): IndustryVideo | null {
  if (!isObject(value) || typeof value.url !== "string") {
    return null;
  }

  const url = value.url.trim();
  if (getYouTubeVideoId(url) === null) {
    return null;
  }

  const startSeconds = value.startSeconds;
  if (
    startSeconds !== undefined &&
    (!Number.isInteger(startSeconds) || Number(startSeconds) < 0)
  ) {
    return null;
  }

  return startSeconds === undefined
    ? { url }
    : { url, startSeconds: Number(startSeconds) };
}

export function resolveIndustrySection(
  value: unknown,
  locale: string,
): IndustrySectionContent | null {
  if (!isObject(value) || !isObject(value.videos)) {
    return null;
  }

  if (
    !isValidText(value.titlePrefix, MAX_TITLE_PREFIX_LENGTH) ||
    !isValidText(value.title, MAX_TITLE_LENGTH) ||
    !isValidText(value.subtitle, MAX_SUBTITLE_LENGTH)
  ) {
    return null;
  }

  const portugueseVideo = parseIndustryVideo(value.videos["pt-BR"]);
  if (!portugueseVideo) {
    return null;
  }

  // Text is already localized by the API when a translation is available and falls
  // back to Portuguese text otherwise. The video, however, is either the locale's own
  // full URL/start-seconds pair or the entire Portuguese pair — never a mix of both.
  const localizedVideo =
    locale === "pt-BR" ? null : parseIndustryVideo(value.videos[locale]);

  return {
    titlePrefix: value.titlePrefix.trim(),
    title: value.title.trim(),
    subtitle: value.subtitle.trim(),
    video: localizedVideo ?? portugueseVideo,
  };
}

export function getIndustryVideoConfig(locale: string): {
  url: string;
  startSeconds?: number;
} {
  if (locale === "es") {
    return { url: INDUSTRY_VIDEO_ES, startSeconds: 6 };
  }

  // pt-BR and en — no dedicated English version
  return { url: INDUSTRY_VIDEO_PT };
}
