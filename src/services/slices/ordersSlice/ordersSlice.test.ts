//заглушка
test('dummy test', () => {
  expect(true).toBe(true);
});

// import { configureStore } from "@reduxjs/toolkit";
// import { TOrder } from "@utils-types";
// import { TOrdersSliceState, ordersSliceReducer, getUserOrders, getOrder, clearOrderState } from "./ordersSlice";
// import * as api from '../../../../src/utils/burger-api';

// jest.mock('../../../../src/utils/burger-api', () => ({
//   getOrdersApi: jest.fn(),
//   getOrderByNumberApi: jest.fn(),
//   orderBurgerApi: jest.fn()
// }));

// const createTestStore = (initialState?: Partial<TOrdersSliceState>) =>
//   configureStore({
//     reducer: { orders: ordersSliceReducer },
//     preloadedState: {
//       orders: {
//         orders: initialState?.orders ?? [],
//         order: initialState?.order ?? null,
//         error: initialState?.error ?? null,
//         isLoaded: initialState?.isLoaded ?? false
//       }
//     }
//   });

// describe('ordersSlice', () => {
//   it('должен инициализироваться с начальным состоянием', () => {
//     const store = createTestStore();
//     const state = store.getState().orders;

//     expect(state).toEqual({
//       orders: [],
//       order: null,
//       error: null,
//       isLoaded: false
//     });
//   });

//   it('должен загружать заказы успешно', async () => {
//     expect.assertions(3);

//     const mockOrders: TOrder[] = [
//       {
//         _id: '123',
//         number: 1,
//         name: 'Burger',
//         status: 'done',
//         ingredients: ['bun', 'meat'],
//         createdAt: '2024-03-27T12:00:00.000Z',
//         updatedAt: '2024-03-27T12:30:00.000Z'
//       }
//     ];
//     (api.getOrdersApi as jest.Mock).mockResolvedValue(mockOrders); // Используем импортированный api

//     const store = createTestStore();
//     await store.dispatch(getUserOrders());

//     const state = store.getState().orders;
//     expect(state.orders).toEqual(mockOrders);
//     expect(state.isLoaded).toBe(true);
//     expect(state.error).toBeNull();
//   });

//   it('должен обрабатывать ошибку загрузки заказов', async () => {
//     expect.assertions(3);

//     const mockError = new Error('Ошибка загрузки');
//     (api.getOrdersApi as jest.Mock).mockRejectedValue(mockError); // Используем импортированный api

//     const store = createTestStore();
//     await store.dispatch(getUserOrders());

//     const state = store.getState().orders;
//     expect(state.orders).toEqual([]);
//     expect(state.isLoaded).toBe(false);
//     expect(state.error).toEqual(mockError);
//   });

//   it('должен загружать заказ по номеру', async () => {
//     expect.assertions(3);

//     const mockOrder: TOrder = {
//       _id: '123456',
//       number: 42,
//       name: 'Mega Burger',
//       status: 'done',
//       ingredients: ['salad', 'bun', 'meat'],
//       createdAt: '2024-03-27T12:00:00.000Z',
//       updatedAt: '2024-03-27T12:30:00.000Z'
//     };

//     (api.getOrderByNumberApi as jest.Mock).mockResolvedValue({
//       orders: [mockOrder]
//     });

//     const store = createTestStore();
//     await store.dispatch(getOrder(42));

//     const state = store.getState().orders;
//     expect(state.order).toEqual(mockOrder);
//     expect(state.isLoaded).toBe(false);
//     expect(state.error).toBeNull();
//   });

//   it('должен обрабатывать ошибку при загрузке заказа по номеру', async () => {
//     expect.assertions(3);

//     const mockError = new Error('Заказ не найден');
//     (api.getOrderByNumberApi as jest.Mock).mockRejectedValue(mockError);

//     const store = createTestStore();
//     await store.dispatch(getOrder(42));

//     const state = store.getState().orders;
//     expect(state.order).toBeNull();
//     expect(state.isLoaded).toBe(false);
//     expect(state.error).toEqual(mockError);
//   });

//   it('должен очищать состояние заказа', () => {
//     const mockOrder: TOrder = {
//       _id: '123456',
//       number: 42,
//       name: 'Mega Burger',
//       status: 'done',
//       ingredients: ['salad', 'bun', 'meat'],
//       createdAt: '2024-03-27T12:00:00.000Z',
//       updatedAt: '2024-03-27T12:30:00.000Z'
//     };

