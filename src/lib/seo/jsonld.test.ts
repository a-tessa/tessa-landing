import { describe, expect, it } from "vitest";
import { SITE } from "./schemas";
import {
  buildBlogPostingJsonLd,
  buildVideoObjectJsonLd,
  serializeJsonLd,
} from "./jsonld";

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

describe("buildBlogPostingJsonLd", () => {
  const base = {
    headline: "Estruturas metálicas para telhado",
    description: "Como escolher o perfil certo.",
    datePublished: "2026-08-01T00:00:00.000Z",
    dateModified: "2026-08-20T15:30:00.000Z",
    inLanguage: "pt-BR",
    authorName: "Maria Silva",
    pageUrl: "https://tessa.com.br/blog/estruturas-metalicas",
    imageUrl: "https://blob.example/header.webp",
  };

  it("puts the profile photo on Person when the author has an avatar", () => {
    const data = buildBlogPostingJsonLd({
      ...base,
      authorImageUrl: "https://blob.example/maria.webp",
    });

    expect(data.author).toEqual({
      "@type": "Person",
      name: "Maria Silva",
      image: "https://blob.example/maria.webp",
    });
  });

  it("omits Person.image when the author has no avatar", () => {
    const data = buildBlogPostingJsonLd({
      ...base,
      authorImageUrl: null,
    });

    expect(data.author).toEqual({
      "@type": "Person",
      name: "Maria Silva",
    });
  });

  it("makes a relative avatar URL absolute", () => {
    const data = buildBlogPostingJsonLd({
      ...base,
      authorImageUrl: "/avatars/maria.webp",
    });

    expect(data.author).toMatchObject({
      image: `${SITE.domain}/avatars/maria.webp`,
    });
  });
});
