import { FC, SyntheticEvent, useEffect, useState } from 'react';

import { useDispatch, useSelector } from '@store';
import { ProfileUI } from '@ui-pages';
import { selectUser, updateDataUser } from '@slices';
import { TUser } from '@utils-types';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser) as TUser;

  const [formValue, setFormValue] = useState({
    name: user.name,
    email: user.email,
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    const data = {
      email: formValue.email,
      password: formValue.password,
      name: formValue.name
    };
    dispatch(updateDataUser(data));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name,
      email: user?.email,
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