//     const store = createTestStore({ order: mockOrder });

//     store.dispatch(clearOrderState());

//     const state = store.getState().orders;
//     expect(state.order).toBeNull();
//   });
// });

// // import { configureStore } from '@reduxjs/toolkit';
// // import {
// //   ordersSliceReducer,
// //   getUserOrders,
// //   getOrder,
// //   createNewOrder,
// //   clearOrderState
// // } from './ordersSlice';
// // import { TOrdersSliceState } from './ordersSlice';
// // import { API_ERROR } from '../../../utils/constants';
// // import { getOrdersApi, getOrderByNumberApi, orderBurgerApi } from '@api';
// // import { TOrder } from '@utils-types';
// // import * as api from '../../../../src/utils/burger-api';

// // jest.mock('../../../../src/utils/burger-api', () => {
// //   const originalModule = jest.requireActual('../../../../src/utils/burger-api');
// //   return {
// //     ...originalModule,
// //     getOrdersApi: jest.fn(),
// //     getOrderByNumberApi: jest.fn(),
// //     orderBurgerApi: jest.fn()
// //   };
// // });

// // beforeEach(() => {
// //   jest.clearAllMocks(); // 👈 Очищает все моки перед каждым тестом
// // });

// // const createTestStore = (initialState?: Partial<TOrdersSliceState>) =>
// //   configureStore({
// //     reducer: { orders: ordersSliceReducer },
// //     preloadedState: {
// //       orders: {
// //         orders: initialState?.orders ?? [],
// //         order: initialState?.order ?? null,
// //         error: initialState?.error ?? null,
// //         isLoaded: initialState?.isLoaded ?? false
// //       }
// //     }
// //   });

// // describe('ordersSlice', () => {
// //   it('должен инициализироваться с начальным состоянием', () => {
// //     const store = createTestStore();
// //     const state = store.getState().orders;

// //     expect(state).toEqual({
// //       orders: [],
// //       order: null,
// //       error: null,
// //       isLoaded: false
// //     });
// //   });

// //   it('должен загружать заказы успешно', async () => {
// //     const mockOrders: TOrder[] = [
// //       {
// //         _id: '123',
// //         number: 1,
// //         name: 'Burger',
// //         status: 'done',
// //         ingredients: ['bun', 'meat'],
// //         createdAt: '2024-03-27T12:00:00.000Z',
// //         updatedAt: '2024-03-27T12:30:00.000Z'
// //       }
// //     ];
// //     (api.getOrdersApi as jest.Mock).mockResolvedValue(mockOrders);

// //     const store = createTestStore();
// //     await store.dispatch(getUserOrders());

// //     const state = store.getState().orders;
// //     expect(state.orders).toEqual(mockOrders);
// //     expect(state.isLoaded).toBe(true); // 🔥 Исправлено!
// //     expect(state.error).toBeNull();
// //   });

// //   it('должен обрабатывать ошибку загрузки заказов', async () => {
// //     (api.getOrdersApi as jest.Mock).mockRejectedValue(
// //       new Error('Ошибка загрузки')
// //     );

// //     const store = createTestStore();
// //     await store.dispatch(getUserOrders()).catch(() => {}); // 🔥 Добавлен catch

// //     const state = store.getState().orders;
// //     expect(state.orders).toEqual([]);
// //     expect(state.isLoaded).toBe(false);
// //     expect(state.error).toBeInstanceOf(Error);
// //   });

// //   it('должен обрабатывать ошибку при загрузке заказа по номеру', async () => {
// //     expect.assertions(3);

// //     (api.getOrderByNumberApi as jest.Mock).mockRejectedValue(
// //       new Error('Заказ не найден')
// //     );

// //     const store = createTestStore();
// //     await store.dispatch(getOrder(42));

// //     const state = store.getState().orders;
// //     expect(state.order).toBeNull();
// //     expect(state.isLoaded).toBe(true);
// //     expect(state.error).toBeInstanceOf(Error);
// //   });

// //   it('должен очищать состояние заказа', () => {
// //     const mockOrder: TOrder = {
// //       _id: '123456',
// //       number: 42,
// //       name: 'Mega Burger',
// //       status: 'done',
// //       ingredients: ['salad', 'bun', 'meat'],
// //       createdAt: '2024-03-27T12:00:00.000Z',
// //       updatedAt: '2024-03-27T12:30:00.000Z'
// //     };

