import React from 'react';
import { Route } from 'react-router-dom';
import { createTheme } from '@mui/material/styles';
import {
  Admin,
  Resource,
  CustomRoutes,
  ListGuesser,
  defaultTheme,
} from 'react-admin';
import useTitle from '@/hooks/useTitle';
import { supabaseAuthProvider } from '@/providers/auth';
import { supabaseDataProvider, ResourcesOptions } from '@/providers/data';
import i18nProvider from '@/providers/i18n';
import LogIn from '@/views/auth/LogIn';
import Profile from '@/views/profile';
import { TripList, TripShow } from '@/views/trips';
import Layout from '@/src/layout';

const resources: ResourcesOptions = {
  profiles: [
    'id',
    'email',
    'first_name',
    'last_name',
    'avatar_url',
    'can_be_shared',
  ],
  trips: {
    view: 'trips_view',
    fields: [
      'id',
      'created_at',
      'owner',
      'updated_at',
      'updated_by',
      'trip_name',
      'owner_first_name',
      'owner_last_name',
      'owner_avatar_url',
      'updated_by_first_name',
      'updated_by_last_name',
      'updated_by_avatar_url',
      'is_owner',
      'can_edit',
    ],
    fullTextSearchFields: ['trip_name'],
  },
  shares: ['id', 'trip_id', 'user_id', 'can_edit'],
  expenses: [
    'id',
    'trip_id',
    'created_at',
    'updated_at',
    'updated_by',
    'expense_name',
    'amount',
    'currency',
    'purchase_date',
    'category',
  ],
};

const theme = createTheme({
  ...defaultTheme,
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'outlined' as const,
        margin: 'dense' as const,
        size: 'small' as const,
      },
    },
    MuiFormControl: {
      defaultProps: {
        variant: 'outlined' as const,
        margin: 'dense' as const,
        size: 'small' as const,
      },
    },
  },
});

const App = () => {
  useTitle('Travel Budget App', false);
  return (
    <Admin
      title=""
      layout={Layout}
      loginPage={LogIn}
      authProvider={supabaseAuthProvider}
      dataProvider={supabaseDataProvider(resources)}
      requireAuth
      i18nProvider={i18nProvider}
      disableTelemetry
      theme={theme}
    >
      <CustomRoutes>
        <Route path="/profile" element={<Profile />} />
      </CustomRoutes>
      <Resource name="trips" list={TripList} show={TripShow} />
      <Resource name="expenses" list={ListGuesser} />
    </Admin>
  );
};

export default App;
