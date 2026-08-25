import type { Metadata } from "next";
import { fetchPublicContent } from "@/lib/api/content";
import type {
  PageSeo,
  PageSeoEntry,
  PublicContentResponse,
  SeoDefaults,
  SeoPageKey,
} from "@/lib/api/types";
import { buildPageMetadata, type BuildPageMetadataInput } from "./metadata";
import { SITE } from "./schemas";

export interface ResolvedSiteSeo {
  siteName: string;
  shortName: string;
  titleTemplate: string;
  description: string;
  keywords: readonly string[];
  defaultOgImageUrl: string | null;
  googleSiteVerification: string | null;
  bingSiteVerification: string | null;
  allowIndexing: boolean;
}

function asNonEmpty(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function asBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function parseKeywords(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  const keywords = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
  return keywords.length > 0 ? keywords : [];
}

export function resolveSiteSeoFromContent(
  content: PublicContentResponse["content"] | null | undefined,
): ResolvedSiteSeo {
  const raw = content?.seoDefaults as SeoDefaults | undefined;
  const siteName = asNonEmpty(raw?.siteName) ?? SITE.name;
  const titleTemplate = asNonEmpty(raw?.titleTemplate);
  const description =
    asNonEmpty(raw?.defaultMetaDescription) ?? SITE.description;
  const keywords = parseKeywords(raw?.keywords);

  return {
    siteName,
    shortName: SITE.shortName,
    titleTemplate:
      titleTemplate && titleTemplate.includes("%s")
        ? titleTemplate
        : `%s | ${SITE.shortName}`,
    description,
    keywords: keywords ?? SITE.keywords,
    defaultOgImageUrl: asNonEmpty(raw?.defaultOgImageUrl),
    googleSiteVerification: asNonEmpty(raw?.googleSiteVerification),
    bingSiteVerification: asNonEmpty(raw?.bingSiteVerification),
    allowIndexing: asBoolean(raw?.allowIndexing, true),
  };
}

export function resolvePageSeoEntryFromContent(
  content: PublicContentResponse["content"] | null | undefined,
  pageKey: SeoPageKey,
): PageSeoEntry | null {
  const map = content?.pageSeo as PageSeo | undefined;
  const entry = map?.[pageKey];
  if (!entry) return null;

  const metaTitle = asNonEmpty(entry.metaTitle);
  const metaDescription = asNonEmpty(entry.metaDescription);
  if (!metaTitle || !metaDescription) return null;

  const changeFrequency = entry.changeFrequency;
  const validFrequency =
    changeFrequency === "daily" ||
    changeFrequency === "weekly" ||
    changeFrequency === "monthly" ||
    changeFrequency === "yearly"
      ? changeFrequency
      : undefined;
  const priority =
    typeof entry.priority === "number" &&
    Number.isFinite(entry.priority) &&
    entry.priority >= 0 &&
    entry.priority <= 1
      ? entry.priority
      : undefined;

  return {
    metaTitle,
    metaDescription,
    focusKeyword: asNonEmpty(entry.focusKeyword) ?? undefined,
    ogImageUrl: asNonEmpty(entry.ogImageUrl) ?? undefined,
    noIndex: asBoolean(entry.noIndex, false),
    changeFrequency: validFrequency,
    priority,
  };
}

export async function resolveSiteSeo(locale?: string): Promise<ResolvedSiteSeo> {
  const data = await fetchPublicContent(locale);
  return resolveSiteSeoFromContent(data?.content);
}

export async function resolvePageSeoEntry(
  pageKey: SeoPageKey,
  locale?: string,
): Promise<PageSeoEntry | null> {
  const data = await fetchPublicContent(locale);
  return resolvePageSeoEntryFromContent(data?.content, pageKey);
}

export interface ManagedPageMetadataInput {
  locale: string;
  pageKey: SeoPageKey;
  path: string;
  fallbackTitle: string;
  fallbackDescription: string;
  keywords?: readonly string[];
  noIndex?: boolean;
  appendSiteName?: boolean;
}

export async function buildManagedPageMetadata(
  input: ManagedPageMetadataInput,
): Promise<Metadata> {
  const [site, page] = await Promise.all([
    resolveSiteSeo(input.locale),
    resolvePageSeoEntry(input.pageKey, input.locale),
  ]);

  const title = page?.metaTitle ?? input.fallbackTitle;
  const description = page?.metaDescription ?? input.fallbackDescription;
  const keywords = [
    ...(page?.focusKeyword ? [page.focusKeyword] : []),
    ...(input.keywords ?? []),
  ];
  const imageUrl = page?.ogImageUrl ?? site.defaultOgImageUrl;
  const noIndex = Boolean(input.noIndex) || Boolean(page?.noIndex);

  const metadataInput: BuildPageMetadataInput = {
    locale: input.locale,
    path: input.path,
    title,
    description,
    keywords,
    noIndex,
    appendSiteName: input.appendSiteName,
    siteName: site.siteName,
    shortName: site.shortName,
    globalKeywords: site.keywords,
    allowIndexing: site.allowIndexing,
  };

  if (imageUrl) {
    metadataInput.image = { url: imageUrl };
  }

  return buildPageMetadata(metadataInput);
}
