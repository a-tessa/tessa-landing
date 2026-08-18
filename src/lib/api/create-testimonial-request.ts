export interface CreateTestimonialPayload {
  authorName: string;
  companyName: string;
  rating: number;
  comment: string;
  profileImage: File | null;
  reviewImage: File | null;
}

export interface CreateTestimonialFetchInit {
  method: "POST";
  headers: {
    "Content-Type": string;
  };
  body: string | Blob;
  cache: "no-store";
}

/**
 * Builds the outbound POST for a site review.
 *
 * Next.js Server Action `fetch` rewrites `FormData` to
 * `Content-Type: multipart/form-data` without a boundary on Vercel, which
 * makes tessa-api return 500. JSON avoids that path; images use a manually
 * encoded multipart body with an explicit boundary.
 */
export async function buildCreateTestimonialFetchInit(
  payload: CreateTestimonialPayload,
): Promise<CreateTestimonialFetchInit> {
  const fields = {
    authorName: payload.authorName,
    companyName: payload.companyName,
    rating: String(payload.rating),
    comment: payload.comment,
  };

  if (!payload.profileImage && !payload.reviewImage) {
    return {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        authorName: payload.authorName,
        companyName: payload.companyName,
        rating: payload.rating,
        comment: payload.comment,
      }),
      cache: "no-store",
    };
  }

  const encoded = await encodeMultipart(fields, {
    profileImage: payload.profileImage,
    reviewImage: payload.reviewImage,
  });

  return {
    method: "POST",
    headers: { "Content-Type": encoded.contentType },
    body: encoded.body,
    cache: "no-store",
  };
}

async function encodeMultipart(
  fields: Record<string, string>,
  files: Record<string, File | null>,
): Promise<{ body: Blob; contentType: string }> {
  const boundary = `----TessaFormBoundary${crypto.randomUUID().replaceAll("-", "")}`;
  const parts: BlobPart[] = [];

  for (const [name, value] of Object.entries(fields)) {
    parts.push(`--${boundary}\r\n`);
    parts.push(`Content-Disposition: form-data; name="${name}"\r\n\r\n`);
    parts.push(`${value}\r\n`);
  }

  for (const [name, file] of Object.entries(files)) {
    if (!file) continue;
    const filename = sanitizeMultipartFilename(file.name || "upload.bin");
    const type = file.type || "application/octet-stream";
    parts.push(`--${boundary}\r\n`);
    parts.push(
      `Content-Disposition: form-data; name="${name}"; filename="${filename}"\r\n`,
    );
    parts.push(`Content-Type: ${type}\r\n\r\n`);
    parts.push(await file.arrayBuffer());
    parts.push(`\r\n`);
  }

  parts.push(`--${boundary}--\r\n`);

  return {
    body: new Blob(parts),
    contentType: `multipart/form-data; boundary=${boundary}`,
  };
}

function sanitizeMultipartFilename(name: string): string {
  return name.replace(/[\r\n"]/g, "_");
}
