import React, { useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import AvatarMui from '@mui/material/Avatar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import CreateIcon from '@mui/icons-material/Create';
import {
  CreateBase,
  useTranslate,
  Form,
  SaveButton,
  TextInput,
  required,
  useNotify,
} from 'react-admin';
import ArrayTextInput, {
  Validator,
  Value as SharesValue,
  ArrayTextInputProps,
} from '@/components/base/ArrayTextInput';
import SelectInputNotNull from '@/components/base/SelectInputNotNull';
import { createIdentity } from '@/providers/auth';
import client from '@/providers/client';
import type { Schema, UUID } from '@/types/schema';

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

  await new Promise((res) => {
    setTimeout(res, 1000);
  });

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
    value: data[0].id,
    avatar: {
      identity,
    },
  };
};

const Avatar: ArrayTextInputProps['Avatar'] = ({ identity, ...props }) => (
  <AvatarMui
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
    src={typeof identity?.avatar === 'string' ? identity?.avatar : undefined}
  />
);

interface FormData {
  shares: SharesValue;
  name: string;
  canEdit: number;
}

const CreateDialog: React.FC<CreateDialogProps> = ({ open, onClose }) => {
  const translate = useTranslate();
  const notify = useNotify();

  const shareTo = useRef<string[]>([]);
  const canEditValue = useRef<boolean>(false);

  const removeOutsideDataAndResubmit = (data: FormData) => {
    const { shares, canEdit, ...rest } = data;
    shareTo.current = [...shares.values()].map(
      (val) => val.data?.value as string
    );
    canEditValue.current = canEdit === 1;
    return rest;
  };

  const onSuccess = async (data: Schema['trips']) => {
    await client.from<Schema['shares']>('shares').insert(
      shareTo.current.map((uid) => ({
        trip_id: data.id,
        user_id: uid as UUID,
        can_edit: canEditValue.current,
      }))
    );
    notify('shares.messages.success', {
      type: 'success',
    });
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
          mutationOptions={{ onSuccess, onSettled: onClose }}
        >
          <Form>
            <TextInput
              source="name"
              label="resources.trips.trip_name"
              validate={required()}
              fullWidth
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} sx={{}}>
              <ArrayTextInput
                source="shares"
                label="resources.trips.shares"
                newTagKeys={[' ']}
                valuesValidator={validateEmail}
                Avatar={Avatar}
                chipLabel={(data) =>
                  data?.avatar?.identity?.fullName ?? undefined
                }
              />
              <SelectInputNotNull
                source="canEdit"
                defaultValue={0}
                choices={[
                  {
                    value: 0,
                    render: (
                      <Stack direction="row" alignItems="center">
                        <VisibilityIcon
                          sx={{ mr: 1, color: 'rgba(0, 0, 0, 0.54)' }}
                        />
                        <ListItemText>
                          {translate('shares.permissions.viewer')}
                        </ListItemText>
                      </Stack>
                    ),
                  },
                  {
                    value: 1,
                    render: (
                      <Stack direction="row" alignItems="center">
                        <CreateIcon
                          sx={{ mr: 1, color: 'rgba(0, 0, 0, 0.54)' }}
                        />
                        <ListItemText>
                          {translate('shares.permissions.editor')}
                        </ListItemText>
                      </Stack>
                    ),
                  },
                ]}
              />
            </Stack>
            <SaveButton />
          </Form>
        </CreateBase>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDialog;
