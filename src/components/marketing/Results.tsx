"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Container } from "./Container";
import { homeSpacing } from "@/lib/utils";

interface Stat {
  prefix: string;
  value: number;
  suffix: string;
  label: string;
}

const STATS: Stat[] = [
  {
    prefix: "+",
    value: 7,
    suffix: "MI",
    label: "de m² em estruturas metálicas",
  },
  {
    prefix: "+",
    value: 200,
    suffix: "K",
    label: "instalações realizadas no Brasil",
  },
  {
    prefix: "+",
    value: 20,
    suffix: "",
    label: "anos de experiência em engenharia estrutural",
  },
];

function useCountUp(
  target: number,
  duration: number,
  shouldStart: boolean,
): number {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!shouldStart) return;

    let start: number | null = null;
    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));

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
}: {
  stat: Stat;
  shouldStart: boolean;
}) {
  const count = useCountUp(stat.value, 2000, shouldStart);

  return (
    <div className="flex flex-col items-center gap-1 lg:items-start">
      <p className="font-barlow text-5xl font-extrabold text-white sm:text-6xl lg:text-7xl">
        <span className="text-primary-foreground">{stat.prefix}</span>
        {count}
        {stat.suffix}
      </p>
      <p className="max-w-[160px] text-center text-xs font-bold uppercase tracking-wide text-primary-foreground/70 lg:text-left">
        {stat.label}
      </p>
    </div>
  );
}

export function Results() {
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
      aria-label="Resultados da Tessa em números"
      className="w-full py-8 sm:py-12"
    >
      <Container>
        <div className={homeSpacing}>
          <div className="flex flex-col items-center gap-8 rounded-3xl bg-primary px-8 py-10 sm:px-12 sm:py-14 lg:flex-row lg:gap-12 lg:px-16">
            {/* Title */}
            <h2 className="shrink-0 font-barlow text-2xl font-bold uppercase leading-tight text-white sm:text-3xl lg:text-4xl">
              Resultados
              <br />
              que contam
            </h2>

            {/* Stats */}
            <div className="flex flex-1 flex-wrap items-start justify-center gap-8 sm:gap-12 lg:justify-around lg:gap-6">
              {STATS.map((stat) => (
                <AnimatedStat
                  key={stat.label}
                  stat={stat}
                  shouldStart={hasEntered}
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
