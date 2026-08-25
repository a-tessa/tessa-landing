export interface PublicRedirect {
  fromPath: string;
  toPath: string;
  statusCode: number;
}

export interface PublicRedirectsResponse {
  redirects: PublicRedirect[];
}

const API_BASE_URL = process.env.API_BASE_URL ?? "";
const REVALIDATE_SECONDS = 60;
const FETCH_TIMEOUT_MS = 5_000;

export async function fetchRedirects(): Promise<PublicRedirect[]> {
  if (!API_BASE_URL) return [];

  try {
    const res = await fetch(`${API_BASE_URL}/api/redirects/public`, {
      next: {
        revalidate: REVALIDATE_SECONDS,
        tags: ["landing-redirects"],
      },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (!res.ok) return [];

    const payload = (await res.json()) as PublicRedirectsResponse;
    return Array.isArray(payload.redirects) ? payload.redirects : [];
  } catch {
    return [];
  }
}
