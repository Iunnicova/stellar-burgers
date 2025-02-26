import { configureStore } from '@reduxjs/toolkit';
import {
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import {
  userSliceReducer,
  ingredientsSliceReducer,
  burgerSliceReducer
} from '@slices';

const store = configureStore({
  reducer: {
    user: userSliceReducer,
    ingredients: ingredientsSliceReducer,
    burger: burgerSliceReducer
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch = dispatchHook.withTypes<AppDispatch>();
export const useSelector = selectorHook.withTypes<RootState>();

export default store;
