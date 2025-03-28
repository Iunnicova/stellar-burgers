import { AnyAction, configureStore, EnhancedStore } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  logoutApi,
  updateUserApi,
  TRegisterData
} from '@api';
import { setCookie, deleteCookie } from '@utils-cookie';
import {
  userSliceReducer,
  registerUser,
  loginUser,
  getDataUser,
  userLogout,
  updateDataUser,
  userSlice,
  TUserSliceState
} from './userSlice';

import configureMockStore from 'redux-mock-store';
import thunk, { ThunkDispatch } from 'redux-thunk';
import * as utils from '@utils-cookie';
import userReducer from './userSlice';
import store, { useDispatch } from '../../store';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const mockStore = configureMockStore([thunk]);
export const mockUserData: Omit<TRegisterData, 'name'> = {
  email: 'test@example.com',
  password: 'password123'
};

export const createTestStore = (initialState?: Partial<TUserSliceState>) =>
  configureStore({
    reducer: { user: userReducer },
    preloadedState: {
      user: {
        user: null,
        isAuthTokenChecked: false,
        isAuthenticated: false,
        error: null,
        isDataLoaded: false,
        ...initialState
      }
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk)
  });

jest.mock('@api', () => ({
  registerUserApi: jest.fn(),
  loginUserApi: jest.fn(),
  getUserApi: jest.fn(),
  logoutApi: jest.fn(),
  updateUserApi: jest.fn()
}));

jest.mock('@utils-cookie', () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn()
}));

jest.mock('@slices', () => ({
  updateDataUser: jest.fn() as jest.Mock
}));

export interface User {
  email: string;
  name: string;
}

export interface IUserState {
  user: User | null;
  isAuthTokenChecked: boolean;
  isAuthenticated: boolean;
  error: string | null;
  isDataLoaded: boolean;
}

