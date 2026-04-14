import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Footer } from "@/components/marketing/Footer";
import { NavbarPage } from "@/components/marketing/NavbarPage";
import { insideCardSpacing } from "@/lib/utils";

export default function NotFound() {
	const t = useTranslations("notFound");

	return (
		<>
			<main className="flex flex-col items-center justify-center">
				<div className="relative min-h-[80vh] w-full">
					<div className="fixed top-6 z-40 flex min-h-[80vh] w-[calc(100%-2.5rem)] translate-x-1/2 right-1/2 flex-col rounded-3xl bg-black/80 saturate-30 text-white">
						<div className={insideCardSpacing}>
							<NavbarPage />
						</div>

						<div
							className={`${insideCardSpacing} flex flex-1 flex-col items-center justify-center gap-8 text-center`}
						>
							<Image
								src="/tessa-logo.svg"
								alt="Tessa"
								width={240}
								height={78}
								className="h-16 w-auto sm:h-20"
								priority
							/>

							<h1 className="text-2xl font-bold uppercase text-foreground sm:text-4xl">
								{t("title")}
							</h1>

							<p className="max-w-lg text-sm font-semibold uppercase tracking-wide text-white/60 sm:text-base">
								{t("description")}
							</p>

							<Link
								href="/home"
								className="mt-2 inline-flex items-center gap-2 rounded-lg bg-secondary px-8 py-3.5 text-sm font-semibold text-white uppercase tracking-wide transition-transform hover:-translate-y-0.5"
							>
								{t("cta")}
							</Link>
						</div>
					</div>
				</div>
			</main>

			<Footer />
		</>
	);
}
