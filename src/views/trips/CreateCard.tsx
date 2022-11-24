import React from 'react';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Unstable_Grid2';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { useTranslate } from 'react-admin';

const AddCard: React.FC = () => {
  const translate = useTranslate();

  return (
    <Grid
      xs={2}
      sm={8 / 3} // 3 cols
      md={12 / 5} // 5 cols
    >
      <Card sx={{ height: '100%' }}>
        <Button sx={{ height: '100%', width: '100%' }}>
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '100%',
            }}
          >
            <Typography variant="h5" >
              {translate('ra.action.create')}
            </Typography>
            <AddIcon fontSize="large" />
          </CardContent>
        </Button>
      </Card>
    </Grid>
  );
};

export default AddCard;
