import React from 'react';
import { screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithProviders } from './test-utils';
import App from './App';

vi.mock('./components/ErrorBoundary', () => ({
  ErrorBoundary: ({
    children,
  }: {
    children: React.ReactNode;
  }): React.JSX.Element => <div data-testid="error-boundary">{children}</div>,
}));

vi.mock('./pages/Home', () => ({
  Home: (): React.JSX.Element => <div data-testid="home">Home Component</div>,
}));

vi.mock('./components/PokemonDetailPanel', () => ({
  default: (): React.JSX.Element => (
    <div data-testid="pokemon-detail">Pokemon Detail Panel</div>
  ),
}));
vi.mock('./pages/NotFound', () => ({
  NotFound: (): React.JSX.Element => (
    <div data-testid="not-found">Not Found Component</div>
  ),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('App Component', () => {
  it('renders without crashing', () => {
    renderWithProviders(<App />);
    expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
  });

  it('renders main container', () => {
    const { container } = renderWithProviders(<App />);
    expect(container.querySelector('.site-container')).toBeInTheDocument();
  });

  it('renders main structure with header and footer', () => {
    const { container } = renderWithProviders(<App />);
    expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    expect(container.querySelector('header.header')).toBeInTheDocument();
    expect(container.querySelector('footer.footer')).toBeInTheDocument();
  });

  it('has proper CSS classes for background styling', () => {
    const { container } = renderWithProviders(<App />);
    const mainDiv = container.querySelector('.site-container.min-h-screen');
    expect(mainDiv).toBeInTheDocument();
    expect(mainDiv).toHaveClass('flex', 'flex-col', 'overflow-x-hidden');
  });
});
