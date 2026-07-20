import { localeCacheKey, toApiLocale } from "./locale";

export interface DocumentPublicDto {
  id: string;
  title: string;
  description: string | null;
  categorySlug: string;
  order: number;
  coverImageUrl: string | null;
  file: {
    url: string;
    originalFilename: string | null;
    sizeBytes: number;
  };
}

export interface DocumentsPublicListResponseDto {
  documents: DocumentPublicDto[];
}

const API_BASE_URL = process.env.API_BASE_URL ?? "";
const REVALIDATE_SECONDS = 60;
const FETCH_TIMEOUT_MS = 5_000;

function buildDocumentsUrl(locale?: string, categorySlug?: string): string {
  const search = new URLSearchParams();
  const apiLocale = toApiLocale(locale);
  if (apiLocale) search.set("locale", apiLocale);
  if (categorySlug) search.set("categorySlug", categorySlug);

  const query = search.toString();
  return `${API_BASE_URL}/api/documents${query ? `?${query}` : ""}`;
}

export async function getDocuments(
  locale?: string,
  categorySlug?: string,
): Promise<DocumentPublicDto[]> {
  if (!API_BASE_URL) return [];

  try {
    const res = await fetch(buildDocumentsUrl(locale, categorySlug), {
      next: {
        revalidate: REVALIDATE_SECONDS,
        tags: [
          "landing-documents",
          `landing-documents:${localeCacheKey(locale)}`,
        ],
      },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (!res.ok) return [];

    const data = (await res.json()) as DocumentsPublicListResponseDto;
    return Array.isArray(data.documents) ? data.documents : [];
  } catch {
    return [];
  }
}
