import { FC } from 'react';

import { AppHeaderUI } from '@ui';
import { useSelector } from '@store';
import { selectUser } from '@slices';

export const AppHeader: FC = () => {
  const user = useSelector(selectUser);
  return <AppHeaderUI userName={user?.name ?? ''} />;
};
