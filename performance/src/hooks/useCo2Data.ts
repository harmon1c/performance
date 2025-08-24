import React from 'react';
import { useAppSelector } from '../store';
import type { CountryData, YearRecordRaw } from '../data/types';

export interface DerivedCo2 {
  filtered: CountryData[];
  availableExtraKeys: string[];
  regions: string[];
}

function matchesSearch(s: string, q: string): boolean {
  return s.toLowerCase().includes(q.toLowerCase());
}

export function useCo2Data(countries: CountryData[]): DerivedCo2 {
  const { year, region, search, sort } = useAppSelector((s) => s.filters);

  const filtered = React.useMemo(() => {
    let arr = countries;
    if (region !== 'all') {
      const target = region.toLowerCase();
      arr = arr.filter((c) => {
        const r = (c.region ?? '').toLowerCase();
        if (!r) {
          return false;
        }
        if (target === 'americas') {
          return r.includes('america');
        }
        return r === target || r.includes(target) || target.includes(r);
      });
    }
    if (search.trim()) {
      const q = search.trim();
      arr = arr.filter(
        (c) =>
          matchesSearch(c.name, q) ||
          matchesSearch(c.code, q) ||
          matchesSearch(c.iso_code ?? '', q)
      );
    }
    if (year !== 'all') {
      arr = arr.filter((c) => c.years.some((y) => y.year === year));
    }
    const copy = arr.slice();
    const dir = sort.direction === 'asc' ? 1 : -1;
    const compareWithin = (a: CountryData, b: CountryData): number => {
      switch (sort.field) {
        case 'name':
          return a.name.localeCompare(b.name) * dir;
        case 'population': {
          const av = valueFor(a, 'population', year);
          const bv = valueFor(b, 'population', year);
          return compareNullable(av, bv) * dir;
        }
        case 'co2': {
          const av = valueFor(a, 'co2', year);
          const bv = valueFor(b, 'co2', year);
          return compareNullable(av, bv) * dir;
        }
        case 'co2_per_capita': {
          const av = valueFor(a, 'co2_per_capita', year);
          const bv = valueFor(b, 'co2_per_capita', year);
          return compareNullable(av, bv) * dir;
        }
        case 'year': {
          const av = a.latestYear ?? -Infinity;
          const bv = b.latestYear ?? -Infinity;
          return (av - bv) * dir;
        }
        default:
          return 0;
      }
    };

    copy.sort(compareWithin);
    return copy;
  }, [countries, region, search, year, sort.direction, sort.field]);

  const regions = React.useMemo(() => {
    const set = new Set<string>();
    for (const c of countries) {
      if (typeof c.region === 'string' && c.region.trim()) {
        set.add(c.region);
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [countries]);

  const availableExtraKeys = React.useMemo(() => {
    const base = new Set<string>();
    for (let i = 0; i < filtered.length; i++) {
      const ys = filtered[i]?.years;
      if (!Array.isArray(ys)) {
        continue;
      }
      for (let j = 0; j < ys.length && j < 50; j++) {
        const rec = ys[j];
        for (const k in rec) {
          if (
            k === 'year' ||
            k === 'population' ||
            k === 'co2' ||
            k === 'co2_per_capita'
          ) {
            continue;
          }
          base.add(k);
        }
      }
      if (base.size > 150) {
        break;
      }
    }
    return Array.from(base).sort();
  }, [filtered]);

  return { filtered, availableExtraKeys, regions };
}

function latestVal(c: CountryData, key: keyof YearRecordRaw): number | null {
  let v: number | null = null;
  for (let i = c.years.length - 1; i >= 0; i--) {
    const rec = c.years[i];
    if (!rec) {
      continue;
    }
    const x = rec[key];
    if (typeof x === 'number' && Number.isFinite(x)) {
      v = x;
      break;
    }
  }
  return v;
}

function valueFor(
  c: CountryData,
  key: keyof YearRecordRaw,
  year: number | 'all'
): number | null {
  if (year !== 'all') {
    for (let i = 0; i < c.years.length; i++) {
      const rec = c.years[i];
      if (rec && rec.year === year) {
        const x = rec[key];
        return typeof x === 'number' && Number.isFinite(x) ? x : null;
      }
    }
    return null;
  }
  return latestVal(c, key);
}

function compareNullable(a: number | null, b: number | null): number {
  if (a == null && b == null) {
    return 0;
  }
  if (a == null) {
    return 1;
  }
  if (b == null) {
    return -1;
  }
  return a - b;
}
