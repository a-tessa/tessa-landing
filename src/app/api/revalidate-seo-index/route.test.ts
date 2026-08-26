import { beforeEach, describe, expect, it, vi } from "vitest";

const revalidateTag = vi.fn();
const revalidatePath = vi.fn();

vi.mock("next/cache", () => ({
  revalidateTag,
  revalidatePath,
}));

describe("POST /api/revalidate-seo-index", () => {
  beforeEach(() => {
    revalidateTag.mockReset();
    revalidatePath.mockReset();
    vi.unstubAllEnvs();
  });

  it("returns 503 when the secret is not configured", async () => {
    vi.stubEnv("SEO_REVALIDATE_SECRET", "");
    const { POST } = await import("./route");

    const response = await POST(
      new Request("http://localhost:3000/api/revalidate-seo-index", {
        method: "POST",
        headers: { "x-revalidate-secret": "configured-secret-16" },
      }),
    );

    expect(response.status).toBe(503);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("returns 401 when the secret does not match", async () => {
    vi.stubEnv("SEO_REVALIDATE_SECRET", "configured-secret-16");
    const { POST } = await import("./route");

    const response = await POST(
      new Request("http://localhost:3000/api/revalidate-seo-index", {
        method: "POST",
        headers: { "x-revalidate-secret": "wrong-secret" },
      }),
    );

    expect(response.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("revalidates the sitemap cache tag and paths when the secret matches", async () => {
    vi.stubEnv("SEO_REVALIDATE_SECRET", "configured-secret-16");
    const { POST } = await import("./route");

    const response = await POST(
      new Request("http://localhost:3000/api/revalidate-seo-index", {
        method: "POST",
        headers: { "x-revalidate-secret": "configured-secret-16" },
      }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ revalidated: true });
    expect(revalidateTag).toHaveBeenCalledWith("landing-seo-index", "max");
    expect(revalidatePath).toHaveBeenCalledWith("/sitemap.xml");
    expect(revalidatePath).toHaveBeenCalledWith("/robots.txt");
  });
});
