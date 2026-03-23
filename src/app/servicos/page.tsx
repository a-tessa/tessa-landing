import type { Metadata } from "next";
import { Footer } from "@/components/marketing/Footer";
import { Scenarios } from "@/components/marketing/Scenarios";
import { Testimonials } from "@/components/marketing/Testimonials";
import { JsonLd } from "@/lib/seo/jsonld";
import { organizationJsonLd, SITE, websiteJsonLd } from "@/lib/seo/schemas";

export const metadata: Metadata = {
	title:
		"Serviços — estruturas metálicas, energia solar e soluções industriais",
	description:
		"Conheça os cenários e soluções Tessa: estruturas metálicas, energia solar e engenharia aplicada para obra e produção.",
	alternates: {
		canonical: "/servicos",
	},
	keywords: [
		...SITE.keywords,
		"Serviços Tessa",
		"Estruturas metálicas",
		"Energia solar empresarial",
	],
};

export default function ServicosPage() {
	return (
		<>
			<JsonLd id="jsonld-org" data={organizationJsonLd()} />
			<JsonLd id="jsonld-website" data={websiteJsonLd()} />

			<main className="flex flex-col items-center justify-center gap-20 pt-96">
				<Scenarios />
				<Testimonials />
			</main>

			<Footer />
		</>
	);
}
