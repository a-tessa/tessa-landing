"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { NAV_KEYS, isActivePath } from "./shared";

interface NavLogoProps {
  /**
   * When true, divider and "since" label render inside the logo Link
   * (NavbarPage variant). When false, they render as siblings outside
   * the Link (Navbar variant).
   */
  inline?: boolean;
}

export function NavLogo({ inline = false }: NavLogoProps) {
  const t = useTranslations("nav");

  const logoLink = (
    <Link
      href="/"
      className={cn(
        "flex items-center",
        inline ? "gap-3" : "gap-2 sm:gap-3",
      )}
    >
      <Image
        src="/tessa-logo.svg"
        alt="Tessa"
        width={80}
        height={40}
        className="h-8 w-auto sm:h-10"
        priority
      />
      {inline && (
        <>
          <span
            className="hidden h-4 w-px bg-white/40 sm:block"
            aria-hidden
          />
          <span className="hidden text-xs font-medium uppercase tracking-wide text-white/60 sm:block">
            {t("since")}
          </span>
        </>
      )}
    </Link>
  );

  if (inline) return logoLink;

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      {logoLink}
      <span
        className="hidden h-4 w-px shrink-0 bg-white/40 sm:block"
        aria-hidden
      />
      <span className="hidden text-xs font-medium uppercase tracking-wide text-white/60 sm:block">
        {t("since")}
      </span>
    </div>
  );
}

interface DesktopLinksProps {
  activeClassName: string;
}

export function DesktopLinks({ activeClassName }: DesktopLinksProps) {
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <>
      {NAV_KEYS.map(({ href, key }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "hidden text-xs font-medium uppercase tracking-wide transition-colors sm:block",
            isActivePath(pathname, href)
              ? activeClassName
              : "text-white/90 hover:text-white",
          )}
        >
          {t(key)}
        </Link>
      ))}
    </>
  );
}

interface MobileToggleProps {
  open: boolean;
  onToggle: () => void;
}

export function MobileToggle({ open, onToggle }: MobileToggleProps) {
  const t = useTranslations("nav");

  return (
    <button
      type="button"
      className="flex size-9 items-center justify-center rounded text-white sm:hidden"
      onClick={onToggle}
      aria-label={open ? t("closeMenu") : t("openMenu")}
      aria-expanded={open}
    >
      {open ? <X size={20} /> : <Menu size={20} />}
    </button>
  );
}

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  activeClassName: string;
  /** Position + spacing classes for the drawer container. */
  containerClassName?: string;
  /** Optional wrapper around the link list. Omit to render links directly. */
  innerClassName?: string;
  /** Extra classes applied to each link (e.g. `block` for stacked layout). */
  linkClassName?: string;
}

export function MobileDrawer({
  open,
  onClose,
  activeClassName,
  containerClassName,
  innerClassName,
  linkClassName,
}: MobileDrawerProps) {
  const pathname = usePathname();
  const t = useTranslations("nav");

  if (!open) return null;

  const links = NAV_KEYS.map(({ href, key }) => (
    <Link
      key={href}
      href={href}
      onClick={onClose}
      className={cn(
        "py-2 text-sm font-medium uppercase tracking-wide",
        linkClassName,
        isActivePath(pathname, href) ? activeClassName : "text-white/90",
      )}
    >
      {t(key)}
    </Link>
  ));

  return (
    <div
      className={cn(
        "absolute border-b border-white/10 bg-[#37474F] sm:hidden",
        containerClassName,
      )}
      role="dialog"
      aria-label={t("navLabel")}
    >
      {innerClassName ? <div className={innerClassName}>{links}</div> : links}
    </div>
  );
}
