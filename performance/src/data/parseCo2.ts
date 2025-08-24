import type { CountryData, YearRecordRaw } from './types';
import { continentFromIso } from './isoContinent';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isYearRecordArray(value: unknown): value is YearRecordRaw[] {
  return Array.isArray(value);
}

interface ExtractedCountry {
  country: string | null;
  iso_code: string | null;
  region: string | null;
  data: YearRecordRaw[];
}

function normalizeRegion(input: unknown): string | null {
  if (typeof input !== 'string') {
    return null;
  }
  const t = input.trim().toLowerCase();
  if (!t) {
    return null;
  }

  if (t === 'north america' || t === 'south america') {
    return 'Americas';
  }
  if (t === 'africa') {
    return 'Africa';
  }
  if (t === 'asia') {
    return 'Asia';
  }
  if (t === 'europe') {
    return 'Europe';
  }
  if (t === 'oceania') {
    return 'Oceania';
  }

  return input
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function extractCountry(value: unknown): ExtractedCountry {
  if (!isRecord(value)) {
    return { country: null, iso_code: null, region: null, data: [] };
  }
  const countryVal = value['country'];
  const isoVal = value['iso_code'];
  const regionVal = value['region'] ?? value['continent'] ?? value['group'];
  const dataVal = value['data'];
  const country = typeof countryVal === 'string' ? countryVal : null;
  const iso_code = typeof isoVal === 'string' ? isoVal : null;
  const region = normalizeRegion(regionVal);
  const data = isYearRecordArray(dataVal) ? dataVal : [];
  return { country, iso_code, region, data };
}

export async function parseCo2(raw: unknown): Promise<CountryData[]> {
  if (!isRecord(raw)) {
    return [];
  }

  const result: CountryData[] = [];

  const rootObj: Record<string, unknown> = raw;
  for (const code of Object.keys(rootObj)) {
    const value = rootObj[code];
    const { country, iso_code, region, data } = extractCountry(value);

    const dataArr: YearRecordRaw[] = data;

    let latestYear: number | null = null;
    for (const rec of dataArr) {
      if (rec && typeof rec.year === 'number') {
        if (latestYear === null || rec.year > latestYear) {
          latestYear = rec.year;
        }
      }
    }

    const regionFixed =
      region ??
      continentFromIso(iso_code) ??
      (code && code.length === 3 ? continentFromIso(code) : null);

    result.push({
      code,
      name: country || code,
      iso_code,
      region: regionFixed,
      years: dataArr,
      latestYear,
    });
  }

  return result;
}
