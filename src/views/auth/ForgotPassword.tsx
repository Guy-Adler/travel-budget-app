import React, { useState } from 'react';
import {
  Form,
  required,
  email as emailValidator,
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
import supabase from '../../providers/supabase';

const AlertDialog = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const notify = useNotify();
  const translate = useTranslate();

  const handleSubmit = async ({ email }: { email?: string }) => {
    setLoading(true);
    const { error } = await supabase.auth.api.resetPasswordForEmail(
      email ?? ''
    );
    setLoading(false);
    setOpen(false);
    if (error) {
      throw new Error(`(${error.status}): ${error.message}`);
    }
    notify('auth.reset_link_sent', {
      type: 'success',
      multiLine: true,
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
        {translate('auth.forgot_password')}
      </Button>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {translate('auth.send_password_reset')}
        </DialogTitle>
        <Form onSubmit={handleSubmit} noValidate>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {translate('auth.password_reset_alert_dialog_description')}
            </DialogContentText>
            <TextInput
              type="email"
              autoFocus
              source="email"
              autoComplete="username"
              disabled={loading}
              validate={[required(), emailValidator()]}
              fullWidth
              variant="outlined"
              label="auth.email"
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpen(false);
              }}
            >
              {translate('ra.action.cancel')}
            </Button>
            <Button type="submit" color="primary" autoFocus disabled={loading}>
              {translate('auth.send_reset_link')}
              {loading && (
                <CircularProgress
                  size={25}
                  thickness={5}
                  sx={{ marginBottom: 1 }}
                />
              )}
            </Button>
          </DialogActions>
        </Form>
      </Dialog>
    </>
  );
};

export default AlertDialog;
