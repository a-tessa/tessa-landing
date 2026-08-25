import type { Metadata } from "next";
import { GoogleTagManager } from "@next/third-parties/google";
import { Geist, Geist_Mono, Inter, Barlow } from "next/font/google";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "../globals.css";
import {
  isSearchIndexingEnabled,
  organizationJsonLd,
  SITE,
  websiteJsonLd,
} from "@/lib/seo/schemas";
import { resolveSiteSeo } from "@/lib/seo/page-seo";
import { JsonLd } from "@/lib/seo/jsonld";
import { localePath, routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { NavbarConditional } from "@/components/marketing/NavbarConditional";
import { NavServicesProvider } from "@/components/marketing/nav/services-context";
import { ScrollToTop } from "@/components/scroll-to-top";
import { getServicesPages, getCompanyInformation } from "@/lib/api/content";
import { getMergedServiceNavItems } from "@/lib/servicos/nav";
import {
  resolveCompanyInformation,
  toPublicCompanyContact,
} from "@/lib/company-information";

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
  const site = await resolveSiteSeo(locale);
  const shouldIndex = isSearchIndexingEnabled() && site.allowIndexing;

  const languages = Object.fromEntries([
    ...routing.locales.map((l) => [l, localePath(l)] as const),
    ["x-default", localePath(routing.defaultLocale)] as const,
  ]);

  return {
    metadataBase: new URL(SITE.domain),
    title: {
      template: site.titleTemplate,
      default: `${site.shortName} — ${SITE.tagline}`,
    },
    description: site.description,
    applicationName: site.shortName,
    authors: [{ name: site.siteName, url: SITE.domain }],
    creator: site.siteName,
    publisher: site.siteName,
    category: "business",
    keywords: [...site.keywords],
    alternates: {
      canonical: localePath(locale),
      ...(shouldIndex ? { languages } : {}),
    },
    openGraph: {
      type: "website",
      locale,
      url: `${SITE.domain}${localePath(locale)}`,
      title: `${site.shortName} — ${SITE.tagline}`,
      description: site.description,
      siteName: site.siteName,
    },
    twitter: {
      card: "summary_large_image",
      title: `${site.shortName} — ${SITE.tagline}`,
      description: site.description,
    },
    robots: {
      index: shouldIndex,
      follow: shouldIndex,
      googleBot: {
        index: shouldIndex,
        follow: shouldIndex,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    ...(site.googleSiteVerification || site.bingSiteVerification
      ? {
          verification: {
            ...(site.googleSiteVerification
              ? { google: site.googleSiteVerification }
              : {}),
            ...(site.bingSiteVerification
              ? { other: { "msvalidate.01": site.bingSiteVerification } }
              : {}),
          },
        }
      : {}),
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

  const [messages, servicesPages, organizationContact, site] = await Promise.all([
    getMessages(),
    getServicesPages(locale),
    getCompanyInformation(locale).then((section) =>
      toPublicCompanyContact(resolveCompanyInformation(section)),
    ),
    resolveSiteSeo(locale),
  ]);
  const serviceNavItems = await getMergedServiceNavItems(locale, servicesPages);

  return (
    <html lang={locale} suppressHydrationWarning>
      <GoogleTagManager gtmId="GTM-MW6Q3VL" />
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          inter.variable,
          barlow.variable,
          barlow.className,
          "antialiased",
          "max-w-480 mx-auto",
        )}
      >
        <JsonLd
          id="jsonld-organization"
          data={organizationJsonLd(organizationContact, {
            siteName: site.siteName,
            description: site.description,
          })}
        />
        <JsonLd id="jsonld-website" data={websiteJsonLd(locale, site.siteName)} />
        <NextIntlClientProvider messages={messages}>
          <NavServicesProvider items={serviceNavItems}>
            <ScrollToTop />
            <NavbarConditional />
            {children}
          </NavServicesProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
