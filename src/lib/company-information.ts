import { SITE } from "@/lib/seo/schemas";

export const MAX_COMPANY_NAME_LENGTH = 160;
export const MAX_COMPANY_CNPJ_LENGTH = 20;
export const MAX_COMPANY_ADDRESS_LENGTH = 300;
export const MAX_COMPANY_ZIP_CODE_LENGTH = 12;
export const MAX_COMPANY_EMAIL_LENGTH = 255;
export const MAX_COMPANY_PHONE_LENGTH = 40;
export const MIN_COMPANY_PHONE_CONTACTS = 1;
export const MAX_COMPANY_PHONE_CONTACTS = 5;
export const MIN_WHATSAPP_DIGITS = 10;
export const MAX_WHATSAPP_DIGITS = 15;

export interface CompanyInformation {
  name: string;
  cnpj: string;
  address: string;
  zipCode: string;
  email: string;
  whatsapp?: string;
  phoneContacts: Array<{ phone: string }>;
}

export interface PublicCompanyContact {
  name: string;
  cnpj: string | null;
  address: string;
  zipCode: string;
  email: string;
  whatsapp: string | null;
  phones: string[];
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

function isValidEmail(value: unknown): value is string {
  if (!isValidText(value, MAX_COMPANY_EMAIL_LENGTH)) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function whatsappDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function isValidWhatsappNumber(value: string): boolean {
  const digits = whatsappDigits(value);
  return (
    digits.length >= MIN_WHATSAPP_DIGITS && digits.length <= MAX_WHATSAPP_DIGITS
  );
}

function resolveWhatsapp(value: unknown): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (!isValidText(value, MAX_COMPANY_PHONE_LENGTH)) {
    return undefined;
  }

  const trimmed = value.trim();
  return isValidWhatsappNumber(trimmed) ? trimmed : undefined;
}

function resolvePhones(value: unknown): string[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  if (
    value.length < MIN_COMPANY_PHONE_CONTACTS ||
    value.length > MAX_COMPANY_PHONE_CONTACTS
  ) {
    return null;
  }

  const phones: string[] = [];

  for (const item of value) {
    if (!isObject(item) || !isValidText(item.phone, MAX_COMPANY_PHONE_LENGTH)) {
      return null;
    }

    phones.push(item.phone.trim());
  }

  return phones;
}

export function resolveCompanyInformation(
  value: unknown,
): CompanyInformation | null {
  if (!isObject(value)) {
    return null;
  }

  const phones = resolvePhones(value.phoneContacts);
  const whatsapp = resolveWhatsapp(value.whatsapp);

  if (
    !isValidText(value.name, MAX_COMPANY_NAME_LENGTH) ||
    !isValidText(value.cnpj, MAX_COMPANY_CNPJ_LENGTH) ||
    !isValidText(value.address, MAX_COMPANY_ADDRESS_LENGTH) ||
    !isValidText(value.zipCode, MAX_COMPANY_ZIP_CODE_LENGTH) ||
    !isValidEmail(value.email) ||
    phones === null
  ) {
    return null;
  }

  return {
    name: value.name.trim(),
    cnpj: value.cnpj.trim(),
    address: value.address.trim(),
    zipCode: value.zipCode.trim(),
    email: value.email.trim(),
    ...(whatsapp ? { whatsapp } : {}),
    phoneContacts: phones.map((phone) => ({ phone })),
  };
}

export function toPublicCompanyContact(
  section: CompanyInformation | null,
): PublicCompanyContact {
  if (!section) {
    return {
      name: SITE.name,
      cnpj: null,
      address: `${SITE.address.streetAddress}, ${SITE.address.addressLocality}`,
      zipCode: SITE.address.postalCode,
      email: SITE.email,
      whatsapp: null,
      phones: [...SITE.phones],
    };
  }

  return {
    name: section.name,
    cnpj: section.cnpj,
    address: section.address,
    zipCode: section.zipCode,
    email: section.email,
    whatsapp: section.whatsapp ?? null,
    phones: section.phoneContacts.map((contact) => contact.phone),
  };
}

export function companyMapsSearchUrl(contact: PublicCompanyContact): string {
  const query = encodeURIComponent(`${contact.address} ${contact.zipCode}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export function telephoneHref(phone: string): string {
  return `tel:${phone.replace(/\s/g, "")}`;
}

export function whatsappHref(phone: string): string {
  const digits = whatsappDigits(phone);
  const withCountryCode =
    digits.startsWith("55") && digits.length >= 12
      ? digits
      : `55${digits}`;

  return `https://wa.me/${withCountryCode}`;
}
