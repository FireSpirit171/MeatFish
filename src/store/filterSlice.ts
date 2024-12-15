import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../store/store";
import APIClient from "../api/APIClient";
import { Dish } from "../api/Types";
import { mockDishes } from "../mockdata";

interface FilterState {
  minRange: number;
  maxRange: number;
  dishes: Dish[];
  loading: boolean;
  error: string | null;
}

const initialState: FilterState = {
  minRange: 1,
  maxRange: 5000,
  dishes: [],
  loading: false,
  error: null,
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
    setDishes(state, action: PayloadAction<Dish[]>) {
      state.dishes = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const fetchDishes = (minPrice?: number, maxPrice?: number): AppThunk => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    let url = "";
    if (minPrice !== undefined && maxPrice !== undefined) {
      url = `?min_price=${minPrice}&max_price=${maxPrice}`;
    }

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Таймаут запроса")), 2000)
    );

    const response = await Promise.race([APIClient.getDishes(url), timeout]);
    const data: any = await response.json();
    
    dispatch(setDishes(data.dishes));
    dispatch(setLoading(false));
  } catch (err: any) {
    if (err.message === "Таймаут запроса") {
      const filteredMockDishes = mockDishes.dishes.filter((dish) => {
        const withinMinPrice = minPrice !== undefined ? dish.price >= minPrice : true;
        const withinMaxPrice = maxPrice !== undefined ? dish.price <= maxPrice : true;
        return withinMinPrice && withinMaxPrice;
      });
      dispatch(setDishes(filteredMockDishes));
    }
    dispatch(setError(err.message || "Ошибка загрузки данных"));
    dispatch(setLoading(false));
  }
};

export const { setPriceRange, resetFilters, setDishes, setLoading, setError } = filterSlice.actions;
export default filterSlice.reducer;
