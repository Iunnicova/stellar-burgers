import { configureStore, createReducer } from '@reduxjs/toolkit';
import {
  ordersSlice,
  getUserOrders,
  TOrdersSliceState,
  getOrder,
  ordersSliceReducer,
  createNewOrder,
  selectOrder,
  selectOrders,
  clearOrderState,
  selectOrdersError,
  selectIsOrdersLoaded
} from './ordersSlice'; //

import * as api from '@api';
import { TOrder } from '@/src/utils/types';
import { API_ERROR } from '@/src/utils/constants';
import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';
// import { RootState } from '../../store';
import { RootState } from '@store';

const initialState: { order: TOrder | null; isLoaded: boolean } = {
  order: null,
  isLoaded: true
};

const orderReducer = createReducer(initialState, (builder) => {
  builder.addCase(getOrder.fulfilled, (state, action) => {
    state.order = action.payload.orders[0];
    state.isLoaded = false;
  });
});

jest.mock('@api', () => ({
  getOrdersApi: jest.fn(),
  getOrderByNumberApi: jest.fn(),
  orderBurgerApi: jest.fn()
}));

const mockState: RootState = {
  user: {} as any,
  ingredients: {} as any,
  burger: {} as any,
  feed: {} as any,
  orders: {
    orders: [
      {
        _id: '1',
        number: 1,
        name: 'Test Order',
        status: 'pending',
        createdAt: '2024-01-01T12:00:00Z',
        updatedAt: '2024-01-01T12:00:00Z',
        ingredients: ['ingredient1', 'ingredient2'],
        items: []
      }
    ],
    order: {
      _id: '2',
      number: 2,
      name: 'Another Order',
      status: 'completed',
      createdAt: '2024-01-02T12:00:00Z',
      updatedAt: '2024-01-02T12:30:00Z',
      ingredients: ['ingredient3'],
      items: []
    },
    error: 'Test error',
    isLoaded: true
  }
};

