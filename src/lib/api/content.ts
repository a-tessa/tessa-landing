import { localeCacheKey, toApiLocale } from "./locale";
import type {
  BlogCategory,
  ClientLogo,
  HeroTopic,
  PublicClientsResponse,
  PublicContentResponse,
  PublicRepresentative,
  SceneryItem,
  ServicesPageItem,
} from "./types";

const API_BASE_URL = process.env.API_BASE_URL ?? "";
const REVALIDATE_SECONDS = 60;
const FETCH_TIMEOUT_MS = 5_000;

async function getPublicContent(
  locale?: string,
): Promise<PublicContentResponse | null> {
  if (!API_BASE_URL) return null;

  const apiLocale = toApiLocale(locale);
  const url = `${API_BASE_URL}/api/content/public${
    apiLocale ? `?locale=${apiLocale}` : ""
  }`;

  try {
    const res = await fetch(url, {
      next: {
        revalidate: REVALIDATE_SECONDS,
        tags: ["landing-content", `landing-content:${localeCacheKey(locale)}`],
      },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (!res.ok) return null;

    return (await res.json()) as PublicContentResponse;
  } catch {
    return null;
  }
}

export async function getHeroSection(
  locale?: string,
): Promise<HeroTopic[] | null> {
  const data = await getPublicContent(locale);
  return data?.content.heroSection ?? null;
}

export async function getScenerySection(
  locale?: string,
): Promise<SceneryItem[] | null> {
  const data = await getPublicContent(locale);
  return data?.content.scenerySection ?? null;
}

export async function getServicesPages(
  locale?: string,
): Promise<ServicesPageItem[] | null> {
  const data = await getPublicContent(locale);
  const list = data?.content.servicesPages;
  return Array.isArray(list) ? list : null;
}

export async function getBlogCategories(
  locale?: string,
): Promise<BlogCategory[]> {
  const data = await getPublicContent(locale);
  const list = data?.content.categories;
  return Array.isArray(list) ? list : [];
}

export async function getServicesPagesWithMeta(
  locale?: string,
): Promise<{ pages: ServicesPageItem[]; updatedAt: string | null }> {
  const data = await getPublicContent(locale);
  const list = data?.content.servicesPages;
  return {
    pages: Array.isArray(list) ? list : [],
    updatedAt: data?.updatedAt ?? null,
  };
}

export async function getServicePageBySlug(
  slug: string,
  locale?: string,
): Promise<ServicesPageItem | null> {
  const servicesPages = await getServicesPages(locale);
  return servicesPages?.find((service) => service.slug === slug) ?? null;
}

export async function getRepresentatives(
  locale?: string,
): Promise<PublicRepresentative[] | null> {
  const data = await getPublicContent(locale);
  const list = data?.content.representantsBase;
  return Array.isArray(list) ? list : null;
}

export async function getClients(locale?: string): Promise<ClientLogo[] | null> {
  if (!API_BASE_URL) return null;

  const apiLocale = toApiLocale(locale);
  const url = `${API_BASE_URL}/api/content/public/clients${
    apiLocale ? `?locale=${apiLocale}` : ""
  }`;

  try {
    const res = await fetch(url, {
      next: {
        revalidate: REVALIDATE_SECONDS,
        tags: ["landing-clients", `landing-clients:${localeCacheKey(locale)}`],
      },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (!res.ok) return null;

    const data = (await res.json()) as PublicClientsResponse;
    return Array.isArray(data.clients) ? data.clients : null;
  } catch {
    return null;
  }
}

export async function getLandingContent(locale?: string) {
  const [data, clients] = await Promise.all([
    getPublicContent(locale),
    getClients(locale),
  ]);

  return {
    heroSection: data?.content.heroSection ?? null,
    scenerySection: data?.content.scenerySection ?? null,
    clients: clients ?? data?.content.clients ?? null,
  };
}
