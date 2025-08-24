import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ColumnsState {
  required: string[];
  extraSelected: string[];
}

const initialState: ColumnsState = {
  required: ['year', 'population', 'co2', 'co2_per_capita'],
  extraSelected: [],
};

const columnsSlice = createSlice({
  name: 'columns',
  initialState,
  reducers: {
    setExtraSelected(state, action: PayloadAction<string[]>) {
      state.extraSelected = action.payload;
    },
    clearExtraSelected(state) {
      state.extraSelected = [];
    },
  },
});

export const { setExtraSelected, clearExtraSelected } = columnsSlice.actions;
export default columnsSlice.reducer;
