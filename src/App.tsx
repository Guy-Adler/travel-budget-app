import * as React from "react";
import { Admin, Resource } from 'react-admin';
import LogIn from './LogIn';

const App = () => (
  <Admin loginPage={LogIn} requireAuth>
  </Admin>
);

export default App;
