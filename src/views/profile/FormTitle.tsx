import React from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslate } from 'react-admin';

interface FormTitleProps {
  title: string;
  description: string;
}

const FormTitle: React.FC<FormTitleProps> = ({ title, description }) => {
  const translate = useTranslate();
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  return (
    <>
      <Stack paddingBottom="1rem">
        <Typography variant="h5" textAlign={isSmall ? 'center' : undefined}>
          {translate(title)}
        </Typography>
        <Typography variant="body1" textAlign={isSmall ? 'center' : undefined}>
          {translate(description)}
        </Typography>
      </Stack>
      {!isSmall && (
        <Button variant="contained" type="submit" color="primary">
          {translate('ra.action.save')}
        </Button>
      )}
    </>
  );
};

export default FormTitle;
