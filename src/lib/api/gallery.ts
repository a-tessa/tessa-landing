import { localeCacheKey, toApiLocale } from "./locale";

export type GalleryMediaKind = "photo" | "video";

export interface GalleryMediaItemPublicDto {
  id: string;
  kind: GalleryMediaKind;
  alt: string;
  caption: string | null;
  categorySlug: string | null;
  order: number;
  imageUrl: string | null;
  youtubeUrl: string | null;
  youtubeVideoId: string | null;
}

export interface GalleryMediaItemsPublicListResponseDto {
  items: GalleryMediaItemPublicDto[];
}

const API_BASE_URL = process.env.API_BASE_URL ?? "";
const REVALIDATE_SECONDS = 60;
const FETCH_TIMEOUT_MS = 5_000;

function buildGalleryUrl(locale?: string, kind?: GalleryMediaKind): string {
  const search = new URLSearchParams();
  const apiLocale = toApiLocale(locale);
  if (apiLocale) search.set("locale", apiLocale);
  if (kind) search.set("kind", kind);

  const query = search.toString();
  return `${API_BASE_URL}/api/gallery${query ? `?${query}` : ""}`;
}

export async function getGalleryItems(
  locale?: string,
  kind?: GalleryMediaKind,
): Promise<GalleryMediaItemPublicDto[]> {
  if (!API_BASE_URL) return [];

  try {
    const res = await fetch(buildGalleryUrl(locale, kind), {
      next: {
        revalidate: REVALIDATE_SECONDS,
        tags: [
          "landing-gallery",
          `landing-gallery:${localeCacheKey(locale)}`,
        ],
      },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (!res.ok) return [];

    const data = (await res.json()) as GalleryMediaItemsPublicListResponseDto;
    return Array.isArray(data.items) ? data.items : [];
  } catch {
    return [];
  }
}
