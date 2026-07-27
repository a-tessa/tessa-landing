import { describe, expect, it } from "vitest";
import {
  resolveAboutSection,
  splitAboutBodyParagraphs,
} from "./about-content";

const validSection = {
  heroTitle: "NÓS SOMOS A TESSA",
  videos: {
    "pt-BR": {
      url: "https://www.youtube.com/watch?v=EeLYcZsdYrw",
      startSeconds: 8,
    },
    es: {
      url: "https://www.youtube.com/watch?v=eGdFPCZYNYQ",
      startSeconds: 6,
    },
  },
  sideImage: {
    url: "https://example.com/about.webp",
    alt: "Indústria Tessa",
  },
  body: "Parágrafo um.\n\nParágrafo dois.",
  mission: {
    title: "NOSSA MISSÃO",
    description: "Missão da Tessa.",
  },
  vision: {
    title: "VISÃO DA TESSA",
    description: "Visão da Tessa.",
  },
  values: {
    title: "NOSSOS VALORES",
    description: "Valores da Tessa.",
  },
};

describe("resolveAboutSection", () => {
  it("resolves a valid CMS section and picks localized video", () => {
    expect(resolveAboutSection(validSection, "pt-BR")).toEqual({
      heroTitle: validSection.heroTitle,
      body: validSection.body,
      sideImage: validSection.sideImage,
      video: validSection.videos["pt-BR"],
      mission: validSection.mission,
      vision: validSection.vision,
      values: validSection.values,
    });

    expect(resolveAboutSection(validSection, "es")?.video).toEqual(
      validSection.videos.es,
    );
    expect(resolveAboutSection(validSection, "en")?.video).toEqual(
      validSection.videos["pt-BR"],
    );
  });

  it("returns null for incomplete payloads", () => {
    expect(resolveAboutSection({}, "pt-BR")).toBeNull();
    expect(
      resolveAboutSection(
        {
          ...validSection,
          videos: { "pt-BR": { url: "https://example.com/x" } },
        },
        "pt-BR",
      ),
    ).toBeNull();
  });
});

describe("splitAboutBodyParagraphs", () => {
  it("splits on blank lines and trims", () => {
    expect(splitAboutBodyParagraphs("A\n\nB\n\n  C  ")).toEqual([
      "A",
      "B",
      "C",
    ]);
  });
});
