import React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import {
  Form,
  TextInput,
  EditBase,
  Identifier,
  useTranslate,
} from 'react-admin';

interface NameFormProps {
  id: Identifier;
}

export const NameFormSkeleton = () => {
  const translate = useTranslate();

  return (
    <Form>
      <Typography variant="h5" textAlign="center">
        {translate('profile.personal_data_title')}
      </Typography>
      <Stack>
        <TextInput source="first_name" label="resources.profiles.first_name" />
        <TextInput source="last_name" label="resources.profiles.last_name" />
        <Button variant="contained" type="submit" color="primary">
          {translate('ra.action.save')}
        </Button>
      </Stack>
    </Form>
  );
};

const NameForm: React.FC<NameFormProps> = ({ id }) => (
  <EditBase resource="profiles" id={id} redirect={false}>
    <NameFormSkeleton />
  </EditBase>
);

export default NameForm;
