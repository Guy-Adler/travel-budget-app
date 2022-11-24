import React from 'react';
import { List, Pagination } from 'react-admin';
import TripsIterator from './TripsIterator';

const TripsPagination = () => <Pagination rowsPerPageOptions={[]} />;

const TripList = () => (
  <List pagination={<TripsPagination />} perPage={19} emptyWhileLoading sort={{ field: 'updated_at', order: 'DESC' }}>
    <TripsIterator />
  </List>
);

export default TripList;
