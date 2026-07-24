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
  },
  {
    prefix: "/representantes",
    namespace: "pages.representantes",
  },
  {
    prefix: "/blog",
    namespace: "pages.blog",
  },
  {
    prefix: "/downloads",
    namespace: "pages.downloads",
  },
  {
    prefix: "/galeria",
    namespace: "pages.gallery",
  },
  {
    prefix: "/contato",
    namespace: "pages.contato",
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
}

/**
 * Auto-wires `<Heading />` with the correct translation keys based on
 * the current route. Add new pages to `ROUTE_NAMESPACES` to support them.
 */
export function RouteHeading({
  namespace,
}: RouteHeadingProps = {}) {
  const pathname = usePathname();
  const routeConfig = resolveHeadingConfig(pathname);
  const resolvedNamespace = namespace ?? routeConfig?.namespace ?? null;

  if (!resolvedNamespace) return null;

  return <RouteHeadingInner namespace={resolvedNamespace} />;
}

function RouteHeadingInner({
  namespace,
}: {
  namespace: RouteNamespace;
}) {
  const t = useTranslations(namespace);

  return (
    <Heading
      title={t("title")}
      description={t("description")}
    />
  );
}
