import { describe, expect, it } from "vitest";
import { isActivePath, NAV_KEYS } from "./shared";

describe("nav shared", () => {
  it("includes Galeria next to Downloads", () => {
    const hrefs = NAV_KEYS.map((item) => item.href);
    expect(hrefs).toContain("/galeria");
    expect(hrefs.indexOf("/galeria")).toBeGreaterThan(hrefs.indexOf("/downloads"));
  });

  it("marks /galeria as active for the gallery route", () => {
    expect(isActivePath("/galeria", "/galeria")).toBe(true);
    expect(isActivePath("/galeria", "/downloads")).toBe(false);
  });
});