describe('ordersSlice', () => {
  let store: any;
  let initialState: TOrdersSliceState;

  beforeEach(() => {
    initialState = {
      orders: [],
      order: null,
      error: null,
      isLoaded: false
    };
  });

  test('должен обрабатывать состояние четкого порядка', () => {
    const mockOrder: TOrder = {
      _id: '1',
      items: ['item1', 'item2'],
      status: '',
      name: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      number: 0,
      ingredients: []
    };
    initialState = {
      ...initialState,
      order: mockOrder
    };

    store = configureStore({
      reducer: {
        orders: ordersSlice.reducer
      },
      preloadedState: { orders: initialState }
    });

    store.dispatch(ordersSlice.actions.clearOrderState());
    const state = store.getState().orders as TOrdersSliceState;
    expect(state.order).toBeNull();
  });

  test('следует установить значение isLoaded равным true и устранить ошибку, когда getUserOrders находится в ожидании', () => {
    const initialStateWithError: TOrdersSliceState = {
      ...initialState,
      error: 'initial error'
    };
    store = configureStore({
      reducer: {
        orders: ordersSlice.reducer
      },
      preloadedState: { orders: initialStateWithError }
    });
    store.dispatch(getUserOrders.pending('requestId'));
    const state = store.getState().orders as TOrdersSliceState;

    expect(state.isLoaded).toBe(true);
    expect(state.error).toBeNull();
  });

  test('должен устанавливать заказы и загружается в значение false при выполнении getUserOrders', async () => {
    const mockOrders: TOrder[] = [
      {
        _id: '1',
        items: ['item1'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: '',
        name: '',
        number: 0,
        ingredients: []
      }
    ];

    store = configureStore({
      reducer: {
        orders: ordersSlice.reducer
      }
    });
    await store.dispatch(getUserOrders.fulfilled(mockOrders, 'requestId'));
    const state = store.getState().orders as TOrdersSliceState;

    expect(state.orders).toEqual(mockOrders);
    expect(state.isLoaded).toBe(false);
  });

  test('должно быть установлено значение error и загружается в значение false при отклонении getUserOrders', async () => {
    store = configureStore({
      reducer: {
        orders: ordersSlice.reducer
      }
    });

    const errorMessage = 'Failed to fetch orders';
    await store.dispatch(
      getUserOrders.rejected(
        {
          message: 'Failed to fetch orders',
          name: ''
        },
        'requestId'
      )
    );

    const state = store.getState().orders as TOrdersSliceState;

    expect(state.isLoaded).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  test('should set error to null and isLoaded to true when getOrder is pending', async () => {
    store = configureStore({
      reducer: {
        orders: ordersSlice.reducer
      }
    });

    store.dispatch(getOrder.pending('requestId', 0));
    const state = store.getState().orders as TOrdersSliceState;

    expect(state.error).toBe(null);
    expect(state.isLoaded).toBe(true);
  });

  test('должен установить заказ и сбросить флаг загрузки при успешном получении заказа', () => {
    const order = { id: 1, name: 'Заказ 1' };
    const action = {
      type: getOrder.fulfilled.type,
      payload: { orders: [{ ...order }] }
    };

    const newState = ordersSliceReducer(initialState, action);
    ordersSliceReducer;

    expect(newState.order).toEqual(order);
    expect(newState.isLoaded).toBe(false);
  });

  test('должен установить ошибку и сбросить флаг загрузки при отклонении запроса заказа', () => {
    const errorMessage = 'Ошибка загрузки заказа';
    const action = {
      type: getOrder.rejected.type,
      error: { message: errorMessage }
    };

    const newState = ordersSliceReducer(initialState, action);

    expect(newState.error).toBe(errorMessage);
    expect(newState.isLoaded).toBe(false);
  });

  test('должен сбросить ошибку и установить флаг загрузки при создании нового заказа', () => {
    const action = { type: createNewOrder.pending.type };

    const newState = ordersSliceReducer(initialState, action);

    expect(newState.error).toBeNull();
    expect(newState.isLoaded).toBe(true);
  });

  test('должен установить заказ и сбросить флаг загрузки при успешном создании заказа', () => {
    const order = { id: 3, name: 'Veggie Burger' };
    const action = {
      type: createNewOrder.fulfilled.type,
      payload: { order }
    };

    const newState = ordersSliceReducer(initialState, action);

    expect(newState.order).toEqual(order);
    expect(newState.isLoaded).toBe(false);
  });

  test('должен установить ошибку и сбросить флаг загрузки при неудачном создании заказа', () => {
    const errorMessage = 'Ошибка создания заказа';
    const action = {
      type: createNewOrder.rejected.type,
      error: { message: errorMessage }
    };

    const newState = ordersSliceReducer(initialState, action);

    expect(newState.error).toBe(errorMessage);
    expect(newState.isLoaded).toBe(false);
  });

  test('должен успешно получить заказы и задиспатчить fulfilled', async () => {
    const mockOrders = [{ id: 1, name: 'Burger' }];
    (getOrdersApi as jest.Mock).mockResolvedValue(mockOrders);

    const result = await store.dispatch(getUserOrders() as any);
    const state = store.getState().orders;

    expect(result.type).toBe(getUserOrders.fulfilled.type);
    expect(state.orders).toEqual(mockOrders);
  });

  test('должен успешно получить заказ и задиспатчить fulfilled', async () => {
    const mockOrder = {
      success: true,
      orders: [{ id: 2, name: 'Cheeseburger' }]
    };
    (getOrderByNumberApi as jest.Mock).mockResolvedValue(mockOrder);

    const result = await store.dispatch(getOrder(2) as any);
    const state = store.getState().orders;

    expect(getOrderByNumberApi).toHaveBeenCalledWith(2);
    expect(state.order).toEqual(mockOrder.orders[0]);
    expect(state.isLoaded).toBe(false);
    expect(result.type).toBe(getOrder.fulfilled.type);
  });

  test('должен обработать ошибку, если API возвращает неверный объект', async () => {
    (getOrderByNumberApi as jest.Mock).mockResolvedValue({});

    const result = await store.dispatch(getOrder(2) as any);
    const state = store.getState().orders;

    expect(state.error).toBe('Ошибка сервера');
    expect(state.isLoaded).toBe(false);
    expect(result.type).toBe(getOrder.rejected.type);
  });

  test('должен создать новый заказ и задиспатчить fulfilled', async () => {
    const mockOrder = {
      success: true,
      order: { id: 1, name: 'Тестовый заказ' }
    };

    (orderBurgerApi as jest.Mock).mockResolvedValue(mockOrder);

    const result = await store.dispatch(
      createNewOrder(['ingredient1', 'ingredient2']) as any
    );
    const state = store.getState().orders;

    expect(state.order).toEqual(mockOrder.order);
    expect(state.isLoaded).toBe(false);
    expect(result.type).toBe(createNewOrder.fulfilled.type);
  });

  test('должен обработать ошибку при создании заказа', async () => {
    const errorMessage = 'Ошибка создания заказа';
    (orderBurgerApi as jest.Mock).mockResolvedValue({ success: false });

    const result = await store.dispatch(createNewOrder(['ingredient1']) as any);
    const state = store.getState().orders;

    expect(state.error).toBe(errorMessage);
    expect(state.isLoaded).toBe(false);
    expect(result.type).toBe(createNewOrder.rejected.type);
  });

  test('должен обрабатывать getOrder.rejected с нестроковой полезной нагрузкой', async () => {
    const action = {
      type: getOrder.rejected.type,
      payload: { error: 'Unknown error' },
      error: { message: undefined }
    };

    const state = ordersSliceReducer(initialState, action);

    expect(state.error).toBe(API_ERROR);
    expect(state.isLoaded).toBe(false);
  });

  test('должно быть установлено значение error в API_ERROR и загружено в значение false, если сообщение об ошибке не отображается', async () => {
    const action = {
      type: getUserOrders.rejected.type,
      error: {}
    };

    store.dispatch(action);

    const state = store.getState().orders;

    expect(state.error).toBe(API_ERROR);
    expect(state.isLoaded).toBe(false);
  });
});

describe('Orders Selectors', () => {
  test('выберите заказы должен возвращать список заказов', () => {
    expect(selectOrders(mockState)).toEqual(mockState.orders.orders);
  });

  test('выбранный заказ должен возвращать текущий заказ', () => {
    expect(selectOrder(mockState)).toEqual(mockState.orders.order);
  });

  test('ошибка выбора заказов должна возвращать сообщение об ошибке', () => {
    expect(selectOrdersError(mockState)).toEqual('Test error');
  });

  test('выберите, загружены ли заказы, и верните флаг isLoaded', () => {
    expect(selectIsOrdersLoaded(mockState)).toBe(true);
  });
});
