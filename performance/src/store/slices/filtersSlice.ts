import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type SortField =
  | 'name'
  | 'population'
  | 'co2'
  | 'co2_per_capita'
  | 'year';
export type SortDir = 'asc' | 'desc';

export interface FiltersState {
  year: number | 'all';
  region: 'all' | string;
  search: string;
  sort: { field: SortField; direction: SortDir };
}

const initialState: FiltersState = {
  year: 'all',
  region: 'all',
  search: '',
  sort: { field: 'name', direction: 'asc' },
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setYear(state, action: PayloadAction<number | 'all'>) {
      state.year = action.payload;
    },
    setRegion(state, action: PayloadAction<'all' | string>) {
      state.region = action.payload;
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setSort(
      state,
      action: PayloadAction<{ field: SortField; direction: SortDir }>
    ) {
      state.sort = action.payload;
    },
  },
});

export const { setYear, setRegion, setSearch, setSort } = filtersSlice.actions;
export default filtersSlice.reducer;
