import { configureStore } from '@reduxjs/toolkit';
import {
  feedSliceReducer,
  getAllOrdersData,
  initialState,
  selectAllOrders,
  selectFeedError,
  selectIsFeedLoaded,
  selectTotalOrders,
  selectTotalOrdersToday,
  TFeedSliceState
} from './feedSlice';
import { getFeedsApi } from '@api';
import thunk from 'redux-thunk';
import * as api from '@api';

jest.mock('@api', () => ({
  getFeedsApi: jest.fn()
}));

jest.mock('@/src/utils/burger-api');
const mockedGetFeedsApi = api.getFeedsApi as jest.MockedFunction<
  typeof api.getFeedsApi
>;

describe('feedSlice', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        feed: feedSliceReducer
      }
    });
  });

  test('должно иметь правильное начальное состояние', () => {
    const state = store.getState().feed;
    expect(state).toEqual(initialState);
  });

  test('следует установить значение ошибки в action.error.message, когда getAllOrdersData отклоняется', async () => {
    const errorMessage = 'Failed to fetch orders';
    const mockErrorResponse = {
      success: false,
      orders: [],
      total: 0,
      totalToday: 0,
      message: errorMessage
    };
    mockedGetFeedsApi.mockRejectedValue(mockErrorResponse);

    await store.dispatch(getAllOrdersData());

    const state = store.getState().feed as TFeedSliceState;

    expect(state.error).toBe(errorMessage);
    expect(state.isFeedLoaded).toBe(false);
  });

  test('следует правильно выбрать общее количество заказов', () => {
    const mockState = { feed: { ...initialState, totalOrders: 100 } };
    expect(selectTotalOrders(mockState as any)).toBe(100);
  });

  test('следует ли правильно выбрать общее количество заказов на сегодняшний день', () => {
    const mockState = { feed: { ...initialState, totalOrdersToday: 10 } };
    expect(selectTotalOrdersToday(mockState as any)).toBe(10);
  });

  test('следует ли правильно выбрать ошибку подачи', () => {
    const mockState = { feed: { ...initialState, error: 'Test Error' } };
    expect(selectFeedError(mockState as any)).toBe('Test Error');
  });

  test('следует выбрать, правильно ли загружен канал', () => {
    const mockState = { feed: { ...initialState, isFeedLoaded: true } };
    expect(selectIsFeedLoaded(mockState as any)).toBe(true);
  });

  test('должен вернуть список заказов из стейта', () => {
    const mockOrders = [
      {
        _id: '1',
        status: 'done',
        name: 'Burger 1',
        createdAt: '2025-03-30T12:00:00Z'
      },
      {
        _id: '2',
        status: 'pending',
        name: 'Burger 2',
        createdAt: '2025-03-30T12:05:00Z'
      }
    ];

    const mockState = {
      feed: {
        orders: mockOrders,
        totalOrders: 100,
        totalOrdersToday: 10,
        error: null,
        isFeedLoaded: true
      } as TFeedSliceState
    };

    const result = selectAllOrders(mockState);
    expect(result).toEqual(mockOrders);
  });
});
