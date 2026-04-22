import type {
  BlogArticleDto,
  BlogArticleListItemDto,
} from "@/lib/api/blog.types";
import type { BlogCategorySlug, BlogPost } from "@/lib/blog/posts";

const FALLBACK_IMAGE_SRC =
  "/choose-scenary-section/estruturas-metalicas-para-telhado.webp";

export function stripHtmlToText(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildExcerpt(html: string, maxChars = 220): string {
  const text = stripHtmlToText(html);
  if (text.length <= maxChars) return text;

  const sliced = text.slice(0, maxChars);
  const lastSpace = sliced.lastIndexOf(" ");
  const base = lastSpace > maxChars * 0.6 ? sliced.slice(0, lastSpace) : sliced;
  return `${base.trim().replace(/[.,;:!?-]+$/u, "")}...`;
}

export function buildInitials(name: string): string {
  const tokens = name
    .trim()
    .split(/\s+/)
    .filter((t) => t.length > 0);

  if (tokens.length === 0) return "?";
  if (tokens.length === 1) return tokens[0]!.slice(0, 2).toUpperCase();

  const first = tokens[0]!;
  const last = tokens[tokens.length - 1]!;
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}

function toPublishedDate(dto: BlogArticleListItemDto): string {
  return dto.publishedAt ?? dto.updatedAt ?? dto.createdAt;
}

function toImageSrc(dto: BlogArticleListItemDto): string {
  return dto.headerImageUrl ?? FALLBACK_IMAGE_SRC;
}

function toImageAlt(dto: BlogArticleListItemDto): string {
  return dto.headerImageAlt ?? dto.title;
}

export function toBlogPostFromListItem(dto: BlogArticleListItemDto): BlogPost {
  const excerpt = buildExcerpt(dto.content ?? "", 220);

  return {
    slug: dto.slug,
    title: dto.title,
    excerpt,
    description: excerpt,
    body: [],
    publishedAt: toPublishedDate(dto),
    author: {
      name: dto.author.name,
      initials: buildInitials(dto.author.name),
    },
    imageSrc: toImageSrc(dto),
    imageAlt: toImageAlt(dto),
    category: dto.categorySlug as BlogCategorySlug,
  };
}

export function toBlogPostFromArticle(dto: BlogArticleDto): BlogPost {
  return {
    ...toBlogPostFromListItem(dto),
    contentHtml: dto.content,
  };
}
