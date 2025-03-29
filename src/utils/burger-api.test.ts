import * as burgerApi from '../utils/burger-api';
import * as cookie from '@utils-cookie';
import { checkResponse, getFeedsApi, updateUserApi } from '@api';
import { setCookie } from '@utils-cookie';

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

  // test('should handle JSON parsing errors during error handling', async () => {
  //   const mockResponse = {
  //     ok: false,
  //     json: jest.fn().mockRejectedValue(new Error('JSON parsing failed'))
  //   } as unknown as Response;

  //   await expect(checkResponse<any>(mockResponse)).rejects.toThrowError(
  //     'JSON parsing failed'
  //   );
  //   expect(mockResponse.json).toHaveBeenCalled();
  // });

  // test('should handle JSON parsing errors during success handling', async () => {
  //   const mockResponse = {
  //     ok: true,
  //     json: jest.fn().mockRejectedValue(new Error('JSON parsing failed'))
  //   } as unknown as Response;

  //   await expect(checkResponse<any>(mockResponse)).rejects.toThrowError(
  //     'JSON parsing failed'
  //   );
  //   expect(mockResponse.json).toHaveBeenCalled();
  // });
  //   //******* */

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

  test('следует обработать ошибки во время обновления токена и повторно выдать сообщение об ошибке', async () => {
    jest.resetModules();
    (localStorage.getItem as jest.Mock).mockReturnValue('mockRefreshToken');
    const mockError = new Error('Token refresh failed');
    (global.fetch as jest.Mock).mockRejectedValue(mockError);
    const { refreshToken } = require('./burger-api');
    await expect(refreshToken()).rejects.toThrowError(mockError);
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    try {
      await refreshToken();
    } catch (e) {}
    expect(consoleSpy).toHaveBeenCalledWith(
      'Ошибка при обновлении токена:',
      mockError
    );
    consoleSpy.mockRestore();
  });

  // test('should handle errors when checkResponse fails', async () => {
  //   jest.resetModules();
  //   (localStorage.getItem as jest.Mock).mockReturnValue('mockRefreshToken');
  //   const mockError = new Error('checkResponse failed');
  //   (global.fetch as jest.Mock).mockResolvedValue({
  //     ok: false,
  //     json: jest.fn().mockRejectedValue(mockError)
  //   } as unknown as Response);
  //   const { refreshToken } = require('./burger-api');
  //   await expect(refreshToken()).rejects.toThrowError(mockError);
  //   const consoleSpy = jest
  //     .spyOn(console, 'error')
  //     .mockImplementation(() => {});
  //   try {
  //     await refreshToken();
  //   } catch (e) {}
  //   expect(consoleSpy).toHaveBeenCalledWith(
  //     'Ошибка при обновлении токена:',
  //     mockError
  //   );
  //   consoleSpy.mockRestore();
  // });
  //********** */

  //49-57

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

  //************* */

  //85-87
  // test('should handle errors when fetch fails', async () => {
  //   const mockError = new Error('Failed to fetch');
  //   (global.fetch as jest.Mock).mockRejectedValue(mockError);

  //   await expect(getIngredientsApi()).rejects.toThrowError(mockError);
  // });

  //88
  // test("должен возвращать данные при успешном ответе API", async () => {
  //   const mockResponse = { success: true, data: [{ id: "1", name: "Bun" }] };

  //   global.fetch = jest.fn(() =>
  //     Promise.resolve({
  //       ok: true,
  //       json: () => Promise.resolve(mockResponse),
  //     })
  //   ) as jest.Mock;

  //   const result = await getIngredientsApi();
  //   expect(result).toEqual(mockResponse.data);
  // });

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

  //*************** */

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

  //*
});
