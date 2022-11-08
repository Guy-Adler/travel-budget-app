import React from 'react';
import { Admin, Resource } from 'react-admin';
import { supabaseAuthProvider } from './providers/auth';
import i18nProvider from './providers/i18n';
import LogIn from './views/auth/LogIn';
import Layout from './layout';

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
    <Resource name="profiles" />
  </Admin>
);

export default App;
