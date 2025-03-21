import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';

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
    // moveIngredientUp: (
    //   state,
    //   { payload }: PayloadAction<TConstructorIngredient>
    // ) => {
    //   const ingredientIndex = state.ingredients.findIndex(
    //     (ingredient) => ingredient.id === payload.id
    //   );
    //   if (ingredientIndex > 0) {
    //     state.ingredients[ingredientIndex] =
    //       state.ingredients[ingredientIndex - 1];
    //     state.ingredients[ingredientIndex - 1] = payload;
    //   }
    // },
    // moveIngredientDown: (
    //   state,
    //   { payload }: PayloadAction<TConstructorIngredient>
    // ) => {
    //   const ingredientIndex = state.ingredients.findIndex(
    //     (ingredient) => ingredient.id === payload.id
    //   );
    //   if (ingredientIndex < state.ingredients.length - 1) {
    //     state.ingredients[ingredientIndex] =
    //       state.ingredients[ingredientIndex + 1];
    //     state.ingredients[ingredientIndex + 1] = payload;
    //   }
    // }
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
  },
  selectors: {
    selectBun: (state) => state.bun,
    selectIngredientConstructor: (state) => state.ingredients
  }
});

export const {
  addIngredient,
  deleteIngredient,
  clearBurgerConstructor,
  moveIngredientUp,
  moveIngredientDown
} = burgerSlice.actions;

export const { selectBun, selectIngredientConstructor } = burgerSlice.selectors;

export const burgerSliceReducer = burgerSlice.reducer;
