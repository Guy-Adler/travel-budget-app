import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { useListContext } from 'react-admin';
import type { Schema } from '@/types/schema';
import TripCard from './TripCard';

const TripsIterator = () => {
  const { data } = useListContext<Schema['trips']>();
  return (
    <Grid
      container
      spacing={{ xs: 2, md: 3 }}
      columns={{ xs: 4, sm: 8, md: 12 }}
      margin={0}
      height="100%"
      width="100%"
    >
      {data.map((trip) => (
        <Grid
          sm={4} // 2 cols
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
