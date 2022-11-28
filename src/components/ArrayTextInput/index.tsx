import React, { useEffect, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import { useInput, useTranslate } from 'react-admin';
import { useFormContext } from 'react-hook-form';
import useEffectAfterMount from '@/src/hooks/useEffectAfterMount';
import IndexedMap from './IndexedMap';
import Chip from './Chip';
import type {
  AddValueEvent,
  ArrayTextInputProps,
  ArrayTextUseInputValue,
  Validator,
} from './types';
import { convertToPropsObject } from './utils';

const addValue = (
  e: AddValueEvent,
  setValue: (newValue: ArrayTextUseInputValue['field']['value']) => void,
  previousValue: ArrayTextUseInputValue['field']['value']
) => {
  const val = e.target.value;
  // prevent empty tags
  if (val !== '') {
    setValue((new IndexedMap(previousValue)).set(val, {
      loading: true,
      error: null,
      data: null,
    }));
    e.target.value = ''; // remove current value from the input itself (clear it)
    return val;
  }
  return undefined;
};

// const handleValidation = async (
//   setValue: (newValue: ArrayTextUseInputValue['field']['value']) => void,
//   previousValue: ArrayTextUseInputValue['field']['value'],
//   valuesValidator: Validator,
// ) => {
//   const validation = valuesValidator(previousValue)
// };

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
  setParentError,
  ...rest
}: ArrayTextInputProps) => {
  const translate = useTranslate();
  const [chipsError, setChipsErrors] = useState<
    (string | boolean | { avatar: Record<string, any> })[]
  >([]);
  const [focusedTag, setFocusedTag] = useState(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const form = useFormContext();

  const {
    field: { name, onBlur: fieldOnBlur, onChange: setValue, ref, value },
    fieldState: { isTouched, invalid, error },
    formState: { isSubmitted },
    isRequired,
  } = useInput({
    onChange,
    onBlur,
    source,
    defaultValue: [],
    ...rest,
  }) as ArrayTextUseInputValue;

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
        nextTag = value.size - 1;
      }
    } else {
      nextTag += direction === 'next' ? 1 : -1;

      if (nextTag < 0) {
        nextTag = 0;
      }

      if (nextTag === value.size) {
        nextTag = -1;
      }
    }

    setFocusedTag(nextTag);
  };

  const deleteTag = (displayValue: string | undefined) => {
    if (displayValue === undefined) return;
    const idx = value.getIndexByKey(displayValue) as number;
    const newValues = new IndexedMap(value);
    newValues.delete(displayValue);
    setValue(newValues);


    const newErrors = [
      ...chipsError.slice(0, idx),
      ...chipsError.slice(idx + 1),
    ];
    setChipsErrors(newErrors);

    if (
      newErrors.filter((err) => err === true || typeof err === 'string')
        .length > 0
    ) {
      form.setError(`${source}-chipsError`, { type: 'custom' });
    } else {
      form.clearErrors(`${source}-chipsError`);
    }

    setFocusedTag(-1);
  };

  const editTag = (displayValue: string) => {
    if (inputRef.current) {
      inputRef.current.value = displayValue;
      deleteTag(displayValue);
    }
  };

  useEffectAfterMount(() => {
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

  useEffect(() => {
    // HACK there should definitely be a way of doing this without creating 2 sources of truth.
    setParentError?.(chipsError);
  }, [chipsError, setParentError]);

  return (
    <TextField
      name={name}
      onBlur={async (e) => {
        const newValue = addValue(e, setValue, value);
        if (newValue) {
          const newErrors = [...chipsError, await valuesValidator(newValue)];
          setChipsErrors(newErrors);
          if (
            newErrors.filter((err) => err === true || typeof err === 'string')
              .length > 0
          ) {
            form.setError(`${source}-chipsError`, { type: 'custom' });
          } else {
            form.clearErrors(`${source}-chipsError`);
          }
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
            const newErrors = [...chipsError, await valuesValidator(newValue)];
            setChipsErrors(newErrors);
            if (
              newErrors.filter((err) => err === true || typeof err === 'string')
                .length > 0
            ) {
              form.setError(`${source}-chipsError`, { type: 'custom' });
            } else {
              form.clearErrors(`${source}-chipsError`);
            }
          }
        }

        // Handle tag deletion
        if (
          e.key === 'Backspace' &&
          (e.target as HTMLInputElement).value === ''
        ) {
          deleteTag(value.getKeyByIndex(value.size - 1));
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
        startAdornment:
          value.size > 0 &&
          [...value.entries()].map(([renderValue, val], idx) => {
            const chipLabelString = chipLabel
              ? chipLabel(convertToPropsObject(chipsError[idx])) ?? renderValue
              : renderValue;
            const isLoadingError = idx >= chipsError.length;
            const isError =
              idx < chipsError.length &&
              (chipsError[idx] === true || typeof chipsError[idx] === 'string');
            let tooltipTitle = '';
            if (isError && typeof chipsError[idx] === 'string') {
              tooltipTitle = chipsError[idx] as string;
            } else if (!isError) {
              tooltipTitle = chipLabelString === renderValue ? '' : renderValue;
            }

            return (
              <Chip
                key={Math.random()}
                Avatar={Avatar}
                chipsError={chipsError}
                chipLabelString={chipLabelString}
                deleteTag={deleteTag}
                editTag={editTag}
                idx={idx}
                isError={isError}
                isLoadingError={isLoadingError}
                tooltipTitle={tooltipTitle}
                val={val}
                renderValue={renderValue}
              />
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
        onFocus: () => {
          setIsInputFocused(true);
        },
        onBlur: () => {
          setIsInputFocused(false);
        },
      }}
      InputLabelProps={{
        shrink: isInputFocused || value.size > 0,
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
  setParentError: undefined,
};

export type {
  AddValueEvent,
  ArrayTextInputProps,
  ArrayTextUseInputValue,
  Validator,
};
