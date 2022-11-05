import React, { useState } from "react";
import {
  Form,
  required,
  email,
  TextInput,
  useTranslate,
  useNotify,
} from 'react-admin';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import supabase from "./providers/supabase";

export default function AlertDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const notify = useNotify();
  const translate = useTranslate();

  const handleSubmit = async ({ email }: { email?: string }) => {
    setLoading(true);
    const { error } = await supabase.auth.api.resetPasswordForEmail(email ?? '');
    setLoading(false);
    setOpen(false);
    if (error) {
      throw error;
    }
    notify('Login link sent successfully!\nAfter clicking the link, go to your profile to reset your password.', {
      // TODO i18n ^^^
      type: 'success',
      multiLine: true
    });
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => {
          setOpen(true);
        }}
        color="secondary"
        fullWidth
      >
        Forgot Password?
        {
          // TODO i18n ^^^
        }
      </Button>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Send Password Reset?</DialogTitle>
        {
          // TODO i18n ^^^
        }
        <Form onSubmit={handleSubmit} noValidate>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              A temporary login link will be sent to the following email:
              {
                // TODO i18n ^^^
              }
            </DialogContentText>
            <TextInput
                type="email"
                autoFocus
                source="email"
                autoComplete="username"
                disabled={loading}
                validate={[required(), email()]}
                fullWidth
                variant="outlined"
                // remove the label (it's redundant)
                aria-label="email"
                label={false}
                sx={{
                  '& legend': { display: 'none' },
                  '& fieldset': { top: 0 },
                }}              
              />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpen(false);
              }}
            >
              {translate('ra.action.cancel')}
              {
                // TODO i18n ^^^
              }
            </Button>
            <Button
              type="submit"
              color="primary"
              autoFocus
              disabled={loading}
            >
              Send Email
              {
                // TODO i18n ^^^
              }
              {loading && <CircularProgress size={25} thickness={5} sx={{ marginBottom: 1}} />}
            </Button>
          </DialogActions>
        </Form>
      </Dialog>
    </>
  );
}