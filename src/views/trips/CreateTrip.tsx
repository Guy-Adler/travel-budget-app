import React, { useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import CreateIcon from '@mui/icons-material/Create';
import {
  CreateBase,
  useTranslate,
  Form,
  SaveButton,
  TextInput,
  required,
  useNotify,
} from 'react-admin';
import { Value as SharesValue } from '@/components/base/ArrayTextInput';
import SelectInputNotNull from '@/components/base/SelectInputNotNull';
import client from '@/providers/client';
import type { Schema, UUID } from '@/types/schema';
import ShareInput from '@/components/ShareInput';

interface CreateDialogProps {
  open: boolean;
  onClose: () => void;
}

interface FormData {
  shares: SharesValue;
  name: string;
  canEdit: number;
}

const CreateDialog: React.FC<CreateDialogProps> = ({ open, onClose }) => {
  const translate = useTranslate();
  const notify = useNotify();

  const shareTo = useRef<string[]>([]);
  const canEditValue = useRef<boolean>(false);

  const removeOutsideDataAndResubmit = (data: FormData) => {
    const { shares, canEdit, ...rest } = data;
    shareTo.current = [...shares.values()].map(
      (val) => val.data?.value as string
    );
    canEditValue.current = canEdit === 1;
    return rest;
  };

  const onSuccess = async (data: Schema['trips']) => {
    await client.from<Schema['shares']>('shares').insert(
      shareTo.current.map((uid) => ({
        trip_id: data.id,
        user_id: uid as UUID,
        can_edit: canEditValue.current,
      }))
    );
    notify('shares.messages.success', {
      type: 'success',
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        {translate('ra.action.create_item', { item: 'Trip' })}
      </DialogTitle>
      <DialogContent>
        <CreateBase
          redirect={false}
          transform={removeOutsideDataAndResubmit}
          mutationOptions={{ onSuccess, onSettled: onClose }}
        >
          <Form>
            <TextInput
              source="name"
              label="resources.trips.trip_name"
              validate={required()}
              fullWidth
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} sx={{}}>
              <ShareInput />
              <SelectInputNotNull
                source="canEdit"
                defaultValue={0}
                choices={[
                  {
                    value: 0,
                    render: (
                      <Stack direction="row" alignItems="center">
                        <VisibilityIcon
                          sx={{ mr: 1, color: 'rgba(0, 0, 0, 0.54)' }}
                        />
                        <ListItemText>
                          {translate('shares.permissions.viewer')}
                        </ListItemText>
                      </Stack>
                    ),
                  },
                  {
                    value: 1,
                    render: (
                      <Stack direction="row" alignItems="center">
                        <CreateIcon
                          sx={{ mr: 1, color: 'rgba(0, 0, 0, 0.54)' }}
                        />
                        <ListItemText>
                          {translate('shares.permissions.editor')}
                        </ListItemText>
                      </Stack>
                    ),
                  },
                ]}
              />
            </Stack>
            <SaveButton />
          </Form>
        </CreateBase>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDialog;
