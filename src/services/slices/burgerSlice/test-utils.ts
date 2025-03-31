import { nanoid } from '@reduxjs/toolkit';
import {
  TIngredient,
  TConstructorIngredient
} from '../../../../src/utils/types';

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
