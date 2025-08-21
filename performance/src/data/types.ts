export interface YearRecordRaw {
  year: number;
  population?: number;
  co2?: number;
  co2_per_capita?: number;
  [key: string]: unknown;
}

export interface CountryData {
  code: string; // key from root (e.g. USA)
  name: string; // best-effort name
  iso_code: string | null; // consistently present (null if absent)
  years: YearRecordRaw[]; // full array as-is
  latestYear: number | null; // null when unavailable
}
