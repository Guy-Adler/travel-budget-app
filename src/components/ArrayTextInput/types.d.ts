import type { AvatarProps } from '@mui/material/Avatar';
import type {
  AutocompleteArrayInputProps,
  UseInputValue
} from 'react-admin';
import type { ControllerRenderProps } from 'react-hook-form';

export type Validator = (
  value: string
) =>
  | boolean
  | string
  | { avatar: Record<string, any> }
  | Promise<boolean | string | { avatar: Record<string, any> }>;

export interface ArrayTextInputProps extends AutocompleteArrayInputProps {
  source: string;
  newTagKeys?: string[];
  valuesValidator?: Validator;
  Avatar?: React.ComponentType<
    Partial<AvatarProps> & { value: string } & Record<string, any>
  >;
  chipLabel?: (validationData: Record<string, any>) => string | undefined;
  setParentError?: React.Dispatch<
    React.SetStateAction<
      (
        | string
        | boolean
        | {
            avatar: Record<string, any>;
          }
      )[]
    >
  >;
}

export interface ArrayTextUseInputValue extends UseInputValue {
  field: Omit<ControllerRenderProps, 'value'> & {
    value: string[];
  };
}

export type AddValueEvent = React.FocusEvent<
  HTMLInputElement | HTMLTextAreaElement,
  Element
>;