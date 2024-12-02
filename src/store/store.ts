import { configureStore } from "@reduxjs/toolkit";
import filterReducer from "./filterSlice";
import userReducer from "./userSlice";
import cartReducer from './cartSlice';

const store = configureStore({
  reducer: {
    filter: filterReducer,
    user: userReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;