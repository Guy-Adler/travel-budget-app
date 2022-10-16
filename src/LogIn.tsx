import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import ForgotPasswordButton from './ForgotPassword';
import { auth } from './App';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CircularProgress,
  Divider,
  Stack,
} from '@mui/material';
import {
  Lock as LockIcon,
  Google as GoogleIcon,
} from '@mui/icons-material';
import {
  Form,
  required,
  TextInput,
  useTranslate,
  useLogin,
  useNotify,
  useRedirect,
} from 'react-admin';

interface FormValues {
  username?: string;
  password?: string;
}

const provider = new GoogleAuthProvider();

const LoginPage: React.FC = (props) => {
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
      location.state ? (location.state as any).nextPathname : '/',
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
        },
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
              onClick={() => {
                setLoading(true);
                signInWithPopup(auth, provider)
                  .then((result) => {
                    redirect(location.state ? (location.state as any).nextPathname : '/');
                  })
                  .catch((error) => {
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
                      },
                    );
                  })
                  .finally(() => {
                    setLoading(false);
                  })
              }}
              fullWidth
              sx={{
                justifyContent: 'space-evenly',

              }}
            >
              <GoogleIcon />
              Log in with google
            </Button>
          </Box>
          <Box sx={{ padding: '1em 1em 0 1em' }}>
            <Divider>OR</Divider>
          </Box>
          <Box sx={{ padding: '0 1em 1em 1em' }}>
            <Box sx={{ marginTop: '1em' }}>
              <TextInput
                type="email"
                autoFocus
                source="username"
                label={translate('ra.auth.username')}
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
                width: '100%'
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
                {loading && (
                  <CircularProgress size={25} thickness={2} />
                )}
                {translate('ra.auth.sign_in')}
              </Button>
              <ForgotPasswordButton />
            </Stack>
          </CardActions>
        </Card>
      </Box>
    </Form>
  );
}

export default LoginPage;
