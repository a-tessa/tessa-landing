"use client";

import { useEffect, useState } from "react";

export function useScrollProgress(threshold: number) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollProgress = Math.min(scrollY / threshold, 1);
  return { scrollProgress, expanded: scrollProgress >= 1 };
}
