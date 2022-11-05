import React from "react";
import { Admin, Resource } from 'react-admin';
import { supabaseAuthProvider } from "./providers/auth";
import LogIn from './LogIn';
import Layout from './Layout';

const App = () => (
  <Admin layout={Layout} loginPage={LogIn} authProvider={supabaseAuthProvider} requireAuth>
    <Resource name="profiles" />
  </Admin>
);

export default App;
