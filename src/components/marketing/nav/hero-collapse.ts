/** Scroll distance (px) for the page heading to fully collapse. */
export const HERO_NAV_COLLAPSE_RANGE_PX = 220;

/**
 * Sticky secondary navs (categories / service carousel) sit under the
 * homepage-style `Navbar` once the heading is gone.
 */
export const HERO_NAV_COLLAPSED_SECONDARY_TOP = {
  base: "6rem",
  sm: "6.5rem",
  md: "7.5rem",
  lg: "7.5rem",
} as const;

/**
 * Applied by `SecondaryNavFollow` when the heading has collapsed.
 * Parks the bar at `--nav-top-to` when the scroll-driven animation is off
 * (`prefers-reduced-motion` or no `animation-timeline` support).
 */
export const HERO_NAV_COLLAPSED_CLASS = "is-hero-collapsed";

/** End-state + reduced-motion rules shared by secondary navs. */
export function secondaryNavParkedCss(
  selector: string,
  top = "var(--nav-top-to)",
): string {
  return `
${selector}.${HERO_NAV_COLLAPSED_CLASS} {
  top: ${top};
}

@media (prefers-reduced-motion: reduce) {
  ${selector} {
    animation-name: none;
  }
}
`;
}
