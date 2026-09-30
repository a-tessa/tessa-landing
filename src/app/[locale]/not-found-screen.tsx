"use client";

import Image from "next/image";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, type ReactNode } from "react";
import { NavbarPage } from "@/components/marketing/NavbarPage";
import { localePath, routing, type Locale } from "@/i18n/routing";
import { insideCardSpacing } from "@/lib/utils";

export interface NotFoundCopy {
  locale: Locale;
  title: string;
  description: string;
  cta: string;
}

function localeFromPathname(pathname: string): Locale {
  const segment = pathname.split("/").filter(Boolean)[0];
  if (segment === "en" || segment === "es") return segment;
  return routing.defaultLocale;
}

interface NotFoundScreenProps {
  copies: readonly NotFoundCopy[];
  footers: Record<Locale, ReactNode>;
}

export function NotFoundScreen({ copies, footers }: NotFoundScreenProps) {
  const pathname = usePathname() ?? "/";
  const locale = localeFromPathname(pathname);
  const copy = copies.find((item) => item.locale === locale) ?? copies[0];

  useLayoutEffect(() => {
    if (!copy || copy.locale === routing.defaultLocale) return;
    const separator = " | ";
    const suffixIndex = document.title.lastIndexOf(separator);
    const suffix =
      suffixIndex === -1 ? "" : document.title.slice(suffixIndex);
    document.title = `${copy.title}${suffix}`;
  }, [copy]);

  if (!copy) return null;

  return (
    <>
      <main className="flex flex-col items-center justify-center">
        <div className="relative min-h-[80vh] w-full">
          <div className="fixed top-6 z-40 flex min-h-[80vh] w-[calc(100%-2.5rem)] translate-x-1/2 right-1/2 flex-col rounded-3xl bg-black/80 saturate-30 text-white">
            <div className={insideCardSpacing}>
              <NavbarPage />
            </div>

            <div
              className={`${insideCardSpacing} flex flex-1 flex-col items-center justify-center gap-8 text-center`}
            >
              <Image
                src="/tessa-logo.svg"
                alt="Tessa"
                width={240}
                height={78}
                className="h-16 w-auto sm:h-20"
                priority
              />

              <h1 className="text-2xl font-bold uppercase text-foreground sm:text-4xl">
                {copy.title}
              </h1>

              <p className="max-w-lg text-sm font-semibold uppercase tracking-wide text-white/60 sm:text-base">
                {copy.description}
              </p>

              <NextLink
                href={localePath(copy.locale, "/")}
                className="mt-2 inline-flex items-center gap-2 rounded-lg bg-secondary px-8 py-3.5 text-sm font-semibold text-white uppercase tracking-wide transition-transform hover:-translate-y-0.5"
              >
                {copy.cta}
              </NextLink>
            </div>
          </div>
        </div>
      </main>

      {footers[copy.locale]}
    </>
  );
}
