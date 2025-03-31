import {
  createAsyncThunk,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';

import {
  getOrdersApi,
  getOrderByNumberApi,
  orderBurgerApi,
  TOrderResponse,
  TNewOrderResponse
} from '@api';
import { TOrder } from '@utils-types';
import { API_ERROR } from '../../../utils/constants';
import { RootState } from '@store';

export interface RejectedValue {
  message: string;
}

export type TOrdersSliceState = {
  orders: TOrder[];
  order: TOrder | null;
  error: string | null | undefined;
  isLoaded: boolean;
};

export const initialState: TOrdersSliceState = {
  orders: [],
  order: null,
  error: null,
  isLoaded: false
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState: initialState,
  reducers: {
    clearOrderState: (state) => {
      state.order = null;
    }
  },

  extraReducers(builder) {
    builder

      .addCase(getUserOrders.pending, (state) => {
        state.error = null;
        state.isLoaded = true;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isLoaded = false;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.error = action.error.message || API_ERROR;
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
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : (action.error.message ?? API_ERROR);
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
        state.isLoaded = false;
        state.error = action.payload || 'Ошибка создания заказа';
      });
  }
});

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

export const getOrder = createAsyncThunk<
  TOrderResponse,
  number,
  { rejectValue: string }
>('orders/getOrder', async (number, { rejectWithValue }) => {
  try {
    const response = await getOrderByNumberApi(number);

    if (
      !response ||
      typeof response !== 'object' ||
      !('success' in response) ||
      !response.success
    ) {
      return rejectWithValue('Ошибка сервера');
    }

    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Произошла неизвестная ошибка');
  }
});

export const createNewOrder = createAsyncThunk<
  TNewOrderResponse,
  string[],
  { rejectValue: string }
>('orders/createNewOrder', async (ingredients, { rejectWithValue }) => {
  try {
    const response = await orderBurgerApi(ingredients);

    if (!response.success) {
      return rejectWithValue('Ошибка создания заказа');
    }

    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Произошла неизвестная ошибка');
  }
});

export const { clearOrderState } = ordersSlice.actions;

const selectOrdersSlice = (state: RootState) => state.orders;

export const selectOrders = createSelector(
  [selectOrdersSlice],
  (slice) => slice.orders
);
export const selectOrder = createSelector(
  [selectOrdersSlice],
  (slice) => slice.order
);
export const selectOrdersError = createSelector(
  [selectOrdersSlice],
  (slice) => slice.error
);
export const selectIsOrdersLoaded = createSelector(
  [selectOrdersSlice],
  (slice) => slice.isLoaded
);

const selectFeedSlice = (state: RootState) => state.feed;
export const ordersSliceReducer = ordersSlice.reducer;
