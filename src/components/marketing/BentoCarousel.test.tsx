// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BentoCarousel } from "./BentoCarousel";

vi.mock("next-intl", () => ({
  useTranslations: () => {
    const t = (key: string, values?: { count?: number; number?: number }) => {
      if (key === "gallerySummary") {
        return `Galeria de operações com ${String(values?.count ?? 0)} imagens.`;
      }
      if (key === "goToImage") {
        return `Ir para imagem ${String(values?.number ?? 0)}`;
      }
      return key;
    };
    return t;
  },
}));

vi.mock("next/image", () => ({
  default: ({
    alt,
    loading,
    priority,
    fetchPriority,
    sizes,
    ...props
  }: {
    alt: string;
    src: string;
    fill?: boolean;
    loading?: string;
    priority?: boolean;
    fetchPriority?: "high" | "low" | "auto";
    sizes?: string;
    className?: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      src={props.src}
      data-testid="bento-image"
      data-loading={loading}
      data-priority={priority ? "true" : "false"}
      data-fetch-priority={fetchPriority}
      data-sizes={sizes}
      className={props.className}
    />
  ),
}));

vi.mock("motion/react", () => ({
  motion: {
    button: ({
      children,
      ...props
    }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
      children?: React.ReactNode;
      "data-gallery-flat-index"?: number;
    }) => <button {...props}>{children}</button>,
    div: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & {
      children?: React.ReactNode;
    }) => <div {...props}>{children}</div>,
  },
}));

afterEach(cleanup);

function makeSlides(count: number) {
  const images = Array.from({ length: count }, (_, index) => ({
    src: `/operations-gallery/img-${String(index)}.webp`,
    alt: `Alt ${String(index)}`,
    caption: index === 0 ? "Legenda 0" : undefined,
  }));

  const slides = [];
  for (let index = 0; index < images.length; index += 4) {
    slides.push({ images: images.slice(index, index + 4) });
  }
  return slides;
}

describe("BentoCarousel captions", () => {
  it("hides the caption panel when a CMS image has no caption and never shows alt as caption text", () => {
    const alt = "Texto alternativo que não deve aparecer como legenda";
    render(
      <BentoCarousel
        slides={[
          {
            images: [
              {
                src: "/operations-gallery/galeria_tessa_01.webp",
                alt,
              },
            ],
          },
        ]}
      />,
    );

    fireEvent.click(screen.getAllByLabelText("expandImage")[0]!);

    expect(screen.queryByText(alt, { selector: "p" })).not.toBeInTheDocument();
  });

  it("shows the caption panel when a CMS caption is present", () => {
    render(
      <BentoCarousel
        slides={[
          {
            images: [
              {
                src: "/operations-gallery/galeria_tessa_01.webp",
                alt: "Alt da imagem",
                caption: "Legenda visível do CMS",
              },
            ],
          },
        ]}
      />,
    );

    fireEvent.click(screen.getAllByLabelText("expandImage")[0]!);

    expect(
      screen.getByText("Legenda visível do CMS", { selector: "p" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Alt da imagem", { selector: "p" }),
    ).not.toBeInTheDocument();
  });
});

describe("BentoCarousel lazy loading", () => {
  it("renders every image in the initial DOM with eager first six and a single priority preload", () => {
    render(<BentoCarousel slides={makeSlides(8)} />);

    expect(
      screen.getByText("Galeria de operações com 8 imagens."),
    ).toHaveClass("sr-only");

    const mobileThumbs = document.querySelectorAll(
      ".md\\:hidden [data-gallery-flat-index]",
    );
    expect(mobileThumbs).toHaveLength(8);

    for (let index = 0; index < 8; index += 1) {
      const thumb = document.querySelector(
        `.md\\:hidden [data-gallery-flat-index="${String(index)}"]`,
      );
      expect(thumb).not.toBeNull();
      const image = within(thumb as HTMLElement).getByTestId("bento-image");
      expect(image).toHaveAttribute("alt", `Alt ${String(index)}`);
      expect(image).toHaveAttribute("data-sizes", "90vw");
      expect(image).toHaveAttribute("data-priority", "false");

      if (index < 6) {
        expect(image).toHaveAttribute("data-loading", "eager");
        expect(image).toHaveAttribute("data-fetch-priority", "low");
      } else {
        expect(image).toHaveAttribute("data-loading", "lazy");
        expect(image).not.toHaveAttribute("data-fetch-priority");
      }
    }

    const desktopFirst = document.querySelector(
      `.hidden.md\\:block [data-gallery-flat-index="0"]`,
    );
    expect(desktopFirst).not.toBeNull();
    const desktopFirstImage = within(
      desktopFirst as HTMLElement,
    ).getByTestId("bento-image");
    expect(desktopFirstImage).toHaveAttribute("data-priority", "true");
    expect(desktopFirstImage).toHaveAttribute("data-fetch-priority", "high");
    expect(desktopFirstImage).not.toHaveAttribute("data-loading");

    const desktopSeventh = document.querySelector(
      `.hidden.md\\:block [data-gallery-flat-index="6"]`,
    );
    expect(desktopSeventh).not.toBeNull();
    expect(
      within(desktopSeventh as HTMLElement).getByTestId("bento-image"),
    ).toHaveAttribute("data-loading", "lazy");
  });

  it("keeps desktop expansion operable by keyboard", () => {
    render(<BentoCarousel slides={makeSlides(6)} />);

    const firstDesktop = document.querySelector<HTMLButtonElement>(
      `.hidden.md\\:block [data-gallery-flat-index="0"]`,
    );
    expect(firstDesktop).not.toBeNull();

    expect(firstDesktop).toHaveAttribute("type", "button");
    fireEvent.click(firstDesktop!);
    expect(screen.getByRole("button", { name: "collapseImage" })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });
    expect(
      screen.queryByRole("button", { name: "collapseImage" }),
    ).not.toBeInTheDocument();
  });

  it("keeps stable aspect boxes so skeletons do not introduce layout shift", () => {
    render(<BentoCarousel slides={makeSlides(6)} />);

    const firstMobile = document.querySelector(
      '.md\\:hidden [data-gallery-flat-index="0"]',
    );
    expect(firstMobile).toHaveClass("aspect-4/3");
    expect(
      within(firstMobile as HTMLElement).getByTestId(
        "operations-image-skeleton",
      ),
    ).toBeInTheDocument();
  });
});
