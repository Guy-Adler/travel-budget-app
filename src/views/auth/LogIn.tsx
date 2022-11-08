import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Form,
  required,
  TextInput,
  useTranslate,
  useLogin,
  useNotify,
  useRedirect,
} from 'react-admin';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import LockIcon from '@mui/icons-material/Lock';
import GoogleIcon from '@mui/icons-material/Google';
import ForgotPasswordButton from './ForgotPassword';
import client from '../../providers/supabase';

interface FormValues {
  username?: string;
  password?: string;
}

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const translate = useTranslate();

  const notify = useNotify();
  const login = useLogin();
  const location = useLocation();
  const redirect = useRedirect();

  const handleSubmit = (auth: FormValues) => {
    setLoading(true);
    login(
      auth,
      location.state ? (location.state as any).nextPathname : '/'
    ).catch((error: Error) => {
      setLoading(false);
      notify(
        // eslint-disable-next-line no-nested-ternary
        typeof error === 'string'
          ? error
          : typeof error === 'undefined' || !error.message
          ? 'ra.auth.sign_in_error'
          : error.message,
        {
          type: 'warning',
          messageArgs: {
            _:
              // eslint-disable-next-line no-nested-ternary
              typeof error === 'string'
                ? error
                : error && error.message
                ? error.message
                : undefined,
          },
        }
      );
    });
  };

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'flex-start',
          background: 'url(https://source.unsplash.com/random/1600x900?travel)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <Card sx={{ minWidth: 300, marginTop: '6em' }}>
          <Box
            sx={{
              margin: '1em',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Avatar sx={{ bgcolor: 'secondary.main' }}>
              <LockIcon />
            </Avatar>
          </Box>
          <Box sx={{ padding: '0 1em 1em 1em' }}>
            <Button
              variant="outlined"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                const { user, error } = await client.auth.signIn({
                  provider: 'google',
                });
                if (error) {
                  notify('ra.auth.sign_in_error', {
                    type: 'warning',
                  });
                }
                if (user) {
                  redirect(
                    location.state ? (location.state as any).nextPathname : '/'
                  );
                }
                setLoading(false);
              }}
              fullWidth
              sx={{
                justifyContent: 'space-evenly',
              }}
            >
              <GoogleIcon />
              {translate('auth.google')}
            </Button>
          </Box>
          <Box sx={{ padding: '1em 1em 0 1em' }}>
            <Divider>{translate('or')}</Divider>
          </Box>
          <Box sx={{ padding: '0 1em 1em 1em' }}>
            <Box sx={{ marginTop: '1em' }}>
              <TextInput
                type="email"
                autoFocus
                source="username"
                label={translate('auth.email')}
                autoComplete="username"
                disabled={loading}
                validate={required()}
                fullWidth
              />
            </Box>
            <Box sx={{ marginTop: '1em' }}>
              <TextInput
                source="password"
                label={translate('ra.auth.password')}
                type="password"
                autoComplete="current-password"
                disabled={loading}
                validate={required()}
                fullWidth
              />
            </Box>
          </Box>
          <CardActions sx={{ padding: '0 1em 1em 1em' }}>
            <Stack
              sx={{
                width: '100%',
              }}
              gap={1}
            >
              <Button
                variant="contained"
                type="submit"
                color="primary"
                disabled={loading}
                fullWidth
              >
                {loading && <CircularProgress size={25} thickness={2} />}
                {translate('ra.auth.sign_in')}
              </Button>
              <ForgotPasswordButton />
            </Stack>
          </CardActions>
        </Card>
      </Box>
    </Form>
  );
};

export default LoginPage;
