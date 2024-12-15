import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import filterReducer from './filterSlice';
import userReducer from './userSlice';
import cartReducer from './cartSlice';
import dinnerReducer from './dinnerSlice';
import dishesReducer from './dishesSlice';

const store = configureStore({
  reducer: {
    filter: filterReducer,
    user: userReducer,
    cart: cartReducer,
    dinners: dinnerReducer,
    dishes: dishesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export default store;
