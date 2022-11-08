import React from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import {
  useTranslate,
  useGetIdentity,
  useLogout,
  Title
} from 'react-admin';
import ProfilePicture from './ProfilePicture';

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
            justifyContent: 'center',
          }}
        >
          {
            isLoading
            ? <Skeleton variant="circular" width="5rem" height="5rem" animation="wave" />
            : <ProfilePicture size="5rem" identity={identity} />
          }
          {/* TODO add first, last name edit fields */}
          {/* TODO add password reset field */}
        </Box>
    </Card>
  );
};

export default Profile;
