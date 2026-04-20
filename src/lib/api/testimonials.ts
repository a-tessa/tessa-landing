import type {
  PublicTestimonial,
  PublicTestimonialsResponse,
} from "./types";

const API_BASE_URL = process.env.API_BASE_URL ?? "";
const REVALIDATE_SECONDS = 60;
const FETCH_TIMEOUT_MS = 5_000;

export async function getApprovedTestimonials(): Promise<PublicTestimonial[] | null> {
  if (!API_BASE_URL) return null;

  const url = `${API_BASE_URL}/api/testimonials`;

  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS, tags: ["landing-testimonials"] },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (!res.ok) return null;

    const data = (await res.json()) as PublicTestimonialsResponse;
    return Array.isArray(data.testimonials) ? data.testimonials : null;
  } catch {
    return null;
  }
}
