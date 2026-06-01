"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface HorizontalScrollWithHintsProps {
  children: React.ReactNode;
  ariaLabel: string;
  scrollLeftLabel: string;
  scrollRightLabel: string;
  className?: string;
}

const SCROLL_STEP_PX = 280;
const EDGE_THRESHOLD_PX = 4;

export function HorizontalScrollWithHints({
  children,
  ariaLabel,
  scrollLeftLabel,
  scrollRightLabel,
  className,
}: HorizontalScrollWithHintsProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateEdges = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > EDGE_THRESHOLD_PX);
    setCanScrollRight(el.scrollLeft < maxScroll - EDGE_THRESHOLD_PX);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    updateEdges();
    el.addEventListener("scroll", updateEdges, { passive: true });
    const resizeObserver = new ResizeObserver(updateEdges);
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener("scroll", updateEdges);
      resizeObserver.disconnect();
    };
  }, [updateEdges]);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;

    el.scrollBy({
      left: direction === "left" ? -SCROLL_STEP_PX : SCROLL_STEP_PX,
      behavior: "smooth",
    });
  };

  return (
    <div className={cn("relative min-w-0", className)}>
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-linear-to-r from-muted/40 via-muted/30 to-transparent transition-opacity lg:hidden",
          canScrollLeft ? "opacity-100" : "opacity-0",
        )}
      />
      <button
        type="button"
        onClick={() => handleScroll("left")}
        aria-label={scrollLeftLabel}
        aria-hidden={!canScrollLeft}
        tabIndex={canScrollLeft ? 0 : -1}
        className={cn(
          "absolute left-1 top-1/2 z-20 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-background text-foreground shadow-sm ring-1 ring-border transition-opacity hover:bg-accent lg:hidden",
          canScrollLeft ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <ChevronLeft className="size-4" strokeWidth={2} aria-hidden />
      </button>

      <div
        ref={scrollerRef}
        role="region"
        aria-label={ariaLabel}
        className="overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] lg:overflow-visible [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-linear-to-l from-muted/40 via-muted/30 to-transparent transition-opacity lg:hidden",
          canScrollRight ? "opacity-100" : "opacity-0",
        )}
      />
      <button
        type="button"
        onClick={() => handleScroll("right")}
        aria-label={scrollRightLabel}
        aria-hidden={!canScrollRight}
        tabIndex={canScrollRight ? 0 : -1}
        className={cn(
          "absolute right-1 top-1/2 z-20 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-background text-foreground shadow-sm ring-1 ring-border transition-opacity hover:bg-accent lg:hidden",
          canScrollRight ? "opacity-100" : "opacity-0",
        )}
      >
        <ChevronRight className="size-4" strokeWidth={2} aria-hidden />
      </button>
    </div>
  );
}
