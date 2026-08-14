import { describe, expect, it } from "vitest";
import { sanitizeArticleHtml } from "./sanitize-article-html";

const SITE_ORIGIN = "https://tessa.com.br";

describe("sanitizeArticleHtml anchors", () => {
  it("keeps existing internal hrefs and drops forced new-tab attrs", () => {
    const html =
      '<p>Veja o <a href="/contato" target="_blank" rel="noopener noreferrer nofollow">contato</a>.</p>';

    expect(sanitizeArticleHtml(html, { siteOrigin: SITE_ORIGIN })).toBe(
      '<p>Veja o <a href="/contato">contato</a>.</p>',
    );
  });

  it("keeps existing external hrefs and opens them in a new tab", () => {
    const html =
      '<p>Leia a <a href="https://parceiro.com/norma">norma</a>.</p>';

    expect(sanitizeArticleHtml(html, { siteOrigin: SITE_ORIGIN })).toBe(
      '<p>Leia a <a href="https://parceiro.com/norma" target="_blank" rel="noopener noreferrer">norma</a>.</p>',
    );
  });

  it("treats same-host absolute URLs as internal so old articles stay in place", () => {
    const html =
      '<p><a href="https://www.tessa.com.br/blog/outro" target="_blank">Outro</a></p>';

    expect(sanitizeArticleHtml(html, { siteOrigin: SITE_ORIGIN })).toBe(
      '<p><a href="https://www.tessa.com.br/blog/outro">Outro</a></p>',
    );
  });

  it("strips javascript hrefs", () => {
    const html = '<p><a href="javascript:alert(1)">x</a></p>';
    const sanitized = sanitizeArticleHtml(html, { siteOrigin: SITE_ORIGIN });

    expect(sanitized).not.toContain("javascript:");
    expect(sanitized).toContain("x");
  });
});
