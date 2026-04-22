import type {
  BlogArticleDto,
  BlogArticleListItemDto,
  BlogArticleResponseDto,
  BlogArticlesListResponseDto,
  FetchBlogArticlesParams,
} from "./blog.types";

const API_BASE_URL = process.env.API_BASE_URL ?? "";
const REVALIDATE_SECONDS = 60;
const FETCH_TIMEOUT_MS = 5_000;

function buildBlogListUrl(params: FetchBlogArticlesParams): string {
  const search = new URLSearchParams();

  search.set("page", String(params.page ?? 1));
  search.set("perPage", String(params.perPage ?? 20));
  if (params.categorySlug) search.set("categorySlug", params.categorySlug);
  if (params.q) search.set("q", params.q);
  if (params.order) search.set("order", params.order);

  return `${API_BASE_URL}/api/blog?${search.toString()}`;
}

export async function fetchBlogArticles(
  params: FetchBlogArticlesParams = {},
): Promise<BlogArticlesListResponseDto | null> {
  if (!API_BASE_URL) return null;

  try {
    const res = await fetch(buildBlogListUrl(params), {
      next: { revalidate: REVALIDATE_SECONDS, tags: ["landing-blog"] },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (!res.ok) return null;

    return (await res.json()) as BlogArticlesListResponseDto;
  } catch {
    return null;
  }
}

export async function fetchBlogArticleBySlug(
  slug: string,
): Promise<BlogArticleDto | null> {
  if (!API_BASE_URL) return null;

  const url = `${API_BASE_URL}/api/blog/${encodeURIComponent(slug)}`;

  try {
    const res = await fetch(url, {
      next: {
        revalidate: REVALIDATE_SECONDS,
        tags: ["landing-blog", `landing-blog:${slug}`],
      },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (!res.ok) return null;

    const data = (await res.json()) as BlogArticleResponseDto;
    return data.article;
  } catch {
    return null;
  }
}

export async function fetchRelatedBlogArticles(
  categorySlug: string,
  excludeSlug: string,
  limit = 2,
): Promise<BlogArticleListItemDto[]> {
  const resp = await fetchBlogArticles({
    page: 1,
    perPage: limit + 1,
    categorySlug,
    order: "desc",
  });

  if (!resp) return [];

  return resp.articles
    .filter((article) => article.slug !== excludeSlug)
    .slice(0, limit);
}
