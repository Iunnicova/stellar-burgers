import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '@store';
import {
  selectIsAuthenticated,
  selectBun,
  selectIngredientConstructor,
  selectIsOrdersLoaded,
  clearBurgerConstructor,
  selectOrder,
  createNewOrder,
  clearOrderState
} from '@slices';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const ingredients = useSelector(selectIngredientConstructor);
  const bun = useSelector(selectBun);
  const orderRequest = useSelector(selectIsOrdersLoaded);
  const orderModalData = useSelector(selectOrder);

  const constructorItems = {
    bun: bun,
    ingredients: ingredients
  };

  const { bun: constructorBun, ingredients: constructorIngredients } =
    constructorItems;

  const onOrderClick = () => {
    if (!isAuthenticated) return navigate('/login');
    if (!constructorBun || orderRequest) return;

    const ingredients = constructorIngredients.map(
      (ingredient: TConstructorIngredient) => ingredient._id
    );
    const newOrder: string[] = [
      constructorBun._id,
      ...ingredients,
      constructorBun._id
    ];

    dispatch(createNewOrder(newOrder));
  };

  const closeOrderModal = () => {
    dispatch(clearOrderState());
    dispatch(clearBurgerConstructor());
  };

  const price = useMemo(
    () =>
      (constructorBun ? constructorBun.price * 2 : 0) +
      constructorIngredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorBun, constructorIngredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
