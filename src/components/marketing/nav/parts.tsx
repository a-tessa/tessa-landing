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
import { ChevronDown, Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  NAV_DIVIDER_CLASS,
  NAV_ICON_CLASS,
  NAV_INACTIVE_LINK_CLASS,
  NAV_KEYS,
  NAV_LOGO_SRC,
  NAV_MUTED_TEXT_CLASS,
  isActivePath,
  type NavTone,
} from "./shared";
import { useNavServices } from "./services-context";

export type { NavTone };

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
  /** White on home; black on inner pages. */
  tone?: NavTone;
}

export function NavLogo({ inline = false, tone = "white" }: NavLogoProps) {
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
        src={NAV_LOGO_SRC[tone]}
        alt="Tessa"
        width={80}
        height={40}
        className="h-8 w-auto sm:h-10 mb-1"
        priority
      />
      {inline && (
        <>
          <span
            className={cn("hidden h-4 w-px sm:block", NAV_DIVIDER_CLASS[tone])}
            aria-hidden
          />
          <span
            className={cn(
              "hidden text-xs font-medium uppercase tracking-wide sm:block",
              NAV_MUTED_TEXT_CLASS[tone],
            )}
          >
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
        className={cn("hidden h-4 w-px shrink-0 sm:block", NAV_DIVIDER_CLASS[tone])}
        aria-hidden
      />
      <span
        className={cn(
          "hidden text-xs font-medium uppercase tracking-wide sm:block",
          NAV_MUTED_TEXT_CLASS[tone],
        )}
      >
        {t("since")}
      </span>
    </div>
  );
}

interface DesktopLinksProps {
  activeClassName: string;
  tone?: NavTone;
}

const DESKTOP_LINK_CLASS =
  "hidden text-xs font-medium uppercase leading-none tracking-wide transition-colors sm:block";

interface NavDropdownPosition {
  top: number;
  left: number;
}

function useNavDropdownPosition(
  triggerRef: RefObject<HTMLElement | null>,
  open: boolean,
): NavDropdownPosition | null {
  const [position, setPosition] = useState<NavDropdownPosition | null>(null);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    setPosition({
      top: rect.bottom + 8,
      left: rect.left,
    });
  }, [triggerRef]);

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

function ServicesNavLink({
  activeClassName,
  tone = "white",
}: DesktopLinksProps) {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const serviceItems = useNavServices();
  const isActive = isActivePath(pathname, "/servicos");
  const hasDropdown = serviceItems.length > 0;
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const dropdownPosition = useNavDropdownPosition(triggerRef, open);
  const inactiveClassName = NAV_INACTIVE_LINK_CLASS[tone];

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimerRef.current = window.setTimeout(() => setOpen(false), 120);
  }, [cancelClose]);

  const handleOpen = useCallback(() => {
    cancelClose();
    setOpen(true);
  }, [cancelClose]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  if (!hasDropdown) {
    return (
      <Link
        href="/servicos"
        className={cn(
          DESKTOP_LINK_CLASS,
          isActive ? activeClassName : inactiveClassName,
        )}
      >
        {t("services")}
      </Link>
    );
  }

  const dropdown =
    open && dropdownPosition
      ? createPortal(
          <div
            ref={dropdownRef}
            role="menu"
            aria-label={t("services")}
            style={{
              position: "fixed",
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              zIndex: 60,
            }}
            className="max-h-80 min-w-56 overflow-y-auto rounded-lg border border-white/10 bg-[oklch(0.25_0.01_250)] py-1 shadow-xl backdrop-blur-md"
            onMouseEnter={handleOpen}
            onMouseLeave={scheduleClose}
          >
            {serviceItems.map((item) => {
              const itemHref = `/servicos/${item.slug}`;
              const isItemActive = pathname === itemHref;

              return (
                <Link
                  key={item.slug}
                  href={itemHref}
                  role="menuitem"
                  className={cn(
                    "block px-4 py-2.5 text-xs font-medium uppercase tracking-wide transition-colors hover:bg-white/10",
                    isItemActive ? activeClassName : "text-white/90 hover:text-white",
                  )}
                >
                  {item.title}
                </Link>
              );
            })}
          </div>,
          document.body,
        )
      : null;

  return (
    <div
      ref={triggerRef}
      className="relative hidden sm:flex sm:items-center"
      onMouseEnter={handleOpen}
      onMouseLeave={scheduleClose}
    >
      <Link
        href="/servicos"
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          "inline-flex items-center gap-0.5 text-xs font-medium uppercase leading-none tracking-wide transition-colors",
          isActive ? activeClassName : inactiveClassName,
        )}
      >
        {t("services")}
        <ChevronDown
          size={12}
          className={cn(
            "shrink-0 opacity-70 transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </Link>

      {dropdown}
    </div>
  );
}

export function DesktopLinks({
  activeClassName,
  tone = "white",
}: DesktopLinksProps) {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const inactiveClassName = NAV_INACTIVE_LINK_CLASS[tone];

  return (
    <>
      {NAV_KEYS.map(({ href, key }) =>
        href === "/servicos" ? (
          <ServicesNavLink
            key={href}
            activeClassName={activeClassName}
            tone={tone}
          />
        ) : (
          <Link
            key={href}
            href={href}
            className={cn(
              DESKTOP_LINK_CLASS,
              isActivePath(pathname, href)
                ? activeClassName
                : inactiveClassName,
            )}
          >
            {t(key)}
          </Link>
        ),
      )}
    </>
  );
}

interface MobileToggleProps {
  open: boolean;
  onToggle: () => void;
  tone?: NavTone;
}

export function MobileToggle({
  open,
  onToggle,
  tone = "white",
}: MobileToggleProps) {
  const t = useTranslations("nav");

  return (
    <button
      type="button"
      className={cn(
        "flex size-9 items-center justify-center rounded sm:hidden",
        NAV_ICON_CLASS[tone],
      )}
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
  /** Vertical gap (px) between the anchor's bottom and the drawer. */
  offsetTop?: number;
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
  offsetTop = -10,
  innerClassName,
  linkClassName,
}: MobileDrawerProps) {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const serviceItems = useNavServices();
  const drawerRef = useRef<HTMLDivElement>(null);
  const position = usePortalDrawerPosition(
    portalAnchorRef,
    portalBoundsRef,
    open,
  );

  if (!open || !position) return null;

  const links = NAV_KEYS.map(({ href, key }) => {
    if (href === "/servicos" && serviceItems.length > 0) {
      return (
        <div key={href} className="flex flex-col gap-1">
          <Link
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
          <div className="ml-2 flex flex-col gap-0.5 border-l border-white/15 pl-3">
            {serviceItems.map((item) => {
              const itemHref = `/servicos/${item.slug}`;

              return (
                <Link
                  key={item.slug}
                  href={itemHref}
                  onClick={onClose}
                  className={cn(
                    "py-1.5 text-xs font-medium uppercase tracking-wide",
                    linkClassName,
                    pathname === itemHref ? activeClassName : "text-white/80",
                  )}
                >
                  {item.title}
                </Link>
              );
            })}
          </div>
        </div>
      );
    }

    return (
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
    );
  });

  const drawer = (
    <div
      ref={drawerRef}
      style={{
        position: "fixed",
        top: position.top + offsetTop,
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
