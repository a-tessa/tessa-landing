"use server";

export interface TestimonialActionState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<
    Record<"name" | "company" | "rating" | "text", string>
  >;
}

const MAX_TEXT = 500;
const MIN_TEXT = 10;
const MAX_NAME = 120;
const MIN_NAME = 2;

export async function submitTestimonial(
  _prevState: TestimonialActionState,
  formData: FormData,
): Promise<TestimonialActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const ratingRaw = formData.get("rating");
  const rating =
    typeof ratingRaw === "string" ? Number.parseInt(ratingRaw, 10) : NaN;
  const text = String(formData.get("text") ?? "").trim();

  const fieldErrors: TestimonialActionState["fieldErrors"] = {};

  if (name.length < MIN_NAME) {
    fieldErrors.name = `Informe seu nome (mínimo ${MIN_NAME} caracteres).`;
  } else if (name.length > MAX_NAME) {
    fieldErrors.name = `Nome deve ter no máximo ${MAX_NAME} caracteres.`;
  }

  if (company.length < MIN_NAME) {
    fieldErrors.company = `Informe o nome da empresa (mínimo ${MIN_NAME} caracteres).`;
  } else if (company.length > MAX_NAME) {
    fieldErrors.company = `Nome da empresa deve ter no máximo ${MAX_NAME} caracteres.`;
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    fieldErrors.rating = "Selecione uma nota de 1 a 5 estrelas.";
  }

  if (text.length < MIN_TEXT) {
    fieldErrors.text = `Escreva seu depoimento (mínimo ${MIN_TEXT} caracteres).`;
  } else if (text.length > MAX_TEXT) {
    fieldErrors.text = `O depoimento não pode exceder ${MAX_TEXT} caracteres.`;
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors };
  }

  // Integração futura: e-mail, CRM ou armazenamento.
  return {
    status: "success",
    message:
      "Obrigado pelo seu depoimento! Ele foi recebido e será analisado pela equipe.",
  };
}
