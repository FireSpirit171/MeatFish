import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import ApiClient from '../api/APIClient';
import { Dinner } from '@/api/Types';
import { AppThunk } from './store';

interface DinnerState {
  dinners: Dinner[];
  dateFrom: string;
  dateTo: string;
  status: string;
  loading: boolean;
  error: string | null;
}

const initialState: DinnerState = {
  dinners: [],
  dateFrom: '',
  dateTo: '',
  status: '',
  loading: false,
  error: null,
};

const dinnerSlice = createSlice({
  name: 'dinners',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<{ dateFrom: string; dateTo: string; status: string }>) => {
      state.dateFrom = action.payload.dateFrom;
      state.dateTo = action.payload.dateTo;
      state.status = action.payload.status;
    },
    fetchDinnersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDinnersSuccess: (state, action: PayloadAction<Dinner[]>) => {
      state.dinners = action.payload;
      state.loading = false;
    },
    fetchDinnersFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setFilters, fetchDinnersStart, fetchDinnersSuccess, fetchDinnersFailure } = dinnerSlice.actions;

// Асинхронный экшен для загрузки заказов
export const fetchDinners = (): AppThunk => async (dispatch, getState) => {
  const { dateFrom, dateTo, status } = getState().dinners;

  dispatch(fetchDinnersStart());

  try {
    const response = await ApiClient.getDinners({ date_from: dateFrom, date_to: dateTo, status });
    const data = (await response.json()) as Dinner[];
    dispatch(fetchDinnersSuccess(data));
  } catch (error) {
    dispatch(fetchDinnersFailure('Ошибка при загрузке заказов'));
  }
};

export default dinnerSlice.reducer;
