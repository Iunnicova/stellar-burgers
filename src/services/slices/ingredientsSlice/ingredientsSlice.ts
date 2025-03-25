import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';

import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';
import { API_ERROR } from '../../../utils/constants';
import { RootState } from '@store';

export type TIngredientsSliceState = {
  ingredients: TIngredient[];
  error: string | null | undefined;
  isLoaded: boolean;
};

const initialState: TIngredientsSliceState = {
  ingredients: [],
  error: null,
  isLoaded: false
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  // selectors: {
  //   selectIngredients: (state) => state.ingredients,
  //   selectError: (state) => state.error,
  //   selectIsLoaded: (state) => state.isLoaded
  // },
  extraReducers(builder) {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isLoaded = true;
        state.error = null;
      })
      .addCase(
        getIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.ingredients = action.payload;
          state.isLoaded = false;
        }
      )
      .addCase(getIngredients.rejected, (state, action) => {
        state.isLoaded = false;
        state.error = (action.payload as string) || API_ERROR;
      });
  }
});

export const getIngredients = createAsyncThunk(
  'ingredients/getIngredients',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getIngredientsApi();
      return response;
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message || API_ERROR);
      }
    }
  }
);

const selectIngredientsSlice = (state: RootState) => state.ingredients;

export const selectIngredients = createSelector(
  [selectIngredientsSlice],
  (ingredients) => ingredients.ingredients
);

export const selectError = createSelector(
  [selectIngredientsSlice],
  (ingredients) => ingredients.error
);

export const selectIsLoaded = createSelector(
  [selectIngredientsSlice],
  (ingredients) => ingredients.isLoaded
);

export const ingredientsSliceReducer = ingredientsSlice.reducer;
