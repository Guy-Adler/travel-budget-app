import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import {
  CreateBase,
  useTranslate,
  Form,
  CreateButton,
} from 'react-admin';
import ArrayEmailInput from '@/src/components/ArrayEmailInput';

interface CreateDialogProps {
  open: boolean;
  onClose: () => void;
}

const CreateDialog: React.FC<CreateDialogProps> = ({ open, onClose }) => {
  const translate = useTranslate();

  const removeOutsideDataAndResubmit = (data) => ({});

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Create Trip</DialogTitle>
      <DialogContent>
        <CreateBase redirect={false} transform={removeOutsideDataAndResubmit}>
          <Form>
            <ArrayEmailInput source="tmp" label="Select Emails" />
            <CreateButton />
          </Form>
        </CreateBase>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDialog;
