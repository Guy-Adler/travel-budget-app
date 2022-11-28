/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useTranslate } from 'react-admin';

import ChipMui from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';

import { ChipIcon, convertToPropsObject } from './utils';

import type { ArrayTextInputProps, ArrayTextUseInputValue } from './types';

interface ChipProps {
  Avatar: ArrayTextInputProps['Avatar'];
  chipLabelString: string;
  deleteTag: (idx: string) => void;
  editTag: (idx: string) => void;
  idx: number;
  isError: boolean;
  isLoadingError: boolean;
  tooltipTitle: string;
  val: Exclude<ReturnType<ArrayTextUseInputValue['field']['value']['get']>, undefined>;
  renderValue: Exclude<ReturnType<ArrayTextUseInputValue['field']['value']['getKeyByIndex']>, undefined>;
}

const Chip: React.FC<ChipProps> = ({
  Avatar,
  chipLabelString,
  deleteTag,
  editTag,
  idx,
  isError,
  isLoadingError,
  tooltipTitle,
  val,
  renderValue,
}) => {
  const translate = useTranslate();
  return (
    <Tooltip
      title={!isError ? tooltipTitle : translate(tooltipTitle)}
      data-tag-index={idx}
    >
      <ChipMui
        label={chipLabelString}
        color={isError ? 'error' : undefined}
        variant="outlined"
        icon={
          isLoadingError || isError ? (
            <ChipIcon isLoadingError={isLoadingError} isError={isError} />
          ) : undefined
        }
        avatar={
          Avatar && !isLoadingError && !isError ? (
            <Avatar
              value={val}
              {...(convertToPropsObject((val.data ?? false))?.meta?.avatar ?? {})}
            />
          ) : undefined
        }
        size="small"
        onDelete={() => deleteTag(renderValue)}
        sx={{
          mr: 1,
          mt: 1,
          mb: 'auto',
        }}
        onClick={() => {
          editTag(renderValue);
        }}
        onKeyDown={(e) => {
          // handle delete
          if (['Backspace', 'Delete'].includes(e.key)) {
            deleteTag(renderValue);
          }

          // handle edit
          if (e.key === 'Enter') {
            e.stopPropagation();
            e.preventDefault();
            editTag(renderValue);
          }
        }}
      />
    </Tooltip>
  );
};

export default Chip;
