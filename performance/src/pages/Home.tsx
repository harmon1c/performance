import React from 'react';
import { co2Resource } from '../data/co2Resource';
import type { CountryData } from '../data/types';
import { Search } from '../components/Search';
import { CountryTable } from '../components/CountryTable';
import { ColumnsModal } from '../components/ColumnsModal';

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
  const { query, setQuery, filtered } = useCountrySearch(countries);
  const [columnsOpen, setColumnsOpen] = React.useState(false);
  const [selectedCols, setSelectedCols] = React.useState<string[]>([]);

  const availableExtraCols = React.useMemo(() => {
    const DEFAULT_KEYS = new Set([
      'year',
      'population',
      'co2',
      'co2_per_capita',
    ]);
    const extras = new Set<string>();
    const sample = countries.slice(0, 100);
    for (const c of sample) {
      for (const rec of c.years) {
        for (const key of Object.keys(rec)) {
          if (!DEFAULT_KEYS.has(key)) {
            extras.add(key);
          }
        }
      }
    }
    return Array.from(extras).sort();
  }, [countries]);

  return (
    <div className="p-4 space-y-4">
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
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-600 dark:text-gray-400">
          {filtered.length.toLocaleString()} countries
        </div>
        <button
          type="button"
          onClick={() => setColumnsOpen(true)}
          className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-sm"
        >
          Select columns
        </button>
      </div>
      <CountryTable items={filtered} extraColumns={selectedCols} />
      <ColumnsModal
        open={columnsOpen}
        available={availableExtraCols}
        selected={selectedCols}
        onChangeSelected={setSelectedCols}
        onClose={() => setColumnsOpen(false)}
      />
    </div>
  );
};
