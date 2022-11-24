/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import { useInput, AutocompleteArrayInputProps } from 'react-admin';

interface ArrayEmailInputProps extends AutocompleteArrayInputProps {
  source: string;
}
const ArrayEmailInput: React.FC<ArrayEmailInputProps> = ({
  onChange,
  onBlur,
  source,
  label,
  validate,
  ...rest
}) => {
  const {
    field: { name, onBlur: fieldOnBlur, onChange: fieldOnChange, ref, value },
    fieldState: { isTouched, invalid, error },
    formState: { isSubmitted },
    isRequired,
  } = useInput({
    onChange,
    onBlur,
    source,
    validate,
    defaultValue: [],
    ...rest,
  });

  return (
    <TextField
      name={name}
      onBlur={fieldOnBlur}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          e.stopPropagation();
          fieldOnChange([...value, (e.target as HTMLInputElement).value]); // update values
          (e.target as HTMLInputElement).value = ''; // remove current value from the input itself (clear it)
        }
        if (e.key === 'Backspace' && (e.target as HTMLInputElement).value === '') {
          fieldOnChange(value.slice(0, -1));
        }
      }}
      onChange={(e) => {
        if ((e.nativeEvent as InputEvent).data === ' ') {
          fieldOnChange([...value, e.target.value]); // update values
          e.target.value = ''; // remove current value from the input itself (clear it)
        }
      }}
      ref={ref}
      variant="outlined"
      error={(isTouched || isSubmitted) && invalid}
      helperText={(isTouched || isSubmitted) && invalid ? error?.message : ''}
      required={isRequired}
      label={label}
      fullWidth
      InputProps={{
        startAdornment: value.map((email: string) => (
          <Chip key={Math.random()} label={email} size="medium" />
        )),
      }}
    />
  );
};

export default ArrayEmailInput;
