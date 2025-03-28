import * as burgerApi from '../utils/burger-api';
import * as cookie from '@utils-cookie';
import { refreshToken, updateUserApi } from '@api';

const URL = 'https://norma.nomoreparties.space/api';
const mockRefreshToken = 'mockRefreshToken';
const mockAccessToken = 'mockAccessToken';
const mockUser = { name: 'John Doe', email: 'johndoe@example.com' };

describe('refreshToken', () => {
  let setCookieSpy: jest.SpyInstance<any, any>;

  beforeEach(() => {
    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: jest.fn(() => mockRefreshToken),
        setItem: jest.fn()
      },
      writable: true
    });

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          refreshToken: 'newRefreshToken',
          accessToken: 'newAccessToken'
        })
    }) as jest.Mock;

    setCookieSpy = jest.spyOn(cookie, 'setCookie').mockImplementation(() => {});
  });

  afterEach(() => {
    setCookieSpy?.mockRestore();
  });

  test('should refresh token successfully', async () => {
    const result = await burgerApi.refreshToken();
    expect(global.fetch).toHaveBeenCalledWith(`${URL}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        token: mockRefreshToken
      })
    });

    expect(localStorage.getItem).toHaveBeenCalled();
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'refreshToken',
      'newRefreshToken'
    );

    expect(result).toEqual({
      success: true,
      refreshToken: 'newRefreshToken',
      accessToken: 'newAccessToken'
    });
  });
});

test('should handle error if refresh is not successful', async () => {
  const mockError = { success: false, message: 'Invalid token' };

  Object.defineProperty(global, 'localStorage', {
    value: {
      getItem: jest.fn(() => null),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      key: jest.fn(),
      length: 0
    },
    writable: true
  });
  global.fetch = jest.fn().mockRejectedValue(mockError) as jest.Mock;
  await expect(burgerApi.refreshToken()).rejects.toEqual(mockError);
  expect(localStorage.setItem).not.toHaveBeenCalled();
});

describe('updateUserApi', () => {
  let fetchWithRefreshSpy: jest.SpyInstance<any, any>;
  let getCookieSpy: jest.SpyInstance<any, any>;

  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({})
    }) as jest.Mock;
    fetchWithRefreshSpy = jest.spyOn(burgerApi, 'fetchWithRefresh');
    getCookieSpy = jest
      .spyOn(cookie, 'getCookie')
      .mockReturnValue(mockAccessToken);
  });

  afterEach(() => {
    fetchWithRefreshSpy.mockRestore();
    getCookieSpy.mockRestore();
  });

  test('should update user successfully', async () => {
    const mockResponse = {
      success: true,
      user: mockUser
    };
    fetchWithRefreshSpy.mockResolvedValue(mockResponse);
    const result = await burgerApi.updateUserApi(mockUser);
    expect(fetchWithRefreshSpy).toHaveBeenCalledWith(`${URL}/auth/user`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        authorization: `Bearer ${mockAccessToken}`
      },
      body: JSON.stringify(mockUser)
    });
    expect(result).toEqual(mockResponse);
  });

  test('should handle error if update is not successful', async () => {
    const mockErrorResponse = {
      success: false,
      message: 'Invalid data'
    };
    fetchWithRefreshSpy.mockRejectedValue(mockErrorResponse);
    await expect(burgerApi.updateUserApi(mockUser)).rejects.toEqual(
      mockErrorResponse
    );
  });
});
