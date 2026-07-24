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

describe("industry content", () => {
  it("resolves the Portuguese CMS text and video", () => {
    expect(resolveIndustrySection(section, "pt-BR")).toEqual({
      titlePrefix: section.titlePrefix,
      title: section.title,
      subtitle: section.subtitle,
      video: section.videos["pt-BR"],
    });
  });

  it("keeps English and Spanish on their existing static content", () => {
    expect(resolveIndustrySection(section, "en")).toBeNull();
    expect(resolveIndustrySection(section, "es")).toBeNull();
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
