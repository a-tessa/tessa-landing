"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Tooltip } from "radix-ui";
import { cn, insideCardSpacing } from "@/lib/utils";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Navbar } from "./Navbar";
import {
  DesktopLinks,
  MobileDrawer,
  MobileToggle,
  NavLogo,
} from "./nav/parts";
import { HERO_NAV_COLLAPSE_RANGE_PX } from "./nav/hero-collapse";
import { useScrollProgress } from "./nav/use-scroll-progress";

interface HeroNavbarProps {
  title: string;
  description: string;
  titleAs?: "h1" | "p";
  /** Override the active link color. Defaults to brand orange. */
  activeClassName?: string;
}

const ACTIVE_CLASS = "text-[#FF6F00]";

const NAV_DESCRIPTION_MAX_CHARS = 200;

const css = /* css */ `
.hero-nav,
.hero-nav__spacer {
  --hero-h: 14rem;
  --hero-top: 1.5rem;
  --hero-side: 1rem;
  width: calc(100% - 1rem * 2);
}

@media (min-width: 640px) {
  .hero-nav,
  .hero-nav__spacer {
    width: calc(100% - var(--hero-side) * 2);
    --hero-h: 20rem;
  }
}
@media (min-width: 768px) {
  .hero-nav,
  .hero-nav__spacer {
    --hero-h: 22rem;
  }
}
@media (min-width: 1024px) {
  .hero-nav,
  .hero-nav__spacer {
    --hero-h: 18.75rem;
  }
}

.hero-nav {
  isolation: isolate;
  position: fixed;
  top: var(--hero-top);
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - var(--hero-side) * 2);
  max-width: 1920px;
  z-index: 40;
}

.hero-nav__spacer {
  height: calc(var(--hero-h) + var(--hero-top));
  flex-shrink: 0;
}

.hero-nav__shell {
  contain: layout;
  will-change: height, opacity;
  height: var(--hero-h);
  border-radius: 1.5rem;
  overflow: hidden;
}

.hero-nav__background {
  contain: paint;
  border-radius: 1.5rem;
  background-color: oklch(0.8853 0 0);
}

.hero-nav__overlay {
  background-color: rgb(0 0 0 / 0.08);
  will-change: background-color;
}

.hero-nav__title {
  transform-origin: left bottom;
  will-change: transform, opacity;
}

.hero-nav__subtitle {
  transform-origin: left top;
  will-change: opacity, max-height, transform;
  max-height: 8rem;
  overflow: hidden;
}

@keyframes hero-shell-collapse {
  to {
    height: 0;
    opacity: 0;
    border-radius: 1.5rem;
  }
}
@keyframes hero-overlay-darken {
  to { background-color: rgb(0 0 0 / 0.2); }
}
@keyframes hero-title-collapse {
  to {
    transform: scale(0.4);
    opacity: 0;
  }
}
@keyframes hero-subtitle-hide {
  from {
    opacity: 1;
    transform: translate3d(0, 0, 0);
    max-height: 8rem;
    margin-top: 1rem;
  }
  to {
    opacity: 0;
    transform: translate3d(0, -0.25rem, 0);
    max-height: 0;
    margin-top: 0;
  }
}

@supports (animation-timeline: scroll()) {
  .hero-nav__shell {
    animation: hero-shell-collapse linear forwards;
    animation-timeline: scroll(root block);
    animation-range: 0 ${String(HERO_NAV_COLLAPSE_RANGE_PX)}px;
  }
  .hero-nav__overlay {
    animation: hero-overlay-darken linear forwards;
    animation-timeline: scroll(root block);
    animation-range: 0 ${String(HERO_NAV_COLLAPSE_RANGE_PX)}px;
  }
  .hero-nav__title {
    animation: hero-title-collapse linear forwards;
    animation-timeline: scroll(root block);
    animation-range: 0 ${String(HERO_NAV_COLLAPSE_RANGE_PX)}px;
  }
  .hero-nav__subtitle {
    animation: hero-subtitle-hide linear forwards;
    animation-timeline: scroll(root block);
    animation-range: 0 140px;
  }
}

.hero-nav--collapsed .hero-nav__shell {
  height: 0;
  opacity: 0;
  animation: none !important;
}

@media (prefers-reduced-motion: reduce) {
  .hero-nav__shell,
  .hero-nav__overlay,
  .hero-nav__title,
  .hero-nav__subtitle {
    animation: none !important;
  }
}
`;

