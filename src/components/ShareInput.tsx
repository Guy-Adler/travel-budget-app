import React from 'react';
import AvatarMui from '@mui/material/Avatar';
import ArrayTextInput, {
  Validator,
  ArrayTextInputProps,
} from '@/components/base/ArrayTextInput';
import { createIdentity } from '@/providers/auth';
import client from '@/providers/client';
import type { Schema } from '@/types/schema';

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

const ShareInput: React.FC = () => (
  <ArrayTextInput
    source="shares"
    label="resources.trips.shares"
    newTagKeys={[' ']}
    valuesValidator={validateEmail}
    Avatar={Avatar}
    chipLabel={(data) => data?.avatar?.identity?.fullName ?? undefined}
  />
);

export default ShareInput;
