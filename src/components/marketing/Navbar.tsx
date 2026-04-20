"use client";

import { useState } from "react";
import {
  cn,
  homeSpacing,
  insideCardSpacing,
  sectionCardShellSpacing,
} from "@/lib/utils";
import { LanguageSwitcher } from "./LanguageSwitcher";
import {
  DesktopLinks,
  MobileDrawer,
  MobileToggle,
  NavLogo,
} from "./nav/parts";
import { useScrollProgress } from "./nav/use-scroll-progress";

const SCROLL_THRESHOLD = 150;
const ACTIVE_CLASS = "text-[#FF6F00]";

export function Navbar() {
  const { scrollProgress, expanded } = useScrollProgress(SCROLL_THRESHOLD);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const blurPx = 8 + scrollProgress * 4;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 w-full md:top-6 max-w-[2000px] mx-auto transition-[max-width,width] duration-500",
        sectionCardShellSpacing,
        expanded && "left-1/2 w-[calc(100%+80px)] -translate-x-1/2 transition-[width,max-width] duration-500",
      )}
    >
      <div className={cn(insideCardSpacing, "px-0")}>
        <div
          className={cn(
            "mx-auto flex max-w-[1439px] justify-center transition-[max-width] duration-500",
            expanded && "max-w-[calc(1439px+80px)]",
          )}
          style={{ paddingTop: `${12 * (1 - scrollProgress)}px` }}
        >
          <nav
            className={cn(
              "flex h-18 w-full items-center justify-between rounded-lg border bg-neutral-800 px-7 text-base font-medium transition-[background-color,padding,backdrop-filter,border-color] duration-500 md:bg-transparent md:px-0",
              expanded
                ? "border-white/10 backdrop-blur-xl backdrop-contrast-50 md:px-10"
                : "border-transparent",
            )}
            style={{
              ...(expanded && {
                // backdropFilter: `blur(${blurPx}px)`,
                WebkitBackdropFilter: `blur(${blurPx}px)`,
              }),
              textShadow: "0 1px 3px rgba(0, 0, 0, 0.4)",
            }}
          >
            <NavLogo />

            <div className="flex items-center gap-4 sm:gap-6">
              <DesktopLinks activeClassName={ACTIVE_CLASS} />
              <LanguageSwitcher />
              <MobileToggle
                open={mobileMenuOpen}
                onToggle={() => setMobileMenuOpen((o) => !o)}
              />
            </div>
          </nav>
        </div>

        {!expanded && (
          <div className="h-px bg-white/15 transition-all duration-500" />
        )}
      </div>

      <MobileDrawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        activeClassName={ACTIVE_CLASS}
        containerClassName="left-0 right-0"
        innerClassName={cn("flex flex-col gap-1 py-4", homeSpacing)}
      />
    </header>
  );
}
