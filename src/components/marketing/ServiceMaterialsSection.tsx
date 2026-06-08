import Image from "next/image";
import { IconArrowDown, IconDownload } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { getServiceMaterials } from "@/lib/servicos/materials";
import { cn, freeSectionShellSpacing } from "@/lib/utils";

interface ServiceMaterialsSectionProps {
  locale: string;
  slug: string;
  className?: string;
}

export async function ServiceMaterialsSection({
  locale,
  slug,
  className,
}: ServiceMaterialsSectionProps) {
  const materials = getServiceMaterials(slug, locale);
  if (materials.length === 0) return null;

  const t = await getTranslations({ locale, namespace: "pages.servicoDetail" });
  const hasMultipleMaterials = materials.length > 1;
  const primary =
    materials.find((material) => material.primary) ?? materials[0];

  return (
    <section
      className={cn("mb-10", freeSectionShellSpacing, className)}
      aria-labelledby="servico-materiais-heading"
    >
      <div
        className={cn(
          "relative isolate flex min-h-36 flex-col justify-center gap-6 overflow-hidden rounded-3xl bg-secondary px-6 py-8 sm:px-10 lg:px-14",
          hasMultipleMaterials
            ? "sm:min-h-40"
            : "sm:min-h-32 sm:flex-row sm:items-center sm:justify-between",
        )}
      >
        <Image
          src="/find-representant.webp"
          alt=""
          fill
          className="z-0 object-cover object-center opacity-35 saturate-50"
          sizes="(max-width: 768px) 100vw, 85vw"
          aria-hidden
        />

        <div className="relative z-10 flex max-w-2xl flex-col gap-4">
          <p
            id="servico-materiais-heading"
            className="text-left text-lg font-semibold uppercase text-secondary-foreground sm:text-2xl"
          >
            <strong className="font-bold">{t("downloadTitle")}</strong>
            <br />
            <span className="font-semibold">{t("downloadSub")}</span>
          </p>

          {hasMultipleMaterials ? (
            <ul className="list-disc space-y-2 pl-5 text-sm text-secondary-foreground sm:text-base">
              {materials.map((material) => (
                <li key={material.href}>
                  <a
                    href={material.href}
                    download
                    className="inline-flex items-center gap-2 font-medium transition-colors hover:text-primary"
                  >
                    <IconDownload
                      className="size-4 shrink-0"
                      aria-hidden
                    />
                    <span>{t(material.labelKey)}</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {!hasMultipleMaterials ? (
          <Button
            asChild
            variant="default"
            className="relative z-10 w-full shrink-0 sm:ml-auto sm:w-fit"
          >
            <a href={primary.href} download>
              {t("downloadCta")}
              <IconArrowDown className="size-4" />
            </a>
          </Button>
        ) : null}
      </div>
    </section>
  );
}
