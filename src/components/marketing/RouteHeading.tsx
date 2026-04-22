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
    backgroundSrc: "/representantes-heading.jpg",
  },
  {
    prefix: "/blog",
    namespace: "pages.blog",
    backgroundSrc: "/blog-heading.jpg",
  },
  {
    prefix: "/contato",
    namespace: "pages.contato",
    backgroundSrc: "/representantes-heading.jpg",
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
}

/**
 * Auto-wires `<Heading />` with the correct translation keys based on
 * the current route. Add new pages to `ROUTE_NAMESPACES` to support them.
 */
export function RouteHeading({
  namespace,
  backgroundSrc,
}: RouteHeadingProps = {}) {
  const pathname = usePathname();
  const routeConfig = resolveHeadingConfig(pathname);
  const resolvedNamespace = namespace ?? routeConfig?.namespace ?? null;

  if (!resolvedNamespace) return null;

  return (
    <RouteHeadingInner
      namespace={resolvedNamespace}
      backgroundSrc={backgroundSrc ?? routeConfig?.backgroundSrc}
    />
  );
}

function RouteHeadingInner({
  namespace,
  backgroundSrc,
}: {
  namespace: RouteNamespace;
  backgroundSrc?: string;
}) {
  const t = useTranslations(namespace);
  return (
    <Heading
      title={t("title")}
      description={t("description")}
      backgroundSrc={backgroundSrc}
    />
  );
}
