export const NAV_KEYS = [
  { href: "/quem-somos", key: "about" },
  { href: "/servicos", key: "services" },
  { href: "/representantes", key: "representatives" },
  { href: "/blog", key: "blog" },
  { href: "/downloads", key: "downloads" },
  { href: "/galeria", key: "gallery" },
  { href: "/contato", key: "contact" },
] as const;

/** White logo/links on home; black logo/links on inner pages. */
export type NavTone = "white" | "black";

export const NAV_INACTIVE_LINK_CLASS: Record<NavTone, string> = {
  white: "text-white/90 hover:text-white",
  black: "text-foreground/90 hover:text-foreground",
};

export const NAV_MUTED_TEXT_CLASS: Record<NavTone, string> = {
  white: "text-white/60",
  black: "text-foreground/60",
};

export const NAV_DIVIDER_CLASS: Record<NavTone, string> = {
  white: "bg-white/40",
  black: "bg-foreground/40",
};

export const NAV_ICON_CLASS: Record<NavTone, string> = {
  white: "text-white",
  black: "text-foreground",
};

export const NAV_LOGO_SRC: Record<NavTone, string> = {
  white: "/tessa-logo.svg",
  black: "/tessa-logo-dark.svg",
};

export const isActivePath = (pathname: string, href: string): boolean =>
  pathname === href || pathname.startsWith(`${href}/`);
