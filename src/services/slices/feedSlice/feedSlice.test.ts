import { configureStore } from '@reduxjs/toolkit';
import {
  feedSliceReducer,
  getAllOrdersData,
  initialState,
  selectAllOrders,
  selectFeedError,
  selectIsFeedLoaded,
  selectTotalOrders,
  selectTotalOrdersToday
} from './feedSlice';
import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';

jest.mock('@api', () => ({
  getFeedsApi: jest.fn()
}));

describe('feedSlice', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        feed: feedSliceReducer
      }
    });
  });

  test('should have correct initial state', () => {
    const state = store.getState().feed;
    expect(state).toEqual(initialState);
  });

  test('should handle getAllOrdersData.pending', async () => {
    const initialStateBeforeDispatch = store.getState().feed;

    const dispatchResult = store.dispatch(getAllOrdersData());

    await dispatchResult;

    const state = store.getState().feed;

    expect(initialStateBeforeDispatch.error).toBe(null);
    expect(state.isFeedLoaded).toBe(false);
  });

  // test('should handle getAllOrdersData.fulfilled', async () => {
  //   const mockOrders: TOrder[] = [
  //     {
  //       _id: '1',
  //       ingredients: [],
  //       name: 'Order 1',
  //       status: 'done',
  //       createdAt: '',
  //       updatedAt: '',
  //       number: 123
  //     },
  //     {
  //       _id: '2',
  //       ingredients: [],
  //       name: 'Order 2',
  //       status: 'pending',
  //       createdAt: '',
  //       updatedAt: '',
  //       number: 456
  //     }
  //   ];
  //   const mockTotal = 100;
  //   const mockTotalToday = 10;

  //   (getFeedsApi as jest.Mock).mockResolvedValue({
  //     success: true,
  //     orders: mockOrders,
  //     total: mockTotal,
  //     totalToday: mockTotalToday
  //   });

  //   await store.dispatch(getAllOrdersData());

  //   const state = store.getState().feed;
  //   expect(state.orders).toEqual(mockOrders);
  //   expect(state.totalOrders).toBe(mockTotal);
  //   expect(state.totalOrdersToday).toBe(mockTotalToday);
  //   expect(state.isFeedLoaded).toBe(true);
  //   expect(state.error).toBeNull();
  // });

  test('should handle getAllOrdersData.rejected', async () => {
    const mockError = { success: false, message: 'API Error' };
    (getFeedsApi as jest.Mock).mockRejectedValue(mockError);

    await store.dispatch(getAllOrdersData());

    const state = store.getState().feed;
    expect(state.error).toBe('API Error');
    expect(state.isFeedLoaded).toBe(false);
  });

  test('should select total orders correctly', () => {
    const mockState = { feed: { ...initialState, totalOrders: 100 } };
    expect(selectTotalOrders(mockState as any)).toBe(100);
  });

  test('should select total orders today correctly', () => {
    const mockState = { feed: { ...initialState, totalOrdersToday: 10 } };
    expect(selectTotalOrdersToday(mockState as any)).toBe(10);
  });

  test('should select feed error correctly', () => {
    const mockState = { feed: { ...initialState, error: 'Test Error' } };
    expect(selectFeedError(mockState as any)).toBe('Test Error');
  });

  test('should select isFeedLoaded correctly', () => {
    const mockState = { feed: { ...initialState, isFeedLoaded: true } };
    expect(selectIsFeedLoaded(mockState as any)).toBe(true);
  });
});
