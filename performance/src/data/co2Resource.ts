import { CO2_DATA_URL } from './constants';
import { parseCo2 } from './parseCo2';
import type { CountryData } from './types';

type Status = 'pending' | 'success' | 'error';
interface Resource<T> {
  read(): T;
}

function createResource<T>(promise: Promise<T>): Resource<T> {
  let status: Status = 'pending';
  let value: T | undefined;
  let error: unknown;

  const suspender = promise.then(
    (result) => {
      status = 'success';
      value = result;
    },
    (err: unknown) => {
      status = 'error';
      error = err;
    }
  );

  return {
    read(): T {
      if (status === 'pending') {
        throw suspender;
      }
      if (status === 'error') {
        throw error;
      }
      if (status === 'success' && value !== undefined) {
        return value;
      }
      throw new Error('Resource read before resolution');
    },
  };
}

async function loadCo2(): Promise<CountryData[]> {
  try {
    const resp = await fetch(CO2_DATA_URL);
    const json: unknown = await resp.json();
    return parseCo2(json);
  } catch (err) {
    console.error('Failed to load CO2 dataset', err);
    return [];
  }
}

export const co2Resource = createResource(loadCo2());
