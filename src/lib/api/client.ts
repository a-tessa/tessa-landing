type FetchOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

/**
 * Thin wrapper around fetch.
 * Prefer calling from Server Components for SEO/perf (when possible).
 */
export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  const url = path.startsWith("http") ? path : `${base}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API error ${res.status}: ${text}`);
  }

  return (await res.json()) as T;
}
