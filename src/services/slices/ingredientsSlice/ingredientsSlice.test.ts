import {
  configureStore,
  combineReducers,
  AnyAction,
  Reducer
} from '@reduxjs/toolkit';
import {
  ingredientsSliceReducer,
  TIngredientsSliceState,
  getIngredients,
  selectIngredients,
  selectError,
  selectIsLoaded
} from './ingredientsSlice';
import { TIngredient } from '@utils-types';
import { API_ERROR } from '../../../utils/constants';
import * as api from '@api';
import { createMockIngredient, createMockRootState } from '../test-utils';
import { AppDispatch } from '../../store';
import thunk from 'redux-thunk';

interface RootState {
  ingredients: TIngredientsSliceState;
}

describe('ingredientsSlice', () => {
  let store: ReturnType<typeof configureStore>;
  let dispatch: AppDispatch;
  let initialState: TIngredientsSliceState;

  const createTestStore = () =>
    configureStore({
      reducer: combineReducers({
        ingredients: ingredientsSliceReducer
      }),
      middleware: [thunk]
    });

  beforeEach(() => {
    const rootReducer: Reducer<
      { ingredients: TIngredientsSliceState },
      AnyAction
    > = combineReducers({
      ingredients: ingredientsSliceReducer
    });

    store = configureStore({
      reducer: rootReducer,
      middleware: [thunk]
    });

    dispatch = store.dispatch as AppDispatch;

    initialState = {
      ingredients: [],
      error: null,
      isLoaded: false
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('должно быть возвращено исходное состояние', () => {
    expect(ingredientsSliceReducer(undefined, { type: '' })).toEqual(
      initialState
    );
  });

  test('должно быть установлено значение false и ошибка при получении ингредиентов.rejected', () => {
    const errorMessage = 'Не удалось достать ингредиенты';
    const state = ingredientsSliceReducer(
      initialState,
      getIngredients.rejected(new Error(errorMessage), '')
    );
    expect(state.isLoaded).toBe(false);
    expect(state.error).toBe(API_ERROR);
  });

  test('следует правильно подбирать ингредиенты', () => {
    const mockIngredients: TIngredient[] = [
      createMockIngredient(),
      createMockIngredient()
    ];
    const mockState = createMockRootState({
      ingredients: {
        ingredients: mockIngredients,
        error: null,
        isLoaded: false
      }
    });
    const ingredients = selectIngredients(mockState);
    expect(ingredients).toEqual(mockIngredients);
  });

  test('следует правильно выбрать ошибку', () => {
    const mockError = 'Error message';
    const mockState = createMockRootState({
      ingredients: {
        ingredients: [],
        error: mockError,
        isLoaded: false
      }
    });
    const error = selectError(mockState);
    expect(error).toBe(mockError);
  });

  test('должен быть выбран загруженный файл', () => {
    const mockState = createMockRootState({
      ingredients: {
        ingredients: [],
        error: null,
        isLoaded: true
      }
    });
    const isLoaded = selectIsLoaded(mockState);
    expect(isLoaded).toBe(true);
  });
});
