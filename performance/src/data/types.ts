export interface YearRecordRaw {
  year: number;
  population?: number;
  co2?: number;
  co2_per_capita?: number;
  [key: string]: unknown;
}

export interface CountryData {
  code: string;
  name: string;
  iso_code: string | null;
  region: string | null;
  years: YearRecordRaw[];
  latestYear: number | null;
}
