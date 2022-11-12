import React from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import { useTranslate, useGetIdentity, useLogout, Title } from 'react-admin';
import ProfilePicture from './ProfilePicture';
import PersonalData, { PersonalDataSkeleton } from './PersonalData';
import Account, { AccountSkeleton } from './Account';
import DeleteAccount from './DeleteAccount';

const AVATAR_SIZE = '8rem';

const Profile = () => {
  const translate = useTranslate();
  const { identity, error, isLoading } = useGetIdentity();
  const logout = useLogout();

  if (error) {
    logout();
    return null;
  }

  return (
    <Card>
      <Title title={translate('profile.title')} />
      <Box
        sx={{
          margin: '1em',
          display: 'flex',
          flexDirection: 'column',
          gap: '2em',
          alignItems: {
            xs: 'center',
            sm: 'normal',
          },
        }}
      >
        {isLoading ? (
          <Skeleton
            variant="circular"
            width={AVATAR_SIZE}
            height={AVATAR_SIZE}
            animation="wave"
          />
        ) : (
          <ProfilePicture size={AVATAR_SIZE} identity={identity} />
        )}
        <Stack width="100%" padding="0 2rem">
          {identity ? (
            <PersonalData id={identity.id} />
          ) : (
            // should never happen, but just in case
            <Skeleton animation="wave" variant="rounded">
              <PersonalDataSkeleton />
            </Skeleton>
          )}
          {identity ? (
            <Account id={identity.id} />
          ) : (
            // should never happen, but just in case
            <Skeleton animation="wave" variant="rounded">
              <AccountSkeleton />
            </Skeleton>
          )}
          {identity ? (
            <DeleteAccount />
          ) : (
            // should never happen, but just in case
            <Skeleton animation="wave" variant="rounded">
              <DeleteAccount />
            </Skeleton>
          )}
        </Stack>
      </Box>
    </Card>
  );
};

export default Profile;
