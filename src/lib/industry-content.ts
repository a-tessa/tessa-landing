const INDUSTRY_VIDEO_PT = "https://www.youtube.com/watch?v=EeLYcZsdYrw";
const INDUSTRY_VIDEO_ES = "https://www.youtube.com/watch?v=eGdFPCZYNYQ";

export function getIndustryVideoConfig(locale: string): {
  url: string;
  startSeconds?: number;
} {
  if (locale === "es") {
    return { url: INDUSTRY_VIDEO_ES, startSeconds: 6 };
  }

  // pt-BR and en — no dedicated English version
  return { url: INDUSTRY_VIDEO_PT };
}
