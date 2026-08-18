"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { cn, freeSectionShellSpacing } from "@/lib/utils";
import { resolveResultsStats } from "@/lib/results-content";
import type { ResultStat } from "@/lib/results-content";

interface Stat {
  prefix: string;
  value: number;
  suffix: string;
  label: string;
}

interface ResultsProps {
  resultsSection?: unknown;
}

const FALLBACK_LABEL_COUNT = 3;

function resolveStatLabel(
  stat: ResultStat,
  index: number,
  t: ReturnType<typeof useTranslations>,
): string {
  if (typeof stat.label === "string" && stat.label.trim().length > 0) {
    return stat.label.trim();
  }

  if (index < FALLBACK_LABEL_COUNT) {
    return t(`stats.${String(index)}.label`);
  }

  return "";
}

function roundCount(value: number, target: number): number {
  if (Number.isInteger(target)) return Math.round(value);
  return Math.round(value * 10) / 10;
}

function useCountUp(
  target: number,
  duration: number,
  shouldStart: boolean,
): number {
  const [count, setCount] = useState(target);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setCount(target);
  }, [target]);

  useEffect(() => {
    if (!shouldStart) return;

    let start: number | null = null;
    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(roundCount(eased * target, target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, shouldStart]);

  return count;
}

function AnimatedStat({
  stat,
  shouldStart,
  compact,
}: {
  stat: Stat;
  shouldStart: boolean;
  compact: boolean;
}) {
  const count = useCountUp(stat.value, 2000, shouldStart);

  return (
    <li
      className="flex flex-col items-center gap-1 lg:items-start"
      aria-label={`${stat.prefix}${String(stat.value)}${stat.suffix} ${stat.label}`}
    >
      <p
        className={cn(
          "font-barlow font-extrabold tabular-nums text-white",
          compact
            ? "text-4xl sm:text-5xl lg:text-6xl"
            : "text-5xl sm:text-6xl lg:text-7xl",
        )}
      >
        <span className="text-primary-foreground">{stat.prefix}</span>
        {count}
        {stat.suffix}
      </p>
      <p className="max-w-40 text-pretty text-center text-xs font-bold uppercase tracking-wide text-primary-foreground/70 lg:text-left">
        {stat.label}
      </p>
    </li>
  );
}

export function Results({ resultsSection }: ResultsProps = {}) {
  const t = useTranslations("results");
  const resolved = resolveResultsStats(resultsSection);
  const STATS: Stat[] = resolved.map((stat, index) => ({
    prefix: "+",
    value: stat.value,
    suffix: stat.suffix,
    label: resolveStatLabel(stat, index, t),
  }));
  const compact: boolean = STATS.length > 3;

  const sectionRef = useRef<HTMLElement>(null);
  const [hasEntered, setHasEntered] = useState(false);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        setHasEntered(true);
      }
    },
    [],
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.3,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersection]);

  return (
    <section
      ref={sectionRef}
      aria-label={t("ariaLabel")}
      className={cn("w-full py-8 sm:py-12", freeSectionShellSpacing)}
    >
      <div className="flex flex-col items-center gap-8 rounded-3xl bg-primary px-8 py-10 sm:px-12 sm:py-14 lg:flex-row lg:gap-12 lg:px-16">
        <h2 className="shrink-0 whitespace-pre-line text-balance font-barlow text-2xl font-bold uppercase leading-tight text-white sm:text-3xl lg:text-4xl">
          {t("title")}
        </h2>

        <ul
          className={cn(
            "m-0 flex flex-1 list-none flex-wrap items-start justify-center p-0 lg:justify-around",
            compact ? "gap-6 sm:gap-8 lg:gap-4" : "gap-8 sm:gap-12 lg:gap-6",
          )}
        >
          {STATS.map((stat, index) => (
            <AnimatedStat
              key={`${stat.label}-${String(index)}`}
              stat={stat}
              shouldStart={hasEntered}
              compact={compact}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
