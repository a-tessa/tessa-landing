import { describe, expect, it } from "vitest";
import {
  localizeRedirectTarget,
  pathWithoutLocalePrefix,
  resolveRedirect,
} from "./resolve-redirect";

const redirects = [
  { fromPath: "/blog/antigo", toPath: "/blog/novo", statusCode: 301 },
  {
    fromPath: "/2023/05/post-antigo",
    toPath: "/blog/post-novo",
    statusCode: 301,
  },
  {
    fromPath: "/parceiro",
    toPath: "https://origem.example/artigo",
    statusCode: 302,
  },
];

describe("resolveRedirect", () => {
  it("resolves an old slug to its destination", () => {
    expect(resolveRedirect("/blog/antigo", redirects)).toEqual({
      toPath: "/blog/novo",
      statusCode: 301,
    });
  });

  it("returns null for a missing slug so the page can 404", () => {
    expect(resolveRedirect("/blog/nao-existe", redirects)).toBeNull();
  });

  it("keeps an absolute destination as-is", () => {
    expect(resolveRedirect("/parceiro", redirects)).toEqual({
      toPath: "https://origem.example/artigo",
      statusCode: 302,
    });
  });

  it("returns null when the map is empty (fetch failed)", () => {
    expect(resolveRedirect("/blog/antigo", [])).toBeNull();
  });

  it("matches stored lowercase paths regardless of request casing", () => {
    expect(resolveRedirect("/Blog/Antigo", redirects)).toEqual({
      toPath: "/blog/novo",
      statusCode: 301,
    });
  });

  it("redirects a legacy path that is not a known route", () => {
    expect(resolveRedirect("/2023/05/post-antigo", redirects)).toEqual({
      toPath: "/blog/post-novo",
      statusCode: 301,
    });
    expect(resolveRedirect("/pagina-que-nunca-existiu", redirects)).toBeNull();
  });
});

describe("localizeRedirectTarget", () => {
  it("prefixes internal destinations with the visitor locale", () => {
    expect(localizeRedirectTarget("pt-BR", "/blog/novo")).toBe("/blog/novo");
    expect(localizeRedirectTarget("en", "/blog/novo")).toBe("/en/blog/novo");
    expect(localizeRedirectTarget("es", "/blog/novo")).toBe("/es/blog/novo");
  });

  it("leaves absolute destinations unchanged", () => {
    expect(
      localizeRedirectTarget("en", "https://origem.example/artigo"),
    ).toBe("https://origem.example/artigo");
  });
});

describe("pathWithoutLocalePrefix", () => {
  it("strips en/es prefixes and leaves pt-BR unprefixed paths", () => {
    expect(pathWithoutLocalePrefix("/en/2023/05/post-antigo")).toBe(
      "/2023/05/post-antigo",
    );
    expect(pathWithoutLocalePrefix("/2023/05/post-antigo")).toBe(
      "/2023/05/post-antigo",
    );
  });
});
