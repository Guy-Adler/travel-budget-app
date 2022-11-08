import React from 'react';
import { Route } from 'react-router-dom';
import { Admin, Resource, CustomRoutes, ListGuesser } from 'react-admin';
import { supabaseAuthProvider } from './providers/auth';
import { supabaseDataProvider } from './providers/data';
import i18nProvider from './providers/i18n';
import LogIn from './views/auth/LogIn';
import Layout from './layout';
import Profile from './views/profile';

const resources = {
  profiles: ['id', 'email', 'first_name', 'last_name', 'avatar_url'],
  trips: ['id', 'created_at', 'updated_at', 'updated_by', 'owner', 'name'],
  shares: ['id', 'trip_id', 'user_id', 'can_edit'],
  expenses: ['id', 'trip_id', 'created_at', 'updated_at', 'updated_by', 'name', 'amount', 'currency', 'purchase_date', 'category']
};

const App = () => (
  <Admin
    title=""
    layout={Layout}
    loginPage={LogIn}
    authProvider={supabaseAuthProvider}
    dataProvider={supabaseDataProvider(resources)}
    requireAuth
    i18nProvider={i18nProvider}
    disableTelemetry
  >
    <CustomRoutes>
      <Route path="/profile" element={<Profile />} />
    </CustomRoutes>
    <Resource name="profiles" list={ListGuesser} />
    <Resource name="trips" list={ListGuesser} />
    <Resource name="shares" list={ListGuesser} />
    <Resource name="expenses" list={ListGuesser} />
  </Admin>
);

export default App;
