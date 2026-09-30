import { describe, expect, it } from "vitest";
import {
  downscaleTestimonialImage,
  fittedSize,
  needsDownscale,
} from "./downscale-testimonial-image";

describe("fittedSize", () => {
  it("fits a 2560 by 1440 photo inside 1920", () => {
    expect(fittedSize(2560, 1440)).toEqual({ width: 1920, height: 1080 });
  });

  it("leaves a small photo unchanged", () => {
    expect(fittedSize(80, 60)).toEqual({ width: 80, height: 60 });
  });
});

describe("downscaleTestimonialImage", () => {
  it("returns a photo that is already under 1 MB", async () => {
    const file = new File([new Uint8Array([1, 2, 3])], "ok.jpg", {
      type: "image/jpeg",
    });

    await expect(downscaleTestimonialImage(file)).resolves.toBe(file);
    expect(needsDownscale(file)).toBe(false);
  });
});
