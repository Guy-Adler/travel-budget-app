import React, { useState, useCallback } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import AvatarMui from '@mui/material/Avatar';
import {
  CreateBase,
  useTranslate,
  Form,
  SaveButton,
  TextInput,
  required,
  UserIdentity,
  useNotify,
  UseCreateMutateParams,
} from 'react-admin';
import ArrayTextInput, {
  Validator,
  ArrayTextInputProps,
} from '@/src/components/ArrayTextInput';
import client from '@/src/providers/supabase';
import type { Schema, UUID } from '@/src/types/schema';
import { createIdentity } from '@/src/providers/auth';

interface CreateDialogProps {
  open: boolean;
  onClose: () => void;
}
/* @link http://stackoverflow.com/questions/46155/validate-email-address-in-javascript */
const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line no-useless-escape

const validateEmail: Validator = async (value: string) => {
  // Check if email is valid:
  if (!EMAIL_REGEX.test(value)) return 'ra.validation.email';

  // Get user data, check if it is relevant.
  const { error, data } = await client
    .from<Schema['profiles']>('profiles')
    .select('*')
    .eq('email', value);

  if (error || !data || data.length > 1) {
    // server side error
    return 'ra.notification.http_error';
  }

  if (data.length === 0) {
    // no user exists
    return 'trips.shares.errors.user_not_found';
  }

  if (data[0].id === client.auth.user()?.id) {
    // can't share with yourself
    return 'trips.shares.errors.cant_share_yourself';
  }

  const identity = createIdentity(data[0]);

  return {
    avatar: {
      identity,
    },
  };
};

const Avatar: ArrayTextInputProps['Avatar'] = ({ identity, ...props }) => (
  <AvatarMui
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
    src={typeof identity?.avatar === 'string' ? identity.avatar : undefined}
  />
);

interface FormData {
  shares: string[];
  name: string;
}

const CreateDialog: React.FC<CreateDialogProps> = ({ open, onClose }) => {
  const translate = useTranslate();
  const notify = useNotify();

  const [sharesError, setSharesError] = useState<
    (string | boolean | { avatar: Record<string, any> })[]
  >([]);

  const getShareTo = useCallback(
    () =>
      (
        sharesError.filter((val) => typeof val === 'object') as {
          avatar: { identity: UserIdentity };
        }[]
      ).map((user) => user.avatar.identity.id),
    [sharesError]
  );

  const removeOutsideDataAndResubmit = (data: FormData) => {
    const { shares, ...rest } = data;
    return rest;
  };

  const onSuccess = async (
    data: Schema['trips'],
    { meta }: UseCreateMutateParams
  ) => {
    if (meta.shareTo) {
      await client.from<Schema['shares']>('shares').insert(
        (meta.shareTo as string[]).map((uid) => ({
          trip_id: data.id,
          user_id: uid as UUID,
        }))
      );
      notify('Shared with emails linked to discoverable users.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        {translate('ra.action.create_item', { item: 'Trip' })}
      </DialogTitle>
      <DialogContent>
        <CreateBase
          redirect={false}
          transform={removeOutsideDataAndResubmit}
          mutationOptions={{ onSuccess, meta: { shareTo: getShareTo() } }}
        >
          <Form>
            <TextInput source="name" validate={required()} fullWidth />
            <ArrayTextInput
              source="shares"
              label="resources.trips.shares"
              newTagKeys={[' ']}
              valuesValidator={validateEmail}
              Avatar={Avatar}
              chipLabel={(data) =>
                data?.avatar?.identity?.fullName ?? undefined
              }
              setParentError={setSharesError}
            />
            <SaveButton />
          </Form>
        </CreateBase>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDialog;
