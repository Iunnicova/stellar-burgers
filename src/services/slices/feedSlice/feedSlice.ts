import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import React from 'react';
import { render } from '@testing-library/react';
import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';
import { API_ERROR } from '../../../utils/constants';

export type TFeedSliceState = {
  orders: TOrder[];
  totalOrders: number;
  totalOrdersToday: number;
  error: string | null | undefined;
  isFeedLoaded: boolean;
};

export const initialState: TFeedSliceState = {
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
        state.error = action.error.message || API_ERROR;
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

export const selectAllOrders = (state: { feed: TFeedSliceState }) =>
  state.feed.orders;
export const selectTotalOrders = (state: { feed: TFeedSliceState }) =>
  state.feed.totalOrders;
export const selectTotalOrdersToday = (state: { feed: TFeedSliceState }) =>
  state.feed.totalOrdersToday;
export const selectFeedError = (state: { feed: TFeedSliceState }) =>
  state.feed.error;
export const selectIsFeedLoaded = (state: { feed: TFeedSliceState }) =>
  state.feed.isFeedLoaded;

export const feedSliceReducer = feedSlice.reducer;
