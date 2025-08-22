import React from 'react';
import { labelFromKey } from '../utils/labels';
import type { YearRecordRaw } from '../data/types';

export interface YearlyTableProps {
  years: YearRecordRaw[];
  extraColumns: string[];
}

function formatVal(v: unknown): string {
  if (v == null) {
    return 'N/A';
  }
  if (typeof v === 'number') {
    return Number.isFinite(v) ? String(v) : 'N/A';
  }
  if (typeof v === 'string') {
    return v;
  }
  return 'N/A';
}

export function YearlyTable(props: YearlyTableProps): React.JSX.Element {
  const { years, extraColumns } = props;

  const sorted = React.useMemo(() => {
    const copy = years.slice();
    copy.sort((a, b) => {
      const ay = typeof a.year === 'number' ? a.year : -Infinity;
      const by = typeof b.year === 'number' ? b.year : -Infinity;
      return ay - by;
    });
    return copy;
  }, [years]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-xs">
        <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
          <tr>
            <th className="text-left px-2 py-1">Year</th>
            <th className="text-left px-2 py-1">Population</th>
            <th className="text-left px-2 py-1">CO2</th>
            <th className="text-left px-2 py-1">CO2 / Capita</th>
            {extraColumns.map((col) => (
              <th key={col} className="text-left px-2 py-1">
                {labelFromKey(col)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((rec, idx) => (
            <tr
              key={idx}
              className="border-b border-gray-200 dark:border-gray-700"
            >
              <td className="px-2 py-1">{formatVal(rec.year)}</td>
              <td className="px-2 py-1">{formatVal(rec.population)}</td>
              <td className="px-2 py-1">{formatVal(rec.co2)}</td>
              <td className="px-2 py-1">{formatVal(rec.co2_per_capita)}</td>
              {extraColumns.map((col) => (
                <td key={col} className="px-2 py-1">
                  {formatVal(rec[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
