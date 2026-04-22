import type {
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

async function getPublicContent(): Promise<PublicContentResponse | null> {
  if (!API_BASE_URL) return null;

  const url = `${API_BASE_URL}/api/content/public`;

  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS, tags: ["landing-content"] },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (!res.ok) return null;

    return (await res.json()) as PublicContentResponse;
  } catch {
    return null;
  }
}

export async function getHeroSection(): Promise<HeroTopic[] | null> {
  const data = await getPublicContent();
  return data?.content.heroSection ?? null;
}

export async function getScenerySection(): Promise<SceneryItem[] | null> {
  const data = await getPublicContent();
  return data?.content.scenerySection ?? null;
}

export async function getServicesPages(): Promise<ServicesPageItem[] | null> {
  const data = await getPublicContent();
  const list = data?.content.servicesPages;
  return Array.isArray(list) ? list : null;
}

export async function getServicePageBySlug(
  slug: string,
): Promise<ServicesPageItem | null> {
  const servicesPages = await getServicesPages();
  return servicesPages?.find((service) => service.slug === slug) ?? null;
}

export async function getRepresentatives(): Promise<PublicRepresentative[] | null> {
  const data = await getPublicContent();
  const list = data?.content.representantsBase;
  return Array.isArray(list) ? list : null;
}

export async function getClients(): Promise<ClientLogo[] | null> {
  if (!API_BASE_URL) return null;

  const url = `${API_BASE_URL}/api/content/public/clients`;

  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS, tags: ["landing-clients"] },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (!res.ok) return null;

    const data = (await res.json()) as PublicClientsResponse;
    return Array.isArray(data.clients) ? data.clients : null;
  } catch {
    return null;
  }
}

export async function getLandingContent() {
  const [data, clients] = await Promise.all([getPublicContent(), getClients()]);

  return {
    heroSection: data?.content.heroSection ?? null,
    scenerySection: data?.content.scenerySection ?? null,
    clients: clients ?? data?.content.clients ?? null,
  };
}
