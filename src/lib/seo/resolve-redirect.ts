import { localePath } from "@/i18n/routing";
import type { PublicRedirect } from "@/lib/api/redirects";

export interface ResolvedRedirect {
  toPath: string;
  statusCode: number;
}

export function pathWithoutLocalePrefix(pathname: string): string {
  const withSlash = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const match = withSlash.match(/^\/(en|es)(?=\/|$)/);
  if (!match) return withSlash === "" ? "/" : withSlash;
  const rest = withSlash.slice(match[0].length);
  return rest.length === 0 ? "/" : rest;
}

export function resolveRedirect(
  path: string,
  redirects: readonly PublicRedirect[],
): ResolvedRedirect | null {
  const normalized =
    pathWithoutLocalePrefix(path).replace(/\/+$/, "").toLowerCase() || "/";
  const match = redirects.find((entry) => entry.fromPath === normalized);
  if (!match) return null;
  return { toPath: match.toPath, statusCode: match.statusCode };
}

/**
 * Prefixes an internal destination with the visitor locale using the same
 * next-intl `as-needed` routing as `getPathname` (`localePath`). Absolute
 * URLs pass through unchanged. `getPathname` itself is not used here because
 * it pulls the next-intl client runtime and cannot be imported from unit tests.
 */
export function localizeRedirectTarget(locale: string, toPath: string): string {
  if (/^https?:\/\//i.test(toPath)) return toPath;
  const href = toPath.startsWith("/") ? toPath : `/${toPath}`;
  return localePath(locale, href);
}
