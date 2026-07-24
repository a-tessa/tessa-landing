import type { GalleryMediaItemPublicDto } from "@/lib/api/gallery";

export function filterGalleryItemsByCategory(
  items: GalleryMediaItemPublicDto[],
  categoria: string,
): GalleryMediaItemPublicDto[] {
  const slug = categoria.trim();
  if (!slug) {
    return items;
  }

  return items.filter((item) => item.categorySlug === slug);
}

export function splitGalleryItemsByKind(items: GalleryMediaItemPublicDto[]) {
  return {
    photos: items.filter((item) => item.kind === "photo"),
    videos: items.filter((item) => item.kind === "video"),
  };
}
