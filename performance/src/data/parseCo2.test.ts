import { describe, it, expect } from 'vitest';
import { parseCo2 } from './parseCo2';

describe('parseCo2 region normalization', () => {
  it('maps continent to canonical region buckets', async () => {
    const raw = {
      USA: {
        country: 'United States',
        iso_code: 'USA',
        continent: 'North America',
        data: [{ year: 2000, co2: 1 }],
      },
      FRA: {
        country: 'France',
        iso_code: 'FRA',
        continent: 'Europe',
        data: [{ year: 2000, co2: 1 }],
      },
    } as const;

    const res = await parseCo2(raw);
    const by: Record<string, (typeof res)[number]> = Object.fromEntries(
      res.map((c) => [c.code, c])
    );
    expect(by['USA']?.region).toBe('Americas');
    expect(by['FRA']?.region).toBe('Europe');
  });
});
