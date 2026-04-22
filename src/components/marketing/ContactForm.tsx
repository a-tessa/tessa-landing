"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
	useState,
	useCallback,
	useActionState,
	useEffect,
	useRef,
} from "react";
import { Phone, MapPin, Maximize2, CheckCircle2 } from "lucide-react";
import {
	submitContact,
	type ContactActionState,
} from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { BRAZILIAN_STATES } from "@/lib/representatives";
import { cn } from "@/lib/utils";

interface ContactFormServiceOption {
	slug: string;
	title: string;
}

interface ContactFormProps {
	services?: ContactFormServiceOption[];
}

const initialState: ContactActionState = { status: "idle" };

const underlineInput =
	"h-12 focus-visible:border-primary focus-visible:ring-0 bg-white rounded-xl shadow-none";

const underlineTextarea =
	"min-h-32 resize-none rounded-none border-0 border-b border-border bg-transparent px-0 text-sm shadow-none focus-visible:border-primary focus-visible:ring-0";

const fieldLabel =
	"";

const PHONE_MAIN = "+55 17 3267-1230";
const PHONE_ALT = "+55 17 3267-1453";
const ADDRESS_LINE_1 = "Rodovia Assis Chateaubriand SP 425";
const ADDRESS_LINE_2 = "Km 175, Guapiaçu 15110-000";
const MAPS_URL =
	"https://www.google.com/maps/search/?api=1&query=Rodovia+Assis+Chateaubriand+SP+425+Km+175+Guapiacu";

/** Apenas dígitos nacionais (DDD + número), até 11. Remove 55 inicial se colarem +55. */
function normalizeBrazilPhoneDigits(raw: string): string {
	let d = raw.replace(/\D/g, "");
	if (d.startsWith("55") && d.length > 2) {
		d = d.slice(2, 13);
	} else {
		d = d.slice(0, 11);
	}
	return d;
}

/** Máscara (DD) celular 9XXXX-XXXX ou (DD) fixo XXXX-XXXX. */
function formatBrazilPhoneDisplay(digits: string): string {
	if (digits.length === 0) return "";
	if (digits.length <= 2) {
		return `(${digits}`;
	}
	const ddd = digits.slice(0, 2);
	const rest = digits.slice(2);
	const isMobile = rest[0] === "9";
	if (isMobile) {
		const sub = rest.slice(0, 9);
		if (sub.length <= 5) {
			return `(${ddd}) ${sub}`;
		}
		return `(${ddd}) ${sub.slice(0, 5)}-${sub.slice(5)}`;
	}
	const sub = rest.slice(0, 8);
	if (sub.length <= 4) {
		return `(${ddd}) ${sub}`;
	}
	return `(${ddd}) ${sub.slice(0, 4)}-${sub.slice(4)}`;
}

