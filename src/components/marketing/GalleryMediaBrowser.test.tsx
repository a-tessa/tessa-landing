// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { GalleryMediaItemPublicDto } from "@/lib/api/gallery";
import { GalleryMediaBrowser } from "./GalleryMediaBrowser";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("next/image", () => ({
  default: ({
    alt,
    src,
  }: {
    alt: string;
    src: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} />
  ),
}));

afterEach(cleanup);

function photo(
  id: string,
  alt: string,
): GalleryMediaItemPublicDto {
  return {
    id,
    kind: "photo",
    alt,
    caption: null,
    categorySlug: null,
    order: 0,
    imageUrl: `https://example.com/${id}.jpg`,
    youtubeUrl: null,
    youtubeVideoId: null,
  };
}

describe("GalleryMediaBrowser lightbox", () => {
  it("navega entre as fotos com as setas", () => {
    HTMLElement.prototype.hasPointerCapture = () => false;
    HTMLElement.prototype.setPointerCapture = () => undefined;
    HTMLElement.prototype.releasePointerCapture = () => undefined;

    render(
      <GalleryMediaBrowser
        photos={[photo("1", "Foto um"), photo("2", "Foto dois"), photo("3", "Foto três")]}
        videos={[]}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Foto um" }));

    expect(screen.getByRole("img", { name: "Foto um" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "prevPhoto" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "nextPhoto" }));
    expect(screen.getByRole("img", { name: "Foto dois" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "nextPhoto" }));
    expect(screen.getByRole("img", { name: "Foto três" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "nextPhoto" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "prevPhoto" }));
    expect(screen.getByRole("img", { name: "Foto dois" })).toBeInTheDocument();
  });
});
