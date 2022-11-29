import React, { useState } from 'react';
import {
  List,
  Pagination,
  TopToolbar,
  ExportButton,
} from 'react-admin';
import TripsIterator from './TripsIterator';
import Empty from './Empty';
import CreateTrip from './CreateTrip';
import DialogContext from './DialogContext';
import CreateButton from './CreateButton';

const TripsActions = () => (
  <TopToolbar>
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

const TripList = () => {
  const dialogState = useState(false);

  return (
    <DialogContext.Provider value={dialogState}>
      <List
        empty={<Empty />}
        emptyWhileLoading
        sort={{ field: 'updated_at', order: 'DESC' }}
        actions={<TripsActions />}
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
