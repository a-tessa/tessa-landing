export const MAX_TESTIMONIAL_IMAGE_BYTES = 4 * 1024 * 1024;

/** Both optional photos, plus the rest of the multipart form. */
export const MAX_TESTIMONIAL_REQUEST_BYTES =
  MAX_TESTIMONIAL_IMAGE_BYTES * 2 + 1024 * 1024;

export function isOversizedTestimonialImage(file: File | null): boolean {
  return file !== null && file.size > MAX_TESTIMONIAL_IMAGE_BYTES;
}
