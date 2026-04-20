import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn, freeSectionShellSpacing } from "@/lib/utils";

export function BlogRepresentativesCta() {
	const t = useTranslations("blogCta");

	return (
		<section
			className={cn("w-full pb-16", freeSectionShellSpacing)}
			aria-labelledby="blog-representantes-cta-heading"
		>
			<div className="relative isolate flex min-h-36 flex-col justify-center gap-6 overflow-hidden rounded-3xl bg-primary px-6 py-8 sm:min-h-32 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-14">
				<Image
					src="/find-representant.webp"
					alt=""
					fill
					className="z-0 object-cover object-center"
					sizes="(max-width: 768px) 100vw, 85vw"
					aria-hidden
				/>
				{/* <div className="absolute inset-0 z-1 bg-primary/80" aria-hidden /> */}

				<div className="relative z-10">
					<h2
						id="blog-representantes-cta-heading"
						className="text-2xl font-bold uppercase tracking-wide text-secondary-foreground sm:text-3xl"
					>
						{t("title")}
					</h2>
					<p className="mt-1 text-xl font-light uppercase tracking-wide text-secondary-foreground/95 sm:text-3xl">
						{t("subtitle")}
					</p>
				</div>

				<Link
					href="/representantes"
					className="relative z-10 inline-flex shrink-0 items-center justify-center gap-2 self-stretch rounded-xl bg-secondary px-6 py-3.5 text-center text-sm font-semibold text-secondary-foreground transition-transform hover:-translate-y-0.5 sm:self-center sm:px-8"
				>
					{t("cta")}
					<ArrowRight className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
				</Link>
			</div>
		</section>
	);
}
