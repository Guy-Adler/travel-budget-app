import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import type { Schema } from '@/src/types/schema';

interface TripCardProps {
  trip: Schema['trips'];
}

const TripCard: React.FC<TripCardProps> = ({ trip }) => (
  <Card>
    <CardContent>
      <Typography variant="h5">{trip.name}</Typography>
      <Typography variant="body2">
        <>Created at {trip.created_at}</>
      </Typography>
      <Typography variant="body2">
        <>Last Updated at {trip.updated_at}</>
      </Typography>
    </CardContent>
  </Card>
);

export default TripCard;
