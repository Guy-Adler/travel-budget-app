/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useTranslate } from 'react-admin';

import ChipMui from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';

import { ChipIcon, convertToPropsObject } from './utils';

import type { ArrayTextInputProps, ArrayTextUseInputValue } from './types';

interface ChipProps {
  Avatar: ArrayTextInputProps['Avatar'];
  chipsError: (string | boolean | { avatar: Record<string, any> })[];
  chipLabelString: string;
  deleteTag: (idx: number) => void;
  editTag: (idx: number) => void;
  idx: number;
  isError: boolean;
  isLoadingError: boolean;
  tooltipTitle: string;
  val: ArrayTextUseInputValue['field']['value'];
}

const Chip: React.FC<ChipProps> = ({
  Avatar,
  chipsError,
  chipLabelString,
  deleteTag,
  editTag,
  idx,
  isError,
  isLoadingError,
  tooltipTitle,
  val,
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
          editTag(idx);
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
            editTag(idx);
          }
        }}
      />
    </Tooltip>
  );
};

export default Chip;