describe('userSlice', () => {
  let store: ReturnType<typeof createTestStore>;
  let dispatch: AppDispatch;

  beforeEach(() => {
    store = createTestStore();
    dispatch = store.dispatch;
    jest.clearAllMocks();

    Storage.prototype.getItem = jest.fn();
    Storage.prototype.setItem = jest.fn();
    Storage.prototype.removeItem = jest.fn();
  });

  test('должно быть возвращено исходное состояние', () => {
    const state = store.getState().user;
    expect(state).toEqual({
      user: null,
      isAuthTokenChecked: false,
      isAuthenticated: false,
      error: null,
      isDataLoaded: false
    });
  });

  test('должен обрабатывать pегистрация пользователя выполнена', async () => {
    expect.assertions(5);

    const mockUser = {
      user: { email: 'test@example.com', name: 'John Doe' },
      success: true,
      accessToken: 'token',
      refreshToken: 'refresh'
    };

    (registerUserApi as jest.Mock).mockResolvedValue(mockUser);

    const setCookieSpy = jest
      .spyOn(utils, 'setCookie')
      .mockImplementation((name, value) => {});
    await dispatch(
      registerUser({
        email: 'test@example.com',
        password: 'password',
        name: 'John Doe'
      })
    );

    expect(setCookieSpy).toHaveBeenCalledWith('accessToken', 'token');
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'refreshToken',
      'refresh'
    );
    expect(store.getState().user.user).toEqual(mockUser.user);
    expect(store.getState().user.isAuthenticated).toBe(true);
    expect(store.getState().user.error).toBeNull();
  });

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('должен обрабатывать регистрация пользователя отклонена', async () => {
    expect.assertions(3);

    const dispatch: AppDispatch = store.dispatch;
    const API_ERROR = 'Registration failed';
    (registerUserApi as jest.Mock).mockRejectedValue(new Error(API_ERROR));

    await dispatch(
      registerUser({
        email: 'test@example.com',
        password: 'password',
        name: 'John Doe'
      })
    );

    expect(store.getState().user.error).toBe(API_ERROR);
    expect(store.getState().user.isAuthenticated).toBe(false);
    expect(store.getState().user.user).toBeNull();
  });
  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  test('зарегистрированный пользователь должен обработать сбой API', async () => {
    (registerUserApi as jest.Mock).mockResolvedValueOnce({
      success: false,
      message: 'Registration failed'
    });

    const store = mockStore({});
    await store.dispatch(
      registerUser({
        name: 'John',
        email: 'test@test.com',
        password: '123456'
      }) as any
    );

    const actions = store.getActions();
    expect(actions[1].type).toBe('user/registerUser/rejected');
    expect(actions[1].payload?.message ?? 'No message').toBe(
      'Registration failed'
    );
  });

  test('должна быть выполнена обработка логина пользователя', async () => {
    expect.assertions(5);

    const mockUser = {
      user: { email: 'test@example.com', name: 'John Doe' },
      success: true,
      accessToken: 'token',
      refreshToken: 'refresh'
    };

    (loginUserApi as jest.Mock).mockResolvedValue(mockUser);

    await dispatch(
      loginUser({
        email: 'test@example.com',
        password: 'password'
      })
    );

    expect(setCookie).toHaveBeenCalledWith('accessToken', 'token');
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'refreshToken',
      'refresh'
    );
    expect(store.getState().user.user).toEqual(mockUser.user);
    expect(store.getState().user.isAuthenticated).toBe(true);
    expect(store.getState().user.error).toBeNull();
  });

  test('должен обрабатывать отклоненный вход пользователя в систему', async () => {
    expect.assertions(3);

    const API_ERROR = 'Login failed';
    (loginUserApi as jest.Mock).mockRejectedValue(new Error(API_ERROR));

    await store.dispatch(
      loginUser({ email: 'test@example.com', password: 'password' }) as any
    );

    expect(store.getState().user.error).toBe(API_ERROR);
    expect(store.getState().user.isAuthenticated).toBe(false);
    expect(store.getState().user.user).toBeNull();
  });

  test('должна быть выполнена обработка getData User', async () => {
    expect.assertions(3);

    const mockUser = {
      user: { email: 'test@example.com', name: 'John Doe' },
      success: true
    };

    (getUserApi as jest.Mock).mockResolvedValue(mockUser);

    await dispatch(getDataUser());

    expect(store.getState().user.user).toEqual(mockUser.user);
    expect(store.getState().user.isAuthenticated).toBe(true);
    expect(store.getState().user.error).toBeNull();
  });

  test('должен обрабатывать отклоненные пользователем данные getData', async () => {
    expect.assertions(1);

    const API_ERROR = 'User data fetch failed';
    (getUserApi as jest.Mock).mockRejectedValue(new Error(API_ERROR));

    await store.dispatch(getDataUser() as any);

    expect(store.getState().user.error).toBe(API_ERROR);
  });

  test('должна быть выполнена обработка выхода пользователя из системы', async () => {
    expect.assertions(4);

    (logoutApi as jest.Mock).mockResolvedValue({ success: true });

    const removeItemMock = jest
      .spyOn(localStorage, 'removeItem')
      .mockImplementation(() => {});
    const getItemMock = jest
      .spyOn(localStorage, 'getItem')
      .mockReturnValue('refreshToken');

    await dispatch(userLogout());

    expect(removeItemMock).toHaveBeenCalledWith('refreshToken');
    expect(store.getState().user.user).toBeNull();
    expect(store.getState().user.isAuthenticated).toBe(false);
    expect(store.getState().user.error).toBeNull();
  });

  test('должен обработать ошибку удаления', () => {
    store.dispatch({
      type: 'user/removeError'
    });

    expect(store.getState().user.error).toBeNull();
  });

  test('должен обрабатывать данные обновления, выполненные пользователем', async () => {
    expect.assertions(2);

    const mockUpdatedUser = {
      user: { email: 'test@example.com', name: 'Updated Name' },
      success: true
    };

    (updateUserApi as jest.Mock).mockResolvedValue(mockUpdatedUser);

    await dispatch(updateDataUser({ name: 'Updated Name' }));

    expect(store.getState().user.user).toEqual(mockUpdatedUser.user);
    expect(store.getState().user.isDataLoaded).toBe(false);
  });

  test('пользователь данных обновления должен обработать сбой API', async () => {
    (updateUserApi as jest.Mock).mockResolvedValueOnce({
      success: false,
      message: 'User update failed'
    });

    const store = mockStore({});
    await store.dispatch(updateDataUser({ email: 'newemail@test.com' }) as any);

    const actions = store.getActions();
    expect(actions[1].type).toBe('user/updateDataUser/rejected');
    expect(actions[1].payload?.message).toBe('User update failed');
  });

  test('должен обработать сбой API', async () => {
    (getUserApi as jest.Mock).mockResolvedValueOnce({
      success: false,
      message: 'User data fetch failed'
    });

    const store = mockStore({});
    await store.dispatch(getDataUser() as any);

    const actions = store.getActions();
    expect(actions[1].type).toBe('user/getDataUser/rejected');
    expect(actions[1].payload.message).toBe('User data fetch failed');
  });

  test('выход пользователя из системы должен обрабатывать сбой API', async () => {
    (logoutApi as jest.Mock).mockRejectedValueOnce(new Error('Logout failed'));

    try {
      await dispatch(userLogout()).unwrap();
    } catch (error: any) {
      expect(error).toBe('Logout failed');
    }

    const state = store.getState() as RootState;
    expect(state.user.error).toBe('Logout failed');
    expect(state.user.isAuthenticated).toBe(false);
  });

  test('должен обработать отклоненное обновление данных пользователя', async () => {
    expect.assertions(2);

    const API_ERROR = 'Update failed';
    (updateUserApi as jest.Mock).mockRejectedValue(new Error(API_ERROR));

    await store.dispatch(updateDataUser({ name: 'New Name' }) as any);

    expect(store.getState().user.error).toBe(API_ERROR);
    expect(store.getState().user.isDataLoaded).toBe(false);
  });

  test('должен обрабатывать ответ API с success: false', async () => {
    expect.assertions(3);
    const API_ERROR = 'Invalid credentials';
    (loginUserApi as jest.Mock).mockResolvedValue({
      success: false,
      message: API_ERROR
    });
    const result = await store.dispatch(loginUser(mockUserData));

    expect(result.type).toBe('user/loginUser/rejected');
    expect(result.payload).toEqual({ message: API_ERROR });
    expect(store.getState().user.error).toBe(API_ERROR);
  });

  test('должен обрабатывать ответ API с success: false при выходе пользователя', async () => {
    expect.assertions(3);
    const API_ERROR = 'Logout failed due to server error';
    (logoutApi as jest.Mock).mockResolvedValue({
      success: false,
      message: API_ERROR
    });
    const result = await store.dispatch(userLogout());

    expect(result.type).toBe('user/userLogout/rejected');
    expect(result.payload).toBe(API_ERROR);
    expect(store.getState().user.error).toBe(API_ERROR);
  });
});
