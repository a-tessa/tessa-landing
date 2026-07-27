import { getYouTubeVideoId } from "./youtube";

const ABOUT_VIDEO_PT = "https://www.youtube.com/watch?v=EeLYcZsdYrw";
const ABOUT_FALLBACK_SIDE_IMAGE = "/operations-gallery/galeria_tessa_01.webp";

const MAX_HERO_TITLE_LENGTH = 80;
const MAX_BODY_LENGTH = 4000;
const MAX_SIDE_IMAGE_ALT_LENGTH = 120;
const MAX_PILLAR_TITLE_LENGTH = 80;
const MAX_PILLAR_DESCRIPTION_LENGTH = 500;

export interface AboutVideo {
  url: string;
  startSeconds?: number;
}

export interface AboutPillar {
  title: string;
  description: string;
}

export interface AboutSectionContent {
  heroTitle: string;
  video: AboutVideo;
  sideImage: {
    url: string;
    alt: string;
  };
  body: string;
  mission: AboutPillar;
  vision: AboutPillar;
  values: AboutPillar;
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

function parseAboutVideo(value: unknown): AboutVideo | null {
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

function parsePillar(value: unknown): AboutPillar | null {
  if (!isObject(value)) return null;
  if (
    !isValidText(value.title, MAX_PILLAR_TITLE_LENGTH) ||
    !isValidText(value.description, MAX_PILLAR_DESCRIPTION_LENGTH)
  ) {
    return null;
  }

  return {
    title: value.title.trim(),
    description: value.description.trim(),
  };
}

export function resolveAboutSection(
  value: unknown,
  locale: string,
): AboutSectionContent | null {
  if (!isObject(value) || !isObject(value.videos) || !isObject(value.sideImage)) {
    return null;
  }

  if (
    !isValidText(value.heroTitle, MAX_HERO_TITLE_LENGTH) ||
    !isValidText(value.body, MAX_BODY_LENGTH) ||
    typeof value.sideImage.url !== "string" ||
    value.sideImage.url.trim().length === 0 ||
    !isValidText(value.sideImage.alt, MAX_SIDE_IMAGE_ALT_LENGTH)
  ) {
    return null;
  }

  const portugueseVideo = parseAboutVideo(value.videos["pt-BR"]);
  if (!portugueseVideo) return null;

  const mission = parsePillar(value.mission);
  const vision = parsePillar(value.vision);
  const values = parsePillar(value.values);
  if (!mission || !vision || !values) return null;

  const localizedVideo =
    locale === "pt-BR" ? null : parseAboutVideo(value.videos[locale]);

  return {
    heroTitle: value.heroTitle.trim(),
    body: value.body.trim(),
    sideImage: {
      url: value.sideImage.url.trim(),
      alt: value.sideImage.alt.trim(),
    },
    video: localizedVideo ?? portugueseVideo,
    mission,
    vision,
    values,
  };
}

export function getAboutVideoFallback(): AboutVideo {
  return { url: ABOUT_VIDEO_PT };
}

export function getAboutSideImageFallback(): string {
  return ABOUT_FALLBACK_SIDE_IMAGE;
}

/** Split CMS/i18n body into paragraphs on blank lines. */
export function splitAboutBodyParagraphs(body: string): string[] {
  return body
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
}
