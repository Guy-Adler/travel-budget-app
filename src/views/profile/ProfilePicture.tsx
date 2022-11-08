import React, { useState } from 'react';
import {
  Form,
  // required,
  ImageInput,
  ImageField,
  useTranslate,
  useNotify,
  UserIdentity
} from 'react-admin';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import classNames from './ProfilePicture.module.scss';
import client from '@/src/providers/supabase';
import type { Schema } from '@/src/types/schema';

interface ProfilePictureProps {
  size: string | number;
  identity: UserIdentity;
}


const ProfilePicture: React.FC<ProfilePictureProps> = ({ size, identity }) => {
  const [open, setOpen] = useState(false);
  const [loading] = useState(false);
  
  const notify = useNotify();
  const translate = useTranslate();

  const handleUpload = async () => {
    // TODO handle file upload to supabase storage + modify profiles.avatar_url
  };

  const handleDelete = async () => {
    // TODO delete the file from supabase + set profiles.avatar_url to NULL
    const { error, count } = await client.from<Schema['profiles']>('profiles').update({
      id: identity.id as `${string}-${string}-${string}-${string}-${string}`,
      avatar_url: undefined
    });

    if (error || count !== 1) {
      notify('profile.errors.could_not_delete_picture', {
        type: 'error'
      });
      // return;
    }

    // await client.storage.from('avatars').remove()
  };

  return (
    <>
      <div className={classNames.container}>
        <div className={classNames.overlay}>
          <IconButton
            onClick={() => {
              setOpen(true);
            }}
            className={classNames.overlay_btn}
            sx={{ width: size, height: size }}
          >
            <EditIcon sx={{ color: 'white' }} />
          </IconButton>
        </div>
        <Avatar
          className={classNames.profilePicture}
          alt="profile picture"
          sx={{ width: size, height: size, objectFit: 'cover' }}
          src={identity?.avatar}
        />
      </div>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <DialogTitle>{translate('profile.picture_dialog_title')}</DialogTitle>
        <Form onSubmit={handleUpload}>
          <DialogContent>
            <ImageInput
              source="picture"
              accept="image/*"
              sx={{ 
                '& .RaFileInput-removeButton button': {
                  display: 'none' // hide the delete button (no reason for it to be there)
                },
                '& .previews': {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                },
                '& legend': { display: 'none' },
                '& fieldset': { top: 0 },
              }}
              label={false} 
            >
              <ImageField source="src" title="title" />
            </ImageInput>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpen(false);
              }}
            >
              {translate('ra.action.cancel')}
            </Button>
            <Button color="error" autoFocus disabled={loading} onClick={handleDelete}>
              {translate('ra.action.delete')}
            </Button>
            <Button type="submit" color="primary" autoFocus disabled={loading}>
              {translate('ra.action.save')}
            </Button>
          </DialogActions>
        </Form>
      </Dialog>
    </>
  )
};

export default ProfilePicture;
