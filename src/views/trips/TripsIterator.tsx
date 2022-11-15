import React, { useCallback } from 'react';
import Stack from '@mui/material/Stack';
import { useListContext } from 'react-admin';
import type { User } from '@supabase/supabase-js';
import client from '@/src/providers/supabase';
import type { Schema } from '@/src/types/schema';
import TripCard from './TripCard';

const TripsIterator = () => {
  const { data } = useListContext<Schema['trips']>();
  const { id } = client.auth.user() as User;

  const seperateTrips = useCallback(
    () =>
    [
      ...data,
      ...data,
      ...data,
      ...data,
      ...data,
      ...data,
      ...data,
      ...data,
      ...data,
    ].reduce(
        (res, trip) => {
          if (trip.owner === id) res.owned.push(trip);
          else res.shared.push(trip);
          return res;
        },
        {
          owned: [] as Schema['trips'][],
          shared: [] as Schema['trips'][],
        }
      ),
    [data, id]
  );

  return (
    <>
      <Stack
        gap="2rem"
        sx={{ padding: 2, maxWidth: '100%', flexWrap: 'wrap' }}
        direction="row"
      >
        {seperateTrips().owned.map((trip) => (
          <TripCard key={trip.id + Math.random()} trip={trip} />
        ))}
      </Stack>
      <hr />
      <Stack
        gap="2rem"
        sx={{ padding: 2, maxWidth: '100%', flexWrap: 'wrap' }}
        direction="row"
      >
        {seperateTrips().owned.map((trip) => (
          <TripCard key={trip.id + Math.random()} trip={trip} />
        ))}
      </Stack>
    </>
  );
};

export default TripsIterator;
