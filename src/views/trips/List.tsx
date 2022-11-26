import React, { useState } from 'react';
import { List, Pagination } from 'react-admin';
import TripsIterator from './TripsIterator';
import Empty from './Empty';
import CreateTrip from './CreateTrip';
import DialogContext from './DialogContext';

const TripsPagination = () => <Pagination rowsPerPageOptions={[]} />;

const TripList = () => {
  const dialogState = useState(false);

  return (
    <DialogContext.Provider value={dialogState}>
      <List
        pagination={<TripsPagination />}
        empty={<Empty />}
        perPage={19}
        emptyWhileLoading
        sort={{ field: 'updated_at', order: 'DESC' }}
      >
        <TripsIterator />
      </List>
      <CreateTrip
        open={dialogState[0]}
        onClose={() => {
          dialogState[1](false);
        }}
      />
    </DialogContext.Provider>
  );
};

export default TripList;
