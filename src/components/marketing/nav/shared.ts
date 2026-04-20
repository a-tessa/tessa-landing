export const NAV_KEYS = [
  { href: "/", key: "about" },
  { href: "/servicos", key: "services" },
  { href: "/representantes", key: "representatives" },
  { href: "/blog", key: "blog" },
  { href: "/contato", key: "contact" },
] as const;

export const isActivePath = (pathname: string, href: string): boolean =>
  pathname === href || pathname.startsWith(`${href}/`);
