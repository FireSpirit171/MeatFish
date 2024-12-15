import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import ApiClient from '../api/APIClient';

interface CartState {
  draftDinnerId: number | null;
  totalDishCount: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CartState = {
  draftDinnerId: null,
  totalDishCount: 0,
  status: 'idle',
  error: null,
};

interface AddDishResponse {
  draft_dinner_id: number;
  total_dish_count: number;
}

export const addDishToCartAsync = createAsyncThunk<AddDishResponse, number, { rejectValue: string }>(
  'cart/addDishToCart',
  async (dishId: number, { rejectWithValue }) => {
    try {
      const response = await ApiClient.addDishToDraft(dishId);
      const data: AddDishResponse = (await response.json()) as AddDishResponse;
      return data; 
    } catch (error) {
      return rejectWithValue('Ошибка при добавлении блюда в корзину');
    }
  }
);

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
    resetCart: (state) => {
      state.draftDinnerId = null;
      state.totalDishCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addDishToCartAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addDishToCartAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.draftDinnerId = action.payload.draft_dinner_id;
        state.totalDishCount = action.payload.total_dish_count;
      })
      .addCase(addDishToCartAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { setDraftDinner, setTotalDishCount, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
