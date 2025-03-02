import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';

type TFeedSliceState = {
  orders: TOrder[];
  totalOrders: number;
  totalOrdersToday: number;
  error: string | null | undefined;
  isFeedLoaded: boolean;
};

const initialState: TFeedSliceState = {
  orders: [],
  totalOrders: 0,
  totalOrdersToday: 0,
  error: null,
  isFeedLoaded: false
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState: initialState,
  reducers: {},
  selectors: {
    selectAllOrders: (state) => state.orders,
    selectTotalOrders: (state) => state.totalOrders,
    selectTotalOrdersToday: (state) => state.totalOrdersToday,
    selectFeedError: (state) => state.error,
    selectIsFeedLoaded: (state) => state.isFeedLoaded
  },
  extraReducers(builder) {
    builder
      .addCase(getAllOrdersData.pending, (state) => {
        state.error = null;
        state.isFeedLoaded = true;
      })
      .addCase(getAllOrdersData.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.totalOrders = action.payload.total;
        state.totalOrdersToday = action.payload.totalToday;
        state.isFeedLoaded = false;
      })
      .addCase(getAllOrdersData.rejected, (state, action) => {
        state.error = action.error.message || 'Произошла ошибка';
        state.isFeedLoaded = false;
      });
  }
});

export const getAllOrdersData = createAsyncThunk(
  'feed/getAllOrdersData',
  async (_, { rejectWithValue }) => {
    const response = await getFeedsApi();
    if (!response.success) {
      return rejectWithValue(response);
    }
    return response;
  }
);

export const {
  selectAllOrders,
  selectTotalOrders,
  selectTotalOrdersToday,
  selectFeedError,
  selectIsFeedLoaded
} = feedSlice.selectors;

export const feedSliceReducer = feedSlice.reducer;
