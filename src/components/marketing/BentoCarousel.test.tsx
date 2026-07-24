// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BentoCarousel } from "./BentoCarousel";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("next/image", () => ({
  default: ({
    alt,
    ...props
  }: {
    alt: string;
    src: string;
    fill?: boolean;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={props.src} data-testid="bento-image" />
  ),
}));

vi.mock("motion/react", () => ({
  motion: {
    button: ({
      children,
      ...props
    }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
      children?: React.ReactNode;
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

    // Alt may appear in the visually-hidden dialog title, but never as visible caption copy.
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
