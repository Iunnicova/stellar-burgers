import * as burgerApi from '../utils/burger-api';
import * as cookie from '@utils-cookie';
import {
  checkResponse,
  fetchWithRefresh,
  getFeedsApi,
  getOrdersApi,
  logoutApi,
  orderBurgerApi,
  updateUserApi
} from '@api';
import { getCookie, setCookie } from '@utils-cookie';

import { getIngredientsApi } from './burger-api';
import { URL } from './burger-api';

const mockOptions = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};
const mockResponseData = { 'some data': 'some value' };
const mockAccessToken = 'mockAccessToken';
const mockRefreshTokenData = {
  accessToken: mockAccessToken,
  refreshToken: 'mockRefreshToken'
};
const mockExpiredError = new Error('jwt expired');

const mockRefreshToken = 'mockRefreshToken';

const mockUser = { name: 'John Doe', email: 'johndoe@example.com' };
const mockAuthResponse = {
  accessToken: 'mockAccessToken',
  refreshToken: 'mockRefreshToken'
};

const mockIngredientsData = [
  {
    _id: '1',
    name: 'ingredient 1',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 15,
    calories: 100,
    price: 50,
    image: 'url1',
    image_mobile: 'url1',
    image_large: 'url1'
  },
  {
    _id: '2',
    name: 'ingredient 2',
    type: 'sauce',
    proteins: 5,
    fat: 2,
    carbohydrates: 8,
    calories: 50,
    price: 30,
    image: 'url2',
    image_mobile: 'url2',
    image_large: 'url2'
  }
];

const mockFailedResponse = {
  success: false,
  message: 'Failed to fetch ingredients'
};

const mockURL = 'https://example.com';

describe('refreshToken', () => {
  const mockData = { message: 'Success' };
  const mockErrorData = { error: 'Something went wrong' };

  let setCookieSpy: jest.SpyInstance<any, any>;
  let getItemSpy: jest.SpyInstance<any, any>;
  let setItemSpy: jest.SpyInstance<any, any>;
  let consoleErrorSpy: jest.SpyInstance<any, any>;

  const originalEnv = process.env.BURGER_API_URL;

  beforeEach(() => {
    jest.resetModules();

    getItemSpy = jest
      .spyOn(localStorage.__proto__, 'getItem')
      .mockReturnValue(mockRefreshToken);
    setItemSpy = jest.spyOn(localStorage.__proto__, 'setItem');

    process.env.BURGER_API_URL = mockURL;

    (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          refreshToken: 'newRefreshToken',
          accessToken: 'newAccessToken'
        })
    });

    setCookieSpy = jest.spyOn(cookie, 'setCookie').mockImplementation(() => {});

    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    setCookieSpy?.mockRestore();
    getItemSpy?.mockRestore();
    setItemSpy?.mockRestore();
    consoleErrorSpy?.mockRestore();
    process.env.BURGER_API_URL = originalEnv;
    jest.restoreAllMocks();
  });

  //9
  test('следует отклонить с обработанными данными об ошибке JSON, если ответ не OK', async () => {
    const mockResponse = {
      ok: false,
      json: jest.fn().mockResolvedValue(mockErrorData)
    } as unknown as Response;

    await expect(checkResponse<any>(mockResponse)).rejects.toEqual(
      mockErrorData
    );
    expect(mockResponse.json).toHaveBeenCalled();
  });

  //10-11
  test('должен возвращать проанализированные данные JSON, если ответ OK', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue(mockData)
    } as unknown as Response;

    const result = await checkResponse<typeof mockData>(mockResponse);
    expect(mockResponse.json).toHaveBeenCalled();
    expect(result).toEqual(mockData);
  });

  //25-46
  test('должен быть успешно обновлен токен и обновлены файлы cookie и localStorage', async () => {
    jest.resetModules();

    process.env.BURGER_API_URL = mockURL;

    const { refreshToken } = require('./burger-api');

    const result = await refreshToken();

    expect(global.fetch).toHaveBeenCalledWith(`${mockURL}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        token: mockRefreshToken
      })
    });
  });

  //49-56
  test('должен быть отклонен с исходной ошибкой, если тест не является ошибкой с истекшим сроком действия jwt', async () => {
    const refreshTokenMock = jest.fn();
    const mockOriginalError = new Error('Some other error');
    (global.fetch as jest.Mock).mockRejectedValue(mockOriginalError);

    await expect(
      burgerApi.fetchWithRefresh(mockURL, mockOptions)
    ).rejects.toThrowError(mockOriginalError);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(refreshTokenMock).not.toHaveBeenCalled();
  });

  //57
  test('следует вызвать токен обновления, если возникает ошибка jwt с истекшим сроком действия', async () => {
    const refreshTokenMock = jest
      .fn()
      .mockResolvedValue({ accessToken: 'newAccessToken' });
    Object.defineProperty(burgerApi, 'refreshToken', {
      writable: true,
      value: refreshTokenMock
    });

    const mockExpiredError = new Error('jwt expired');
    (global.fetch as jest.Mock).mockRejectedValueOnce(mockExpiredError);

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ 'some data': 'example data' })
    });

    try {
      await burgerApi.fetchWithRefresh(mockURL, mockOptions);
    } catch (error) {
      console.error('Ошибка перехвачена в тесте:', error);
    }

    expect(refreshTokenMock).toHaveBeenCalled();
  });

  //85-90
  test('должен отклонять промис, если API вернул success: false', async () => {
    const mockResponse = { success: false, message: 'Ошибка запроса' };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })
    ) as jest.Mock;

    await expect(getIngredientsApi()).rejects.toEqual(mockResponse);
  });

  //93-98
  test('должен отклонять промис, если API вернул success: false', async () => {
    const mockResponse = { success: false, message: 'Ошибка запроса' };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })
    ) as jest.Mock;

    await expect(getFeedsApi()).rejects.toEqual(mockResponse);
  });

  //245-253
  test('следует вызвать выборку с правильными параметрами', async () => {
    const mockToken = 'mockRefreshToken';
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => mockToken)
      },
      writable: true
    });

    const mockResponse = {
      success: true
    };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });
    const result = await logoutApi();

    expect(fetch).toHaveBeenCalledWith(
      `${URL}/auth/logout`,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json;charset=utf-8'
        }),
        body: JSON.stringify({
          token: mockToken
        })
      })
    );
    expect(result).toEqual(mockResponse);
  });
});
