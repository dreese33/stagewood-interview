import firebase from 'firebase/app';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "stagewood-interview.firebaseapp.com",
    projectId: "stagewood-interview",
    storageBucket: "stagewood-interview.appspot.com",
    messagingSenderId: process.env.FIREBASE_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
  };

  firebase.initializeApp(firebaseConfig);

  const storage = firebase.storage();
  export { storage, firebase as default };