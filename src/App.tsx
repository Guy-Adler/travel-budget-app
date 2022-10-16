import * as React from "react";
import firebase from "firebase/compat/app";
import { Admin, Resource, ListGuesser } from 'react-admin';
import {
  FirebaseAuthProvider,
  FirebaseDataProvider,
} from 'react-admin-firebase';
import LogIn from './LogIn';

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "taktzibudget.firebaseapp.com",
  projectId: "taktzibudget",
  storageBucket: "taktzibudget.appspot.com",
  messagingSenderId: "312900357468",
  appId: "1:312900357468:web:0739f1c66fa37d44694599",
  measurementId: "G-8K5R4R3GZT"
};

const firebaseApp = firebase.initializeApp(config);
export const storage = firebase.storage(firebaseApp)
export const auth = firebase.auth();

const options = {
  app: firebaseApp,
  watch: ["trips"],
  associateUsersById: true,
};

const dataProvider = FirebaseDataProvider(config, options);
const authProvider = FirebaseAuthProvider(config, options);

const App = () => (
  <Admin dataProvider={dataProvider} authProvider={authProvider} loginPage={LogIn} requireAuth>
    <Resource name="trips" list={<ListGuesser />} />
  </Admin>
);

export default App;
