import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import ApiClient from '../api/APIClient';

interface CartState {
  draftDinnerId: number | null;
  totalDishCount: number;
}

interface AddDishResponse {
  draft_dinner_id: number;
  total_dish_count: number;
}

const initialState: CartState = {
  draftDinnerId: null,
  totalDishCount: 0,
};

export const addDishToCartThunk = createAsyncThunk(
  'cart/addDishToCart',
  async (dishId: number, { dispatch }) => {
    try {
      const response = await ApiClient.addDishToDraft(dishId);
      const data: AddDishResponse = (await response.json()) as AddDishResponse;
      if (data.draft_dinner_id) {
        dispatch(setDraftDinner({
          draftDinnerId: data.draft_dinner_id,
          totalDishCount: data.total_dish_count
        }));
        return data.total_dish_count;
      }
    } catch (error) {
      console.error("Ошибка при добавлении блюда в корзину:", error);
      throw error;
    }
  }
);

export const removeDishFromCartThunk = createAsyncThunk(
  'cart/removeDishFromCart',
  async (dishId: number, { dispatch, getState }) => {
    const state = getState() as { cart: CartState };
    if (state.cart.draftDinnerId) {
      try {
        await ApiClient.deleteDishFromDraft(dishId, state.cart.draftDinnerId);
        const newTotalDishCount = state.cart.totalDishCount - 1;
        dispatch(setDraftDinner({
          draftDinnerId: state.cart.draftDinnerId,
          totalDishCount: newTotalDishCount,
        }));

        return newTotalDishCount;
      } catch (error) {
        console.error("Ошибка при удалении блюда из корзины:", error);
        throw error;
      }
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
      .addCase(addDishToCartThunk.fulfilled, (state, action: any) => {
        state.totalDishCount = action.payload;
      })
      .addCase(removeDishFromCartThunk.fulfilled, (state, action: any) => {
        state.totalDishCount = action.payload;
      });
  },
});

export const { setDraftDinner, setTotalDishCount, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
