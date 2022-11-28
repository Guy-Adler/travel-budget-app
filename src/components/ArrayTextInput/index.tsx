import React, { useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import { useInput, useTranslate } from 'react-admin';
import useEffectAfterMount from '@/src/hooks/useEffectAfterMount';
import IndexedMap from './IndexedMap';
import Chip from './Chip';
import type {
  AddValueEvent,
  ArrayTextInputProps,
  ArrayTextUseInputValue,
  LoadedValues,
  Validator,
  Value,
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
    setValue(
      new IndexedMap(previousValue).set(val, {
        loading: true,
        error: null,
        data: null,
      })
    );
    e.target.value = ''; // remove current value from the input itself (clear it)
    return val;
  }
  return undefined;
};

const handleValidation = async (
  newValue: ReturnType<
    ArrayTextUseInputValue['field']['value']['getKeyByIndex']
  >,
  setValue: (newValue: ArrayTextUseInputValue['field']['value']) => void,
  previousValue: ArrayTextUseInputValue['field']['value'],
  valuesValidator: Validator
) => {
  if (newValue === undefined) return undefined;
  const validation = await valuesValidator(newValue);
  const isError = validation === true || typeof validation === 'string';
  const data: LoadedValues['data'] = isError
    ? null
    : {
        value: validation === false ? newValue : validation.value,
        meta: {
          avatar: validation === false ? undefined : validation.avatar,
        },
      };
  const error = isError ? validation : null;

  const newValues = new IndexedMap(previousValue);
  // @ts-ignore The compiler is wrong here. `data` and `error` can't both be null or not null ((data === null) ^ (error === null) is always true.)
  newValues.set(newValue, {
    error,
    data,
    loading: false,
  });
  setValue(newValues);
  return newValues;
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
}: ArrayTextInputProps) => {
  const translate = useTranslate();
  const [focusedTag, setFocusedTag] = useState(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

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
    validate: [
      (val: Value) => {
        const v = [...val.values()].find(
          (el) => el.loading || el.error !== null
        );
        if (v === undefined) return undefined;
        if (v.loading === true) return translate('inputs.array_text_input.errors.values_loading');
        return translate('inputs.array_text_input.errors.errors');
      },
      ...(validate === undefined
        ? []
        : [validate].filter((val) => val !== undefined).flat()),
    ],
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
    const newValues = new IndexedMap(value);
    newValues.delete(displayValue);
    setValue(newValues);

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
      focusedTag > value.size
    ) {
      setFocusedTag(-1);
    } else {
      moveFocus(focusedTag);
    }
  }, [focusedTag, value.size]);

  return (
    <TextField
      name={name}
      onBlur={async (e) => {
        const previousValue = value;
        const newValue = addValue(e, setValue, value);
        await handleValidation(
          newValue,
          setValue,
          previousValue,
          valuesValidator
        );
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
          const previousValue = value;
          const newValue = addValue(
            e as unknown as AddValueEvent,
            setValue,
            value
          );
          await handleValidation(
            newValue,
            setValue,
            previousValue,
            valuesValidator
          );
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
            const isLoadingError = val.loading;
            const isError = val.error !== null;
            const chipLabelString = chipLabel
              ? chipLabel(
                  convertToPropsObject(isError ? val.error : val.data ?? false)
                ) ?? renderValue
              : renderValue;
            let tooltipTitle = '';
            if (isError && typeof val.error === 'string') {
              tooltipTitle = val.error;
            } else if (!isError) {
              tooltipTitle = chipLabelString === renderValue ? '' : renderValue;
            }

            return (
              <Chip
                key={Math.random()}
                Avatar={Avatar}
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
};

export type {
  AddValueEvent,
  ArrayTextInputProps,
  ArrayTextUseInputValue,
  Validator,
  Value,
};
