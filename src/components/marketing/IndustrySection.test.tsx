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

const cmsSectionWithSpanishVideo = {
  titlePrefix: "La fuerza de la",
  title: "industria brasileña",
  subtitle: "Contenido publicado por el CMS",
  videos: {
    "pt-BR": {
      url: "https://youtu.be/EeLYcZsdYrw",
      startSeconds: 8,
    },
    es: {
      url: "https://youtu.be/eGdFPCZYNYQ",
      startSeconds: 3,
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

  it("uses CMS content and the Portuguese video pair for English and Spanish when no locale video is configured", async () => {
    localeState.value = "es";
    render(await IndustrySection({ industrySection: cmsSection }));

    expect(screen.getByText("Tessa na")).toBeInTheDocument();
    expect(screen.getByText("Conteúdo publicado pelo CMS")).toBeInTheDocument();
    expect(
      screen.queryByText("Contenido estático en español"),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("industry-player")).toHaveAttribute(
      "data-video-url",
      cmsSection.videos["pt-BR"].url,
    );
    expect(screen.getByTestId("industry-player")).toHaveAttribute(
      "data-start-seconds",
      "8",
    );
  });

  it("uses CMS content and the Portuguese video pair for English when no locale video is configured", async () => {
    localeState.value = "en";
    render(await IndustrySection({ industrySection: cmsSection }));

    expect(screen.getByText("Tessa na")).toBeInTheDocument();
    expect(screen.getByText("Conteúdo publicado pelo CMS")).toBeInTheDocument();
    expect(
      screen.queryByText("Static English content"),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("industry-player")).toHaveAttribute(
      "data-video-url",
      cmsSection.videos["pt-BR"].url,
    );
    expect(screen.getByTestId("industry-player")).toHaveAttribute(
      "data-start-seconds",
      "8",
    );
  });

  it("uses the Spanish video when the CMS section configures one", async () => {
    localeState.value = "es";
    render(await IndustrySection({ industrySection: cmsSectionWithSpanishVideo }));

    expect(screen.getByText("industria brasileña")).toBeInTheDocument();
    expect(screen.getByTestId("industry-player")).toHaveAttribute(
      "data-video-url",
      cmsSectionWithSpanishVideo.videos.es.url,
    );
    expect(screen.getByTestId("industry-player")).toHaveAttribute(
      "data-start-seconds",
      "3",
    );
  });

  it("falls back to fully static content when the CMS section is unavailable for English", async () => {
    localeState.value = "en";
    render(await IndustrySection({}));

    expect(screen.getByText("industry")).toBeInTheDocument();
    expect(screen.getByText("Static English content")).toBeInTheDocument();
    expect(screen.getByTestId("industry-player")).toHaveAttribute(
      "data-video-url",
      "https://www.youtube.com/watch?v=EeLYcZsdYrw",
    );
  });
});
