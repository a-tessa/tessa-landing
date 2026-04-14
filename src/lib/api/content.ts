import type { HeroTopic, PublicContentResponse, SceneryItem } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const REVALIDATE_SECONDS = 60;

async function getPublicContent(): Promise<PublicContentResponse | null> {
  const url = `${API_BASE_URL}/api/content/public`;

  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS, tags: ["landing-content"] },
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

export async function getLandingContent() {
  const data = await getPublicContent();

  return {
    heroSection: data?.content.heroSection ?? null,
    scenerySection: data?.content.scenerySection ?? null,
  };
}
