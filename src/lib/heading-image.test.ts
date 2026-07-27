import { describe, expect, it } from "vitest";
import { resolveHeadingImageUrl } from "./heading-image";

describe("resolveHeadingImageUrl", () => {
  it("prefers the item image, then the parent page, then gray (null)", () => {
    expect(
      resolveHeadingImageUrl(
        "https://cdn.example.com/article.webp",
        "https://cdn.example.com/blog.webp",
      ),
    ).toBe("https://cdn.example.com/article.webp");

    expect(
      resolveHeadingImageUrl(null, "https://cdn.example.com/blog.webp"),
    ).toBe("https://cdn.example.com/blog.webp");

    expect(resolveHeadingImageUrl("   ", null, undefined)).toBeNull();
  });
});
