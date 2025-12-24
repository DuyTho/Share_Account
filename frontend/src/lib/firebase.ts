// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Thay thế bằng config của bạn lấy từ Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDimjfu0p-8PkWrQ4CbweOeOMivNJUnkhU",
  authDomain: "shareaccount-f912e.firebaseapp.com",
  projectId: "shareaccount-f912e",
  storageBucket: "shareaccount-f912e.firebasestorage.app",
  messagingSenderId: "678014668834",
  appId: "1:678014668834:web:243bd33427e697e45d7a7b",
  measurementId: "G-FH4HGQKZM9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();