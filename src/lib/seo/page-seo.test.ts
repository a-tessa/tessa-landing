import { describe, expect, it } from "vitest";
import { SITE } from "@/lib/seo/schemas";
import {
  buildPageMetadata,
  resolveCanonicalAndLanguages,
  resolveRobots,
} from "./metadata";
import {
  resolvePageSeoEntryFromContent,
  resolveSiteSeoFromContent,
} from "./page-seo";

describe("resolveSiteSeoFromContent", () => {
  it("falls back to SITE when CMS SEO is missing", () => {
    const resolved = resolveSiteSeoFromContent(undefined);
    expect(resolved.siteName).toBe(SITE.name);
    expect(resolved.description).toBe(SITE.description);
    expect(resolved.keywords).toEqual(SITE.keywords);
    expect(resolved.titleTemplate).toBe(`%s | ${SITE.shortName}`);
    expect(resolved.allowIndexing).toBe(true);
    expect(resolved.twitterSite).toBeNull();
  });

  it("uses published SEO defaults when valid", () => {
    const resolved = resolveSiteSeoFromContent({
      seoDefaults: {
        siteName: "Tessa CMS",
        titleTemplate: "%s · Tessa",
        defaultMetaDescription: "Descrição publicada em inglês ou português.",
        keywords: ["Carport"],
        googleSiteVerification: "google-token",
        allowIndexing: false,
      },
    });

    expect(resolved.siteName).toBe("Tessa CMS");
    expect(resolved.titleTemplate).toBe("%s · Tessa");
    expect(resolved.description).toBe(
      "Descrição publicada em inglês ou português.",
    );
    expect(resolved.keywords).toEqual(["Carport"]);
    expect(resolved.googleSiteVerification).toBe("google-token");
    expect(resolved.allowIndexing).toBe(false);
    expect(resolved.twitterSite).toBeNull();
  });

  it("ignores a title template without %s", () => {
    const resolved = resolveSiteSeoFromContent({
      seoDefaults: {
        siteName: "Tessa CMS",
        titleTemplate: "Tessa",
        defaultMetaDescription: "Descrição.",
      },
    });
    expect(resolved.titleTemplate).toBe(`%s | ${SITE.shortName}`);
  });
});

describe("resolvePageSeoEntryFromContent", () => {
  it("returns CMS title and description when both exist", () => {
    expect(
      resolvePageSeoEntryFromContent(
        {
          pageSeo: {
            home: {
              metaTitle: "Título CMS",
              metaDescription: "Descrição CMS da home.",
              focusKeyword: "estruturas metálicas",
              noIndex: true,
              changeFrequency: "weekly",
              priority: 1,
            },
          },
        },
        "home",
      ),
    ).toEqual({
      metaTitle: "Título CMS",
      metaDescription: "Descrição CMS da home.",
      focusKeyword: "estruturas metálicas",
      ogImageUrl: undefined,
      socialTitle: undefined,
      socialDescription: undefined,
      canonicalUrl: undefined,
      noIndex: true,
      noFollow: false,
      changeFrequency: "weekly",
      priority: 1,
    });
  });

  it("returns null when the page is missing or incomplete", () => {
    expect(resolvePageSeoEntryFromContent({}, "home")).toBeNull();
    expect(
      resolvePageSeoEntryFromContent(
        {
          pageSeo: {
            home: {
              metaTitle: "Só título",
              metaDescription: "   ",
            },
          },
        },
        "home",
      ),
    ).toBeNull();
  });

  it("repassa campos sociais, canonical válida e noFollow", () => {
    expect(
      resolvePageSeoEntryFromContent(
        {
          pageSeo: {
            home: {
              metaTitle: "Título CMS",
              metaDescription: "Descrição CMS da home.",
              socialTitle: "Título social",
              socialDescription: "Descrição social.",
              canonicalUrl: "/quem-somos",
              noFollow: true,
            },
          },
        },
        "home",
      ),
    ).toMatchObject({
      socialTitle: "Título social",
      socialDescription: "Descrição social.",
      canonicalUrl: "/quem-somos",
      noFollow: true,
    });
  });

  it("descarta canonical que não é caminho interno nem URL http(s)", () => {
    expect(
      resolvePageSeoEntryFromContent(
        {
          pageSeo: {
            home: {
              metaTitle: "Título CMS",
              metaDescription: "Descrição CMS da home.",
              canonicalUrl: "servicos/carport",
            },
          },
        },
        "home",
      )?.canonicalUrl,
    ).toBeUndefined();
  });
});

