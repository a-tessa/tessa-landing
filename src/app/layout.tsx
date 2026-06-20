import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE } from "@/lib/seo/schemas";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
};

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return children;
}
