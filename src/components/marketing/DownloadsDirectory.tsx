import { getTranslations } from "next-intl/server";
import { DownloadDocumentCard } from "@/components/marketing/DownloadDocumentCard";
import type { DocumentPublicDto } from "@/lib/api/documents";
import type { BlogCategory } from "@/lib/api/types";

interface DownloadsDirectoryProps {
  locale: string;
  documents: DocumentPublicDto[];
  categories: BlogCategory[];
  activeCategory: string;
}

function groupDocumentsByCategory(
  documents: DocumentPublicDto[],
  categories: BlogCategory[],
  activeCategory: string,
): Array<{ slug: string; name: string; documents: DocumentPublicDto[] }> {
  const bySlug = new Map<string, DocumentPublicDto[]>();

  for (const document of documents) {
    const list = bySlug.get(document.categorySlug) ?? [];
    list.push(document);
    bySlug.set(document.categorySlug, list);
  }

  const groups: Array<{
    slug: string;
    name: string;
    documents: DocumentPublicDto[];
  }> = [];

  for (const category of categories) {
    if (activeCategory && category.slug !== activeCategory) continue;
    const docs = bySlug.get(category.slug);
    if (!docs?.length) continue;
    groups.push({
      slug: category.slug,
      name: category.name,
      documents: docs,
    });
    bySlug.delete(category.slug);
  }

  if (!activeCategory) {
    for (const [slug, docs] of bySlug) {
      groups.push({ slug, name: slug, documents: docs });
    }
  }

  return groups;
}

export async function DownloadsDirectory({
  locale,
  documents,
  categories,
  activeCategory,
}: DownloadsDirectoryProps) {
  const t = await getTranslations({ locale, namespace: "pages.downloads" });
  const groups = groupDocumentsByCategory(
    documents,
    categories,
    activeCategory,
  );

  if (groups.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        {activeCategory ? t("emptyInCategory") : t("empty")}
      </p>
    );
  }

  const documentsInOrder = groups.flatMap((group) => group.documents);

  return (
    <ul className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-5 xl:grid-cols-5">
      {documentsInOrder.map((document) => (
        <li key={document.id}>
          <DownloadDocumentCard locale={locale} document={document} />
        </li>
      ))}
    </ul>
  );
}
