/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import type { AvatarProps } from '@mui/material/Avatar';
import ErrorIcon from '@mui/icons-material/Error';
import LoadingIcon from '@mui/icons-material/Sync';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import { keyframes } from '@mui/material/styles';
import type { ControllerRenderProps } from 'react-hook-form';
import {
  useInput,
  AutocompleteArrayInputProps,
  UseInputValue,
  useTranslate,
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

const ChipIcon: React.FC<
  SvgIconProps & { isLoadingError: boolean; isError: boolean }
> = ({ isLoadingError, isError, ...props }) => {
  if (isLoadingError) {
    return <LoadingIcon {...props} sx={{ animation: `${spin} 1s infinite ease` }} />
  }
  if (isError) {
    return <ErrorIcon {...props} />;
  }
  return null;
};

const convertToPropsObject = (
  value: Awaited<ReturnType<Validator>>
): Record<string, any> => {
  if (typeof value === 'string' || typeof value === 'boolean') {
    return {};
  }
  return value;
};

const ArrayTextInput: React.FC<ArrayTextInputProps> = ({
  onChange,
  onBlur,
  source,
  label,
  validate,
  newTagKeys = [],
  valuesValidator = () => true,
  Avatar,
  chipLabel,
  ...rest
}) => {
  const translate = useTranslate();
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

  const [chipsError, setChipsErrors] = useState<
    (string | boolean | { avatar: Record<string, any> })[]
  >([]);
  const [focusedTag, setFocusedTag] = useState(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const anchorRef = useRef<HTMLDivElement | null>(null);

  const moveFocus = (tagIndex: number) => {
    if (tagIndex === -1) {
      inputRef.current?.focus();
    } else {
      const tag = anchorRef.current?.querySelector(
        `[data-tag-index="${tagIndex}"]`
      ) as HTMLElement | null | undefined;
      tag?.focus();
    }
  };

  const handleFocusTag = (direction: 'previous' | 'next') => {
    let nextTag = focusedTag;
    if (focusedTag === -1) {
      if (inputRef.current?.value === '' && direction === 'previous') {
        nextTag = value.length - 1;
      }
    } else {
      nextTag += direction === 'next' ? 1 : -1;

      if (nextTag < 0) {
        nextTag = 0;
      }

      if (nextTag === value.length) {
        nextTag = -1;
      }
    }

    setFocusedTag(nextTag);
  };

  const deleteTag = (idx: number) => {
    setValue([...value.slice(0, idx), ...value.slice(idx + 1)]);
    setChipsErrors((errors) => [
      ...errors.slice(0, idx),
      ...errors.slice(idx + 1),
    ]);
    setFocusedTag(-1);
  };

  useEffect(() => {
    if (
      focusedTag < -1 ||
      !Number.isInteger(focusedTag) ||
      focusedTag > chipsError.length
    ) {
      setFocusedTag(-1);
    } else {
      moveFocus(focusedTag);
    }
  }, [focusedTag, chipsError.length]);

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
        // Handle tag focus change
        if (focusedTag !== -1 && !['ArrowLeft', 'ArrowRight'].includes(e.key)) {
          setFocusedTag(-1);
        }
        if (e.key === 'ArrowLeft') {
          handleFocusTag('previous');
        }
        if (e.key === 'ArrowRight') {
          handleFocusTag('next');
        }

        // Handle Tag creation
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

        // Handle tag deletion
        if (
          e.key === 'Backspace' &&
          (e.target as HTMLInputElement).value === ''
        ) {
          deleteTag(value.length - 1);
        }
      }}
      ref={ref}
      variant="outlined"
      error={(isTouched || isSubmitted) && invalid}
      helperText={(isTouched || isSubmitted) && invalid ? error?.message : ''}
      required={isRequired}
      label={translate(typeof label === 'string' ? label : source)}
      fullWidth
      sx={{
        maxWidth: '100%',
      }}
      InputProps={{
        ref: anchorRef,
        startAdornment: value.map((val, idx) => {
          const chipLabelString = chipLabel
            ? chipLabel(convertToPropsObject(chipsError[idx])) ?? val
            : val;
          const isLoadingError = idx >= chipsError.length;
          const isError =
            idx < chipsError.length &&
            (chipsError[idx] === true || typeof chipsError[idx] === 'string');
          let tooltipTitle = '';
          if (isError && typeof chipsError[idx] === 'string') {
            tooltipTitle = chipsError[idx] as string;
          } else if (!isError) {
            tooltipTitle = chipLabelString === val ? '' : val;
          }

          return (
            <Tooltip
              key={Math.random()}
              title={translate(tooltipTitle)}
              data-tag-index={idx}
            >
              <Chip
                label={chipLabelString}
                color={isError ? 'error' : undefined}
                variant="outlined"
                icon={<ChipIcon isLoadingError={isLoadingError} isError={isError} />}
                avatar={
                  Avatar && !isLoadingError && !isError ? (
                    <Avatar
                      value={val}
                      {...(convertToPropsObject(chipsError[idx])?.avatar ?? {})}
                    />
                  ) : undefined
                }
                size="small"
                onDelete={() => deleteTag(idx)}
                sx={{
                  mr: 1,
                  mt: 1,
                  mb: 'auto',
                }}
                onClick={() => {
                  if (inputRef.current) {
                    inputRef.current.value = value[idx];
                    deleteTag(idx);
                  }
                }}
                onKeyDown={(e) => {
                  // handle delete
                  if (['Backspace', 'Delete'].includes(e.key)) {
                    deleteTag(idx);
                  }

                  // handle edit
                  if (e.key === 'Enter') {
                    e.stopPropagation();
                    e.preventDefault();
                    if (inputRef.current) {
                      inputRef.current.value = value[idx];
                      deleteTag(idx);
                    }
                  }
                }}
              />
            </Tooltip>
          );
        }),
        sx: {
          display: 'flex',
          flexWrap: 'wrap',
        },
      }}
      inputProps={{
        ref: inputRef,
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
  Avatar: undefined,
  chipLabel: undefined,
};

export type Validator = (
  value: string
) =>
  | boolean
  | string
  | { avatar: Record<string, any> }
  | Promise<boolean | string | { avatar: Record<string, any> }>;

interface ArrayTextInputProps extends AutocompleteArrayInputProps {
  source: string;
  newTagKeys?: string[];
  valuesValidator?: Validator;
  Avatar?: React.ComponentType<
    Partial<AvatarProps> & { value: string } & Record<string, any>
  >;
  chipLabel?: (validationData: Record<string, any>) => string | undefined;
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
