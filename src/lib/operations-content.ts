const MIN_OPERATION_IMAGES = 6;
const MAX_OPERATION_IMAGES = 40;
const MAX_ALT_LENGTH = 100;
const MAX_CAPTION_LENGTH = 300;
const SLIDE_SIZE = 4;

export interface OperationImageContent {
  src: string;
  alt: string;
  caption?: string;
}

export interface OperationSlide {
  images: OperationImageContent[];
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseOperationImage(value: unknown): OperationImageContent | null {
  if (!isObject(value) || typeof value.url !== "string") {
    return null;
  }

  const src = value.url.trim();
  if (src.length === 0) {
    return null;
  }

  // Legacy items may omit `alt`; when present it must already be within limits.
  let alt = "";
  if (value.alt !== undefined && value.alt !== null) {
    if (typeof value.alt !== "string") {
      return null;
    }
    alt = value.alt.trim();
    if (alt.length > MAX_ALT_LENGTH) {
      return null;
    }
  }

  let caption: string | undefined;
  if (value.caption !== undefined && value.caption !== null) {
    if (typeof value.caption !== "string") {
      return null;
    }

    const captionRaw = value.caption.trim();
    if (captionRaw.length === 0) {
      caption = undefined;
    } else if (
      captionRaw.length > MAX_CAPTION_LENGTH ||
      captionRaw === alt
    ) {
      return null;
    } else {
      caption = captionRaw;
    }
  }

  return caption === undefined ? { src, alt } : { src, alt, caption };
}

/**
 * Validates published CMS gallery content for the landing page.
 * Returns null so the static eight-image fallback remains active when the
 * section is absent, underfilled, oversized, or structurally invalid.
 * Legacy items without `alt`/`caption` remain readable.
 */
export function resolveOperationSection(
  value: unknown,
): OperationImageContent[] | null {
  if (!isObject(value) || !Array.isArray(value.images)) {
    return null;
  }

  if (
    value.images.length < MIN_OPERATION_IMAGES ||
    value.images.length > MAX_OPERATION_IMAGES
  ) {
    return null;
  }

  const images: OperationImageContent[] = [];
  for (const item of value.images) {
    const parsed = parseOperationImage(item);
    if (!parsed) {
      return null;
    }
    images.push(parsed);
  }

  return images;
}

export function groupOperationSlides(
  images: OperationImageContent[],
  size: number = SLIDE_SIZE,
): OperationSlide[] {
  const slides: OperationSlide[] = [];
  for (let index = 0; index < images.length; index += size) {
    slides.push({ images: images.slice(index, index + size) });
  }
  return slides;
}
