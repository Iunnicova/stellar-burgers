import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  getFeedsApi,
  getOrdersApi,
  getOrderByNumberApi,
  orderBurgerApi
} from '@api';
import { TOrder } from '@utils-types';

type TOrdersSliceState = {
  orders: TOrder[];
  order: TOrder | null;
  totalOrders: number;
  totalOrdersToday: number;
  error: string | null | undefined;
  isLoaded: boolean;
};

const initialState: TOrdersSliceState = {
  orders: [],
  order: null,
  totalOrders: 0,
  totalOrdersToday: 0,
  error: null,
  isLoaded: false
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState: initialState,
  reducers: {},
  selectors: {
    selectOrders: (state) => state.orders,
    selectOrder: (state) => state.order,
    selectTotalOrders: (state) => state.totalOrders,
    selectTotalOrdersToday: (state) => state.totalOrders,
    selectOrdersError: (state) => state.error,
    selectIsOrdersLoaded: (state) => state.isLoaded
  },
  extraReducers(builder) {
    builder
      .addCase(getAllOrdersData.pending, (state) => {
        state.error = null;
        state.isLoaded = true;
      })
      .addCase(getAllOrdersData.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.totalOrders = action.payload.total;
        state.totalOrdersToday = action.payload.totalToday;
        state.isLoaded = false;
      })
      .addCase(getAllOrdersData.rejected, (state, action) => {
        state.error = action.error.message || 'Произошла ошибка';
        state.isLoaded = false;
      })

      .addCase(getUserOrders.pending, (state) => {
        state.error = null;
        state.isLoaded = true;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isLoaded = false;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.error = action.error.message || 'Произошла ошибка';
        state.isLoaded = false;
      })

      .addCase(getOrder.pending, (state) => {
        state.error = null;
        state.isLoaded = true;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.order = action.payload.orders[0];
        state.isLoaded = false;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.error = action.error.message || 'Произошла ошибка';
        state.isLoaded = false;
      })

      .addCase(createNewOrder.pending, (state) => {
        state.error = null;
        state.isLoaded = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.order = action.payload.order;
        state.isLoaded = false;
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.error = action.error.message || 'Произошла ошибка';
        state.isLoaded = false;
      });
  }
});

export const getAllOrdersData = createAsyncThunk(
  'orders/getAllOrdersData',
  async (_, { rejectWithValue }) => {
    const response = await getFeedsApi();
    if (!response.success) {
      return rejectWithValue(response);
    }
    return response;
  }
);

export const getUserOrders = createAsyncThunk(
  'orders/getUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getOrdersApi();
      return response;
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message || 'Произошла неизвестная ошибка');
      }
    }
  }
);

export const getOrder = createAsyncThunk(
  'orders/getOrder',
  async (number: number, { rejectWithValue }) => {
    const response = await getOrderByNumberApi(number);
    if (!response.success) {
      return rejectWithValue(response);
    }
    return response;
  }
);

export const createNewOrder = createAsyncThunk(
  'orders/createNewOrder',
  async (ingredients: string[], { rejectWithValue }) => {
    const response = await orderBurgerApi(ingredients);
    if (!response.success) {
      return rejectWithValue(response);
    }
    return response;
  }
);

export const {
  selectOrders,
  selectOrder,
  selectTotalOrders,
  selectTotalOrdersToday,
  selectOrdersError,
  selectIsOrdersLoaded
} = ordersSlice.selectors;

export const ordersSliceReducer = ordersSlice.reducer;
