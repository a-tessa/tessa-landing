export const MIN_RESULTS_STATS = 1;
export const MAX_RESULTS_STATS = 4;
export const MAX_RESULTS_LABEL_LENGTH = 80;
export const RESULTS_SECTION_LEGACY_STAT_COUNT = 3;

const MILLION = 1_000_000;
const THOUSAND = 1_000;
const LEGACY_COMPACT_SUFFIXES = ["MI", "K", ""] as const;

export interface ResultStat {
  value: number;
  suffix: string;
  label?: string;
}

export const DEFAULT_RESULTS_RAW_VALUES = [7_000_000, 200_000, 20] as const;

function divideForSuffix(value: number, divisor: number): number {
  const result = value / divisor;
  if (Number.isInteger(result)) return result;
  return Math.round(result * 10) / 10;
}

export function abbreviateResultValue(value: number): {
  value: number;
  suffix: string;
} {
  if (!Number.isFinite(value) || value < 0) {
    return { value: 0, suffix: "" };
  }

  if (value >= MILLION) {
    return { value: divideForSuffix(value, MILLION), suffix: "MI" };
  }

  if (value >= THOUSAND) {
    return { value: divideForSuffix(value, THOUSAND), suffix: "K" };
  }

  return { value, suffix: "" };
}

export function expandCompactResultValue(
  value: number,
  suffix: string,
): number {
  const normalized = suffix.trim().toUpperCase();
  if (normalized === "MI") return value * MILLION;
  if (normalized === "K") return value * THOUSAND;
  return value;
}

export const DEFAULT_RESULTS_STATS: readonly ResultStat[] =
  DEFAULT_RESULTS_RAW_VALUES.map((value) => abbreviateResultValue(value));

export interface ResultsSection {
  stats: ResultStat[];
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function parseLabel(entry: Record<string, unknown>): string | undefined | null {
  if (typeof entry.label !== "string") return undefined;

  const label = entry.label.trim();
  if (label.length === 0 || label.length > MAX_RESULTS_LABEL_LENGTH) {
    return null;
  }

  return label;
}

function parseStat(entry: unknown): ResultStat | null {
  if (!isObject(entry) || !isNonNegativeInteger(entry.value)) {
    return null;
  }

  const label = parseLabel(entry);
  if (label === null) return null;

  const storedSuffix =
    typeof entry.suffix === "string" ? entry.suffix.trim() : "";
  const abbreviated =
    storedSuffix.length > 0
      ? { value: entry.value, suffix: storedSuffix }
      : abbreviateResultValue(entry.value);

  return label === undefined
    ? abbreviated
    : { ...abbreviated, label };
}

function parseLegacyValues(values: unknown[]): ResultStat[] | null {
  if (values.length !== RESULTS_SECTION_LEGACY_STAT_COUNT) {
    return null;
  }

  const parsed: ResultStat[] = [];
  for (const [index, entry] of values.entries()) {
    if (!isNonNegativeInteger(entry)) {
      return null;
    }

    parsed.push({
      value: entry,
      suffix: LEGACY_COMPACT_SUFFIXES[index] ?? "",
    });
  }

  return parsed;
}

export function resolveResultsStats(value: unknown): ResultStat[] {
  if (isObject(value) && Array.isArray(value.stats)) {
    if (
      value.stats.length < MIN_RESULTS_STATS ||
      value.stats.length > MAX_RESULTS_STATS
    ) {
      return [...DEFAULT_RESULTS_STATS];
    }

    const parsed: ResultStat[] = [];
    for (const entry of value.stats) {
      const stat = parseStat(entry);
      if (!stat) {
        return [...DEFAULT_RESULTS_STATS];
      }
      parsed.push(stat);
    }

    return parsed;
  }

  if (isObject(value) && Array.isArray(value.values)) {
    return parseLegacyValues(value.values) ?? [...DEFAULT_RESULTS_STATS];
  }

  return [...DEFAULT_RESULTS_STATS];
}
