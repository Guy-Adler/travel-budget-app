import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Form,
  required,
  minLength,
  TextInput,
  PasswordInput,
  useTranslate,
  useLogin,
  useNotify,
  useRedirect,
  Validator,
} from 'react-admin';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import LockIcon from '@mui/icons-material/Lock';
import GoogleIcon from '@mui/icons-material/Google';
import ForgotPasswordButton from './ForgotPassword';
import client, { ApiError } from '@/src/providers/supabase';
import useTitle from '@/src/hooks/useTitle';

interface FormValues {
  username?: string;
  password?: string;
  confirmPassword?: string;
}

const passwordValidation: Validator[] = [required(), minLength(6)];
const passwordConfirmationValidation: Validator[] = [
  (value: FormValues['confirmPassword'], allValues: FormValues) => {
    if (!value) return 'ra.validation.required';
    if (allValues.password && value !== allValues.password)
      return 'auth.validation.confirm_password';
    return undefined;
  },
];

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const translate = useTranslate();

  const notify = useNotify();
  const login = useLogin();
  const location = useLocation();
  const redirect = useRedirect();
  useTitle('auth.sign_in');

  const handleSubmit = async ({ confirmPassword, ...auth }: FormValues) => {
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await client.auth.signUp({
          email: auth.username,
          password: auth.password,
        });
        if (error) throw new ApiError(error.message, error.status);
        setLoading(false);
        notify('auth.sign_up_activation', {
          multiLine: true,
        });
      } else {
        await login(
          auth,
          location.state ? (location.state as any).nextPathname : '/'
        );
      }
    } catch (error) {
      setLoading(false);
      notify(
        // eslint-disable-next-line no-nested-ternary
        typeof error === 'string'
          ? error
          : typeof error === 'undefined' || !(error as Error).message
          ? 'ra.auth.sign_in_error'
          : (error as Error).message,
        {
          type: 'warning',
          messageArgs: {
            _:
              // eslint-disable-next-line no-nested-ternary
              typeof error === 'string'
                ? error
                : error && (error as Error).message
                ? (error as Error).message
                : undefined,
          },
        }
      );
    }
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
        <Card sx={{ marginTop: '6em', width: 'clamp(0px, 400px, 100vw)' }}>
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
                justifyContent: 'center',
                gap: 2,
              }}
            >
              <GoogleIcon />
              {translate(`auth.google_${isSignUp ? 'sign_up' : 'sign_in'}`)}
            </Button>
          </Box>
          <Divider variant="middle">{translate('or')}</Divider>
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
              <PasswordInput
                source="password"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                disabled={loading}
                validate={passwordValidation}
                fullWidth
              />
            </Box>
            <Collapse in={isSignUp}>
              <Box sx={{ marginTop: '1em' }}>
                <PasswordInput
                  source="confirmPassword"
                  label="Confirm Password"
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  disabled={loading}
                  validate={
                    isSignUp ? passwordConfirmationValidation : undefined
                  }
                  fullWidth
                />
              </Box>
            </Collapse>
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
                {translate(`auth.${isSignUp ? 'sign_up' : 'sign_in'}`)}
              </Button>
              <Stack direction="row">
                <ForgotPasswordButton />
                <Divider flexItem orientation="vertical" />
                <Button
                  variant="text"
                  color="secondary"
                  fullWidth
                  onClick={() => setIsSignUp((val) => !val)}
                >
                  {translate(`auth.${isSignUp ? 'sign_in' : 'sign_up'}`)}
                </Button>
              </Stack>
            </Stack>
          </CardActions>
        </Card>
      </Box>
    </Form>
  );
};

export default LoginPage;
