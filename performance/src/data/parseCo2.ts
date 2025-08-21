import type { CountryData, YearRecordRaw } from './types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isYearRecordArray(value: unknown): value is YearRecordRaw[] {
  return Array.isArray(value);
}

interface ExtractedCountry {
  country: string | null;
  iso_code: string | null;
  data: YearRecordRaw[];
}

function extractCountry(value: unknown): ExtractedCountry {
  if (!isRecord(value)) {
    return { country: null, iso_code: null, data: [] };
  }
  const countryVal = value['country'];
  const isoVal = value['iso_code'];
  const dataVal = value['data'];
  const country = typeof countryVal === 'string' ? countryVal : null;
  const iso_code = typeof isoVal === 'string' ? isoVal : null;
  const data = isYearRecordArray(dataVal) ? dataVal : [];
  return { country, iso_code, data };
}

export async function parseCo2(raw: unknown): Promise<CountryData[]> {
  if (!isRecord(raw)) {
    return [];
  }

  const result: CountryData[] = [];

  const rootObj: Record<string, unknown> = raw;
  for (const code of Object.keys(rootObj)) {
    const value = rootObj[code];
    const { country, iso_code, data } = extractCountry(value);
    const dataArr: YearRecordRaw[] = data;

    let latestYear: number | null = null;
    for (const rec of dataArr) {
      if (rec && typeof rec.year === 'number') {
        if (latestYear === null || rec.year > latestYear) {
          latestYear = rec.year;
        }
      }
    }

    result.push({
      code,
      name: country || code,
      iso_code,
      years: dataArr,
      latestYear,
    });
  }

  return result;
}
