import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import { useRedirect } from 'react-admin';
import type { Schema } from '@/src/types/schema';
import MetaView from './MetaView';

interface TripCardProps {
  trip: Schema['trips'];
}

const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  const redirect = useRedirect();

  return (
    <Card sx={{ height: '100%' }} elevation={3}>
      <CardActionArea sx={{ height: '100%' }}>
        <CardContent
          sx={{ height: '100%' }}
          onClick={() => redirect('show', 'trips', trip.id)}
        >
          <Typography variant="h5">{trip.trip_name}</Typography>
          <MetaView trip={trip} />
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default TripCard;
