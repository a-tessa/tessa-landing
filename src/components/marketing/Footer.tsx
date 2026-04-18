import { Instagram, Linkedin, MapPin, Phone, Youtube } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SITE } from "@/lib/seo/schemas";
import { cn, homeSpacing, insideCardSpacing } from "@/lib/utils";

const MENU_KEYS = [
  { href: "/a-tessa", key: "about" },
  { href: "/servicos", key: "services" },
  { href: "/estruturas", key: "structures" },
  { href: "/representantes", key: "representatives" },
  { href: "/blog", key: "blog" },
  { href: "/contato", key: "contact" },
] as const;

const LEGAL_KEYS = [
  { href: "/termos-de-uso", key: "terms" },
  { href: "/politica-de-privacidade", key: "privacy" },
  { href: "/trabalhe-conosco", key: "careers" },
] as const;

const SOCIAL_LINKS = [
  { href: SITE.socials.linkedin, key: "linkedin", icon: Linkedin },
  { href: SITE.socials.youtube, key: "youtube", icon: Youtube },
  { href: SITE.socials.instagram, key: "instagram", icon: Instagram },
] as const;

export function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations("footer");

  return (
    <footer
      className="w-full px-6  mb-20 mx-auto pb-6"
      role="contentinfo"
      aria-label={t("siteLabel")}
      itemScope
      itemType="https://schema.org/Organization"
    >
      <meta itemProp="name" content={SITE.name} />
      <meta itemProp="url" content={SITE.domain} />
      <div className="rounded-3xl relative overflow-hidden flex flex-col">
        <div className="lg:px-0 bg-[oklch(0.22_0_0)] text-white">
          <div
            className={cn(
              "flex flex-col lg:flex-row",
              insideCardSpacing,
            )}
          >
            {/* Newsletter */}
            <div className="lg:w-1/2 pt-14 pb-14 text">
              <Link
                href="/"
                aria-label={t("homeLabel")}
                className="inline-block"
              >
                <Image
                  src="/tessa-logo.svg"
                  alt={t("logoAlt")}
                  width={160}
                  height={52}
                  className="h-11 w-auto sm:h-12"
                />
              </Link>

              <div className="mt-10">
                <h2 className="font-barlow text-sm font-bold uppercase leading-snug tracking-[0.12em] text-primary sm:text-base">
                  {t("newsletterTitle")}
                </h2>
                <p className="mt-2 font-barlow text-[0.65rem] font-semibold uppercase leading-relaxed tracking-[0.14em] text-white sm:text-xs">
                  {t("newsletterSub")}
                </p>
              </div>

              <form
                className="mt-6 flex max-w-sm flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-0"
                aria-label={t("formLabel")}
              >
                <label htmlFor="footer-email" className="sr-only">
                  {t("emailLabel")}
                </label>
                <input
                  id="footer-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  placeholder={t("emailPlaceholder")}
                  className="min-h-12 min-w-0 flex-1 rounded-xl border border-white/20 bg-black/35 px-4 py-3 text-sm text-white placeholder:text-white/45 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:rounded-r-none sm:rounded-l-xl"
                />
                <button
                  type="submit"
                  className="min-h-12 shrink-0 rounded-xl bg-secondary px-5 py-3 text-xs xl:text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/90 sm:rounded-l-none sm:rounded-r-xl"
                >
                  {t("subscribe")}
                </button>
              </form>
            </div>

            <div className="lg:w-1/2 flex flex-col sm:flex-row gap-x-6 lg:gap-x-0">
              {/* Menu */}
              <nav
                className="lg:w-1/3 lg:pt-14 pb-14 text-xs"
                aria-label={t("menuLabel")}
              >
                <h2 className="font-barlow font-bold uppercase tracking-[0.14em] text-primary sm:text-base">
                  {t("menuTitle")}
                </h2>
                <ul className="mt-6 space-y-3">
                  {MENU_KEYS.map(({ href, key }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="font-barlow font-semibold uppercase tracking-[0.06em] text-white transition-colors hover:text-primary"
                      >
                        {t(`links.${key}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Contato / mapa */}
              <div className="relative min-h-[240px] lg:w-2/3 flex py-14 px-10">
                <div
                  className="pointer-events-none absolute inset-0"
                  aria-hidden
                >
                  <div className="absolute inset-0 bg-[url('/city-bg.webp')] bg-right bg-no-repeat opacity-25 bg-cover" />
                </div>

                <div className="z-10">
                  <h2 className="font-barlow text-sm font-bold uppercase leading-tight tracking-[0.12em] text-primary sm:text-base whitespace-pre-line">
                    {t("contactTitle")}
                  </h2>

                  <address
                    className="mt-6 space-y-4 not-italic"
                    itemProp="address"
                    itemScope
                    itemType="https://schema.org/PostalAddress"
                  >
                    {SITE.phones.map((phone) => (
                      <a
                        key={phone}
                        href={`tel:${phone.replace(/\s/g, "")}`}
                        className="flex items-center gap-2.5 text-sm font-medium text-white/95 transition-colors hover:text-primary"
                        itemProp="telephone"
                      >
                        <Phone
                          className="size-4 shrink-0 text-primary"
                          strokeWidth={2}
                          aria-hidden
                        />
                        {phone}
                      </a>
                    ))}

                    <div className="flex items-start gap-2.5 text-sm font-medium uppercase leading-snug text-white/95">
                      <MapPin
                        className="mt-0.5 size-4 shrink-0 text-primary"
                        strokeWidth={2}
                        aria-hidden
                      />
                      <span className="max-w-4/6">
                        <span itemProp="streetAddress">
                          {SITE.address.streetAddress}
                        </span>
                        {", "}
                        <span itemProp="addressLocality">
                          {SITE.address.addressLocality}
                        </span>{" "}
                        <span itemProp="postalCode">
                          {SITE.address.postalCode.replace(/-/g, "")}
                        </span>
                      </span>
                    </div>
                  </address>

                  <div className="flex absolute bottom-0 w-11/12 -translate-x-1/2 left-1/2">
                    <div
                      className="h-1 w-full rounded-full bg-primary"
                      aria-hidden
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="border-t border-white/10 bg-[oklch(0.22_0_0)] text-white rounded-b-3xl">
          <div className={insideCardSpacing}>
            <div className="flex py-6 md:items-center lg:py-7 flex-col lg:flex-row gap-y-5">
              <p className="text-center lg:w-1/2 w-full text-xs text-white/50 lg:text-left">
                © {currentYear} {SITE.name}. {t("allRightsReserved")}
              </p>

              <div className="lg:w-1/2 w-full flex flex-wrap justify-center xl:justify-between items-center gap-3">
                <nav
                  className="flex flex-wrap items-center justify-between gap-x-2 gap-y-2 mx-auto lg:mx-0"
                  aria-label={t("legalLabel")}
                >
                  {LEGAL_KEYS.map(({ href, key }, index) => (
                    <span key={href} className="inline-flex items-center gap-2">
                      {index > 0 && (
                        <span
                          className="text-[0.65rem] text-primary"
                          aria-hidden
                        >
                          •
                        </span>
                      )}
                      <Link
                        href={href}
                        className="font-barlow text-xxs xl:text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:text-primary sm:text-xs"
                      >
                        {t(`legal.${key}`)}
                      </Link>
                    </span>
                  ))}
                </nav>

                <div className="flex items-center justify-center gap-3 md:justify-end mx-auto">
                  {SOCIAL_LINKS.map(({ href, key, icon: Icon }) => (
                    <a
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t(`social.${key}`)}
                      className="flex size-6 items-center justify-center rounded-md bg-primary text-neutral-700 transition-colors hover:bg-primary/70"
                      itemProp="sameAs"
                    >
                      <Icon className="size-4" strokeWidth={2} aria-hidden />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
