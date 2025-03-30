import {
  localUrl,
  apiUrlIngredients,
  user,
  selectedIngredients,
  topBun,
  bottomBun,
  toppings,
  sauces,
  buns,
  modal,
  modalOverlay,
  closeModalButton,
  orderButton,
  orderNumber
} from './burgerConstructorConstants';

function setupApp() {
  cy.intercept('GET', apiUrlIngredients, { fixture: 'ingredients.json' }).as(
    'getIngredients'
  );
  cy.visit(localUrl);
  cy.wait('@getIngredients');
}

function checkModalIsOpen() {
  cy.contains('Детали ингредиента').should('exist');
  cy.get('#modals')
    .contains('Филе Люминесцентного тетраодонтимформа')
    .should('exist');
}

function addIngredients() {
  cy.get(buns).contains('Добавить').click();
  cy.get(toppings).contains('Добавить').click();
  cy.get(sauces).contains('Добавить').click();
}

describe('Приложение должно быть доступно и функционально', () => {
  beforeEach(() => {
    setupApp();
  });

  it('Добавление соуса должно отражаться в конструкторе', () => {
    cy.get(sauces).contains('Добавить').click();
    cy.get(selectedIngredients).contains('Соус Spicy-X').should('exist');
  });

  it('Добавление начинки должно отражаться в конструкторе', () => {
    cy.get(toppings).contains('Добавить').click();
    cy.get(selectedIngredients)
      .contains('Биокотлета из марсианской Магнолии')
      .should('exist');
  });

  it('Добавление булки должно отражаться в конструкторе', () => {
    cy.get(buns).contains('Добавить').click();
    cy.get(topBun).contains('Краторная булка N-200i').should('exist');
    cy.get(bottomBun).contains('Краторная булка N-200i').should('exist');
  });
});

describe('Проверка работы модального окна', () => {
  beforeEach(() => {
    setupApp();
    cy.contains('Детали ингредиента').should('not.exist');
    cy.contains('Филе Люминесцентного тетраодонтимформа').click();
    checkModalIsOpen();
  });

  it('Модальное окно должно закрываться при нажатии на кнопку закрытия', () => {
    cy.get(closeModalButton).click();
    cy.contains('Детали ингредиента').should('not.exist');
  });

  it('Клик вне модального окна должен приводить к его закрытию', function () {
    cy.get(modal).should('exist');
    cy.get(modalOverlay).should('exist').click('topLeft', { force: true });
    cy.get(modal).should('not.exist');
  });
});

describe('Тесты оформления заказа', () => {
  beforeEach(() => {
    setupApp();
    cy.intercept('GET', 'api/auth/user', { fixture: 'userData.json' }).as(
      'getAuthUser'
    );
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as(
      'postOrder'
    );
    window.localStorage.setItem(
      'refreshToken',
      JSON.stringify('mock-refresh-token')
    );
    cy.setCookie('accessToken', 'test-access-token');
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('Имя пользователя должно отображаться на странице', () => {
    cy.wait('@getAuthUser');
    cy.get(user).contains('JaneDoe');
  });

  it('При нажатии на кнопку "Оформить заказ" создается заказ', () => {
    addIngredients();
    cy.get(orderButton).click();
    cy.wait('@postOrder');
    cy.get(orderNumber).contains('7').should('exist');
  });

  it('Модальное окно с номером заказа закрывается при нажатии на кнопку закрытия', () => {
    addIngredients();
    cy.get(orderButton).click();
    cy.get(closeModalButton).click();
    cy.get(orderNumber).should('not.exist');
  });

  it('После оформления заказа конструктор очищается', () => {
    addIngredients();
    cy.get(orderButton).click();
    cy.get(closeModalButton).click();
    const ingredientsList = `${selectedIngredients} .element`;
    cy.get(ingredientsList).should('have.length', 0);
  });
});
