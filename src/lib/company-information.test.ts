import { describe, expect, it } from "vitest";
import { SITE } from "@/lib/seo/schemas";
import {
  resolveCompanyInformation,
  toPublicCompanyContact,
  whatsappHref,
} from "./company-information";

const validSection = {
  name: "Tessa Tecnologia e Desenvolvimento LTDA",
  cnpj: "00.000.000/0001-00",
  address: "Rodovia Assis Chateaubriand SP 425 KM175.9, Guapiaçu",
  zipCode: "15110-000",
  email: "contato@tessa.com.br",
  phoneContacts: [
    { phone: "+55 17 3267-1220" },
    { phone: "+55 17 3267-1453" },
  ],
};

describe("resolveCompanyInformation", () => {
  it("returns null when content is missing or invalid", () => {
    expect(resolveCompanyInformation(null)).toBeNull();
    expect(resolveCompanyInformation({})).toBeNull();
    expect(
      resolveCompanyInformation({
        ...validSection,
        email: "not-an-email",
      }),
    ).toBeNull();
    expect(
      resolveCompanyInformation({
        ...validSection,
        phoneContacts: [],
      }),
    ).toBeNull();
  });

  it("returns trimmed CMS values when valid", () => {
    expect(
      resolveCompanyInformation({
        ...validSection,
        name: "  Tessa LTDA  ",
        email: " contato@tessa.com.br ",
      }),
    ).toEqual({
      ...validSection,
      name: "Tessa LTDA",
      email: "contato@tessa.com.br",
    });
  });

  it("keeps a valid WhatsApp number and ignores an invalid one", () => {
    expect(
      resolveCompanyInformation({
        ...validSection,
        whatsapp: " +55 17 99999-1234 ",
      }),
    ).toEqual({
      ...validSection,
      whatsapp: "+55 17 99999-1234",
    });
    expect(
      resolveCompanyInformation({
        ...validSection,
        whatsapp: "(17) 99999-1234",
      }),
    ).toEqual({
      ...validSection,
      whatsapp: "(17) 99999-1234",
    });
    expect(
      resolveCompanyInformation({
        ...validSection,
        whatsapp: "123",
      }),
    ).toEqual(validSection);
  });
});

describe("toPublicCompanyContact", () => {
  it("uses SITE fallbacks when CMS content is absent", () => {
    expect(toPublicCompanyContact(null)).toEqual({
      name: SITE.name,
      cnpj: null,
      address: `${SITE.address.streetAddress}, ${SITE.address.addressLocality}`,
      zipCode: SITE.address.postalCode,
      email: SITE.email,
      whatsapp: null,
      phones: [...SITE.phones],
    });
  });

  it("maps a valid CMS section to public contact fields", () => {
    expect(
      toPublicCompanyContact({
        ...validSection,
        whatsapp: "+55 17 99999-1234",
      }),
    ).toEqual({
      name: validSection.name,
      cnpj: validSection.cnpj,
      address: validSection.address,
      zipCode: validSection.zipCode,
      email: validSection.email,
      whatsapp: "+55 17 99999-1234",
      phones: ["+55 17 3267-1220", "+55 17 3267-1453"],
    });
  });
});

describe("whatsappHref", () => {
  it("builds a wa.me link with digits only", () => {
    expect(whatsappHref("+55 17 99999-1234")).toBe(
      "https://wa.me/5517999991234",
    );
  });

  it("adds Brazil country code when the number is national", () => {
    expect(whatsappHref("(17) 99999-1234")).toBe(
      "https://wa.me/5517999991234",
    );
  });
});
