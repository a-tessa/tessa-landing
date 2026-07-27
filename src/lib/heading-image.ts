/**
 * Resolves the first non-empty Heading image URL from a fallback chain.
 * Returns null so the shared Heading can keep its gray background.
 */
export function resolveHeadingImageUrl(
  ...candidates: Array<string | null | undefined>
): string | null {
  for (const candidate of candidates) {
    const trimmed = candidate?.trim();
    if (trimmed) return trimmed;
  }
  return null;
}
