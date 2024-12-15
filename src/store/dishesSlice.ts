import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import APIClient from '../api/APIClient';
import { Dish } from '../api/Types';

interface DishesState {
  dishes: Dish[];
  loading: boolean;
  error: string | null;
}

const initialState: DishesState = {
  dishes: [],
  loading: false,
  error: null,
};

export const fetchDishes = createAsyncThunk(
  'dishes/fetchDishes',
  async (url: string) => {
    const response = await APIClient.getDishes(url);
    return response.json();
  }
);

const dishesSlice = createSlice({
  name: 'dishes',
  initialState,
  reducers: {
    setDishes: (state, action: PayloadAction<Dish[]>) => {
      state.dishes = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDishes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDishes.fulfilled, (state, action: any) => {
        state.loading = false;
        state.dishes = action.payload.dishes;
      })
      .addCase(fetchDishes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Неизвестная ошибка';
      });
  },
});

export const { setDishes } = dishesSlice.actions;

export default dishesSlice.reducer;
