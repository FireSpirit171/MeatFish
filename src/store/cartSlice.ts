import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartState {
  draftDinnerId: number | null;
  totalDishCount: number;
}

const initialState: CartState = {
  draftDinnerId: null, 
  totalDishCount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setDraftDinner: (state, action: PayloadAction<{ draftDinnerId: number, totalDishCount: number }>) => {
      state.draftDinnerId = action.payload.draftDinnerId;
      state.totalDishCount = action.payload.totalDishCount;
    },
    setTotalDishCount: (state, action: PayloadAction<number>) => {
      state.totalDishCount = action.payload;
    },
    addDishToCart: (state) => {
      if (state.draftDinnerId !== null) {
        state.totalDishCount += 1;
      }
    },
    resetCart: (state) => {
      state.draftDinnerId = null;
      state.totalDishCount = 0;
    },
  },
});


export const { setDraftDinner, addDishToCart, resetCart, setTotalDishCount } = cartSlice.actions;
export default cartSlice.reducer;