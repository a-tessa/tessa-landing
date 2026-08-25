/**
 * Catch-all for paths that do not match a landing route.
 *
 * Chosen over `src/proxy.ts` so unknown URLs reuse `fetchRedirects` with the
 * same ISR (60s) as published content, without a lookup on every matched
 * request. Existing routes keep zero extra cost. Assets, `/api`, `/_next` and
 * files with an extension stay outside `[locale]` (see the proxy matcher).
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildManagedPageMetadata } from "@/lib/seo/page-seo";
import { redirectIfNeeded } from "@/lib/seo/apply-redirect";

interface CatchAllPageProps {
  params: Promise<{ locale: string; rest: string[] }>;
}

function pathFromRest(rest: string[]): string {
  return `/${rest.join("/")}`;
}

export async function generateMetadata({
  params,
}: CatchAllPageProps): Promise<Metadata> {
  const { locale, rest } = await params;
  const path = pathFromRest(rest);
  await redirectIfNeeded(locale, path);

  return buildManagedPageMetadata({
    locale,
    pageKey: "nao-encontrada",
    path,
    fallbackTitle: "Página não encontrada",
    fallbackDescription: "A página que você procura não existe ou foi movida.",
    noIndex: true,
  });
}

export default async function CatchAllPage({ params }: CatchAllPageProps) {
  const { locale, rest } = await params;
  await redirectIfNeeded(locale, pathFromRest(rest));
  notFound();
}
