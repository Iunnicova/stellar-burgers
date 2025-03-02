import { FC, SyntheticEvent, useState } from 'react';

import { useDispatch, useSelector } from '@store';
import { loginUser, selectUserError } from '@slices';
import { LoginUI } from '@ui-pages';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const error = useSelector(selectUserError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const data = {
      email: email,
      password: password
    };
    dispatch(loginUser(data));
  };

  return (
    <LoginUI
      errorText={error ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
