import {
  createSlice,
  PayloadAction,
  nanoid,
  createSelector
} from '@reduxjs/toolkit';
import { RootState } from '@store';

import { TConstructorIngredient, TIngredient } from '@utils-types';

export type TBurgerSliceState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

export const initialState: TBurgerSliceState = {
  bun: null,
  ingredients: []
};

export const burgerSlice = createSlice({
  name: 'burger',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, { payload }: PayloadAction<TConstructorIngredient>) => {
        if (payload.type === 'bun') {
          state.bun = payload;
        } else {
          state.ingredients.push(payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const id = nanoid();
        return { payload: { ...ingredient, id } };
      }
    },

    deleteIngredient: (state, { payload }: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== payload
      );
    },

    clearBurgerConstructor: () => initialState,

    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const dragIndex = action.payload;
      if (dragIndex <= 0) {
        return;
      }
      const hoverIndex = dragIndex - 1;
      const dragIngredient = state.ingredients[dragIndex];
      state.ingredients.splice(dragIndex, 1);
      state.ingredients.splice(hoverIndex, 0, dragIngredient);
    },
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const dragIndex = action.payload;
      if (dragIndex >= state.ingredients.length - 1) {
        return;
      }
      const hoverIndex = dragIndex + 1;
      const dragIngredient = state.ingredients[dragIndex];
      state.ingredients.splice(dragIndex, 1);
      state.ingredients.splice(hoverIndex, 0, dragIngredient);
    }
  }
});

export const {
  addIngredient,
  deleteIngredient,
  clearBurgerConstructor,
  moveIngredientUp,
  moveIngredientDown
} = burgerSlice.actions;

const selectBurgerSlice = (state: RootState) => state.burger;

export const selectBun = createSelector(
  [selectBurgerSlice],
  (burger) => burger.bun
);

export const selectIngredientConstructor = createSelector(
  [selectBurgerSlice],
  (burger) => burger.ingredients
);

export const burgerSliceReducer = burgerSlice.reducer;
