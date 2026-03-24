import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Barlow } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/seo/schemas";
import { cn } from "@/lib/utils";
import { NavbarConditional } from "@/components/marketing/NavbarConditional";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://www.tessa.com.br"),
  title: {
    template: `%s | ${SITE.name}`,
    default: `${SITE.name} — ${SITE.tagline}`,
  },
  description: SITE.description,
  alternates: {
    canonical: "/",
    languages: {
      "pt-BR": "/pt-BR",
      "en-US": "/en-US",
      "es-ES": "/es-ES",
    },
  },
  openGraph: {
    type: "website",
    locale: "pt-BR",
    url: "https://www.tessa.com.br",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    siteName: SITE.name,
  },
  keywords: SITE.keywords,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          inter.variable,
          barlow.variable,
          barlow.className,
          "antialiased",
        )}
      >
        <NavbarConditional />
        {children}
      </body>
    </html>
  );
}
