import { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import {
  ConstructorPage,
  ProfileOrders,
  Profile,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Feed,
  NotFound404
} from '@pages';
import {
  AppHeader,
  OrderInfo,
  IngredientDetails,
  PrivateRoute,
  Modal
} from '@components';

import { getIngredients } from '@slices';
import { useDispatch } from '@store';

import styles from './app.module.css';
import '../../index.css';

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getIngredients());
  }, [dispatch]);

  const handleCloseModal = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <main className={styles.main}>
        <Routes>
          <Route path='/' element={<ConstructorPage />} />
          <Route path='/feed' element={<Feed />} />
          <Route
            path='/login'
            element={
              <PrivateRoute onlyUnauthorized>
                <Login />
              </PrivateRoute>
            }
          />
          <Route
            path='/register'
            element={
              <PrivateRoute onlyUnauthorized>
                <Register />
              </PrivateRoute>
            }
          />
          <Route
            path='/forgot-password'
            element={
              <PrivateRoute onlyUnauthorized>
                <ForgotPassword />
              </PrivateRoute>
            }
          />
          <Route
            path='/reset-password'
            element={
              <PrivateRoute onlyUnauthorized>
                <ResetPassword />
              </PrivateRoute>
            }
          />
          <Route
            path='/profile'
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path='/profile/orders'
            element={
              <PrivateRoute>
                <ProfileOrders />
              </PrivateRoute>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <PrivateRoute>
                <Modal title='' onClose={() => console.log()}>
                  <OrderInfo />
                </Modal>
              </PrivateRoute>
            }
          />

          <Route
            path='/feed/:number'
            element={
              <Modal title='Временно' onClose={handleCloseModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='' onClose={() => console.log()}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route path='*' element={<NotFound404 />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
