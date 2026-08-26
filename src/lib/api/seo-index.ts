import { toApiLocale } from "./locale";
import type {
  BlogArticlesListResponseDto,
  FetchBlogArticlesParams,
} from "./blog.types";
import type { PublicContentResponse, ServicesPageItem } from "./types";

export const SEO_INDEX_CACHE_TAG = "landing-seo-index";
export const SEO_INDEX_REVALIDATE_SECONDS = 3600;
export const SEO_INDEX_REVALIDATE_PATHS = ["/sitemap.xml", "/robots.txt"] as const;

const FETCH_TIMEOUT_MS = 5_000;

function apiBaseUrl(): string {
  return (process.env.API_BASE_URL ?? "").replace(/\/+$/, "");
}

function seoIndexFetchInit() {
  return {
    next: {
      revalidate: SEO_INDEX_REVALIDATE_SECONDS,
      tags: [SEO_INDEX_CACHE_TAG],
    },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  };
}

function withSeoIndexMarker(url: URL): string {
  url.searchParams.set("for", "seo-index");
  return url.toString();
}

export async function fetchSeoIndexContent(
  locale?: string,
): Promise<PublicContentResponse | null> {
  const base = apiBaseUrl();
  if (!base) return null;

  const url = new URL("/api/content/public", `${base}/`);
  const apiLocale = toApiLocale(locale);
  if (apiLocale) {
    url.searchParams.set("locale", apiLocale);
  }

  try {
    const res = await fetch(withSeoIndexMarker(url), seoIndexFetchInit());
    if (!res.ok) return null;
    return (await res.json()) as PublicContentResponse;
  } catch {
    return null;
  }
}

export async function fetchSeoIndexBlogArticles(
  params: FetchBlogArticlesParams = {},
): Promise<BlogArticlesListResponseDto | null> {
  const base = apiBaseUrl();
  if (!base) return null;

  const url = new URL("/api/blog", `${base}/`);
  url.searchParams.set("page", String(params.page ?? 1));
  url.searchParams.set("perPage", String(params.perPage ?? 20));
  if (params.categorySlug) url.searchParams.set("categorySlug", params.categorySlug);
  if (params.q) url.searchParams.set("q", params.q);
  if (params.order) url.searchParams.set("order", params.order);

  const apiLocale = toApiLocale(params.locale);
  if (apiLocale) {
    url.searchParams.set("locale", apiLocale);
  }

  try {
    const res = await fetch(withSeoIndexMarker(url), seoIndexFetchInit());
    if (!res.ok) return null;
    return (await res.json()) as BlogArticlesListResponseDto;
  } catch {
    return null;
  }
}

export async function fetchSeoIndexServices(
  locale?: string,
): Promise<{ pages: ServicesPageItem[]; publishedAt: string | null }> {
  const data = await fetchSeoIndexContent(locale);
  const list = data?.content.servicesPages;
  return {
    pages: Array.isArray(list) ? list : [],
    publishedAt: data?.publishedAt ?? null,
  };
}
