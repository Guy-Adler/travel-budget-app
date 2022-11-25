import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import {
  CreateBase,
  useTranslate,
  Form,
  SaveButton,
} from 'react-admin';
import ArrayTextInput, { Validator } from '@/src/components/ArrayTextInput';

interface CreateDialogProps {
  open: boolean;
  onClose: () => void;
}

const validateEmail: Validator = async (value: string) => new Promise((res) => {
    setTimeout(() => {
      if (!/[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/igm.test(value)) res(false);
      res(true);
    }, 1000);
  });

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
            <ArrayTextInput source="shares" label="Select Emails" newTagKeys={[' ']} valuesValidator={validateEmail} />
            <SaveButton  />
          </Form>
        </CreateBase>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDialog;
