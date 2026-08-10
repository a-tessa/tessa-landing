import { describe, expect, it } from "vitest";
import {
  DEFAULT_RESULTS_VALUES,
  resolveResultsValues,
} from "./results-content";

describe("resolveResultsValues", () => {
  it("returns defaults when content is missing or invalid", () => {
    expect(resolveResultsValues(null)).toEqual(DEFAULT_RESULTS_VALUES);
    expect(resolveResultsValues({})).toEqual(DEFAULT_RESULTS_VALUES);
    expect(resolveResultsValues({ values: [7, 200] })).toEqual(
      DEFAULT_RESULTS_VALUES,
    );
    expect(resolveResultsValues({ values: [7, -1, 20] })).toEqual(
      DEFAULT_RESULTS_VALUES,
    );
  });

  it("returns the three CMS values when valid", () => {
    expect(resolveResultsValues({ values: [10, 300, 25] })).toEqual([
      10, 300, 25,
    ]);
  });
});
