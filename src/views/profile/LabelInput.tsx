import React from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useTranslateLabel } from 'react-admin';

interface LabelInputProps extends React.PropsWithChildren {
  label: string;
  helper?: string;
}

const LabelInput: React.FC<LabelInputProps> = ({ label, helper, children }) => {
  const translate = useTranslateLabel();
  return (
    <Stack direction="row" width="100%" gap="10%" alignItems="baseline">
      <Stack width="20%">
        <Typography variant="h6">{translate({ label })}</Typography>
        <Typography variant="body1">{translate({ label: helper })}</Typography>
      </Stack>
      {children}
    </Stack>
  );
};

LabelInput.defaultProps = {
  helper: '',
};

export default LabelInput;
