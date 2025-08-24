import { useState, type FC } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Search } from './Search';

type ControlledSearchTestWrapperProps = {
  onSearch: (value: string) => void;
  onClear?: () => void;
  initialValue?: string;
};
const ControlledSearchTestWrapper: FC<ControlledSearchTestWrapperProps> = ({
  onSearch,
  onClear = (): void => {},
  initialValue = '',
}) => {
  const [value, setValue] = useState(initialValue);
  return (
    <Search
      value={value}
      onChange={setValue}
      onSearch={onSearch}
      onClear={onClear}
    />
  );
};

const mockOnSearch = vi.fn();
const mockOnChange = vi.fn();
const mockOnClear = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Search Component', () => {
  describe('Rendering Tests', () => {
    it('renders search input and search button', () => {
      render(
        <Search onSearch={mockOnSearch} onChange={mockOnChange} value="" />
      );

      expect(
        screen.getByPlaceholderText(/enter country name/i)
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /search/i })
      ).toBeInTheDocument();
      expect(screen.getByText('Search Country')).toBeInTheDocument();
    });

    it('renders clear button', () => {
      render(
        <Search
          onSearch={mockOnSearch}
          onChange={mockOnChange}
          onClear={mockOnClear}
          value=""
        />
      );

      expect(
        screen.getByRole('button', { name: /clear/i })
      ).toBeInTheDocument();
    });

    it('displays initial query when provided', () => {
      const initialQuery = 'canada';
      render(
        <Search
          onSearch={mockOnSearch}
          onChange={mockOnChange}
          value={initialQuery}
        />
      );

      const input = screen.getByPlaceholderText(/enter country name/i);
      expect(input).toHaveValue(initialQuery);
    });

    it('shows empty input when no initial query is provided', () => {
      render(
        <Search onSearch={mockOnSearch} onChange={mockOnChange} value="" />
      );

      const input = screen.getByPlaceholderText(/enter country name/i);
      expect(input).toHaveValue('');
    });
  });

  describe('User Interaction Tests', () => {
    it('updates input value when user types', async () => {
      const user = userEvent.setup();
      render(<ControlledSearchTestWrapper onSearch={mockOnSearch} />);

      const input = screen.getByPlaceholderText(/enter country name/i);
      await user.type(input, 'germany');

      expect(input).toHaveValue('germany');
    });

    it('triggers search callback with correct parameters on form submit', async () => {
      const user = userEvent.setup();
      render(<ControlledSearchTestWrapper onSearch={mockOnSearch} />);

      const input = screen.getByPlaceholderText(/enter country name/i);
      const searchButton = screen.getByRole('button', { name: /search/i });

      await user.type(input, 'bulgaria');
      await user.click(searchButton);

      expect(mockOnSearch).toHaveBeenCalledWith('bulgaria');
      expect(mockOnSearch).toHaveBeenCalledTimes(1);
    });

    it('triggers search callback when form is submitted via Enter key', async () => {
      const user = userEvent.setup();
      render(<ControlledSearchTestWrapper onSearch={mockOnSearch} />);

      const input = screen.getByPlaceholderText(/enter country name/i);

      await user.type(input, 'switzerland');
      await user.keyboard('{Enter}');

      expect(mockOnSearch).toHaveBeenCalledWith('switzerland');
    });

    it('trims whitespace from search input before calling onSearch', async () => {
      const user = userEvent.setup();
      render(<ControlledSearchTestWrapper onSearch={mockOnSearch} />);

      const input = screen.getByPlaceholderText(/enter country name/i);
      const searchButton = screen.getByRole('button', { name: /search/i });

      await user.type(input, '  germany  ');
      await user.click(searchButton);

      expect(mockOnSearch).toHaveBeenCalledWith('germany');
    });
  });

  describe('Clear Functionality Tests', () => {
    it('clears input and calls onClear when clear button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <ControlledSearchTestWrapper
          onSearch={mockOnSearch}
          onClear={mockOnClear}
        />
      );

      const input = screen.getByPlaceholderText(/enter country name/i);
      const clearButton = screen.getByRole('button', { name: /clear/i });

      await user.type(input, 'japan');
      await user.click(clearButton);

      expect(input).toHaveValue('');
      expect(mockOnClear).toHaveBeenCalledTimes(1);
    });

    it('clears input without calling onClear when onClear prop is not provided', async () => {
      const user = userEvent.setup();
      render(<ControlledSearchTestWrapper onSearch={mockOnSearch} />);

      const input = screen.getByPlaceholderText(/enter country name/i);
      const clearButton = screen.getByRole('button', { name: /clear/i });

      await user.type(input, 'poland');
      await user.click(clearButton);

      expect(input).toHaveValue('');
    });
  });
  // No localStorage usage in Search component; value is fully controlled via props.
});
