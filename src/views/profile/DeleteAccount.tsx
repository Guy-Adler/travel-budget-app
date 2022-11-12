import React, { useState, useCallback } from 'react';
import { styled, alpha } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Confirm, useLogout, useNotify } from 'react-admin';
import client from '@/src/providers/supabase';

const deleteProfilePictureFromStorage = async () => {
  // get list of profile pictures with the user's name (RLS only allows files named with the uid of the user to be accessed.)
  const { data, error } = await client.storage.from('avatars').list();

  if (!error) {
    // delete all the files (could maybe be more than 1?) of the user
    if ((data?.length ?? 0) > 0) {
      await client.storage
        .from('avatars')
        .remove(data?.map((file) => file.name) ?? []);
    }
  }
};

const StyledButton = styled(Button, {
  name: 'RaDeleteWithConfirmButton',
  overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
  color: theme.palette.error.main,
  '&:hover': {
    backgroundColor: alpha(theme.palette.error.main, 0.12),
    // Reset on mouse devices
    '@media (hover: none)': {
      backgroundColor: 'transparent',
    },
  },
}));

const DeleteAccount: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const logout = useLogout();
  const notify = useNotify();

  const handleDelete = useCallback(async () => {
    // delete the profile picture
    const id = client.auth.user()?.id;
    if (id === undefined) return;
    await deleteProfilePictureFromStorage();
    // delete the account (all the other data deletion is handled by Postgres)
    try {
      await fetch(`/api/deleteUser/${id}`, {
        method: 'DELETE',
      });
      // eslint-disable-next-line no-empty
    } catch (e) {
    } finally {
      notify('auth.account_delete_success', {
        type: 'success',
      });
      logout();
    }
  }, [logout, notify]);

  return (
    <>
      <StyledButton
        onClick={() => setIsOpen(true)}
        label="ra.action.delete"
        key="button"
      >
        <DeleteIcon />
      </StyledButton>
      <Confirm
        isOpen={isOpen}
        title="profile.account.delete.title"
        content="profile.account.delete.content"
        onConfirm={handleDelete}
        onClose={() => {
          setIsOpen(false);
        }}
      />
    </>
  );
};

export default DeleteAccount;
