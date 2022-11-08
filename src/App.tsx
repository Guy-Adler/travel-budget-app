import React from "react";
import { Admin, Resource } from 'react-admin';
import { supabaseAuthProvider } from "./providers/auth";
import LogIn from './views/auth/LogIn';
import Layout from './layout';

const App = () => (
  <Admin layout={Layout} loginPage={LogIn} authProvider={supabaseAuthProvider} requireAuth>
    <Resource name="profiles" />
  </Admin>
);

export default App;
