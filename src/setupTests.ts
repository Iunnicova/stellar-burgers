// // src/setupTests.ts
// // const util = require('util');

// // global.TextEncoder = util.TextEncoder as any;
// // global.TextDecoder = util.TextDecoder as any;

// // import jsdom from 'jsdom';
// // const { JSDOM } = jsdom;

// // // Сначала создаем JSDOM, но не трогаем document/window сразу
// // const dom = new JSDOM(
// //   '<!doctype html><html><body><div id="root"></div></body></html>'
// // );

// // // Функция для инициализации глобальных переменных
// // function initializeDOM() {
// //   global.document = dom.window.document;
// //   global.window = dom.window as any;
// //   global.navigator = {
// //     userAgent: 'node.js'
// //   } as any;
// // }

// // Вызываем инициализацию только после загрузки всего остального
// // initializeDOM();

// delete require.cache[require.resolve('jsdom')];

// const jsdom = require('jsdom');
// const { JSDOM } = jsdom;

// import { TextEncoder, TextDecoder } from 'util';

// global.TextEncoder = TextEncoder as any;
// global.TextDecoder = TextDecoder as any;

// const dom = new JSDOM(
//   '<!doctype html><html><body><div id="root"></div></body></html>'
// );
// global.document = dom.window.document;
// global.window = dom.window as any;
// global.navigator = {
//   userAgent: 'node.js'
// } as any;
