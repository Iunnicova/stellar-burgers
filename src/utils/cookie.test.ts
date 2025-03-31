import { setCookie, getCookie, deleteCookie } from '@utils-cookie';

beforeAll(() => {
  Object.defineProperty(window, 'location', {
    value: {
      ...window.location,
      pathname: '/test'
    }
  });
});

test('установленный файл cookie должен правильно обрабатывать путь', () => {
  setCookie('pathCookie', 'pathTestValue', { path: '/' });
  const cookies = document.cookie.split(';');
  const cookie = cookies.find((c) => c.trim().startsWith('pathCookie'));
  expect(cookie).toBeDefined();
  expect(cookie).toContain('pathCookie=pathTestValue');
});

describe('Функции использования файлов cookie', () => {
  beforeEach(() => {
    document.cookie = '';
  });

  test('установить файл cookie необходимо правильно установить файл cookie', () => {
    setCookie('testCookie', 'testValue', { expires: 3600 });
    const cookie = getCookie('testCookie');
    expect(cookie).toBe('testValue');
  });

  test('getCookie должен возвращать правильное значение для существующего файла cookie', () => {
    document.cookie = 'existingCookie=existingValue';
    const cookieValue = getCookie('existingCookie');
    expect(cookieValue).toBe('existingValue');
  });

  test('getCookie должен возвращать undefined для несуществующего файла cookie', () => {
    const cookieValue = getCookie('nonExistingCookie');
    expect(cookieValue).toBeUndefined();
  });

  test('setCookie должен корректно обрабатывать файл cookie с логическим значением', () => {
    setCookie('boolCookie', 'true', { expires: 3600 });
    const cookie = getCookie('boolCookie');
    expect(cookie).toBe('true');
  });

  test(' установить файл cookie с датой истечения срока действия', () => {
    const expiresDate = new Date();
    expiresDate.setTime(expiresDate.getTime() + 1000 * 3600);
    setCookie('expireCookie', 'expireTestValue', { expires: expiresDate });
    const cookie = getCookie('expireCookie');
    expect(cookie).toBe('expireTestValue');
  });

  test('удалить файл cookie следует после удаления файла cookie', () => {
    setCookie('deleteCookie', 'deleteTestValue', { expires: 3600 });
    let cookie = getCookie('deleteCookie');
    expect(cookie).toBe('deleteTestValue');
    deleteCookie('deleteCookie');
    cookie = getCookie('deleteCookie');
    expect(cookie).toBeUndefined();
  });

  test('установленный файл cookie должен правильно обрабатывать путь', () => {
    setCookie('pathCookie', 'pathTestValue', { path: '/' });
    const cookies = document.cookie.split(';');
    const cookie = cookies.find((c) => c.trim().startsWith('pathCookie'));
    expect(cookie).toContain('pathCookie=pathTestValue');
  });
});
