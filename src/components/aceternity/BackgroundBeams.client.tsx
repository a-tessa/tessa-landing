"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Lightweight animated background (client-only).
 * Replace later with a real Aceternity component if desired.
 */
export function BackgroundBeams({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/20 to-transparent" />
      <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-56 right-[-120px] h-[520px] w-[520px] rounded-full bg-emerald-400/15 blur-3xl" />

      {mounted ? (
        <div className="absolute inset-0 opacity-60 mask-[radial-gradient(ellipse_at_center,black,transparent_70%)]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-size-[48px_48px] animate-[pan_18s_linear_infinite]" />
        </div>
      ) : null}

      <style jsx>{`
        @keyframes pan {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-48px, -48px, 0);
          }
        }
      `}</style>
    </div>
  );
}
