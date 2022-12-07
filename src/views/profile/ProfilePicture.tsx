import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {
  Form,
  required,
  ImageInput,
  ImageField,
  useTranslate,
  useNotify,
  UserIdentity,
} from 'react-admin';
import client from '@/providers/client';
import type { Schema } from '@/types/schema';
import classNames from './ProfilePicture.module.scss';

interface ProfilePictureProps {
  size: string | number;
  identity: UserIdentity | undefined;
}
interface FormValues {
  picture?: {
    rawFile: File;
    src: string;
    title: string;
  };
}

const isDefaultAvatar = (avatar: string | undefined): boolean => {
  if (avatar === undefined) return true;
  return avatar.startsWith('https://avatars.dicebear.com/api/initials/');
};

const ProfilePicture: React.FC<ProfilePictureProps> = ({ size, identity }) => {
  const [open, setOpen] = useState(false);
  const [loading] = useState(false);

  const notify = useNotify();
  const translate = useTranslate();

  const handleDelete = async (sendNotification?: boolean) => {
    if (identity === undefined) return;
    // remove profile picture link from user profile
    const { error: err, count } = await client
      .from<Schema['profiles']>('profiles')
      .update(
        {
          avatar_url: null,
        },
        {
          count: 'exact',
        }
      )
      .eq(
        'id',
        identity.id as `${string}-${string}-${string}-${string}-${string}`
      );

    if (err || count !== 1) {
      if (sendNotification) {
        notify('profile.errors.could_not_delete_picture', {
          type: 'error',
          multiLine: true,
        });
      }
      return;
    }
    // get list of profile pictures with the user's name (RLS only allows files named with the uid of the user to be accessed.)
    const { data, error } = await client.storage.from('avatars').list();

    if (error) {
      if (sendNotification) {
        notify('profile.errors.could_not_delete_picture', {
          type: 'error',
          multiLine: true,
        });
      }
      return;
    }
    // delete all the files (could maybe be more than 1?) of the user
    if ((data?.length ?? 0) > 0) {
      const { error: e } = await client.storage
        .from('avatars')
        .remove(data?.map((file) => file.name) ?? []);
      if (e) {
        if (sendNotification) {
          notify('profile.errors.could_not_delete_picture', {
            type: 'error',
            multiLine: true,
          });
        }
        return;
      }
    }
    if (sendNotification) {
      notify('profile.deleted_picture', {
        type: 'success',
      });
    }
  };

  const handleUpload = async ({ picture }: FormValues) => {
    if (identity === undefined) return;
    if (!picture) return;

    // delete the old pic, if it exists
    await handleDelete(false);

    // upload the picture
    const fileName = `${identity.id}.${picture.title.split('.').pop()}`; // get the file name to be uid.extension;
    const { error } = await client.storage
      .from('avatars')
      .upload(fileName, picture.rawFile);
    if (error) {
      notify('profile.errors.could_not_upload_picture', {
        type: 'error',
        multiLine: true,
      });
      return;
    }

    // update profile record with new URL
    const { publicURL } = client.storage.from('avatars').getPublicUrl(fileName);

    const { error: err, data } = await client
      .from<Schema['profiles']>('profiles')
      .update({
        avatar_url: publicURL,
      })
      .eq(
        'id',
        identity.id as `${string}-${string}-${string}-${string}-${string}`
      );

    if (err || data.length !== 1 || data[0].avatar_url === null) {
      notify('profile.errors.could_not_upload_picture', {
        type: 'error',
        multiLine: true,
      });
      return;
    }
    notify('profile.uploaded_picture', {
      type: 'success',
    });
  };

  return (
    <>
      <div className={classNames.container}>
        {identity && (
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
        )}
        <Avatar
          className={classNames.profilePicture}
          alt="profile picture"
          sx={{ width: size, height: size, objectFit: 'cover' }}
          src={identity?.avatar}
        />
      </div>

      {identity && (
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
                maxSize={5 * 10 ** 7} // 5MB
                sx={{
                  '& .RaFileInput-removeButton button': {
                    display: 'none', // hide the delete button (no reason for it to be there)
                  },
                  '& .previews': {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                  '& legend': { display: 'none' },
                  '& fieldset': { top: 0 },
                }}
                label={false}
                validate={required()}
              >
                <ImageField source="src" title="title" />
              </ImageInput>
              <p>{translate('profile.upload_size_limit')}</p>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setOpen(false);
                }}
              >
                {translate('ra.action.cancel')}
              </Button>
              <Button
                color="error"
                autoFocus
                disabled={loading || isDefaultAvatar(identity.avatar)}
                onClick={() => handleDelete(true)}
              >
                {translate('ra.action.delete')}
              </Button>
              <Button
                type="submit"
                color="primary"
                autoFocus
                disabled={loading}
              >
                {translate('ra.action.save')}
              </Button>
            </DialogActions>
          </Form>
        </Dialog>
      )}
    </>
  );
};

export default ProfilePicture;
