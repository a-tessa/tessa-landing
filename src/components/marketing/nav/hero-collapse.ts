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
