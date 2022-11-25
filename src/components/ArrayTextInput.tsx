import React from 'react';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import ErrorIcon from '@mui/icons-material/Error';
import type { ControllerRenderProps } from 'react-hook-form';
import {
  useInput,
  AutocompleteArrayInputProps,
  UseInputValue,
} from 'react-admin';

interface ArrayTextInputProps extends AutocompleteArrayInputProps {
  source: string;
  newTagKeys?: string[];
}

interface ArrayTextUseInputValue extends UseInputValue {
  field: Omit<ControllerRenderProps, 'value'> & {
    value: string[];
  };
}

type UpdateValueEvent = React.FocusEvent<
  HTMLInputElement | HTMLTextAreaElement,
  Element
>;

const updateValue = (
  e: UpdateValueEvent,
  setValue: (...args: any[]) => void,
  previousValue: string[]
) => {
  if (e.target.value !== '') {
    // prevent empty tags
    setValue([
      ...new Set([...previousValue, (e.target as HTMLInputElement).value]),
    ]); // update values (cast to set to make unique)
    e.target.value = ''; // remove current value from the input itself (clear it)
  }
};

const ArrayTextInput: React.FC<ArrayTextInputProps> = ({
  onChange,
  onBlur,
  source,
  label,
  validate,
  newTagKeys = [],
  ...rest
}) => {
  const {
    field: { name, onBlur: fieldOnBlur, onChange: setValue, ref, value },
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
  }) as ArrayTextUseInputValue;

  return (
    <TextField
      name={name}
      onBlur={(e) => {
        updateValue(e, setValue, value);

        fieldOnBlur();
      }}
      onKeyDown={(e) => {
        if ([...newTagKeys, 'Enter'].includes(e.key)) {
          e.preventDefault();
          e.stopPropagation();
          updateValue(e as unknown as UpdateValueEvent, setValue, value);
        }
        if (
          e.key === 'Backspace' &&
          (e.target as HTMLInputElement).value === ''
        ) {
          setValue(value.slice(0, -1));
        }
      }}
      ref={ref}
      variant="outlined"
      error={(isTouched || isSubmitted) && invalid}
      helperText={(isTouched || isSubmitted) && invalid ? error?.message : ''}
      required={isRequired}
      label={label}
      fullWidth
      sx={{
        maxWidth: '100%',
      }}
      InputProps={{
        startAdornment: value.map((email, idx) => (
            <Chip
              key={Math.random()}
              label={email}
              variant="outlined"
              size="small"
              onDelete={() => {
                setValue([...value.slice(0, idx), ...value.slice(idx + 1)]);
              }}
              sx={{
                mr: 1,
                mt: 1,
                mb: 'auto',
              }}
            />
          )),
        sx: {
          display: 'flex',
          flexWrap: 'wrap',
        },
      }}
      inputProps={{
        style: {
          display: 'block',
          flex: '1 1',
        },
      }}
    />
  );
};

export default ArrayTextInput;

ArrayTextInput.defaultProps = {
  newTagKeys: [],
};
