import { FC, SyntheticEvent, useState } from 'react';

import { useDispatch, useSelector } from '@store';
import { registerUser, selectUserError } from '@slices';
import { RegisterUI } from '@ui-pages';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const error = useSelector(selectUserError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const data = {
      email: email,
      name: userName,
      password: password
    };
    dispatch(registerUser(data));
  };

  return (
    <RegisterUI
      errorText={error ?? ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
