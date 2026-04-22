"use server";

type ContactField =
  | "fullName"
  | "email"
  | "phone"
  | "companyName"
  | "city"
  | "state"
  | "service"
  | "message";

export interface ContactActionState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<ContactField, string>>;
}

const MAX_NAME = 200;
const MAX_EMAIL = 200;
const MAX_PHONE = 30;
const MAX_COMPANY = 200;
const MAX_CITY = 100;
const MAX_SERVICE = 200;
const MAX_MESSAGE = 2000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BR_STATES = new Set([
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",
  "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI",
  "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
]);

function getTrimmed(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitContact(
  _prevState: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  const fullName = getTrimmed(formData, "name");
  const email = getTrimmed(formData, "email");
  const phone = getTrimmed(formData, "phone");
  const companyName = getTrimmed(formData, "company");
  const city = getTrimmed(formData, "city");
  const state = getTrimmed(formData, "state").toUpperCase();
  const service = getTrimmed(formData, "service");
  const message = getTrimmed(formData, "message");

  const fieldErrors: NonNullable<ContactActionState["fieldErrors"]> = {};

  if (fullName.length < 2) {
    fieldErrors.fullName = "Informe seu nome completo.";
  } else if (fullName.length > MAX_NAME) {
    fieldErrors.fullName = `Máximo ${MAX_NAME} caracteres.`;
  }

  if (!EMAIL_RE.test(email) || email.length > MAX_EMAIL) {
    fieldErrors.email = "Informe um e-mail válido.";
  }

  if (phone.length < 8 || phone.length > MAX_PHONE) {
    fieldErrors.phone = "Informe um telefone válido.";
  }

  if (companyName.length < 2) {
    fieldErrors.companyName = "Informe o nome da empresa.";
  } else if (companyName.length > MAX_COMPANY) {
    fieldErrors.companyName = `Máximo ${MAX_COMPANY} caracteres.`;
  }

  if (city.length < 2) {
    fieldErrors.city = "Informe a cidade.";
  } else if (city.length > MAX_CITY) {
    fieldErrors.city = `Máximo ${MAX_CITY} caracteres.`;
  }

  if (!BR_STATES.has(state)) {
    fieldErrors.state = "Selecione um estado.";
  }

  if (service && service.length > MAX_SERVICE) {
    fieldErrors.service = `Máximo ${MAX_SERVICE} caracteres.`;
  }

  if (message && message.length > MAX_MESSAGE) {
    fieldErrors.message = `Máximo ${MAX_MESSAGE} caracteres.`;
  }

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

  const payload: Record<string, string> = {
    fullName,
    email,
    phone,
    companyName,
    city,
    state,
  };

  if (service) payload.service = service;
  if (message) payload.message = message;

  try {
    const res = await fetch(`${apiBaseUrl}/api/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      if (res.status === 429) {
        return {
          status: "error",
          message:
            "Muitos envios recentemente. Aguarde um instante e tente novamente.",
        };
      }

      const data = (await res.json().catch(() => null)) as
        | { error?: string }
        | null;

      return {
        status: "error",
        message:
          data?.error ??
          "Não foi possível enviar seu contato. Tente novamente mais tarde.",
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
      "Recebemos o seu contato com muito carinho. Em breve um dos nossos especialistas entrará em contato pelo e-mail ou telefone informado para conversar sobre o seu projeto. Obrigado pela confiança!",
  };
}
