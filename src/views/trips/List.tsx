import React, { useState } from 'react';
import {
  List,
  TopToolbar,
  ExportButton,
  SortButton,
  FilterButton,
  NullableBooleanInput,
  TextInput,
} from 'react-admin';
import TripsIterator from './TripsIterator';
import Empty from './Empty';
import CreateTrip from './CreateTrip';
import DialogContext from './DialogContext';
import CreateButton from './CreateButton';

const TripsActions = () => (
  <TopToolbar>
    <FilterButton disableSaveQuery />
    <SortButton fields={['trip_name', 'updated_at']} />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

const tripFilters = [
  <TextInput
    key={0}
    label="Search"
    source="q"
    alwaysOn
    sx={{ ml: 1.5 }} // To offset the margin reset of the grid (-12px on desktop)
  />,
  <NullableBooleanInput
    key={1}
    source="is_owner"
    label="Ownership"
    nullLabel="Both"
    falseLabel="Shared"
    trueLabel="Owned"
  />,
];

const TripList = () => {
  const dialogState = useState(false);

  return (
    <DialogContext.Provider value={dialogState}>
      <List
        filters={tripFilters}
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
