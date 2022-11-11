import React from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { useTranslate, useGetIdentity, useLogout, Title } from 'react-admin';
import ProfilePicture from './ProfilePicture';
import NameForm, { NameFormSkeleton } from './NameForm';

const AVATAR_SIZE = '8rem';

const Profile = () => {
  const translate = useTranslate();
  const { identity, error, isLoading } = useGetIdentity();
  const logout = useLogout();

  if (error) {
    logout();
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
        {identity ? (
          <NameForm id={identity.id} />
        ) : (
          // should never happen, but just in case
          <Skeleton animation="wave" variant="rounded">
            <NameFormSkeleton />
          </Skeleton>
        )}
        {/* TODO add password reset field */}
      </Box>
    </Card>
  );
};

export default Profile;