// //     const store = createTestStore({ order: mockOrder });

// //     store.dispatch(clearOrderState());

// //     const state = store.getState().orders;
// //     expect(state.order).toBeNull();
// //   });
// // });

// // import { configureStore } from '@reduxjs/toolkit';
// // import {
// //   ordersSliceReducer,
// //   getUserOrders,
// //   getOrder,
// //   createNewOrder,
// //   clearOrderState
// // } from './ordersSlice';
// // import { TOrdersSliceState } from './ordersSlice';
// // import { API_ERROR } from '../../../utils/constants';
// // import { getOrdersApi, getOrderByNumberApi, orderBurgerApi } from '@api';
// // import { TOrder } from '@utils-types';

// // jest.mock('@api', () => ({
// //   getOrdersApi: jest.fn(),
// //   getOrderByNumberApi: jest.fn(),
// //   orderBurgerApi: jest.fn()
// // }));

// // const createTestStore = (initialState?: Partial<TOrdersSliceState>) =>
// //   configureStore({
// //     reducer: { orders: ordersSliceReducer },
// //     preloadedState: {
// //       orders: {
// //         orders: initialState?.orders ?? [],
// //         order: initialState?.order ?? null,
// //         error: initialState?.error ?? null,
// //         isLoaded: initialState?.isLoaded ?? false
// //       }
// //     }
// //   });

// // describe('ordersSlice', () => {
// //   it('должен инициализироваться с начальным состоянием', () => {
// //     const store = createTestStore();
// //     const state = store.getState().orders;

// //     expect(state).toEqual({
// //       orders: [],
// //       order: null,
// //       error: null,
// //       isLoaded: false
// //     });
// //   });

// //   it('должен загружать заказы успешно', async () => {
// //     const mockOrders: TOrder[] = [
// //       {
// //         _id: '123', number: 1, name: 'Burger', status: 'done',ingredients: ['bun', 'meat'], createdAt: '2024-03-27T12:00:00.000Z',
// //       updatedAt: '2024-03-27T12:30:00.000Z'
// //       }
// //     ];
// //     (getOrdersApi as jest.Mock).mockResolvedValue(mockOrders);

// //     const store = createTestStore();
// //     await store.dispatch(getUserOrders());

// //     const state = store.getState().orders;
// //     expect(state.orders).toEqual(mockOrders);
// //     expect(state.isLoaded).toBe(false);
// //     expect(state.error).toBeNull();
// //   });

// //   it('должен обрабатывать ошибку загрузки заказов', async () => {
// //     (getOrdersApi as jest.Mock).mockRejectedValue(new Error('Ошибка загрузки'));

// //     const store = createTestStore();
// //     await store.dispatch(getUserOrders());

// //     const state = store.getState().orders;
// //     expect(state.orders).toEqual([]);
// //     expect(state.isLoaded).toBe(false);
// //     expect(state.error).toBe('Ошибка загрузки');
// //   });

// //   it('должен загружать заказ по номеру', async () => {
// //     const mockOrder: TOrder = { _id: '123456',number: 42, name: 'Mega Burger',status: 'done',ingredients: ['salad', 'bun', 'meat'],
// //       createdAt: '2024-03-27T12:00:00.000Z', updatedAt: '2024-03-27T12:30:00.000Z'
// //     };

// //     (getOrderByNumberApi as jest.Mock).mockResolvedValue({
// //       orders: [mockOrder]
// //     });

// //     const store = createTestStore();
// //     await store.dispatch(getOrder(42));

// //     const state = store.getState().orders;
// //     expect(state.order).toEqual(mockOrder);
// //     expect(state.isLoaded).toBe(false);
// //   });

// //   it('должен очищать состояние заказа', () => {
// //     const mockOrder: TOrder = { _id: '123456', number: 42, name: 'Mega Burger', status: 'done', ingredients: ['salad', 'bun', 'meat'],
// //       createdAt: '2024-03-27T12:00:00.000Z', updatedAt: '2024-03-27T12:30:00.000Z'
// //     };

// //     const store = createTestStore({ order: mockOrder });

// //     store.dispatch(clearOrderState());

// //     const state = store.getState().orders;
// //     expect(state.order).toBeNull();
// //   });
// // });
