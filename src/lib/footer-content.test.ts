import { describe, expect, it } from "vitest";
import { resolveFooterSection } from "./footer-content";

describe("resolveFooterSection", () => {
  it("returns null when content is missing or invalid", () => {
    expect(resolveFooterSection(null)).toBeNull();
    expect(resolveFooterSection({})).toBeNull();
    expect(
      resolveFooterSection({
        newsletterTitle: " ",
        newsletterSub: "Conteúdos técnicos",
      }),
    ).toBeNull();
  });

  it("returns trimmed CMS texts when valid", () => {
    expect(
      resolveFooterSection({
        newsletterTitle: "  Receba novidades da Tessa  ",
        newsletterSub: " Conteúdos técnicos, novidades e soluções ",
      }),
    ).toEqual({
      newsletterTitle: "Receba novidades da Tessa",
      newsletterSub: "Conteúdos técnicos, novidades e soluções",
    });
  });
});
