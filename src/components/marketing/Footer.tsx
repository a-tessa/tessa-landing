import { Instagram, Linkedin, MapPin, Phone, Youtube } from "lucide-react";
import Image from "next/image";
import type { PropsWithChildren } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SITE } from "@/lib/seo/schemas";
import { cn, homeSpacing, insideCardSpacing } from "@/lib/utils";

const MENU_KEYS = [
	{ href: "/a-tessa", key: "about" },
	{ href: "/servicos", key: "services" },
	{ href: "/estruturas", key: "structures" },
	{ href: "/representantes", key: "representatives" },
	{ href: "/blog", key: "blog" },
	{ href: "/contato", key: "contact" },
] as const;

const LEGAL_KEYS = [
	{ href: "/termos-de-uso", key: "terms" },
	{ href: "/politica-de-privacidade", key: "privacy" },
	{ href: "/trabalhe-conosco", key: "careers" },
] as const;

const SOCIAL_LINKS = [
	{ href: SITE.socials.linkedin, key: "linkedin", icon: Linkedin },
	{ href: SITE.socials.youtube, key: "youtube", icon: Youtube },
	{ href: SITE.socials.instagram, key: "instagram", icon: Instagram },
] as const;

function FooterShell({ children, className }: PropsWithChildren<{ className?: string }>) {
	return (
		<div className={cn("", className)}>
			<div className={homeSpacing}>{children}</div>
		</div>
	);
}

