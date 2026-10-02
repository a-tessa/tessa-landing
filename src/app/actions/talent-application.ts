"use server";

import { getLocale, getTranslations } from "next-intl/server";

type TalentApplicationField =
  | "fullName"
  | "email"
  | "phone"
  | "educationLevel"
  | "education"
  | "practiceArea"
  | "professionalSummary";

export interface TalentApplicationActionState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<TalentApplicationField, string>>;
}

const PRACTICE_AREAS = new Set([
  "Produção",
  "Comercial",
  "Financeiro",
  "Atendimento ao Cliente",
  "Tecnologia",
  "Outro",
]);

const EDUCATION_LEVELS = new Set([
  "Ensino Fundamental incompleto",
  "Ensino Fundamental completo",
  "Ensino Médio incompleto",
  "Ensino Médio completo",
  "Ensino Superior incompleto",
  "Ensino Superior completo",
  "Pós-graduação",
  "Mestrado",
  "Doutorado",
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
const PHONE_RE = /^\(\d{2}\) (?:\d{4}-\d{4}|\d{5}-\d{4})$/;

function getTrimmed(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string): boolean {
  if (email.length > 200 || !EMAIL_RE.test(email)) return false;
  const domain = email.slice(email.lastIndexOf("@") + 1);
  return !domain.includes("..") && !domain.startsWith(".") && !domain.endsWith(".");
}

export async function submitTalentApplication(
  _prevState: TalentApplicationActionState,
  formData: FormData,
): Promise<TalentApplicationActionState> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "talentApplication" });

  const fullName = getTrimmed(formData, "name");
  const email = getTrimmed(formData, "email");
  const phone = getTrimmed(formData, "phone");
  const educationLevel = getTrimmed(formData, "educationLevel");
  const education = getTrimmed(formData, "education");
  const practiceArea = getTrimmed(formData, "practiceArea");
  const professionalSummary = getTrimmed(formData, "professionalSummary");

  const fieldErrors: NonNullable<TalentApplicationActionState["fieldErrors"]> =
    {};

  if (fullName.length < 2) {
    fieldErrors.fullName = t("errors.fullName");
  } else if (fullName.length > 200) {
    fieldErrors.fullName = t("errors.fullNameMax");
  }

  if (!isValidEmail(email)) {
    fieldErrors.email = t("errors.email");
  }

  if (!PHONE_RE.test(phone)) {
    fieldErrors.phone = t("errors.phone");
  }

  if (!EDUCATION_LEVELS.has(educationLevel)) {
    fieldErrors.educationLevel = t("errors.educationLevel");
  }

  if (education.length < 2) {
    fieldErrors.education = t("errors.education");
  } else if (education.length > 200) {
    fieldErrors.education = t("errors.educationMax");
  }

  if (!PRACTICE_AREAS.has(practiceArea)) {
    fieldErrors.practiceArea = t("errors.practiceArea");
  }

  if (professionalSummary.length < 10) {
    fieldErrors.professionalSummary = t("errors.professionalSummary");
  } else if (professionalSummary.length > 2000) {
    fieldErrors.professionalSummary = t("errors.professionalSummaryMax");
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors };
  }

  const apiBaseUrl = process.env.API_BASE_URL ?? "";
  if (!apiBaseUrl) {
    return {
      status: "error",
      message: t("errors.unavailable"),
    };
  }

  try {
    const res = await fetch(`${apiBaseUrl}/api/talent-applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName,
        email,
        phone,
        educationLevel,
        education,
        practiceArea,
        professionalSummary,
      }),
    });

    if (!res.ok) {
      if (res.status === 429) {
        return { status: "error", message: t("errors.rateLimit") };
      }

      return { status: "error", message: t("errors.generic") };
    }
  } catch {
    return { status: "error", message: t("errors.network") };
  }

  return {
    status: "success",
    message: t("successMessage"),
  };
}
