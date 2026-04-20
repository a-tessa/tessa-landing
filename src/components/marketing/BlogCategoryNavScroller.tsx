"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface BlogCategoryNavScrollerProps {
	children: React.ReactNode;
	label: string;
	className?: string;
}

const SCROLL_STEP_PX = 240;
const EDGE_THRESHOLD_PX = 4;

export function BlogCategoryNavScroller({
	children,
	label,
	className,
}: BlogCategoryNavScrollerProps) {
	const t = useTranslations("blog");
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
		<div className={cn("relative flex min-w-0 flex-1 items-center", className)}>
			<span
				aria-hidden
				className={cn(
					"pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-linear-to-r from-muted via-muted/90 to-transparent transition-opacity",
					canScrollLeft ? "opacity-100" : "opacity-0",
				)}
			/>
			<button
				type="button"
				onClick={() => handleScroll("left")}
				aria-label={t("scrollLeft")}
				aria-hidden={!canScrollLeft}
				tabIndex={canScrollLeft ? 0 : -1}
				className={cn(
					"absolute left-0 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-background text-foreground shadow-sm ring-1 ring-border transition-opacity hover:bg-accent",
					canScrollLeft ? "opacity-100" : "pointer-events-none opacity-0",
				)}
			>
				<ChevronLeft className="h-4 w-4" strokeWidth={2} aria-hidden />
			</button>

			<nav
				ref={scrollerRef}
				aria-label={label}
				className="blog-category-scroller flex min-w-0 flex-1 items-center gap-x-6 overflow-x-auto"
			>
				{children}
			</nav>

			<span
				aria-hidden
				className={cn(
					"pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-linear-to-l from-muted via-muted/90 to-transparent transition-opacity",
					canScrollRight ? "opacity-100" : "opacity-0",
				)}
			/>
			<button
				type="button"
				onClick={() => handleScroll("right")}
				aria-label={t("scrollRight")}
				aria-hidden={!canScrollRight}
				tabIndex={canScrollRight ? 0 : -1}
				className={cn(
					"absolute right-0 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-background text-foreground shadow-sm ring-1 ring-border transition-opacity hover:bg-accent",
					canScrollRight ? "opacity-100" : "pointer-events-none opacity-0",
				)}
			>
				<ChevronRight className="h-4 w-4" strokeWidth={2} aria-hidden />
			</button>
		</div>
	);
}
