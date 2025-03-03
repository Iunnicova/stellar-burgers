import { FC } from 'react';
import { useLocation } from 'react-router-dom';

import { useDispatch } from '@store';
import { ProfileMenuUI } from '@ui';
import { userLogout } from '@slices';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(userLogout());
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
