import { describe, expect, it } from "vitest";
import type { GalleryMediaItemPublicDto } from "@/lib/api/gallery";
import { filterGalleryItemsByCategory, splitGalleryItemsByKind } from "./filter";

function item(
  overrides: Partial<GalleryMediaItemPublicDto>,
): GalleryMediaItemPublicDto {
  return {
    id: "1",
    kind: "photo",
    alt: "Alt",
    caption: null,
    categorySlug: null,
    order: 0,
    imageUrl: "https://cdn.example.com/a.webp",
    youtubeUrl: null,
    youtubeVideoId: null,
    ...overrides,
  };
}

describe("gallery filter helpers", () => {
  it("keeps uncategorized items only in the Todos view", () => {
    const items = [
      item({ id: "a", categorySlug: null }),
      item({ id: "b", categorySlug: "carport" }),
    ];

    expect(filterGalleryItemsByCategory(items, "").map((entry) => entry.id)).toEqual([
      "a",
      "b",
    ]);
    expect(
      filterGalleryItemsByCategory(items, "carport").map((entry) => entry.id),
    ).toEqual(["b"]);
  });

  it("splits photos and videos preserving order", () => {
    const items = [
      item({ id: "p1", kind: "photo", order: 0 }),
      item({
        id: "v1",
        kind: "video",
        order: 0,
        imageUrl: null,
        youtubeUrl: "https://www.youtube.com/watch?v=EeLYcZsdYrw",
        youtubeVideoId: "EeLYcZsdYrw",
      }),
      item({ id: "p2", kind: "photo", order: 1 }),
    ];

    const { photos, videos } = splitGalleryItemsByKind(items);
    expect(photos.map((entry) => entry.id)).toEqual(["p1", "p2"]);
    expect(videos.map((entry) => entry.id)).toEqual(["v1"]);
  });
});
