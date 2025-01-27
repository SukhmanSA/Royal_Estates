// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-df452.firebaseapp.com",
  projectId: "mern-estate-df452",
  storageBucket: "mern-estate-df452.firebasestorage.app",
  messagingSenderId: "724086896438",
  appId: "1:724086896438:web:ac0cb746a29a8776006597",
  measurementId: "G-9GKVR8EP2G"
};



// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);