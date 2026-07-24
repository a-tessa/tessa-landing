import { describe, expect, it } from "vitest";
import {
  groupOperationSlides,
  resolveOperationSection,
} from "./operations-content";

function makeImage(index: number, overrides: Record<string, unknown> = {}) {
  return {
    url: `https://cdn.example.com/operations/image-${index}.webp`,
    alt: `Alt ${index}`,
    ...overrides,
  };
}

function makeSection(count: number, overrides: Record<string, unknown> = {}) {
  return {
    images: Array.from({ length: count }, (_, index) =>
      makeImage(index, overrides),
    ),
  };
}

describe("operations content", () => {
  it("resolves a published gallery preserving order and optional captions", () => {
    const section = {
      images: [
        makeImage(0, { caption: "Legenda 0" }),
        makeImage(1),
        makeImage(2, { caption: "Legenda 2" }),
        makeImage(3),
        makeImage(4),
        makeImage(5),
      ],
    };

    expect(resolveOperationSection(section)).toEqual([
      {
        src: section.images[0].url,
        alt: "Alt 0",
        caption: "Legenda 0",
      },
      { src: section.images[1].url, alt: "Alt 1" },
      {
        src: section.images[2].url,
        alt: "Alt 2",
        caption: "Legenda 2",
      },
      { src: section.images[3].url, alt: "Alt 3" },
      { src: section.images[4].url, alt: "Alt 4" },
      { src: section.images[5].url, alt: "Alt 5" },
    ]);
  });

  it("keeps legacy items without alt or caption readable", () => {
    const section = {
      images: Array.from({ length: 6 }, (_, index) => ({
        url: `https://cdn.example.com/legacy-${index}.webp`,
      })),
    };

    expect(resolveOperationSection(section)).toEqual(
      section.images.map((image) => ({
        src: image.url,
        alt: "",
      })),
    );
  });

  it("rejects absent, empty, underfilled, oversized or invalid galleries so static content remains active", () => {
    expect(resolveOperationSection(undefined)).toBeNull();
    expect(resolveOperationSection({ images: [] })).toBeNull();
    expect(resolveOperationSection(makeSection(5))).toBeNull();
    expect(resolveOperationSection(makeSection(41))).toBeNull();
    expect(
      resolveOperationSection({
        images: [
          ...makeSection(5).images,
          { url: " ", alt: "Alt" },
        ],
      }),
    ).toBeNull();
    expect(
      resolveOperationSection(makeSection(6, { alt: "a".repeat(101) })),
    ).toBeNull();
    expect(
      resolveOperationSection(makeSection(6, { caption: "c".repeat(301) })),
    ).toBeNull();
    expect(
      resolveOperationSection(
        makeSection(6, { alt: "Mesmo texto", caption: "Mesmo texto" }),
      ),
    ).toBeNull();
  });

  it("groups images into slides of four and allows a short final group", () => {
    const images = makeSection(10).images.map((image) => ({
      src: image.url,
      alt: image.alt,
    }));

    expect(groupOperationSlides(images)).toEqual([
      { images: images.slice(0, 4) },
      { images: images.slice(4, 8) },
      { images: images.slice(8, 10) },
    ]);
  });

  it("omits empty captions so the caption panel can stay hidden", () => {
    const section = makeSection(6, { caption: "   " });
    const resolved = resolveOperationSection(section);

    expect(resolved?.[0]).toEqual({
      src: section.images[0].url,
      alt: "Alt 0",
    });
    expect(resolved?.[0]).not.toHaveProperty("caption");
  });
});
