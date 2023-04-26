import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAAf_uTk2ynX9isaFDRIua3ClEpnNDzdmc",
  authDomain: "mra-auth.firebaseapp.com",
  projectId: "mra-auth",
  storageBucket: "mra-auth.appspot.com",
  messagingSenderId: "931943511968",
  appId: "1:931943511968:web:3135b79d0aa364a48c56c5",
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
