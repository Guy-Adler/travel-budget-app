import React, { useContext } from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Unstable_Grid2';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { useTranslate } from 'react-admin';
import DialogContext from './DialogContext';

const AddCard: React.FC = () => {
  const translate = useTranslate();
  const dialogState = useContext(DialogContext);

  return (
    <Grid
      xs={4} // 1 column
      sm={4} // 2 cols
      md={12 / 5} // 5 cols
    >
      <Card sx={{ height: '100%' }} elevation={3}>
        <CardActionArea
          sx={{
            height: '100%',
            color: 'primary.main',
            textTransform: 'uppercase',
          }}
          onClick={() => {
            dialogState[1](true);
          }}
        >
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <Typography variant="h5">
              {translate('ra.action.create')}
            </Typography>
            <div
              style={{ height: '100%', display: 'flex', alignItems: 'center' }}
            >
              <AddIcon fontSize="large" />
            </div>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

export default AddCard;
