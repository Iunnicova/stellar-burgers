import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';

import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { TAppHeaderUIProps } from './type';

import styles from './app-header.module.css';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <NavLink
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.link_active}` : `${styles.link}`
          }
          to='/'
        >
          {({ isActive }) => (
            <>
              <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
              <p className='text text_type_main-default ml-2 mr-10'>
                Конструктор
              </p>
            </>
          )}
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.link_active}` : `${styles.link}`
          }
          to='/feed'
        >
          {({ isActive }) => (
            <>
              <ListIcon type={isActive ? 'primary' : 'secondary'} />
              <p className='text text_type_main-default ml-2'>Лента заказов</p>
            </>
          )}
        </NavLink>
      </div>
      <NavLink to='/' className={styles.logo}>
        <Logo className='' />
      </NavLink>
      <NavLink
        to='/profile'
        className={({ isActive }) =>
          isActive
            ? `${styles.link} ${styles.link_position_last} ${styles.link_active}`
            : `${styles.link} ${styles.link_position_last}`
        }
      >
        {({ isActive }) => (
          <>
            <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
            <p data-cy='user-name' className='text text_type_main-default ml-2'>
              {userName || 'Личный кабинет'}
            </p>
          </>
        )}
      </NavLink>
    </nav>
  </header>
);
