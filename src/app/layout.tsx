import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.tessa.com.br"),
  title: {
    template: "%s | Tessa",
    default: "Tessa - Estruturas metálicas e perfis sob medida",
  },
  description:
    "Aço galvanizado. Engenharia aplicada. Produção industrial. Entrega para o seu projeto sair do papel com previsibilidade.",
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
    title: "Tessa - Estruturas metálicas e perfis sob medida",
    description:
      "Aço galvanizado. Engenharia aplicada. Produção industrial. Entrega para o seu projeto sair do papel com previsibilidade.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    siteName: "Tessa",
  },
  keywords: [
    "Estrutra metálica para telhado",
    "Carport",
    "Estruturas de aviário",
    "Aço galvanizado",
    "Engenharia aplicada",
    "Produção industrial",
    "Entrega para o seu projeto sair do papel com previsibilidade.",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
