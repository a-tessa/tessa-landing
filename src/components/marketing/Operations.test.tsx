// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Operations } from "./Operations";
import type { BentoSlide } from "./BentoCarousel";
import { OPERATIONS_SLIDES } from "@/lib/utils";

const slidesState = vi.hoisted(() => ({
  value: null as BentoSlide[] | null,
}));

vi.mock("next-intl/server", () => ({
  getTranslations: async () => (key: string) => key,
}));

vi.mock("./BentoCarousel", () => ({
  BentoCarousel: ({ slides }: { slides: BentoSlide[] }) => {
    slidesState.value = slides;
    return (
      <div data-testid="bento-carousel">
        {slides.flatMap((slide, slideIndex) =>
          slide.images.map((image, imageIndex) => (
            <div
              key={`${slideIndex}-${imageIndex}`}
              data-testid="operations-image"
              data-src={image.src}
              data-alt={image.alt}
              data-caption={image.caption ?? ""}
              data-caption-key={image.captionKey ?? ""}
            />
          )),
        )}
      </div>
    );
  },
}));

function makeCmsSection(count: number) {
  return {
    images: Array.from({ length: count }, (_, index) => ({
      url: `https://cdn.example.com/operations/image-${index}.webp`,
      alt: `Alt CMS ${index}`,
      ...(index % 2 === 0 ? { caption: `Caption CMS ${index}` } : {}),
    })),
  };
}

describe("public Operations", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(null, { status: 200 })),
    );
  });

  afterEach(() => {
    cleanup();
    slidesState.value = null;
    vi.unstubAllGlobals();
  });

  it("renders published CMS images in order, grouped for the bento carousel", async () => {
    const section = makeCmsSection(6);
    render(await Operations({ operationSection: section }));

    expect(screen.getByTestId("bento-carousel")).toBeInTheDocument();
    const images = screen.getAllByTestId("operations-image");
    expect(images).toHaveLength(6);
    expect(images[0]).toHaveAttribute("data-src", section.images[0].url);
    expect(images[0]).toHaveAttribute("data-alt", "Alt CMS 0");
    expect(images[0]).toHaveAttribute("data-caption", "Caption CMS 0");
    expect(images[1]).toHaveAttribute("data-caption", "");
    expect(slidesState.value).toHaveLength(2);
    expect(slidesState.value?.[0]?.images).toHaveLength(4);
    expect(slidesState.value?.[1]?.images).toHaveLength(2);
  });

  it("falls back to the static eight-image gallery when CMS content is unavailable", async () => {
    render(await Operations({}));

    const images = screen.getAllByTestId("operations-image");
    expect(images).toHaveLength(8);
    expect(images[0]).toHaveAttribute(
      "data-src",
      OPERATIONS_SLIDES[0].images[0].src,
    );
    expect(images[0]).toHaveAttribute(
      "data-caption-key",
      OPERATIONS_SLIDES[0].images[0].captionKey,
    );
  });

  it("falls back to static content when published CMS images are unreachable", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        const status = url.includes("image-0.webp") ? 200 : 404;
        return new Response(null, { status });
      }),
    );

    render(await Operations({ operationSection: makeCmsSection(6) }));

    const images = screen.getAllByTestId("operations-image");
    expect(images).toHaveLength(8);
    expect(images[0]).toHaveAttribute(
      "data-src",
      OPERATIONS_SLIDES[0].images[0].src,
    );
  });

  it("falls back to static content when the CMS gallery is invalid", async () => {
    render(
      await Operations({
        operationSection: makeCmsSection(3),
      }),
    );

    expect(screen.getAllByTestId("operations-image")).toHaveLength(8);
  });
});
