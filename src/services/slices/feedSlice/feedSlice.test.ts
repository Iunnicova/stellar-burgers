import { describe, expect, test } from '@jest/globals';
import { feedSliceReducer, getAllOrdersData } from './feedSlice';
import { initialState } from './feedSlice';
import { API_ERROR } from '../../../utils/constants';

describe('feedSlice', () => {
  test('должен возвращать initial state', () => {
    expect(feedSliceReducer(undefined, { type: 'UNKNOWN' })).toEqual(
      initialState
    );
  });

  test('должен обрабатывать pending состояние', () => {
    const nextState = feedSliceReducer(initialState, {
      type: getAllOrdersData.pending.type
    });
    expect(nextState.isFeedLoaded).toBe(true);
    expect(nextState.error).toBeNull();
  });

  // test('должен обрабатывать fulfilled состояние', () => {
  //   const payload = {
  //     orders: [],
  //     total: 0,
  //     totalToday: 0
  //   };
  //   const action = {
  //     type: getAllOrdersData.fulfilled.type,
  //     payload
  //   };
  //   const nextState = feedSliceReducer(initialState, action);
  //   expect(nextState.orders).toEqual(action.payload.orders);
  //   expect(nextState.totalOrders).toEqual(action.payload.total);
  //   expect(nextState.totalOrdersToday).toEqual(action.payload.totalToday);
  //   expect(nextState.isFeedLoaded).toBe(false);
  // });
  test('должен обрабатывать fulfilled состояние', () => {
    const payload = {
      orders: [
        {
          _id: '1',
          ingredients: [],
          name: 'Order 1',
          number: 1,
          status: 'done',
          createdAt: '',
          updatedAt: ''
        }
      ],
      total: 100,
      totalToday: 10
    };
    const action = {
      type: getAllOrdersData.fulfilled.type,
      payload
    };
    const nextState = feedSliceReducer(initialState, action);

    // Проверяем, что заказы, общее количество и количество за сегодня обновляются
    expect(nextState.orders).toEqual(payload.orders);
    expect(nextState.totalOrders).toEqual(payload.total);
    expect(nextState.totalOrdersToday).toEqual(payload.totalToday);
    expect(nextState.isFeedLoaded).toBe(true);
    expect(nextState.error).toBe('');
  });

  test('должен обрабатывать rejected состояние', () => {
    const errorMessage = 'Запрос не выполнен';
    const nextState = feedSliceReducer(initialState, {
      type: getAllOrdersData.rejected.type,
      error: { message: errorMessage }
    });
    expect(nextState.isFeedLoaded).toBe(false);
    expect(nextState.error).toBe(errorMessage);
  });

  it('должен обрабатывать rejected состояние с API_ERROR', () => {
    const nextState = feedSliceReducer(initialState, {
      type: getAllOrdersData.rejected.type,
      error: { message: undefined }
    });
    expect(nextState.isFeedLoaded).toBe(false);
    expect(nextState.error).toBe(API_ERROR);
  });
});
