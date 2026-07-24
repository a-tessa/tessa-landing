import { localeCacheKey, toApiLocale } from "./locale";
import type {
  FetchInstagramPostsParams,
  InstagramPublicationsListResponseDto,
} from "./instagram.types";

const API_BASE_URL = process.env.API_BASE_URL ?? "";
const REVALIDATE_SECONDS = 60;
const FETCH_TIMEOUT_MS = 5_000;

function buildInstagramListUrl(params: FetchInstagramPostsParams): string {
  const search = new URLSearchParams();
  search.set("limit", String(params.limit ?? 3));

  const apiLocale = toApiLocale(params.locale);
  if (apiLocale) search.set("locale", apiLocale);

  return `${API_BASE_URL}/api/instagram?${search.toString()}`;
}

export async function fetchInstagramPosts(
  params: FetchInstagramPostsParams = {},
): Promise<InstagramPublicationsListResponseDto | null> {
  if (!API_BASE_URL) return null;

  try {
    const res = await fetch(buildInstagramListUrl(params), {
      next: {
        revalidate: REVALIDATE_SECONDS,
        tags: [
          "landing-instagram",
          `landing-instagram:${localeCacheKey(params.locale)}`,
        ],
      },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (!res.ok) return null;

    return (await res.json()) as InstagramPublicationsListResponseDto;
  } catch {
    return null;
  }
}
