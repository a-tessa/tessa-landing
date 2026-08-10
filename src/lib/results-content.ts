export const RESULTS_SECTION_STAT_COUNT = 3;

export const DEFAULT_RESULTS_VALUES = [7, 200, 20] as const;

export type ResultsSectionValues = readonly [
  number,
  number,
  number,
];

export interface ResultsSection {
  values: ResultsSectionValues;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function resolveResultsValues(
  value: unknown,
): ResultsSectionValues {
  if (!isObject(value) || !Array.isArray(value.values)) {
    return DEFAULT_RESULTS_VALUES;
  }

  if (value.values.length !== RESULTS_SECTION_STAT_COUNT) {
    return DEFAULT_RESULTS_VALUES;
  }

  const parsed: number[] = [];
  for (const entry of value.values) {
    if (typeof entry !== "number" || !Number.isInteger(entry) || entry < 0) {
      return DEFAULT_RESULTS_VALUES;
    }
    parsed.push(entry);
  }

  return [parsed[0]!, parsed[1]!, parsed[2]!];
}
