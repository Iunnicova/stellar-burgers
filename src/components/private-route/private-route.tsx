import { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useSelector } from '@store';
import { selectUser, selectIsAuthTokenChecked } from '@slices';
import { TPrivateRoute } from './type';
import { Preloader } from '@ui';

export const PrivateRoute: FC<TPrivateRoute> = ({
  children,
  onlyUnauthorized
}) => {
  const location = useLocation();
  const user = useSelector(selectUser);
  const isAuthTokenChecked = useSelector(selectIsAuthTokenChecked);

  if (!isAuthTokenChecked) {
    return <Preloader />;
  }

  if (onlyUnauthorized && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate to={from} replace />;
  }

  if (!onlyUnauthorized && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
