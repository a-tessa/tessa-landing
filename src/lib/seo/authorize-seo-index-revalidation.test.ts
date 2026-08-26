import { describe, expect, it } from "vitest";
import { authorizeSeoIndexRevalidation } from "./authorize-seo-index-revalidation";

describe("authorizeSeoIndexRevalidation", () => {
  it("rejects requests when the secret is not configured", () => {
    expect(authorizeSeoIndexRevalidation("any-secret", undefined)).toBe(
      "unconfigured",
    );
    expect(authorizeSeoIndexRevalidation("any-secret", "")).toBe("unconfigured");
  });

  it("rejects a missing or wrong secret", () => {
    expect(
      authorizeSeoIndexRevalidation(null, "configured-secret-16"),
    ).toBe("unauthorized");
    expect(
      authorizeSeoIndexRevalidation("wrong-secret", "configured-secret-16"),
    ).toBe("unauthorized");
  });

  it("accepts the matching secret", () => {
    expect(
      authorizeSeoIndexRevalidation(
        "configured-secret-16",
        "configured-secret-16",
      ),
    ).toBe("ok");
  });
});
