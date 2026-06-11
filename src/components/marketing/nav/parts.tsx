"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { NAV_KEYS, isActivePath } from "./shared";

interface PortalDrawerStyle {
  top: number;
  left: number;
  width: number;
}

function usePortalDrawerPosition(
  anchorRef: RefObject<HTMLElement | null>,
  boundsRef: RefObject<HTMLElement | null> | undefined,
  open: boolean,
): PortalDrawerStyle | null {
  const [position, setPosition] = useState<PortalDrawerStyle | null>(null);

  const updatePosition = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const bounds = boundsRef?.current ?? anchor;
    const anchorRect = anchor.getBoundingClientRect();
    const boundsRect = bounds.getBoundingClientRect();

    setPosition({
      top: anchorRect.bottom,
      left: boundsRect.left,
      width: boundsRect.width,
    });
  }, [anchorRef, boundsRef]);

  useLayoutEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }
    updatePosition();
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, updatePosition]);

  return position;
}

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
  /** Anchor below which the portaled drawer is placed. */
  portalAnchorRef: RefObject<HTMLElement | null>;
  /** Optional bounds for drawer width/horizontal alignment. Defaults to anchor. */
  portalBoundsRef?: RefObject<HTMLElement | null>;
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
  portalAnchorRef,
  portalBoundsRef,
  containerClassName,
  innerClassName,
  linkClassName,
}: MobileDrawerProps) {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const drawerRef = useRef<HTMLDivElement>(null);
  const position = usePortalDrawerPosition(
    portalAnchorRef,
    portalBoundsRef,
    open,
  );

  if (!open || !position) return null;

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

  const drawer = (
    <div
      ref={drawerRef}
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        width: position.width,
        zIndex: 60,
      }}
      className={cn(
        "border-b border-white/10 bg-[#37474F] sm:hidden",
        containerClassName,
      )}
      role="dialog"
      aria-label={t("navLabel")}
    >
      {innerClassName ? <div className={innerClassName}>{links}</div> : links}
    </div>
  );

  return createPortal(drawer, document.body);
}
