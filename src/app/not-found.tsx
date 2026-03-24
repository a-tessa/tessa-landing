import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Footer } from "@/components/marketing/Footer";
import { NavbarPage } from "@/components/marketing/NavbarPage";
import { insideCardSpacing } from "@/lib/utils";

export const metadata: Metadata = {
	title: "Página não encontrada",
	description:
		"A página que você procura não existe ou foi movida. Volte à página inicial da Tessa.",
};

export default function NotFound() {
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
								Página não encontrada
							</h1>

							<p className="max-w-lg text-sm font-semibold uppercase tracking-wide text-white/60 sm:text-base">
								Parece que essa página não existe. Acesse a
								página inicial para explorar nossos serviços,
								soluções e conteúdos.
							</p>

							<Link
								href="/home"
								className="mt-2 inline-flex items-center gap-2 rounded-lg bg-secondary px-8 py-3.5 text-sm font-semibold text-white uppercase tracking-wide transition-transform hover:-translate-y-0.5"
							>
								Explorar conteúdos
							</Link>
						</div>
					</div>
				</div>
			</main>

			<Footer />
		</>
	);
}
