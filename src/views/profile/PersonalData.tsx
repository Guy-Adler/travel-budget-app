import React from 'react';
import { styled } from '@mui/material/styles';
import { TextInput, TextInputProps, EditBase, Identifier } from 'react-admin';
import Section from './Section';

interface PersonalDataProps {
  id: Identifier;
}

const TextInputNoLabel = styled((props: TextInputProps) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <TextInput {...props} variant="filled" label={false} />
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

export const PersonalDataSkeleton = () => (
  <Section
    scope="personal_data"
    fields={{
      first_name: <TextInputNoLabel source="first_name" />,
      last_name: <TextInputNoLabel source="last_name" />,
    }}
  />
);

const PersonalData: React.FC<PersonalDataProps> = ({ id }) => (
  <EditBase resource="profiles" id={id} redirect={false}>
    <PersonalDataSkeleton />
  </EditBase>
);

export default PersonalData;
