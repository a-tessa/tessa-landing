import { timingSafeEqual } from "node:crypto";

export type SeoIndexRevalidationAuthorization =
  | "ok"
  | "unauthorized"
  | "unconfigured";

export function authorizeSeoIndexRevalidation(
  providedSecret: string | null,
  configuredSecret: string | undefined,
): SeoIndexRevalidationAuthorization {
  if (!configuredSecret) {
    return "unconfigured";
  }

  if (!providedSecret || !secretsEqual(providedSecret, configuredSecret)) {
    return "unauthorized";
  }

  return "ok";
}

function secretsEqual(provided: string, expected: string): boolean {
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);

  if (providedBuffer.byteLength !== expectedBuffer.byteLength) {
    timingSafeEqual(expectedBuffer, expectedBuffer);
    return false;
  }

  return timingSafeEqual(providedBuffer, expectedBuffer);
}
