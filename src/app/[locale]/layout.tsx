import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Barlow } from "next/font/google";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "../globals.css";
import { organizationJsonLd, SITE, websiteJsonLd } from "@/lib/seo/schemas";
import { JsonLd } from "@/lib/seo/jsonld";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { NavbarConditional } from "@/components/marketing/NavbarConditional";
import { ScrollToTop } from "@/components/scroll-to-top";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const languages = Object.fromEntries([
    ...routing.locales.map((l) => [l, `/${l}`] as const),
    ["x-default", `/${routing.defaultLocale}`] as const,
  ]);

  return {
    metadataBase: new URL(SITE.domain),
    title: {
      template: `%s | ${SITE.shortName}`,
      default: `${SITE.shortName} — ${SITE.tagline}`,
    },
    description: SITE.description,
    applicationName: SITE.shortName,
    authors: [{ name: SITE.name, url: SITE.domain }],
    creator: SITE.name,
    publisher: SITE.name,
    category: "business",
    keywords: [...SITE.keywords],
    alternates: {
      canonical: `/${locale}`,
      languages,
    },
    openGraph: {
      type: "website",
      locale,
      url: `${SITE.domain}/${locale}`,
      title: `${SITE.shortName} — ${SITE.tagline}`,
      description: SITE.description,
      siteName: SITE.name,
    },
    twitter: {
      card: "summary_large_image",
      title: `${SITE.shortName} — ${SITE.tagline}`,
      description: SITE.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    formatDetection: {
      email: false,
      telephone: false,
      address: false,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          inter.variable,
          barlow.variable,
          barlow.className,
          "antialiased",
          "max-w-[1920px] mx-auto",
        )}
      >
        <JsonLd id="jsonld-organization" data={organizationJsonLd()} />
        <JsonLd id="jsonld-website" data={websiteJsonLd()} />
        <NextIntlClientProvider messages={messages}>
          <ScrollToTop />
          <NavbarConditional />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
