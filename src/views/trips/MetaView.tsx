import React from 'react';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CreatedIcon from '@mui/icons-material/Add';
import UpdatedIcon from '@mui/icons-material/Edit';
import { styled } from '@mui/material/styles';
import { formatRelative } from 'date-fns';
import { useTranslate } from 'react-admin';
import useDateFNSLocale from '@/hooks/useDateFNSLocale';
import { createIdentity } from '@/providers/auth';
import client from '@/providers/client';
import type { Schema } from '@/types/schema';

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 22,
  height: 22,
  border: `2px solid ${theme.palette.background.paper}`,
}));

const MetaView: React.FC<{ trip: Schema['trips'] }> = ({ trip }) => {
  const translate = useTranslate();
  const locale = useDateFNSLocale();

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
    <Stack gap={2}>
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
              (trip.is_owner ? translate('me') : ownerIdentity.fullName ?? '')
                .length === 0
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
              (trip.is_owner ? translate('me') : ownerIdentity.fullName ?? '')
                .length === 0
                ? 0
                : 1,
          })}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default MetaView;
