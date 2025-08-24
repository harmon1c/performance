import type React from 'react';
import { render, type RenderResult } from '@testing-library/react';
import { Suspense } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider } from './context/ThemeContext';

export function renderWithProviders(ui: React.ReactElement): RenderResult {
  return render(
    <Provider store={store}>
      <ThemeProvider>
        <Suspense fallback={<div data-testid="suspense-fallback" />}>
          {ui}
        </Suspense>
      </ThemeProvider>
    </Provider>
  );
}
