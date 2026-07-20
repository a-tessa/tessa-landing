"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Heading } from "./Heading";

/**
 * Maps pathname → i18n namespace under `pages.*`.
 * Longest prefix wins first, so nested routes (e.g. `/servicos/detalhe`)
 * match their parent unless listed explicitly above.
 */
const ROUTE_NAMESPACES = [
  {
    prefix: "/servicos",
    namespace: "pages.servicos",
    backgroundSrc: "/services-heading.webp",
  },
  {
    prefix: "/representantes",
    namespace: "pages.representantes",
    /** Banner Elementor 725fee5 — path distinto evita cache do otimizador Next em troca de arquivo. */
    backgroundSrc: "/representantes-banner.jpg",
  },
  {
    prefix: "/blog",
    namespace: "pages.blog",
    backgroundSrc: "/blog-heading.jpg",
  },
  {
    prefix: "/downloads",
    namespace: "pages.downloads",
    backgroundSrc: "/blog-heading.jpg",
  },
  {
    prefix: "/contato",
    namespace: "pages.contato",
    /** Banner Elementor 748b261 */
    backgroundSrc: "/contato-banner.webp",
  },
] as const;

type RouteConfig = (typeof ROUTE_NAMESPACES)[number];
type RouteNamespace = RouteConfig["namespace"];

export function resolveHeadingNamespace(
  pathname: string,
): RouteNamespace | null {
  const match = ROUTE_NAMESPACES.find(
    ({ prefix }) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  return match?.namespace ?? null;
}

function resolveHeadingConfig(pathname: string): RouteConfig | null {
  return (
    ROUTE_NAMESPACES.find(
      ({ prefix }) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    ) ?? null
  );
}

interface RouteHeadingProps {
  /** Optional override — skips auto-detection when provided. */
  namespace?: RouteNamespace;
  /** Optional override for the heading background image. */
  backgroundSrc?: string;
  /** Optional override for the heading background image alt text. */
  backgroundAlt?: string;
}

/**
 * Auto-wires `<Heading />` with the correct translation keys based on
 * the current route. Add new pages to `ROUTE_NAMESPACES` to support them.
 */
export function RouteHeading({
  namespace,
  backgroundSrc,
  backgroundAlt,
}: RouteHeadingProps = {}) {
  const pathname = usePathname();
  const routeConfig = resolveHeadingConfig(pathname);
  const resolvedNamespace = namespace ?? routeConfig?.namespace ?? null;

  if (!resolvedNamespace) return null;

  return (
    <RouteHeadingInner
      namespace={resolvedNamespace}
      backgroundSrc={backgroundSrc ?? routeConfig?.backgroundSrc}
      backgroundAlt={backgroundAlt}
    />
  );
}

function RouteHeadingInner({
  namespace,
  backgroundSrc,
  backgroundAlt,
}: {
  namespace: RouteNamespace;
  backgroundSrc?: string;
  backgroundAlt?: string;
}) {
  const t = useTranslations(namespace);
  const resolvedBackgroundAlt =
    backgroundAlt ??
    (t.has("headingImageAlt") ? t("headingImageAlt") : undefined);

  return (
    <Heading
      title={t("title")}
      description={t("description")}
      backgroundSrc={backgroundSrc}
      backgroundAlt={resolvedBackgroundAlt}
    />
  );
}