export function Footer() {
	const currentYear = new Date().getFullYear();
	const t = useTranslations("footer");

	return (
		<footer
			className="relative overflow-hidden w-[calc(100%-2.6rem)] rounded-3xl mb-20 mx-auto pb-6"
			role="contentinfo"
			aria-label={t("siteLabel")}
			itemScope
			itemType="https://schema.org/Organization"
		>
			<meta itemProp="name" content={SITE.name} />
			<meta itemProp="url" content={SITE.domain} />

			<div className="lg:px-0 bg-[oklch(0.22_0_0)] text-white">
				<div className={cn("grid grid-cols-1 lg:grid-cols-12 pl-86", insideCardSpacing)}>
					{/* Newsletter */}
					<div className="lg:col-span-4 pt-14 pb-14">
						<Link
							href="/"
							aria-label={t("homeLabel")}
							className="inline-block"
						>
							<Image
								src="/tessa-logo.svg"
								alt={t("logoAlt")}
								width={160}
								height={52}
								className="h-11 w-auto sm:h-12"
							/>
						</Link>

						<div className="mt-10">
							<h2 className="font-barlow text-sm font-bold uppercase leading-snug tracking-[0.12em] text-primary sm:text-base">
								{t("newsletterTitle")}
							</h2>
							<p className="mt-2 font-barlow text-[0.65rem] font-semibold uppercase leading-relaxed tracking-[0.14em] text-white sm:text-xs">
								{t("newsletterSub")}
							</p>
						</div>

						<form
							className="mt-6 flex max-w-md flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-0"
							aria-label={t("formLabel")}
						>
							<label htmlFor="footer-email" className="sr-only">
								{t("emailLabel")}
							</label>
							<input
								id="footer-email"
								type="email"
								name="email"
								autoComplete="email"
								required
								placeholder={t("emailPlaceholder")}
								className="min-h-12 min-w-0 flex-1 rounded-xl border border-white/20 bg-black/35 px-4 py-3 text-sm text-white placeholder:text-white/45 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:rounded-r-none sm:rounded-l-xl"
							/>
							<button
								type="submit"
								className="min-h-12 shrink-0 rounded-xl bg-secondary px-5 py-3 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/90 sm:rounded-l-none sm:rounded-r-xl"
							>
								{t("subscribe")}
							</button>
						</form>
					</div>

					{/* Menu */}
					<nav
						className="lg:col-span-2 lg:col-start-5 pt-14 pb-14"
						aria-label={t("menuLabel")}
					>
						<h2 className="font-barlow text-sm font-bold uppercase tracking-[0.14em] text-primary sm:text-base">
							{t("menuTitle")}
						</h2>
						<ul className="mt-6 space-y-3">
							{MENU_KEYS.map(({ href, key }) => (
								<li key={href}>
									<Link
										href={href}
										className="font-barlow text-sm font-semibold uppercase tracking-[0.06em] text-white transition-colors hover:text-primary"
									>
										{t(`links.${key}`)}
									</Link>
								</li>
							))}
						</ul>
					</nav>

					{/* Contato / mapa */}
					<div className="relative min-h-[220px] lg:col-span-6 flex items-end px-10">
						<div
							className="pointer-events-none absolute inset-0"
							aria-hidden
						>
							<div
								className="absolute inset-0 bg-[url('/city-bg.webp')] bg-right bg-no-repeat opacity-25 bg-cover"
							/>
						</div>

						<div className="relative z-10">
							<h2 className="font-barlow text-sm font-bold uppercase leading-tight tracking-[0.12em] text-primary sm:text-base whitespace-pre-line">
								{t("contactTitle")}
							</h2>

							<address
								className="mt-6 space-y-4 not-italic"
								itemProp="address"
								itemScope
								itemType="https://schema.org/PostalAddress"
							>
								{SITE.phones.map((phone) => (
									<a
										key={phone}
										href={`tel:${phone.replace(/\s/g, "")}`}
										className="flex items-center gap-2.5 text-sm font-medium text-white/95 transition-colors hover:text-primary"
										itemProp="telephone"
									>
										<Phone
											className="size-4 shrink-0 text-primary"
											strokeWidth={2}
											aria-hidden
										/>
										{phone}
									</a>
								))}

								<div className="flex items-start gap-2.5 text-sm font-medium uppercase leading-snug text-white/95">
									<MapPin
										className="mt-0.5 size-4 shrink-0 text-primary"
										strokeWidth={2}
										aria-hidden
									/>
									<span className="max-w-4/6">
										<span itemProp="streetAddress">
											{SITE.address.streetAddress}
										</span>
										{", "}
										<span itemProp="addressLocality">
											{SITE.address.addressLocality}
										</span>{" "}
										<span itemProp="postalCode">
											{SITE.address.postalCode.replace(/-/g, "")}
										</span>
									</span>
								</div>
							</address>

							<div className="mt-6 flex justify-end">
								<div
									className="h-1 w-full rounded-full bg-primary"
									aria-hidden
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Barra inferior */}
			<div className="border-t border-white/10 bg-[oklch(0.22_0_0)] text-white rounded-b-3xl">
				<FooterShell>
					<div className="grid grid-cols-1 gap-6 py-6 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-6 lg:py-7">
						<p className="text-center text-xs text-white/50 md:text-left w-[515px]">
							© {currentYear} {SITE.name}. {t("allRightsReserved")}
						</p>

						<nav
							className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2"
							aria-label={t("legalLabel")}
						>
							{LEGAL_KEYS.map(({ href, key }, index) => (
								<span key={href} className="inline-flex items-center gap-2">
									{index > 0 && (
										<span className="text-[0.65rem] text-white/40" aria-hidden>
											•
										</span>
									)}
									<Link
										href={href}
										className="font-barlow text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:text-primary sm:text-xs"
									>
										{t(`legal.${key}`)}
									</Link>
								</span>
							))}
						</nav>

						<div className="flex items-center justify-center gap-3 md:justify-end">
							{SOCIAL_LINKS.map(({ href, key, icon: Icon }) => (
								<a
									key={href}
									href={href}
									target="_blank"
									rel="noopener noreferrer"
									aria-label={t(`social.${key}`)}
									className="flex size-9 items-center justify-center rounded-md bg-primary text-white transition-colors hover:bg-primary/90"
									itemProp="sameAs"
								>
									<Icon className="size-[18px]" strokeWidth={2} aria-hidden />
								</a>
							))}
						</div>
					</div>
				</FooterShell>
			</div>
		</footer>
	);
}
