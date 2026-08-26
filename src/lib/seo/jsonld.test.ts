import { describe, expect, it } from "vitest";
import { buildVideoObjectJsonLd, serializeJsonLd } from "./jsonld";

describe("serializeJsonLd", () => {
  it("escapa < para o JSON não quebrar o script", () => {
    expect(serializeJsonLd({ name: "</script><img src=x onerror=1>" })).toBe(
      '{"name":"\\u003c/script>\\u003cimg src=x onerror=1>"}',
    );
  });
});

describe("buildVideoObjectJsonLd", () => {
  it("omite VideoObject sem data de upload", () => {
    expect(
      buildVideoObjectJsonLd({
        name: "Carport",
        description: "Vídeo do carport.",
        videoId: "abc123",
        uploadDate: null,
      }),
    ).toBeNull();
  });

  it("inclui uploadDate quando a publicação existe", () => {
    const data = buildVideoObjectJsonLd({
      name: "Carport",
      description: "Vídeo do carport.",
      videoId: "abc123",
      uploadDate: "2026-08-01T00:00:00.000Z",
    });
    expect(data).toMatchObject({
      "@type": "VideoObject",
      uploadDate: "2026-08-01T00:00:00.000Z",
      contentUrl: "https://www.youtube.com/watch?v=abc123",
    });
  });
});
