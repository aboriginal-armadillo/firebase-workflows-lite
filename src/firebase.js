// src/firebase.js
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyD-Z5em5GqSxtirTtg9jgeTGVxMGNJegGQ",
  authDomain: "fir-workflows-lite-aends.firebaseapp.com",
  projectId: "firebase-workflows-lite-aends",
  storageBucket: "firebase-workflows-lite-aends.appspot.com",
  messagingSenderId: "964366126186",
  appId: "1:964366126186:web:4ca8ce9cac759b21fd8e13"
};

const app = initializeApp(firebaseConfig);

export default app;
