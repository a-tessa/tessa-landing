import { describe, expect, it } from "vitest";
import { buildCreateTestimonialFetchInit } from "./create-testimonial-request";

const basePayload = {
  authorName: "Ana Silva",
  companyName: "Silva Engenharia",
  rating: 5,
  comment: "Atendimento e produto dentro do combinado.",
};

describe("buildCreateTestimonialFetchInit", () => {
  it("sends JSON when the site review has no images", async () => {
    const init = await buildCreateTestimonialFetchInit({
      ...basePayload,
      profileImage: null,
      reviewImage: null,
    });

    expect(init.method).toBe("POST");
    expect(init.cache).toBe("no-store");
    expect(init.headers["Content-Type"]).toBe("application/json");
    expect(init.body).toBe(
      JSON.stringify({
        authorName: "Ana Silva",
        companyName: "Silva Engenharia",
        rating: 5,
        comment: "Atendimento e produto dentro do combinado.",
      }),
    );
  });

  it("sends multipart with an explicit boundary when an image is attached", async () => {
    const profileImage = new File([new Uint8Array([1, 2, 3, 4])], "perfil.jpg", {
      type: "image/jpeg",
    });

    const init = await buildCreateTestimonialFetchInit({
      ...basePayload,
      profileImage,
      reviewImage: null,
    });

    expect(init.headers["Content-Type"]).toMatch(
      /^multipart\/form-data; boundary=----TessaFormBoundary[a-f0-9]+$/,
    );
    expect(init.body).toBeInstanceOf(Blob);

    const body = await (init.body as Blob).text();
    expect(body).toContain('name="authorName"');
    expect(body).toContain("Ana Silva");
    expect(body).toContain('filename="perfil.jpg"');
    expect(body).toContain("Content-Type: image/jpeg");
  });
});
