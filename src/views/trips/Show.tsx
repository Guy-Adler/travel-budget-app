import React from 'react';
import { Show, useRecordContext } from 'react-admin';
import type { Schema } from '@/types/schema';
import MetaView from './MetaView';

const TripTitle = () => {
  const record = useRecordContext<Schema['trips']>();

  if (!record) return null;
  return <span>{record.trip_name}</span>;
};

const Aside = () => {
  const record = useRecordContext<Schema['trips']>();

  return (
    <div style={{ width: '25%', maxWidth: 200, margin: '1em' }}>
      {
        record && <MetaView trip={record} />
      }
    </div>
  );
};

const TripShow: React.FC = () => (
  <Show title={<TripTitle />} aside={<Aside />}>
    <div>Here will be the expenses</div>
  </Show>
);

export default TripShow;
