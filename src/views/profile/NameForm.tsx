import React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import {
  Form,
  TextInput,
  TextInputProps,
  EditBase,
  Identifier,
  useTranslate,
} from 'react-admin';
import LabelInput from './LabelInput';

interface NameFormProps {
  id: Identifier;
}

const TextInputNoLabel = styled((props: TextInputProps) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <TextInput {...props} label={false} />
))({
  '& legend': { display: 'none' },
  '& fieldset': { top: 0 },
  '& input': { paddingTop: 4 },
  '&': { width: '20%' },
});

const FIELDS = ['first_name', 'last_name'];

export const NameFormSkeleton = () => {
  const translate = useTranslate();

  return (
    <Stack width="100%" padding="0 2rem">
      <Form>
        {/*       width calculation explanation: padding  label  gap   input */}
        <Stack
          direction="row"
          width="calc(1rem + 20% + 10% + 20%)"
          justifyContent="space-between"
          alignItems="baseline"
        >
          <Stack paddingBottom="1rem">
            <Typography variant="h5">
              {translate('profile.personal_data.title')}
            </Typography>
            <Typography variant="body1">
              {translate('profile.personal_data.description')}
            </Typography>
          </Stack>
          <Button variant="contained" type="submit" color="primary">
            {translate('ra.action.save')}
          </Button>
        </Stack>
        <Stack gap="1.5rem" paddingLeft="1rem">
          {FIELDS.map((field) => (
            <LabelInput
              label={`resources.profiles.${field}`}
              helper={`profile.personal_data.fields.${field}.description`}
              key={field}
            >
              <TextInputNoLabel source={field} />
            </LabelInput>
          ))}
        </Stack>
      </Form>
    </Stack>
  );
};

const NameForm: React.FC<NameFormProps> = ({ id }) => (
  <EditBase resource="profiles" id={id} redirect={false}>
    <NameFormSkeleton />
  </EditBase>
);

export default NameForm;
