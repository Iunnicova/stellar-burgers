import { configureStore } from '@reduxjs/toolkit';
import {
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import {
  userSliceReducer,
  ingredientsSliceReducer,
  burgerSliceReducer,
  ordersSliceReducer,
  feedSliceReducer
} from '@slices';

const store = configureStore({
  reducer: {
    user: userSliceReducer,
    ingredients: ingredientsSliceReducer,
    burger: burgerSliceReducer,
    orders: ordersSliceReducer,
    feed: feedSliceReducer
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
//устарели
// export const useDispatch = dispatchHook.withTypes<AppDispatch>();
// export const useSelector = selectorHook.withTypes<RootState>();

export const useDispatch: () => AppDispatch = dispatchHook;
export const useSelector: <TSelected = unknown>(
  selector: (state: RootState) => TSelected,
  equalityFn?: (left: TSelected, right: TSelected) => boolean
) => TSelected = selectorHook;

export default store;
