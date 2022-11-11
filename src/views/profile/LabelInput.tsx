import React from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslateLabel } from 'react-admin';

interface LabelInputProps extends React.PropsWithChildren {
  label: string;
  helper?: string;
}

const LabelInput: React.FC<LabelInputProps> = ({ label, helper, children }) => {
  const translate = useTranslateLabel();
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  return (
    <Stack
      direction={isSmall ? 'column' : 'row'}
      sx={{
        width: '100%',
        gap: '10%',
        alignItems: {
          xs: 'streach',
          sm: 'baseline',
        },
      }}
    >
      <Stack
        sx={{
          width: {
            xs: '100%',
            sm: '20%',
          },
        }}
      >
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
