import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import { AvatarProps } from '@mui/material/Avatar';
import ErrorIcon from '@mui/icons-material/Error';
import LoadingIcon from '@mui/icons-material/Sync';
import { keyframes } from '@mui/material/styles';
import type { ControllerRenderProps } from 'react-hook-form';
import {
  useInput,
  AutocompleteArrayInputProps,
  UseInputValue,
} from 'react-admin';

const addValue = (
  e: AddValueEvent,
  setValue: (...args: any[]) => void,
  previousValue: string[]
) => {
  const val = e.target.value;
  if (val !== '') {
    // prevent empty tags
    setValue([...new Set([...previousValue, val])]); // update values (cast to set to make unique)
    e.target.value = ''; // remove current value from the input itself (clear it)
    return val;
  }
  return undefined;
};

const spin = keyframes`
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
`;

const ArrayTextInput: React.FC<ArrayTextInputProps> = ({
  onChange,
  onBlur,
  source,
  label,
  validate,
  newTagKeys = [],
  valuesValidator = () => true,
  Avatar,
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

  const [chipsError, setChipsErrors] = useState<(string | boolean)[]>([]);

  return (
    <TextField
      name={name}
      onBlur={async (e) => {
        const newValue = addValue(e, setValue, value);
        if (newValue) {
          setChipsErrors([...chipsError, await valuesValidator(newValue)]);
        }
        fieldOnBlur();
      }}
      onKeyDown={async (e) => {
        if ([...newTagKeys, 'Enter'].includes(e.key)) {
          e.preventDefault();
          e.stopPropagation();
          const newValue = addValue(
            e as unknown as AddValueEvent,
            setValue,
            value
          );
          if (newValue) {
            setChipsErrors([...chipsError, await valuesValidator(newValue)]);
          }
        }
        if (
          e.key === 'Backspace' &&
          (e.target as HTMLInputElement).value === ''
        ) {
          setValue(value.slice(0, -1));
          setChipsErrors((errors) => errors.slice(0, -1));
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
        startAdornment: value.map((val, idx) => (
          <Chip
            key={Math.random()}
            label={val}
            color={
              idx < chipsError.length && chipsError[idx] !== false ? 'error' : undefined
            }
            variant="outlined"
            icon={
              /* because otherwise there is a style issue */ // eslint-disable-next-line no-nested-ternary
              idx >= chipsError.length ? (
                <LoadingIcon sx={{ animation: `${spin} 1s infinite ease` }} />
              ) : chipsError[idx] !== false ? (
                <ErrorIcon />
              ) : undefined
            }
            avatar={Avatar && (idx < chipsError.length || chipsError[idx] === false) ? <Avatar value={val} /> : undefined}
            size="small"
            onDelete={() => {
              setValue([...value.slice(0, idx), ...value.slice(idx + 1)]);
              setChipsErrors((errors) => [
                ...errors.slice(0, idx),
                ...errors.slice(idx + 1),
              ]);
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
  valuesValidator: () => false,
  Avatar: undefined
};

export type Validator = (
  value: string
) => boolean | string | Promise<boolean | string>;

interface ArrayTextInputProps extends AutocompleteArrayInputProps {
  source: string;
  newTagKeys?: string[];
  valuesValidator?: Validator;
  Avatar?: React.ComponentType<Partial<AvatarProps> & { value: string }>
}

export type { ArrayTextInputProps };

interface ArrayTextUseInputValue extends UseInputValue {
  field: Omit<ControllerRenderProps, 'value'> & {
    value: string[];
  };
}

type AddValueEvent = React.FocusEvent<
  HTMLInputElement | HTMLTextAreaElement,
  Element
>;