describe("resolveCanonicalAndLanguages", () => {
  const siteOrigin = "https://tessa.com.br";

  it("aplica o prefixo de idioma em canonical relativa e mantém hreflang", () => {
    for (const [locale, expected] of [
      ["pt-BR", "/quem-somos"],
      ["en", "/en/quem-somos"],
      ["es", "/es/quem-somos"],
    ] as const) {
      const resolved = resolveCanonicalAndLanguages({
        locale,
        path: "/servicos",
        canonicalOverride: "/quem-somos",
        siteOrigin,
      });
      expect(resolved.canonical).toBe(expected);
      expect(resolved.isExternalCanonical).toBe(false);
      expect(resolved.languages).toMatchObject({
        "pt-BR": "/servicos",
        en: "/en/servicos",
        es: "/es/servicos",
      });
    }
  });

  it("usa URL externa literal nos três idiomas e suprime hreflang", () => {
    for (const locale of ["pt-BR", "en", "es"] as const) {
      const resolved = resolveCanonicalAndLanguages({
        locale,
        path: "/quem-somos",
        canonicalOverride: "https://origem.example/artigo",
        siteOrigin,
      });
      expect(resolved.canonical).toBe("https://origem.example/artigo");
      expect(resolved.languages).toBeUndefined();
      expect(resolved.isExternalCanonical).toBe(true);
    }
  });

  it("trata URL absoluta do próprio host como caminho interno", () => {
    const resolved = resolveCanonicalAndLanguages({
      locale: "en",
      path: "/quem-somos",
      canonicalOverride: "https://tessa.com.br/es/quem-somos",
      siteOrigin,
    });
    expect(resolved.canonical).toBe("/en/quem-somos");
    expect(resolved.isExternalCanonical).toBe(false);
    expect(resolved.languages?.en).toBe("/en/quem-somos");
  });
});

describe("resolveRobots", () => {
  it("emite as quatro combinações de index/follow", () => {
    expect(
      resolveRobots({
        noIndex: false,
        noFollow: false,
        allowIndexing: true,
        searchIndexingEnabled: true,
      }),
    ).toMatchObject({ index: true, follow: true });
    expect(
      resolveRobots({
        noIndex: true,
        noFollow: false,
        allowIndexing: true,
        searchIndexingEnabled: true,
      }),
    ).toMatchObject({ index: false, follow: true });
    expect(
      resolveRobots({
        noIndex: false,
        noFollow: true,
        allowIndexing: true,
        searchIndexingEnabled: true,
      }),
    ).toMatchObject({ index: true, follow: false });
    expect(
      resolveRobots({
        noIndex: true,
        noFollow: true,
        allowIndexing: true,
        searchIndexingEnabled: true,
      }),
    ).toMatchObject({ index: false, follow: false });
  });
});

describe("buildPageMetadata social inheritance", () => {
  it("herda título e descrição sociais do meta e não aplica o template no Open Graph", () => {
    const metadata = buildPageMetadata({
      locale: "pt-BR",
      path: "/quem-somos",
      title: "Quem Somos",
      description: "História da Tessa.",
    });

    expect(metadata.openGraph?.title).toBe("Quem Somos");
    expect(metadata.twitter?.title).toBe("Quem Somos");
    expect(metadata.openGraph?.description).toBe("História da Tessa.");
  });

  it("usa título e descrição sociais quando existem", () => {
    const metadata = buildPageMetadata({
      locale: "pt-BR",
      path: "/quem-somos",
      title: "Quem Somos",
      description: "História da Tessa.",
      socialTitle: "Tessa no feed",
      socialDescription: "Aço galvanizado para o card.",
      twitterSite: "@tessaeng",
    });

    expect(metadata.openGraph?.title).toBe("Tessa no feed");
    expect(metadata.twitter?.title).toBe("Tessa no feed");
    expect(metadata.openGraph?.description).toBe("Aço galvanizado para o card.");
    expect(metadata.twitter).toMatchObject({ site: "@tessaeng" });
    expect(metadata.title).toBe("Quem Somos");
  });
});
