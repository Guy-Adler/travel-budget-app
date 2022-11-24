import React from 'react';
import { List } from 'react-admin';
import TripsIterator from './TripsIterator';

const TripList = () => (
  <List emptyWhileLoading sort={{ field: 'updated_at', order: 'DESC' }}>
    <TripsIterator />
  </List>
);

export default TripList;
