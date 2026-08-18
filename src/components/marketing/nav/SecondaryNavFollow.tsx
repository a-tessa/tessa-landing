"use client";

import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import {
  HERO_NAV_COLLAPSED_CLASS,
  HERO_NAV_COLLAPSE_RANGE_PX,
} from "./hero-collapse";
import { useScrollProgress } from "./use-scroll-progress";

type SecondaryNavFollowProps = ComponentProps<"div">;

/**
 * Same collapse threshold as `<HeroNavbar />`. Adds
 * `HERO_NAV_COLLAPSED_CLASS` so secondary navs can park under the compact
 * navbar when CSS scroll-driven animation is disabled.
 */
export function SecondaryNavFollow({
  className,
  children,
  ...props
}: SecondaryNavFollowProps) {
  const { expanded: collapsed } = useScrollProgress(HERO_NAV_COLLAPSE_RANGE_PX);

  return (
    <div
      className={cn(className, collapsed && HERO_NAV_COLLAPSED_CLASS)}
      {...props}
    >
      {children}
    </div>
  );
}
