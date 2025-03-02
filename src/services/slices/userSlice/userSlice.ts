import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  TRegisterData
} from '@api';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '@utils-cookie';
import { API_ERROR } from '../../../utils/constants';

type TUserSliceState = {
  user: TUser | null;
  isAuthTokenChecked: boolean;
  isAuthenticated: boolean;
  error: string | null | undefined;
  isDataLoaded: boolean;
};

const initialState: TUserSliceState = {
  user: null,
  isAuthTokenChecked: false,
  isAuthenticated: false,
  error: null,
  isDataLoaded: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    removeError: (state) => {
      state.error = null;
    }
  },
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuthTokenChecked: (state) => state.isAuthTokenChecked,
    selectIsAuthenticated: (state) => state.isAuthenticated,
    selectUserError: (state) => state.error,
    selectIsUserDataLoaded: (state) => state.isDataLoaded
  },
  extraReducers(builder) {
    builder
      // Регистрация пользователя
      .addCase(registerUser.pending, (state) => {
        state.error = null;
        state.isDataLoaded = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isAuthTokenChecked = true;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.isDataLoaded = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.error.message || API_ERROR;
        state.isDataLoaded = false;
      })
      // Авторизация пользователя
      .addCase(loginUser.pending, (state) => {
        state.error = null;
        state.isDataLoaded = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthTokenChecked = true;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.isDataLoaded = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isAuthTokenChecked = true;
        state.error = action.error.message || API_ERROR;
        state.isDataLoaded = false;
      })
      // Получение данных пользователя
      .addCase(getDataUser.pending, (state) => {
        state.isAuthTokenChecked = false;
        state.error = null;
        state.isDataLoaded = true;
      })
      .addCase(getDataUser.fulfilled, (state, action) => {
        state.isAuthTokenChecked = true;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.isDataLoaded = false;
      })
      .addCase(getDataUser.rejected, (state, action) => {
        state.isAuthTokenChecked = true;
        state.isAuthenticated = false;
        state.error = action.error.message || API_ERROR;
        state.isDataLoaded = false;
      })
      // Обновление данных пользователя
      .addCase(updateDataUser.pending, (state) => {
        state.error = null;
        state.isDataLoaded = true;
      })
      .addCase(updateDataUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isDataLoaded = false;
      })
      .addCase(updateDataUser.rejected, (state, action) => {
        state.error = action.error.message || API_ERROR;
        state.isDataLoaded = false;
      })
      // Выход пользователя из приложения
      .addCase(userLogout.pending, (state) => {
        state.error = null;
        state.isDataLoaded = true;
      })
      .addCase(userLogout.fulfilled, (state) => {
        state.isAuthTokenChecked = false;
        state.isAuthenticated = false;
        state.user = null;
        state.isDataLoaded = false;
      })
      .addCase(userLogout.rejected, (state, action) => {
        state.error = action.error.message || API_ERROR;
        state.isDataLoaded = false;
      });
  }
});

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (dataUser: TRegisterData, { rejectWithValue }) => {
    const response = await registerUserApi(dataUser);
    if (!response.success) {
      return rejectWithValue(response);
    }
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response;
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (dataUser: Omit<TRegisterData, 'name'>, { rejectWithValue }) => {
    const response = await loginUserApi(dataUser);
    if (!response.success) {
      return rejectWithValue(response);
    }
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response;
  }
);

export const getDataUser = createAsyncThunk(
  'user/getDataUser',
  async (_, { rejectWithValue }) => {
    const response = await getUserApi();
    if (!response.success) {
      return rejectWithValue(response);
    }
    return response;
  }
);

export const updateDataUser = createAsyncThunk(
  'user/updateDataUser',
  async (dataUser: Partial<TRegisterData>, { rejectWithValue }) => {
    const response = await updateUserApi(dataUser);
    if (!response.success) {
      return rejectWithValue(response);
    }
    return response;
  }
);

export const userLogout = createAsyncThunk(
  'user/userLogout',
  async (_, { rejectWithValue }) => {
    const response = await logoutApi();
    if (!response.success) {
      return rejectWithValue(response);
    }
    deleteCookie('accessToken');
    localStorage.clear();
  }
);

export const {
  selectUser,
  selectIsAuthTokenChecked,
  selectIsAuthenticated,
  selectUserError,
  selectIsUserDataLoaded
} = userSlice.selectors;

export const { removeError } = userSlice.actions;

export const userSliceReducer = userSlice.reducer;
