// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import { act } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { HERO_NAV_COLLAPSED_CLASS } from "./hero-collapse";
import { SecondaryNavFollow } from "./SecondaryNavFollow";

function setScrollY(scrollY: number): void {
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    value: scrollY,
  });
  act(() => {
    window.dispatchEvent(new Event("scroll"));
  });
}

describe("SecondaryNavFollow", () => {
  afterEach(() => {
    cleanup();
    setScrollY(0);
  });

  it("parks under the compact navbar after the heading collapse distance", () => {
    const { container } = render(
      <SecondaryNavFollow className="blog-category-nav">
        filters
      </SecondaryNavFollow>,
    );
    const el = container.firstElementChild;

    expect(el).not.toHaveClass(HERO_NAV_COLLAPSED_CLASS);

    setScrollY(219);
    expect(el).not.toHaveClass(HERO_NAV_COLLAPSED_CLASS);

    setScrollY(220);
    expect(el).toHaveClass(HERO_NAV_COLLAPSED_CLASS);
  });
});
