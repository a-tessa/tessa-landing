import { describe, expect, it } from "vitest";
import {
  classifyArticleHref,
  isOffsiteArticleHref,
  normalizeArticleHref,
} from "./article-href";

describe("classifyArticleHref", () => {
  it("treats root-relative and in-page paths as internal", () => {
    expect(classifyArticleHref("/contato")).toBe("internal");
    expect(classifyArticleHref("/blog/meu-artigo")).toBe("internal");
    expect(classifyArticleHref("#secao")).toBe("internal");
    expect(classifyArticleHref("?q=aco")).toBe("internal");
  });

  it("treats absolute http(s) URLs as external", () => {
    expect(classifyArticleHref("https://exemplo.com/doc")).toBe("external");
    expect(classifyArticleHref("http://exemplo.com")).toBe("external");
    expect(classifyArticleHref("//cdn.exemplo.com/a")).toBe("external");
  });

  it("treats mailto and tel as contact links", () => {
    expect(classifyArticleHref("mailto:contato@tessa.com.br")).toBe("contact");
    expect(classifyArticleHref("tel:+551732671220")).toBe("contact");
  });
});

describe("isOffsiteArticleHref", () => {
  it("keeps same-host absolute URLs on-site so old articles do not change tab", () => {
    expect(
      isOffsiteArticleHref(
        "https://www.tessa.com.br/contato",
        "https://tessa.com.br",
      ),
    ).toBe(false);
  });

  it("marks other hosts as offsite", () => {
    expect(
      isOffsiteArticleHref(
        "https://parceiro.com/catalogo",
        "https://tessa.com.br",
      ),
    ).toBe(true);
  });

  it("never treats a relative path as offsite", () => {
    expect(isOffsiteArticleHref("/blog/outro", "https://tessa.com.br")).toBe(
      false,
    );
  });
});

describe("normalizeArticleHref", () => {
  it("leaves already-valid internal and external hrefs unchanged", () => {
    expect(normalizeArticleHref("/contato")).toBe("/contato");
    expect(normalizeArticleHref("https://exemplo.com")).toBe(
      "https://exemplo.com",
    );
  });

  it("adds https to bare domains and a leading slash to internal paths", () => {
    expect(normalizeArticleHref("exemplo.com/doc")).toBe(
      "https://exemplo.com/doc",
    );
    expect(normalizeArticleHref("contato")).toBe("/contato");
    expect(normalizeArticleHref("blog/meu-artigo")).toBe("/blog/meu-artigo");
  });
});
