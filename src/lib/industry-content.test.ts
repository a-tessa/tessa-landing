import { describe, expect, it } from "vitest";
import {
  getIndustryVideoConfig,
  resolveIndustrySection,
} from "./industry-content";

const section = {
  titlePrefix: "A força da",
  title: "indústria brasileira",
  subtitle: "Estruturas que transformam projetos em realidade.",
  videos: {
    "pt-BR": {
      url: "https://www.youtube.com/watch?v=EeLYcZsdYrw",
      startSeconds: 4,
    },
  },
};

const sectionWithLocaleVideos = {
  ...section,
  videos: {
    ...section.videos,
    es: {
      url: "https://www.youtube.com/watch?v=eGdFPCZYNYQ",
      startSeconds: 6,
    },
  },
};

describe("industry content", () => {
  it("resolves the Portuguese CMS text and video", () => {
    expect(resolveIndustrySection(section, "pt-BR")).toEqual({
      titlePrefix: section.titlePrefix,
      title: section.title,
      subtitle: section.subtitle,
      video: section.videos["pt-BR"],
    });
  });

  it("uses CMS text for English and Spanish, since the API already localizes it", () => {
    expect(resolveIndustrySection(section, "en")).toEqual({
      titlePrefix: section.titlePrefix,
      title: section.title,
      subtitle: section.subtitle,
      video: section.videos["pt-BR"],
    });
    expect(resolveIndustrySection(section, "es")).toEqual({
      titlePrefix: section.titlePrefix,
      title: section.title,
      subtitle: section.subtitle,
      video: section.videos["pt-BR"],
    });
  });

  it("uses the locale's own video when it is configured", () => {
    expect(resolveIndustrySection(sectionWithLocaleVideos, "es")).toEqual({
      titlePrefix: sectionWithLocaleVideos.titlePrefix,
      title: sectionWithLocaleVideos.title,
      subtitle: sectionWithLocaleVideos.subtitle,
      video: sectionWithLocaleVideos.videos.es,
    });
  });

  it("falls back to the full Portuguese URL and start-seconds pair when a locale has no video of its own", () => {
    expect(resolveIndustrySection(sectionWithLocaleVideos, "en")).toEqual({
      titlePrefix: sectionWithLocaleVideos.titlePrefix,
      title: sectionWithLocaleVideos.title,
      subtitle: sectionWithLocaleVideos.subtitle,
      video: sectionWithLocaleVideos.videos["pt-BR"],
    });
  });

  it("rejects absent or invalid CMS sections so static content remains active", () => {
    expect(resolveIndustrySection(undefined, "pt-BR")).toBeNull();
    expect(
      resolveIndustrySection(
        {
          ...section,
          title: "",
        },
        "pt-BR",
      ),
    ).toBeNull();
    expect(
      resolveIndustrySection(
        {
          ...section,
          videos: {
            "pt-BR": { url: "https://example.com/not-youtube" },
          },
        },
        "pt-BR",
      ),
    ).toBeNull();
  });

  it("preserves the existing static video behavior", () => {
    expect(getIndustryVideoConfig("es")).toEqual({
      url: "https://www.youtube.com/watch?v=eGdFPCZYNYQ",
      startSeconds: 6,
    });
    expect(getIndustryVideoConfig("en")).toEqual({
      url: "https://www.youtube.com/watch?v=EeLYcZsdYrw",
    });
  });
});
