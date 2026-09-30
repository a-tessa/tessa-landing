// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BentoCarouselServices } from "./BentoCarouselServices";

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
    className?: string;
    sizes?: string;
    priority?: boolean;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={props.src} className={props.className} />
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

const images = [
  { src: "/servicos/um.webp", alt: "Estrutura um" },
  { src: "/servicos/dois.webp", alt: "Estrutura dois" },
];

describe("BentoCarouselServices", () => {
  it("opens the selected service image larger and moves to the next one", () => {
    render(<BentoCarouselServices images={images} />);

    fireEvent.click(screen.getAllByRole("button", { name: "expandImage" })[0]!);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveTextContent("Estrutura um");
    expect(dialog.querySelector("img")).toHaveAttribute("src", "/servicos/um.webp");
    expect(dialog.querySelector("img")).toHaveClass("object-contain");

    fireEvent.click(screen.getByRole("button", { name: "nextImage" }));

    expect(dialog.querySelector("img")).toHaveAttribute("src", "/servicos/dois.webp");
  });
});
