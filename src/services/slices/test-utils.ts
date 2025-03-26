import { nanoid } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { RootState } from '@store';

export const createMockIngredient = (
  overrides?: Partial<TIngredient>
): TIngredient => {
  const defaultIngredient: TIngredient = {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png'
  };

  return { ...defaultIngredient, ...overrides };
};

export const createMockConstructorIngredient = (
  overrides?: Partial<TConstructorIngredient>
): TConstructorIngredient => {
  const baseIngredient = createMockIngredient();
  const defaultConstructorIngredient: TConstructorIngredient = {
    ...baseIngredient,
    ...overrides,
    id: overrides?.id || nanoid()
  };

  return defaultConstructorIngredient as TConstructorIngredient;
};

export const createMockRootState = (
  overrides?: Partial<RootState>
): RootState => {
  const defaultState: RootState = {
    ingredients: {
      ingredients: [],
      error: null,
      isLoaded: false
    },
    user: {
      user: null,
      isAuthTokenChecked: false,
      isAuthenticated: false,
      error: null,
      isDataLoaded: false
    },
    burger: {
      bun: null,
      ingredients: []
    },
    orders: {
      orders: [],
      order: null,
      error: null,
      isLoaded: false
    },
    feed: {
      orders: [],
      totalOrders: 0,
      totalOrdersToday: 0,
      error: null,
      isFeedLoaded: false
    }
  };

  return { ...defaultState, ...overrides };
};
