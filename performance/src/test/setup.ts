// Mock URL.createObjectURL and URL.revokeObjectURL for download tests
if (!('createObjectURL' in URL)) {
  // @ts-expect-error: JSDOM does not implement createObjectURL, so we mock it for download tests
  URL.createObjectURL = (): string => 'blob:url';
}
if (!('revokeObjectURL' in URL)) {
  // @ts-expect-error: JSDOM does not implement revokeObjectURL, so we mock it for download tests
  URL.revokeObjectURL = (): void => {};
}
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: (): void => {},
    removeEventListener: (): void => {},
    addListener: (): void => {},
    removeListener: (): void => {},
    dispatchEvent: (): boolean => false,
  }),
});
import { vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => ({}),
});

class MockWorker {
  public onmessage: ((ev: MessageEvent) => void) | null = null;
  public onerror: ((ev: ErrorEvent) => void) | null = null;
  public onmessageerror: ((ev: MessageEvent) => void) | null = null;
  public addEventListener(): void {}
  public removeEventListener(): void {}
  public dispatchEvent(): boolean {
    return false;
  }
  public postMessage(): void {}
  public terminate(): void {}
}
globalThis.Worker = MockWorker;

beforeEach(() => {
  vi.clearAllMocks();
});
