import React from 'react';
import { co2Resource } from '../data/co2Resource';
import type { CountryData } from '../data/types';
import { Search } from '../components/Search';
import { CountryTable } from '../components/CountryTable';
import { ColumnsModal } from '../components/ColumnsModal';
import { useCo2Data } from '../hooks/useCo2Data';
import { useAppDispatch, useAppSelector } from '../store';
import {
  setYear,
  setRegion,
  setSort,
  setSearch,
} from '../store/slices/filtersSlice';
import { setExtraSelected } from '../store/slices/columnsSlice';

function useCountrySearch(items: CountryData[]): {
  query: string;
  setQuery: (q: string) => void;
  filtered: CountryData[];
} {
  const [query, setQuery] = React.useState('');
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return items;
    }
    return items.filter((c) => {
      const name = c.name.toLowerCase();
      const code = c.code.toLowerCase();
      const iso = c.iso_code ? c.iso_code.toLowerCase() : '';
      return name.includes(q) || code.includes(q) || iso.includes(q);
    });
  }, [items, query]);
  return { query, setQuery, filtered };
}

export const Home: React.FC = () => {
  const countries = co2Resource.read();
  const { query, setQuery } = useCountrySearch(countries);
  const [columnsOpen, setColumnsOpen] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const dispatch = useAppDispatch();
  const filters = useAppSelector((s) => s.filters);
  const columnsSel = useAppSelector((s) => s.columns.extraSelected);
  const derived = useCo2Data(countries);

  React.useEffect(() => {
    const id = setTimeout(() => {
      dispatch(setSearch(query));
    }, 180);
    return (): void => {
      clearTimeout(id);
    };
  }, [dispatch, query]);

  React.useEffect(() => {
    setPage(1);
  }, [filters.region, filters.year, filters.sort, query]);

  const availableExtraCols = derived.availableExtraKeys;
  const yearOptions = React.useMemo(
    () => Array.from({ length: 2023 - 1750 + 1 }, (_, i) => 1750 + i),
    []
  );
  const extraRegionOptions = React.useMemo(
    () =>
      derived.regions.filter(
        (r) =>
          r !== 'Africa' &&
          r !== 'Americas' &&
          r !== 'Asia' &&
          r !== 'Europe' &&
          r !== 'Oceania'
      ),
    [derived.regions]
  );

  const onApplyColumns = React.useCallback(
    (next: string[]): void => {
      dispatch(setExtraSelected(next));
    },
    [dispatch]
  );

  const onOpenColumns = React.useCallback(() => setColumnsOpen(true), []);
  const onCloseColumns = React.useCallback(() => setColumnsOpen(false), []);
  const onChangeRegion = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(setRegion(e.target.value));
    },
    [dispatch]
  );
  const onChangeYear = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(setYear(e.target.value ? Number(e.target.value) : 'all'));
    },
    [dispatch]
  );
  const onChangeSort = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const parts = e.target.value.split(':');
      const allowedFields = [
        'name',
        'population',
        'co2',
        'co2_per_capita',
        'year',
      ] as const;
      const allowedDir = ['asc', 'desc'] as const;
      const f0 = parts[0];
      const d0 = parts[1];
      const field = allowedFields.find((f) => f === f0) ?? 'name';
      const direction = allowedDir.find((d) => d === d0) ?? 'asc';
      dispatch(setSort({ field, direction }));
    },
    [dispatch]
  );
  const onPageChangeCb = React.useCallback((p: number) => setPage(p), []);

  return (
    <div className="p-4 grid gap-y-4">
      <div>
        <h2 className="text-xl font-semibold">CO2 Data Explorer</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Browse countries and their latest CO2 stats. Type to filter.
        </p>
      </div>
      <Search
        value={query}
        onChange={setQuery}
        onSearch={setQuery}
        onClear={() => setQuery('')}
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs text-gray-600 dark:text-gray-400">
          {derived.filtered.length.toLocaleString()} countries
        </div>
        <div className="flex items-center gap-2 text-sm">
          <label className="flex items-center gap-1">
            Year:
            <select
              className="border rounded px-2 py-1 bg-white dark:bg-gray-900"
              value={filters.year === 'all' ? '' : String(filters.year)}
              onChange={onChangeYear}
            >
              <option value="">All</option>
              {/* simple range from 1750 to 2023; could be derived */}
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-1">
            Region:
            <select
              className="border rounded px-2 py-1 bg-white dark:bg-gray-900"
              value={filters.region}
              onChange={onChangeRegion}
            >
              <option value="all">All</option>
              <option value="Africa">Africa</option>
              <option value="Americas">Americas</option>
              <option value="Asia">Asia</option>
              <option value="Europe">Europe</option>
              <option value="Oceania">Oceania</option>
              {extraRegionOptions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-1">
            Sort:
            <select
              className="border rounded px-2 py-1 bg-white dark:bg-gray-900"
              value={`${filters.sort.field}:${filters.sort.direction}`}
              onChange={onChangeSort}
            >
              {(
                [
                  ['name', 'asc'],
                  ['name', 'desc'],
                  ['population', 'asc'],
                  ['population', 'desc'],
                  ['co2', 'asc'],
                  ['co2', 'desc'],
                  ['co2_per_capita', 'asc'],
                  ['co2_per_capita', 'desc'],
                  ...(filters.year === 'all'
                    ? ([
                        ['year', 'asc'],
                        ['year', 'desc'],
                      ] as const)
                    : ([] as const)),
                ] as const
              ).map(([f, d]) => (
                <option key={`${f}:${d}`} value={`${f}:${d}`}>
                  {f} {d}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button
          type="button"
          onClick={onOpenColumns}
          className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-sm"
        >
          Select columns
        </button>
      </div>
      <CountryTable
        items={derived.filtered}
        extraColumns={columnsSel}
        selectedYear={filters.year}
        page={page}
        onPageChange={onPageChangeCb}
      />
      <ColumnsModal
        open={columnsOpen}
        available={availableExtraCols}
        selected={columnsSel}
        onChangeSelected={onApplyColumns}
        onClose={onCloseColumns}
      />
    </div>
  );
};
