import { configureStore } from '@reduxjs/toolkit';
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
  registerUser,
  loginUser,
  getDataUser,
  userLogout,
  updateDataUser,
  TUserSliceState,
  selectUserError,
  selectIsUserDataLoaded,
  selectIsAuthTokenChecked,
  selectIsAuthenticated,
  selectUser,
  userSliceReducer
} from './userSlice';

import configureMockStore from 'redux-mock-store';
import thunk, { ThunkDispatch } from 'redux-thunk';
import * as utils from '@utils-cookie';
import userReducer from './userSlice';
import store, { useDispatch } from '../../store';
import { API_ERROR } from '@/src/utils/constants';
import * as api from '@api';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const mockStore = configureMockStore([thunk]);
export const mockUserData: Omit<TRegisterData, 'name'> = {
  email: 'test@example.com',
  password: 'password123'
};

const dispatch = jest.fn();
const getState = jest.fn();
const extraArgument = {};
const extra = {};

const createAsyncThunkMock = (fn: any) => (arg: any, thunkAPI: any) => {
  const { dispatch, getState, extra } = thunkAPI;
  return fn(arg, {
    dispatch,
    getState,
    rejectWithValue: thunkAPI.rejectWithValue,
    extra
  });
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

  // 40-41
  test('должен обработать ошибку удаления', () => {
    store.dispatch({
      type: 'user/removeError'
    });

    expect(store.getState().user.error).toBeNull();
  });

  // 52-55,142-146
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

  //59-61
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  test('должен обрабатывать регистрацию пользователя отклонена', async () => {
    expect.assertions(3);
    const dispatch: AppDispatch = store.dispatch;
    const API_ERROR = 'Registration failed';
    (registerUserApi as jest.Mock).mockRejectedValue({ message: API_ERROR });

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

  //59
  test('должен установить error в null, если action.payload не содержит ошибки', () => {
    const action = {
      type: registerUser.rejected.type,
      payload: null
    };
    const initialState = store.getState().user;
    const newState = userReducer(initialState, action);
    expect(newState.error).toBeNull();
    expect(newState.isAuthenticated).toBe(false);
    expect(newState.user).toBeNull();
  });

  //81
  test('должен использовать значение по умолчанию (Произошла неизвестная ошибка), если нет payload в action', () => {
    const action = {
      type: loginUser.rejected.type,
      payload: undefined
    };
    const initialState = store.getState().user;
    const newState = userReducer(initialState, action);

    expect(newState.error).toBe(API_ERROR);
  });

  //86-89,183
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

  //92-95
  test('должен обрабатывать отклоненные пользователем данные getData', async () => {
    expect.assertions(1);

    const API_ERROR = 'User data fetch failed';
    (getUserApi as jest.Mock).mockRejectedValue(new Error(API_ERROR));

    await store.dispatch(getDataUser() as any);

    expect(store.getState().user.error).toBe(API_ERROR);
  });

  //98
  test('должен использовать значение по умолчанию (API_ERROR), если нет action.error.message', () => {
    const action = {
      type: getDataUser.rejected.type,
      error: {
        message: undefined
      }
    };
    const initialState = store.getState().user;
    const newState = userReducer(initialState, action);

    expect(newState.isAuthTokenChecked).toBe(true);
    expect(newState.isAuthenticated).toBe(false);
    expect(newState.error).toBe(API_ERROR);
    expect(newState.isDataLoaded).toBe(false);
  });

  //103-104,194
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

  //107-108
  test('должен обработать отклоненное обновление данных пользователя', async () => {
    expect.assertions(2);

    const API_ERROR = 'Update failed';
    (updateUserApi as jest.Mock).mockRejectedValue(new Error(API_ERROR));

    await store.dispatch(updateDataUser({ name: 'New Name' }) as any);

    expect(store.getState().user.error).toBe(API_ERROR);
    expect(store.getState().user.isDataLoaded).toBe(false);
  });

  //111
  test('должен использовать значение по умолчанию (API_ERROR), если нет action.error.message', () => {
    const action = {
      type: updateDataUser.rejected.type,
      error: {
        message: undefined
      }
    };
    const initialState = store.getState().user;
    const newState = userReducer(initialState, action);
    expect(newState.error).toBe(API_ERROR);
    expect(newState.isDataLoaded).toBe(false);
  });

  //116-119, 209-213
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

  //126
  test('должен использовать "Logout failed" по умолчанию, если нет payload в отклонении', () => {
    const action = {
      type: userLogout.rejected.type,
      payload: undefined
    };
    const initialState = store.getState().user;
    const newState = userReducer(initialState, action);

    expect(newState.error).toBe('Logout failed');
    expect(newState.isAuthenticated).toBe(false);
  });

  //140-141
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

  ///161-170
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

  //161-162
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

  //163
  test('следует отклонять с пометкой "Неизвестная ошибка", если ошибка имеет значение null или не определена', async () => {
    const getState = jest.fn();
    const extraArgument = {};
    const mockUserData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    };
    const mockError = null;
    (api.registerUserApi as jest.Mock).mockRejectedValue(mockError);
    const result = await registerUser(mockUserData)(
      dispatch,
      getState,
      extraArgument
    );

    expect(result.type).toBe(registerUser.rejected.type);
    expect(result.payload).toBe('Unknown error');
    expect(setCookie).not.toHaveBeenCalled();
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  //175
  test('должен быть отклонен с пометкой "Ошибка входа в систему", когда пользовательский Api возвращает неудачный ответ с пустым сообщением', async () => {
    const mockDataUser = { email: 'test@example.com', password: 'password123' };
    const mockApiResponse = { success: false, message: '' };

    (api.loginUserApi as jest.Mock).mockResolvedValue(mockApiResponse);

    const result = await loginUser(mockDataUser)(
      dispatch,
      getState,
      extraArgument
    );

    expect(result.type).toBe(loginUser.rejected.type);
    expect(result.payload).toEqual({ message: 'Login failed' });

    expect(setCookie).not.toHaveBeenCalled();
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  //181-182
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

  //192-193
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

  //207-208
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

  //220
  test('должен отклоняться с пометкой "Ошибка выхода из системы", когда logout Api возвращает неудачный ответ без свойства message', async () => {
    const mockApiResponse = { success: false };

    (api.logoutApi as jest.Mock).mockResolvedValue(mockApiResponse);

    const result = await userLogout()(dispatch, getState, extra);

    expect(result.type).toBe(userLogout.rejected.type);
    expect(result.payload).toBe('Logout failed');

    expect(deleteCookie).not.toHaveBeenCalled();
    expect(localStorage.removeItem).not.toHaveBeenCalled();
  });

  //228
  test('должен отклоняться с сообщением "Выход из системы не удался", когда перехваченное исключение не содержит сообщения', async () => {
    const mockError = {};

    (api.logoutApi as jest.Mock).mockRejectedValue(mockError);

    const result = await userLogout()(dispatch, getState, extra);

    expect(result.type).toBe(userLogout.rejected.type);
    expect(result.payload).toBe('Logout failed');

    expect(deleteCookie).not.toHaveBeenCalled();
    expect(localStorage.removeItem).not.toHaveBeenCalled();
  });
});

describe('userSlice selectors', () => {
  let store: any;

  beforeEach(() => {
    const initialState = {
      user: {
        email: 'test@example.com',
        name: 'John Doe'
      },
      isAuthTokenChecked: true,
      isAuthenticated: true,
      error: 'An error occurred',
      isDataLoaded: false
    };

    store = configureStore({
      reducer: {
        user: userSliceReducer
      },
      preloadedState: { user: initialState }
    });
  });

  test('selectUser должен возвращать правильное значение user', () => {
    expect(selectUser(store.getState())).toEqual({
      email: 'test@example.com',
      name: 'John Doe'
    });
  });

  test('selectIsAuthTokenChecked должен возвращать правильное значение isAuthTokenChecked', () => {
    expect(selectIsAuthTokenChecked(store.getState())).toBe(true);
  });

  test('selectIsAuthenticated должен возвращать правильное значение isAuthenticated', () => {
    expect(selectIsAuthenticated(store.getState())).toBe(true);
  });

  test('selectUserError должен возвращать правильное значение error', () => {
    expect(selectUserError(store.getState())).toBe('An error occurred');
  });

  test('selectIsUserDataLoaded должен возвращать правильное значение isDataLoaded', () => {
    expect(selectIsUserDataLoaded(store.getState())).toBe(false);
  });
});
