import { describe, expect, it } from "vitest";
import { buildGalleryListHref } from "./href";

describe("buildGalleryListHref", () => {
  it("returns the base gallery path without a category", () => {
    expect(buildGalleryListHref({})).toBe("/galeria");
  });

  it("includes the categoria query when provided", () => {
    expect(buildGalleryListHref({ categoria: "carport" })).toBe(
      "/galeria?categoria=carport",
    );
  });
});
