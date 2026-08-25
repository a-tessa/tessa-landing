import { describe, expect, it } from "vitest";
import { SITE } from "@/lib/seo/schemas";
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
      noIndex: true,
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
});
