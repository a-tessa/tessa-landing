import { describe, expect, it } from "vitest";
import {
  getStaticServiceCardImage,
  STATIC_SERVICE_CARD_IMAGES,
  STATIC_SERVICE_SLUGS,
} from "./static-pages";

describe("static service share images", () => {
  it("defines a unique card image for every fixed service", () => {
    const urls = STATIC_SERVICE_SLUGS.map((slug) => getStaticServiceCardImage(slug));

    expect(urls.every((url) => url.startsWith("/"))).toBe(true);
    expect(new Set(urls).size).toBe(STATIC_SERVICE_SLUGS.length);
    expect(Object.keys(STATIC_SERVICE_CARD_IMAGES)).toEqual(
      expect.arrayContaining([...STATIC_SERVICE_SLUGS]),
    );
  });
});
