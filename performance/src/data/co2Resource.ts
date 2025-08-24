import { CO2_DATA_URL } from './constants';
import { parseCo2 } from './parseCo2';
import Co2Worker from './co2Worker?worker&inline';
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

const DB_NAME = 'co2-cache';
const STORE = 'datasets';
const KEY = 'v1';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB not available'));
      return;
    }
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = (): void => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
    req.onsuccess = (): void => resolve(req.result);
    req.onerror = (): void => reject(req.error ?? new Error('IDB open failed'));
  });
}

function idbGet(db: IDBDatabase, key: IDBValidKey): Promise<unknown | null> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const store = tx.objectStore(STORE);
    const getReq = store.get(key);
    getReq.onsuccess = (): void => {
      resolve(getReq.result ?? null);
    };
    getReq.onerror = (): void =>
      reject(getReq.error ?? new Error('IDB get failed'));
  });
}

function idbSet(
  db: IDBDatabase,
  key: IDBValidKey,
  value: unknown
): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    const putReq = store.put(value, key);
    putReq.onsuccess = (): void => resolve();
    putReq.onerror = (): void =>
      reject(putReq.error ?? new Error('IDB put failed'));
  });
}

function isCountryDataArray(v: unknown): v is CountryData[] {
  return Array.isArray(v);
}

async function fetchViaWorker(): Promise<CountryData[]> {
  const worker: Worker = new Co2Worker();
  type WorkerMsg = { ok: boolean; data?: CountryData[]; error?: string };
  const data = await new Promise<CountryData[]>((resolve, reject) => {
    const timer = setTimeout(() => {
      worker.terminate();
      reject(new Error('Worker timeout'));
    }, 120000);

    worker.onmessage = (e: MessageEvent<WorkerMsg>): void => {
      clearTimeout(timer);
      const msg = e.data;
      worker.terminate();
      if (msg && msg.ok && Array.isArray(msg.data)) {
        resolve(msg.data);
      } else {
        reject(new Error(msg?.error || 'Worker error'));
      }
    };
    worker.onerror = (err): void => {
      clearTimeout(timer);
      worker.terminate();
      reject(err);
    };
    worker.postMessage({ url: CO2_DATA_URL });
  });
  return data;
}

async function loadCo2(): Promise<CountryData[]> {
  try {
    // Try cache first
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      try {
        const db = await openDb();
        const cachedRaw = await idbGet(db, KEY);
        if (isCountryDataArray(cachedRaw) && cachedRaw.length > 0) {
          // Background refresh via worker, but return cached immediately
          void (async (): Promise<void> => {
            try {
              const fresh = await fetchViaWorker();
              await idbSet(db, KEY, fresh);
            } catch {
              // ignore refresh failures
            }
          })();
          return cachedRaw;
        }
      } catch {
        // ignore IDB failures and continue with network
      }
    }

    // No cache -> use worker if available, else main-thread parse
    if (typeof window !== 'undefined' && 'Worker' in window) {
      try {
        const data = await fetchViaWorker();
        if ('indexedDB' in window) {
          try {
            const db = await openDb();
            await idbSet(db, KEY, data);
          } catch {
            // ignore cache failures
          }
        }
        return data;
      } catch (werr) {
        console.warn(
          'Worker failed, falling back to main-thread parsing',
          werr
        );
      }
    }

    const resp = await fetch(CO2_DATA_URL);
    const json: unknown = await resp.json();
    const parsed = await parseCo2(json);
    return parsed;
  } catch (err) {
    console.error('Failed to load CO2 dataset', err);
    return [];
  }
}

export const co2Resource = createResource(loadCo2());
