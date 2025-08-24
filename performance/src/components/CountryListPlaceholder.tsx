import React from 'react';
import { co2Resource } from '../data/co2Resource';

export const CountryListPlaceholder: React.FC = () => {
  const data = co2Resource.read();
  return (
    <div className="grid gap-y-2">
      <h2 className="text-xl font-semibold">CO2 Data Explorer (Scaffold)</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        Initial commit structure ready. Further implementation (filters,
        sorting, dynamic columns) will follow.
      </p>
      <p className="text-sm">
        Loaded countries: <span className="font-mono">{data.length}</span>
      </p>
    </div>
  );
};
