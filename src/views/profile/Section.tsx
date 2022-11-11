import React from 'react';
import type { SubmitHandler, FieldValues } from 'react-hook-form';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Form, useTranslate } from 'react-admin';
import LabelInput from './LabelInput';
import FormTitle from './FormTitle';

interface SectionProps {
  scope: string;
  fields: Record<string, React.ReactNode>;
  labels?: Record<string, { label?: string; helper?: string }>;
  onSubmit?: SubmitHandler<FieldValues>;
}

const Section: React.FC<SectionProps> = ({
  scope,
  fields,
  onSubmit,
  labels = {},
}) => {
  const translate = useTranslate();
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  return (
    <Stack width="100%" padding="0 2rem">
      <Form onSubmit={onSubmit} noValidate>
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
            title={`profile.${scope}.title`}
            description={`profile.${scope}.description`}
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
          {Object.entries(fields ?? {}).map(([field, element]) => (
            <LabelInput
              label={labels?.[field]?.label ?? `resources.profiles.${field}`}
              helper={
                labels?.[field]?.helper ??
                `profile.${scope}.fields.${field}.description`
              }
              key={field}
            >
              {element}
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

Section.defaultProps = {
  onSubmit: undefined,
  labels: {},
};

export default Section;
