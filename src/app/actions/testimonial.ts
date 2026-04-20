"use server";

export interface TestimonialActionState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<
    Record<
      "name" | "company" | "rating" | "text" | "profileImage" | "reviewImage",
      string
    >
  >;
}

const MAX_TEXT = 500;
const MIN_TEXT = 10;
const MAX_NAME = 120;
const MIN_NAME = 2;
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;
const ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"] as const;

function isAllowedImage(file: File): boolean {
  if (file.type && ALLOWED_IMAGE_MIME_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_MIME_TYPES)[number])) {
    return true;
  }

  const name = file.name.toLowerCase();
  return ALLOWED_IMAGE_EXTENSIONS.some((ext) => name.endsWith(ext));
}

function getImageField(
  formData: FormData,
  field: "profileImage" | "reviewImage",
  fieldErrors: NonNullable<TestimonialActionState["fieldErrors"]>,
  genericError: string,
  sizeError: string,
  typeError: string,
): File | null {
  const value = formData.get(field);

  if (!(value instanceof File) || value.size === 0) {
    return null;
  }

  if (value.size > MAX_IMAGE_BYTES) {
    fieldErrors[field] = sizeError;
    return null;
  }

  if (!isAllowedImage(value)) {
    fieldErrors[field] = typeError;
    return null;
  }

  if (!value.name) {
    fieldErrors[field] = genericError;
    return null;
  }

  return value;
}

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

  const fieldErrors: NonNullable<TestimonialActionState["fieldErrors"]> = {};

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

  const profileImage = getImageField(
    formData,
    "profileImage",
    fieldErrors,
    "Foto de perfil inválida.",
    "A foto de perfil deve ter no máximo 4 MB.",
    "Envie uma foto de perfil em JPG, PNG ou WebP.",
  );

  const reviewImage = getImageField(
    formData,
    "reviewImage",
    fieldErrors,
    "Foto da avaliação inválida.",
    "A foto da avaliação deve ter no máximo 4 MB.",
    "Envie uma foto da avaliação em JPG, PNG ou WebP.",
  );

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors };
  }

  const apiBaseUrl = process.env.API_BASE_URL ?? "";
  if (!apiBaseUrl) {
    return {
      status: "error",
      message:
        "Serviço de envio indisponível no momento. Tente novamente mais tarde.",
    };
  }

  const apiFormData = new FormData();
  apiFormData.set("authorName", name);
  apiFormData.set("companyName", company);
  apiFormData.set("rating", String(rating));
  apiFormData.set("comment", text);

  if (profileImage) {
    apiFormData.set("profileImage", profileImage, profileImage.name);
  }

  if (reviewImage) {
    apiFormData.set("reviewImage", reviewImage, reviewImage.name);
  }

  try {
    const res = await fetch(`${apiBaseUrl}/api/testimonials`, {
      method: "POST",
      body: apiFormData,
    });

    if (!res.ok) {
      if (res.status === 429) {
        return {
          status: "error",
          message:
            "Muitos depoimentos enviados recentemente. Aguarde um pouco e tente novamente.",
        };
      }

      const data = (await res.json().catch(() => null)) as
        | { error?: string }
        | null;

      return {
        status: "error",
        message:
          data?.error ??
          "Não foi possível enviar seu depoimento. Tente novamente mais tarde.",
      };
    }
  } catch {
    return {
      status: "error",
      message:
        "Falha de conexão com o servidor. Verifique sua internet e tente novamente.",
    };
  }

  return {
    status: "success",
    message:
      "Obrigado pelo seu depoimento! Ele foi recebido e será analisado pela equipe.",
  };
}
