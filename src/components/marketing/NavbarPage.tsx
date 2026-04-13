"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn, freeSectionShellSpacing } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "A TESSA" },
  { href: "/servicos", label: "SERVIÇOS" },
  { href: "/representantes", label: "REPRESENTANTES" },
  { href: "/blog", label: "BLOG" },
  { href: "/contato", label: "CONTATO" },
] as const;

export function NavbarPage() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string): boolean =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav className={cn("fixed z-50 mt-7 flex h-18 w-screen shrink-0 items-center justify-between [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]", freeSectionShellSpacing, "px-14")}>
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/tessa-logo.svg"
          alt="Tessa"
          width={80}
          height={40}
          className="h-8 w-auto sm:h-10"
          priority
        />
        <span className="hidden h-4 w-px bg-white/40 sm:block" aria-hidden />
        <span className="hidden text-xs font-medium uppercase tracking-wide text-white/60 sm:block">
          DESDE 2001
        </span>
      </Link>

      <div className="flex items-center gap-4 sm:gap-6">
        {NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "hidden text-xs font-medium uppercase tracking-wide transition-colors sm:block",
              isActive(href) ? "text-primary" : "text-white/90 hover:text-white",
            )}
          >
            {label}
          </Link>
        ))}

        <button
          type="button"
          className="size-9 items-center justify-center rounded text-white sm:hidden flex"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <div
          className="absolute inset-x-0 top-full z-10 border-b border-white/10 bg-[#37474F] px-4 py-4 sm:hidden"
          role="dialog"
          aria-label="Menu de navegação"
        >
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "block py-2 text-sm font-medium uppercase tracking-wide",
                isActive(href) ? "text-primary" : "text-white/90",
              )}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
