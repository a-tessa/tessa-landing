// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { IndustrySection } from "./IndustrySection";

const localeState = vi.hoisted(() => ({
  value: "pt-BR",
}));

const staticMessages = {
  "pt-BR": {
    titlePrefix: "A força da",
    title: "indústria",
    description: "Conteúdo estático em português",
    videoPlayLabel: "Reproduzir vídeo",
    videoCaption: "Vídeo institucional",
  },
  en: {
    titlePrefix: "The strength of",
    title: "industry",
    description: "Static English content",
    videoPlayLabel: "Play video",
    videoCaption: "Institutional video",
  },
  es: {
    titlePrefix: "La fuerza de",
    title: "la industria",
    description: "Contenido estático en español",
    videoPlayLabel: "Reproducir video",
    videoCaption: "Video institucional",
  },
} as const;

vi.mock("next-intl/server", () => ({
  getLocale: async (): Promise<string> => localeState.value,
  getTranslations:
    async (): Promise<(key: keyof (typeof staticMessages)["pt-BR"]) => string> =>
    (key): string =>
      staticMessages[localeState.value as keyof typeof staticMessages][key],
}));

vi.mock("@/components/marketing/ServiceVideoPlayer", () => ({
  ServiceVideoPlayer: ({
    videoUrl,
    startSeconds,
  }: {
    videoUrl: string;
    startSeconds?: number;
  }) => (
    <div
      data-testid="industry-player"
      data-video-url={videoUrl}
      data-start-seconds={startSeconds}
    />
  ),
}));

const cmsSection = {
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

describe("public IndustrySection", () => {
  beforeEach(() => {
    localeState.value = "pt-BR";
  });

  afterEach(cleanup);

  it("renders valid published Portuguese content and player settings", async () => {
    render(await IndustrySection({ industrySection: cmsSection }));

    expect(screen.getByText("Tessa na")).toBeInTheDocument();
    expect(screen.getByText("indústria brasileira")).toBeInTheDocument();
    expect(screen.getByText("Conteúdo publicado pelo CMS")).toBeInTheDocument();
    expect(screen.getByTestId("industry-player")).toHaveAttribute(
      "data-video-url",
      cmsSection.videos["pt-BR"].url,
    );
    expect(screen.getByTestId("industry-player")).toHaveAttribute(
      "data-start-seconds",
      "8",
    );
  });

  it("renders the current static content when CMS data is unavailable", async () => {
    render(await IndustrySection({}));

    expect(screen.getByText("indústria")).toBeInTheDocument();
    expect(
      screen.getByText("Conteúdo estático em português"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("industry-player")).toHaveAttribute(
      "data-video-url",
      "https://www.youtube.com/watch?v=EeLYcZsdYrw",
    );
  });

  it("keeps English and Spanish on their current static content", async () => {
    localeState.value = "es";
    render(await IndustrySection({ industrySection: cmsSection }));

    expect(screen.queryByText("Conteúdo publicado pelo CMS")).not.toBeInTheDocument();
    expect(screen.getByText("Contenido estático en español")).toBeInTheDocument();
    expect(screen.getByTestId("industry-player")).toHaveAttribute(
      "data-video-url",
      "https://www.youtube.com/watch?v=eGdFPCZYNYQ",
    );
    expect(screen.getByTestId("industry-player")).toHaveAttribute(
      "data-start-seconds",
      "6",
    );
  });
});
