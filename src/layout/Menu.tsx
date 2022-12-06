import React, { useRef, useCallback, useEffect } from 'react';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import SharedIcon from '@mui/icons-material/People';
import TripIcon from '@mui/icons-material/Luggage';
import { Menu, useInfiniteGetList } from 'react-admin';
import type { Schema } from '@/src/types/schema';

const CustomMenu: React.FC = () => {
  const {
    data,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteGetList<Schema['trips']>('trips', {
    sort: {
      field: 'updated_at',
      order: 'DESC',
    }
  });
  const observerElem = useRef(null);

  const handleObserver = useCallback<IntersectionObserverCallback>(
    (entries) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage]
  );
  useEffect(() => {
    const element = observerElem.current;
    if (!element) return () => undefined;
    const option = { threshold: 0 };
    const observer = new IntersectionObserver(handleObserver, option);
    observer.observe(element);
    return () => observer.unobserve(element);
  }, [fetchNextPage, hasNextPage, handleObserver]);

  return (
    <Menu>
      <Menu.DashboardItem />
      <Divider variant="middle" />
      {
        data?.pages.map((page) => (
          page.data.map((trip) => (
            <Menu.Item key={trip.id} to={`trips/${trip.id}`} primaryText={trip.trip_name} leftIcon={trip.is_owner ? <TripIcon /> : <SharedIcon />} />
          ))
        ))
      }
      <Typography ref={observerElem} variant="body2" color="grey.500" >
        {isFetchingNextPage && hasNextPage
          ? 'Loading...'
          : ''}
      </Typography>
    </Menu>
  );
};

export default CustomMenu;
