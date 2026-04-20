"use client";

import { useState } from "react";
import { cn, freeSectionShellSpacing } from "@/lib/utils";
import { LanguageSwitcher } from "./LanguageSwitcher";
import {
  DesktopLinks,
  MobileDrawer,
  MobileToggle,
  NavLogo,
} from "./nav/parts";

const ACTIVE_CLASS = "text-primary";

export function NavbarPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className={cn(
        "fixed z-50 mt-7 flex h-18 w-screen shrink-0 items-center justify-between [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]",
        freeSectionShellSpacing,
        "px-14",
      )}
    >
      <NavLogo inline />

      <div className="flex items-center gap-4 sm:gap-6">
        <DesktopLinks activeClassName={ACTIVE_CLASS} />
        <LanguageSwitcher />
        <MobileToggle
          open={menuOpen}
          onToggle={() => setMenuOpen((v) => !v)}
        />
      </div>

      <MobileDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        activeClassName={ACTIVE_CLASS}
        containerClassName="inset-x-0 top-full z-10 px-4 py-4"
        linkClassName="block"
      />
    </nav>
  );
}
