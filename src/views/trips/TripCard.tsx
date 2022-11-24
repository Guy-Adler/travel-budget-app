import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useTranslate } from 'react-admin';
import { formatRelative } from 'date-fns';
import useDateFNSLocale from '@/src/hooks/useDateFNSLocale';
import type { Schema } from '@/src/types/schema';

interface TripCardProps {
  trip: Schema['trips'];
}

const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  const locale = useDateFNSLocale();
  const translate = useTranslate();

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{trip.trip_name}</Typography>
        <Typography variant="body2">
          {translate('meta.created_at', {
            date: formatRelative(new Date(trip.created_at), new Date(), {
              locale,
              weekStartsOn: 0,
            }),
          })}
        </Typography>
        <Typography variant="body2">
          {translate('meta.last_updated_at', {
            date: formatRelative(new Date(trip.updated_at), new Date(), {
              locale,
              weekStartsOn: 0,
            }),
          })}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TripCard;
