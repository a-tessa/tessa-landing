export function buildGalleryListHref(parts: {
  categoria?: string;
}): string {
  const params = new URLSearchParams();
  if (parts.categoria?.trim()) {
    params.set("categoria", parts.categoria.trim());
  }
  const query = params.toString();
  return query ? `/galeria?${query}` : "/galeria";
}
