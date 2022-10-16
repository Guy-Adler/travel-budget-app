import '../styles/globals.css'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCHtrH3--BE1WTylJswUWo-nXKX2_NSt9s",
//   authDomain: "taktzibudget.firebaseapp.com",
//   projectId: "taktzibudget",
//   storageBucket: "taktzibudget.appspot.com",
//   messagingSenderId: "312900357468",
//   appId: "1:312900357468:web:0739f1c66fa37d44694599",
//   measurementId: "G-8K5R4R3GZT"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);