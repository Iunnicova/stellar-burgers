import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '@store';
import {
  selectAllOrders,
  selectTotalOrders,
  selectTotalOrdersToday
} from '@slices';

// const getOrders = (orders: TOrder[], status: string): number[] =>
//   orders
//     .filter((item) => item.status === status)
//     .map((item) => item.number)
//     .slice(0, 20);

const getOrders = (orders: TOrder[], status: string): number[] => {
  const result: number[] = [];
  for (const item of orders) {
    if (item.status === status) {
      result.push(item.number);
      if (result.length >= 20) {
        break; // Ранний выход, если достигнут лимит для оптимизации. (надо не забыть попробовать с реселектом в слайсе)
      }
    }
  }
  return result;
};

export const FeedInfo: FC = () => {
  const orders: TOrder[] = useSelector(selectAllOrders);
  const totalOrders = useSelector(selectTotalOrders);
  const totalOrdersToday = useSelector(selectTotalOrdersToday);

  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={{ total: totalOrders, totalToday: totalOrdersToday }}
    />
  );
};
