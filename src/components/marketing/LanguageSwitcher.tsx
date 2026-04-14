"use client";

import { useRef, useState, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { cn } from "@/lib/utils";

const LOCALES: { code: Locale; flag: React.ReactNode; short: string }[] = [
  { code: "pt-BR", flag: <BrazilFlag />, short: "PT" },
  { code: "en", flag: <USFlag />, short: "EN" },
  { code: "es", flag: <SpainFlag />, short: "ES" },
];

function BrazilFlag() {
  return (
    <svg viewBox="0 0 24 18" className="h-4 w-5 shrink-0 rounded-[2px]" aria-hidden>
      <rect width="24" height="18" fill="#009739" rx="2" />
      <path d="M12 1.5L21 9L12 16.5L3 9Z" fill="#FEDD00" />
      <circle cx="12" cy="9" r="4" fill="#002776" />
      <path d="M8.5 9.5Q12 7 15.5 9.5" stroke="white" strokeWidth="0.5" fill="none" />
    </svg>
  );
}

function USFlag() {
  return (
    <svg viewBox="0 0 24 18" className="h-4 w-5 shrink-0 rounded-[2px]" aria-hidden>
      <rect width="24" height="18" fill="#fff" rx="2" />
      <g fill="#B22234">
        {[0, 2.77, 5.54, 8.31, 11.08, 13.85, 16.62].map((y) => (
          <rect key={y} y={y} width="24" height="1.385" />
        ))}
      </g>
      <rect width="10" height="9.69" fill="#3C3B6E" />
      <g fill="white">
        {[1.5, 4.5, 7.5].map((x) =>
          [1.2, 3.4, 5.6, 7.8].map((y) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="0.5" />
          )),
        )}
        {[3, 6].map((x) =>
          [2.3, 4.5, 6.7].map((y) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="0.5" />
          )),
        )}
      </g>
    </svg>
  );
}

function SpainFlag() {
  return (
    <svg viewBox="0 0 24 18" className="h-4 w-5 shrink-0 rounded-[2px]" aria-hidden>
      <rect width="24" height="18" fill="#AA151B" rx="2" />
      <rect y="4.5" width="24" height="9" fill="#F1BF00" />
    </svg>
  );
}

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const locale = useLocale();
  const t = useTranslations("nav");
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useOutsideClick(ref, useCallback(() => setOpen(false), []));

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  function handleSelect(code: Locale) {
    setOpen(false);
    router.replace(pathname, { locale: code });
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 items-center gap-1.5 rounded px-1 transition-opacity hover:opacity-80"
        aria-label={t("selectLanguage")}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {current.flag}
        <span className="text-[10px] font-semibold uppercase tracking-wide text-white/80">
          {current.short}
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t("selectLanguage")}
          className="absolute right-0 top-full z-50 mt-2 min-w-36 overflow-hidden rounded-lg border border-white/10 bg-[oklch(0.25_0.01_250)] py-1 shadow-xl backdrop-blur-md"
        >
          {LOCALES.map(({ code, flag, short }) => {
            const isActive = code === locale;
            return (
              <li key={code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => handleSelect(code)}
                  className={cn(
                    "flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors",
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white",
                  )}
                >
                  {flag}
                  <span className="font-medium">{short}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