export function HeroNavbar({
  title,
  description,
  titleAs = "h1",
  activeClassName = ACTIVE_CLASS,
}: HeroNavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);
  const navRowRef = useRef<HTMLDivElement>(null);
  const { expanded: collapsed } = useScrollProgress(HERO_NAV_COLLAPSE_RANGE_PX);

  useEffect(() => {
    if (collapsed) setMenuOpen(false);
  }, [collapsed]);

  const { visibleDescription, isTruncated } = useMemo(() => {
    if (description.length <= NAV_DESCRIPTION_MAX_CHARS) {
      return { visibleDescription: description, isTruncated: false };
    }
    return {
      visibleDescription: `${description.slice(0, NAV_DESCRIPTION_MAX_CHARS)}…`,
      isTruncated: true,
    };
  }, [description]);
  const TitleTag = titleAs;

  return (
    <>
      <style href="hero-navbar" precedence="component">
        {css}
      </style>

      <div
        className={cn(
          "transition-opacity duration-200",
          collapsed ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!collapsed}
      >
        <Navbar tone="black" />
      </div>

      <header
        className={cn("hero-nav", collapsed && "hero-nav--collapsed pointer-events-none")}
        aria-hidden={collapsed}
      >
        <div ref={shellRef} className="hero-nav__shell relative w-full text-foreground">
          <div className="hero-nav__background pointer-events-none absolute inset-0 overflow-hidden">
            <div
              className="hero-nav__overlay absolute inset-0"
              aria-hidden
            />
          </div>

          <div
            ref={navRowRef}
            className="absolute inset-x-0 top-0 z-20 overflow-visible"
          >
            <div
              className={cn(
                "mx-auto flex h-22 w-full items-center justify-between",
                insideCardSpacing,
              )}
            >
              <NavLogo inline tone="black" />

              <div className="flex items-center gap-4 sm:gap-6">
                <DesktopLinks
                  activeClassName={activeClassName}
                  tone="black"
                />
                <LanguageSwitcher tone="black" />
                <MobileToggle
                  open={menuOpen}
                  onToggle={() => setMenuOpen((v) => !v)}
                  tone="black"
                />
              </div>
            </div>
          </div>

          <div
            className={cn(
              "absolute inset-x-0 bottom-0 pb-6 sm:pb-12 [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]",
              insideCardSpacing,
            )}
          >
            <TitleTag className="hero-nav__title text-32xl font-bold uppercase sm:text-5xl md:text-6xl lg:text-6xl text-[#252525]">
              {title}
            </TitleTag>
            {isTruncated ? (
              <Tooltip.Provider delayDuration={250}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <p
                      className="hero-nav__subtitle mt-3 max-w-2xl cursor-help text-xxs font-semibold uppercase sm:mt-4 sm:text-xs outline-offset-2 focus-visible:outline-2 focus-visible:outline-white/70"
                      tabIndex={0}
                    >
                      {visibleDescription}
                    </p>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="top"
                      sideOffset={10}
                      className="z-50 max-h-64 max-w-sm overflow-y-auto rounded-md border border-border bg-popover px-3 py-2 text-left text-xs font-semibold tracking-wide wrap-break-word text-popover-foreground uppercase shadow-md"
                    >
                      {description}
                      <Tooltip.Arrow
                        className="fill-popover"
                        width={12}
                        height={6}
                      />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            ) :
              // (
              //   <p className="hero-nav__subtitle mt-3 max-w-2xl text-xxs font-semibold uppercase sm:mt-4 sm:text-xs">
              //     {visibleDescription}
              //   </p>
              // )
              null
            }
          </div>

          <MobileDrawer
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            activeClassName={activeClassName}
            portalAnchorRef={navRowRef}
            portalBoundsRef={shellRef}
            containerClassName="px-4 py-4 rounded-b-3xl"
            linkClassName="block"
          />
        </div>
      </header>

      <div className="hero-nav__spacer" aria-hidden />
    </>
  );
}
