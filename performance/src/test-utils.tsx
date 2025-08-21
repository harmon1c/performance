import type React from 'react';
import { render, type RenderResult } from '@testing-library/react';

export function renderWithProviders(ui: React.ReactElement): RenderResult {
  return render(ui);
}
