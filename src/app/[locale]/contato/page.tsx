import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { Footer } from "@/components/marketing/Footer";
import { Heading } from "@/components/marketing/Heading";
import { JsonLd } from "@/lib/seo/jsonld";
import { organizationJsonLd, SITE, websiteJsonLd } from "@/lib/seo/schemas";
import { cn, freeSectionShellSpacing } from "@/lib/utils";
import { ContactForm } from "@/components/marketing/ContactForm";

export const metadata: Metadata = {
	title: "Contato — fale com a Tessa",
	description:
		"Entre em contato com a Tessa para solicitar orçamento, esclarecer dúvidas ou conhecer nossas soluções em estruturas metálicas e energia solar.",
	alternates: {
		canonical: "/contato",
	},
	keywords: [
		...SITE.keywords,
		"Contato Tessa",
		"Orçamento estruturas metálicas",
		"Fale conosco",
	],
};

export default function ContatoPage() {
	const t = useTranslations("pages.contato");

	return (
		<>
			<JsonLd id="jsonld-org-contato" data={organizationJsonLd()} />
			<JsonLd id="jsonld-website-contato" data={websiteJsonLd()} />

			<main className="flex flex-col items-center justify-center gap-0">
				<Heading title={t("title")} description={t("description")} />

				<section className={cn("w-full pb-20 pt-10", freeSectionShellSpacing)}>
					<ContactForm />
				</section>
			</main>

			<Footer />
		</>
	);
}
