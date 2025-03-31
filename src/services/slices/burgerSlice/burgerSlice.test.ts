import { configureStore } from '@reduxjs/toolkit';
import store from '@store';
import { createMockConstructorIngredient } from '../test-utils';
import {
  burgerSliceReducer,
  initialState,
  addIngredient,
  deleteIngredient,
  clearBurgerConstructor,
  moveIngredientUp,
  moveIngredientDown,
  selectBun,
  selectIngredientConstructor
} from './burgerSlice';

jest.mock('@reduxjs/toolkit', () => ({
  ...jest.requireActual('@reduxjs/toolkit'),
  nanoid: jest.fn(() => 'mocked-nanoid')
}));

let mockState: RootState;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

describe('createMockConstructorIngredient', () => {
  test('должен использовать переданный id из overrides', () => {
    const mockId = 'custom-id';
    const ingredient = createMockConstructorIngredient({ id: mockId });
    expect(ingredient.id).toBe(mockId);
  });

  test('должен генерировать id с помощью nanoid, если id не передан', () => {
    const ingredient = createMockConstructorIngredient();
    expect(ingredient.id).toBe('mocked-nanoid');
  });
});

describe('Тестирование burgerSlice', () => {
  test('должен добавлять булку в состояние', () => {
    const bun = createMockConstructorIngredient({
      type: 'bun',
      name: 'Флюоресцентная булка R2-D3'
    });
    const state = burgerSliceReducer(initialState, addIngredient(bun));
    expect(state.bun).toEqual(
      expect.objectContaining({ ...bun, id: expect.any(String) })
    );
    expect(state.ingredients).toEqual([]);
  });

  test('должен добавлять ингредиент в состояние', () => {
    const ingredient = createMockConstructorIngredient({
      type: 'sauce',
      name: 'Соус с шипами Антарианского плоскоходца'
    });
    const state = burgerSliceReducer(initialState, addIngredient(ingredient));
    expect(state.ingredients).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ ...ingredient, id: expect.any(String) })
      ])
    );
    expect(state.bun).toBeNull();
  });

  test('должен удалять ингредиент из состояния', () => {
    const ingredient = createMockConstructorIngredient({
      type: 'sauce',
      name: 'Соус с шипами Антарианского плоскоходца'
    });
    let state = burgerSliceReducer(initialState, addIngredient(ingredient));
    const ingredientId = state.ingredients[0].id;
    state = burgerSliceReducer(state, deleteIngredient(ingredientId));
    expect(state.ingredients).toEqual([]);
    expect(state.bun).toBeNull();
  });

  test('должен очищать конструктор бургера', () => {
    const bun = createMockConstructorIngredient({
      type: 'bun',
      name: 'Флюоресцентная булка R2-D3'
    });
    const ingredient = createMockConstructorIngredient({
      type: 'sauce',
      name: 'Соус с шипами Антарианского плоскоходца'
    });
    let state = burgerSliceReducer(initialState, addIngredient(bun));
    state = burgerSliceReducer(state, addIngredient(ingredient));
    state = burgerSliceReducer(state, clearBurgerConstructor());
    expect(state).toEqual(initialState);
  });

  test('должен добавлять несколько ингредиентов в состояние', () => {
    const ingredient1 = createMockConstructorIngredient({
      type: 'sauce',
      name: 'Соус с шипами Антарианского плоскоходца'
    });
    const ingredient2 = createMockConstructorIngredient({
      type: 'cheese',
      name: 'Сыр с запахом туманности Андромеды'
    });
    let state = burgerSliceReducer(initialState, addIngredient(ingredient1));
    state = burgerSliceReducer(state, addIngredient(ingredient2));
    expect(state.ingredients).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ ...ingredient1, id: expect.any(String) }),
        expect.objectContaining({ ...ingredient2, id: expect.any(String) })
      ])
    );
  });

  test('должен удалять несколько ингредиентов из состояния', () => {
    const ingredient1 = createMockConstructorIngredient({
      type: 'sauce',
      name: 'Соус с шипами Антарианского плоскоходца'
    });
    const ingredient2 = createMockConstructorIngredient({
      type: 'cheese',
      name: 'Сыр с запахом туманности Андромеды'
    });
    let state = burgerSliceReducer(initialState, addIngredient(ingredient1));
    state = burgerSliceReducer(state, addIngredient(ingredient2));
    const ingredientId1 = state.ingredients[0].id;
    const ingredientId2 = state.ingredients[1].id;
    state = burgerSliceReducer(state, deleteIngredient(ingredientId1));
    state = burgerSliceReducer(state, deleteIngredient(ingredientId2));
    expect(state.ingredients).toEqual([]);
  });

  test('должен очищать состояние после добавления нескольких ингредиентов и булок', () => {
    const bun = createMockConstructorIngredient({
      type: 'bun',
      name: 'Флюоресцентная булка R2-D3'
    });
    const ingredient1 = createMockConstructorIngredient({
      type: 'sauce',
      name: 'Соус с шипами Антарианского плоскоходца'
    });
    const ingredient2 = createMockConstructorIngredient({
      type: 'cheese',
      name: 'Сыр с запахом туманности Андромеды'
    });
    let state = burgerSliceReducer(initialState, addIngredient(bun));
    state = burgerSliceReducer(state, addIngredient(ingredient1));
    state = burgerSliceReducer(state, addIngredient(ingredient2));
    state = burgerSliceReducer(state, clearBurgerConstructor());
    expect(state).toEqual(initialState);
  });

  test('должен перемещать ингредиент вверх', () => {
    const ingredient1 = createMockConstructorIngredient({
      type: 'sauce',
      name: 'Соус с шипами Антарианского плоскоходца'
    });
    const ingredient2 = createMockConstructorIngredient({
      type: 'cheese',
      name: 'Сыр с запахом туманности Андромеды'
    });
    const state = { ...initialState, ingredients: [ingredient1, ingredient2] };
    const newState = burgerSliceReducer(state, moveIngredientUp(1));
    expect(newState.ingredients).toEqual([ingredient2, ingredient1]);
  });

  test('не должен перемещать первый ингредиент вверх', () => {
    const ingredient1 = createMockConstructorIngredient({
      type: 'sauce',
      name: 'Соус с шипами Антарианского плоскоходца'
    });
    const ingredient2 = createMockConstructorIngredient({
      type: 'cheese',
      name: 'Сыр с запахом туманности Андромеды'
    });
    const state = { ...initialState, ingredients: [ingredient1, ingredient2] };
    const newState = burgerSliceReducer(state, moveIngredientUp(0));
    expect(newState.ingredients).toEqual([ingredient1, ingredient2]);
  });

  test('должен перемещать ингредиент вниз', () => {
    const ingredient1 = createMockConstructorIngredient({
      type: 'sauce',
      name: 'Соус с шипами Антарианского плоскоходца'
    });
    const ingredient2 = createMockConstructorIngredient({
      type: 'cheese',
      name: 'Сыр с запахом туманности Андромеды'
    });
    const state = { ...initialState, ingredients: [ingredient1, ingredient2] };
    const newState = burgerSliceReducer(state, moveIngredientDown(0));
    expect(newState.ingredients).toEqual([ingredient2, ingredient1]);
  });

  test('не должен перемещать последний ингредиент вниз', () => {
    const ingredient1 = createMockConstructorIngredient({
      type: 'sauce',
      name: 'Соус с шипами Антарианского плоскоходца'
    });
    const ingredient2 = createMockConstructorIngredient({
      type: 'cheese',
      name: 'Сыр с запахом туманности Андромеды'
    });
    const state = { ...initialState, ingredients: [ingredient1, ingredient2] };
    const newState = burgerSliceReducer(state, moveIngredientDown(1));
    expect(newState.ingredients).toEqual([ingredient1, ingredient2]);
  });
});

