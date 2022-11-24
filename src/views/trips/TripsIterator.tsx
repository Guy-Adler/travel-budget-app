import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { useListContext } from 'react-admin';
import type { Schema } from '@/src/types/schema';
import TripCard from './TripCard';
import CreateCard from './CreateCard';

function duplicate<T>(data: Array<T>): Array<T> {
  // TODO remove me im for testing
  return Array(20).fill(data).flat();
}

const TripsIterator = () => {
  const { data } = useListContext<Schema['trips']>();

  return (
    <Grid
      container
      disableEqualOverflow
      spacing={{ xs: 2, md: 3 }}
      columns={{ xs: 4, sm: 8, md: 12 }}
    >
      <CreateCard />
      {duplicate(data).map((trip) => (
        <Grid
          xs={2}
          sm={8 / 3} // 3 cols
          md={12 / 5} // 5 cols
          key={trip.id + Math.random()}
        >
          <TripCard trip={trip} />
        </Grid>
      ))}
    </Grid>
  );
};

export default TripsIterator;
