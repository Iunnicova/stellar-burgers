import { FC } from 'react';
import { useParams } from 'react-router-dom';

import { IngredientDetailsUI, Preloader } from '@ui';
import { useSelector } from '@store';
import { selectIngredients } from '@slices';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const ingredients = useSelector(selectIngredients);

  const ingredientData = ingredients.find((item) => item._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
