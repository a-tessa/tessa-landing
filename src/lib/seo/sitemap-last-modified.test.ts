import { describe, expect, it } from "vitest";
import { resolveSitemapLastModified } from "./sitemap-last-modified";

describe("resolveSitemapLastModified", () => {
  it("prefers the page updatedAt over the site publishedAt", () => {
    expect(
      resolveSitemapLastModified(
        "2026-08-20T15:30:00.000Z",
        "2026-01-01T00:00:00.000Z",
      ),
    ).toEqual(new Date("2026-08-20T15:30:00.000Z"));
  });

  it("falls back to the site publishedAt when the page has no date", () => {
    expect(
      resolveSitemapLastModified(undefined, "2026-01-01T00:00:00.000Z"),
    ).toEqual(new Date("2026-01-01T00:00:00.000Z"));
  });

  it("returns undefined when no candidate is a valid date", () => {
    expect(resolveSitemapLastModified(undefined, null, "")).toBeUndefined();
    expect(resolveSitemapLastModified("not-a-date")).toBeUndefined();
  });
});
