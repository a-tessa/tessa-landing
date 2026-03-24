"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Container } from "./Container";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const navLinks = [
	{ href: "/", label: "A TESSA" },
	{ href: "/servicos", label: "SERVIÇOS" },
	{ href: "/representantes", label: "REPRESENTANTES" },
	{ href: "/blog", label: "BLOG" },
	{ href: "/contato", label: "CONTATO" },
] as const;

function BrazilFlagIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" className={className} aria-hidden>
			<rect width="24" height="24" fill="#009739" rx="2" />
			<path
				d="M12 2L14.5 9L22 9L16 13L18 21L12 16L6 21L8 13L2 9L9.5 9Z"
				fill="#FEDD00"
			/>
			<circle cx="12" cy="12" r="4.5" fill="#002776" />
			<g fill="white">
				<circle cx="12" cy="10" r="0.5" />
				<circle cx="12.8" cy="10.8" r="0.5" />
				<circle cx="11.2" cy="10.8" r="0.5" />
				<circle cx="13.2" cy="12" r="0.5" />
				<circle cx="10.8" cy="12" r="0.5" />
				<circle cx="12" cy="14" r="0.5" />
			</g>
		</svg>
	);
}

export function NavbarPage() {
	const pathname = usePathname();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<nav
			className="relative flex h-18 w-full shrink-0 items-center justify-between"
			style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}
		>
			<div className="flex items-center gap-3 sm:gap-4">
				<Link href="/" className="flex items-center gap-2 sm:gap-3">
					<Image
						src="/tessa-logo.svg"
						alt="Tessa"
						width={80}
						height={40}
						className="h-8 w-auto sm:h-10"
						priority
					/>
				</Link>
				<span
					className="hidden h-4 w-px shrink-0 bg-white/40 sm:block"
					aria-hidden
				/>
				<span className="hidden text-xs font-medium uppercase tracking-wide text-white/60 sm:block">
					DESDE 2001
				</span>
			</div>

			<div className="flex items-center gap-4 sm:gap-6">
				{navLinks.map(({ href, label }) => {
					const isActive =
						pathname === href || pathname.startsWith(`${href}/`);
					return (
						<Link
							key={href}
							href={href}
							className={cn(
								"hidden text-xs font-medium uppercase tracking-wide transition-colors sm:block",
								isActive
									? "text-[#FF6F00]"
									: "text-white/90 hover:text-white",
							)}
						>
							{label}
						</Link>
					);
				})}
				<button
					type="button"
					className="flex h-8 w-8 items-center justify-center rounded transition-opacity hover:opacity-80"
					aria-label="Selecionar idioma"
				>
					<BrazilFlagIcon className="h-6 w-6 rounded-sm" />
				</button>
				<button
					type="button"
					className="flex h-9 w-9 items-center justify-center rounded text-white sm:hidden"
					onClick={() => setMobileMenuOpen((o) => !o)}
					aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
					aria-expanded={mobileMenuOpen}
				>
					{mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
				</button>
			</div>

			{mobileMenuOpen && (
				<div
					className="absolute left-0 right-0 top-full z-10 border-b border-white/10 bg-[#37474F] sm:hidden"
					role="dialog"
					aria-label="Menu de navegação"
				>
					<Container className="flex flex-col gap-1 py-4">
						{navLinks.map(({ href, label }) => {
							const isActive =
								pathname === href || pathname.startsWith(`${href}/`);
							return (
								<Link
									key={href}
									href={href}
									onClick={() => setMobileMenuOpen(false)}
									className={cn(
										"py-2 text-sm font-medium uppercase tracking-wide",
										isActive ? "text-[#FF6F00]" : "text-white/90",
									)}
								>
									{label}
								</Link>
							);
						})}
					</Container>
				</div>
			)}
		</nav>
	);
}
