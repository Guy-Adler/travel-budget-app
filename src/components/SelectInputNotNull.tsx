/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useInput, SelectInputProps } from 'react-admin';

const SelectInputNotNull: React.FC<SelectInputNotNullProps> = ({
  source,
  choices,
  ...props
}) => {
  const {
    field,
    fieldState: { isTouched, invalid },
    formState: { isSubmitted },
  } = useInput({
    source,
    ...props,
  });

  return (
    <Select
      variant="standard"
      disableUnderline
      error={(isTouched || isSubmitted) && invalid}
      {...field}
    >
      {choices.map((choice) => (
        <MenuItem key={choice.value} value={choice.value}>
          {choice.render}
        </MenuItem>
      ))}
    </Select>
  );
};

interface SelectInputNotNullProps extends SelectInputProps {
  source: string;
  choices: {
    value: string | number;
    render: React.ReactNode;
  }[];
}

export default SelectInputNotNull;
