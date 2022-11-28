/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import ErrorIcon from '@mui/icons-material/Error';
import LoadingIcon from '@mui/icons-material/Sync';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import { keyframes } from '@mui/material/styles';
import type { Validator } from './types';

const spin = keyframes`
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
`;

export const ChipIcon: React.FC<
  SvgIconProps & { isLoadingError: boolean; isError: boolean }
> = ({ isLoadingError, isError, ...props }) => {
  if (isLoadingError) {
    return (
      <LoadingIcon {...props} sx={{ animation: `${spin} 1s infinite ease` }} />
    );
  }
  if (isError) {
    return <ErrorIcon {...props} />;
  }
  return null;
};

export const convertToPropsObject = (
  value: Awaited<ReturnType<Validator>>
): Record<string, any> => {
  if (typeof value === 'string' || typeof value === 'boolean') {
    return {};
  }
  return value;
};
