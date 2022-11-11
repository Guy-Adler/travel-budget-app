import React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { styled, Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
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
  '&': {
    width: {
      xs: '100%',
      sm: '20%',
    },
  },
});

const FIELDS = ['first_name', 'last_name'];

export const NameFormSkeleton = () => {
  const translate = useTranslate();
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  return (
    <Stack width="100%" padding="0 2rem">
      <Form>
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
          <Stack paddingBottom="1rem">
            <Typography variant="h5" textAlign={isSmall ? 'center' : undefined}>
              {translate('profile.personal_data.title')}
            </Typography>
            <Typography
              variant="body1"
              textAlign={isSmall ? 'center' : undefined}
            >
              {translate('profile.personal_data.description')}
            </Typography>
          </Stack>
          {!isSmall && (
            <Button variant="contained" type="submit" color="primary">
              {translate('ra.action.save')}
            </Button>
          )}
        </Stack>
        <Stack
          sx={{
            gap: "1.5rem",
            paddingLeft: {
              xs: 0,
              sm: '1rem',
            },
          }}
        >
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
        {isSmall && (
          <Button variant="contained" type="submit" color="primary" fullWidth>
            {translate('ra.action.save')}
          </Button>
        )}
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
