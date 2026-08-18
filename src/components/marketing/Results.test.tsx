// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Results } from "./Results";

vi.mock("next-intl", () => ({
  useTranslations: () => {
    const t = (key: string) => {
      const messages: Record<string, string> = {
        title: "Resultados\nque contam",
        ariaLabel: "Resultados da Tessa em números",
        "stats.0.label": "de m² em estruturas metálicas",
        "stats.1.label": "instalações realizadas no Brasil",
        "stats.2.label": "anos de experiência em engenharia estrutural",
      };
      return messages[key] ?? key;
    };
    return t;
  },
}));

describe("public Results", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe(): void {}
        disconnect(): void {}
        unobserve(): void {}
      },
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("renders the real numbers and fallback labels in the initial HTML", () => {
    render(<Results />);

    expect(
      screen.getByRole("heading", { name: /Resultados/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("listitem", {
        name: "+7MI de m² em estruturas metálicas",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("listitem", {
        name: "+200K instalações realizadas no Brasil",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("listitem", {
        name: "+20 anos de experiência em engenharia estrutural",
      }),
    ).toBeInTheDocument();
  });

  it("renders up to four published stats with their CMS labels", () => {
    render(
      <Results
        resultsSection={{
          stats: [
            {
              value: 8_000_000,
              label: "de m² em estruturas metálicas",
            },
            {
              value: 300_000,
              label: "instalações realizadas no Brasil",
            },
            {
              value: 25,
              label: "anos de experiência em engenharia estrutural",
            },
            { value: 4, label: "unidades em operação" },
          ],
        }}
      />,
    );

    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(
      screen.getByRole("listitem", {
        name: "+8MI de m² em estruturas metálicas",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("listitem", { name: "+4 unidades em operação" }),
    ).toBeInTheDocument();
    expect(screen.getByText("unidades em operação")).toBeInTheDocument();
  });
});
