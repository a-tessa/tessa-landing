import { permanentRedirect, redirect } from "next/navigation";
import { fetchRedirects } from "@/lib/api/redirects";
import {
  localizeRedirectTarget,
  resolveRedirect,
} from "@/lib/seo/resolve-redirect";

export async function redirectIfNeeded(
  locale: string,
  path: string,
): Promise<void> {
  const redirects = await fetchRedirects();
  const resolved = resolveRedirect(path, redirects);
  if (!resolved) return;

  const destination = localizeRedirectTarget(locale, resolved.toPath);
  // Next.js App Router emits 308 for permanentRedirect (method-preserving
  // equivalent of 301). Other codes use redirect (307).
  if (resolved.statusCode === 301) {
    permanentRedirect(destination);
  }
  redirect(destination);
}
