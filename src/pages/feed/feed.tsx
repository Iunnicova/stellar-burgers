import { FC, useEffect } from 'react';

import { FeedUI } from '@ui-pages';
import { Preloader } from '@ui';
import { TOrder } from '@utils-types';
import { useSelector, useDispatch } from '@store';
import { selectAllOrders, getAllOrdersData, selectIsFeedLoaded } from '@slices';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectAllOrders);
  const isLoaded: boolean = useSelector(selectIsFeedLoaded);

  const handleGetFeeds = () => {
    dispatch(getAllOrdersData());
  };

  useEffect(() => {
    handleGetFeeds();
  }, [dispatch]);

  if (!orders.length || isLoaded) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
