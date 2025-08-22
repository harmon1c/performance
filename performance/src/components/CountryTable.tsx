import React from 'react';
import type { CountryData, YearRecordRaw } from '../data/types';
import { YearlyTable } from './YearlyTable';

export interface CountryTableProps {
  items: CountryData[];
  maxRows?: number;
  extraColumns?: string[];
}

function pickLatestRecord(country: CountryData): YearRecordRaw | null {
  if (country.latestYear === null) {
    return null;
  }
  const target = country.latestYear;
  let fallback: YearRecordRaw | null = null;
  for (const rec of country.years) {
    if (typeof rec.year === 'number') {
      if (rec.year === target) {
        return rec;
      }
      fallback = rec;
    }
  }
  return fallback;
}

const CountryRow = React.memo(function CountryRow({
  country,
  extraColumns = [],
}: {
  country: CountryData;
  extraColumns?: string[];
}) {
  const [open, setOpen] = React.useState(false);
  const latest = pickLatestRecord(country);
  const co2 = latest && typeof latest.co2 === 'number' ? latest.co2 : null;
  const perCapita =
    latest && typeof latest.co2_per_capita === 'number'
      ? latest.co2_per_capita
      : null;
  const pop =
    latest && typeof latest.population === 'number' ? latest.population : null;

  return (
    <>
      <tr className="border-b border-gray-200 dark:border-gray-700">
        <td className="px-3 py-2 font-medium text-gray-900 dark:text-gray-100">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="mr-2 inline-flex items-center justify-center w-5 h-5 rounded border border-gray-300 dark:border-gray-600 text-xs"
            aria-label={open ? 'Collapse' : 'Expand'}
          >
            {open ? '−' : '+'}
          </button>
          {country.name}
        </td>
        <td className="px-3 py-2 text-gray-700 dark:text-gray-300">
          {country.code}
        </td>
        <td className="px-3 py-2 text-gray-700 dark:text-gray-300">
          {country.iso_code ?? 'N/A'}
        </td>
        <td className="px-3 py-2 text-gray-700 dark:text-gray-300">
          {country.latestYear ?? 'N/A'}
        </td>
        <td className="px-3 py-2 text-gray-700 dark:text-gray-300">
          {co2 ?? 'N/A'}
        </td>
        <td className="px-3 py-2 text-gray-700 dark:text-gray-300">
          {perCapita ?? 'N/A'}
        </td>
        <td className="px-3 py-2 text-gray-700 dark:text-gray-300">
          {pop ?? 'N/A'}
        </td>
      </tr>
      {open ? (
        <tr className="border-b border-gray-200 dark:border-gray-700">
          <td className="px-3 py-2" colSpan={7}>
            <YearlyTable years={country.years} extraColumns={extraColumns} />
          </td>
        </tr>
      ) : null}
    </>
  );
});

export function CountryTable(props: CountryTableProps): React.JSX.Element {
  const { items, maxRows = 200, extraColumns = [] } = props;
  const slice = items.length > maxRows ? items.slice(0, maxRows) : items;

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-900/50">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
          <tr>
            <th className="text-left px-3 py-2 font-semibold">Country</th>
            <th className="text-left px-3 py-2 font-semibold">Code</th>
            <th className="text-left px-3 py-2 font-semibold">ISO</th>
            <th className="text-left px-3 py-2 font-semibold">Latest Year</th>
            <th className="text-left px-3 py-2 font-semibold">CO2</th>
            <th className="text-left px-3 py-2 font-semibold">Per Capita</th>
            <th className="text-left px-3 py-2 font-semibold">Population</th>
          </tr>
        </thead>
        <tbody>
          {slice.map((c) => (
            <CountryRow key={c.code} country={c} extraColumns={extraColumns} />
          ))}
        </tbody>
      </table>
      {items.length > maxRows ? (
        <div className="px-3 py-2 text-xs text-gray-600 dark:text-gray-400">
          Showing first {maxRows.toLocaleString()} of{' '}
          {items.length.toLocaleString()} countries
        </div>
      ) : null}
    </div>
  );
}
