import React from 'react';
import { labelFromKey } from '../utils/labels';
import type { YearRecordRaw } from '../data/types';

export interface YearlyTableProps {
  years: YearRecordRaw[];
  extraColumns: string[];
  height?: number;
  rowHeight?: number;
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

export const YearlyTable = React.memo(function YearlyTable(
  props: YearlyTableProps
): React.JSX.Element {
  const { years, extraColumns, height = 300, rowHeight = 28 } = props;

  const sorted = React.useMemo(() => {
    const copy = years.slice();
    copy.sort((a, b) => {
      const ay = typeof a.year === 'number' ? a.year : -Infinity;
      const by = typeof b.year === 'number' ? b.year : -Infinity;
      return ay - by;
    });
    return copy;
  }, [years]);

  const colCount = 4 + extraColumns.length;

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = React.useState(0);
  const onScroll = React.useCallback((): void => {
    const el = containerRef.current;
    if (!el) {
      return;
    }
    setScrollTop(el.scrollTop);
  }, []);

  const { start, end, topPad, bottomPad } = React.useMemo(() => {
    const total = sorted.length;
    const viewport = Math.max(1, Math.floor(height / rowHeight));
    const buffer = 5;
    const s = Math.max(0, Math.floor(scrollTop / rowHeight) - buffer);
    const e = Math.min(total, s + viewport + buffer * 2);
    return {
      start: s,
      end: e,
      topPad: s * rowHeight,
      bottomPad: Math.max(0, (total - e) * rowHeight),
    };
  }, [sorted.length, height, rowHeight, scrollTop]);

  const visible = React.useMemo(
    () => sorted.slice(start, end),
    [sorted, start, end]
  );

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      className="overflow-x-auto overflow-y-auto"
      style={{ maxHeight: height }}
    >
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
          {topPad > 0 ? (
            <tr>
              <td
                className="p-0"
                colSpan={colCount}
                style={{ height: topPad }}
              />
            </tr>
          ) : null}
          {visible.map((rec, idx) => (
            <tr
              key={start + idx}
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
          {bottomPad > 0 ? (
            <tr>
              <td
                className="p-0"
                colSpan={colCount}
                style={{ height: bottomPad }}
              />
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
});
