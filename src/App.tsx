import React from 'react';
import { Route } from 'react-router-dom';
import { Admin, Resource, CustomRoutes } from 'react-admin';
import { supabaseAuthProvider } from './providers/auth';
import i18nProvider from './providers/i18n';
import LogIn from './views/auth/LogIn';
import Layout from './layout';
import Profile from './views/profile';

const App = () => (
  <Admin
    title=""
    layout={Layout}
    loginPage={LogIn}
    authProvider={supabaseAuthProvider}
    requireAuth
    i18nProvider={i18nProvider}
    disableTelemetry
  >
    <CustomRoutes>
      <Route path="/profile" element={<Profile />} />
    </CustomRoutes>
    <Resource name="profiles" />
  </Admin>
);

export default App;
