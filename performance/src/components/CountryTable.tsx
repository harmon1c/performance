import React from 'react';
import type { CountryData, YearRecordRaw } from '../data/types';
import { YearlyTable } from './YearlyTable';
import { Pagination } from './Pagination';

export interface CountryTableProps {
  items: CountryData[];
  maxRows?: number;
  extraColumns?: string[];
  selectedYear?: number | 'all';
  page?: number;
  onPageChange?: (page: number) => void;
  height?: number;
  rowHeight?: number;
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

function pickRecordForYear(
  country: CountryData,
  selectedYear?: number | 'all'
): YearRecordRaw | null {
  if (typeof selectedYear === 'number') {
    for (const rec of country.years) {
      if (rec && rec.year === selectedYear) {
        return rec;
      }
    }
    return null;
  }
  return pickLatestRecord(country);
}

const CountryRow = React.memo(function CountryRow({
  country,
  extraColumns = [],
  selectedYear,
}: {
  country: CountryData;
  extraColumns?: string[];
  selectedYear?: number | 'all';
}) {
  const [open, setOpen] = React.useState(false);
  const [flash, setFlash] = React.useState(false);
  const prevYearRef = React.useRef<number | 'all' | undefined>(selectedYear);
  React.useEffect(() => {
    if (prevYearRef.current !== selectedYear) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 700);
      prevYearRef.current = selectedYear;
      return (): void => clearTimeout(t);
    }
    return undefined;
  }, [selectedYear]);
  const recForDisplay = React.useMemo(
    () => pickRecordForYear(country, selectedYear),
    [country, selectedYear]
  );
  const { co2, perCapita, pop } = React.useMemo(() => {
    const v = recForDisplay;
    const co2Val = v && typeof v.co2 === 'number' ? v.co2 : null;
    const perCapitaVal =
      v && typeof v.co2_per_capita === 'number' ? v.co2_per_capita : null;
    const popVal = v && typeof v.population === 'number' ? v.population : null;
    return { co2: co2Val, perCapita: perCapitaVal, pop: popVal };
  }, [recForDisplay]);

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
          {typeof selectedYear === 'number'
            ? selectedYear
            : (country.latestYear ?? 'N/A')}
        </td>
        <td
          className={
            'px-3 py-2 text-gray-700 dark:text-gray-300 ' +
            (flash
              ? 'bg-yellow-50 dark:bg-yellow-900/20 transition-colors duration-700'
              : '')
          }
        >
          {co2 ?? 'N/A'}
        </td>
        <td
          className={
            'px-3 py-2 text-gray-700 dark:text-gray-300 ' +
            (flash
              ? 'bg-yellow-50 dark:bg-yellow-900/20 transition-colors duration-700'
              : '')
          }
        >
          {perCapita ?? 'N/A'}
        </td>
        <td
          className={
            'px-3 py-2 text-gray-700 dark:text-gray-300 ' +
            (flash
              ? 'bg-yellow-50 dark:bg-yellow-900/20 transition-colors duration-700'
              : '')
          }
        >
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

export const CountryTable = React.memo(function CountryTable(
  props: CountryTableProps
): React.JSX.Element {
  const {
    items,
    maxRows = 100,
    extraColumns = [],
    selectedYear,
    page = 1,
    onPageChange,
    height = 600,
    rowHeight = 40,
  } = props;

  const pageSize = Math.max(1, maxRows);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const end = Math.min(start + pageSize, items.length);
  const slice = React.useMemo(
    () => items.slice(start, end),
    [items, start, end]
  );

  const handlePageChange = React.useCallback(
    (p: number) => {
      onPageChange?.(p);
    },
    [onPageChange]
  );

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = React.useState(0);
  const onScroll = React.useCallback((): void => {
    const el = containerRef.current;
    if (!el) {
      return;
    }
    setScrollTop(el.scrollTop);
  }, []);

  const total = slice.length;
  const viewport = Math.max(1, Math.floor(height / rowHeight));
  const buffer = 5;
  const startIdx = Math.max(0, Math.floor(scrollTop / rowHeight) - buffer);
  const endIdx = Math.min(total, startIdx + viewport + buffer * 2);
  const topPad = startIdx * rowHeight;
  const bottomPad = Math.max(0, (total - endIdx) * rowHeight);
  const visible = React.useMemo(
    () => slice.slice(startIdx, endIdx),
    [slice, startIdx, endIdx]
  );

  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-900/50">
      <div className="w-full overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="text-left px-3 py-2 font-semibold">Country</th>
              <th className="text-left px-3 py-2 font-semibold">Code</th>
              <th className="text-left px-3 py-2 font-semibold">ISO</th>
              <th className="text-left px-3 py-2 font-semibold">
                {typeof selectedYear === 'number' ? 'Year' : 'Latest Year'}
              </th>
              <th className="text-left px-3 py-2 font-semibold">CO2</th>
              <th className="text-left px-3 py-2 font-semibold">Per Capita</th>
              <th className="text-left px-3 py-2 font-semibold">Population</th>
            </tr>
          </thead>
        </table>
      </div>
      <div
        ref={containerRef}
        onScroll={onScroll}
        className="overflow-auto"
        style={{ maxHeight: height }}
      >
        <table className="min-w-full text-sm">
          <tbody>
            {topPad > 0 ? (
              <tr>
                <td className="p-0" colSpan={7} style={{ height: topPad }} />
              </tr>
            ) : null}
            {visible.map((c) => (
              <CountryRow
                key={c.code}
                country={c}
                extraColumns={extraColumns}
                {...(selectedYear !== undefined ? { selectedYear } : {})}
              />
            ))}
            {bottomPad > 0 ? (
              <tr>
                <td className="p-0" colSpan={7} style={{ height: bottomPad }} />
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      {items.length > pageSize ? (
        <div className="px-3 py-3 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <div>
            Showing {items.length === 0 ? 0 : start + 1}–{end} of{' '}
            {items.length.toLocaleString()} countries
          </div>
          <div>
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
});
