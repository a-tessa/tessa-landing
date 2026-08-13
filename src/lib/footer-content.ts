export const MAX_FOOTER_NEWSLETTER_TITLE_LENGTH = 80;
export const MAX_FOOTER_NEWSLETTER_SUB_LENGTH = 120;

export interface FooterSection {
  newsletterTitle: string;
  newsletterSub: string;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidText(
  value: unknown,
  maximumLength: number,
): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.trim().length <= maximumLength
  );
}

export function resolveFooterSection(value: unknown): FooterSection | null {
  if (!isObject(value)) {
    return null;
  }

  if (
    !isValidText(value.newsletterTitle, MAX_FOOTER_NEWSLETTER_TITLE_LENGTH) ||
    !isValidText(value.newsletterSub, MAX_FOOTER_NEWSLETTER_SUB_LENGTH)
  ) {
    return null;
  }

  return {
    newsletterTitle: value.newsletterTitle.trim(),
    newsletterSub: value.newsletterSub.trim(),
  };
}
