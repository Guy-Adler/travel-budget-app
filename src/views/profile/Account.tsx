import React, { useCallback } from 'react';
import {
  BooleanInput,
  PasswordInput,
  EditBase,
  Identifier,
  useSaveContext,
  minLength,
  useLogout,
  useNotify,
} from 'react-admin';
import Section from './Section';
import client from '@/src/providers/supabase';

interface AccountProps {
  id: Identifier;
}

interface FormValues {
  can_be_shared?: boolean;
  password?: string;
  confirmPassword?: string;
}

const passwordValidator = minLength(6);

const confirmPasswordValidator = [
  (value: FormValues['confirmPassword'], allValues: FormValues) => {
    const { password } = allValues;
    if (value !== password) {
      return 'auth.validation.confirm_password';
    }
    return undefined;
  },
];

export const AccountSkeleton: React.FC = () => {
  const saveContext = useSaveContext();
  const logout = useLogout();
  const notify = useNotify();

  const handleSubmit = useCallback(
    async (data: FormValues) => {
      if (saveContext.save) {
        // extract password, confirmPassword from the UPDATE call to the server
        const { password, confirmPassword, ...rest } = data;
        saveContext.save(rest);

        // update password
        const session = client.auth.session();
        if (session === null) {
          logout();
          return;
        }

        const { error } = await client.auth.api.updateUser(
          session.access_token,
          {
            password,
          }
        );

        if (error) {
          notify('auth.reset_password_error', {
            type: 'warning',
            multiLine: true,
          });
        } else {
          notify('auth.reset_password_success', {
            type: 'success',
          });
        }
      }
    },
    [saveContext, logout, notify]
  );
  return (
    <Section
      scope="account"
      onSubmit={handleSubmit}
      fields={{
        can_be_shared: <BooleanInput source="can_be_shared" label={false} />,
        password: (
          <PasswordInput
            variant="filled"
            source="password"
            autoComplete="new-password"
            label={false}
            validate={passwordValidator}
          />
        ),
        confirmPassword: (
          <PasswordInput
            variant="filled"
            source="confirmPassword"
            autoComplete="new-password"
            label={false}
            validate={confirmPasswordValidator}
          />
        ),
      }}
      labels={{
        password: {
          label: 'ra.auth.password',
        },
        confirmPassword: {
          label: 'auth.confirm_password',
        },
      }}
    />
  );
};

const Account: React.FC<AccountProps> = ({ id }) => (
  <EditBase resource="profiles" id={id} redirect={false}>
    <AccountSkeleton />
  </EditBase>
);

export default Account;
