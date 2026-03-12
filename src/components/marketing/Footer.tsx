import Image from "next/image";
import Link from "next/link";
import { Linkedin, Youtube, Instagram, Phone, MapPin } from "lucide-react";
import { Container } from "./Container";
import { SITE } from "@/lib/seo/schemas";

const MENU_LINKS = [
  { href: "/a-tessa", label: "A Tessa" },
  { href: "/servicos", label: "Serviços" },
  { href: "/estruturas", label: "Estruturas" },
  { href: "/representantes", label: "Representantes" },
  { href: "/blog", label: "Blog" },
  { href: "/contato", label: "Contato/Localização" },
] as const;

const BOTTOM_LINKS = [
  { href: "/termos-de-uso", label: "Termos de uso" },
  { href: "/politica-de-privacidade", label: "Política de privacidade" },
  { href: "/trabalhe-conosco", label: "Trabalhe conosco" },
] as const;

const SOCIAL_LINKS = [
  {
    href: SITE.socials.linkedin,
    label: "LinkedIn da Tessa",
    icon: Linkedin,
  },
  {
    href: SITE.socials.youtube,
    label: "YouTube da Tessa",
    icon: Youtube,
  },
  {
    href: SITE.socials.instagram,
    label: "Instagram da Tessa",
    icon: Instagram,
  },
] as const;

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative overflow-hidden bg-foreground text-background"
      role="contentinfo"
      aria-label="Rodapé do site Tessa"
      itemScope
      itemType="https://schema.org/Organization"
    >
      <meta itemProp="name" content={SITE.name} />
      <meta itemProp="url" content={SITE.domain} />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 gap-10 py-12 md:grid-cols-12 md:gap-8 lg:py-16">
          {/* Newsletter column */}
          <div className="md:col-span-5 lg:col-span-4">
            <Link href="/" aria-label="Página inicial Tessa">
              <Image
                src="/tessa-logo.svg"
                alt="Tessa - Estruturas metálicas e energia solar"
                width={120}
                height={50}
                className="h-10 w-auto brightness-0 invert"
              />
            </Link>

            <div className="mt-8">
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary">
                Receba novidades da Tessa
              </h2>
              <p className="mt-1 text-xs uppercase tracking-wider text-background/60">
                Conteúdos técnicos, novidades e soluções
              </p>
            </div>

            <form
              className="mt-5 flex max-w-sm gap-0"
              aria-label="Formulário de inscrição na newsletter"
            >
              <label htmlFor="footer-email" className="sr-only">
                Seu e-mail corporativo
              </label>
              <input
                id="footer-email"
                type="email"
                name="email"
                autoComplete="email"
                required
                placeholder="Seu e-mail corporativo"
                className="min-w-0 flex-1 rounded-l-md border border-background/20 bg-background/10 px-4 py-2.5 text-sm text-background placeholder:text-background/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                className="whitespace-nowrap rounded-r-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Assinar newsletter
              </button>
            </form>
          </div>

          {/* Menu column */}
          <nav
            className="md:col-span-3 lg:col-span-3 lg:col-start-6"
            aria-label="Menu do rodapé"
          >
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary">
              Menu
            </h2>
            <ul className="mt-4 space-y-2.5">
              {MENU_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-background/70 transition-colors hover:text-primary"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact column with map background */}
          <div className="relative md:col-span-4 lg:col-span-4">
            <div className="absolute -right-8 -top-4 bottom-0 left-0 hidden rounded-lg bg-linear-to-br from-primary/15 via-primary/8 to-transparent md:block" />

            <div className="relative">
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary">
                Contato/
                <br />
                Localização
              </h2>

              <address
                className="mt-4 space-y-3 not-italic"
                itemProp="address"
                itemScope
                itemType="https://schema.org/PostalAddress"
              >
                {SITE.phones.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-2.5 text-sm text-background/70 transition-colors hover:text-primary"
                    itemProp="telephone"
                  >
                    <Phone size={14} className="shrink-0 text-primary" />
                    {phone}
                  </a>
                ))}

                <div className="flex items-start gap-2.5 text-sm text-background/70">
                  <MapPin size={14} className="mt-0.5 shrink-0 text-primary" />
                  <span>
                    <span itemProp="streetAddress">
                      {SITE.address.streetAddress}
                    </span>
                    <br />
                    <span itemProp="addressLocality">
                      {SITE.address.addressLocality}
                    </span>
                    ,{" "}
                    <span itemProp="postalCode">{SITE.address.postalCode}</span>
                  </span>
                </div>
              </address>
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="border-t border-background/10">
        <Container>
          <div className="flex flex-col items-center justify-between gap-4 py-5 sm:flex-row">
            <p className="text-xs text-background/50">
              &copy; {currentYear} {SITE.name}. Todos os direitos reservados.
            </p>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <nav aria-label="Links legais">
                <ul className="flex flex-wrap items-center gap-4 sm:gap-6">
                  {BOTTOM_LINKS.map(({ href, label }, index) => (
                    <li key={href} className="flex items-center gap-4 sm:gap-6">
                      <Link
                        href={href}
                        className="text-xs uppercase tracking-wider text-background/50 transition-colors hover:text-primary"
                      >
                        {label}
                      </Link>
                      {index < BOTTOM_LINKS.length - 1 && (
                        <span
                          className="h-3 w-px bg-background/20"
                          aria-hidden
                        />
                      )}
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="flex items-center gap-3">
                {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-background/10 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                    itemProp="sameAs"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
