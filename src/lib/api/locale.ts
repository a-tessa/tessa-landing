export type ApiLocale = "en" | "es";

/**
 * Maps a next-intl locale to the API translation locale.
 * pt-BR (the source language) and unknown values return `undefined`, so the API
 * serves the canonical Portuguese content.
 */
export function toApiLocale(locale?: string | null): ApiLocale | undefined {
  if (!locale) {
    return undefined;
  }

  const value = locale.trim().toLowerCase();

  if (value === "en" || value.startsWith("en-")) {
    return "en";
  }
  if (value === "es" || value.startsWith("es-")) {
    return "es";
  }

  return undefined;
}

/** Cache-tag suffix for a locale (keeps a stable label for pt-BR). */
export function localeCacheKey(locale?: string | null): string {
  return toApiLocale(locale) ?? "pt-BR";
}
