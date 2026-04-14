"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Container } from "./Container";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { cn, homeSpacing, sectionCardShellSpacing } from "@/lib/utils";
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
  const bgOpacity = scrollProgress;

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
        <span className="hidden h-4 w-px shrink-0 bg-white/40 sm:block" aria-hidden />
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
    <header className={cn("fixed left-0 right-0 top-6 z-50", sectionCardShellSpacing, 'w-full')}>
      <div
        className="flex justify-center pt-3 transition-all duration-500"
        style={{ paddingTop: `${12 * (1 - scrollProgress)}px` }}
      >
        <nav
          className={cn(
            "flex w-full items-center text-base font-medium justify-between transition-all duration-500 rounded-lg h-18",
            expanded ? "border-white/10 w-screen" : "border-transparent w-6xl",
            expanded ? "px-16!" : "",
          )}
          style={{
            backgroundColor: expanded
              ? `rgba(55, 71, 79, ${Math.max(bgOpacity, 0.65)})`
              : "transparent",
            backdropFilter: `blur(${8 + scrollProgress * 4}px)`,
            textShadow: "0 1px 3px rgba(0, 0, 0, 0.4)",
          }}
        >
          {navContent}
        </nav>
      </div>

      {!expanded && (
        <div className={cn("mx-auto transition-all duration-500", homeSpacing, expanded ? "px-16!" : "")}>
          <div className="mt-0 h-px bg-white/15" />
        </div>
      )}

      {expanded && <div className="h-px w-full bg-white/10" />}

      {mobileMenuOpen && (
        <div
          className="absolute left-0 right-0 border-b border-white/10 bg-[#37474F] sm:hidden"
          role="dialog"
          aria-label={t("navLabel")}
        >
          <Container className="flex flex-col gap-1 py-4">
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
          </Container>
        </div>
      )}
    </header>
  );
}