export function ContactForm({ services = [] }: ContactFormProps) {
	const t = useTranslations("contact");
	const [phoneDisplay, setPhoneDisplay] = useState("");
	const [state, formAction, isPending] = useActionState(
		submitContact,
		initialState,
	);
	const formRef = useRef<HTMLFormElement>(null);

	const handlePhoneChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const digits = normalizeBrazilPhoneDigits(e.target.value);
			setPhoneDisplay(formatBrazilPhoneDisplay(digits));
		},
		[],
	);

	useEffect(() => {
		if (state.status === "success") {
			formRef.current?.reset();
			setPhoneDisplay("");
		}
	}, [state.status]);

	return (
		<div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
			<aside className="relative flex w-full flex-col justify-between overflow-hidden rounded-4xl bg-foreground text-white lg:w-[340px] lg:shrink-0">
				<Image
					src="/contact-sidebar-image.webp"
					alt=""
					fill
					className="z-0 object-cover"
					sizes="340px"
					aria-hidden
				/>

				<div className="relative z-10 flex flex-1 flex-col justify-between gap-8 p-8">
					<div>
						<h2 className="whitespace-pre-line text-xl font-bold uppercase leading-tight text-primary sm:text-4xl">
							{t("whereWeAre")}
						</h2>
					</div>

					<div className="mt-auto flex flex-col gap-4 text-sm">
						<a
							href={`tel:${PHONE_MAIN.replace(/\s/g, "")}`}
							className="inline-flex items-center gap-3 transition-colors hover:text-primary"
						>
							<Phone
								className="size-4 shrink-0 text-primary"
								aria-hidden
							/>
							{PHONE_MAIN}
						</a>
						<a
							href={`tel:${PHONE_ALT.replace(/\s/g, "")}`}
							className="inline-flex items-center gap-3 transition-colors hover:text-primary"
						>
							<Phone
								className="size-4 shrink-0 text-primary"
								aria-hidden
							/>
							{PHONE_ALT}
						</a>
						<div className="inline-flex items-start gap-3">
							<MapPin
								className="mt-0.5 size-4 shrink-0 text-primary"
								aria-hidden
							/>
							<span>
								{ADDRESS_LINE_1}
								<br />
								{ADDRESS_LINE_2}
							</span>
						</div>
					</div>

					<Link
						href={MAPS_URL}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex w-fit items-center gap-2 rounded-lg bg-secondary px-5 py-3 text-sm font-semibold text-secondary-foreground transition-transform hover:-translate-y-0.5"
					>
						{t("expandMap")}
						<Maximize2 className="size-3.5" aria-hidden />
					</Link>
				</div>
			</aside>

			<form
				ref={formRef}
				action={formAction}
				className="flex flex-1 flex-col gap-8"
				noValidate
			>
				{state.status === "success" && state.message ? (
					<div
						role="status"
						aria-live="polite"
						className="flex items-start gap-4 rounded-2xl border border-emerald-200/70 bg-linear-to-br from-emerald-50 to-emerald-100/40 p-5 shadow-sm"
					>
						<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700">
							<CheckCircle2 className="size-5" aria-hidden />
						</div>
						<div className="flex flex-col gap-1">
							<p className="text-base font-semibold text-emerald-900">
								Contato recebido com sucesso!
							</p>
							<p className="text-sm leading-relaxed text-emerald-900/80">
								{state.message}
							</p>
						</div>
					</div>
				) : null}

				{state.status === "error" && state.message ? (
					<div
						role="alert"
						className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
					>
						{state.message}
					</div>
				) : null}

				<div className="flex flex-col gap-2">
					<Label htmlFor="contact-name" className={fieldLabel}>
						{t("fullName")}
					</Label>
					<Input
						id="contact-name"
						name="name"
						type="text"
						required
						aria-invalid={Boolean(state.fieldErrors?.fullName)}
						className={underlineInput}
					/>
					{state.fieldErrors?.fullName ? (
						<p className="text-xs text-destructive">
							{state.fieldErrors.fullName}
						</p>
					) : null}
				</div>

				<div className="grid gap-8 sm:grid-cols-2">
					<div className="flex flex-col gap-2">
						<Label htmlFor="contact-email" className={fieldLabel}>
							{t("email")}
						</Label>
						<Input
							id="contact-email"
							name="email"
							type="email"
							required
							aria-invalid={Boolean(state.fieldErrors?.email)}
							className={underlineInput}
						/>
						{state.fieldErrors?.email ? (
							<p className="text-xs text-destructive">
								{state.fieldErrors.email}
							</p>
						) : null}
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="contact-phone" className={fieldLabel}>
							{t("phone")}
						</Label>
						<Input
							id="contact-phone"
							name="phone"
							type="tel"
							inputMode="numeric"
							autoComplete="tel-national"
							required
							value={phoneDisplay}
							onChange={handlePhoneChange}
							placeholder={t("phonePlaceholder")}
							className={underlineInput}
							aria-describedby="contact-phone-hint"
							aria-invalid={Boolean(state.fieldErrors?.phone)}
							pattern={
								"^\\(\\d{2}\\) 9\\d{4}-\\d{4}$|^\\(\\d{2}\\) \\d{4}-\\d{4}$"
							}
							title={t("phoneTitle")}
						/>
						<p id="contact-phone-hint" className="sr-only">
							{t("phoneHint")}
						</p>
						{state.fieldErrors?.phone ? (
							<p className="text-xs text-destructive">
								{state.fieldErrors.phone}
							</p>
						) : null}
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<Label htmlFor="contact-company" className={fieldLabel}>
						{t("companyName")}
					</Label>
					<Input
						id="contact-company"
						name="company"
						type="text"
						required
						aria-invalid={Boolean(state.fieldErrors?.companyName)}
						className={underlineInput}
					/>
					{state.fieldErrors?.companyName ? (
						<p className="text-xs text-destructive">
							{state.fieldErrors.companyName}
						</p>
					) : null}
				</div>

				<div className="grid gap-8 sm:grid-cols-2">
					<div className="flex flex-col gap-2">
						<Label htmlFor="contact-city" className={fieldLabel}>
							{t("city")}
						</Label>
						<Input
							id="contact-city"
							name="city"
							type="text"
							required
							aria-invalid={Boolean(state.fieldErrors?.city)}
							className={underlineInput}
						/>
						{state.fieldErrors?.city ? (
							<p className="text-xs text-destructive">
								{state.fieldErrors.city}
							</p>
						) : null}
					</div>
					<div className="flex flex-col gap-2">
						<Label className={fieldLabel}>{t("state")}</Label>
						<Select name="state">
							<SelectTrigger
								className={cn(underlineInput, "w-full h-12!")}
								iconClassName="text-primary"
								aria-invalid={Boolean(state.fieldErrors?.state)}
							>
								<SelectValue placeholder={t("selectState")} />
							</SelectTrigger>
							<SelectContent>
								{BRAZILIAN_STATES.map((s) => (
									<SelectItem key={s.uf} value={s.uf}>
										{s.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{state.fieldErrors?.state ? (
							<p className="text-xs text-destructive">
								{state.fieldErrors.state}
							</p>
						) : null}
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<Label className={fieldLabel}>{t("serviceQuestion")}</Label>
					<Select name="service">
						<SelectTrigger
							className={cn(underlineInput, "w-full h-12!")}
							iconClassName="text-primary"
						>
							<SelectValue placeholder={t("selectService")} />
						</SelectTrigger>
						<SelectContent>
							{services.map((s) => (
								<SelectItem key={s.slug} value={s.slug}>
									{s.title.replace(/\n/g, " ")}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="flex flex-col gap-2">
					<Label htmlFor="contact-message" className={fieldLabel}>
						{t("message")}
					</Label>
					<Textarea
						id="contact-message"
						name="message"
						rows={5}
						className={cn(underlineTextarea, "bg-white rounded-xl shadow-none p-5")}
					/>
				</div>

				<div className="flex justify-end">
					<Button
						type="submit"
						variant="secondary"
						className="px-8"
						disabled={isPending}
					>
						{isPending ? "..." : t("submit")}
					</Button>
				</div>
			</form>
		</div>
	);
}
