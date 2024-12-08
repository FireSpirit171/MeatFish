import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  minRange: number;
  maxRange: number;
}

const initialState: FilterState = {
  minRange: 1,
  maxRange: 5000,
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setPriceRange(state, action: PayloadAction<{ min: number; max: number }>) {
      state.minRange = action.payload.min;
      state.maxRange = action.payload.max;
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const { setPriceRange, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;
