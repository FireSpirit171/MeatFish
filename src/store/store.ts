import { configureStore } from "@reduxjs/toolkit";
import filterReducer from "./filterSlice";
import userReducer from "./userSlice";

const store = configureStore({
  reducer: {
    filter: filterReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;