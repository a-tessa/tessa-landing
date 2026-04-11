"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useCallback } from "react";
import { Phone, MapPin, Maximize2 } from "lucide-react";
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
import { services } from "@/lib/services";
import { cn } from "@/lib/utils";

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

export function ContactForm() {
	const [phoneDisplay, setPhoneDisplay] = useState("");

	const handlePhoneChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const digits = normalizeBrazilPhoneDigits(e.target.value);
			setPhoneDisplay(formatBrazilPhoneDisplay(digits));
		},
		[],
	);

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
	}

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
						<h2 className="text-xl font-bold uppercase leading-tight text-primary sm:text-4xl">
							Onde
							<br />
							estamos
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
						Ampliar mapa
						<Maximize2 className="size-3.5" aria-hidden />
					</Link>
				</div>
			</aside>

			<form
				onSubmit={handleSubmit}
				className="flex flex-1 flex-col gap-8"
				noValidate
			>
				<div className="flex flex-col gap-2">
					<Label htmlFor="contact-name" className={fieldLabel}>
						Nome completo*
					</Label>
					<Input
						id="contact-name"
						name="name"
						type="text"
						required
						className={underlineInput}
					/>
				</div>

				<div className="grid gap-8 sm:grid-cols-2">
					<div className="flex flex-col gap-2">
						<Label htmlFor="contact-email" className={fieldLabel}>
							E-mail*
						</Label>
						<Input
							id="contact-email"
							name="email"
							type="email"
							required
							className={underlineInput}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="contact-phone" className={fieldLabel}>
							Celular / WhatsApp*
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
							placeholder="(00) 00000-0000"
							className={underlineInput}
							aria-describedby="contact-phone-hint"
							pattern={
								"^\\(\\d{2}\\) 9\\d{4}-\\d{4}$|^\\(\\d{2}\\) \\d{4}-\\d{4}$"
							}
							title="Use DDD e número completo, ex.: (17) 99999-9999 ou (17) 3234-5678"
						/>
						<p id="contact-phone-hint" className="sr-only">
							Digite DDD e número completo: celular (00) 90000-0000 ou fixo (00)
							0000-0000.
						</p>
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<Label htmlFor="contact-company" className={fieldLabel}>
						Nome da empresa*
					</Label>
					<Input
						id="contact-company"
						name="company"
						type="text"
						required
						className={underlineInput}
					/>
				</div>

				<div className="grid gap-8 sm:grid-cols-2">
					<div className="flex flex-col gap-2">
						<Label htmlFor="contact-city" className={fieldLabel}>
							Cidade*
						</Label>
						<Input
							id="contact-city"
							name="city"
							type="text"
							required
							className={underlineInput}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<Label className={fieldLabel}>Estado*</Label>
						<Select name="state">
							<SelectTrigger
								className={cn(underlineInput, "w-full h-12!")}
								iconClassName="text-primary"
							>
								<SelectValue placeholder="Selecione o estado" />
							</SelectTrigger>
							<SelectContent>
								{BRAZILIAN_STATES.map((s) => (
									<SelectItem key={s.uf} value={s.uf}>
										{s.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<Label className={fieldLabel}>
						Deseja falar sobre algum serviço? (opcional)
					</Label>
					<Select name="service">
						<SelectTrigger
							className={cn(underlineInput, "w-full h-12!")}
							iconClassName="text-primary"
						>
							<SelectValue placeholder="Selecione um serviço" />
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
						Mensagem (opcional)
					</Label>
					<Textarea
						id="contact-message"
						name="message"
						rows={5}
						className={cn(underlineTextarea, "bg-white rounded-xl shadow-none p-5")}
					/>
				</div>

				<div className="flex justify-end">
					<Button type="submit" variant="secondary" className="px-8">
						Enviar contato
					</Button>
				</div>
			</form>
		</div>
	);
}
