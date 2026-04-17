import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Barlow } from "next/font/google";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "../globals.css";
import { SITE } from "@/lib/seo/schemas";
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

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    metadataBase: new URL("https://www.tessa.com.br"),
    title: {
      template: `%s | ${SITE.name}`,
      default: `${SITE.name} — ${SITE.tagline}`,
    },
    description: SITE.description,
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `/${l}`]),
      ),
    },
    openGraph: {
      type: "website",
      locale,
      url: "https://www.tessa.com.br",
      title: `${SITE.name} — ${SITE.tagline}`,
      description: SITE.description,
      images: [
        {
          url: "/tessa-logo.svg",
          width: 1200,
          height: 630,
        },
      ],
      siteName: SITE.name,
    },
    keywords: SITE.keywords,
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
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
        <NextIntlClientProvider messages={messages}>
          <ScrollToTop />
          <NavbarConditional />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