describe('Тестирование селекторов', () => {
  beforeEach(() => {
    const bun = createMockConstructorIngredient({
      type: 'bun',
      name: 'Флюоресцентная булка R2-D3',
      id: 'bun_id'
    });
    const ingredient = createMockConstructorIngredient({
      type: 'sauce',
      name: 'Соус с шипами Антарианского плоскоходца',
      id: 'sauce_id'
    });

    const store = configureStore({
      reducer: {
        burger: burgerSliceReducer
      }
    });

    store.dispatch(addIngredient(bun));
    store.dispatch(addIngredient(ingredient));

    mockState = store.getState() as RootState;
  });

  test('должен возвращать булку', () => {
    const bun = createMockConstructorIngredient({
      type: 'bun',
      name: 'Флюоресцентная булка R2-D3',
      id: 'bun_id'
    });
    expect(selectBun(mockState)).toEqual(mockState.burger.bun);
    expect.objectContaining({ ...bun, id: expect.any(String) });
  });

  test('должен возвращать список ингредиентов', () => {
    const ingredient = createMockConstructorIngredient({
      type: 'sauce',
      name: 'Соус с шипами Антарианского плоскоходца',
      id: 'sauce_id'
    });
    expect(selectIngredientConstructor(mockState)).toEqual(
      mockState.burger.ingredients
    );
    expect.arrayContaining([
      expect.objectContaining({ ...ingredient, id: expect.any(String) })
    ]);
  });
});
