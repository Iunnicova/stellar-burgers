import { ReactNode } from 'react';

export type TPrivateRoute = {
  onlyUnauthorized?: boolean;
  children: ReactNode;
};
