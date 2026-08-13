import { describe, expect, it } from "vitest";
import {
  groupOperationSlides,
  keepReachableOperationImages,
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

  it("drops unreachable remote images and keeps the gallery when six or more remain", async () => {
    const images = makeSection(8).images.map((image) => ({
      src: image.url,
      alt: image.alt,
    }));
    const unreachable = new Set([images[2]?.src, images[3]?.src]);

    await expect(
      keepReachableOperationImages(images, async (src) => !unreachable.has(src)),
    ).resolves.toEqual([
      images[0],
      images[1],
      images[4],
      images[5],
      images[6],
      images[7],
    ]);
  });

  it("returns null when too few remote images are reachable so the static gallery can activate", async () => {
    const images = makeSection(6).images.map((image) => ({
      src: image.url,
      alt: image.alt,
    }));

    await expect(
      keepReachableOperationImages(images, async (src) => src.endsWith("image-0.webp")),
    ).resolves.toBeNull();
  });

  it("keeps local gallery assets without probing them", async () => {
    const images = Array.from({ length: 6 }, (_, index) => ({
      src: `/operations-gallery/galeria_tessa_0${String(index + 1)}.webp`,
      alt: `Alt ${index}`,
    }));
    const probe = async () => {
      throw new Error("local assets must not be probed");
    };

    await expect(keepReachableOperationImages(images, probe)).resolves.toEqual(
      images,
    );
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
