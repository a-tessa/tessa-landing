import Link from "next/link";
import React from "react";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white py-10">
      <Container className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-600">© {new Date().getFullYear()} Tessa. Todos os direitos reservados.</p>
        <div className="flex gap-4 text-sm">
          <Link className="text-zinc-600 hover:text-zinc-900" href="/blog">Blog</Link>
          <a className="text-zinc-600 hover:text-zinc-900" href="#contato">Contato</a>
        </div>
      </Container>
    </footer>
  );
}
