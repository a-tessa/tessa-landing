import type { AboutPillar } from "@/lib/about-content";
import { cn } from "@/lib/utils";

interface AboutPillarsProps {
  mission: AboutPillar;
  vision: AboutPillar;
  values: AboutPillar;
  className?: string;
}

const PILLAR_NUMBERS = ["01", "02", "03"] as const;

export function AboutPillars({
  mission,
  vision,
  values,
  className,
}: AboutPillarsProps) {
  const pillars = [mission, vision, values];

  return (
    <ul
      className={cn(
        "grid w-full gap-4 md:grid-cols-3 md:gap-6",
        className,
      )}
    >
      {pillars.map((pillar, index) => (
        <li
          key={pillar.title}
          className="rounded-3xl border border-border bg-card p-6 sm:p-8"
        >
          <span className="font-barlow text-sm font-medium tabular-nums text-muted-foreground/70">
            {PILLAR_NUMBERS[index]}
          </span>
          <h3 className="mt-3 font-barlow text-base font-bold uppercase tracking-wide text-foreground sm:text-lg">
            {pillar.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {pillar.description}
          </p>
        </li>
      ))}
    </ul>
  );
}
