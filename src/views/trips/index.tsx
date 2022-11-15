import React from 'react';
import { List } from 'react-admin';
import TripsIterator from './TripsIterator';

const TripList = () => (
  <List emptyWhileLoading>
    <TripsIterator />
  </List>
);

export default TripList;
