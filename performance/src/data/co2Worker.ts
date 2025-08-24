/// <reference lib="webworker" />
import { parseCo2 } from './parseCo2';

interface LoadMessage {
  url: string;
}

interface ResultMessage {
  ok: true;
  data: unknown;
}

interface ErrorMessage {
  ok: false;
  error: string;
}

declare const self: DedicatedWorkerGlobalScope;

self.onmessage = async (e: MessageEvent<LoadMessage>): Promise<void> => {
  const { url } = e.data || { url: '' };
  try {
    if (!url) {
      throw new Error('Missing URL');
    }
    const resp = await fetch(url);
    const raw: unknown = await resp.json();
    const data = await parseCo2(raw);
    const msg: ResultMessage = { ok: true, data };
    self.postMessage(msg);
  } catch (err) {
    const msg: ErrorMessage = {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : typeof err === 'string'
            ? err
            : 'Unknown error',
    };
    self.postMessage(msg);
  }
};
