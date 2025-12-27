// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyATs7p7Fiot__5r8dJ8x6plpNaHjeklyMo",
  authDomain: "additi-frontend.firebaseapp.com",
  projectId: "additi-frontend",
  storageBucket: "additi-frontend.firebasestorage.app",
  messagingSenderId: "551875233106",
  appId: "1:551875233106:web:8e6099462a140af2a9a68b",
  measurementId: "G-JSTFKTLYFT"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
