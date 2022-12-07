import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import PeopleIcon from '@mui/icons-material/People';
import DeleteIcon from '@mui/icons-material/Delete';
import { Show, useRecordContext, useTranslate } from 'react-admin';
import type { Schema } from '@/types/schema';
import MetaView from './MetaView';

const TripTitle = () => {
  const record = useRecordContext<Schema['trips']>();

  if (!record) return null;
  return <span>{record.trip_name}</span>;
};

const Aside = () => {
  const record = useRecordContext<Schema['trips']>();
  const translate = useTranslate();

  if (!record) {
    return <div style={{ width: '25%', maxWidth: 200, margin: '1em' }} />;
  }

  return (
    <Stack gap={3} style={{ width: '25%', maxWidth: 200, margin: '1em' }}>
      <MetaView trip={record} />
      {record.can_edit && (
        <>
          <Button startIcon={<EditIcon />} variant="contained">
            {translate('ra.action.edit')}
          </Button>
          <Button startIcon={<PeopleIcon />} variant="outlined">
            {translate('action.share')}
          </Button>
        </>
      )}
      <Button startIcon={<DeleteIcon />} variant="outlined" color="error">
        {translate('ra.action.delete')} { /* Delete if owner, remove share if shared. */}
      </Button>
    </Stack>
  );
};

const TripShow: React.FC = () => (
  <Show title={<TripTitle />} aside={<Aside />}>
    <div>Here will be the expenses</div>
  </Show>
);

export default TripShow;
