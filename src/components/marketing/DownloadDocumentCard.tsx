import Image from "next/image";
import { IconDownload } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import { DocumentDescriptionDialog } from "@/components/marketing/DocumentDescriptionDialog";
import type { DocumentPublicDto } from "@/lib/api/documents";
import { cn } from "@/lib/utils";

interface DownloadDocumentCardProps {
  locale: string;
  document: DocumentPublicDto;
}

export async function DownloadDocumentCard({
  locale,
  document,
}: DownloadDocumentCardProps) {
  const t = await getTranslations({ locale, namespace: "pages.downloads" });
  const downloadName =
    document.file.originalFilename ?? `${document.title}.pdf`;
  const description = document.description?.trim() ?? "";
  const hasDescription = description.length > 0;

  return (
    <article
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-2xl",
        "outline-none transition-transform duration-300",
        "hover:-translate-y-0.5",
      )}
    >
      <a
        href={document.file.url}
        download={downloadName}
        target="_blank"
        rel="noreferrer"
        className={cn(
          "group/cover relative block aspect-735/480 w-full overflow-hidden rounded-t-2xl bg-muted",
          "outline-none focus-visible:ring-2 focus-visible:ring-primary",
        )}
      >
        {document.coverImageUrl ? (
          <Image
            src={document.coverImageUrl}
            alt={t("coverImageAlt", { title: document.title })}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover/cover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-secondary/20 px-4 text-center">
            <span className="font-barlow text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:text-sm">
              {document.title}
            </span>
          </div>
        )}

        <div
          className={cn(
            "pointer-events-none absolute inset-0 flex items-end justify-end p-2.5",
            "rounded-t-2xl bg-linear-to-t from-black/35 via-transparent to-transparent",
            "opacity-80 transition-opacity duration-300",
            "group-hover/cover:opacity-100 group-focus-within/cover:opacity-100",
          )}
        >
          <span
            className={cn(
              "inline-flex max-w-9 items-center overflow-hidden rounded-lg bg-primary",
              "py-1.5 pl-1.5 pr-1.5 text-primary-foreground",
              "transition-[max-width,padding] duration-300 ease-out",
              "group-hover/cover:max-w-48 group-hover/cover:pr-2.5",
              "group-focus-within/cover:max-w-48 group-focus-within/cover:pr-2.5",
            )}
          >
            <IconDownload className="size-3.5 shrink-0" aria-hidden />
            <span
              className={cn(
                "ml-0 max-w-0 overflow-hidden whitespace-nowrap",
                "text-[0.65rem] font-semibold uppercase tracking-wide opacity-0 sm:text-xs",
                "transition-[max-width,margin,opacity] duration-300 ease-out",
                "group-hover/cover:ml-1.5 group-hover/cover:max-w-40 group-hover/cover:opacity-100",
                "group-focus-within/cover:ml-1.5 group-focus-within/cover:max-w-40 group-focus-within/cover:opacity-100",
              )}
            >
              {t("downloadCta")}
            </span>
          </span>
        </div>
      </a>

      <div className="relative flex flex-1 flex-col gap-1 bg-card px-2 py-2.5">
        <h3
          className={cn(
            "my-auto pl-3 font-barlow text-sm font-semibold uppercase tracking-wide text-foreground sm:text-base",
            hasDescription && "pr-9",
          )}
        >
          {document.title}
        </h3>

        {hasDescription ? (
          <DocumentDescriptionDialog
            title={document.title}
            description={description}
            seeMoreLabel={t("seeMore")}
          />
        ) : null}
      </div>
    </article>
  );
}
