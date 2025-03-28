import {
  createAsyncThunk,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';

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

export type TUserSliceState = {
  user: TUser | null;
  isAuthTokenChecked: boolean;
  isAuthenticated: boolean;
  error: string | null | undefined;
  isDataLoaded: boolean;
};

export const initialState: TUserSliceState = {
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
        state.error = (action.payload as string) || null;
        state.isAuthenticated = false;
        state.user = null;
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
        const payload = action.payload as { message?: string } | undefined;
        state.error = payload?.message || 'Login failed';
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
        state.error = action.payload ?? 'Logout failed';
        state.isAuthenticated = false;
      });
  }
});

export default userSlice.reducer;

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (
    userData: { email: string; password: string; name: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await registerUserApi(userData);

      if (!response.success) {
        return rejectWithValue(response);
      }

      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      return response;
    } catch (error: any) {
      console.error(' registerUser error:', error);
      return rejectWithValue(error?.message || 'Unknown error');
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (dataUser: Omit<TRegisterData, 'name'>, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(dataUser);

      if (!response.success) {
        return rejectWithValue({ message: response.message || 'Login failed' });
      }

      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      return response;
    } catch (error) {
      return rejectWithValue({
        message: (error as Error).message || 'Login failed'
      });
    }
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

export const userLogout = createAsyncThunk<
  string,
  void,
  { rejectValue: string }
>('user/userLogout', async (_, { rejectWithValue }) => {
  try {
    const response: { success: boolean; message?: string } = await logoutApi();

    if (!response.success) {
      return rejectWithValue(response.message || 'Logout failed');
    }

    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');

    return 'Logout successful';
  } catch (error: any) {
    return rejectWithValue(error.message || 'Logout failed');
  }
});

const selectUserSlice = (state: any) => state.user;

export const selectUser = createSelector(
  [selectUserSlice],
  (userSlice) => userSlice.user
);
export const selectIsAuthTokenChecked = createSelector(
  [selectUserSlice],
  (userSlice) => userSlice.isAuthTokenChecked
);
export const selectIsAuthenticated = createSelector(
  [selectUserSlice],
  (userSlice) => userSlice.isAuthenticated
);
export const selectUserError = createSelector(
  [selectUserSlice],
  (userSlice) => userSlice.error
);
export const selectIsUserDataLoaded = createSelector(
  [selectUserSlice],
  (userSlice) => userSlice.isDataLoaded
);

export const { removeError } = userSlice.actions;

export const userSliceReducer = userSlice.reducer;
