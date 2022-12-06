import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import CreatedIcon from '@mui/icons-material/Add';
import UpdatedIcon from '@mui/icons-material/Edit';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import { useTranslate } from 'react-admin';
import { formatRelative } from 'date-fns';
import useDateFNSLocale from '@/src/hooks/useDateFNSLocale';
import type { Schema } from '@/src/types/schema';
import client from '@/src/providers/supabase';
import { createIdentity } from '@/src/providers/auth';

interface TripCardProps {
  trip: Schema['trips'];
}

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 22,
  height: 22,
  border: `2px solid ${theme.palette.background.paper}`,
}));

const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  const locale = useDateFNSLocale();
  const translate = useTranslate();
  const ownerIdentity = createIdentity({
    id: trip.owner,
    first_name: trip.owner_first_name,
    last_name: trip.owner_last_name,
    avatar_url: trip.owner_avatar_url,
  });
  const updatedByIdentity = createIdentity({
    id: trip.updated_by,
    first_name: trip.updated_by_first_name,
    last_name: trip.updated_by_last_name,
    avatar_url: trip.updated_by_avatar_url,
  });

  return (
    <Card sx={{ height: '100%' }} elevation={3}>
      <CardActionArea sx={{ height: '100%' }}>
        <CardContent sx={{ height: '100%' }}>
          <Typography variant="h5">{trip.trip_name}</Typography>
          <Stack direction="row" alignItems="center" gap={1}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <SmallAvatar>
                  <CreatedIcon />
                </SmallAvatar>
              }
            >
              <Avatar alt={ownerIdentity.fullName} src={ownerIdentity.avatar} />
            </Badge>
            <Typography variant="body1">
              {translate('meta.created_at', {
                date: formatRelative(new Date(trip.created_at), new Date(), {
                  locale,
                  weekStartsOn: 0,
                }),
                name: trip.is_owner
                  ? translate('me')
                  : ownerIdentity.fullName ?? '',
                smart_count:
                  (trip.is_owner
                    ? translate('me')
                    : ownerIdentity.fullName ?? ''
                  ).length === 0
                    ? 0
                    : 1,
              })}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" gap={1}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <SmallAvatar>
                  <UpdatedIcon />
                </SmallAvatar>
              }
            >
              <Avatar
                alt={updatedByIdentity.fullName}
                src={updatedByIdentity.avatar}
              />
            </Badge>
            <Typography variant="body1">
              {translate('meta.last_updated_at', {
                date: formatRelative(new Date(trip.updated_at), new Date(), {
                  locale,
                  weekStartsOn: 0,
                }),
                name:
                  updatedByIdentity.id === client.auth.user()?.id
                    ? translate('me')
                    : updatedByIdentity.fullName ?? '',
                smart_count:
                  (trip.is_owner
                    ? translate('me')
                    : ownerIdentity.fullName ?? ''
                  ).length === 0
                    ? 0
                    : 1,
              })}
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default TripCard;
