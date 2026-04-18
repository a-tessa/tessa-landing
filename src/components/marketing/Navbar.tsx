"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import {
  cn,
  homeSpacing,
  insideCardSpacing,
  sectionCardShellSpacing,
} from "@/lib/utils";
import { Menu, X } from "lucide-react";

const SCROLL_THRESHOLD = 150;

const NAV_KEYS = [
  { href: "/", key: "about" },
  { href: "/servicos", key: "services" },
  { href: "/representantes", key: "representatives" },
  { href: "/blog", key: "blog" },
  { href: "/contato", key: "contact" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollProgress = Math.min(scrollY / SCROLL_THRESHOLD, 1);

  const expanded = scrollProgress >= 1;

  const navContent = (
    <>
      <div className="flex items-center gap-3 sm:gap-4">
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <Image
            src="/tessa-logo.svg"
            alt="Tessa"
            width={80}
            height={40}
            className="h-8 w-auto sm:h-10"
            priority
          />
        </Link>
        <span
          className="hidden h-4 w-px shrink-0 bg-white/40 sm:block"
          aria-hidden
        />
        <span className="hidden text-xs font-medium uppercase tracking-wide text-white/60 sm:block">
          {t("since")}
        </span>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        {NAV_KEYS.map(({ href, key }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "hidden text-xs font-medium uppercase tracking-wide transition-colors sm:block",
                isActive ? "text-[#FF6F00]" : "text-white/90 hover:text-white",
              )}
            >
              {t(key)}
            </Link>
          );
        })}
        <LanguageSwitcher />
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded text-white sm:hidden"
          onClick={() => setMobileMenuOpen((o) => !o)}
          aria-label={mobileMenuOpen ? t("closeMenu") : t("openMenu")}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </>
  );

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 md:top-6 z-50 w-full ",
        sectionCardShellSpacing,
        expanded ? "w-[calc(100%+80px)] -translate-x-1/2 left-1/2" : null,
      )}
    >
      <div className={cn(insideCardSpacing, 'px-0')}>
        <div
          className={cn("flex justify-center pt-3 transition-all duration-500 max-w-[1439px]", expanded ? "max-w-[calc(1439px+80px)]" : null)}
          style={{ paddingTop: `${12 * (1 - scrollProgress)}px` }}
        >
          <nav
            className={cn(
              "flex h-18 w-full items-center justify-between rounded-lg border text-base font-medium transition-[background-color,width,backdrop-filter,border-color] duration-500 bg-neutral-800 md:bg-transparent px-7 md:px-0",
              expanded
                ? "border-white/10 bg-black/30 backdrop-blur-xl md:px-10"
                : "border-transparent",
            )}
            style={{
              ...(expanded && {
                backdropFilter: `blur(${8 + scrollProgress * 4}px)`,
                WebkitBackdropFilter: `blur(${8 + scrollProgress * 4}px)`,
              }),
              textShadow: "0 1px 3px rgba(0, 0, 0, 0.4)",
            }}
          >
            {navContent}
          </nav>
        </div>

        {!expanded && (
          <div className="transition-all duration-500">
            <div className="mt-0 h-px bg-white/15" />
          </div>
        )}
      </div>

      {mobileMenuOpen && (
        <div
          className="absolute left-0 right-0 border-b border-white/10 bg-[#37474F] sm:hidden"
          role="dialog"
          aria-label={t("navLabel")}
        >
          <div className={cn("flex flex-col gap-1 py-4", homeSpacing)}>
            {NAV_KEYS.map(({ href, key }) => {
              const isActive =
                pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "py-2 text-sm font-medium uppercase tracking-wide",
                    isActive ? "text-[#FF6F00]" : "text-white/90",
                  )}
                >
                  {t(key)}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
