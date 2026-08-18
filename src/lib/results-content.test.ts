import { describe, expect, it } from "vitest";
import {
  abbreviateResultValue,
  DEFAULT_RESULTS_STATS,
  resolveResultsStats,
} from "./results-content";

describe("abbreviateResultValue", () => {
  it("turns millions into MI and thousands into K", () => {
    expect(abbreviateResultValue(8_000_000)).toEqual({ value: 8, suffix: "MI" });
    expect(abbreviateResultValue(600_000)).toEqual({ value: 600, suffix: "K" });
    expect(abbreviateResultValue(20)).toEqual({ value: 20, suffix: "" });
  });
});

describe("resolveResultsStats", () => {
  it("returns defaults when content is missing or invalid", () => {
    expect(resolveResultsStats(null)).toEqual(DEFAULT_RESULTS_STATS);
    expect(resolveResultsStats({})).toEqual(DEFAULT_RESULTS_STATS);
    expect(resolveResultsStats({ stats: [] })).toEqual(DEFAULT_RESULTS_STATS);
    expect(resolveResultsStats({ values: [7, 200] })).toEqual(
      DEFAULT_RESULTS_STATS,
    );
    expect(resolveResultsStats({ values: [7, -1, 20] })).toEqual(
      DEFAULT_RESULTS_STATS,
    );
  });

  it("abbreviates published raw values automatically", () => {
    expect(
      resolveResultsStats({
        stats: [
          {
            value: 8_000_000,
            label: "de m² em estruturas metálicas",
          },
          { value: 4, label: "unidades em operação" },
        ],
      }),
    ).toEqual([
      {
        value: 8,
        suffix: "MI",
        label: "de m² em estruturas metálicas",
      },
      { value: 4, suffix: "", label: "unidades em operação" },
    ]);
  });

  it("keeps previously compacted values with an explicit suffix", () => {
    expect(
      resolveResultsStats({
        stats: [
          {
            value: 10,
            suffix: "MI",
            label: "de m² em estruturas metálicas",
          },
        ],
      }),
    ).toEqual([
      {
        value: 10,
        suffix: "MI",
        label: "de m² em estruturas metálicas",
      },
    ]);
  });

  it("keeps legacy three-number payloads as unlabeled fallback stats", () => {
    expect(resolveResultsStats({ values: [10, 300, 25] })).toEqual([
      { value: 10, suffix: "MI" },
      { value: 300, suffix: "K" },
      { value: 25, suffix: "" },
    ]);
  });
});
