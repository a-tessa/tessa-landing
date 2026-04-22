"use client";

import Image from "next/image";
import { useState } from "react";
import { cn, insideCardSpacing } from "@/lib/utils";
import { LanguageSwitcher } from "./LanguageSwitcher";
import {
  DesktopLinks,
  MobileDrawer,
  MobileToggle,
  NavLogo,
} from "./nav/parts";

interface HeroNavbarProps {
  title: string;
  description: string;
  /** Background image (decorative). Defaults to `/services-heading.webp`. */
  backgroundSrc?: string;
  /** Override the active link color. Defaults to brand orange. */
  activeClassName?: string;
}

const ACTIVE_CLASS = "text-[#FF6F00]";

const css = /* css */ `
.hero-nav,
.hero-nav__spacer {
  --hero-h: 14rem;
  --hero-h-shrunk: 8rem;
  --hero-title-scale: 0.5;
  --hero-top: 1.5rem;
  --hero-side: 1rem;
  width: calc(100% - 1rem * 2);
}

@media (min-width: 640px) {
  .hero-nav,
  .hero-nav__spacer {
    width: calc(100% - var(--hero-side) * 2);
    --hero-h: 20rem;
    --hero-h-shrunk: 7rem;
    --hero-title-scale: 0.4;
  }
}
@media (min-width: 768px) {
  .hero-nav,
  .hero-nav__spacer {
    --hero-h: 22rem;
    --hero-h-shrunk: 7.5rem;
    --hero-title-scale: 0.32;
  }
}
@media (min-width: 1024px) {
  .hero-nav,
  .hero-nav__spacer {
    --hero-h: 18.75rem;
    --hero-h-shrunk: 9.5rem;
    --hero-title-scale: 0.28;
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
  contain: layout paint;
  will-change: height, background-color;
  height: var(--hero-h);
  border-radius: 1.5rem;
}

.hero-nav__overlay {
  background-color: rgb(0 0 0 / 0.60);
  will-change: background-color;
}

.hero-nav__title {
  transform-origin: left bottom;
  will-change: transform;
}

.hero-nav__subtitle {
  transform-origin: left top;
  will-change: opacity, max-height, transform;
  max-height: 8rem;
  overflow: hidden;
}

@keyframes hero-shell-shrink {
  to { height: var(--hero-h-shrunk); }
}
@keyframes hero-overlay-darken {
  to { background-color: rgb(0 0 0 / 0.80); }
}
@keyframes hero-title-shrink {
  to { transform: scale(var(--hero-title-scale)); }
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
    animation: hero-shell-shrink linear forwards;
    animation-timeline: scroll(root block);
    animation-range: 0 220px;
  }
  .hero-nav__overlay {
    animation: hero-overlay-darken linear forwards;
    animation-timeline: scroll(root block);
    animation-range: 0 220px;
  }
  .hero-nav__title {
    animation: hero-title-shrink linear forwards;
    animation-timeline: scroll(root block);
    animation-range: 0 220px;
  }
  .hero-nav__subtitle {
    animation: hero-subtitle-hide linear forwards;
    animation-timeline: scroll(root block);
    animation-range: 0 140px;
  }
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
  backgroundSrc = "/services-heading.webp",
  activeClassName = ACTIVE_CLASS,
}: HeroNavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <style href="hero-navbar" precedence="component">
        {css}
      </style>

      <header className="hero-nav">
        <div className="hero-nav__shell relative w-full overflow-hidden text-white">
          <Image
            src={backgroundSrc}
            alt=""
            fill
            sizes="100vw"
            priority
            aria-hidden
            className="-z-20 object-cover grayscale"
          />
          <div
            className="hero-nav__overlay absolute inset-0 -z-10"
            aria-hidden
          />

          <div className="absolute inset-x-0 top-0 z-10">
            <div
              className={cn(
                "mx-auto flex h-22 w-full items-center justify-between [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]",
                insideCardSpacing,
              )}
            >
              <NavLogo inline />

              <div className="flex items-center gap-4 sm:gap-6">
                <DesktopLinks activeClassName={activeClassName} />
                <LanguageSwitcher />
                <MobileToggle
                  open={menuOpen}
                  onToggle={() => setMenuOpen((v) => !v)}
                />
              </div>
            </div>
          </div>

          <div
            className={cn(
              "absolute inset-x-0 bottom-0 pb-6 sm:pb-8 [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]",
              insideCardSpacing,
            )}
          >
            <h1 className="hero-nav__title text-32xl font-bold uppercase sm:text-5xl md:text-6xl lg:text-7xl">
              {title}
            </h1>
            <p className="hero-nav__subtitle mt-3 max-w-2xl text-xxs font-semibold uppercase sm:mt-4 sm:text-xs">
              {description}
            </p>
          </div>

          <MobileDrawer
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            activeClassName={activeClassName}
            containerClassName="inset-x-0 top-22 z-20 px-4 py-4"
            linkClassName="block"
          />
        </div>
      </header>

      <div className="hero-nav__spacer" aria-hidden />
    </>
  );
}
