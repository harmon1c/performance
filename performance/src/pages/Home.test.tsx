import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import { Home } from './Home';

const mockCountries = [
  {
    code: 'USA',
    name: 'United States',
    iso_code: 'USA',
    region: 'Americas',
    years: [
      { year: 2000, population: 282000000, co2: 5, co2_per_capita: 20 },
      { year: 2010, population: 309000000, co2: 4.8, co2_per_capita: 18 },
    ],
    latestYear: 2010,
  },
  {
    code: 'CAN',
    name: 'Canada',
    iso_code: 'CAN',
    region: 'Americas',
    years: [
      { year: 2000, population: 30700000, co2: 0.6, co2_per_capita: 19 },
      { year: 2010, population: 34000000, co2: 0.55, co2_per_capita: 16 },
    ],
    latestYear: 2010,
  },
];

vi.mock('../data/co2Resource', () => ({
  co2Resource: { read: (): typeof mockCountries => mockCountries },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Home Page', () => {
  it('renders header, search, controls and country count', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText('CO2 Data Explorer')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/enter country name/i)
    ).toBeInTheDocument();
    expect(screen.getByText('2 countries')).toBeInTheDocument();
  });

  it('opens and closes the columns modal', async () => {
    const { act } = await import('@testing-library/react');
    renderWithProviders(<Home />);
    const btn = screen.getByRole('button', { name: /select columns/i });
    await act(async () => {
      btn.click();
    });
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(
      await screen.findByText(/select extra columns/i)
    ).toBeInTheDocument();
    const closeBtn = screen.getByRole('button', { name: /close/i });
    await act(async () => {
      closeBtn.click();
    });
  });
});
