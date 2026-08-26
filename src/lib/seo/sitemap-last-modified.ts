export function resolveSitemapLastModified(
  ...candidates: Array<string | Date | null | undefined>
): Date | undefined {
  for (const candidate of candidates) {
    if (candidate == null || candidate === "") {
      continue;
    }

    const date = candidate instanceof Date ? candidate : new Date(candidate);
    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }

  return undefined;
}
