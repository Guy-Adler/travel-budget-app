import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import AvatarMui from '@mui/material/Avatar';
import { CreateBase, useTranslate, Form, SaveButton } from 'react-admin';
import ArrayTextInput, { Validator, ArrayTextInputProps } from '@/src/components/ArrayTextInput';

interface CreateDialogProps {
  open: boolean;
  onClose: () => void;
}

const validateEmail: Validator = async (value: string) =>
  new Promise((res) => {
    setTimeout(() => {
      if (!/[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/gim.test(value)) res(true);
      res(false);
    }, 1000);
  });

const Avatar: ArrayTextInputProps['Avatar'] = ({ value, ...props }) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <AvatarMui {...props}>{value[0]}</AvatarMui>
);

const CreateDialog: React.FC<CreateDialogProps> = ({ open, onClose }) => {
  const translate = useTranslate();

  const removeOutsideDataAndResubmit = (data) => {
    const { shares, ...rest } = data;
    return rest;
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Create Trip</DialogTitle>
      <DialogContent>
        <CreateBase redirect={false} transform={removeOutsideDataAndResubmit}>
          <Form>
            <ArrayTextInput
              source="shares"
              label="Select Emails"
              newTagKeys={[' ']}
              valuesValidator={validateEmail}
              Avatar={Avatar}
            />
            <SaveButton />
          </Form>
        </CreateBase>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDialog;
