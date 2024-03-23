// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getFirestore} from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "no-clue-backend.firebaseapp.com",
  projectId: "no-clue-backend",
  storageBucket: "no-clue-backend.appspot.com",
  messagingSenderId: "930271914381",
  appId: "1:930271914381:web:a7fabe7ea1cd665364f5c4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);