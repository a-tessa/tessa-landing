// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { OperationsGalleryImage } from "./OperationsGalleryImage";

vi.mock("next/image", () => ({
  default: ({
    alt,
    onLoad,
    onError,
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
    onLoad?: () => void;
    onError?: () => void;
    className?: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      src={props.src}
      data-testid="gallery-img"
      data-loading={loading}
      data-priority={priority ? "true" : "false"}
      data-fetch-priority={fetchPriority}
      data-sizes={sizes}
      className={props.className}
      onLoad={onLoad}
      onError={onError}
    />
  ),
}));

afterEach(cleanup);

describe("OperationsGalleryImage", () => {
  it("keeps a stable skeleton while loading and reveals the image without layout shift", () => {
    render(
      <div className="relative aspect-4/3 h-40 w-40">
        <OperationsGalleryImage
          src="/operations-gallery/galeria_tessa_01.webp"
          alt="Estrutura metálica"
          sizes="90vw"
          loading="eager"
          errorLabel="Falha ao carregar imagem"
        />
      </div>,
    );

    const skeleton = screen.getByTestId("operations-image-skeleton");
    const image = screen.getByTestId("gallery-img");

    expect(skeleton).toHaveClass("animate-pulse");
    expect(image).toHaveClass("opacity-0");
    expect(image).toHaveAttribute("data-loading", "eager");
    expect(image).toHaveAttribute("data-fetch-priority", "low");

    fireEvent.load(image);

    expect(skeleton).toHaveClass("opacity-0");
    expect(image).toHaveClass("opacity-100");
  });

  it("swaps the skeleton for an accessible error placeholder on failure", () => {
    render(
      <div className="relative h-40 w-40">
        <OperationsGalleryImage
          src="/broken.webp"
          alt="Imagem indisponível"
          sizes="90vw"
          loading="lazy"
          errorLabel="Não foi possível carregar a imagem"
        />
      </div>,
    );

    fireEvent.error(screen.getByTestId("gallery-img"));

    expect(screen.queryByTestId("gallery-img")).not.toBeInTheDocument();
    expect(screen.getByTestId("operations-image-error")).toHaveAttribute(
      "aria-label",
      "Não foi possível carregar a imagem",
    );
    expect(screen.getByText("Imagem indisponível")).toBeInTheDocument();
  });

  it("omits loading when priority preload is requested", () => {
    render(
      <div className="relative h-40 w-40">
        <OperationsGalleryImage
          src="/operations-gallery/galeria_tessa_01.webp"
          alt="Prioritária"
          sizes="90vw"
          loading="eager"
          priority
          errorLabel="erro"
        />
      </div>,
    );

    const image = screen.getByTestId("gallery-img");
    expect(image).toHaveAttribute("data-priority", "true");
    expect(image).toHaveAttribute("data-fetch-priority", "high");
    expect(image).not.toHaveAttribute("data-loading");
  });
});
