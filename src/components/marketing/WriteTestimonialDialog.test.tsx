// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { MAX_TESTIMONIAL_IMAGE_BYTES } from "@/lib/testimonials/image-limit";
import { WriteTestimonialDialog } from "./WriteTestimonialDialog";

const submitTestimonial = vi.fn(async () => ({
  status: "success" as const,
  message: "ok",
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string, values?: { size?: number }) =>
    values && typeof values.size === "number" ? `${key}:${values.size}` : key,
}));

vi.mock("@/app/actions/testimonial", () => ({
  submitTestimonial: (...args: unknown[]) => submitTestimonial(...args),
}));

beforeAll(() => {
  URL.createObjectURL = vi.fn(() => "blob:preview");
  URL.revokeObjectURL = vi.fn();
});

afterEach(() => {
  cleanup();
  submitTestimonial.mockClear();
});

function renderDialog() {
  render(<WriteTestimonialDialog />);
  fireEvent.click(screen.getByRole("button", { name: "dialogTitle" }));
}

function fillRequiredFields() {
  fireEvent.change(screen.getByLabelText("nameLabel"), {
    target: { value: "Ana Silva" },
  });
  fireEvent.change(screen.getByLabelText("companyLabel"), {
    target: { value: "Metalica" },
  });
  fireEvent.change(screen.getByLabelText("textLabel"), {
    target: { value: "Atendimento dentro do combinado." },
  });
}

function imageFile(name: string, size: number): File {
  return new File([new Uint8Array(size)], name, { type: "image/jpeg" });
}

describe("WriteTestimonialDialog image size", () => {
  it("keeps an oversized photo out of the server action and shows the limit", async () => {
    renderDialog();
    fillRequiredFields();

    const input = screen.getByLabelText("profileImageLabel");
    fireEvent.change(input, {
      target: {
        files: [imageFile("grande.jpg", MAX_TESTIMONIAL_IMAGE_BYTES + 1)],
      },
    });

    await waitFor(() => {
      expect(screen.getByText("profileImageTooLarge:4")).toBeInTheDocument();
    });
    expect(input).toHaveValue("");

    fireEvent.click(screen.getByRole("button", { name: "submit" }));

    expect(submitTestimonial).not.toHaveBeenCalled();
  });

  it("submits a photo within the 4 MB limit", () => {
    renderDialog();
    fillRequiredFields();

    fireEvent.change(screen.getByLabelText("profileImageLabel"), {
      target: { files: [imageFile("ok.jpg", 1024)] },
    });

    expect(screen.queryByText("profileImageTooLarge:4")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "submit" }));

    expect(submitTestimonial).toHaveBeenCalledOnce();
  });
});
