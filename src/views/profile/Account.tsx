import React, { useCallback } from 'react';
import Stack from '@mui/material/Stack';
// import { styled, Theme } from '@mui/material/styles';
// import useMediaQuery from '@mui/material/useMediaQuery';
import {
  Form,
  BooleanInput,
  EditBase,
  Identifier,
  // useTranslate,
  useSaveContext,
} from 'react-admin';
import LabelInput from './LabelInput';
import FormTitle from './FormTitle';

interface AccountProps {
  id: Identifier;
}

interface FormValues {
  can_be_shared?: boolean;
}

export const AccountSkeleton: React.FC = () => {
  // const translate = useTranslate();
  const saveContext = useSaveContext();

  const handleSubmit = useCallback(
    async (data: FormValues) => {
      console.log(data);
      if (saveContext.save) {
        saveContext.save(data);
      }
    },
    [saveContext]
  );

  return (
    <Stack width="100%" padding="0 2rem">
      <Form onSubmit={handleSubmit}>
        <Stack
          direction="row"
          sx={{
            alignItems: 'baseline',
            width: {
              xs: 'reset',
              //          padding  label  gap   input
              sm: 'calc(1rem + 20% + 10% + 20%)',
            },
            justifyContent: {
              xs: 'center',
              sm: 'space-between',
            },
          }}
        >
          <FormTitle
            title="profile.account.title"
            description="profile.account.description"
          />
        </Stack>
        <Stack
          sx={{
            gap: '1.5rem',
            paddingLeft: {
              xs: 0,
              sm: '1rem',
            },
          }}
        >
          <LabelInput
            label="resources.profiles.can_be_shared"
            helper="profile.account.fields.can_be_shared.description"
          >
            <BooleanInput source="can_be_shared" label={false} />
          </LabelInput>
        </Stack>
      </Form>
    </Stack>
  );
};

const Account: React.FC<AccountProps> = ({ id }) => (
  <EditBase resource="profiles" id={id} redirect={false}>
    <AccountSkeleton />
  </EditBase>
);

export default Account;
