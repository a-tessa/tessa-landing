import Link from "next/link";
import Image from "next/image";

export default function RootNotFound() {
  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center gap-8 text-center">
          <Image
            src="/tessa-logo.svg"
            alt="Tessa"
            width={240}
            height={78}
            className="h-16 w-auto sm:h-20"
            priority
          />
          <h1 className="text-2xl font-bold uppercase sm:text-4xl">
            Page not found
          </h1>
          <Link
            href="/"
            className="mt-2 inline-flex items-center gap-2 rounded-lg bg-[oklch(0.45_0.15_145)] px-8 py-3.5 text-sm font-semibold text-white uppercase tracking-wide transition-transform hover:-translate-y-0.5"
          >
            Go home
          </Link>
        </main>
      </body>
    </html>
  );
}
