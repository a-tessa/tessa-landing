export type BlogArticleStatus = "draft" | "published";

export interface BlogArticleAuthorDto {
  id: string;
  name: string;
}

export interface BlogArticleListItemDto {
  id: string;
  title: string;
  slug: string;
  content: string;
  categorySlug: string;
  headerImageUrl: string | null;
  headerImageAlt: string | null;
  status: BlogArticleStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author: BlogArticleAuthorDto;
}

export type BlogArticleDto = BlogArticleListItemDto;

export interface PaginationMetaDto {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface BlogArticlesListResponseDto {
  articles: BlogArticleListItemDto[];
  pagination: PaginationMetaDto;
}

export interface BlogArticleResponseDto {
  article: BlogArticleDto;
}

export interface FetchBlogArticlesParams {
  page?: number;
  perPage?: number;
  categorySlug?: string;
  q?: string;
  order?: "asc" | "desc";
}
