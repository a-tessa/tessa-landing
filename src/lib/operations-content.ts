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

const LOCAL_ASSET_PREFIX = "/";
const IMAGE_PROBE_TIMEOUT_MS = 2_500;
const IMAGE_PROBE_REVALIDATE_SECONDS = 3600;

function isLocalAssetSrc(src: string): boolean {
  return src.startsWith(LOCAL_ASSET_PREFIX);
}

/**
 * HEAD-probes a remote image URL. Missing blobs (404/410) and failed requests
 * are treated as unreachable so the page never emits `<img>` tags for them.
 */
export async function probeRemoteImageUrl(src: string): Promise<boolean> {
  try {
    const response = await fetch(src, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(IMAGE_PROBE_TIMEOUT_MS),
      next: {
        revalidate: IMAGE_PROBE_REVALIDATE_SECONDS,
        tags: ["operation-image-reachability"],
      },
    });

    if (response.status === 404 || response.status === 410) {
      return false;
    }

    if (response.ok) {
      return true;
    }

    if (response.status === 405 || response.status === 501) {
      const ranged = await fetch(src, {
        method: "GET",
        headers: { Range: "bytes=0-0" },
        redirect: "follow",
        signal: AbortSignal.timeout(IMAGE_PROBE_TIMEOUT_MS),
        next: {
          revalidate: IMAGE_PROBE_REVALIDATE_SECONDS,
          tags: ["operation-image-reachability"],
        },
      });
      return ranged.ok || ranged.status === 206;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Drops remote images that are gone from blob storage. Returns null when fewer
 * than `MIN_OPERATION_IMAGES` remain so callers keep the static gallery.
 */
export async function keepReachableOperationImages(
  images: OperationImageContent[],
  isReachable: (src: string) => Promise<boolean> = probeRemoteImageUrl,
): Promise<OperationImageContent[] | null> {
  const reachable = await Promise.all(
    images.map(async (image) => {
      if (isLocalAssetSrc(image.src)) {
        return true;
      }
      return isReachable(image.src);
    }),
  );

  const kept = images.filter((_, index) => reachable[index]);
  if (kept.length < MIN_OPERATION_IMAGES) {
    return null;
  }

  return kept;
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
