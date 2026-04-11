import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BackNavLinkProps {
	href: string;
	label: string;
	navLabel: string;
	className?: string;
}

export function BackNavLink({
	href,
	label,
	navLabel,
	className,
}: BackNavLinkProps) {
	return (
		<nav aria-label={navLabel} className={cn(className)}>
			<Link
				href={href}
				className="inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
			>
				<ArrowLeft
					className="size-4 shrink-0 text-primary"
					strokeWidth={2.5}
					aria-hidden
				/>
				{label}
			</Link>
		</nav>
	);
}
