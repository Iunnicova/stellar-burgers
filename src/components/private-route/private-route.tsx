import { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { TPrivateRoute } from './type';

export const PrivateRoute: FC<TPrivateRoute> = ({
  children,
  onlyUnauthorized
}) => {
  const isLoggedIn = true;
  const location = useLocation();
  // Если маршрут только для неавторизованных (onlyUnauthorized = true) и пользователь авторизован,
  // то перенаправляем его на главную страницу.
  if (onlyUnauthorized && isLoggedIn) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate to={from} replace />;
  }

  // Если маршрут требует авторизации (onlyUnauthorized = false) и пользователь не авторизован,
  // то перенаправляем его на страницу входа, сохраняя текущий URL.
  if (!onlyUnauthorized && !isLoggedIn) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
