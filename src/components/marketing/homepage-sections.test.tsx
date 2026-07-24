// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { IndustrySection } from "./IndustrySection";
import { Operations } from "./Operations";
import { OPERATIONS_SLIDES } from "@/lib/utils";

vi.mock("next-intl/server", () => ({
  getLocale: async (): Promise<string> => "pt-BR",
  getTranslations: async () => (key: string) => key,
}));

vi.mock("@/components/marketing/ServiceVideoPlayer", () => ({
  ServiceVideoPlayer: () => <div data-testid="industry-player" />,
}));

vi.mock("./BentoCarousel", () => ({
  BentoCarousel: ({
    slides,
  }: {
    slides: Array<{ images: Array<{ src: string }> }>;
  }) => (
    <div data-testid="bento-carousel">
      {slides.flatMap((slide, slideIndex) =>
        slide.images.map((image, imageIndex) => (
          <div
            key={`${slideIndex}-${imageIndex}`}
            data-testid="operations-image"
            data-src={image.src}
          />
        )),
      )}
    </div>
  ),
}));

const industrySection = {
  titlePrefix: "Tessa na",
  title: "indústria brasileira",
  subtitle: "Conteúdo publicado pelo CMS",
  videos: {
    "pt-BR": {
      url: "https://youtu.be/EeLYcZsdYrw",
      startSeconds: 8,
    },
  },
};

describe("homepage section isolation", () => {
  afterEach(cleanup);

  it("keeps a valid Industry section when the Operations gallery payload is invalid", async () => {
    render(
      <>
        {await IndustrySection({ industrySection })}
        {await Operations({ operationSection: { images: [] } })}
      </>,
    );

    expect(screen.getByText("Conteúdo publicado pelo CMS")).toBeInTheDocument();
    expect(screen.getByTestId("industry-player")).toBeInTheDocument();
    expect(screen.getAllByTestId("operations-image")).toHaveLength(8);
    expect(screen.getAllByTestId("operations-image")[0]).toHaveAttribute(
      "data-src",
      OPERATIONS_SLIDES[0].images[0].src,
    );
  });
});
